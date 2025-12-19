import { type HTMLInputElement, parseHTML } from "linkedom";
import {
	extractWorktimeRowGeneric,
	getHeaderIndexesGeneric,
	getHeadersGeneric,
	getYearMonthGeneric,
	toCSVString,
	toWideArray,
	type WorktimeRow,
} from "./common.js";

export { toCSVString, toWideArray };
export type { WorktimeRow };

function getValueNode(el: Element | null): string {
	return (el as unknown as HTMLInputElement | null)?.value || "";
}

export function parseWorktimeHtmlToData(html: string): WorktimeRow[] {
	const { document } = parseHTML(html);
	const { year, month } = getYearMonthGeneric(document, getValueNode);
	const table = document.getElementById("Grid1ContainerTbl");
	if (!table) return [];
	const rows = Array.from(table.querySelectorAll("tr"));
	if (rows.length < 2 || !rows[0]) return [];
	const headers = getHeadersGeneric(rows[0] as Element);
	const indexes = getHeaderIndexesGeneric(headers);
	const result: WorktimeRow[] = [];
	let currentDate = "";
	for (let i = 1; i < rows.length; ++i) {
		const cells = Array.from(rows[i].querySelectorAll("td"));
		if (cells.length < headers.length) continue;
		const row = extractWorktimeRowGeneric(cells, indexes, year, month, currentDate);
		if (!row) continue;
		currentDate = row.date;
		result.push(row);
	}
	return result;
}
