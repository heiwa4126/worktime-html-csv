import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["src/parse.ts", "src/common.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: true,
		clean: true,
		dts: {
			resolve: true,
			entry: ["src/parse.ts", "src/common.ts"],
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
		entry: ["src/parse.browser.ts", "src/common.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: {
			resolve: true,
			entry: ["src/parse.browser.ts", "src/common.ts"],
		},
	},
	// ブラウザ版IIFEバンドル (Chrome拡張用 - 依存関係なし、小サイズ)
	{
		entry: ["src/parse.browser.ts"],
		format: ["iife"],
		outDir: "dist",
		bundle: true,
		splitting: false,
		sourcemap: true,
		clean: false,
		dts: false,
		globalName: "WorktimeHtmlCsv",
		minify: true,
		outExtension: () => ({ js: ".global.js" }),
	},
]);
