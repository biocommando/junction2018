const express = require('express');
const app = express();
const https = require('https');
const port = 3000;
const userAndPassword = process.env.JUNCTION2018CREDENTIALS;
const options = {
    host: 'junctionev.enstoflow.com',
    //port: 443,
    path: '/api/v1/chargingPointGroup',
    // authentication headers
    headers: {
       'Authorization': 'Basic ' + Buffer.from(userAndPassword).toString('base64')
    }   
 };
https.get(options, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))