const express = require('express');
const https = require('https');
const app = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
var dbconn = require(path.join(__dirname,"./database"));
const helper = require(path.join(__dirname,"./helpers"));

// enable cors on the nodejs server
app.use(cors({
    origin: "*"
}))

var jsonParser = bodyParser.json();

// route to access webpage for Assignment 2
app.get('/assignment2', function (req, res) {
    res.sendFile(path.join(__dirname,"public/index.html"));
 })

// route that will begin parsing tag process by URL
app.post('/url/parse', jsonParser, function(req, res) {
    helper.parseUrlTags(req.body.url);
    res.sendStatus(200);
})

// route that will begin collecting tag info by URL from database
app.post('/url/taginfo', jsonParser, function(req, res) {
    res.sendStatus(200);
})

const httpsServer = https.createServer({
   key: fs.readFileSync(process.env.server_key),
   cert: fs.readFileSync(process.env.server_cert),
}, app);

httpsServer.listen(process.env.port, () => {
   console.log(`HTTPS Server running on port ${process.env.port}`);
});