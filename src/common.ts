// HTML工数集計の共通型定義とユーティリティ関数
// Node.js版とブラウザ版で共通利用
import Papa from "papaparse";

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
export function convertTimeToHour(timeStr: string): number {
	let totalMinutes = 0;
	for (const part of timeStr.split(" ")) {
		if (part.endsWith("h")) totalMinutes += Number.parseInt(part, 10) * 60;
		else if (part.endsWith("m")) totalMinutes += Number.parseInt(part, 10);
	}
	return totalMinutes / 60;
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

export function toCSVString(outRows: (string | number)[][]): string {
	// PapaParseは配列→CSV文字列変換にunparseを使う
	return Papa.unparse(outRows, { header: false });
}
