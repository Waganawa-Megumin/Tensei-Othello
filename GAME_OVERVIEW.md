# 召喚されたらオセロ世界でした！ — Game & System Overview

> 外部の Claude Chat セッションに **このファイル 1 枚** を貼れば、
> プロジェクトの全体像（世界観・ゲーム設計・システム構成）が
> 把握できることを目的にした **自己完結ハンドオフ・パッケージ**。
>
> Claude Code（リポ内）向けの詳細な作業ルールは
> [`othello-game/CLAUDE.md`](./othello-game/CLAUDE.md)、
> 世界観正本は [`othello-game/docs/master_world.md`](./othello-game/docs/master_world.md)、
> タスク状況は [`BACKLOG.md`](./BACKLOG.md) に集約されている。
> 本ドキュメントはそれらを横断的にダイジェストしたもの。

最終更新: 2026-05-07 / Build: **v0.36.25 · fresh-slot-prologue-fix**

---

## 0. 30 秒サマリー

- **作品**: 「召喚されたらオセロ世界でした！」 (英: *Summoned as an Othello Player*)
- **ジャンル**: ライトノベル風・異世界召喚もの × 和風オセロ × 章仕立てアドベンチャー
- **規模**: 20 章 × 22 体の対戦相手 (OPP01〜OPP22) × 21 体のプレイヤーアバター (PLR00〜PLR20 + 隠し PLR01)
- **コア体験**: 異界『盤上世界 (Bansho Sekai)』に召喚された「ハルキ」となり、Lv.1〜20 の達人を順番に打ち破ってエンディングを目指す。真エンディング達成で隠し OPP21 / OPP22 が解放される循環ロア。
- **技術**: TypeScript + React 18 + Vite 5 + Tailwind 3 の SPA / PWA。Web Worker 上の純関数オセロエンジン（minimax + αβ）。Cloudflare Workers プロキシ越しに Anthropic Messages API を叩き、対局後レビュー / キャラクター実況を生成。
- **配信**: GitHub Pages (PWA) → 将来 Capacitor で APK 化 (Phase 3)。
- **開発体制**: 作者はスマホしか使わず、複数の Claude Code セッションが `claude/<task>-<hash>` ブランチで並行開発、`main` で統合 → GitHub Actions が自動 deploy。
- **ライセンス**: All Rights Reserved。OSS ではない (公開は透明性のため)。

---

## 1. タイトル・呼称ルール（混同厳禁）

| 用途 | 表記 | 説明 |
|---|---|---|
| **作品タイトル** | 召喚されたらオセロ世界でした！ / *Summoned as an Othello Player* | ラノベ風メタタイトル。タイトル画面・ストア表記・ブラウザタブ |
| **作中異界の固有名詞** | 盤上世界 (ばんじょうせかい) / *Bansho Sekai* | プレイヤーが召喚される異界の名前。ストーリー本文・章説明 |

- 旧称「転生したら〜 / *Reincarnated as*〜」は **v0.32.4 で「召喚」路線に振替済**。
  リポジトリ名 `Tensei-Othello` だけは互換のため残置。**新規文章は必ず「召喚 / Summoned」で書く**。
- ❌ NG: `盤上世界 — Tensei Othello` のような作品名 + 異界名の混合表記。

---

## 2. 現在のフェーズと進捗

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | TypeScript 化 / engine 分離 / Web Worker / PWA / CI / JA‑EN i18n | ✅ 完了 |
| 2 | Cloudflare Workers プロキシ + Anthropic API（対局後レビュー・実況） | ✅ 配線済 (Sonnet 4.6 で稼働、対局レビューは tool 出力で構造化) |
| 3 | Capacitor + GitHub Actions APK ビルド | ⏸ 未着手（PLR01 アバター 4/4 構造への移行は完了） |
| 4 | 終盤完全読み・反復深化・置換表・SFX・触覚 | 🟡 部分着手 (Step 1〜3 投入: OPP22 ヴォイドφ + 章 20-D シネマ + アンロックゲート分離。Step 4 音設計は素材収集待ち) |

