# 転生したらオセロ世界でした！

> **Reincarnated as an Othello Player** — 異界『盤上世界』に挑む 20 章のオセロアドベンチャー

20章のストーリーモード × 20キャラ × 20難易度の和風オセロ。最終的には Android アプリとして自分のスマホで遊ぶことを目指す。コーディングと CI と デプロイをすべてクラウド側に寄せ、**ローカル PC を一切使わず**スマホだけで開発・配布できる構成。

## タイトル・呼称ルール（重要）

このプロジェクトには 2 つの名前があり、混同しない：

| 用途 | 表記 | 説明 |
|---|---|---|
| **アプリ／作品タイトル** | 転生したらオセロ世界でした！ | ラノベ風のメタタイトル。タイトル画面・README・ブラウザタブ |
| **作中異界の名前** | 盤上世界（ばんじょうせかい）/ Bansho Sekai | プレイヤーが転生する世界の固有名詞。ストーリー文・章説明 |

英語表記が必要なときは:
- 作品: **Reincarnated as an Othello Player**
- 異界: 訳さず **Bansho Sekai**

❌ NG パターン: `盤上世界 — Tensei Othello` のように作品名と異界名を混ぜた表記。

## 現在のフェーズ

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | TypeScript 化、engine 分離、Web Worker、PWA、CI、JA/EN i18n | 完了 |
| 2 | Cloudflare Workers プロキシ + Claude API（対局後レビュー等） | 未着手 |
| 3 | Capacitor + GitHub Actions APK ビルド | 未着手 |
| 4 | 終盤完全読み・反復深化・置換表・SFX・触覚 | 未着手 |

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
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── engine/          # オセロ純関数（React 非依存）
    │   ├── workers/ai.worker.ts
    │   ├── hooks/useAiWorker.ts
    │   ├── storage/saveGame.ts
    │   └── i18n/            # JA/EN 辞書 + useLocale
    └── docs/
        ├── illustration_brief.md      # 全挿絵の包括リファレンス
        ├── illustrations/             # ステップ別の制作指示書
        │   ├── README.md
        │   └── step1〜step6_xxx.md
        └── player_character_prompts.md
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

保存すると次回 push から `https://tensei-othello.pages.dev` に自動デプロイ。スマホ Chrome で開けば PWA が動き、メニューから「ホーム画面に追加」でアプリ風に起動できる。

### 2. テスト・ビルドの確認

GitHub Actions タブ → **Test & Build** → 緑チェック確認。失敗時はログを開いて原因を読む。

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

## ドキュメント

- `othello-game/CLAUDE.md` — Claude Code 用プロジェクトハンドオフ（タイトル・呼称ルール、設計判断、踏んだ地雷）
- `othello-game/docs/illustrations/README.md` — 挿絵制作のステップ別ロードマップ
- `othello-game/docs/illustration_brief.md` — 全アセット一括の包括リファレンス
- `othello-game/docs/player_character_prompts.md` — プレイヤーアバター生成プロンプト

## ライセンス

未定（個人利用前提）。
