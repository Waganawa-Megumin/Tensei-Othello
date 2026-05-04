# Development Backlog — 転生したらオセロ世界でした！

> 2 つの Claude Code セッション（`claude/othello-game-sHVBZ` と
> `claude/review-othello-mock-HTX9b`）が共有する作業ボード。
> 詳細運用は [`othello-game/CLAUDE.md`](othello-game/CLAUDE.md) の
> 「0. セッション開始時の必須手順」を参照。

Last updated: 2026-05-04 by `claude/othello-ui-autosave-bPnmY` (v0.30.1)

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

- [x] **LLM キャラ実況のみ残し、Edax / エンジン選択を撤回** —
      completed: 2026-05-04 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — ユーザー判断「クラウド側で完結して欲しかった
      のでこれは中止」。`v0.30.0` で同梱した二系統のうち、ローカル
      WASM ビルドが必須だった Edax / エンジン選択 UI を撤回。撤去対象:
      `src/engine/engines/`、`src/workers/engines/edaxAdapter.ts`、
      `src/storage/aiEngine.ts`、`scripts/build-edax-wasm.sh` +
      `edax_shim.c`、`docs/EDAX_WASM.md`、`public/edax/`、
      `useAiWorker` の `engine?` 引数、`ai.worker.ts` の dispatch、
      `App.tsx` の engine state / 設定 UI / hint async 化、i18n の
      `aiEngineLabel` / `tenseiClassicDesc` / `edaxDesc` /
      `edaxMissingNote` 等、`.gitignore` の `.emsdk/.tmp`。
      残したもの: クラウド完結する LLM キャラ実況一式 (`prompts/
      commentary.ts`、`services/commentary.ts`、`data/personas.ts`、
      `storage/commentary.ts`、`components/CommentaryBubble.tsx`、
      App.tsx の commentary state + effect + bubble + 設定トグル、
      i18n の commentary キー)。`v0.30.1`
- [x] **AI キャラ実況 (LLM 経由)** — completed: 2026-05-04 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      ユーザー要望「キャラ感は Claude/ChatGPT に任せるのがよい」。
      既存の Cloudflare Workers proxy + `services/claude.ts` パターン
      を再利用。`prompts/commentary.ts` に tool schema
      (`character_commentary` で `{text, tone}` を返す)、
      `services/commentary.ts` で fire-and-forget な API 呼び出し
      (Haiku 4.5 + プロンプトキャッシング)。`data/personas.ts` に
      20 キャラ分の口調ヒント (1〜2 文の voice cue、ja/en)。
      `components/CommentaryBubble.tsx` で AI 側 PlayerPanel 上に
      フロート、tone (taunt/thoughtful/shock/cheer/neutral) で淵色を
      切替、4.6s で自動フェード。設定モーダルに ON/OFF トグル
      (`othello:commentary_enabled`、デフォルト OFF — opt-in)。
      Trigger は AI 側着手後のみ、開幕 6 手はスキップ、ネット失敗は
      サイレント。`v0.30.0`
      completed: 2026-05-04 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — ユーザーフィードバック「対戦相手のレベルは
      デフォルトではあの順で良いのですが、下のゲージで設定できるので
      アバター付近は default lv. で、下の変更するとそのレベルで対決する
      仕組みになってることがわかるように」。
      キャラカード下の「Lv.X」表記を `t.defaultLevelLabel(n)` 経由で
      「標準 Lv.X / Default Lv.X」に。選択カード直下のサマリ枠にも
      「・ 標準 Lv.X」を追記。
      キャラグリッドとレベルゲージの間に橋渡しテキストを追加（`t.matchLevelHint`）:
      「キャラクター直下の数字は『標準 Lv.』。下のゲージを動かすと、その
      対戦相手と任意のレベルで対局できます」。
      `LevelSelector` を改修: 見出しを `Level` → `t.matchLevelLabel`（対決
      レベル / Match Level）、`defaultLevel` プロップを追加して `level !==
      defaultLevel` の時だけ `↺ 標準に戻す` ミニボタンを表示。
      ゲージ下に `t.aiComputeNote` を追加（思考は端末内 Web Worker で計算、
      Lv.18〜20 は深さ 4 minimax で時間が掛かる旨）。
      `v0.29.1`
