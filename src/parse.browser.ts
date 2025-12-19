/// <reference lib="dom" />

import type { WorktimeRow } from "./common.js";
import {
	extractWorktimeRowGeneric,
	getHeaderIndexesGeneric,
	getHeadersGeneric,
	getYearMonthGeneric,
} from "./common.js";
export { toCSVString, toWideArray } from "./common.js";
export type { WorktimeRow } from "./common.js";

function getValueBrowser(el: Element | null): string {
	return (el as HTMLInputElement | null)?.value || "";
}

function getTableRows(doc: Document): HTMLTableRowElement[] {
	const table = doc.getElementById("Grid1ContainerTbl");
	if (!table) return [];
	return Array.from(table.querySelectorAll("tr"));
}

/**
 * 工数管理HTMLのDocumentから集計用データを抽出（共通ロジック）
 * @param doc HTML Document
 * @returns WorktimeRow[]
 */
export function parseWorktimeDomToData(doc: Document): WorktimeRow[] {
	const { year, month } = getYearMonthGeneric(doc, getValueBrowser);
	const rows = getTableRows(doc);
	if (rows.length < 2 || !rows[0]) return [];
	const headers = getHeadersGeneric(rows[0] as Element);
	const indexes = getHeaderIndexesGeneric(headers);
	const result: WorktimeRow[] = [];
	let currentDate = "";
	for (let i = 1; i < rows.length; ++i) {
		const cells = Array.from(rows[i]?.querySelectorAll("td") || []);
		if (cells.length < headers.length) continue;
		const row = extractWorktimeRowGeneric(cells, indexes, year, month, currentDate);
		if (!row) continue;
		currentDate = row.date;
		result.push(row);
	}
	return result;
}

/**
 * 工数管理HTMLから集計用データを抽出（ブラウザ版・HTML文字列）
 * @param html HTML文字列
 * @returns WorktimeRow[]
 */
export function parseWorktimeHtmlToData(html: string): WorktimeRow[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	return parseWorktimeDomToData(doc);
}
