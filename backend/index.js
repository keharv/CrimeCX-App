const express = require('express');

const http = require('http');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const magic = require('mmmagic');

// const cert = fs.readFileSync('./server.crt');
// const key = fs.readFileSync('./server.key');

// const server = https.createServer({
//     key: key,
//     cert: cert
// }, app);

app.all("/*", function (req, res, next) {

    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials",true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');


    //add to connections.log
    
    const Request = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        ip: req.ip,
        timestamp: new Date().toISOString()
    }
    fs.appendFileSync('connections.log', JSON.stringify(Request) + '\n');    

    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    //get random list of images from ./images/
    const images = fs.readdirSync('./images/');
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const md5 = require('md5');
    //read in the image
    const image = fs.readFileSync('./images/' + randomImage);
    //check if image is a valid image
    const hash = md5(image);

    res.setHeader('Powered-By', 'KittyPower');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    response_json = {
        "message": "request successful",
        "image": "http://10.247.1.134:3000/images/" + randomImage,
        "filename": randomImage,
        "md5": hash,
    }
    res.send(response_json);
    console.log('get request received from ' + req.ip);
}
);

app.post('/', (req, res) => {

    console.log('post request received from ' + req.ip);
    const reqBody = req.body;
    console.log(reqBody)

    const md5 = require('md5');
    if(!reqBody) {
        res.status(200).send('No request body');
        return;
    }
    if(!reqBody.md5 || reqBody.md5 == null || reqBody.md5 == undefined) {
        res.status(400).send('md5 is required');
        return;
    }
    if(reqBody.filename == null || reqBody.filename == undefined) {
        res.status(400).send('filename is required');
        return;
    }
    if(reqBody.image == null || reqBody.image == undefined) {
        res.status(400).send('image is required');
        return;
    }

    const reportContent = {
        "md5": reqBody.md5,
        "filename": reqBody.filename,
        "image": reqBody.image,
        "ip": req.ip,
        "timestamp": new Date().toISOString()
    }

    //get current timestamp + 5 random digits
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 90000) + 10000;
    const filename = timestamp + "______" + random;
    //write report to ./reports/
    fs.writeFileSync('./reports/' + filename + '.json', JSON.stringify(reportContent));
    
    response_json = {
        "message": "report received",
        "filename": filename + '.json',
    }
    res.send(response_json);
}
);
//serve i=mages from ./images/
app.use('/images', express.static(__dirname + '/images'));

// listen for requests on port 443
// server.listen(443, () => {
//     console.log('Server is running on port 443');
// }
// );



// listen f
const server = http.createServer(app);
server.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);