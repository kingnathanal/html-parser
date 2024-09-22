const path = require('path');
const { default: axios } = require('axios');
const { parse } = require('node-html-parser');
const { error } = require('console');
const { rejects } = require('assert');
const { errorMonitor } = require('events');
var dbconn = require(path.join(__dirname,"./database"));

// Begin fetch and html parse of give URL
const parseUrlTags = (parseUrl) => {
    console.log(`Fetching the URL: ${parseUrl}...`);
    let url = parseUrl;
    let htmldata = fetchHTMLData(url)
                .then(x => {
                    cleanUpUrlRecords(url);
                    parseHTMLData(url,x);
                });
}

// Function that will fetch html data for given url
const fetchHTMLData = async (url) => {
    const x = await axios.get(url);
    return x.data;
}

// Function that will HTML parse the given HTML data.
const parseHTMLData = (url,data) => {
    console.log("Parsing HTML URL data...");
    const parsedHTML = parse(data);
    const elementset = new Set();

    var elements_total = parsedHTML.getElementsByTagName('*').length;
    dbconn.addUrlTagTotalRecord(url,elements_total);

    var elements = parsedHTML.getElementsByTagName('*').map((x) => x.tagName);
    elements.forEach((x) => { elementset.add(x); });
    elementset.forEach((x) => {
        let tag = x;
        let size = parsedHTML.getElementsByTagName(x).length;
        dbconn.addHtmlTagRecord(url,tag,size);
    });
}

// Function that will clean up any records that may exist by URL
const cleanUpUrlRecords = (url) => {
    console.log("Cleaning up HTML URL data...");
    dbconn.deleteUrlTagRecords(url);
    dbconn.deleteUrlTagTotalRecords(url);
}

module.exports = { parseUrlTags };