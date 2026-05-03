# Development Backlog — 転生したらオセロ世界でした！

> 2 つの Claude Code セッション（`claude/othello-game-sHVBZ` と
> `claude/review-othello-mock-HTX9b`）が共有する作業ボード。
> 詳細運用は [`othello-game/CLAUDE.md`](othello-game/CLAUDE.md) の
> 「0. セッション開始時の必須手順」を参照。

Last updated: 2026-05-03 by `claude/othello-ui-autosave-bPnmY` (v0.23.2)

---

## 🔥 In Progress

なし。

---

## 📋 Todo (priority order)

### P1 — バグ・ブロッカー

なし。

### P2 — 重要な機能改善

- [ ] **章ごとの本格的な物語・エピソード執筆** — 現状 `storyChapters[]`
      は 1 行のキャラ＋戦法紹介のみ。プロローグ（progress=0）と
      エンディング（クリア後）はそれぞれ短文プローズあり。各章に
      対局前後のミニシナリオ（出会い・会話・敗北後/勝利後の余韻）を
      足すと章ブラウザーが本物の "ストーリービューワー" になる。
      i18n の `storyChapters` を構造化し（intro / pre-battle dialogue /
      post-victory / post-defeat）、設定の章カード + GameOver モーダル
      で表示。
- [ ] **棋譜リプレイ追加 UX（v0.21.0 で見送り）**
  - プログレスバー上を tap/drag で任意手数へジャンプ
  - 盤上の last-move セルに小さく `12` のような手数ラベル
  - 自動再生中のみ手番側を太枠でハイライト
  - 終局時に紙吹雪 or サマリ pop
  - Coach モード: 自動再生中に Claude 注釈を音声合成 + 字幕
      は 1 行のキャラ＋戦法紹介のみ。プロローグ（progress=0）と
      エンディング（クリア後）はそれぞれ短文プローズあり。各章に
      対局前後のミニシナリオ（出会い・会話・敗北後/勝利後の余韻）を
      足すと章ブラウザーが本物の "ストーリービューワー" になる。
      i18n の `storyChapters` を構造化し（intro / pre-battle dialogue /
      post-victory / post-defeat）、設定の章カード + GameOver モーダル
      で表示。
- [ ] **App.tsx の分割リファクタ** — 単一ファイル ~2300 行。`components/`
      `data/` `lib/` 構成へ。CLAUDE.md セクション 12 に旧設計案あり
- [ ] **AI 思考中の UI 改善** — 現状「…」だけ。スピナー or アバター揺れ
      演出など
- [ ] **ストーリー章クリア時の演出** — 紙吹雪・章タイトルカード等の小演出
- [ ] **スマホ縦長レイアウト調整** — 特に設定モーダル内のキャラグリッド
      崩れ対応

### P3 — nice-to-have

- [ ] **駒を置く効果音** — ヒット音、勝利ファンファーレ。`/public/sounds/`
- [ ] **触覚フィードバック** — モバイルで石を置いた時の vibrate (Phase 4)
- [ ] **評価関数の高度化** — Edax のテーブル導入、終盤完全読み (Phase 4)
- [ ] **勝率・統計画面** — 既に saveSlots に集計データはある、表示 UI 追加
- [ ] **アクセシビリティ** — キーボード操作（v0.21.0 で棋譜リプレイ画面
      に ←/→/Space/Home/End を実装。盤面操作と全画面 toolbar への展開
      は未着手）、スクリーンリーダー対応

---

## ✅ Done (newest 20 only — 古いものは git log で追える)

- [x] **桜紙吹雪が描画されない不具合を inline SVG 化で修正**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — `<ChapterClearConfetti>` の petal を CSS
      `mask-image` 経由から inline `<svg>` 描画に変更。mask-image は
      モバイル Safari の旧版で silent fail することがあり、`fill=
      "currentColor"` のインライン SVG なら JS の color style がそのまま
      ストロークに反映される。視認性も底上げ: 36 → 48 枚、サイズ 18px
      → 18-30px ランダム、drop-shadow を追加。petal-{1,2,3}.svg の
      パスデータは PETAL_PATHS const に内包したので素材ファイルへの
      ランタイム依存はなし（仕様書通りに納品されたパスを保持）。`v0.23.2`
- [x] **リプレイ strip の視認性復帰（wagara が透けて見えていた）**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — v0.23.0 で stage-bg に和柄 watermark を
      敷いたら、`bg-zinc-950/60` の半透明 strip 越しに wagara が透けて
      しまい「2 段レイアウトが薄く見える」状態に。strip と注釈
      コメントブロックを `bg-zinc-950/90` に bump、stage-bg::after の
      wagara opacity を 0.55 → 0.35 に下げて、半透明 UI が背景パターン
      を拾わないように調整。`v0.23.1`
