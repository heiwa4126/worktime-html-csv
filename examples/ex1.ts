// npm build した後に実行すること

// import { parseWorktimeHtmlToData, toCSVString, toWideArray } from "../dist/parse.js";
import { parseWorktimeHtmlToData, toCSVString, toWideArray } from "@heiwa4126/worktime-html-csv";
import { readFileSync } from "node:fs";

const html = readFileSync("test_data/test1.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));
