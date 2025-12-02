#!/usr/bin/env node
import { stringify } from "csv-stringify/sync";
import fs from "node:fs";
import { parseWorktimeHtmlToData } from "./parseWorktimeHtmlToData.js";

function printHelp() {
	console.log(`Usage: worktime-html-csv [-h|--help] [-V|--version] <input.html> [<output.csv>]

Options:
  -h, --help     Show this help message
  -V, --version  Show version

If <output.csv> is omitted, output will be written to stdout.`);
}

import pkg from "../package.json" with { type: "json" };

function printVersion() {
	console.log(String(pkg.version));
}

async function main() {
	const argv = process.argv.slice(2);
	if (argv.includes("-h") || argv.includes("--help")) {
		printHelp();
		process.exit(0);
	}
	if (argv.includes("-V") || argv.includes("--version")) {
		printVersion();
		process.exit(0);
	}
	if (argv.length < 1) {
		printHelp();
		process.exit(1);
	}
	const inputFile = argv[0];
	const outputFile = argv[1];
	if (!inputFile) {
		console.error("Input file is required.");
		process.exit(1);
	}
	let html: string;
	try {
		html = fs.readFileSync(inputFile, { encoding: "utf8" });
	} catch {
		console.error(`Failed to read input file: ${inputFile}`);
		process.exit(2);
	}
	// ピボット集計: 製造オーダ・工程ごと、日付ごとに工数を横持ち
	const rows = parseWorktimeHtmlToData(html);
	if (!rows.length) {
		console.error("No worktime data found in input HTML.");
		process.exit(3);
	}
	// ユニークな日付を昇順で抽出
	const dateSet = new Set<string>();
	for (const row of rows) dateSet.add(row.date);
	const dates = Array.from(dateSet).sort();
	// 製造オーダ・工程ごとにグループ化
	type Key = string;
	const groupMap = new Map<
		Key,
		{ order: string; process: string; hoursByDate: Record<string, number> }
	>();
	for (const row of rows) {
		const key = `${row.order}\t${row.process}`;
		if (!groupMap.has(key)) {
			groupMap.set(key, { order: row.order, process: row.process, hoursByDate: {} });
		}
		const rec = groupMap.get(key) as {
			order: string;
			process: string;
			hoursByDate: Record<string, number>;
		};
		rec.hoursByDate[row.date] = row.hours;
	}
	// ヘッダ: 製造オーダ,工程,日付1,日付2,...（日本語固定）
	const header = ["製造オーダ", "工程", ...dates];
	const outRows = [header];
	for (const { order, process, hoursByDate } of groupMap.values()) {
		const line: string[] = [
			String(order),
			String(process),
			...dates.map((d) => String(d in hoursByDate ? hoursByDate[d] : 0.0)),
		];
		outRows.push(line);
	}
	const csv = stringify(outRows, { header: false });
	if (outputFile) {
		fs.writeFileSync(outputFile, csv);
	} else {
		process.stdout.write(csv);
	}
}

main();
