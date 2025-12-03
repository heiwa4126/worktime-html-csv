// Browser version smoke test using happy-dom
// This can be run in Node.js environment with DOM polyfill

import { Window } from "happy-dom";
import { readFileSync } from "node:fs";

// happy-domでDOM環境を作成
const window = new Window();
global.DOMParser = window.DOMParser;
global.Document = window.Document;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;

// ブラウザ版ライブラリをインポート
const { parseWorktimeHtmlToData, toWideArray } = await import("../dist/parse.browser.js");

console.log("Testing browser version with happy-dom...\n");

// テストHTMLを読み込み
const html = readFileSync("test_data/test1.html", "utf8");

// パース実行
const rows = parseWorktimeHtmlToData(html);
console.log(`✅ Parsed ${rows.length} rows`);

// ワイド配列に変換
const wideArray = toWideArray(rows);
console.log(`✅ Generated wide array: ${wideArray.length} rows x ${wideArray[0]?.length} columns`);

// 基本的な検証
if (rows.length === 0) {
	console.error("❌ Failed: No rows parsed");
	process.exit(1);
}

if (!wideArray[0]?.includes("製造オーダ")) {
	console.error("❌ Failed: Invalid wide array headers");
	process.exit(1);
}

// 最初の数行を表示
console.log("\nFirst row (headers):");
console.log(`${wideArray[0].slice(0, 5).join(", ")}...`);

console.log("\n✅ Browser version smoke test passed!");

// クリーンアップ
window.close();
