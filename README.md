# 転生したらオセロ世界でした！

> **Reincarnated as an Othello Player** — 異界『盤上世界』に挑む 20 章のオセロアドベンチャー

> ⚠️ **作者個人の私用プロジェクト**です。リポジトリは公開していますが、**コード・テキスト・キャラクター画像・ストーリー本文の再配布／改変／流用は禁じています**。詳しくは [`LICENSE.md`](./LICENSE.md) を参照してください。

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
│   ├── test.yml             # CI: typecheck + vitest + build
│   └── pages-deploy.yml     # GitHub Pages 自動デプロイ
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

ユーザがスマホで触るのは GitHub のダッシュボードだけ。コードは Claude Code が書き、ビルドと配信は GitHub Actions に任せる。

### 1. GitHub Pages を有効化（一度だけ）

スマホ Chrome の **PC 版表示** で：

1. https://github.com/Waganawa-Megumin/Tensei-Othello/settings/pages を開く
2. **Build and deployment** の **Source** ドロップダウンを **GitHub Actions** に切替
3. main または `claude/**` ブランチに push されると `pages-deploy.yml` が走り、自動でデプロイ

公開 URL: `https://waganawa-megumin.github.io/Tensei-Othello/`

スマホ Chrome で開けば PWA が動き、メニューから「ホーム画面に追加」でアプリ風起動できる。

### 2. テスト・ビルドの確認

GitHub Actions タブ → **Test & Build** が緑チェックなら CI 成功。失敗時はログを開いて原因を読む。

### 3. Cloudflare Workers プロキシ（Phase 2）

Phase 2 の Claude API プロキシは Cloudflare Workers を使う。Pages とは別の仕組みで、**GitHub Secrets に `CLOUDFLARE_API_TOKEN` を入れて wrangler が GitHub Actions からデプロイ**するため、Cloudflare 側で Git 連携を設定する必要はない。詳細は Phase 2 着手時のガイドを参照。

### 4. APK ビルド（Phase 3 で追加予定）

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

**All Rights Reserved**（全権利留保）/ 個人利用前提。詳細は [`LICENSE.md`](./LICENSE.md)。

要点だけ：
- 公開しているのは開発ログ・透明性のため。**OSS ではありません**
- ソースの **閲覧・学習・ローカル実行** は自由
- 再配布・改変・他プロジェクトへの組み込み・MLモデルの訓練データへの利用は **禁止**
- キャラクター・世界観・タイトル等のクリエイティブアセットも転用不可
- 利用希望（共同制作・学術引用 等）がある場合は作者へ直接連絡
