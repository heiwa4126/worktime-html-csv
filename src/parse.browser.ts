/// <reference lib="dom" />

import type { WorktimeRow } from "./common.js";
import { extractWorktime, getHeaderIndexes, getHeaders, getYearMonth } from "./common.js";
export { toCSVString, toWideArray } from "./common.js";
export type { WorktimeRow } from "./common.js";

function getValueDom(el: Element | null): string {
	return (el as HTMLInputElement | null)?.value || "";
}

function getTableRowsDom(document: Document): HTMLTableRowElement[] {
	const table = document.getElementById("Grid1ContainerTbl");
	if (!table) return [];
	return Array.from(table.querySelectorAll("tr"));
}

/**
 * 工数管理HTMLのDocumentから集計用データを抽出(共通ロジック)
 * @param document HTML Document
 * @returns WorktimeRow[]
 */
export function parseWorktimeDomToData(document: Document): WorktimeRow[] {
	const { year, month } = getYearMonth(document, getValueDom);
	const rows = getTableRowsDom(document);
	if (rows.length < 2 || !rows[0]) return [];
	const headers = getHeaders(rows[0] as Element);
	const indexes = getHeaderIndexes(headers);
	const result: WorktimeRow[] = [];
	let currentDate = "";
	for (let i = 1; i < rows.length; ++i) {
		const cells = Array.from(rows[i]?.querySelectorAll("td") || []);
		if (cells.length < headers.length) continue;
		const row = extractWorktime(cells, indexes, year, month, currentDate);
		if (!row) continue;
		currentDate = row.date;
		result.push(row);
	}
	return result;
}

/**
 * DOM版。指定されたHTML文字列から勤務時間データを抽出し、`WorktimeRow`の配列として返す
 * @param html - 勤務時間データを含むHTML文字列
 * @returns 抽出された勤務時間データの配列。テーブルが見つからない場合やデータが無い場合は空配列を返す
 */
export function parseWorktimeHtmlToData(html: string): WorktimeRow[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	return parseWorktimeDomToData(doc);
}