直近の主要マイルストーン:

- **v0.34.x**: gameOver effect 無限ループ修正 + endgame freeze 根本治療（fuzz 835 ゲームで engine 無罪確認）+ diag log の ring buffer 化
- **v0.35.x**: 章 20-D ヴォイドφ覚醒シネマ用挿絵 (LS+PT) 投入
- **v0.36.x**: 真エンディングシネマを 5 段化（章 20-A 対峙 → 20-B 解放 → 20-C エピローグ → 20-D 覚醒 → OPP22 戦）。スロットごとのフラグ管理（per-slot unlock）に移行。呪文（spell）機能で開発者が任意スロットを `XXPPCC` 形式の暗号で任意章 / PLR にワープ可能。

---

## 3. ゲーム全体像

### 3.1 モード

| モード | 仕様 |
|---|---|
| **ストーリー** | スロット (最大 10) ごとに `storyProgress` (0..20) と `lives` (初期 5、上限 9) を保持。Lv.1 から順番に対戦し、勝利で次章へ進む。負け / 引分 / 投了で lives -1（章は据え置き）。lives 0 でゲームオーバー演出。Lv.21 / 22 はストーリーには出ない隠しキャラ。 |
| **フリー** | スロット非依存。任意キャラ × 任意 Lv で対戦。FreeStats バケットに集計。OPP21 / OPP22 はそれぞれ `trueEndingAchieved` / `voidphiAwakened` フラグでアンロックされてから選択可能。 |
| **2 人対戦** | 同一端末で交互に着手。AI 不使用。スロットも統計も汚さない。 |

### 3.2 アバター ロスター

#### COMPUTERS (対戦相手 22 体)

| Lv | 名前 (kanji) | アーキタイプ | 備考 |
|---:|---|---|---|
| 1 | いちか (苺) | アイドル | |
| 2 | 葵 | 弓使い | |
| 3 | 朝日 (朝) | 剣士 (和洋融合武士道) | |
| 4 | なでしこ (撫) | 治療師 | |
| 5 | 響 | 吟遊詩人 | |
| 6 | つむぎ (紬) | 獣使い | |
| 7 | 茜 | 技師 (スチームパンク) | |
| 8 | メル (薬) | 錬金術師 | |
| 9 | 悟 | 修行僧 | |
| 10 | シキ (黒) | 盗賊 | |
| 11 | シオン (詩) | 魔術師 (姉) | |
| 12 | ルナ (夢) | 夢の魔女 (妹) | シオンと同一世界線の姉妹召喚体 |
| 13 | 雪乃 (雪) | 学園軍師 | |
| 14 | アキラ (暁) | 探偵 | |
| 15 | シエル (銀) | サイバー斥候 | |
| 16 | アリア (姫) | 姫君 | アバター: 白ドレス / 章別: 青ドレス（マルチ衣装が canonical） |
| 17 | レオン (獅) | 騎士 | |
| 18 | 宗次郎 (宗) | 老侍 | |
| 19 | 嵐 | 竜騎士 | |
| 20 | ゼロ (零) | ハッカー (フード姿、ラスボス) | 唯一実在の先代旅人 |
| **🌟 21** | ゼロ・現世帰還 (零) | 救済された旧ラスボス | PLR01 で章 20 クリア後アンロック |
| **🌟 22** | ヴォイドφ (φ) | 神格化されし秩序 | 章 20-D 視聴後アンロック |

#### AVATARS (プレイヤー 21 体)

- index 0: **PLR00 ハルキ (default)** — 現世から召喚された最新の打ち手。本編開始時点。
- index 1〜19: **PLR02〜PLR20** — 過去に章 20 を制覇して現世に帰還した先代旅人 19 体。スロットごとに、各 PLR で章 20 を初制覇するごとに順次アンロック。PLR00 → PLR02 → PLR03 → … → PLR20 と AVATARS 配列順に解放されるチェーン。
- index 20: **🌟 PLR01 英霊ハルキ** — **PLR02〜PLR20 全 19 体での章 20 制覇蓄積**によって、最後の特別枠として召喚される **21 番目の英雄 / 未来の英霊化したハルキ自身**。真エンディングルートの主役。

