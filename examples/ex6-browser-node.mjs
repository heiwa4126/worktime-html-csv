// Browser version smoke test
//
// ブラウザ版のスモークテストを実行する方法:
//
// 1. ESM版のテスト:
//    ブラウザで examples/ex4-browser-esm.html を開いてコンソールを確認
//
// 2. IIFE版のテスト:
//    ブラウザで examples/ex5-browser-iife.html を開いてコンソールを確認
//
// 3. 簡易HTTPサーバーを起動してテスト:
//    pnpm dlx serve .
//    または
//    python3 -m http.server 8000
//
//    その後、ブラウザで http://localhost:8000/examples/ex4-browser-esm.html を開く
//
// 注意: ブラウザ版はNode.js環境では動作しません（DOMParser APIが必要）

console.log(`
ブラウザ版のテスト方法:

1. ビルド:
   pnpm run build

2. 簡易HTTPサーバーを起動:
   pnpm dlx serve .

3. ブラウザでテストページを開く:
   - ESM版: http://localhost:3000/examples/ex4-browser-esm.html
   - IIFE版: http://localhost:3000/examples/ex5-browser-iife.html

4. ブラウザのコンソールで結果を確認

Note: ブラウザ版はNode.js環境では動作しません（DOMParser APIが必要）
`);

process.exit(0);
