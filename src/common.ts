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

// 年月取得の共通関数
export function getYearMonth(
	doc: Document,
	getValue: (el: Element | null) => string,
): { year: string; month: string } {
	return {
		year: getValue(doc.getElementById("vD_SYORI_Y4")),
		month: getValue(doc.getElementById("vD_SYORI_MM")),
	};
}

// --- 共通ロジック: ヘッダ・インデックス・行データ抽出 ---
export function getHeaders(row: Element): string[] {
	return Array.from((row as Element)?.querySelectorAll?.("th,td") || []).map(
		(th) => (th as Element).textContent?.trim() || "",
	);
}

/**
 * ヘッダー配列から特定のカラム名に対応するインデックスを取得する
 * @param headers - ヘッダー名の文字列配列
 * @returns 各カラム(製造オーダ、工程、日付、製造オーダ名、工数詳細または工数)のインデックスを持つオブジェクト
 */
export function getHeaderIndexes(headers: string[]) {
	return {
		order: headers.findIndex((h) => h.includes("製造オーダ")),
		process: headers.findIndex((h) => h.includes("工程")),
		date: headers.findIndex((h) => h.includes("日付")),
		orderName: headers.findIndex((h) => h.includes("製造オーダ名")),
		time:
			headers.findIndex((h) => h.includes("工数詳細")) !== -1
				? headers.findIndex((h) => h.includes("工数詳細"))
				: headers.findIndex((h) => h.includes("工数")),
	};
}

/**
 * セルの配列とヘッダーインデックス、年、月、現在の日付から作業時間情報を抽出する
 * @param cells - テーブルの各セル要素の配列
 * @param indexes - ヘッダー名から取得したインデックスのオブジェクト
 * @param year - 年(YYYY形式の文字列)
 * @param month - 月(MM形式の文字列)
 * @param currentDate - 現在の日付(YYYY-MM-DD形式の文字列)
 * @returns 抽出された作業時間情報(WorktimeRow型)または抽出できない場合はnull
 */
