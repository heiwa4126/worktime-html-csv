/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

// ブラウザ版テスト用設定（happy-dom環境）
export default defineConfig({
	test: {
		globals: true,
		environment: "happy-dom",
		include: ["test/**/*.browser.test.ts"],
		coverage: {
			exclude: ["test/testUtils.ts"],
		},
	},
});
