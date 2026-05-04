# othello-game

`Tensei-Othello/othello-game/` — 召喚されたらオセロ世界でした！の Vite + React 18 + TypeScript + Tailwind 3 フロントエンドサブプロジェクト。スマホ完結の運用方針はリポジトリルートの `README.md` を参照。

## タイトル・呼称ルール

| 用途 | 表記 |
|---|---|
| アプリ／作品タイトル | 召喚されたらオセロ世界でした！ |
| 作中異界の名前 | 盤上世界 / Bansho Sekai |

詳細は `CLAUDE.md` の Section 0.5 を参照。

## npm スクリプト

```bash
npm install        # 依存解決
npm run dev        # 開発サーバ http://localhost:5173
npm run typecheck  # tsc --noEmit
npm test           # vitest run（エンジンテスト 34 ケース）
npm run build      # 本番ビルド dist/
npm run preview    # ビルド済みのプレビュー
```

CI（`.github/workflows/test.yml`）は push / PR ごとに `typecheck → test → build` を実行する。

## ディレクトリ

```
src/
├── main.tsx
├── App.tsx               # UI（モノリス、useReducer 整理予定）
├── engine/               # React 非依存の純関数（Worker 内でも実行可）
│   ├── types.ts          # Disc=1|-1|0, Color=1|-1, Board, Move
│   ├── board.ts          # createInitialBoard / getValidMoves / applyMove ...
│   ├── evaluate.ts       # POSITION_WEIGHTS + evaluate()
│   ├── ai.ts             # minimax + alpha-beta + pickAIMove
│   ├── endgame.ts        # 完全読みソルバ（Phase 4 で実装）
│   └── __tests__/        # vitest
├── workers/ai.worker.ts  # AI 探索を別スレッドで実行
├── hooks/useAiWorker.ts  # Worker のライフサイクルとリクエスト管理
├── storage/saveGame.ts   # localStorage 抽象（schemaVersion: 1）
└── i18n/                 # JA/EN 辞書 + useLocale フック
```

## ゲーム機能

### モード
- **ストーリー**: 第1–20章を順攻略。進捗は `localStorage('othello:story_progress')`
- **フリー**: 20キャラ・20レベルを自由設定
- **二人対戦**: 黒・白それぞれにアバターを割り当て

### AI 階層
| Lv | 戦略 |
|---|---|
| 1–2 | ランダム |
| 3–5 | 取得枚数優先（noise あり） |
| 6–9 | Positional（隅・端・X-square） |
| 10–14 | Minimax depth 1–2 + α-β |
| 15–17 | depth 3 |
| 18–20 | depth 4 + mobility + disc-parity |

実装は `engine/ai.ts:pickAIMove`。Web Worker 経由で実行されるため、Lv.18–20 の深い探索でも UI はブロックしない。

### UI
- 上部ツールバー: タイトル / 設定 / ヒント / 待った / 情報 / 新規 / 棋譜
- 盤面: A–H × 1–8 ラベル、最終手リング、合法手の青白いグロー、ヒント時の星マーカー
- 棋譜は標準記法（`a1`〜`h8`）。localStorage に保存・読込可

### PWA
- `vite-plugin-pwa` で manifest と service worker を生成
- workbox precache 約 5 MB（avatars 込み）— **オフラインでも全機能動く**
- スマホ Chrome の「ホーム画面に追加」でアプリ風起動

## キャラクター

20体のコンピュータキャラ（達人）+ 20体のプレイヤーキャラ（主人公）。詳細は `App.tsx` の `COMPUTERS` / `AVATARS` 配列、または `character_assets/manifest.json` を参照。

## 関連ドキュメント

- `CLAUDE.md` — Claude Code 用プロジェクトハンドオフ（タイトル・呼称ルール、設計判断、既知の罠）
- `docs/illustrations/README.md` — 挿絵制作のステップ別ロードマップ（Step 1〜6）
- `docs/illustration_brief.md` — 全アセット一括の包括リファレンス
- `docs/player_character_prompts.md` — プレイヤーアバター生成プロンプト

## ライセンス

**All Rights Reserved** / 個人利用前提。リポジトリルートの [`../LICENSE.md`](../LICENSE.md) を参照。
