const express = require('express');
const apiCalls = require('./api-calls');
const app = express();
const port = 3000;

const chargingPointGroups = '/api/v1/chargingPointGroup';
const chargingPointGroupWithId = id => chargingPointGroups + '/' + id;
const chargingPointWithName = name => '/api/v1/chargingPoint/' + name;
const configuration = name => chargingPointWithName(name) + '/configuration';

apiCalls.post(
    '/api/v1/statistic/transaction/search',
    {
        startDate: ['2018-11-21'],
        endDate: ['2018-11-23'],
     },
     console.log
);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))