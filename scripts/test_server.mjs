#!/usr/bin/env node
/*
Hono を使ったシンプルなテストサーバー

URL: http://localhost:3000/

ドキュメントルート: ./examples/local_http

機能:
	- / - examples/local_http 内の全 HTML ファイルのインデックスを表示
	- /*.html - 各 HTML ファイルにアクセス可能
	- /dist/* - プロジェクトの ./dist/ ディレクトリの内容を提供
*/
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const app = new Hono();

const DOC_ROOT = "examples/local_http";
const ROOT_DIR = resolve(process.cwd(), DOC_ROOT);
const DIST_DIR = resolve(process.cwd(), "dist");

// ルートパスでHTMLファイルのインデックスを表示
app.get("/", (c) => {
	try {
		const files = readdirSync(ROOT_DIR)
			.filter((file) => file.endsWith(".html"))
			.sort();

		const html = `<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test Server - HTML Files</title>
	<style>
		body {
			font-family: system-ui, -apple-system, sans-serif;
			max-width: 800px;
			margin: 2rem auto;
			padding: 0 1rem;
			line-height: 1.6;
		}
		h1 {
			color: #333;
			border-bottom: 2px solid #0066cc;
			padding-bottom: 0.5rem;
		}
		ul {
			list-style: none;
			padding: 0;
		}
		li {
			margin: 0.5rem 0;
		}
		a {
			color: #0066cc;
			text-decoration: none;
			font-size: 1.1rem;
		}
		a:hover {
			text-decoration: underline;
		}
		.count {
			color: #666;
			font-size: 0.9rem;
			margin-top: 1rem;
		}
	</style>
</head>
<body>
	<h1>HTML Files in ${DOC_ROOT}</h1>
	<ul>
		${files.map((file) => `<li><a href="/${file}">${file}</a></li>`).join("\n\t\t")}
	</ul>
	<p class="count">Total: ${files.length} file(s)</p>
</body>
</html>`;

		return c.html(html);
	} catch (error) {
		return c.text(`Error reading directory: ${error.message}`, 500);
	}
});

// /dist/ へのアクセスを ./dist/ にマップ
app.use(
	"/dist/*",
	serveStatic({
		root: "./",
		rewriteRequestPath: (path) => path,
	}),
);

// examples/local_http/ の静的ファイルを提供
app.use(
	"/*",
	serveStatic({
		root: `./${DOC_ROOT}`,
	}),
);

const port = 3000;

console.log(`Starting test server...
Document root: ${ROOT_DIR}
/dist/ directory: ${DIST_DIR}
Server running at http://localhost:${port}/`);

serve({
	fetch: app.fetch,
	port,
});
