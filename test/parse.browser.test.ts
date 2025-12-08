import { describe, expect, it } from "vitest";
import { toCSVString } from "../src/common.js";
import { parseWorktimeHtmlToData, toWideArray } from "../src/parse.browser.js";
import {
	expectedCsvPath,
	htmlPath,
	parseCsvToArray,
	parseExpectedCsvToRows,
	readFileSync,
	type WorktimeRow,
} from "./testUtils.js";

import { setupLineEndingMatcher } from "./testUtils.js";

setupLineEndingMatcher();

describe("parseWorktimeHtmlToData (browser version)", () => {
	it("test1.html → test1_expected.csv相当のデータを返す", () => {
		const html = readFileSync(htmlPath, "utf8");
		const expectedCsv = readFileSync(expectedCsvPath, "utf8");
		const expected = parseExpectedCsvToRows(expectedCsv);
		const actual = parseWorktimeHtmlToData(html).filter((r) => r.hours !== 0);
		// 順序が異なるのでソートして比較
		const sortFn = (a: WorktimeRow, b: WorktimeRow) =>
			a.order.localeCompare(b.order) ||
			a.process.localeCompare(b.process) ||
			a.date.localeCompare(b.date);
		expect(actual.sort(sortFn)).toEqual(expected.sort(sortFn));
	});

	it("toWideArray() で test1_expected.csv 配列と一致する", () => {
		const html = readFileSync(htmlPath, "utf8");
		const expectedCsv = readFileSync(expectedCsvPath, "utf8");
		const rows = parseWorktimeHtmlToData(html);
		const wide = toWideArray(rows);
		const expectedArr = parseCsvToArray(expectedCsv);
		// すべて文字列化し、各要素をtrimして比較
		const trimArray = (arr: string[][]) => arr.map((row) => row.map((cell) => cell.trim()));
		expect(trimArray(wide.map((r) => r.map(String)))).toEqual(trimArray(expectedArr));
	});

	it("toCSVString() BOMなし・BOMありの出力を検証", () => {
		const html = readFileSync(htmlPath, "utf8");
		const expectedCsv = readFileSync(expectedCsvPath, "utf8").trim();
		const rows = parseWorktimeHtmlToData(html);
		const wide = toWideArray(rows);
		const csvNoBom = toCSVString(wide);
		const csvWithBom = toCSVString(wide, true);
		// BOMなし

		// @ts-expect-error: toEqualIgnoreLineEndings is a custom matcher
		expect(csvNoBom).toEqualIgnoreLineEndings(expectedCsv);
		// BOMあり
		const expectedCsvWithBom = `\ufeff${expectedCsv}`;
		// @ts-expect-error: toEqualIgnoreLineEndings is a custom matcher
		expect(csvWithBom).toEqualIgnoreLineEndings(expectedCsvWithBom);
	});
});