各キャラのアセットフォルダは `public/avatars/{opponents,players}/<SLUG>/` に
1024×1024 RGBA で **`character.png` / `background.png` / `icon.png` / `spec.md`** の 4/4 構造で揃っている。

### 3.3 ストーリー構造（PLR00 ノーマルルート）

```
Phase 1 (ch.1〜10)   召喚と無自覚の旅 —— 試練が「人だった気配」を持つことに気付き始める
Phase 2 (ch.11〜15)  真実の片鱗   —— シオン/ルナで召喚システムが仄めかされる
Phase 3 (ch.16〜19)  真実の発見   —— 自分が「呼ばれた者」であることを知る
Phase 4 (ch.20)      ラスボス対峙 —— ゼロ撃破 → フードが落ちる → 現世へ帰還
Epilogue             各 PLR で章 20 を制覇するごとに 1 体ずつ順次アンロック
                      (PLR00 → PLR02 → PLR03 → … → PLR20、最終的に PLR01 へ)
```

### 3.4 真エンディング（PLR01 ルート）

PLR01 英霊ハルキで章 20 を再走すると、**5 段の連鎖シネマ**が NarrativeOverlay で再生される:

```
0. ch.20-A  対峙シーン (「君は人間なんだろ?」)
1. ch.20-B  解放の瞬間 (フード無しゼロ × 英霊ハルキ)
2. ch.20-C  現世エピローグ (街角で振り返るゼロ「ありがとうございました」)
3. ch.20-D  ヴォイドφ覚醒 (世界が後継を生み出す)
4. (任意)   OPP22 ヴォイドφ戦 (intro / bossPre / bossPost / victoryNarration)
```

- 初回視聴で `trueEndingAchieved` と `voidphiAwakened` が立ち、Lv.21 / Lv.22 が解放（**別フラグ管理**）。
- v0.36.2 から **冪等ガードを撤去**しているため、シネマは PLR01 ch.20 win で**毎回再発火**する（ユーザー要望「何度も観たい」）。フラグだけは初回で固定、再生回数とは独立。

### 3.5 ゼロ系統 3 段階アーク (世界観の循環テーマ)

| 段階 | OPP | 状態 | 名言 | 思想 |
|---|---|---|---|---|
| 1 | OPP20 | フード姿。世界の論理と一体化 | 「全ての変分は計算済み。詰みだ」 | 絶望 / 閉じた予測 |
| 2 | OPP21 | 解放されたゼロ。現世帰還 | 「変分は閉じない。それが、面白い。」 | 希望 / 開放 |
| 3 | OPP22 | ゼロを失った世界が生み出す後継 | 「すべては φ の波動の狭間にある」 | 循環 / 包摂 |

「外へ飛び出したくなった」ゼロと「すべてを内に含む」ヴォイドφの対比で、循環の不変性を体現する。

### 3.6 PLR01 名言

> 日: **「変分は、お前自身が紡ぐもの」**
> 英: ***"The variations are yours to weave."***

過去から呼び戻された英霊が、現在進行形のハルキ（= プレイヤー）に二人称で
助言する構造。Fate 系の英霊召喚モチーフを応用。

---

## 4. システムアーキテクチャ

### 4.1 リポジトリ構成 (top-level)

