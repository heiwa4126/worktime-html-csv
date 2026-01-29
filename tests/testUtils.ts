import { readFileSync } from "node:fs";
import path from "node:path";
import { expect } from "vitest";
import type { WorktimeRow } from "../src/common.js";
export type { WorktimeRow } from "../src/common.js";
export { readFileSync };

// 改行コードを無視して文字列比較するカスタムマッチャー
export function setupLineEndingMatcher() {
	expect.extend({
		toEqualIgnoreLineEndings(received: string, expected: string) {
			const normalize = (str: string) => str.replace(/\r\n|\r|\n/g, "\n").replace(/\n+$/, "");
			const pass = normalize(received) === normalize(expected);
			return {
				pass,
				message: () =>
					pass
						? "改行コードを無視して一致しました。"
						: "改行コード以外に差分があります。\n受信: " +
							normalize(received) +
							"\n期待: " +
							normalize(expected),
			};
		},
	});
}

// CSVを2次元配列に変換
export function parseCsvToArray(csv: string): string[][] {
	return csv
		.trim()
		.split("\n")
		.map((line) => line.split(","));
}

// テストデータのパス
export const htmlPath = path.join(__dirname, "../test_data/test1.html");
export const expectedCsvPath = path.join(__dirname, "../test_data/test1_expected.csv");

// ピボット形式のCSVをWorktimeRow[]に変換する関数
export function parseExpectedCsvToRows(csv: string): WorktimeRow[] {
	const lines = csv.trim().split("\n");
	const header = lines[0]?.split(",") || [];
	// header: ["製造オーダ","工程",日付1,日付2,...]
	const dateCols = header.slice(2);
	const rows: WorktimeRow[] = [];
	for (const line of lines.slice(1)) {
		const cols = line.split(",");
		const order = (cols[0] || "").trim();
		const process = (cols[1] || "").trim();
		for (let i = 0; i < dateCols.length; ++i) {
			rows.push({
				order,
				process,
				date: (dateCols[i] || "").trim(),
				hours: Number((cols[i + 2] || "").trim()),
				orderName: "間接作業時間オーダー", // テストデータより固定
			});
		}
	}
	return rows.filter((r) => r.hours !== 0); // 0時間は除外
}