export function extractWorktime(
	cells: Element[],
	indexes: ReturnType<typeof getHeaderIndexes>,
	year: string,
	month: string,
	currentDate: string,
): WorktimeRow | null {
	const dateRaw = cells[indexes.date]?.textContent?.trim() || "";
	let date = currentDate;
	if (dateRaw) {
		const day = dateRaw.split("(")[0]?.padStart(2, "0") || "";
		date = `${year}-${month}-${day}`;
	}
	if (!date) return null;
	const timeStr = cells[indexes.time]?.textContent?.trim() || "";
	const hours = convertTimeToHour(timeStr);
	return {
		order: cells[indexes.order]?.textContent?.trim() || "",
		process: cells[indexes.process]?.textContent?.trim() || "",
		date,
		hours,
		orderName: cells[indexes.orderName]?.textContent?.trim() || "",
	};
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
 * 開始日から終了日までの日付配列を生成する
 *
 * @param start - 開始日 (yyyy-mm-dd形式)
 * @param end - 終了日 (yyyy-mm-dd形式)
 * @returns 開始日から終了日までの連続した日付文字列の配列 (yyyy-mm-dd形式)
 *
 * @example
 * ```ts
 * getDateArray("2024-01-01", "2024-01-03")
 * // => ["2024-01-01", "2024-01-02", "2024-01-03"]
 * ```
 */
export function getDateArray(start: string, end: string): string[] {
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

/**
 * 時間値を文字列にフォーマットする
 *
 * 小数点以下が .0 または .5 の場合は1桁で表示し、それ以外は2桁で表示します。
 *
 * @param val - フォーマットする時間値
 * @returns フォーマットされた時間文字列
 *
 * @example
 * ```ts
 * formatHour(2.0)  // => "2.0"
 * formatHour(2.5)  // => "2.5"
 * formatHour(2.33) // => "2.33"
 * ```
 */
export function formatHour(val: number): string {
	// 小数点以下が .0 または .5 なら1桁、それ以外は2桁
	if (Number.isInteger(val * 2)) {
		return val.toFixed(1);
	}
	return val.toFixed(2);
}

/**
 * グループ化されたデータの型定義
 */
type WorktimeGroup = {
	order: string;
	process: string;
	[date: string]: string | number;
};

/**
 * WorktimeRowの配列を製造オーダと工程でグループ化する
 *
 * 同じ製造オーダと工程の組み合わせについて、日付ごとの工数をマップに集約します。
 *
 * @param rows - グループ化するWorktimeRowの配列
 * @returns 製造オーダと工程をキーとしたグループのMap
 *
 * @example
 * ```ts
 * const rows = [
 *   { order: "A", process: "P1", date: "2024-01-01", hours: 2.0, orderName: "" },
 *   { order: "A", process: "P1", date: "2024-01-02", hours: 3.0, orderName: "" },
 * ];
 * const groups = groupByOrderAndProcess(rows);
 * // Map { "A\tP1" => { order: "A", process: "P1", "2024-01-01": 2.0, "2024-01-02": 3.0 } }
 * ```
 */
export function groupByOrderAndProcess(rows: WorktimeRow[]): Map<string, WorktimeGroup> {
	const groupMap = new Map<string, WorktimeGroup>();
	for (const row of rows) {
		const key = `${row.order}\t${row.process}`;
		let group = groupMap.get(key);
		if (!group) {
			group = { order: row.order, process: row.process };
			groupMap.set(key, group);
		}
		group[row.date] = row.hours;
	}
	return groupMap;
}

/**
 * グループ化されたデータをフォーマットして2次元配列に変換する
 *
 * 各グループについて、製造オーダ、工程、および各日付の工数をフォーマットして配列化します。
 * 日付に対応する工数が存在しない場合は "0.0" で埋めます。
 *
 * @param groupMap - グループ化されたデータのMap
 * @param dates - 出力する日付の配列 (yyyy-mm-dd形式)
 * @returns フォーマットされたデータ行の2次元配列
 *
 * @example
 * ```ts
 * const groups = new Map([
 *   ["A\tP1", { order: "A", process: "P1", "2024-01-01": 2.0 }]
 * ]);
 * const dates = ["2024-01-01", "2024-01-02"];
 * const data = formatDataRows(groups, dates);
 * // [["A", "P1", "2.0", "0.0"]]
 * ```
 */
export function formatDataRows(
	groupMap: Map<string, WorktimeGroup>,
	dates: string[],
): (string | number)[][] {
	const data: (string | number)[][] = [];
	// 製造オーダと工程でソート
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
	return data;
}

/**
 * WorktimeRow[] を横持ちCSV形式の2次元配列(string|number)に変換する
 *
 * 入力されたWorktimeRowの配列を、日付を列とした横持ち形式の2次元配列に変換します。
 * ヘッダー行には「製造オーダ」「工程」と日付範囲が含まれ、データ行には各製造オーダ・工程
 * ごとの日付別工数が含まれます。日付範囲は入力データの最小日付から最大日付までを自動的に
 * 生成します。
 *
 * @param rows - 変換するWorktimeRowの配列
 * @returns ヘッダー行とデータ行を含む2次元配列。データが空の場合は空配列を返します。
 *
 * @example
 * ```ts
 * const rows = [
 *   { order: "A", process: "P1", date: "2024-01-01", hours: 2.0, orderName: "" },
 *   { order: "A", process: "P1", date: "2024-01-02", hours: 3.0, orderName: "" },
 * ];
 * const result = toWideArray(rows);
 * // [
 * //   ["製造オーダ", "工程", "2024-01-01", "2024-01-02"],
 * //   ["A", "P1", "2.0", "3.0"]
 * // ]
 * ```
 */
export function toWideArray(rows: WorktimeRow[]): (string | number)[][] {
	if (!rows.length) return [];

	// 日付範囲を取得
	const dateList = rows.map((r) => r.date).sort();
	const minDate = dateList[0];
	const maxDate = dateList[dateList.length - 1];
	if (!minDate || !maxDate) return [];

	// 日付配列を生成
	const dates = getDateArray(minDate, maxDate);

	// ヘッダー行を生成
	const headers = ["製造オーダ", "工程", ...dates];

	// データをグループ化
	const groupMap = groupByOrderAndProcess(rows);

	// データ行をフォーマット
	const data = formatDataRows(groupMap, dates);

	return [headers, ...data];
}

/**
 * 2次元配列をCSV形式の文字列に変換する
 *
 * @param outRows - CSV データを表す2次元配列。各内部配列は1行を表し、要素は文字列または数値。
 * @param withBom - 先頭に UTF-8 BOM (\ufeff) を付与するか。Excel 用。デフォルトは false。
 * @returns CSV形式の文字列(ヘッダーなし)
 *
 * @remarks
 * PapaParse の `unparse` メソッドを使用して配列をCSV形式に変換します。
 * header オプションは false に設定されているため、ヘッダー行は生成されません。
 * BOM 付与は Excel での文字化け防止用です。
 *
 * @example
 * ```ts
 * toCSVString(data, true) // BOM付きCSV
 * toCSVString(data) // BOMなしCSV(デフォルト)
 * ```
 */
export function toCSVString(outRows: (string | number)[][], withBom = false): string {
	const csv = Papa.unparse(outRows, { header: false, newline: "\r\n" });
	return withBom ? `\ufeff${csv}` : csv;
}
