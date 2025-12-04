// npm build した後に実行すること

import { readFileSync } from "node:fs";
import { parseWorktimeHtmlToData, toWideArray, toCSVString } from "../dist/parse.js";

const html = readFileSync("test_data/test1.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));
