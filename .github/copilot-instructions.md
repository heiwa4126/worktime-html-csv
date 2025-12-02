
# Copilot Instructions

## Project Overview

This is a TypeScript library (`@heiwa4126/worktime-html-csv`) for parsing worktime HTML tables and converting them to pivot-style CSVs. It supports modern npm packaging with dual ESM/CJS output, type definitions, and a CLI tool. The CLI and library are both ESM-first, and the project uses trusted publishing via GitHub Actions.

## Main Features

- **Library:**
	- `parseWorktimeHtmlToData(html: string): WorktimeRow[]` parses a specific HTML table format and returns an array of worktime records.
- **CLI:**
	- Command: `worktime-html-csv [-h|--help] [-V|--version] <input.html> [<output.csv>]`
	- Converts HTML to a pivot CSV with Japanese headers and dates as columns, matching the format of `test_data/test1_expected.csv`.
	- Uses `csv-stringify` for robust CSV output.
	- Version is shown via `import pkg from "../package.json" with { type: "json" }`.
	- Provided via the `bin` field in `package.json`.

## Architecture & Build System

- **Dual Module Support:**
	- Bundled by `tsup` to both ESM (`.js`) and CJS (`.cjs`)
	- `exports` field in `package.json` for both import/require
	- TypeScript uses `module: nodenext`
- **CLI:**
	- Entry: `src/cli.ts` → `dist/cli.js`
	- Shebang (`#!/usr/bin/env node`) required
	- ESM imports, including `.js` extensions
	- Registered as `worktime-html-csv` via `bin` in `package.json`
- **CSV Output:**
	- Uses `csv-stringify` for all CSV generation
	- Output format: Japanese headers, dates as columns, 0.0 fill, all values as strings

## Development & Testing

- **Build:** `pnpm run build` (via `tsup`)
- **Test:** `pnpm test` (via `vitest`)
- **Lint/Format:** `pnpm run lint`, `pnpm run format` (Biome)
- **Smoke Test:** `pnpm run smoke-test` (tests ESM, CJS, TS, CLI)
- **Try CLI:** `tsx src/cli.ts test_data/test1.html` or after build, `worktime-html-csv ...`

## File Structure

- `src/`: TypeScript source files (library, CLI)
- `examples/`: Usage examples for ESM, CJS, TS
- `test/`: Unit tests
- `test_data/`: HTML and expected CSV samples
- `dist/`: Build output

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