- [x] **フリーモードを「タイトル → 対戦設定 → コイントス → 対局」の
      順に並べ直す** — completed: 2026-05-04 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      ユーザーフィードバック「フリーの場合は、いきなりコイントスから
      対決が始まるのではなく、フリー対決の設定にいって、そこからフリー
      へというフロー」。`startGame` を再構成して `selection.sub === 'free'`
      の場合は `setSettingsOpen(true)` だけ呼んで `setScreen('game')`
      しない（`reset()` も呼ばない）→ コイントスはトリガーされず、ユー
      ザーが対戦設定を確認・調整してから明示的に「この設定で対局を始める」
      で開始。設定モーダルは構造的にゲーム画面の中にネストされていた
      ため、`screen === 'title'` でも render できるよう App 直下に
      持ち上げた（小さい Python スクリプトで 587 行を一括移動して再
      インデント）。タイトルから開いた時はモーダル見出しを「対戦設定 /
      Match Setup」に切替（`t.matchSetup` を新設）、Free カードの meta
      を `次に設定 → 対戦相手・レベル・先攻後攻を選んで対局` に更新して
      二段階フローを示唆。Story モード/Human モードの挙動は据え置き。
      `v0.29.0`
- [x] **2D コインの白面を金族から本来のオフホワイトに戻す** —
      completed: 2026-05-04 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — ユーザーフィードバック「白が金と同化する
      ぐらい黄色」。`coin-2d-w` の背景が `#b8a36a`（アンティークゴー
      ルド寄り）になっており、`#c9a961` の rim/pip と同系色で「白」
      として読めなくなっていた。盤面の白石グラデ `#ebe2cc → #c5b89c`
      の最も明るい段である `#ebe2cc` に揃えて、白面と金アクセントが
      明確に別物として読めるように。`v0.28.2`
- [x] **ファンタジーコインを「シンプル板」に差し替え（魔法陣下グロー
      撤去）+ 新フレーム16枚に更新** — completed: 2026-05-04 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      ユーザーフィードバック「コイン下の光が邪魔」。納品 v2 パック
      （`othello_turn_coin_complete_pack.zip`、黒8 + 白8 + 共通エッジ1）
      を `public/assets/othello/turn-coin/{black,white,common}/` に
      配置。`FantasyCoinRoll` から `<img className="fantasy-coin-ring">`
      と `.fantasy-coin-ring*` / `@keyframes fantasy-ring-pulse` を削除。
      回転シーケンスを「結果側へ向かって落ち着いていく」一方向に整理:
      `FANTASY_SPIN_TO_BLACK`（白前→白傾き→白縁→水平縁→黒縁→黒傾き→黒前）
      / `FANTASY_SPIN_TO_WHITE`（黒前→黒傾き→...→白前）。最終静止フレーム
      は `black_00_front.png` / `white_02_front_a.png`。素材処理は前回と
      同じ Pillow パイプライン（フラッドフィル → 2px 羽化 → 512×512
      LANCZOS）で 25.7 MiB → 3.2 MiB に圧縮。旧 `turn-coin-*.png` 10 枚
      は不要なので削除。`v0.28.1`
- [x] **先攻後攻コイン演出にファンタジー版のオプション追加** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — ユーザー納品の銀縁紋様コイン素材 8 種＋
      魔法陣を `public/assets/othello/turn-coin/` に配置し、設定モー
      ダルから `2d`（既定 = 既存）と `fantasy`（新規）を切替えられる
      ようにした。状態は `othello:coin_style` で localStorage 永続化。
      `FirstPlayerRoll` を style 指定でディスパッチする薄いラッパに
      変え、内部に `TwoDCoinRoll`（従来）と `FantasyCoinRoll`（新規）
      を並置。Fantasy 側は 8 フレームの画像差し替えで疑似 3D フリップ
      を作り、決定後に淡い魔法陣リングを呼吸させる。素材は元 1254×1254
      RGB（透過なし、白背景）だったので Pillow で 4 辺からフラッド
      フィルしてα抽出 → 2px ガウシアンで縁を羽化 → 512×512 にダウン
      サンプル → optimised PNG に変換（合計 15 MiB → 2.2 MiB）。
      i18n キー追加: `coinStyleLabel/Subtitle/2D/2DDesc/Fantasy/FantasyDesc`
      （ja/en 両方）。`v0.28.0`
