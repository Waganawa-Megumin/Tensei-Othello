# Development Backlog — 召喚されたらオセロ世界でした！

> 2 つの Claude Code セッション（`claude/othello-game-sHVBZ` と
> `claude/review-othello-mock-HTX9b`）が共有する作業ボード。
> 詳細運用は [`othello-game/CLAUDE.md`](othello-game/CLAUDE.md) の
> 「0. セッション開始時の必須手順」を参照。

Last updated: 2026-05-07 by `claude/game-overview-docs-DjBxK` (v0.36.41 save-point Design A)

---

## 🔥 In Progress

- [ ] **PLR 別 挿絵 + ストーリー 完全フォルダ管理 + 必発火 (PLR02 美琴 パイロット, v0.36.55)** —
      owner: `claude/othello-ui-autosave-bPnmY` — started: 2026-05-08 —
      `public/illustrations/` を `_shared/` + per-PLR フォルダ (`PLR02_mikoto/` 等) に再編。
      `NarrativeScene` に `imageBasePath?` を追加して per-PLR 上書き。`NarrativeOverlay` に
      二段 fallback (PLR-specific → `_shared`) と `isReplay` 用「スキップ ▶」ボタンを実装。
      GameOver "次の章" の `!hasSeenOverlay` ゲートを撤去して必発火化、`startStoryChapter`
      に章ブラウザ直行用 mid-route insert chain を追加。`getOrderedArchiveScenesForPlr` の
      off-by-one (mid-route が milestone+1 でないとアーカイブに載らない) を修正。
      PLR02 美琴の narrative 4 シーン (solitude / allies / final / chainStepEnding) を
      ja/en に流し込み、`PLR02_mikoto/spec.md` 作成。
      `docs/handoff/per_plr_narrative_concept.md` を作成し Claude chat ↔ ChatGPT への
      画像生成プロンプトハンドオフ文書として整備。Plan: `~/.claude/plans/goofy-purring-neumann.md`。

---

## 📋 Todo (priority order)

### P1 — バグ・ブロッカー

なし。endgame freeze は v0.33.5〜v0.33.9 で根本治療済 (engine
無罪確認 fuzz 835 ゲーム + gameOver effect 無限ループの useRef 修正)。

### P2 — 重要な機能改善

- [ ] **棋譜・診断ログの IndexedDB 移行** — 診断ログは v0.33.7 で
      localStorage の ring buffer (200 件 ≈ 50KB) に着地済。棋譜は
      引き続き localStorage `othello:save:{ts}` 単発キーで保持中。
      長期的には IndexedDB に統一して: (1) 棋譜全件保存 (現在は
      ストレージ圧迫を避けるため古いものから削除されがち)、(2) 診断
      ログを 2000 件規模に拡張 (フリーズ前の 30 分相当のイベント)、
      (3) `navigator.storage.persist()` で永続化要求。スキーマ
      バージョン v=1 で diagLog ring buffer が出ているので、移行時は
      legacy detect → import → DB に書き戻し → localStorage クリア。
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
- [ ] **App.tsx の分割リファクタ** — 単一ファイル ~6300 行 (v0.34.4
      時点)。`components/` `data/` `lib/` 構成へ。CLAUDE.md セクション
      12 に旧設計案あり
- [ ] **AI 思考中の UI 改善** — 現状「…」だけ。スピナー or アバター揺れ
      演出など
- [ ] **ストーリー章クリア時の演出** — 紙吹雪・章タイトルカード等の小演出
- [ ] **スマホ縦長レイアウト調整** — 特に設定モーダル内のキャラグリッド
      崩れ対応
- [ ] **真エンディングルート手動 QA 完走** —
      `othello-game/docs/qa/true_ending_test_scenarios.md` の T-01〜T-09
      を実機で実施。LocalStorage 検証手順込みで合計約 100 分のテスト。
      v0.34.x で gameover-loop-fix 後の挙動を保証する重要な
      regression セット。
- [ ] **PLR01 名言の i18n 反映 (B-003)** — PLR01 英霊ハルキの名言が
      `players/PLR01_haruki_heroic/spec.md` で確定 (日「変分は、お前
      自身が紡ぐもの」/ 英 "The variations are yours to weave.") も、
      i18n の `AVATARS_DATA[20].quote` / `quote_en` には未反映。spec
      → 実装 への流し込みが必要。

### P3 — nice-to-have

- [ ] **駒を置く効果音** — ヒット音、勝利ファンファーレ。`/public/sounds/`
- [ ] **触覚フィードバック** — モバイルで石を置いた時の vibrate (Phase 4)
- [ ] **評価関数の高度化** — Edax のテーブル導入、終盤完全読み (Phase 4)
- [ ] **勝率・統計画面** — 既に saveSlots に集計データはある、表示 UI 追加
- [ ] **アクセシビリティ** — キーボード操作（v0.21.0 で棋譜リプレイ画面
      に ←/→/Space/Home/End を実装。盤面操作と全画面 toolbar への展開
      は未着手）、スクリーンリーダー対応
