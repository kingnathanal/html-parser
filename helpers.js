const path = require('path');
const { default: axios } = require('axios');
const { parse } = require('node-html-parser');
const { error } = require('console');
const { rejects } = require('assert');
const dbconn = require(path.join(__dirname,"./database"));

// Begin fetch and html parse of give URL
const parseUrlTags = async (parseUrl) => {
    console.log(`Fetching the URL: ${parseUrl}...`);
    let url = parseUrl;
    let htmldata = await fetchHTMLData(url)
                .then(async (x) => {
                    await cleanUpUrlRecords(url);
                    await parseHTMLData(url,x);
                    return 0;
                })
                .catch((error) => {
                    console.log(error.message);
                });
    return htmldata;
}

// Function that will fetch html data for given url
const fetchHTMLData = async (url) => {
    const x = await axios.get(url)
                        .catch((error) => {
                            console.log(error.message);
                        });
    return x.data;
}

// Function that will HTML parse the given HTML data.
const parseHTMLData = async (url,data) => {
    console.log("Parsing HTML URL data...");
    const parsedHTML = parse(data);
    const elementset = new Set();

    var elements_total = parsedHTML.getElementsByTagName('*').length;
    await dbconn.addUrlTagTotalRecord(url,elements_total);

    var elements = parsedHTML.getElementsByTagName('*').map((x) => x.tagName);
    elements.forEach((x) => { elementset.add(x); });
    elementset.forEach(async (x) => {
        let tag = x;
        let size = parsedHTML.getElementsByTagName(x).length;
        await dbconn.addHtmlTagRecord(url,tag,size);
    });
}

// Function that will clean up any records that may exist by URL
const cleanUpUrlRecords = async (url) => {
    console.log("Cleaning up HTML URL data...");
    await dbconn.deleteUrlTagRecords(url);
    await dbconn.deleteUrlTagTotalRecords(url);
}

module.exports = { parseUrlTags };