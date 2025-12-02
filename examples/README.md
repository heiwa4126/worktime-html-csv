# Examples - worktime-html-csv

このディレクトリには、`@heiwa4126/worktime-html-csv` の使用例が含まれています。

## 前提条件

すべてのサンプルを実行する前に、プロジェクトをビルドしてください:

```bash
pnpm run build
```

## Node.js 版の例

### ex1.mjs - ESM 形式

ESM インポートを使用した例:

```bash
node examples/ex1.mjs
```

### ex2.cjs - CommonJS 形式

CommonJS の`require`を使用した例:

```bash
node examples/ex2.cjs
```

### ex3.ts - TypeScript

TypeScript での使用例:

```bash
tsx examples/ex3.ts
```

## ブラウザ版の例

ブラウザ版はネイティブの`DOMParser`を使用し、依存関係がないため非常に軽量です（約 4KB）。

### ex4-browser-esm.html - ESM 形式（ブラウザ）

ESM インポートを使用したブラウザ版の例。

**実行方法:**

1. HTTP サーバーを起動:

   ```bash
   pnpm dlx serve .
   # または
   python3 -m http.server 8000
   ```

2. ブラウザで開く:

   ```
   http://localhost:3000/examples/ex4-browser-esm.html
   ```

3. ブラウザのコンソール（F12）で結果を確認

### ex5-browser-iife.html - IIFE 形式（ブラウザ）

グローバル変数として読み込む IIFE 形式の例。Chrome 拡張機能などで使用できます。

**実行方法:**

1. HTTP サーバーを起動:

   ```bash
   pnpm dlx serve .
   ```

2. ブラウザで開く:

   ```
   http://localhost:3000/examples/ex5-browser-iife.html
   ```

3. ブラウザのコンソール（F12）で結果を確認

グローバル変数 `WorktimeHtmlCsv` として利用可能:

```javascript
const { parseWorktimeHtmlToData, toWideArray } = WorktimeHtmlCsv;
```

### ex6-browser-node.mjs - ブラウザ版テストの説明

このスクリプトはブラウザ版のテスト方法を表示します:

```bash
node examples/ex6-browser-node.mjs
```

**注意:** ブラウザ版は Node.js 環境では動作しません（ネイティブの`DOMParser` API が必要）。

## サンプルの違い

| ファイル              | 環境    | モジュール形式   | 依存関係 | サイズ |
| --------------------- | ------- | ---------------- | -------- | ------ |
| ex1.mjs               | Node.js | ESM              | linkedom | ~265KB |
| ex2.cjs               | Node.js | CommonJS         | linkedom | ~265KB |
| ex3.ts                | Node.js | ESM (TypeScript) | linkedom | ~265KB |
| ex4-browser-esm.html  | Browser | ESM              | なし     | ~4KB   |
| ex5-browser-iife.html | Browser | IIFE             | なし     | ~4KB   |

## スモークテスト

すべてのサンプルを一度にテストするには:

```bash
pnpm run smoke-test
```

これにより、Node.js 版の例と CLI ツールがテストされます。ブラウザ版は手動でテストしてください。