- [x] **横向き UX の追い込み: 文字を読めるサイズに・矩形グロー漏れを止める・
      盤面と進捗バーの隙間** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      v0.27.3 で「アバターの円が光らずに、消えたはずの区画の四角が
      光る」「文字が小さくて暗い」「盤面と下の比率インジケータが
      被ってる」3 件のフィードバック対応。
      (1) `.player-panel-active` の box-shadow パルスが Tailwind の
      `[animation:none]` 同等 specificity で打ち消せていなかった →
      `<style>` ブロックに `@media (max-width: 1023.98px) and
      (orientation: landscape)` で `animation: none !important;
      box-shadow: none !important` を仕込んで確実に抑止。
      (2) アバターのアクティブリングが矩形に見えていた → ラッパー
      `<div>` を `inline-flex` でアバター実寸に縮め、`.avatar-active-ring`
      に `border-radius: 9999px` を明示してグローを正円に。グロー強度
      も 14px / 0.42 → 18px 4px / 0.55 に上げて視認性アップ。
      (3) 横向きパネル内の文字サイズと色を底上げ:
      名前 `text-base → text-lg`、Lv/♥ `text-[10px] amber/55 → text-xs
      amber/85`、引用 `text-[10px] → text-xs`、駒数 `text-2xl → text-4xl`、
      アバター隣の石マーカー `w-4 → w-5`。FirstPlayerRoll の「握り石」
      ラベルも `text-[10px] amber/70 → text-sm amber-100/90`、結果文の
      色を `#f5e8c8 / #ebe2cc → #fff5d6 / #f5ebd0` で明るく。
      (4) `max-lg:landscape:mt-2 → mt-4` で盤面と進捗バーの間に余裕。
      `v0.27.4`
- [x] **横向きパネルの金枠を撤去・左右の余白を埋める** — completed:
      2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` — commit:
      (next push) — v0.27.2 では `[140px auto 140px] + justify-center`
      にしたため、パネル幅が固定で左右に大きな余白が残っていた。
      `landscape:[1fr_auto_1fr]` のフォールバックに任せて両側パネルを
      横幅いっぱいまで広げる。同時に「金の枠と長方形」の囲みを landscape
      では撤去（`max-lg:landscape:border-0` + `bg-transparent` + 呼吸
      アニメ無効化 + bottom underline 非表示）。手番インジケータは円形に
      改め、アクティブ側のアバターを 2px ゴールドリング＋柔らかい
      `box-shadow` 呼吸グローで示す（円形なのでパネル全体を矩形で囲わない）。
      `v0.27.3`
- [x] **横向きの盤面 overflow 修正＋パネルと盤面の隙間確保** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — 95vmin (374px) は URL bar 込みの実効
      viewport を超えて板が下端で切れていた → `min(70vh, 420px)` に
      下げて確実に収まるサイズに。grid を `1fr auto 1fr` →
      `[140px auto 140px]` の固定パネル幅 + `justify-center` で
      中央寄せ。gap も `gap-2 → gap-5` (8px → 20px) に拡大して、
      パネルと盤面の間に余裕。`v0.27.2`
- [x] **landscape variant の breakpoint 修正（max-md → max-lg）+
      アバター大型化** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      v0.27.0 で `max-md:landscape:` を使ったが、md = 768px に対し
      iPhone 14 横向きは 852px 幅 → variant が**発火していなかった**。
      `max-lg:landscape:` (1024px) に変更して全 35 箇所一括置換、
      実機の landscape phone（最大 ~1023px）で必ず発火するように。
      ついでにアバターを `md → lg` に大型化（48px → 64px）、内部
      gap も 1.5 → 2 に増やし「アバターどんと、情報が下に伸びる」
      ゲーム UI 風レイアウトに。`v0.27.1`
- [x] **横向きを「縦の圧縮版」ではなく専用レイアウトに作り直し** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — タイトル画面: 横向きで title font
      `text-3xl → text-xl`、subtitle/description/footer-hint 隠蔽、
      mode カードは 3 列のまま padding 圧縮、見出しのみ表示。
      ゲーム画面: PlayerPanel に**横向き専用の縦スタックレイアウト**
      を追加（avatar 上 / 名前+Lv+♥ 中 / quote / 駒数 下 を縦に
      flex-col で展開）、grid を `items-stretch` でパネル高さ＝
      盤面高さに揃え、横向きパネルが板と同じ高さの細い strip に。
      左右のガラ空き感が解消。`v0.27.0`
- [x] **横向きスマホで縦スペースを使い切るレイアウト圧縮（A〜E 全部）**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — `max-md:landscape:` variant を全方向に
      適用: ページ padding `py-6 → py-1`、ツールバーラベル隠蔽 + py
      圧縮、ツールバー下マージン `mb-5 → mb-2`、PlayerPanel padding/
      gap 圧縮、avatar `md → sm`、quote 行隠蔽、進捗バー上マージン
      `mt-7 → mt-2`、フッターキャプション隠蔽、グリッド gap `gap-4
      → gap-2`、盤面 padding `p-3 → p-1.5`、盤面サイズ `86vmin →
      95vmin`。これで iPhone 横向きでも盤面まで一画面に収まり、左右
      パネルもコンパクトに。 `v0.26.0`
- [x] **コイントス白面を `#b8a36a` のアンティークゴールド寄りに調整**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — `#ccbf90` でも明るかったため、もう一段
      黄色寄り＋低輝度に。アンティーク・古紙のような落ち着いた色味
      で、暗いバックドロップ上のフラッシュ感がさらに抑えられる。
      `v0.25.5`
