const express = require('express');
const https = require('https');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const { parse } = require('node-html-parser');

app.use(cors({
    origin: "*"
}))

dotenv.config();

var jsonParser = bodyParser.json();

app.get('/assignment2', function (req, res) {
    res.sendFile(path.join(__dirname,"public/index.html"));
 })

app.post('/parse', jsonParser, function(req, res) {
    console.log("get request url: ", req.body);
    console.log("get request url.value: ", req.body.url);
    gethtml(req.body.url);
    res.sendStatus(200);
})

app.get('/parse', function(req, res) {
    gethtml("https://www.google.com");
    res.sendStatus(200);
})

const gethtml = (parseUrl) => {
    console.log("About to fetch the URL");
    let url = parseUrl;
    let htmldata = getfetch(url)
                    .then(x => parsethis(x));
    console.log("Done fetching the URL");
}

const getfetch = async (url) => {
    const x = await axios.get(url);
    return x.data;
}

const parsethis = (data) => {
    const parsed = parse(data);
    console.log(parsed);
    console.log(parsed.structure);
}

app.get('/api/sayhello', function (req, res) {
    console.log("Say Hello");
    res.sendStatus(200);
})

const httpsServer = https.createServer({
   key: fs.readFileSync(process.env.server_key),
   cert: fs.readFileSync(process.env.server_cert),
}, app);

const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_name
  });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
console.log('Connected to MySQL as ID ' + db.threadId);
});

httpsServer.listen(process.env.port, () => {
   console.log(`HTTPS Server running on port ${process.env.port}`);
});

const sayHello = () => {
    console.log("Hello Everyone");
}