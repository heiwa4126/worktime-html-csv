import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseWorktimeHtmlToData, toWideArray } from "../src/parseWorktimeHtmlToData.js";

// CSVを2次元配列に変換
function parseCsvToArray(csv: string): string[][] {
	return csv
		.trim()
		.split("\n")
		.map((line) => line.split(","));
}

// テストデータのパス
const htmlPath = path.join(__dirname, "../test_data/test1.html");
const expectedCsvPath = path.join(__dirname, "../test_data/test1_expected.csv");

// ピボット形式のCSVをWorktimeRow[]に変換する関数
function parseExpectedCsvToRows(csv: string) {
	const lines = csv.trim().split("\n");
	const header = lines[0].split(",");
	// header: ["製造オーダ","工程",日付1,日付2,...]
	const dateCols = header.slice(2);
	const rows = [];
	for (const line of lines.slice(1)) {
		const cols = line.split(",");
		const order = cols[0];
		const process = cols[1];
		for (let i = 0; i < dateCols.length; ++i) {
			rows.push({
				order,
				process,
				date: dateCols[i],
				hours: Number(cols[i + 2]),
				orderName: "間接作業時間オーダー", // テストデータより固定
			});
		}
	}
	return rows.filter((r) => r.hours !== 0); // 0時間は除外（実データに合わせる場合）
}

describe("parseWorktimeHtmlToData", () => {
	it("test1.html → test1_expected.csv相当のデータを返す", () => {
		const html = readFileSync(htmlPath, "utf8");
		const expectedCsv = readFileSync(expectedCsvPath, "utf8");
		const expected = parseExpectedCsvToRows(expectedCsv);
		const actual = parseWorktimeHtmlToData(html).filter((r) => r.hours !== 0);
		expect(actual).toEqual(expected);
	});
	it("toWideArray() で test1_expected.csv 配列と一致する", () => {
		const html = readFileSync(htmlPath, "utf8");
		const expectedCsv = readFileSync(expectedCsvPath, "utf8");
		const rows = parseWorktimeHtmlToData(html);
		const wide = toWideArray(rows);
		const expectedArr = parseCsvToArray(expectedCsv);
		// すべて文字列化して比較
		expect(wide.map((r) => r.map(String))).toEqual(expectedArr);
	});
});