- [x] **motion-pass-1 素材の取り込み（ChatGPT 納品分）**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — `docs/ui_motion_assets.md` の 5 依頼が
      ChatGPT から到着、17 ファイルすべて仕様通り（SVG は `currentColor`、
      favicon は #c9a961 + #0a0805、wagara は asanoha 暫定採用）。
      `othello-game/public/{ornaments,textures}/` に配置し、CSS mask
      で petal / sumi / divider を SVG ベースに切替、`.stage-bg::after`
      に和柄 watermark を追加。`<BrushDivider variant="...">` コンポー
      ネントを新設し GameOver モーダル（victory / lives0）と replay help
      モーダルに配置。SumiThinking は 4 frame サイクル（350ms 間隔）に
      アップグレード。`v0.23.0`
- [x] **モーション・エフェクト第 1 弾（挿絵待ちの間の UX 底上げ）**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — 7 件のコード演出: (1) スコア数字
      ティッカー（`useAnimatedNumber` rAF interpolate）、(2) アクティブ
      パネル呼吸グロー、(3) 着手セルの金色 ripple、(4) Sumi-e 風 3-dot
      thinking インジケーター（`<SumiThinking>`）、(5) 章クリア桜
      紙吹雪 36 枚（`<ChapterClearConfetti>`）、(6) modal-card 入場
      `card-rise` + screen 遷移 `screen-fade`、(7) progress-bar の
      change-flash。素材依頼仕様 5 件（divider / petal / favicon /
      sumi brush / wagara tile）はプランファイルに記載済みで別 AI へ
      発注予定。`v0.22.0`
- [x] **リプレイ strip の jump-bad/good ボタンに色がつかない不具合修正**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — `.btn` クラスが inline `<style>` で `color`
      を直接指定しており、`text-orange-300/85` がボタンレベルで負けて
      いた。`ReplayIconButton` を改修して色クラスを **lucide SVG 自身**
      に渡すように（`iconClassName` prop に rename）。SVG の自身の
      color rule が currentColor 経由でストロークに勝つため、ヘルプ
      モーダルの説明と現物のアイコン色が一致するように。`v0.21.2`
- [x] **棋譜リプレイ strip を 2 段レイアウトに分割（ボタンはみ出し
      修正 + 視線導線改善）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) — 注釈
      付き棋譜を読み込むと jump-bad/good ボタンが枠から飛び出す不具合
      を修正。strip を「上段: counter + メタアクション（📜/✨/?/✕）
      / 下段: 再生コントロール（⏮◀▶/⏸ 速度 ▶⏭ ⚠👍）」の縦 2 段に
      再構成。読む→操作するの視線導線が自然になり、各行に flex-wrap
      も設定したので極端に狭い端末でも安全。`v0.21.1`
