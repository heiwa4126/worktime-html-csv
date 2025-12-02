# heiwa4126-worktime-html-csv (@heiwa4126/worktime-html-csv)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/worktime-html-csv.svg)](https://www.npmjs.com/package/@heiwa4126/worktime-html-csv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Parse worktime HTML tables and convert them to pivot-style CSV. Supports dual ES modules/CommonJS output with TypeScript type definitions and a CLI tool.

Features:

- **Node.js version**: Uses `linkedom` for fast HTML parsing
- **Browser version**: Uses native DOM APIs for Chrome extensions and web applications
- **IIFE bundle**: Minified browser bundle (~4KB) for direct script inclusion
- **CLI tool**: Command-line interface for HTML to CSV conversion
- **Dual format**: Both ESM and CommonJS support

## Installation

```bash
pnpm add @heiwa4126/worktime-html-csv
# or
npm install @heiwa4126/worktime-html-csv
```

## Usage

### As a library (Node.js)

#### ES Modules (MJS)

```typescript
import { parseWorktimeHtmlToData, toWideArray } from "@heiwa4126/worktime-html-csv";
import { readFileSync } from "fs";

const html = readFileSync("worktime.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(wideArray);
```

#### CommonJS (CJS)

```javascript
const { parseWorktimeHtmlToData, toWideArray } = require("@heiwa4126/worktime-html-csv");
const { readFileSync } = require("fs");

const html = readFileSync("worktime.html", "utf8");
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
console.log(wideArray);
```

### As a library (Browser/Chrome Extension)

Use the browser version for Chrome extensions and web applications:

```typescript
import { parseWorktimeHtmlToData, toWideArray } from "@heiwa4126/worktime-html-csv/browser";

// In a Chrome extension content script or web page
const html = document.documentElement.outerHTML;
const rows = parseWorktimeHtmlToData(html);
const wideArray = toWideArray(rows);
```

### As an IIFE bundle (Browser)

For direct script inclusion without module bundlers:

```html
<script src="path/to/parseWorktimeHtmlToData.browser.global.js"></script>
<script>
  const html = document.documentElement.outerHTML;
  const rows = WorktimeHtmlCsv.parseWorktimeHtmlToData(html);
  const wideArray = WorktimeHtmlCsv.toWideArray(rows);
  console.log(wideArray);
</script>
```

### As a CLI tool

After installation, you can use the CLI command:

```bash
worktime-html-csv input.html output.csv
# or output to stdout
worktime-html-csv input.html
```

Options:

- `-h, --help`: Show help message
- `-V, --version`: Show version

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Test (Node.js version)
pnpm test

# Test (Browser version)
pnpm run test:browser

# Lint
pnpm run lint

# Format
pnpm run format

# Full prepublish check (lint, test both versions, clean, build, smoke test)
pnpm run prepublishOnly
```

## Build Output

The project builds multiple formats:

- `dist/parseWorktimeHtmlToData.js` - Node.js ESM version (uses linkedom)
- `dist/parseWorktimeHtmlToData.cjs` - Node.js CommonJS version (uses linkedom)
- `dist/parseWorktimeHtmlToData.d.ts` - TypeScript definitions
- `dist/parseWorktimeHtmlToData.browser.js` - Browser ESM version (native DOM)
- `dist/parseWorktimeHtmlToData.browser.cjs` - Browser CommonJS version (native DOM)
- `dist/parseWorktimeHtmlToData.browser.global.js` - IIFE bundle (~4KB minified)
- `dist/cli.js` - CLI tool

## Why Two Versions?

- **Node.js version** (`parseWorktimeHtmlToData.ts`): Uses `linkedom` for fast HTML parsing in Node.js environments
- **Browser version** (`parseWorktimeHtmlToData.browser.ts`): Uses native `DOMParser` API for browser environments
  - Much smaller bundle size (~4KB vs ~265KB with linkedom)
  - No external dependencies needed in browser
  - Perfect for Chrome extensions and web applications

## Scripts

- `pnpm run build` - Build all versions (Node.js, Browser, IIFE, CLI)
- `pnpm test` - Run Node.js version tests
- `pnpm run test:browser` - Run browser version tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run cli` - Run CLI tool via tsx (development)
- `pnpm run clean` - Remove build artifacts
- `pnpm run lint` - Lint code with Biome
- `pnpm run format` - Format code with Biome
- `pnpm run smoke-test` - Run smoke tests for all outputs

## License

MIT

## Note

[NOTE-ja.md](https://github.com/heiwa4126/heiwa4126-worktime-html-csv/blob/main/NOTE-ja.md) (on GitHub)
これがこのプロジェクトの本体。
