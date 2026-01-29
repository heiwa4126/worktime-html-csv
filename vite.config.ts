/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		// Node.js版テスト用（デフォルト）
		environment: "node",
		include: ["tests/**/*.test.ts"],
		exclude: ["tests/**/*.browser.test.ts"],
		coverage: {
			exclude: ["tests/testUtils.ts"],
			reporter: ["lcov", "json", "text"],
			reportsDirectory: "./coverage/node", // ← 出力先を指定
		},
	},
});
