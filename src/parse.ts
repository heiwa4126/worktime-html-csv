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

/**
 * Parses an HTML string representing a worktime table and extracts structured worktime data.
 *
 * @param html - The HTML string containing the worktime table to parse.
 * @returns An array of `WorktimeRow` objects extracted from the table. Returns an empty array if the table is not found or contains no valid data rows.
 *
 * @remarks
 * - The function expects the table to have the ID "Grid1ContainerTbl".
 * - The first row of the table is assumed to contain headers.
 * - Each subsequent row is parsed into a `WorktimeRow` using helper functions.
 * - If a row cannot be parsed or is incomplete, it is skipped.
 *
 * @see WorktimeRow
 */
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
		const rowElement = rows[i];
		if (!rowElement) continue;
		const cells = Array.from(rowElement.querySelectorAll("td"));
		if (cells.length < headers.length) continue;
		const row = extractWorktimeRowGeneric(cells, indexes, year, month, currentDate);
		if (!row) continue;
		currentDate = row.date;
		result.push(row);
	}
	return result;
}
