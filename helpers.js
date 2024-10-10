const path = require('path');
//const { default: axios } = require('axios');
const { parse } = require('node-html-parser');
const { error } = require('console');
const { rejects } = require('assert');
const dbconn = require(path.join(__dirname,"./database"));
const puppeteer = require('puppeteer');

// Begin fetch and html parse of give URL
const parseUrlTags = async (parseUrl) => {
    console.log(`Fetching the URL: ${parseUrl}...`);
    let url = parseUrl;
    let htmldata = await fetchHTMLDataPuppet(url)
                .then(async (x) => {
                    await cleanUpUrlRecords(url);
                    await parseHTMLData(url,x);
                })
                .catch((error) => {
                    console.log("Error in parseUrlTags:",error.message);
                    throw error;
                });
}

const fetchHTMLDataPuppet = async (url) => {

  const browser = await puppeteer.launch({
    headless: 'shell',
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url);

  const content = await page.content(); // Get the page content as HTML

  await browser.close();

  return content;
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

    dbconn.addHtmlTagRecordBulk(url,elementset,parsedHTML);
}

// Function that will clean up any records that may exist by URL
const cleanUpUrlRecords = async (url) => {
    console.log("Cleaning up HTML URL data...");
    await dbconn.deleteUrlTagRecords(url);
    await dbconn.deleteUrlTagTotalRecords(url);
}

module.exports = { parseUrlTags };