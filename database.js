//const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

const addHtmlTagRecord = async (url, tag, tag_count) => {
    let query = "INSERT INTO `html_tags` (`url`,`tag`,`tag_count`) VALUES (?,?,?)";
    let values = [url,tag,tag_count];
    await executeDBQuery(query, values);
}

const addUrlTagTotalRecord = async (url, total) => {
    let query = "INSERT INTO `url_tag_total` (`url`,`tag_total`) VALUES (?,?)";
    let values = [url, total];
    await executeDBQuery(query, values);
}

const deleteUrlTagRecords = async (url) => {
    let query = "DELETE FROM `html_tags` WHERE `url`=?";
    let values = [url];
    await executeDBQuery(query, values);
}

const deleteUrlTagTotalRecords = async (url) => {
    let query = "DELETE FROM `url_tag_total` WHERE `url`=?";
    let values = [url];
    await executeDBQuery(query, values);
}

const getTagInfoRecordsByUrl = async (url) => {
    let query = "SELECT * FROM `html_tags` WHERE `url`=?";
    let values = [url];
    return await executeDBQuery(query, values);
}

const getTagTotalByUrl = async (url) => {
    let query = "SELECT `tag_total` FROM `url_tag_total` WHERE `url`=?";
    let values = [url];
    return await executeDBQuery(query, values);
}

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_name   
})

const executeDBQuery = async (query,values) => {

    const connection = await pool.getConnection();
    
    const [rows, fields] = await connection.execute(query,values);

    connection.release();

    return rows;
}

module.exports = { 
                   addHtmlTagRecord, 
                   addUrlTagTotalRecord, 
                   deleteUrlTagRecords, 
                   deleteUrlTagTotalRecords,
                   getTagInfoRecordsByUrl,
                   getTagTotalByUrl
                };