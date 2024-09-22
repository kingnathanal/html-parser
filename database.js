const mysql = require('mysql2');
const dotenv = require('dotenv').config();

const addHtmlTagRecord = (url, tag, tag_count) => {
    let query = "INSERT INTO `html_tags` (`url`,`tag`,`tag_count`) VALUES (?,?,?)";
    let values = [url,tag,tag_count];
    executeDBQuery(query, values);
}

const addUrlTagTotalRecord = (url, total) => {
    let query = "INSERT INTO `url_tag_total` (`url`,`tag_total`) VALUES (?,?)";
    let values = [url, total];
    executeDBQuery(query, values);
}

const deleteUrlTagRecords = (url) => {
    let query = "DELETE FROM `html_tags` WHERE `url`=?";
    let values = [url];
    executeDBQuery(query, values);
}

const deleteUrlTagTotalRecords = (url) => {
    let query = "DELETE FROM `url_tag_total` WHERE `url`=?";
    let values = [url];
    executeDBQuery(query, values);
}

const getRecordsBySite = (url) => {
    let query = "SELECT * FROM `html_tags` WHERE `url`=?";
    let values = [url];
    executeDBQuery(query, values);
}

const executeDBQuery = (query,values) => {
    try {
        var {result, fields} = db.execute(query,values);
        //console.log(result);
        //console.log(fields);
    } catch (err) {
        console.log(err);
    }
}

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

module.exports = { addHtmlTagRecord, 
                   addUrlTagTotalRecord, 
                   deleteUrlTagRecords, 
                   deleteUrlTagTotalRecords,
                   getRecordsBySite
                };