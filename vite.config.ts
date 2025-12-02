/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		// Node.js版テスト用（デフォルト）
		environment: "node",
		include: ["test/**/*.test.ts"],
		exclude: ["test/**/*.browser.test.ts"],
	},
});
