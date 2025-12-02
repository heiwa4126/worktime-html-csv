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
	// CLI
	{
		entry: ["src/cli.ts"],
		format: ["esm"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: false,
	},
	// ブラウザ版ESM/CJS
	{
		entry: ["src/parseWorktimeHtmlToData.browser.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: {
			resolve: true,
			entry: ["src/parseWorktimeHtmlToData.browser.ts"],
		},
	},
	// ブラウザ版IIFEバンドル (Chrome拡張用 - 依存関係なし、小サイズ)
	{
		entry: ["src/parseWorktimeHtmlToData.browser.ts"],
		format: ["iife"],
		outDir: "dist",
		bundle: true,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: false,
		globalName: "WorktimeHtmlCsv",
		minify: true,
		outExtension: () => ({ js: ".browser.global.js" }),
	},
]);