- [ ] **OPP22 in-battle 統合 (Phase 4 follow-up)** — Phase 4 Step 3 で
      i18n + storage + archive + unlock gate は完成済。残るは free-mode
      で OPP22 を選択した時の UX 配線: (1) `voidphi_intro_seen` flag
      で初回戦闘前に `t.story.opp22.intro` を NarrativeOverlay 再生 +
      flag 立て + `markOverlaySeen('narrative:opp22.intro')`、(2) 戦闘
      画面で `t.story.opp22.bossPre` を pre-match バナー表示 (chapter
      card にあたる UI を OPP22 用に作る)、(3) GameOver モーダルで
      `t.story.opp22.bossPost.{victory,defeat}` 表示、(4) 勝利時に
      `t.story.opp22.victoryNarration` を NarrativeOverlay 再生 +
      `markOverlaySeen('narrative:opp22.victoryNarration')`。
      現状でも archive (シーン回想) 経由でテキストは全て再生可能。
- [ ] **Phase 4 音設計 (Step 4.5-A〜D, Phase 4 follow-up)** — Phase 4
      Step 3 の zip に同梱されていた `sound_design/` 仕様 + 4 ステップ
      指示書の実装。デフォルト OFF の opt-in 方式、SoundManager コア +
      設定 UI + 24+ 音種類 + iOS Safari AudioContext 対応 + CC0/CC-BY
      素材 (Freesound / OpenGameArt 等) 収集。素材入手と実装で 6-8
      時間規模。

---

## ✅ Done (newest 20 only — 古いものは git log で追える)

- [x] **GUI 画面サイズ追従 + ヴォイドφ横画像 確認 (v0.36.54)** —
      completed: 2026-05-08 — by: `claude/othello-ui-autosave-bPnmY` —
      コード変更なし、機能確認のみ。ユーザー要望「PC ブラウザの
      ウィンドウサイズに合わせてシーンが出力されるか / 全画面強制では
      ないか / ヴォイドφに横画像はあるか」への回答として実装を点検:
      (1) `src/hooks/useMediaQuery.ts:11-29` が
      `MediaQueryList.change` を listen するためリサイズ即時に
      orientation を再評価、`NarrativeOverlay` / `PrologueScreen` /
      `FallingScreen` / `ArrivalScreen` / `GatewayClosed/OpenScreen` /
      `ChapterIntroScreen` / `ChapterStoryOverlay` / `TitleScreen` /
      `App.tsx ChapterArt` の全 narrative・intro・banner で共通利用、
      stale state なし。(2) `fixed inset-0` でブラウザ viewport を
      埋めるのみで OS fullscreen 強制なし (`requestFullscreen()` 呼出
      0 件)、PWA manifest も `display:'standalone'` /
      `orientation:'any'`。(3) 挿絵 30 枚すべてに landscape /
      portrait pair 完備、ヴォイドφの横画像も
      `chapter_20d_voidphi-landscape.png` (1920x1080 / 3.8MB) 存在
      確認。標準デスクトップ 16:9 環境では landscape 画像
      (1920x1080) と viewport がほぼ一致するため `object-cover`
      クロップは最小。極端なアスペクト比 (21:9 / 4:3) でのクロップ感や
      極小ウィンドウでのテキスト過大は次タスク候補としてプラン B/C/D
      に記録。
- [x] **セーブポイント全面整理 (Design A: 各 PLR が章 1-20 を replay) (v0.36.41)** —
      completed: 2026-05-07 — by: `claude/game-overview-docs-DjBxK` —
      commit: `9aef36b` (feature) + `b2d395c` (merge) —
      ユーザー指摘「セーブポイントの表記とロジックと実際の画面遷移が
      ぐちゃぐちゃでわかりにくい」(スクリーンショット 4 枚付き) を
      きっかけに 4 点修正: (1) PLR slug を厳格表記、(2)「まで」/「進行」
      撤去、(3) 章上限 PLR01 のみ 0..21 / 他 0..20、(4) chain 進行で
      save-point identity を auto-advance。ユーザー判断 = Design A:
      内部 storyProgress も chain 進行で 0 リセット → 各 chain step
      PLR が自身の章 1-20 lap を全走 (約 421 試合)。v0.36.26 で導入した
      Design B (各 chain step は章 20 のみ) を本タスクで切替。
      実装: `recordSlotResult` で chain step ch.20 win 時に sp=0 リセット /
      新 helper `normalizePostClearState` で legacy slot を正規化 /
      `migrateSlot` の avatarIdx validation 0..20 拡張 (PLR01 idx=20 許容) /
      新 pure helper `getSavePointDisplay(slot, avatars)` で
      (plrSlug, plrName, chapter, chapterMax) を導出 / i18n
      `slotProgress` + `slotInUseFooter` シグネチャ書換し
      `${slug} ${name}・第${ch}章（${ch}/${max}）` 形式に統一 /
      SlotPicker / TitleScreen / 設定パネル / castSpell の呼び出し更新 /
      chapter browser の `isComplete` ゲートを `trueEndingAchieved` に統一。
      tests: saveSlots.test.ts に normalizePostClearState (4) +
      slugFromAvatarImage (6) + getSavePointDisplay (7) + 既存 chain-advance
      アサーション更新で 78→96 ケース。docs: CLAUDE.md §4.2 / master_world.md
      v1.3 / GAME_OVERVIEW.md §3.2/§3.3 同期。検証: typecheck pass /
      96 tests pass / build OK (435 kB JS, 288 PWA precache)。
      BUILD_TAG `v0.36.39` → `v0.36.41` (.40 は並行セッションで使用済)。
      Plan: `/root/.claude/plans/plr00-20-iridescent-hartmanis.md`。