- [x] **コイントス白面の輝度・色相微調整（マット黄色寄り温かみオフ
      ホワイト）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: 67a7dce —
      `#d6c79a` は黄色寄りが強すぎ、`#ebe2c2` は明るすぎ、と試行錯誤の
      末 `#ccbf90` に。マット質感のまま温かみある黄味オフホワイトで、
      暗いバックドロップ上での輝度ジャンプも抑えられる。`v0.25.4`
- [x] **コイントス：マット仕上げ＋金縁・中央 pip を金系で統一** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — 白面の中央 pip が深焦茶 (#3a2d1c) で
      浮いているとの指摘。両面とも pip を金系に統一（黒面 #d8b96d、
      白面 #b08a3f、いずれも縁の #c9a961 と同色族）して鑑のように
      まとまるように。さらに mat 化として、`box-shadow` の amber 外周
      glow と pip の glow を完全削除し、ドロップシャドウ 1 本だけに。
      背景色も艶を抜いて `#1f1d18` / `#d6c79a` に微調整。`v0.25.3`
- [x] **コイントスのチカチカ感を緩和（コントラスト・速度両方下げ）**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — v0.25.1 の純白 #fefdf6 ↔ 漆黒 #050505
      の高速反転（11 回 / 1.8 秒 ≈ 6Hz）が眩しすぎて目に刺さるとの
      指摘。3 軸で対処: (1) 色のコントラスト緩和 — 黒 #1a1a1a +
      白 #e8d8a8（暖色クリーム、輝度大幅減）、(2) transition を
      60ms → 280ms に延長して flip 間隔より長くし常に中間階調で
      クロスフェード、(3) flip 回数 11 → 7 回に削減。Pip も同じ
      280ms transition。眩しい点滅から穏やかな脈動に。`v0.25.2`
- [x] **コイントスを 3D → 2D 色トグル方式に作り直し（白黒判別問題の
      根本解決）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      `preserve-3d` + `backface-visibility` + `rotateY()` の 3D コイン
      は端末（特に mobile Chrome）で白面が出ない問題を v0.24.6 までに
      解決できなかったため、3D ベースを完全に撤去。新しい方式は単一
      の 2D ディスクで `coin-2d-b` / `coin-2d-w` クラスを React state
      で切り替える方式。setTimeout で 1.8 秒間に約 10 回パチパチ反転
      し、最後の flip で結果側にロック。class-driven background-color
      は CSS 更新の中で最も信頼性が高く、JS 状態と画面表示が必ず
      一致する。盤上の白黒石とは別の意匠（漆黒 / 象牙 + 金縁 + 中央に
      対色 pip）で識別を強化。`v0.25.1`
- [x] **アンロック方式を一度に全 20 体 → 1 章クリアごとに 1 人ずつ、
      キャラ並びも mikoto..yu..haruki に再構成** — completed:
      2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` — commit:
      (next push) — `AVATARS_DATA` の先頭にあった PLR01_haruki を末尾
      に移動し「初代英雄の記憶を持つ者」として 20 番目の解放枠に。
      `othello:character_unlocks` localStorage キー追加（`getCharacter
      Unlocks` / `setCharacterUnlocks` / `TOTAL_BONUS_AVATARS` を
      saveSlots に追加、既存セーブで storyProgress >= 20 だった人は
      初回読込時 20 にシード migrate で互換）。設定の p1/p2 アバター
      グリッドの `isLocked = i > unlockedCount` に書き換え、ロックヒン
      トは「N / 20 解放済み」表示。result-recording effect で旧 storyP
      rogress=19 + 勝利を検知して unlockedCount++、p1Avatar をその
      index に自動セット。GameOver モーダルに「新キャラクター解放」
      バナー（avatar + 名前 + setting）を追加。`v0.25.0`
- [x] **コイントス、白結果でも黒面で停止するバグ修正（CSS 変数 →
      結果別 keyframe へ）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      v0.24.3〜0.24.5 で `--coin-final` CSS 変数を使って結果ごとの
      最終回転角を切り替えていたが、ブラウザによっては
      `transform: rotateY(var(...))` のキーフレーム内 var() を解決
      しない既知問題で、常に初期値（1080deg = 黒面）に戻り「白の
      はずなのに黒のコインが止まる」状態だった。`coin-spin-black` /
      `coin-spin-white` の 2 つのキーフレームに分離し、JSX 側で
      `isFirst` に応じてクラス名を選択する方式に変更。各 keyframe
      の最終 rotateY はハードコード（1080deg / 1260deg）で確実な
      着地。`v0.24.6`
- [x] **コイン白黒判別の最終調整（金縁＋暗 inset 一切なしの白面）** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — v0.24.4 でも白がはっきり読めない状態
      （ユーザースクショ提示）。両 face に共通の太い金縁
      `inset 0 0 0 3px rgba(201,169,97,0.6)` を入れて「コインの輪郭」を
      確定させた上で、白面から暗 inset を完全撤去（替わりに白の inset
      highlight 0.65 alpha）、黒面からは bright highlight を弱める
      （0.08 alpha）方針に。グラデも 3-stop で簡素化、白は
      `#ffffff → #f8efd8 → #f0e2b6` のクリーム系のみ、黒は
      `#2a2a2a → #0a0a0a → #000` の純黒系のみで色相のブレを排除。
      `v0.24.5`
- [x] **コイントスの白面が灰色っぽく見える問題を修正（白黒コントラスト
      最大化）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      `.coin-face` 共通の inset shadow が `rgba(0,0,0,0.5)` 強で、白面の
      右下を灰色に染めていた。グラデのふち #c5b89c も暗すぎ。
      白・黒それぞれに専用 box-shadow を割当: 白は暖色 inset
      `rgba(170,130,70,0.35)` ＋ 強い白ハイライト `rgba(255,255,255,0.85)`
      ＋ 暖光外側 glow、黒は逆に深い inset と金色 glow。グラデも白面
      は #fdf6e3 → #ecdfba（暗いふちを排除）。`v0.24.4`
- [x] **コイントスのモーション・時間調整＋着地面の正しさ修正** —
      completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` —
      commit: (next push) — 1080°/1秒 = 目で追えない速度だった上、
      回転角が常に 1080° 固定で結果が白でも黒面で止まるバグあり。
      回転を 2.0 秒・強 ease-out に延ばし、結果に応じて 1080°（黒）
      or 1260°（白）まで回って正しい face で停止するように。0.2 秒
      の scale-in 入場 + 結果表示時間も 1.5 秒に延長して合計 3.5 秒。
      コイン径を 96px → 110px、最大ハイライトも強化。`v0.24.3`
- [x] **握り石演出を撤回、白黒コイントス（CSS 3D）に戻す + 新素材
      依頼に差し替え** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      v0.24.1 で実装した「拳が開いて石を見せる」演出が UX 上気持ち
      悪いとの指摘で revert。`<FirstPlayerRoll>` を v0.24.0 の CSS
      3D コインフリップに戻し（黒面・白面の radial-gradient ディスク
      が Y 軸 1080° 回転）、`grip-*.svg` 4 ファイルを `public/` から
      削除、`<GripIcon>` コードも除去。素材依頼仕様書 (依頼 #6) に
      撤回マーク、新たに **依頼 #7: 白黒コイントス（オセロ石）素材**
      を追記（`coin-{black,white}.svg`、CSS の `.coin-face` 背景に
      差し込む形で 3D 回転はそのまま流用）。`v0.24.2`
- [x] **「握り石」演出を CSS コインフリップから inline SVG 4-frame
      アニメに置き換え** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) —
      ChatGPT 納品の `grip-{closed,opening,open-black,open-white}.svg`
      を `public/ornaments/` に配置、これまでの方針通り inline SVG
      で `<FirstPlayerRoll>` 内に取り込み（mask-image 経由を回避）。
      0–500 ms: 握った拳 / 500–1000 ms: 拳が開きかけ・石の影が見える /
      1000–2000 ms: 開いた手の上に黒石 or 白石、文言フェードイン。
      `key={frame}` re-mount で各フレームに 0.32s の pop-in。
      旧 `.coin-flip` / `.coin-face` CSS は削除。`v0.24.1`
- [x] **先攻／後攻の選択 + 位置スワップ + 握り石コインフリップ演出**
      — completed: 2026-05-03 — by: `claude/othello-ui-autosave-bPnmY`
      — commit: (next push) — `playerColor` state を導入、人間が黒/白
      どちらを取るかでパネル位置・AI トリガ・undo・resign・lives/level
      表示・勝敗記録の対象がすべて切替わるように改修。フリーモードに
      「ランダム/先攻（黒）/後攻（白）」の 3 択 UI を追加。ストーリー
      モードは毎章ランダム。ランダム選択時は CSS 3D 回転の握り石コイン
      フリップ overlay を 2 秒表示してから対局開始。kifu スロットにも
      `playerColor?: Color` を保存・復元（旧スロットは BLACK 既定で
      下位互換）。`v0.24.0`
- [x] **プレイヤーパネル枠と盤面外枠の重なり修正** — completed:
      2026-05-03 — by: `claude/othello-ui-autosave-bPnmY` — commit:
      (next push) — portrait モバイルでパネル下端と盤面外枠（13px の
      多層 box-shadow リング）が `gap-3` 12px しかなく、active パネル
      の breathing グロー (`0 0 22px 2px`) が外側 24px 広がって視覚的に
      衝突。グリッド gap を `gap-3` → `gap-5` (12→20px) に拡大、
      breathing keyframe のグロー半径を 22px+spread 2px → 12px+spread 0px
      に縮小して、リングどうしの呼吸スペースを確保。`v0.23.4`
- [x] **`<BrushDivider>` と `<SumiThinking>` も inline SVG 化（mask-image
      経由の描画失敗を一掃）** — completed: 2026-05-03 — by:
      `claude/othello-ui-autosave-bPnmY` — commit: (next push) — 桜と
      同じ問題（モバイル Safari で mask-image が silently fail）が divider
      と AI thinking インジケーターでも起こりうるため、両方とも
      inline SVG 描画に統一。divider 5 variants（thin/bold/flourish/
      end/double）と sumi 4 frames のパスデータを `DIVIDER_PATHS` /
      `SUMI_FRAMES` const として内包、`fill="currentColor"` で CSS
      `color` から着色できる純粋な React 描画に切替。CSS 側の `mask-*`
      宣言を全削除。素材ファイルは引き続き `public/ornaments/` に
      残してあり外部参照（docs / SNS）には使える。`v0.23.3`
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
