const express = require('express');
const https = require('https');
const app = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const dbconn = require(path.join(__dirname,"./database"));
const helper = require(path.join(__dirname,"./helpers"));

// enable cors on the nodejs server
app.use(cors({
    origin: "*"
}))

var jsonParser = bodyParser.json();

// route to access webpage for Assignment 2
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"public/index.html"));
 })

// route that will begin parsing tag process by URL
app.post('/url/parse', jsonParser, async function(req, res) {
    let status = await helper.parseUrlTags(req.body.url);
    if(status === undefined) {
        res.status(500).send("Error: Something went wrong!!");
    } else {
        res.sendStatus(200);
    }
})

// route that will begin collecting tag info by URL from database
app.post('/url/taginfo', jsonParser, async function(req, res) {
    console.log("Fetching URL tag info...");
    let results = await dbconn.getTagInfoRecordsByUrl(req.body.url);
    res.status(200).send(results);
})

app.post('/url/tagtotal', jsonParser, async function(req, res) {
    console.log("Fetching URL tag total...");
    let results = await dbconn.getTagTotalByUrl(req.body.url);
    res.status(200).send(results[0]);
})

const httpsServer = https.createServer({
   key: fs.readFileSync(process.env.server_key),
   cert: fs.readFileSync(process.env.server_cert),
}, app);

httpsServer.listen(process.env.port, () => {
   console.log(`HTTPS Server running on port ${process.env.port}`);
});