```
Tensei-Othello/
├── README.md                    # ユーザ向けの起動・運用手順
├── BACKLOG.md                   # 全セッション共有のタスクボード (P1/P2/P3 + Done)
├── GAME_OVERVIEW.md             # ★ 本ファイル
├── LICENSE.md                   # All Rights Reserved
├── .github/workflows/
│   ├── test.yml                 # CI (typecheck + vitest + build)
│   ├── pages-deploy.yml         # GitHub Pages 自動 deploy
│   └── proxy-deploy.yml         # Cloudflare Workers wrangler deploy
├── data/players/                # （プレイヤー素材の作業ディレクトリ）
├── proxy/                       # Cloudflare Workers (Anthropic API プロキシ)
│   ├── src/index.ts             # /health + /v1/messages を Anthropic に forward
│   └── wrangler.toml
└── othello-game/                # 本体 SPA / PWA
    ├── package.json             # vite 5 / react 18 / tailwind 3 / lucide-react
    ├── vite.config.ts           # base './' + VitePWA (workbox, autoUpdate)
    ├── CLAUDE.md                # Claude Code 用ハンドオフ (作業ルール・地雷リスト)
    ├── public/avatars/          # opponents/PLRxx/* 4/4 アセット (1024×1024)
    ├── docs/                    # 世界観 / シナリオ / 挿絵指示書 / QA 計画
    └── src/
        ├── main.tsx
        ├── App.tsx              # ⚠ ~7400 行のモノリス (BACKLOG P2 で分割予定)
        ├── engine/              # 純関数オセロ (React 非依存)
        ├── workers/ai.worker.ts # Web Worker 上の AI 思考
        ├── hooks/               # useAiWorker / useMediaQuery / useTapToReveal
        ├── components/          # TitleScreen / SlotPicker / NarrativeOverlay 等
        │   └── intro/           # Prologue → Falling → Arrival → Gateway… の 5 段
        ├── data/personas.ts     # 22 体ぶんの persona cue (Claude 実況用)
        ├── i18n/                # ja.ts / en.ts / story/ + useLocale
        ├── prompts/             # commentary.ts / review.ts (system prompt 構築)
        ├── services/            # claude.ts (proxy 経由 SSE + tool use)
        ├── storage/             # saveSlots / saveGame / storyOverlays / commentary
        └── lib/diagLog.ts       # ring buffer 診断ログ (200 件)
```

### 4.2 Engine レイヤ

`src/engine/` は **完全に React 非依存**な純関数群。Web Worker からも UI スレッドからも同じコードが呼ばれる。

- `types.ts` — `BLACK = 1` / `WHITE = -1` / `EMPTY = 0` の数値定数 + `Board = number[8][8]`
- `board.ts` — `getValidMoves` / `applyMove` / `getFlipsForMove` / `countPieces` / `isGameOver` 等
- `evaluate.ts` — 静的評価関数: 8×8 の position weights テーブル + mobility (moves diff × 8) + endgame disc parity
- `ai.ts` — レベル別の戦略テーブル:
  - **Lv 1–2**: ランダム (Lv1 は 100%、Lv2 は 70% ランダム)
  - **Lv 3–5**: greedy (flips 数 + ノイズ)
  - **Lv 6–9**: positional (POSITION_WEIGHTS + flips × 0.3 + ノイズ)
  - **Lv 10–14**: minimax depth 1–2 + αβ 枝刈り
  - **Lv 15–17**: minimax depth 3
  - **Lv 18–20**: minimax depth 4 + mobility / disc parity 評価
  - 上位レベルでも (16-Lv)×0.04 の確率で「上位 2 手から random」で人間味を残す
- `endgame.ts` / `index.ts` — 終盤読み拡張のスタブ + 公開 API バレル

> AI 思考は必ず `useAiWorker` フックから Web Worker (`workers/ai.worker.ts`) に
> オフロードされ、UI スレッドのフレーム落ちを防ぐ。中断は `MessageChannel` の
> abort 信号で実装。

### 4.3 Storage レイヤ (LocalStorage、Phase 3 で Capacitor Preferences へ swap 想定)

| キー | 用途 |
|---|---|
| `othello:save_slots` | スロット配列 v1 (10 件まで)。`storyProgress` / `lives` / 戦績 / 各種 per-slot フラグ |
| `othello:active_slot` | 現アクティブスロット ID (1..10) |
| `othello:free_stats` | フリーモード集計バケット (グローバル) |
| `othello:save:{ts}` | 棋譜スロット (kifu モーダルから保存・読込) |
| `othello:overlay_seen:{slotId}:{key}` | プロローグ / ナラティブ / 真ED 各オーバーレイの既読フラグ |
| `othello:device_id` | UUID。proxy への `X-Device-Id` ヘッダ。将来 KV 上の per-device レート制限を見据えた識別子 |
| `othello:diag_log` | 診断 ring buffer (200 件 ≈ 50 KB)。バグ報告用エクスポート対象 |

