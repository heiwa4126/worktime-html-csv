import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["src/parseWorktimeHtmlToData.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: true,
		clean: true,
		dts: {
			resolve: true,
			entry: ["src/parseWorktimeHtmlToData.ts"],
		},
	},
	// IIFEバンドル
	{
		entry: ["src/parseWorktimeHtmlToData.ts"],
		format: ["iife"],
		outDir: "dist",
		bundle: true,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: false,
		globalName: "WorktimeHtmlCsv",
		minify: true,
	},
]);
