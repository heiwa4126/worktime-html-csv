import { defineConfig } from "tsdown";

function fixCjsExtension({ format }: { format: string }) {
	if (format === "cjs") return { js: ".cjs" };
	return { js: ".js" };
}

export default defineConfig([
	{
		entry: ["src/**/*.ts", "!src/cli.ts", "!src/**/*.browser.ts", "!src/**/*.test.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		unbundle: true,
		sourcemap: true,
		clean: true,
		dts: true,
		outExtensions: fixCjsExtension,
	},
	// CLI
	{
		entry: ["src/cli.ts"],
		format: ["esm"],
		outDir: "dist",
		unbundle: true,
		sourcemap: false,
		clean: false,
		dts: false,
		outExtensions: fixCjsExtension,
	},
	// ブラウザ版ESM (依存あり)
	{
		entry: ["src/parse.browser.ts"],
		format: ["esm"],
		outDir: "dist",
		unbundle: false,
		sourcemap: false,
		clean: false,
		dts: false,
		minify: true,
		outExtensions: fixCjsExtension,
	},
	// ブラウザ版IIFEバンドル (依存関係なし)
	{
		entry: ["src/parse.browser.ts"],
		format: ["iife"],
		outDir: "dist",
		sourcemap: false,
		clean: false,
		dts: false,
		globalName: "WorktimeHtmlCsv",
		minify: true,
		noExternal: ["papaparse"],
		outputOptions: {
			// outExtensionsでは対応できない。hello.iife.global.js になる
			// [name] はエントリファイル名 (hello) に置き換わります
			entryFileNames: "[name].global.js",
		},
	},
]);
