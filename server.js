const express = require('express');
const apiCalls = require('./api-calls');
const fs = require('fs');
const firebase = require('./firebase-connectivity');
const app = express();
const port = 3000;

const chargingPointGroups = '/api/v1/chargingPointGroup';
const chargingPointGroupWithId = id => chargingPointGroups + '/' + id;
const chargingPointWithName = name => '/api/v1/chargingPoint/' + name;
const configuration = name => chargingPointWithName(name) + '/configuration';

const availableChargingConnections = [];
let chargePointStatuses = [];

apiCalls.get(chargingPointGroups, data => {
    data.forEach(d => availableChargingConnections.push(...d.chargingPoints));
    console.log(availableChargingConnections);
    const connectors = [];
    availableChargingConnections.forEach(cp => connectors.push(...cp.connectors))
    console.log(connectors);
    chargePointStatuses = connectors.map(connector => ({ 
        connector: connector.chargingPointIdentifier + '#' + connector.connectorId, 
        status: connector.status,
        power: connector.status === 'Charging' ? Math.random() * 5 : 0,
        chargedRatio: connector.status === 'Charging' ? Math.random() : 0
    }));
});

//app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('static'));
app.get('/api/statuses', (req, res) => {
    res.send(chargePointStatuses);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))