# Development Backlog — 転生したらオセロ世界でした！

> 2 つの Claude Code セッション（`claude/othello-game-sHVBZ` と
> `claude/review-othello-mock-HTX9b`）が共有する作業ボード。
> 詳細運用は [`othello-game/CLAUDE.md`](othello-game/CLAUDE.md) の
> 「0. セッション開始時の必須手順」を参照。

Last updated: 2026-05-02 by `claude/othello-game-sHVBZ`

---

## 🔥 In Progress

なし。

---

## 📋 Todo (priority order)

### P1 — バグ・ブロッカー

なし。Track B（棋譜リプレイ UI）は完了して live に反映済み。

### P2 — 重要な機能改善

- [ ] **App.tsx の分割リファクタ** — 単一ファイル ~2300 行。`components/`
      `data/` `lib/` 構成へ。CLAUDE.md セクション 12 に旧設計案あり
- [ ] **AI 思考中の UI 改善** — 現状「…」だけ。スピナー or アバター揺れ
      演出など
- [ ] **ストーリー章クリア時の演出** — 紙吹雪・章タイトルカード等の小演出
- [ ] **スマホ縦長レイアウト調整** — 特に設定モーダル内のキャラグリッド
      崩れ対応
- [ ] **棋譜リプレイの自動再生（▶ Play）** — 1 手/秒で進む再生ボタン

### P3 — nice-to-have

- [ ] **駒を置く効果音** — ヒット音、勝利ファンファーレ。`/public/sounds/`
- [ ] **触覚フィードバック** — モバイルで石を置いた時の vibrate (Phase 4)
- [ ] **評価関数の高度化** — Edax のテーブル導入、終盤完全読み (Phase 4)
- [ ] **勝率・統計画面** — 既に saveSlots に集計データはある、表示 UI 追加
- [ ] **アクセシビリティ** — キーボード操作、スクリーンリーダー対応

---

## ✅ Done (newest 20 only — 古いものは git log で追える)

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
