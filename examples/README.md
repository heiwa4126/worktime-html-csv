# Examples

このディレクトリには、`@heiwa4126/worktime-html-csv` の使用例が含まれています。

## 前提条件

すべてのサンプルを実行する前に、プロジェクトをビルドしてください:

```bash
pnpm run build
```

## Node.js 版

### ex1.mjs - ESM 形式

ESM インポートを使用した例:

```bash
node examples/ex1.mjs
```

### ex1.cjs - CommonJS 形式

CommonJS の`require`を使用した例:

```bash
node examples/ex1.cjs
```

### ex1.ts - TypeScript

TypeScript での使用例:

```bash
tsx examples/ex1.ts
```

## ブラウザ版(DOM 版)の例

ブラウザ版はネイティブの`DOMParser`を使用します。
node で実行できるよう `happy-dom`で DOM をエミュレーションしています。

### ex2.mjs - ESM 形式

ESM インポートを使用した例:

```bash
node examples/ex2.mjs
```

### ex2.cjs - CommonJS 形式

CommonJS の`require`を使用した例:

```bash
node examples/ex2.cjs
```

## クラシックスクリプトの例

ブラウザ版同様`happy-dom`で DOM をエミュレーションしています。
クラシックスクリプトにはパッケージの観念がないので、import や require を使わず、直にスクリプトを読んでいます。

```bash
node examples/ex3.cjs
```

## CDN 版サンプル

`examples/cdn` にあります。
