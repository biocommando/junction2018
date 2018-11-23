
const https = require('https');
const userAndPassword = process.env.JUNCTION2018CREDENTIALS;

const authHeader = {'Authorization': 'Basic ' + Buffer.from(userAndPassword).toString('base64')};

const get = (endpoint, callback) => {
    const options = {
        host: 'junctionev.enstoflow.com',
        path: endpoint,
        headers: {
           ...authHeader
        }   
     };

     https.get(options, (resp) => {
       let data = '';
     
       resp.on('data', (chunk) => {
         data += chunk;
       });
     
       resp.on('end', () => {
         callback(JSON.parse(data));
       });
     
     }).on("error", (err) => {
       console.log("Error: " + err.message);
     });
};

const post = (endpoint, data, callback) => {
    const postData = JSON.stringify(data);
    
    const postOptions = {
        host: 'junctionev.enstoflow.com',
        path: endpoint,
        method: 'POST',
        headers: {
           ...authHeader,
           'Content-Type': 'application/json',
           'Content-Length': postData.length
        }   
     };
     const req = https.request(postOptions, (resp) => {
       let data = '';
     
       resp.on('data', (chunk) => {
         data += chunk;
       });
     
       resp.on('end', () => {
         callback(JSON.parse(data));
       });
     
     });
     req.on("error", (err) => {
       console.log("Error: " + err.message);
     });
     req.write(postData);
     req.end();
}


module.exports = {
    get, post
}