per-slot で持つ重要フラグ:

- `avatarsClearedCh20: number[]` — そのスロットで章 20 を初制覇した
  AVATARS index (0..19) の集合。chain unlock の source of truth。
  PLR01 (index 20) はこの配列に **入らない** — chain の終点であって
  chain step ではない。
- `unlockedCount` (0..20) — `avatarsClearedCh20.length` の派生値。
  AVATARS picker の `isLocked = i > unlockedCount` ゲートで使用。
  20 に到達すると PLR01 英霊ハルキ (AVATARS index 20) が選択可能に。
- `trueEndingAchieved` — 真エンディング達成（OPP21 解放のゲート）
- `voidphiAwakened` — ヴォイドφ覚醒シネマ視聴済（OPP22 解放のゲート）
- `voidphiEncounterPending` — PLR01 ch.20 win 直後にスロットを離れた場合の resume 用
- `voidphiIntroSeen` — 情報用（in-battle 統合は Phase 4 follow-up）

> v0.36.12 で「グローバル → per-slot」に再設計。それ以前のグローバルキー
> (`othello:character_unlocks` 等) は boot で 1 回だけ active slot にシードする
> migration 経路があり、それ以外では使わない。
>
> v0.36.26 で chain unlock を WORLD_BIBLE 理想形に統一: 旧実装は
> 「PLR00 で章 20 を 1 回クリア → unlockedCount +1 → 以後同スロットで
> は発火しない」で 1 スロット最大 +1 しか進めず、PLR01 は spell warp
> 専用状態だった。新実装は `avatarsClearedCh20` を起点に「PLR0..PLR19
> 各 1 体ずつ章 20 を制覇 → unlockedCount が 20 に到達 → PLR01 召喚」。
> 既存スロットは `migrateSlot` の `reconcileAvatarsCleared` ヘルパーで
> 旧 `unlockedCount=N` から `[0..N-1]` を back-derive。

### 4.4 Story / i18n / Overlay フロー

- **i18n**: `src/i18n/{ja,en}.ts` に 1400 行規模の辞書、`story/` 配下に章別シナリオ（intro / bossPre / bossPost.victory / bossPost.defeat / victoryDialogue / victoryNarration）。OPP22 専用 5 ブロックとプロローグ / 真ED シネマ全文も同居。
- **オーバーレイ種別** (`OverlayKey`):
  - `prologue` + `intro:*` 4 種 (Falling / Arrival / GatewayClosed / GatewayOpen) — 初回ストーリー入場時の uninterruptible 連鎖
  - `narrative:solitude` (ch.10 後) / `narrative:allies` (ch.15 後) / `narrative:final` (ch.19 後) — 中盤インサート
  - `narrative:chapter20A` / `chapter20Atransition` — 章 20 戦闘前の対峙シーン
  - `narrative:trueEnding20B` / `20C` / `20D` — 真エンディングシネマ
  - `narrative:opp22.intro` / `opp22.victoryNarration` — OPP22 戦の前後
  - `ending` — 通常 ED の長文プローズ（GameOver モーダル内 inline）
- **Archive**: タイトル画面の「シーン回想」が `getOrderedArchiveScenes(slotId, storyProgress, trueEndingAchieved, voidphiAwakened)` で時系列順 (`prologue → ch.1..20 → ending → 20-A → 20-B → 20-C → 20-D → opp22.intro → opp22.victoryNarration`) を返し、▶ 連続再生で全シーンを復習可能。

### 4.5 Anthropic API 連携 (Phase 2)

