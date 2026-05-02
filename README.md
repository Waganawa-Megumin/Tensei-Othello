# 盤上世界 — Tensei Othello

20章のストーリーモード × 20キャラ × 20難易度の和風オセロ。最終的には Android アプリとして自分のスマホで遊ぶことを目指す。コーディングと CI と デプロイをすべてクラウド側に寄せ、**ローカル PC を一切使わず**スマホだけで開発・配布できる構成。

## 現在のフェーズ

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | TypeScript 化、engine 分離、Web Worker、PWA、CI | 進行中 |
| 2 | Cloudflare Workers プロキシ + Claude API（対局後レビュー等） | 未着手 |
| 3 | Capacitor + GitHub Actions APK ビルド | 未着手 |
| 4 | 終盤完全読み・反復深化・置換表・SFX・触覚 | 未着手 |

詳細は plan ファイル（このセッション固有）と `othello-game/CLAUDE.md` を参照。

## リポジトリ構成

```
Tensei-Othello/
├── .github/workflows/
│   └── test.yml             # CI: typecheck + vitest + build
└── othello-game/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts       # Vite + React + PWA + base './'
    ├── index.html
    ├── public/
    │   ├── favicon.svg
    │   └── avatars/         # 20 キャラ + 20 プレイヤー画像
    └── src/
        ├── main.tsx
        ├── App.tsx          # 単一ファイルの UI（リファクタ予定）
        ├── engine/          # オセロ純関数（React 非依存）
        │   ├── types.ts
        │   ├── board.ts
        │   ├── evaluate.ts
        │   ├── ai.ts        # minimax + alpha-beta
        │   ├── endgame.ts   # Phase 4 で完全読み実装予定
        │   └── __tests__/   # Vitest 約 30 ケース
        ├── workers/
        │   └── ai.worker.ts # AI 探索を Web Worker で実行
        └── hooks/
            └── useAiWorker.ts
```

## スマホからの開発フロー

ユーザがスマホで触るのは GitHub と Cloudflare のダッシュボードだけ。コードは Claude Code が書き、ビルドと配信は GitHub Actions と Cloudflare に任せる。

### 1. Cloudflare Pages の自動デプロイ（一度だけセットアップ）

スマホ Chrome / Safari で https://dash.cloudflare.com/ → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。

| 設定項目 | 値 |
|---|---|
| Repository | `Waganawa-Megumin/Tensei-Othello` |
| Production branch | `main`（必要に応じて変更可） |
| Framework preset | `Vite` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Root directory | `othello-game` |
| Node version | `20`（Environment variables で `NODE_VERSION=20`）|

保存すると次回 push から `https://tensei-othello.pages.dev`（または Cloudflare が割り振る URL）に自動デプロイ。スマホ Chrome で開けば PWA が動き、メニューから「ホーム画面に追加」でアプリ風に起動できる。

### 2. テスト・ビルドの確認

GitHub Actions タブ → **Test & Build** → 緑チェック確認。失敗時はログを開いて原因を読む（npm エラー・型エラー・テスト落ちはここで全て見える）。

### 3. APK ビルド（Phase 3 で追加予定）

`workflow_dispatch` で手動実行 → Artifacts から `app-debug.apk` をダウンロード → スマホで開いて「不明なアプリのインストール」許可 → インストール。Play Store 登録不要、$25 開発者アカウント不要。

## ローカル（参考）

開発者 PC があれば下記が使えるが、本プロジェクトは前提としない。

```bash
cd othello-game
npm install
npm run dev          # http://localhost:5173
npm run typecheck
npm test
npm run build        # dist/
```

## ライセンス

未定（個人利用前提）。

## ドキュメント

- `othello-game/CLAUDE.md` — Claude Code 用の引き継ぎ資料（v9 までの経緯、デザイン判断、踏んだ地雷）
- `othello-game/docs/player_character_prompts.md` — キャラ画像生成プロンプト
