// npm build した後に実行すること
// dist/parse.browser.global.js (IIFE, window.WorktimeHtmlCsv) のsmoke test
// Node.js + happy-dom でグローバルバンドルの動作確認
// IIFEにはパッケージの観念がないので、直接jsファイルを読み込んで実行する
// またこれだけビルドしないとテストできない

const { readFileSync } = require("node:fs");
const { Window } = require("happy-dom");

// happy-domでDOM環境を作成
const window = new Window();
global.window = window;
global.DOMParser = window.DOMParser;
global.Document = window.Document;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;

// dist/parse.browser.global.js を読み込んでグローバルにWorktimeHtmlCsvを登録
const path = require("node:path");
const vm = require("node:vm");
const code = readFileSync(path.join(__dirname, "../dist/parse.browser.global.js"), "utf8");
vm.runInContext(code, vm.createContext(global));

const html = readFileSync(path.join(__dirname, "../test_data/test1.html"), "utf8");

const { parseWorktimeHtmlToData, toWideArray, toCSVString } = global.WorktimeHtmlCsv;
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));

window.close(); // クリーンアップ