- [x] **PLR01 アンロック条件 世界観整合 + 実装修正 (v0.36.29)** —
      completed: 2026-05-07 — by: `claude/game-overview-docs-DjBxK`
      — commit: `928bf87` (feature) + merge resolution (BUILD_TAG bumped to .29 to avoid clash with concurrent .26-.28 spell-fresh-reset chain landed on main) —
      ユーザー指摘「英霊ハルキは PLR20 で章 20 クリアしないと解放
      されないはず」をきっかけに 3 重食い違いを発見: (a) コード実体
      は `slotBefore.storyProgress === 19` ガードで 1 スロットあたり
      unlockedCount 最大 +1、PLR01 は事実上 spell warp 専用、(b) GAME_
      OVERVIEW.md / CLAUDE.md / master_world.md は「PLR00 で章 20
      クリア → PLR01 即解放」、(c) WORLD_BIBLE / part4 は「PLR02〜
      PLR20 全 19 体での章 20 制覇後、最後の特別枠として PLR01 召喚」。
      ユーザー判断で世界観 (c) を正として実装とドキュメントを統一。
      実装: `SaveSlot.avatarsClearedCh20: number[]` (chain step 蓄積)
      + `unlockedCount = avatarsClearedCh20.length` 派生 / 純関数
      `reconcileAvatarsCleared` で legacy slot back-derive / `record
      SlotResult` に `playerAvatarIdx` 引数追加し ch.20 win 時に
      atomic +1 / `castSpell` で `unlockedCount` と同期書き込み /
      App.tsx gameOver 効果は returned slot 差分で unlock UI 発火。
      新規 `saveSlots.test.ts` 12 ケース (reconcile 5 + chain 6 +
      migration 1)。docs: GAME_OVERVIEW.md §3.2/§3.3/§4.3 / CLAUDE.md
      §4.2 / master_world.md §3.3/§4.2/§4.3/§6/§10.1 + v1.2 改訂履歴。
      検証: typecheck pass / 78 tests pass (66+12) / build OK
      (433 kB JS, 288 PWA precache)。BUILD_TAG `v0.36.28 · prologue-
      seen-chip` (post-merge) → `v0.36.29 · plr01-chain-unlock`。

- [x] **呪文機能 統合監査 + Phase 1+2 修正 (v0.36.20)** —
      completed: 2026-05-08 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `072c6c1`. v0.36.11〜v0.36.19 で累積した小さな歪みを
      まとめて整理。castSpell の戻り値を discriminated SpellResult
      化し、失敗メッセージを cipher / format / noSlot / ch21NotPlr01
      の 4 種に分岐。lives ハードコード `3` を `INITIAL_LIVES` (= 5)
      に修正、戦績 (totalGames / wins / losses / draws / resigns /
      vsOpponent) もリセットして spell-warp が「完全クリーン」セマン
      ティクスを持つように。非 PLR01 で CC=21 を reject。bare cipher
      cast に確認ダイアログを追加し OK でヴォイドφ cinematic を
      自動再生。IntroSequence の `firstTime` を `hasSeenOverlay
      ('prologue')` でゲートし、`…XX01` warp 後の prologue 再生を
      防止。呪文モーダルに対象スロット表示 + submit disable。
      SlotPicker の各行に per-row 🪄 ボタン (該当スロットを active
      にしてから modal を開く)。spellSuccess を関数化して適用後の
      PLR + 章を echo。slotInUseFooter を「現キャラ：…」/「Avatar:
      …」に微調整。Phase 3+4 (POST_TRUE_ENDING_CHAPTER 定数化 /
      SPELL_SPEC.md / unit test 等) は follow-up として保留。

- [x] **Phase 4 Step 3: ヴォイドφ覚醒シネマ + シナリオ統合 + アンロック
      ゲート分離 (v0.36.0)** — completed: 2026-05-06 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (this push) —
      Phase 4 Step 3 アップデートセット投入。ZIP 同梱のドラフト
      (`drafts/i18n/`, `drafts/code/code_skeleton.ts`,
      `drafts/scenarios/voidphi_scenario_v1.md`,
      `specs/master_world_§5.5_extension.md`) を参考に、
      シナリオ + ロジックを 1 commit に集約 (10 commit 推奨を
      セッション内集約)。新規型: `StoryContent.narrative.trueEnding20D`
      (NarrativeScene) + `StoryContent.opp22` (intro / bossPre /
      bossPost.victory / bossPost.defeat / victoryNarration の 5
      ブロック)。新規 OverlayKey: `narrative:trueEnding20D` /
      `narrative:opp22.intro` / `narrative:opp22.victoryNarration`。
      新規 storage helper:
      `getVoidphiAwakened`/`setVoidphiAwakened` +
      `getVoidphiIntroSeen`/`setVoidphiIntroSeen` (`saveSlots.ts`、
      Phase 3 の trueEnding helper と同じパターン)。i18n 追加:
      `narrative.trueEnding20D` + `narrative.opp22.*` を ja/en で
      合計 約 1500 字のシナリオ流し込み (drafts/scenarios と一致)。
      連鎖発火: `trueEnding20C` の dismiss handler で
      `!voidphiAwakened` チェックして `trueEnding20D` へ chain。
      20-D dismiss で `setVoidphiAwakened(true)` + state 更新 +
      logDiag('voidphi.awakened') + `markOverlaySeen`。アンロック
      ゲート分離: OPP 選択画面の isLocked 判定を
      `c.level === 22 ? !voidphiAwakened : !trueEndingAchieved` に
      変更し OPP21 と OPP22 を別フラグ管理。Archive 拡張:
      `getOrderedArchiveScenes` 第 4 引数に `voidphiAwakened` 追加、
      20-D は voidphiAwakened ベース、opp22.intro/victoryNarration は
      seen-flag ベース (in-battle 統合 follow-up までの暫定)。
      レビューチェーン: 各 NarrativeOverlay に `chapter_20d_voidphi`
      imageBaseName を渡す ($/illustrations/chapter_20d_voidphi-
      \{landscape,portrait\}.png$ を Phase 4 Step 2 から流用、
      LS+PT を illustrations/ にも配置)。i18n
      archiveSceneLabels に 3 ラベル追加 (ja/en)。CLAUDE.md §7
      を 4 段化に更新、§4.1 OPP22 説明を voidphiAwakened ガートに
      更新。スコープ外 (P3 として保留): OPP22 in-battle 統合
      (intro/bossPre/Post の戦闘画面表示)、Phase 4 音設計 (12
      ステップ実装)。検証: typecheck pass / 66 tests pass / build OK。

