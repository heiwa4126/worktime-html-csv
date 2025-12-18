// npm build した後に実行すること

// const { parseWorktimeHtmlToData, toWideArray, toCSVString } = require("../dist/parse.cjs");
const {
	parseWorktimeHtmlToData,
	toWideArray,
	toCSVString,
} = require("@heiwa4126/worktime-html-csv");
const { readFileSync } = require("node:fs");

const html = readFileSync("test_data/test1.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));
