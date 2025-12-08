# Copilot Instructions

## Project Overview

This is a TypeScript library (`@heiwa4126/worktime-html-csv`) for parsing worktime HTML tables and converting them to pivot-style CSVs. It supports modern npm packaging with dual ESM/CJS output, type definitions, and a CLI tool. The project provides both Node.js and browser versions, and uses trusted publishing via GitHub Actions.

## Main Features

- **Library (Node.js version):**
  - `parseWorktimeHtmlToData(html: string): WorktimeRow[]` parses a specific HTML table format and returns an array of worktime records.
  - `toWideArray(rows: WorktimeRow[]): string[][]` converts worktime records to a pivot-style wide array (dates as columns).
  - Uses `linkedom` for fast HTML parsing in Node.js environments.
  - Available as ESM and CJS formats.
- **Library (Browser version):**
  - Same API as Node.js version but uses native `DOMParser` instead of `linkedom`.
  - Import from `@heiwa4126/worktime-html-csv/browser`
  - Much smaller bundle size (~4KB vs ~265KB with linkedom).
  - Suitable for Chrome extensions and web applications.
  - Available as ESM, CJS, and IIFE formats.
- **CLI:**
  - Command: `worktime-html-csv [-h|--help] [-V|--version] <input.html> [<output.csv>]`
  - Converts HTML to a pivot CSV with Japanese headers and dates as columns, matching the format of `test_data/test1_expected.csv`.
  - Uses `csv-stringify` for robust CSV output.
  - Version is shown via `import pkg from "../package.json" with { type: "json" }`.
  - Provided via the `bin` field in `package.json`.
  - If output file is omitted, writes to stdout.

## Architecture & Build System

- **Dual Module Support:**
  - Bundled by `tsup` to both ESM (`.js`) and CJS (`.cjs`)
  - `exports` field in `package.json` for both import/require
  - TypeScript uses `module: nodenext`
  - Two versions: Node.js (with linkedom) and Browser (with native DOM)
- **Node.js Version:**
  - Entry: `src/parse.ts`
  - Uses `linkedom` for HTML parsing
  - Outputs: ESM, CJS, and TypeScript definitions
- **Browser Version:**
  - Entry: `src/parse.browser.ts`
  - Uses native `DOMParser` API (via `/// <reference lib="dom" />`)
  - Outputs: ESM, CJS, TypeScript definitions, and IIFE bundle
  - Import path: `@heiwa4126/worktime-html-csv/browser`
  - IIFE bundle: `dist/parse.browser.global.js` (~4KB minified)
  - Global name for IIFE: `WorktimeHtmlCsv`
- **CLI:**
  - Entry: `src/cli.ts` → `dist/cli.js`
  - Shebang (`#!/usr/bin/env node`) required
  - ESM imports, including `.js` extensions
  - Registered as `worktime-html-csv` via `bin` in `package.json`
  - Supports stdout output if output file is not specified
- **CSV Output:**
  - Uses `csv-stringify` for all CSV generation
  - Output format: Japanese headers, dates as columns, 0.0 fill, all values as strings
- **HTML Parsing:**
  - Node.js: Uses `linkedom` (fast DOM implementation)
  - Browser: Uses native `DOMParser` (no external dependencies)
  - Both versions parse the same specific table structure with worktime data

## Development & Testing

- **Build:** `pnpm run build` (via `tsup`)
- **Test:** `pnpm test` (via `vitest`, Node.js version with linkedom)
- **Test Browser:** `pnpm run test:browser` (via `vitest` with `happy-dom`, Browser version)
- **Lint/Format:** `pnpm run lint`, `pnpm run format` (Biome)
- **Smoke Test:** `pnpm run smoke-test` (tests ESM, CJS, TS, CLI)
- **Try CLI:** `tsx src/cli.ts test_data/test1.html` or after build, `worktime-html-csv ...`

## Testing

- **Node.js version tests:** `test/parseWorktimeHtmlToData.test.ts`
  - Uses default vitest config (node environment)
  - Tests linkedom-based implementation
- **Browser version tests:** `test/parseWorktimeHtmlToData.browser.test.ts`
  - Uses `vite.config.browser.ts` with happy-dom environment
  - Tests native DOMParser implementation
  - Same test cases as Node.js version

## File Structure

- `src/`: TypeScript source files (library, CLI)
  - `common.ts`: Common types and utility functions (DOM-independent)
  - `parse.ts`: Node.js version (linkedom)
  - `parse.browser.ts`: Browser version (native DOM)
  - `cli.ts`: CLI tool
- `examples/`: Usage examples for ESM, CJS, TS
- `test/`: Unit tests
  - `parseWorktimeHtmlToData.test.ts`: Node.js version tests
  - `parseWorktimeHtmlToData.browser.test.ts`: Browser version tests
- `test_data/`: HTML and expected CSV samples
- `dist/`: Build output
- `vite.config.ts`: Vitest config for Node.js tests
- `vite.config.browser.ts`: Vitest config for browser tests (happy-dom)

## Publishing & CI/CD

- **Trusted Publishing:**
  - Uses npm OIDC trusted publishing (no tokens)
  - GitHub Actions workflow triggers on version tags
  - Prereleases get `dev` tag, releases get `latest`

## Important Notes

- Always use `.js` extensions in TypeScript imports for Node.js ESM compatibility
- The project is ESM-first (`"type": "module"` in package.json)
- CLI requires a shebang in the built output
- Never commit npm tokens (OIDC only)
- All CSV output is handled by `csv-stringify`
- Common code (types, utilities) is shared via `common.ts` to avoid duplication

## Commit Message Policy

- All commit messages must be written in **English**.