- [x] **棋譜リプレイ強化: 自動再生 + 速度セレクタ + 長押しヘルプ + ?
      モーダル + キーボードショートカット** — completed: 2026-05-03 —
      by: `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      `<ReplayIconButton>` 導入で全アイコンに 500ms 長押しのヘルプ
      ポップオーバー。Play/Pause + 速度サイクル（0.5x/1x/2x/4x）+ `?`
      ヘルプ一覧モーダル。デスクトップは ←/→/Space/Home/End で操作
      可能。`isAutoPlaying` / `autoPlayMs` state に functional-updater
      ベースの `setInterval` で `replayCursor` を進める。`v0.21.0`
- [x] **設定モーダル下部の二択ボタンを文脈依存で簡素化** — completed:
      2026-05-02 — by: `claude/othello-ui-autosave-bPnmY` — commit:
      (next push) — story モードでは bottom row 自体を非表示（章カード
      の play ボタンに統一）。free / 二人対戦 では「この設定で対局を
      始める」1 つだけに絞り、「この設定で続ける」を削除。前章 cursor
      と bottom button の関係が分からなくなる UX 問題を解消。`v0.20.1`
- [x] **設定画面に章ブラウザー（過去の章を進捗を変えずに閲覧・復習）**
      — completed: 2026-05-02 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — `chapterCursor` を導入。設定モーダル開封時に
      `storyProgress + 1`（クリア済みの最大章）に park。◀/▶ ナビゲーシ
      ョンで過去章を閲覧可能。「最新の章へ」で frontier に戻る。クリア
      済み章は free モードで対局し進捗不変、frontier 章は従来通り story
      モード。「ストーリーを最初から」は破壊的アクションとして小さく右
      下に格下げ。`v0.20.0`
- [x] **GameOver の「対戦棋譜を読み込む」を 1-click 化** — completed:
      2026-05-02 — by: `claude/othello-ui-autosave-bPnmY` — commit:
      (next push) — `loadCurrentMatchKifu` 追加。`currentSlotKeyRef` から
      自動保存スロットを直接ロードしてリプレイ画面へ飛ぶ。kifu ライブラ
      リを経由しない。`v0.19.1`
- [x] **棋譜・レビュー自動保存 + 注釈ハイライト強化 + GameOver から棋譜
      ライブラリへ** — completed: 2026-05-02 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: `7aefc4c` — 対局終了
      時に棋譜を自動保存し、レビュー生成完了時にも同じスロットへ自動で
      `reviewAnnotations` を patch（`updateSlot` 追加）。kifu モーダルから
      手動保存フォームを撤去、レビューモーダルから「保存」ボタンも撤去。
      QUALITY_STYLES のグローを inset+outer 二層化、`.quality-ring` を
      パルス付きで重ねて視認性を大幅向上。loadedKifuView 中の
      `last-move-ring` も明色＋強パルスにモード切替。GameOver モーダル
      （通常版・lives0 版）に「対戦棋譜を読み込む」ボタンと「タイトル
      へ戻る」ボタンを追加。`v0.19.0`
- [x] **棋譜読込時のコンパクト化 + 悪手/好手ジャンプボタン** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: (next push) —
      PlayerPanel に compact prop（quote 非表示、py 縮小、avatar sm）、
      フッターキャプション非表示、進捗バー mt-7→mt-3。リプレイストリップ
      に AlertTriangle / ThumbsUp ボタンで cycle-and-wrap ジャンプ。`v0.18.1`
- [x] **構造化レビュー（盤面アノテーション + コメント）** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: (next push) —
      Claude tool-use で per-move quality + comment を取得、リプレイ中の
      盤面に色付きグロー、現在手のコメントをストリップ下に表示、レビュー
      モーダルは summary + improvements + クリックジャンプ可能な注釈
      リスト構成。`v0.18.0`
- [x] **棋譜リプレイ UI を盤面下にインライン化 + アイコン化** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: `cb160b8` —
      盤面に被らず、ボタンは全部アイコンのみ。`v0.17.1`
- [x] **棋譜リプレイビューワー（Track B）** — completed: 2026-05-02 — by:
      `claude/othello-game-sHVBZ` — commit: `34eec4f` — ⏮◀▶⏭ + 手数カウンタ
      + 保存レビュー閲覧ボタン
- [x] **マルチセッション main-as-trunk ワークフロー** — completed: 2026-05-02
      — by: `claude/othello-game-sHVBZ` — commit: `a11619a` — main を統合点
      にする運用を CLAUDE.md セクション 0 に明記
- [x] **棋譜読込時の opponent 復元 + レビュー切れ修正** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: `8f0f62f` —
      computerChar/level 復元、SSE 終端 flush、max_tokens 1500→3000
- [x] **棋譜読込が次章勝利として誤記録されるバグ修正** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: `dc711df` —
      loadedKifuView ガード追加
- [x] **デプロイ検証用ビルドタグ表示** — completed: 2026-05-02 — by:
      `claude/othello-game-sHVBZ` — commit: `cc4e272` — タイトル画面下に
      `vX.Y.Z · <fix-name>` 表示
- [x] **デフォルト主人公アバター + 隠れキャラ 20 体ロック** — completed:
      2026-05-02 — by: `claude/othello-game-sHVBZ` — commit: `d1cbd93` —
      全章クリアで 20 体解放
- [x] **gameOver モーダルが直前の相手を表示する fix** — completed:
      2026-05-02 — by: `claude/review-othello-mock-HTX9b` — commit:
      `68566c1` — opponentSnapshot 導入
- [x] **レビューを棋譜と一緒に保存・後で閲覧** — completed: 2026-05-02 —
      by: `claude/review-othello-mock-HTX9b` — commit: `a94ef5f` —
      saveGame schema に review?: string 追加
- [x] **ライフ 0 時の専用 GAME OVER 画面** — completed: 2026-05-02 — by:
      `claude/review-othello-mock-HTX9b` — commit: `80f58a1`
- [x] **黒プレイヤーパネルに残ライフ表示** — completed: 2026-05-02 — by:
      `claude/review-othello-mock-HTX9b` — commit: `7783e9e`
- [x] **設定モーダル内に save-slot 切替** — completed: 2026-05-02 — by:
      `claude/review-othello-mock-HTX9b` — commit: `be1a88e`
- [x] **Save slot + lives 機構 + stats 記録** — completed: 2026-05-02 —
      by: `claude/review-othello-mock-HTX9b` — commit: `d8e7323`

---

## 💡 Idea Backlog (no commitment)

- オンライン対戦（WebSocket / WebRTC）
- Capacitor で APK ビルド (Phase 3)
- Cloudflare Workers プロキシのレートリミット (KV 利用)
- 棋譜のエクスポート（標準オセロ記法 / GGS 形式）
- 棋譜の二人対戦リプレイ共有（URL に詰めるエンコーダ）
- AI レベル選択時の対戦相手プロフィール表示（フリーモード）
- ストーリーの分岐エンディング（隠しキャラ全解放後）
- 難易度別チュートリアル（最初の 1〜3 章を解説付きで）

---

## 運用メモ

**コンフリクト予防**: 自セッションが触る Todo / In Progress 行の周辺だけ
編集する。他セッションが In Progress に積んでるタスクは絶対に消さない。
1 タスクの状態変化ごとに 1 commit で push して、相手が察知できるように。

**Done の整理**: 21 個目以降は削除して履歴肥大を防ぐ。詳細を追いたい
ときは git log を使う。
