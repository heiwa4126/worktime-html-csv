#! /usr/bin/env node
import fs from "node:fs";
import { parseWorktimeHtmlToData, toCSVString, toWideArray } from "./parse.js";

function printHelp() {
	console.log(`Usage: worktime-html-csv [-h|--help] [-v|--version] [--bom] <input.html> [<output.csv>]

Options:
	-h, --help     Show this help message
	-v, --version  Show version
	--bom          Add UTF-8 BOM for Excel compatibility

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
	if (argv.includes("-v") || argv.includes("--version")) {
		printVersion();
		process.exit(0);
	}
	if (argv.length < 1) {
		printHelp();
		process.exit(1);
	}
	const bomFlagIdx = argv.indexOf("--bom");
	const hasBom = bomFlagIdx !== -1;
	const filteredArgv = argv.filter((a) => a !== "--bom");
	const inputFile = filteredArgv[0];
	const outputFile = filteredArgv[1];
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
	const rows = parseWorktimeHtmlToData(html);
	if (!rows.length) {
		console.error("No worktime data found in input HTML.");
		process.exit(3);
	}
	// toWideArrayで横持ち配列化
	const outRows = toWideArray(rows);
	// すべて文字列化
	const csv = toCSVString(outRows, hasBom);

	if (outputFile) {
		fs.writeFileSync(outputFile, csv);
	} else {
		process.stdout.write(csv);
	}
}

main();
