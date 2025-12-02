// IIFE/ブラウザ・Node両対応: グローバルglobalThisに公開
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof globalThis !== "undefined") {
	// biome-ignore lint/suspicious/noExplicitAny: globalThis extension for IIFE compatibility
	(globalThis as any).WorktimeHtmlCsv = (globalThis as any).WorktimeHtmlCsv || {};
	// biome-ignore lint/suspicious/noExplicitAny: globalThis extension for IIFE compatibility
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
	let currentDate = ""; // 前回の日付を保持
	for (let i = 1; i < rows.length; ++i) {
		// @ts-expect-error linkedom/TypeScript 5.x workaround
		const cells = Array.from(rows[i].querySelectorAll("td")) as unknown[];
		if (cells.length < headers.length) continue;
		// 日付変換
		const dateRaw =
			(cells[idx("日付")] as { textContent?: string | null })?.textContent?.trim() || "";
		if (dateRaw) {
			// 日付セルに値がある場合、新しい日付として記録
			// @ts-expect-error TypeScript strictNullChecks workaround
			const day = dateRaw.split("(")[0].padStart(2, "0");
			currentDate = `${year}-${month}-${day}`;
		}
		// 日付セルが空の場合は前回の日付を使用
		if (!currentDate) continue; // 最初の日付が見つかるまでスキップ
		const date = currentDate;
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

/**
 * WorktimeRow[] を横持ちCSV形式の2次元配列（string|number）に変換する
 * @param rows WorktimeRow[]
 * @returns (string|number)[][]
 */
export function toWideArray(rows: WorktimeRow[]): (string | number)[][] {
	if (!rows.length) return [];
	// 日付列: WorktimeRow[]に現れる最小日付～最大日付まで全て
	const dateList = rows.map((r) => r.date).sort();
	const minDate = dateList[0];
	const maxDate = dateList[dateList.length - 1];
	if (!minDate || !maxDate) return [];
	function getDateArray(start: string, end: string): string[] {
		const arr: string[] = [];
		// biome-ignore lint/style/useConst: d is mutated via setDate
		let d = new Date(start);
		const endD = new Date(end);
		while (d <= endD) {
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			arr.push(`${y}-${m}-${day}`);
			d.setDate(d.getDate() + 1);
		}
		return arr;
	}
	const dates = getDateArray(minDate, maxDate);
	// ヘッダー: 製造オーダ, 工程, ...日付...
	const headers = ["製造オーダ", "工程", ...dates];
	// 製造オーダ・工程ごとにグループ化
	type Group = { order: string; process: string; [date: string]: string | number };
	const groupMap = new Map<string, Group>();
	for (const row of rows) {
		const key = `${row.order}\t${row.process}`;
		let group = groupMap.get(key);
		if (!group) {
			group = { order: row.order, process: row.process };
			groupMap.set(key, group);
		}
		group[row.date] = row.hours;
	}
	// データ行生成
	function formatHour(val: number): string {
		// 小数点以下が .0 または .5 なら1桁、それ以外は2桁
		if (Number.isInteger(val * 2)) {
			return val.toFixed(1);
		}
		return val.toFixed(2);
	}
	const data: (string | number)[][] = [];
	// 工程順にソート
	const sortedGroups = Array.from(groupMap.values()).sort(
		(a, b) => a.order.localeCompare(b.order) || a.process.localeCompare(b.process),
	);
	for (const g of sortedGroups) {
		const arr: (string | number)[] = [g.order, g.process];
		for (const d of dates) {
			const v = g[d] ?? 0.0;
			if (typeof v === "number") {
				arr.push(formatHour(v));
			} else {
				arr.push(v);
			}
		}
		data.push(arr);
	}
	return [headers, ...data];
}
