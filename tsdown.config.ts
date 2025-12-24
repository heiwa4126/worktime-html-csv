import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

function fixCjsExtension({ format }: { format: string }) {
	if (format === "cjs") return { js: ".cjs" };
	return { js: ".js" };
}

// Generate license banner from package.json
const banner = `/* @license
${pkg.name}
v${pkg.version}
${pkg.homepage}
License: ${pkg.license}
*/`;

export default defineConfig([
	// Node.js 用ライブラリ. ESM/CJS 両対応
	// バンドルなし、外部パッケージのバンドルなし
	// マップファイルあり(誰かがデバッグしてくれるかも)、型定義あり
	{
		clean: true,
		entry: ["src/parse.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		unbundle: true,
		sourcemap: true,
		dts: true,
		outExtensions: fixCjsExtension,
		outputOptions: {
			banner,
		},
	},
	// Node.js 用CLI. ESMのみ
	// バンドルなし、外部パッケージのバンドルなし
	// ライブラリとしては使わないのでマップファイルなし、型定義なし、minifyあり
	{
		clean: false,
		entry: ["src/cli.ts"],
		format: ["esm"],
		outDir: "dist",
		unbundle: true,
		sourcemap: false,
		dts: false,
		minify: true,
		outExtensions: fixCjsExtension,
	},
	// DOM版ライブラリ(DOMを直接読みに行く)
	// Node.jsではESM/CJS両対応。ブラウザではESMのみ使える
	// バンドルあり、外部パッケージのバンドルなし
	// マップファイルあり(誰かがデバッグしてくれるかも)、型定義あり
	{
		clean: false,
		entry: ["src/parse.browser.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		unbundle: false,
		sourcemap: true,
		dts: true,
		outExtensions: fixCjsExtension,
		outputOptions: {
			banner,
		},
	},
	// DOM版(DOMを直接読みに行く)
	// ブラウザ版でのみ動作する「クラシックスクリプト」。IIFE形式(globalNameで指定)
	// バンドルあり、外部パッケージもバンドル。minifyもする
	// マップファイルなし、型定義なし
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
			banner,
		},
	},
]);
