/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

// ブラウザ版テスト用設定（happy-dom環境）
export default defineConfig({
	test: {
		globals: true,
		environment: "happy-dom",
		include: ["tests/**/*.browser.test.ts"],
		coverage: {
			exclude: ["tests/testUtils.ts"],
			reporter: ["lcov", "json", "text"],
			reportsDirectory: "./coverage/browser", // ← 出力先を指定
		},
	},
});