- [x] **Phase 4 Step 2: ヴォイドφ覚醒シネマ挿絵 LS+PT (v0.35.1)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `e55efd5` —
      Phase 4 Step 2 アップデートセット (`update_set_phase4_step2.zip`)
      投入。ヴォイドφ覚醒シネマ (章 20-D) 用フルスクリーン挿絵 3
      ファイル新規追加: `chapter_20d_voidphi-landscape.png`
      (1920×1080, 3.8MB, 横長構図、左に巨大黄金螺旋、右に渦巻銀河、
      ヴォイドφ中央〜右配置で左手から黄金螺旋へ光ほとばしる) /
      `chapter_20d_voidphi-portrait.png` (1080×1920, 3.4MB, 縦長
      構図、上部銀河、下部 φ 記号、全身像、縦に走る黄金螺旋が
      キャラ全体を貫く、下 1/4 はテキストオーバーレイ用) /
      `illustrations/chapter_20d_voidphi.png` (LS 流用)。
      アセット生成パイプライン: ChatGPT (GPT-4o + DALL-E 3) で
      OPP22 character.png を参照画像投入 → プロンプト v2 で
      1672×941 / 941×1672 出力 → Pillow LANCZOS で 1920×1080 /
      1080×1920 にアップサンプル。本セットだけでは UI 上に新
      挿絵は表示されず、Phase 4 Step 3 (シナリオ + ロジック)
      投入時に NarrativeOverlay 経由で自動表示される設計。
      PWA precache 219 → 222 entries (+3 PNG, +5.1 MB)。

- [x] **Phase 4 Step 1: OPP22 ヴォイドφ 正アセット投入 + stopgap 撤去
      (v0.34.7)** — completed: 2026-05-06 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (this push) —
      Phase 4 Step 1 アップデートセット (`update_set_phase4_step1.zip`)
      投入。OPP21 暫定共用だった OPP22 を専用アセットに差し替え。
      新規: `public/avatars/opponents/OPP22_voidphi/` に
      character.png (1.5MB, 1024×1024 RGBA, 銀髪・紫眼の神格的青年、
      黒地に黄金螺旋幾何学装束、左手にフィボナッチ螺旋) /
      background.png (1.8MB, 1024×1024 RGB, 深紺漆黒の宇宙、大きな
      黄金螺旋、星雲銀河光、紫の宇宙光、φ 記号) / icon.png (1.9MB,
      1024×1024 RGBA, 円形クロップ済合成版) / spec.md v3 (確定版)
      の 4 ファイル配置。`COMPUTERS_DATA` の Lv.22 image path を
      `OPP21_zero_unmasked/icon.png` から `OPP22_voidphi/icon.png` に
      切替 + コメント文を「Phase 4 Step 1 で確定済」に更新。
      v0.34.6 で入れた AvatarBadge の `kanji === 'φ'` CSS tint
      stopgap (hue-rotate + cyan/violet glow) は不要になったので
      ロジック撤去 — 通常の `<img>` レンダーパスに統一。CLAUDE.md
      §4.1 の OPP22 行から「※暫定」記述を削除、フォルダ数表記を
      「全 21」→「全 22」に更新。スコープ外 (Phase 4 Step 2/3 で
      別投入): 章 20-D シネマ挿絵、`voidphi_awakened` /
      `voidphi_intro_seen` LocalStorage フラグ、シナリオ
      (intro/bossPre/bossPost/victoryNarration)、アンロック判定の
      `trueEndingAchieved` → `voidphiAwakened` 切替、master_world
      v1.2 更新。typecheck / 66 tests / build pass。

- [x] **OPP22 ヴォイドφ の視覚差別化 CSS stopgap (v0.34.6)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `ac05b8a` —
      ユーザー報告「ヴォイドφ アイコンが OPP21 と区別がつかない」。
      正アセット (Phase 4 で予定) 投入までの応急処置として、
      AvatarBadge に `kanji === 'φ'` 検出を追加し、世界観 (神格化
      されし秩序 / φ の波動の狭間) に沿った CSS treatment を適用:
      filter (`hue-rotate(205deg) saturate(0.6) contrast(1.18)
      brightness(0.9)`) で暖色素顔を冷色 violet/cyan にシフト、
      radial-gradient overlay (mix-blend-mode: screen) で紫青グロー、
      inset box-shadow で内側 violet 発光。同じ素材を使っていても
      OPP21 と OPP22 が明確に別キャラとして読めるように。BACKLOG
      P3 「OPP22 正アセット差し替え」項目に stopgap 適用済の注記を
      追加。Phase 4 Step 1 (v0.34.7) で本アセットが入ると同時に
      この stopgap は撤去予定 (今回履歴のみ Done に残す)。