```
[PWA / APK]            [Cloudflare Worker]            [api.anthropic.com]
  services/claude.ts ──HTTPS POST /v1/messages──> proxy/src/index.ts ──> /v1/messages
       ▲                       │                              │
       │   SSE (stream:true)   │  Origin allowlist で 403,    │
       │ ◀─────────────────────┤  ANTHROPIC_API_KEY を Worker │
                               │  Secret として注入            │
                               │  (PWA / APK には漏らさない)   │
```

- **モデル**: `claude-sonnet-4-6` (対局後レビュー), `claude-haiku-4-5-20251001` (実況系の軽量呼び出し用)
- **2 つの呼び口**:
  1. `streamReview()` — システムプロンプトを `cache_control: { type: 'ephemeral' }` でキャッシュ、SSE で逐次 `text_delta` を UI に流し込む。max_tokens 3000。
  2. `fetchStructuredReview()` — `tool_choice: { type: 'tool', name: 'annotate_othello_game' }` で **JSON tool 出力を強制**し、棋譜の局面ごと注釈を構造化された `ReviewAnnotations` で取得。
- **キャラクター実況**: `services/commentary.ts` + `prompts/commentary.ts` + `data/personas.ts`。各キャラの kanji キーで persona cue を引き、対局中の局面に短いコメントを返す。
- **CORS**: `https://waganawa-megumin.github.io` / `localhost:5173,4173` / `capacitor://localhost` / `https://localhost` のみ許可。それ以外は 403。

### 4.6 配信パイプライン (作者はスマホしか使わない前提)

```
[Claude Code が claude/<task>-<hash> ブランチで開発]
        │ commit & push
        ▼
[GitHub Actions: test.yml]   typecheck + vitest + build
        │ green
        ▼
[main にマージ]
        │
        ├─ pages-deploy.yml ─▶ GitHub Pages
        │                      https://waganawa-megumin.github.io/Tensei-Othello/
        │
        └─ proxy-deploy.yml ─▶ Cloudflare Workers
                                wrangler secret put ANTHROPIC_API_KEY (毎回上書き)
                                wrangler deploy
```

PWA は `vite-plugin-pwa` で `autoUpdate` + `skipWaiting` + `clientsClaim`。
新しい SW が降ってくれば次回ロードで即適用される（"deploy したのにキャッシュで
古いビルドが残る" 問題を v0.33.6 で根治済）。

### 4.7 開発フロー (複数 Claude Code セッション並列)

- ブランチ命名: `claude/<task>-<hash>` 形式。各セッションは自分のブランチを保持し、互いを直接触らない。
- 統合点は `main` のみ。**作業前に必ず** `git fetch origin main && git merge origin/main`。
- [`BACKLOG.md`](./BACKLOG.md) が共有作業ボード:
  - **🔥 In Progress** に自ブランチ名 owner で居座っているタスクから再開
  - 他セッションのタスクには触らない（同時進行禁止）
  - 完了したら Done の先頭に移動 → main マージ → live deploy トリガ
- ターン終了時には **ステータステーブル** (確認 URL / `main` HEAD / 同期状態 / ブランチ / バージョン) を必ず提示する取り決め。

### 4.8 既知の地雷（過去にハマったポイント）

- **Tailwind の動的クラス名禁止**: `${color}-${shade}` のような動的合成はビルド時に検出されない。常に静的文字列で。
- **動的 JSX 参照は壊れる**: `<obj.Icon />` は artifact ランタイムで失敗した経緯あり。`ToolbarBtn` ヘルパー経由か `const I = obj.Icon; <I />` で書く。
- **useEffect cleanup の自滅**: 自身の state を deps に含めた setTimeout effect は、再レンダーごとに自分のタイマーを clear する事故を起こす（v9 の auto-pass 停止バグの根本原因）。
- **endgame freeze**: 終盤で UI が固まる症状 → engine fuzz 835 ゲームで engine 無罪確認、原因は gameOver effect の無限ループ。`useRef` ガードで根治 (v0.33.5〜v0.33.9)。
- **画像の base64 埋め込み禁止**: 1.85 MB を越えると artifact 環境で画像が読めなくなる。アバターは必ず `/avatars/...` パス参照。
- **App.tsx の肥大化**: ~7400 行モノリス。BACKLOG P2 に分割タスクあり。新規実装はなるべく `components/` `data/` `lib/` に切り出して合流させる方針。

