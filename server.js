const express = require('express');
const apiCalls = require('./api-calls');
const fs = require('fs');
const app = express();
const port = 3000;

/*const chargingPointGroups = '/api/v1/chargingPointGroup';
const chargingPointGroupWithId = id => chargingPointGroups + '/' + id;
const chargingPointWithName = name => '/api/v1/chargingPoint/' + name;
const configuration = name => chargingPointWithName(name) + '/configuration';
const targetTemperature = 23;
const minTemperature = 20;

let availableChargingConnections = [];
let chargePointStatuses = [];
let powerStatus = {
    maxLoad: 100,
    baseLoad: 20,
    heatingLoad: 30,
    evLoad: 20
};
let heatingDevices = [
    {
        id: 'house1',
        load: 10,
        temperature: 20,
        status: 'active'
    },
    {
        id: 'house2',
        load: 0,
        temperature: 24,
        status: 'inactive'
    }
]

setInterval(updateData, 5000);

function updateData() {
    apiCalls.get(chargingPointGroups, data => {
        availableChargingConnections = [];
        data.forEach(d => availableChargingConnections.push(...d.chargingPoints));
        //console.log(availableChargingConnections);
        const connectors = [];
        availableChargingConnections.forEach(cp => connectors.push(...cp.connectors))
        //console.log(connectors);
        chargePointStatuses = connectors.map(connector => ({
            connector: connector.chargingPointIdentifier + '#' + connector.connectorId,
            status: connector.status,
            power: connector.status === 'Charging' ? Math.random() * 5 : 0,
            chargedRatio: connector.status === 'Charging' ? Math.random() : 0
        }));
        calculatePriorities();
    });
}


function calculatePriorities() {
    heatingDevices.forEach(d => {
        d.priority = 1 - (d.temperature - minTemperature) / (targetTemperature - minTemperature);
    });
    chargePointStatuses.forEach(point => {
        point.priority = point.status === 'Charging' ? 1 - point.chargedRatio : -999
    })
}

//app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('static'));
app.get('/api/connector-status', (req, res) => {
    res.send(chargePointStatuses);
});
app.get('/api/power-status', (req, res) => {
    res.send(powerStatus);
});
app.get('/api/heating-status', (req, res) => {
    res.send(heatingDevices);
});*/

const powerData = {};
let maxLoad = 150;
let time = 0;
let timeProgressSpeed = 100; // millis per 15 minutes
const history = [];

const progressTime = () => {
    time = new Date(time.getTime() + 60000 * 15);
    if (time.getTime() >= powerData.Time.data[powerData.Time.data.length - 1].getTime() - 3600000) {
        time = powerData.Time.data[0];
    }
    calculateNonCompensatedPowerLevel();
    setTimeout(progressTime, timeProgressSpeed);
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
    const idx = powerData.Time.data.findIndex(date => Math.abs(timeWoMinutes.getTime() - date.getTime()) < 1000);
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
        }
    });
};

app.get('/api/measurements', (req, res) => {
    res.send(history[history.length - 1]);
})

app.get('/api/history', (req, res) => {
    res.send(history);
})

app.get('/api/param', (req, res) => {
    if (req.query.maxLoad) {
        maxLoad = Number(req.query.maxLoad);
    }
    if (req.query.speed) {
        timeProgressSpeed = Number(req.query.speed);
    }
    res.send({ maxLoad, timeProgressSpeed });
})

app.get('/api/time', (req, res) => res.send({ time: time.getTime() }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))