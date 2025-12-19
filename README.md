# worktime-html-csv (@heiwa4126/worktime-html-csv)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/worktime-html-csv.svg)](https://www.npmjs.com/package/@heiwa4126/worktime-html-csv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

ある特定のウェブページの HTML の特定テーブルを処理して、CSV として出力する npm パッケージです。きわめて特定の目的にだけ使われるので、汎用性は低いです。

テンプレートとして流用できるかもしれません。

## 仕様

Node とブラウザの両方で動作するように、CSV ライブラリは [papaparse](https://www.npmjs.com/package/papaparse) を使用

- **Node.js バージョン**: DOM アクセスは[linkedom](https://www.npmjs.com/package/linkedom) を使って高速処理
- **DOM バージョン**: ネイティブ DOM API を使用
- **IIFE バンドル**: ブラウザ上では ESM スクリプトだけでなく、クラシックスクリプト版のビルドも添付(バンドル済み)
- **CLI ツール**: HTML ファイルから CSV に変換するコマンドラインツール付き
- **デュアルフォーマット**: ライブラリとして使う場合は ESM, TS(.d.ts), CommonJS をサポート

## インストール

```bash
pnpm add @heiwa4126/worktime-html-csv
# または
npm install @heiwa4126/worktime-html-csv
```

## 使い方

### ライブラリとして利用 (Node.js)

#### ES Modules (MJS)

[examples/ex1.mjs](examples/ex1.mjs)

```typescript
import { parseWorktimeHtmlToData, toWideArray, toCSVString } from "@heiwa4126/worktime-html-csv";
import { readFileSync } from "fs";

const html = readFileSync("test_data/test1.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));
```

#### CommonJS (CJS)

[examples/ex1.cjs](examples/ex1.cjs)

```javascript
const { parseWorktimeHtmlToData, toWideArray, toCSVString } = require("@heiwa4126/worktime-html-csv");
const { readFileSync } = require("fs");

const html = readFileSync("worktime.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(toCSVString(wideArray));
```

### ブラウザ版をライブラリとして使用

ウェブアプリケーションや Chrome 拡張ではブラウザ版を利用してください

```typescript
import { parseWorktimeHtmlToData, toWideArray } from "@heiwa4126/worktime-html-csv/browser";
// 以下同様
```

ブラウザ版には DOM を直接参照する `parseWorktimeDomToData(document)` があります。

### HTML 上で利用

クラッシックスクリプト版:

```html
<script src="path/to/parse.browser.global.js"></script>
<script>
  const html = document.documentElement.outerHTML;
  const rows = WorktimeHtmlCsv.parseWorktimeHtmlToData(html);
  const wideArray = WorktimeHtmlCsv.toWideArray(rows);
  console.log(wideArray);
</script>
```

ESM スクリプト版:

```html
<script type="importmap">
  {
    "imports": {
      "papaparse": "https://esm.sh/papaparse@5"
    }
  }
</script>
<script type="module">
  import { parseWorktimeHtmlToData, toWideArray } from "path/to/parse.browser.js";
  const rows = parseWorktimeHtmlToData(testHtml);
  const wideArray = toWideArray(rows);
</script>
```

詳しくは `examples/local_http/*.html` を参照。

CDN に展開されていたら CDN も使えます。
`examples/cdn/*.html` を参照。

### CLI ツールとして利用

インストール後、CLI コマンドが利用できます。

```console
$ worktime-html-csv -h

Usage: worktime-html-csv [-h|--help] [-v|--version] [--bom] <input.html> [<output.csv>]

Options:
	-h, --help     Show this help message
	-v, --version  Show version
	--bom          Add UTF-8 BOM for Excel compatibility

If <output.csv> is omitted, output will be written to stdout.
```

## 開発

```bash
# 依存パッケージのインストール
pnpm install

# ビルド
pnpm run build

# テスト(Node.js版+ブラウザ版をnodeで)
pnpm test

# Lint
pnpm run lint

# フォーマット
pnpm run format

# 公開前チェック(lint, 両バージョンのテスト, clean, build, smoke test)
pnpm run prepublishOnly
```

## ブラウザ版のテスト

1. ビルド:
   `pnpm run build`

2. Hono で書いたテスト用 HTTP サーバーを起動:
   `pnpm start`

3. ブラウザでテストページを開く:

   <http://localhost:3000/> をブラウザで開くと、以下が表示されます

   - classic.html - 見た目がつまらない.ブラウザのコンソール(F12)で結果を確認
   - classic2.html - ボタンを押すと画面更新&クリップボードにコピーされる
   - esm.html - 見た目がつまらない.ブラウザのコンソール(F12)で結果を確認
   - esm2.html - ボタンを押すと画面更新&クリップボードにコピーされる

## CDN 版のテスト

npmjs 経由で各 CDN に出まわったら

- [esm.sh で ESM 版のテスト](examples/cdn/esmsh-esm.html)
- [jsDelivr で classic 版のテスト](examples/cdn/jsdelivr-classic.html)

でテストできます。サーバ不要。HTML をそのままブラウザで開けば OK

### CDN の ESM 版の importmap

最近は CDN が package.json の dependency をチェックして

```html
<script type="importmap">
  {
    "imports": {
      "papaparse": "https://esm.sh/papaparse@5"
    }
  }
</script>
```

相当の記述を自動で追加している場合があります。ありがたいことだ。

確認はたとえば esm.sh だったら
<https://esm.sh/@heiwa4126/worktime-html-csv/browser>
をみてください。

(2025-12)
esm.sh は正しい importmap がついてますが、
jsDeliver はいらん importmap がついてる...

## ライセンス

MIT