- [x] **真エンディング判定を justClearedStory ゲートから切り離し
      (v0.34.5)** — completed: 2026-05-06 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: `2b320a0` —
      ユーザー報告: 英霊ハルキ (PLR01) で章 20 をクリアしてもシーン
      回想に trueEnding20B/20C が掲載されない。根本原因: trueEnding
      判定が `justClearedStory = result==='win' &&
      slotBefore.storyProgress === 19` に依存していた。PLR01 アン
      ロックは PLR00 で ch.20 クリア後の特典なので、PLR01 切替時点
      で slot.storyProgress は既に 20。PLR01 で ch.20 を再挑戦して
      勝っても slotBefore.storyProgress=20 のままで gate が通らず、
      `trueEndingAchieved` が立たなかった → 20-B/20-C シネマ未発火、
      OPP21/22 アンロック未解除、シーン回想に真エンディング項目
      なし。修正: trueEnding 判定を `justClearedStory` から完全に
      切り離し、`wonChapter20 = result==='win' && opponentLevel===20`
      + `ranAsPLR01` + `!trueEndingAchieved` のシンプルな AND
      条件に。`isStory && activeSlotId !== null` ガードからも外し、
      章 cursor 経由の free モード replay も拾えるように。
      `gameMode === 'ai'` チェックだけ残して 2 人対戦は除外。冪等性
      は `!trueEndingAchieved` で確保。次に PLR01 で ch.20 に勝つと
      シネマ発火 + OPP21/22 解放 + archive に真エンディング 2 項目
      追加が連鎖する。typecheck / 66 tests / build pass。

