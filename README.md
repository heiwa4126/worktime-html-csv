# heiwa4126-worktime-html-csv (@heiwa4126/worktime-html-csv)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/worktime-html-csv.svg)](https://www.npmjs.com/package/@heiwa4126/worktime-html-csv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

TypeScript hello world library with dual ES modules/CommonJS support. Features GitHub Actions trusted publishing to npmjs with Sigstore attestation.

Modified version of [heiwa4126/heiwa4126-hello4](https://github.com/heiwa4126/heiwa4126-hello4) with the following changes:

- Rewritten using [egoist/tsup](https://github.com/egoist/tsup)
- Migrated from npm to pnpm
- Extracted scripts/clean-pkg.mjs into a reusable package (@heiwa4126/clean-publish-scripts)

## Installation

```bash
pnpm add @heiwa4126/worktime-html-csv
# or
npm install @heiwa4126/worktime-html-csv
```

## Usage

### As a library

#### ES Modules (MJS)

```typescript
import { hello } from "@heiwa4126/worktime-html-csv";

console.log(hello()); // "Hello!"
```

#### CommonJS (CJS)

```javascript
const { hello } = require("@heiwa4126/worktime-html-csv");

console.log(hello()); // "Hello!"
```

#### TypeScript

```typescript
import { hello } from "@heiwa4126/worktime-html-csv";

console.log(hello()); // "Hello!"
```

### As a CLI tool

After installation, you can use the CLI command:

```bash
heiwa4126-worktime-html-csv
```

## Development

```bash
# Install dependencies
pnpm install

# lint, test, clean, build, pack and smoke test (without publishing)
pnpm run prepublishOnly
```

## Build Output

The project builds to both ES modules and CommonJS formats in a flat structure:

- `dist/` - Both ES modules (`.js`) and CommonJS (`.cjs`) files

## Scripts

- `pnpm run build` - Build both ESM and CJS versions
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm test` - Run tests once
- `pnpm run clean` - Remove build artifacts

## License

MIT

## Note

[NOTE-ja.md](https://github.com/heiwa4126/heiwa4126-worktime-html-csv/blob/main/NOTE-ja.md) (on GitHub)
これがこのプロジェクトの本体。
