// IIFE/ブラウザ・Node両対応: グローバルglobalThisに公開
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof globalThis !== "undefined") {
	(globalThis as any).WorktimeHtmlCsv = (globalThis as any).WorktimeHtmlCsv || {};
	(globalThis as any).WorktimeHtmlCsv.parseWorktimeHtmlToData = parseWorktimeHtmlToData;
}

// worktime-html-csv/src/parseWorktimeHtmlToData.ts
// HTML工数集計テーブルをlinkedomでパースし、ピボットCSV化に必要な中間データを返す
// 入力: HTML文字列、出力: ピボット集計用データ配列

import { type HTMLInputElement, parseHTML } from "linkedom";

export interface WorktimeRow {
	order: string;
	process: string;
	date: string; // yyyy-mm-dd
	hours: number;
	orderName: string;
}

/**
 * 工数詳細列の時間文字列を時間に変換する
 *
 * @param timeStr - "Xh Ym"という形式の時間文字列。Xは時間の数、Yは分の数です。
 * @returns 時間を表す数値。
 *
 * @example
 * ```ts
 * convertTimeToHour("2h 30m") // => 2.5
 * ```
 */
function convertTimeToHour(timeStr: string): number {
	let totalMinutes = 0;
	for (const part of timeStr.split(" ")) {
		if (part.endsWith("h")) totalMinutes += Number.parseInt(part, 10) * 60;
		else if (part.endsWith("m")) totalMinutes += Number.parseInt(part, 10);
	}
	return totalMinutes / 60;
}

/**
 * 工数管理HTMLから集計用データを抽出
 * @param html HTML文字列
 * @returns WorktimeRow[]
 */
export function parseWorktimeHtmlToData(html: string): WorktimeRow[] {
	const { document } = parseHTML(html);
	// 年月取得
	const year = (document.getElementById("vD_SYORI_Y4") as HTMLInputElement)?.value || "";
	const month = (document.getElementById("vD_SYORI_MM") as HTMLInputElement)?.value || "";
	// テーブル取得
	const table = document.getElementById("Grid1ContainerTbl");
	if (!table) return [];
	// ヘッダ行・データ行取得
	const rows = Array.from(table.querySelectorAll("tr"));
	if (rows.length < 2) return [];
	// @ts-expect-error linkedom/TypeScript 5.x workaround
	const headers = (Array.from(rows[0].querySelectorAll("th,td")) as unknown[]).map(
		(th) => (th as { textContent?: string | null }).textContent?.trim() || "",
	);
	const idx = (name: string) => headers.findIndex((h) => h.includes(name));
	const result: WorktimeRow[] = [];
	for (let i = 1; i < rows.length; ++i) {
		// @ts-expect-error linkedom/TypeScript 5.x workaround
		const cells = Array.from(rows[i].querySelectorAll("td")) as unknown[];
		if (cells.length < headers.length) continue;
		// 日付変換
		const dateRaw =
			(cells[idx("日付")] as { textContent?: string | null })?.textContent?.trim() || "";
		// @ts-expect-error TypeScript strictNullChecks workaround
		const day = dateRaw ? dateRaw.split("(")[0].padStart(2, "0") : "00";
		const date = `${year}-${month}-${day}`;
		// 工数詳細→時間（ヘッダ名「工数詳細」または「工数」を許容）
		const timeCol = idx("工数詳細") !== -1 ? idx("工数詳細") : idx("工数");
		const timeStr = (cells[timeCol] as { textContent?: string | null })?.textContent?.trim() || "";
		const hours = convertTimeToHour(timeStr);
		result.push({
			order:
				(cells[idx("製造オーダ")] as { textContent?: string | null })?.textContent?.trim() || "",
			process: (cells[idx("工程")] as { textContent?: string | null })?.textContent?.trim() || "",
			date,
			hours,
			orderName:
				(cells[idx("製造オーダ名")] as { textContent?: string | null })?.textContent?.trim() || "",
		});
	}
	return result;
}