- [x] **v1.1 ドキュメント整備パッチ投入 (master_world / MASTER_CHAR /
      progress / spec / QA)** — completed: 2026-05-06 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: `d105c57` —
      Phase 3 完了後のドキュメント整備パッチ
      `update_set_2026-05-06_v1.1` を投入。コードやアセットは含まず
      ドキュメントのみ 5 ファイル (BACKLOG.md は既存温存)。新規:
      `master_world.md` (409 行 v1.1, OPP21/22 構造整合 + 章 20-B/20-C
      シネマフロー + PLR01 名言確定) / `MASTER_CHAR_INSTRUCTIONS.md`
      (296 行) / `progress_tracker_chars.md` (150 行) /
      `qa/true_ending_test_scenarios.md` (385 行, T-01〜T-09 手動 QA)。
      上書き: `players/PLR01_haruki_heroic/spec.md` 名言欄を確定値に
      (日「変分は、お前自身が紡ぐもの」/ 英 "The variations are
      yours to weave.")。配置先は実装パスに合わせて
      `othello-game/public/avatars/players/...` に修正 (推測パス
      `avatars-package/...` ではなく)。

- [x] **GameOver の棋譜閲覧 × ボタンが GameOver に戻るよう修正 (v0.34.4)**
      — completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `0c22deb` —
      ユーザー報告: GameOver から「対戦棋譜を読み込む」で replay に
      入って × を押すと、新しい対局が始まってしまう。原因: × ハンドラ
      が story モード時 `setScreen('intro')` / それ以外で `reset()`
      を呼ぶ設計で、GameOver から来たケースを区別していなかった。
      修正: 新 state `cameFromGameOver` を追加、`loadCurrentMatchKifu`
      で flag を立てつつ `lastResult`/`resigned` を stash → 復元
      (loadKifuMoves が clear するので)、replay strip × ハンドラ冒頭
      で flag をチェックして true なら `setLoadedKifuView(false)` +
      flag クリアだけ実行 → 既存 `gameOver && !loadedKifuView` ゲート
      で GameOver モーダルが自動再表示される。`reset()` で flag を
      クリアし新対局に持ち越さない。通常の棋譜ライブラリからの読込
      パスは flag を立てないので影響なし。

- [x] **GameOver の review/replay ボタン格上げ (v0.34.3)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `81d2ee7` —
      ユーザー報告「ボタンが下すぎる + 小さすぎる」+ 「棋譜レビュー /
      再生作業もできていい」。両 GameOver モーダル (lives=0 + 通常)
      の review/replay ボタンを下の小さい flex-row から上部の専用
      セクション「— 対局を振り返る —」に格上げ。2 カラム grid で
      大きめ (px-3 py-3, border 強調)、ヒント文 (`gameOverReviewHint`)
      で何ができるか明示、border-b 区切り線で「振り返り」と「次の
      一手」を視覚分離。機能は既存の `startReview()` (Claude API
      レビュー) と `loadCurrentMatchKifu()` (loadedKifuView=true に
      切替 → replay strip + 自動再生 UI) を再利用、新 API 無し。
      i18n: `gameOverReviewSection` / `gameOverReviewHint` を ja/en
      で追加。

- [x] **archive 絵→テキストの art-first 化 + 序章 5 シーン追加 +
      scroll reset (v0.34.2)** — completed: 2026-05-06 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: `4155e0c` —
      ユーザー報告: 絵の上に直接テキストが乗って雰囲気台無し / 序章
      の最初 (教室・落ちる) など全シーンをページ送りで観たい /
      ページ送りでスクロールが下のままになる。修正: NarrativeOverlay
      と ChapterStoryOverlay を `useTapToReveal` パターンに refactor
      し、in-game の PrologueScreen と同じ 2 phase (絵 + tap hint →
      タップで本文フェードイン) に統一。OverlayKey に
      `intro:falling` / `intro:arrival` / `intro:gatewayClosed` /
      `intro:gatewayOpen` を新設、`getOrderedArchiveScenes` の先頭で
      序章 5 シーンを並べる (prologue seen flag で gating)。各 intro
      画面に `nextLabel?` プロップを追加し archive 時のみ「次の
      シーンへ →」/「閉じる」に上書き、in-game 挙動は不変。各 review
      overlay に `key={review.index}` を付与し、index 変化のたびに
      unmount/remount → scroll 位置 + tap-to-reveal phase + 画像ロード
      状態が毎ページ初期化される。仕上げ: 画面右上 × close (z-90)
      でいつでも soft exit、画面左上に「シーン X / Y」ページ
      カウンタチップ。archive 最大シーン数 31 (序章 5 + 各章 20 +
      幕間 3 + ED + 真 ED 2)。

- [x] **archive 章別シナリオ追加 + シームレス連続再生 (v0.34.1)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `1ed2373` —
      ユーザー報告: 設定の章 cursor が 1 に戻る / シーン回想に幕間
      しか出ない (クリア済の全章を観たい) / 進むボタンでシームレスに
      繋げて再生したい。修正: 章 cursor 初期位置を「現在プレイ中の
      章 = `level`」に変更 (進行中は `storyProgress + 1`、完走済は
      `level`)。`ArchiveScene` 判別共用体型を新設 (`overlay` /
      `chapter`)、`getOrderedArchiveScenes()` で時系列リスト
      (prologue → ch1..10 → solitude → ch11..15 → allies →
      ch16..19 → final → ch20 → ending → trueEnding20B/C) を生成。
      `App.tsx` の `reviewOverlay` を `review: { scenes, index } | null`
      に拡張、archive モーダルから任意 index で開始 → dismiss で
      advance / close を判断、各 overlay/chapter 用の component を
      switch でレンダー。「▶ 最初から連続再生」ボタンを archive
      上部に追加。新規 `ChapterStoryOverlay.tsx` は章別挿絵 (LS/PT)
      を背景に「Chapter N + vs キャラ名」ヘッダ + 5 ブロック
      (導入/対局前/対局直後/勝利の言葉/余韻) で構造化表示。i18n に
      `archiveNextLabel` / `archivePlayAllLabel` / 章ラベル + 章見出し
      functor 2 種 / 5 ブロック heading を ja/en で追加。

- [x] **GameOver 出口戦略強化 (v0.34.0)** — completed: 2026-05-06 —
      by: `claude/othello-ui-autosave-bPnmY` — commit: `55c7a9c` —
      レビュー指摘 5 件をまとめて対応: A. 両モーダル右上に × close
      ボタン追加 → `gameOverDismissed=true` でモーダル非表示、画面
      下部に「▲ 対局結果を再表示」バナーで簡単に呼び戻せる、
      `kifu.length=0 && !gameOver` リセット効果と `reset()` 関数の
      両方で flag を確実にクリア。B. 「タイトルへ戻る」が `reset()`
      併用 → in-memory state (board / kifu / gameOver) を確実に
      クリアして次回エントリをクリーンに (slot は localStorage 保持
      なので影響なし)。C. `resetStoryProgress()` に `window.confirm`
      ダイアログ追加 — 進捗・残機・戦績・既読シナリオが全部消える
      前に明示確認。D. lives=0 + draw のフォールバック警告は既存
      `livesGameOverWarning` がカバー (新規不要)。E. GameOver Screen
      に「進捗 X/20 / W-L-D / 解放アバター X/20」の 3 列 grid 戦績
      サマリ追加。i18n: gameOverViewBoard / gameOverReopenBanner /
      resetStoryProgressConfirm / gameOverStatsProgress / Record /
      Unlocks を ja/en で。

- [x] **gameOver effect 無限ループの useRef gate 修正 (v0.33.9)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `3383d1f` —
      ユーザーから 1 秒間に 200 回連続で `gameOver` イベント発火する
      診断ログ (v0.33.7 logDiag 経由) を受領、根本原因特定。原因:
      `recordSlotResult().then(setSlots)` がエフェクト内で fired
      されるたびに `slots` ref が新しくなり `activeSlot` (deps) が
      更新 → エフェクト再発火、というループ。本来は
      `setResultRecorded(true)` で次の closure が `resultRecorded=true`
      を読んで早期 return すべきだが、batching と closure 取得タイミング
      の組み合わせで stale な `false` のまま読まれて gate が通り抜け、
      logDiag → setStates → さらに churn 悪化を 5ms cadence で繰り返し
      ていた。修正: `resultRecordedRef = useRef(false)` を追加し、
      エフェクト本体冒頭で同期書き込み (`resultRecordedRef.current =
      true`)。React の batching と独立に同期コミットされるので、再
      発火しても closure の中の ref は必ず true。state の
      `resultRecorded` も従来通り維持し、UI 他ロジック (依存配列で
      re-render 経路の認識) には影響なし。リセット (`kifu.length=0
      && !gameOver` 効果) と `loadKifuMoves` でも ref を一緒に切替。
      副次バグも同 commit で修正: archive で `'ending'` キーが
      markOverlaySeen されない / 幕間 narrative が × で閉じられた人は
      seen にならない、の二重バグで完走者でも archive がほぼ空。
      `getSeenOverlays` → `getArchiveScenes(slotId, storyProgress,
      trueEndingAchieved)` に refactor し、各シーンの「再生可能性」を
      seen-flag ではなく storyProgress + true-ending flag ベースで
      判定。

- [x] **endingFull のページ送り + 章チップ + 両色 freeze fuzz (v0.33.8)**
      — completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `e727201` —
      ユーザー報告 3 件: ゼロ撃破後の文章が見切れる / 過去章へ
      アクセスしづらい / 白でやっても黒でやっても凍結しないか確認。
      修正: 1. GameOver モーダル outer card に
      `max-h-[95vh] overflow-y-auto` (lives=0 と通常の両方)、
      `endingFull.text` (~30 行) を新コンポーネント `PaginatedProse`
      で blank-line ごとにページ分割 → ◀ 前へ / 次へ ▶ + ページ
      カウンタ。2. 進捗バー直下に 1-20 番号チップグリッド追加
      (クリア済 = 緑系 / 現在 = ハイライト / 未到達 = disable)、任意
      章へワンタップジャンプ、storyProgress=20 時の cursor 初期値を
      `1` に変更し再訪は ch.1 から時系列順。3. fuzz テストに story-mode
      parity describe を追加 → human-as-BLACK × 20 chapters × 3 iter
      + human-as-WHITE × 同 + freeze 報告章 (3/6/8/20) × 両色 ×
      5 iter = 160 ゲーム新規。累計 ~995 ゲームすべて gameOver 到達 +
      `isGameOver(board)` 合致を assertion。両色とも engine 側に凍結
      経路無し。

- [x] **endgame freeze fuzz: 835 ゲーム + 手動 QA 手順書**
      — completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `4b4201f` —
      ステップ 5 (E2E 検証) として、エンジン純関数経由の実機相当
      ファズテスト + 実機での診断ログ採取手順書を追加。pushback
      方針通り fix を書かず engine 無実を deterministic に立証。
      新規 `src/engine/__tests__/full_match_fuzz.test.ts`:
      Lv.1-10 全ペアリング × 20 iter = 320 ゲーム / Lv.14/17/20
      重 AI smoke (timeout 60-120s) = 15 ゲーム / Lv.1 vs Lv.20
      非対称 = 5 ゲーム / Lv.1 vs Lv.1 ランダム自己対戦 = 500 ゲーム、
      合計 ~835 ゲームが App.tsx と同じ転移ルール
      (`noCurrent && !noOpp → pass`、`!noCurrent → move`、
      `noCurrent && noOpp → gameOver`) で全部 GAME_OVER に到達する
      ことを assertion 化。`docs/endgame_freeze_repro.md`: 実機で
      フリーズしたら設定モーダルの「🩺 診断ログ書き出す」ボタンで
      クリップボードにログを取って報告に貼る手順 + 復旧手段
      (🔄 AI 再起動 / ♻️ 緊急再読み込み)。21/21 tests pass in
      12.76s。

- [x] **endgame freeze repro tests (cases A/B/C) — engine 無罪確定**
      — completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `9888058` —
      ユーザー要請: 「症状の出口を塞ぐ修正アプローチを禁止し、純関数
      engine レベルでテストを書いて根本原因を特定」。
      `src/engine/__tests__/endgame_freeze.test.ts` 新規 (8 ケース):
      A. 1 マス + 自分が打てる (盤満杯になる手) → 1 step → GAME_OVER。
      B. 1 マス + 自分パス (相手が打って満杯) → 2 step → GAME_OVER。
      C. 2+ マス + 両者打てない (ダブルパス) → 0 step (即 terminal)。
      C 変種 (WHITE 手番) → 同上。worker contract: pickAIMove([], ...)
      は null を同期 return、`getValidMoves` は空配列、いずれも hang
      しない。8/8 pass。状態マシン 3 遷移 (PLAYING/WAITING_AI/
      WAITING_PLAYER → GAME_OVER) すべて well-defined・到達可能を
      確認。これで「engine + 状態マシンに根本原因が存在しない」ことが
      立証され、再発時は PWA キャッシュ / モバイル browser / OS
      レイヤに絞り込まれる。

- [x] **localStorage 診断ログ + 手動 AI 再起動 (v0.33.7)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: `47547a0` —
      フリーズ報告の原因特定を加速するため、ユーザー手元で直近 200
      件の重要イベントを記録する診断ログ機構を導入。auto-recovery は
      意図的に入れず、ログ取得 + 明示復旧の二段構え。新規
      `src/lib/diagLog.ts`: localStorage の ring buffer (200 件 ≈
      50KB)、schema v=1、`logDiag(type, data?)` / `getDiagLog()` /
      `clearDiagLog()` / `exportDiagLog()`。例外は全部 swallow して
      render path から呼べる。ログ呼び出し点: `useAiWorker.ts` の
      worker.spawn / worker.message / worker.error / worker.timeout /
      worker.request、`App.tsx` の click / move / ai.dispatch /
      ai.resolve / ai.reject / pass.start / pass.end / gameOver /
      reset / manual.aiRespawn。設定モーダル「Story Data 管理」
      セクションに 2 ボタン: 🔄 AI を再起動 (`ai.cancel()` +
      `setAiThinking(false)` + `aiRetryNonce++` で板面を保ったまま
      AI 思考だけ作り直す) / 🩺 診断ログを書き出す (clipboard
      writeText with textarea fallback、コピー成功 toast 2.5s 表示)。
      ja/en i18n。

- [x] **PWA キャッシュ攻撃モード化 (v0.33.6, endgame freeze の根本治療)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `6626916` —
      v0.33.5 で endgame freeze の真因 (`handleClick` + cell-level
      `isValid` の `aiThinking` ガード両系統) は除去済だったが、deploy
      後も Ch.3 朝日 / Ch.6 つむぎで残 1 マスフリーズの再発報告が継続。
      原因は vite-plugin-pwa workbox 設定に `skipWaiting` /
      `clientsClaim` が無く、新 SW が `waiting` で stuck → 旧 bundle
      (= aiThinking ガード残存版) が配信され続けていた。workbox に
      `skipWaiting: true` + `clientsClaim: true` を追加して install
      直後に新 SW が activate + 既存 client 取り込み。BUILD_TAG を
      `v0.33.6 · pwa-skip-waiting` に更新 (タイトル画面で配信中
      バージョンを目視確認可能)。今後の修正は再 reload 1 回で反映
      される運用に。`dist/sw.js` に `self.skipWaiting()` +
      `a.clientsClaim()` が焼き込まれていることを目視確認済。
      typecheck / tests (34/34) / build pass。

- [x] **Phase 3: 挿絵更新 + PLR01 配置 + シナリオ書き換え + 真エンディング演出** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `f44c941` —
      章別挿絵 10 枚配置 (差し替え ch3/6/8 + 新規 ch20-B/20-C
      → `chapter_20b/c-{landscape,portrait}.png` + `/illustrations/`
      に NarrativeOverlay 用コピーも配置)。PLR01 英霊ハルキを
      `players/PLR01_haruki_heroic/` に新規配置 (1024×1024
      character/background/icon + spec.md)、旧 `PLR01_haruki.png`
      は `avatars-old/players/` 温存。`AVATARS_DATA` の PLR01
      パスとセッティング更新 + マッチャを `PLR01_haruki_heroic`
      slug に変更。`COMPUTERS_DATA` に Lv.22 ヴォイドφ
      (`hidden: true`、画像は OPP21 暫定、Phase 4 で差し替え予定)
      追加。シナリオ書き換え (ch.11 シオン姉妹暗示 / ch.12 ルナで
      召喚仄めかし + ゼロ初出 / ch.20 フード姿ゼロのフードが落ちる
      演出 + 旧「いちかと双子」設定削除)。新 i18n エントリ
      `narrative.trueEnding20B`/`trueEnding20C` を ja/en で追加。
      章 20-B → 20-C シネマティック (NarrativeOverlay 連鎖) を
      gameOver 効果から自動発火 (PLR01 + 章 20 勝利 +
      `!trueEndingAchieved` で初回のみ)。`OverlayKey` に
      `narrative:trueEnding20B/20C` 追加 + シーン回想ラベル ja/en +
      review-overlay 描画分岐。OPP22 アンロックは既存
      `trueEndingAchieved` ガードで自動的に解除される。CLAUDE.md
      §4.1 (Lv.22 ヴォイドφ 行追加) / §4.2 (PLR01 英霊ハルキ
      フォルダ構造 + アンロック条件 + index 20 への移動) / §7
      (真エンディング連鎖の手続き解説) 更新。
      詳細 `phase3_handoff/TASK.md` + `scenarios/scenario_rewrite_v3.md`。

- [x] **OPP アバター v4 統合 (Phase 2 / 最終形)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `20e0a45` —
      Phase 1 の暫定 `OPP20_zero` (フード無し) と `OPP20_zero_battle`
      (フード姿) を最終形に再配置: `OPP20_zero/` を**フード姿の最終
      ボス標準アバター**に、新 `OPP21_zero_unmasked/` を**現世帰還の
      隠しキャラ**に振り直し (合計 21 フォルダ)。`COMPUTERS_DATA` に
      Lv.21 OPP21 エントリ追加 (`hidden: true` flag)、`aiAvatarImage`
      の `ZERO_HOODED`/`ZERO_UNMASKED` 定数を新パスに書き換え。
      `trueEndingAchieved` 状態を `localStorage('othello:true_ending_achieved')`
      に永続化、PLR01 英霊ハルキで章 20 クリア時に立てるロジックを
      gameOver 効果に追加。OPP 選択グリッドで `c.hidden && !trueEndingAchieved`
      の時 `.avatar-locked` クラス + `???` ラベル + `disabled` で選択
      阻止。CSS フィルタ (`.avatar-locked > * { filter: brightness(0)
      opacity(0.55); }` + `::after { content: '???'; }`) を `index.css`
      に追加。`CLAUDE.md §4.1` を 21 体表 + OPP20/21 二段階構造解説 +
      章 20 シーン分岐ルール + アンロック判定の実装ポインタに更新。
      OPP v4 統合完遂。

- [x] **OPP アバター v4 ゲーム実装 (Phase 2)** —
      completed: 2026-05-06 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: `0c9acfc` —
      `COMPUTERS_DATA` のパスを新形式
      (`/avatars/opponents/OPPxx_*/icon.png`) に更新。章 20 シーン
      分岐実装 (PLR00-20 戦闘中 = フード姿、PLR01 = フード無し特例、
      勝利後対話 = フード無しで「フードが落ちる」演出) を `App.tsx`
      の `aiAvatarImage` 派生 + `zeroAvatarFor()` ヘルパーで実装。
      GameOver モーダルの `aiAvatar` も `opponentSnapshot.level === 20`
      の時は `aiAvatarImage` で上書きしてフードオフ reveal を保証。
      `CLAUDE.md §4.1` を OPP21 (20 + ゼロ戦闘モード) 表 + シーン
      分岐解説に更新。OPP v4 統合完遂。

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
