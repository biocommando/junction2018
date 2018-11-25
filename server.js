const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;

const powerData = {};
let maxLoad = 150;
let time = 0;
let timeProgressSpeed = 1500; // millis per 15 minutes
const ffDate = process.argv.find(arg => arg.indexOf('fastforwardto=') === 0);
const fastForwardTo = ffDate ? new Date(ffDate.split('=')[1].replace('_', ' ')) : new Date(0);
const enableFastForward = !!ffDate;
if (enableFastForward) {
    console.log(`Fastforward enabled. Fastforwarding to ${fastForwardTo}.`);
}
const hoursOfData = 6;
let history = [];

const progressTime = () => {
    if (enableFastForward) {
        const realTime = time.getTime() > fastForwardTo.getTime();
        time = new Date(time.getTime() + (realTime ? 1000 : 60000 * 15));
    } else {
        time = new Date(time.getTime() + 60000 * 15);
    }
    if (time.getTime() >= powerData.Time.data[powerData.Time.data.length - 1].getTime() - 3600000) {
        time = powerData.Time.data[0];
        history = [];
    }
    if (enableFastForward) {
        calculateNonCompensatedPowerLevel();
        const realTime = time.getTime() > fastForwardTo.getTime();
        if (realTime) {
            setTimeout(progressTime, 1000);
        } else {
            setTimeout(progressTime, 1);
        }
    } else {
        calculateNonCompensatedPowerLevel();
        setTimeout(progressTime, timeProgressSpeed);
    }
};


fs.readFile('Junction power.csv', (err, data) => {
    const lines = (data + '').split(/[\r\n]+/);
    const headers = [];
    lines[0].split(',').forEach(key => {
        let theUnit;
        const dataName = key.replace(/ \[(.+)\]/, (s, unit) => {
            theUnit = unit;
            return '';
        });
        headers.push(dataName);
        powerData[dataName] = {
            data: []
        }
        if (theUnit) {
            powerData[dataName].unit = theUnit;
        }
    });
    lines.forEach((line, i) => {
        if (i === 0) return;
        line.split(',').forEach((col, i) => {
            if (i === 0) {
                col = new Date(col);
            } else if (powerData[headers[i]].unit) {
                col = Number(col);
            }
            powerData[headers[i]].data.push(col);
        });
    });
    time = powerData.Time.data[0];
    progressTime();
});

const calculateNonCompensatedPowerLevel = () => {
    const minutes = time.getMinutes();
    const timeWoMinutes = new Date(time.getTime() - 60000 * minutes);
    const idx = powerData.Time.data.findIndex(date => Math.abs(timeWoMinutes.getTime() - date.getTime()) < 1000 * 60);
    //const interpolationRatio = minutes / 60;

    const hdemands = [];
    Object.keys(powerData).forEach(key => {
        if (key.indexOf('heat demand') > -1) {
            hdemands.push(powerData[key].data[idx] * (1 - minutes / 60) + powerData[key].data[idx + 1] * (minutes / 60));
        }
    });
    const edemands = [];
    Object.keys(powerData).forEach(key => {
        if (key.indexOf('electricity demand') > -1) {
            edemands.push(powerData[key].data[idx] * (1 - minutes / 60) + powerData[key].data[idx + 1] * (minutes / 60));
        }
    });
    const evs = [];
    Object.keys(powerData).forEach(key => {
        if (key.indexOf('charger') > -1) {
            evs.push(powerData[key].data[idx]);
        }
    });
    let hload = hdemands.reduce((a, b) => a + b);
    let eload = edemands.reduce((a, b) => a + b);
    let evload = evs.reduce((a, b) => a + b);
    let hreduction = 0;
    let evreduction = 0;

    let wholeLoad = hload + eload + evload;
    if (wholeLoad > maxLoad) {
        hreduction = Math.min(hload, wholeLoad - maxLoad);
        hload -= hreduction;
    }
    wholeLoad = hload + eload + evload;
    if (wholeLoad > maxLoad) {
        evreduction = Math.min(evload, wholeLoad - evload);
        evload -= evreduction;
    }
    history.push({
        time,
        heat: hload,
        appliances: eload,
        ev: evload,
        balancingData: {
            heat: hreduction,
            ev: evreduction
        },
        free: maxLoad - wholeLoad
    });
    history = history.filter(historyEntry => historyEntry.time.getTime() > time.getTime() - hoursOfData * 60 * 60 * 1000);
};

const setCorsHdrs = res => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
};

app.get('/api/measurements', (req, res) => {
    setCorsHdrs(res);
    res.send(history[history.length - 1]);
})

app.get('/api/history', (req, res) => {
    setCorsHdrs(res);
    res.send(history);
})

app.get('/api/param', (req, res) => {
    setCorsHdrs(res);
    if (req.query.maxLoad) {
        maxLoad = Number(req.query.maxLoad);
    }
    if (req.query.speed) {
        timeProgressSpeed = Number(req.query.speed);
    }
    res.send({ maxLoad, timeProgressSpeed });
})

app.get('/api/time', (req, res) => {
    setCorsHdrs(res);
    res.send({ time: time.getTime() })
});

app.use(express.static('static'));
app.listen(port, () => console.log(`PEAKachu server running on port ${port}!`));