---

## 5. 主要ドキュメント索引

| パス | 内容 |
|---|---|
| [`README.md`](./README.md) | ユーザ向け：プロジェクト概要・起動方法・スマホ運用手順 |
| [`BACKLOG.md`](./BACKLOG.md) | 全セッション共有のタスクボード（In Progress / Todo P1〜P3 / Done top 20） |
| [`GAME_OVERVIEW.md`](./GAME_OVERVIEW.md) | ★ 本ファイル（外部 Claude Chat 用ハンドオフ） |
| [`othello-game/CLAUDE.md`](./othello-game/CLAUDE.md) | Claude Code 用：作業ルール・呼称ルール・既知の地雷・章別仕様 |
| [`othello-game/docs/master_world.md`](./othello-game/docs/master_world.md) | 世界観正本 v1.1（召喚システム / キャラ時間軸 / ゼロ系統 3 段階） |
| [`othello-game/docs/scenario/00_WORLD_BIBLE.md`](./othello-game/docs/scenario/00_WORLD_BIBLE.md) | シナリオ用ワールドバイブル |
| [`othello-game/docs/scenario/01_PLR00_main_story_part{1..4}.md`](./othello-game/docs/scenario/) | PLR00 ノーマルルート全文 |
| [`othello-game/docs/illustrations/README.md`](./othello-game/docs/illustrations/README.md) | 挿絵制作 6 ステップロードマップ |
| [`othello-game/docs/illustration_brief.md`](./othello-game/docs/illustration_brief.md) | 全アセット一括の包括リファレンス |
| [`othello-game/docs/qa/true_ending_test_scenarios.md`](./othello-game/docs/qa/true_ending_test_scenarios.md) | T-01〜T-09 の真EDルート手動 QA シナリオ（≈100 分） |
| [`othello-game/docs/handoff/HANDOFF_v3_PLR_status.md`](./othello-game/docs/handoff/HANDOFF_v3_PLR_status.md) | アバター制作の進捗ハンドオフ |
| [`proxy/README.md`](./proxy/README.md) | Cloudflare Workers プロキシのデプロイ・健康チェック |

---

## 6. 外部 Chat に質問するときの最小コンテキスト

このパッケージを Claude Chat に貼った後、特定領域を深掘りしたい場合は
**追加で**以下のファイルだけ貼れば十分なことが多い:

- 世界観の詰めをしたい → `master_world.md` + 該当キャラの `spec.md`
- engine / AI の話 → `src/engine/{ai,evaluate,board}.ts`（合計 350 行ほど）
- ストーリー文の調整 → `src/i18n/{ja,en}.ts` の該当章ブロック
- 真ED / 隠しキャラ周辺のロジック → `src/storage/{saveSlots,storyOverlays}.ts` + `App.tsx` の gameOver effect 付近
- API 連携 → `src/services/claude.ts` + `src/prompts/{review,commentary}.ts` + `proxy/src/index.ts`

`App.tsx` 全体（~7400 行）はコンテキスト窓に対して重すぎるので、
**該当領域だけ抜粋**して貼ること。grep の取っ掛かりとしては
`v0.36.x` などのバージョンコメントが各機能ブロックに残されている。

---

## 7. ライセンス（重要）

- **All Rights Reserved**。OSS ではない。
- ソースの**閲覧・学習・ローカル実行は自由**。
- **再配布・改変・他プロジェクトへの組込み・ML 訓練データ利用は禁止**。
- キャラクター・世界観・タイトル等のクリエイティブアセットも転用不可。
- 利用希望（共同制作・学術引用 等）は作者へ直接連絡。詳細は [`LICENSE.md`](./LICENSE.md)。

外部 Claude Chat に本ファイルを貼って議論することは想定内（私用相談用途）。
ただし生成・派生コードを**他リポジトリや学習データに流す**のは明確に NG。
