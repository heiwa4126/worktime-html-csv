// npm build した後に実行すること
// Browser version smoke test using happy-dom
// This can be run in Node.js environment with DOM polyfill

// ブラウザ版ライブラリをインポート
const {
	parseWorktimeHtmlToData,
	toWideArray,
	toCSVString,
} = require("@heiwa4126/worktime-html-csv/browser");
const { readFileSync } = require("node:fs");
const { Window } = require("happy-dom");

// happy-domでDOM環境を作成
const window = new Window();
global.DOMParser = window.DOMParser;
global.Document = window.Document;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;

const html = readFileSync("test_data/test1.html", "utf8");

const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));

window.close(); // クリーンアップ
