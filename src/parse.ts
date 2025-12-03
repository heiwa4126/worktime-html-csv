import { type HTMLInputElement, parseHTML } from "linkedom";
import { convertTimeToHour, toWideArray, type WorktimeRow } from "./common.js";

export { toWideArray };
export type { WorktimeRow };

/**
 * 工数管理HTMLから集計用データを抽出
 * @param html HTML文字列
 * @returns WorktimeRow[]
 */
export function parseWorktimeHtmlToData(html: string): WorktimeRow[] {
	const { document } = parseHTML(html);
	// 年月取得
	const year = (document.getElementById("vD_SYORI_Y4") as unknown as HTMLInputElement)?.value || "";
	const month =
		(document.getElementById("vD_SYORI_MM") as unknown as HTMLInputElement)?.value || "";
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
