# CLAUDE.md — 召喚されたらオセロ世界でした！ プロジェクトハンドオフ

このファイルは Claude Code がプロジェクトを継続するためのコンテキストです。これまでの設計判断、却下された案、未完了の項目を含みます。

---

## 0. セッション開始時の必須手順（全 Claude Code セッション共通）

このプロジェクトは複数の Claude Code セッション（`claude/<task>-<hash>` ブランチ）が交代で開発する形を取っています。各セッションが互いの最新成果を見るため、**作業を始める前に必ず以下を実行してください**:

```bash
git fetch origin main
git merge origin/main           # 自ブランチに main の最新を取り込む
# コンフリクトが出たら解決してから次へ
```

その後、リポジトリ root の [`BACKLOG.md`](../BACKLOG.md) を読んで以下を確認:

1. **🔥 In Progress** に**自セッションのブランチ名**が owner で残っているタスクがあれば、そこから再開
2. 他セッションのブランチ名のタスクは**絶対に触らない**（同時進行禁止）
3. In Progress が空なら、**📋 Todo** の優先度順上位を見てユーザーに「これやりますか？」と提示

`main` は全セッションの統合点で、live site (`https://waganawa-megumin.github.io/Tensei-Othello/`) もここから deploy されます。

**作業着手時の所作**:

1. `BACKLOG.md` の Todo から In Progress にタスクを移し、`owner` に自ブランチ名、`started` に日付を記入
2. その編集を独立した小さい commit として push（他セッションが察知できるように）

**作業完了時の所作**:

1. `BACKLOG.md` の In Progress から Done の先頭に移動。`completed` 日付、`by` セッション、`commit` ハッシュを記入
2. Done の 21 個目以降は削除（履歴は `git log` で追える）
3. ブランチを push してから main にマージ:

```bash
git push -u origin <自ブランチ>     # 自ブランチに push
git checkout main
git merge <自ブランチ>              # main に取り込む（fast-forward が望ましい）
git push origin main                # main を更新（live deploy が走る）
git checkout <自ブランチ>          # 自ブランチに戻る（次回再開のため）
```

**新タスク発生時**（バグ報告含む）:

1. ユーザー指示で `BACKLOG.md` の Todo の適切な P1/P2/P3 に追加
2. その追加だけで 1 commit、その後対応に移る

**注意**:
- 自ブランチを削除しない（次に自分のセッションが再開した時に再利用するため）
- 別セッション（別ブランチ）の状態は基本触らない。同期は main 経由でのみ行う
- 同時に main を更新する 2 セッションは現状想定していない（時間帯がズレる前提）
- `BACKLOG.md` の編集は自セッション担当タスクの周辺だけ。他セッションの行に
  触らない（コンフリクト予防）

---

## 1. プロジェクト概要

**何を作っているか**: 20体のキャラクターと20段階の難易度、20章のストーリーモードを持つ和風オセロゲーム。React + Vite + Tailwind 3 のシングルページ・アプリケーション。スマホ・デスクトップ両対応。

**現バージョン**: v5（このハンドオフ時点）

**コアコンセプト**: 「召喚されたらオセロ世界でした！」 —— ライトノベル風の異世界召喚もの。プレイヤーは異界『盤上世界』に召喚され、20人の達人を順に打ち破ってエンディングを目指す。各達人は剣士・魔術師・侍・ハッカーなど、ファンタジー〜現代〜SFを横断する多様な世界観。

---


## 0.4 ターン終了時の必須報告（毎回出す）

ユーザー要求: コミット / push / merge を伴うタスクの終わりには
**毎回**、以下のステータスを最後にまとめて出すこと（ユーザーが
ライブで動作確認できるよう確認 URL と main の状態を即時に把握
できるようにするため）。

報告フォーマット（テーブル形式、これに統一）:

```
## 📡 ステータス

| 項目 | 値 |
|---|---|
| 確認 URL | https://waganawa-megumin.github.io/Tensei-Othello/?v=YYYYMMDD<tag> |
| `main` HEAD | <短縮ハッシュ> <commit subject> |
| origin/main 同期 | ✅ ローカル `main` = `origin/main` (push 済み) もしくは ⚠ 未 push |
| ブランチ | <自セッションのブランチ名> (origin と同期済みか否か) |
| バージョン | <BUILD_TAG の値、例 `v0.31.0 · default-route-finished`> |
```

`?v=...` の suffix は GitHub Pages の PWA キャッシュ回避用。日付 +
そのリリースを示す短いタグ（例 `20260504story`）にする。

main を更新していないターン（i18n 流し込み中の中間 commit など、
まだ feature ブランチに居る段階）でも、その時点の HEAD と「未 push」
を明示してテーブルを出すこと。

なぜ毎回出すか: ユーザーは別端末でライブ確認しているため、URL と
main の最新ハッシュをワンタッチで把握できる必要がある。CLAUDE.md
で約束した動作なので例外なく実行。


---


## 0.5 タイトル・呼称ルール（重要）

このプロジェクトには2つの名前があり、混同しないこと：

| 用途 | 表記 | 説明 |
|---|---|---|
| **アプリ/作品タイトル** | 召喚されたらオセロ世界でした！ | ラノベ風のメタタイトル。タイトル画面、README、ブラウザタブで使用 |
| **作中世界の名前（固有名詞）** | 盤上世界（ばんじょうせかい）/ Bansho Sekai | プレイヤーが召喚される異界の名前。ストーリー文・章説明・ナラティブテキストで言及 |

英語表記が必要なときは:
- 作品: **Summoned as an Othello Player**（タイトル画面サブタイトル）
- 異界: 訳さず Bansho Sekai のまま、または "the board world" と説明的に

**❌ NG パターン**: `盤上世界 — Tensei Othello` のように、作品名と異界名を混ぜた表記。

**過去の経緯**: v0.31 までは「転生したら〜」(reincarnation) 路線でしたが、死亡＋蘇生の重さがゲームのトーンに合わないため v0.32.4 で「召喚されたら〜」(summoning) に振り替え。新規で書く文章は必ず召喚 / Summoned で。

## 2. ユーザーについて

開発依頼者は日本語ネイティブ（英語も可）。情報の密度を好み、簡潔・技術的なコミュニケーションを期待します。「見ればわかる」要素は冗長と捉える傾向（タイトル `オセロ` を画面から削除した経緯あり）。応答は基本日本語で、英語混じりの技術用語は許容。

---

## 3. デザインシステム

### 配色
- **ベース**: ほぼ黒 (`#0a0805`) を基調とした深い闇
- **アクセント**: 温かみのある琥珀／ゴールド (`amber-100/95`, `amber-200/40` など)
- **盤面**: 緑のフェルト (`board-felt` クラス、グラデーション)
- **石**: 黒は radial gradient で立体感、白は象牙色 `#ebe2cc → #c5b89c`

### タイポグラフィ
- **和文**: Shippori Mincho（Google Fonts、`.jp-display` クラス）
- **欧文**: Cormorant Garamond Italic（`.latin-display italic` クラス）
- 装飾的なオーナメント（`.ornament` クラスで `· text · ` 風）を多用

### 全体トーン
クラシックなボードゲーム × 和の伝統美 × ライトノベル的キャラクター性。
派手な色・絵文字・カジュアルなアイコンは避け、抑制された上品さ。

### モバイル優先
ほとんどのスタイルはモバイル基準で書かれ、`md:` プレフィックスでデスクトップ拡張。

---

## 4. キャラクター ロスター

### 4.1 コンピュータ側 (COMPUTERS 配列、20体)

各キャラに固有の難易度レベルが割り当てられている。**ストーリーモードでは Lv.1 から Lv.20 まで順番に対戦** する。**フリーモードでは難易度のみ自由に変更可能**（キャラはレベルに紐付き）。

| Lv | 名前      | 漢字 | アーキタイプ        | 由来画像ファイル              |
|----|-----------|------|---------------------|-------------------------------|
| 1  | いちか    | 苺   | アイドル            | 18_idol_singer.png            |
| 2  | 葵        | 葵   | 弓使い              | 03_energetic_archer.png       |
| 3  | 朝日      | 朝   | 剣士                | 01_cheerful_swordsman.png     |
| 4  | なでしこ  | 撫   | 治療師              | 05_kind_healer.png            |
| 5  | 響        | 響   | 吟遊詩人            | 07_musician_bard.png          |
| 6  | つむぎ    | 紬   | 獣使い              | 16_beast_tamer.png            |
| 7  | 茜        | 茜   | 技師                | 08_gadget_engineer.png        |
| 8  | メル      | 薬   | 錬金術師            | 19_alchemist.png              |
| 9  | 悟        | 悟   | 修行僧              | 13_stoic_monk.png             |
| 10 | シキ      | 黒   | 盗賊                | 06_sly_rogue.png              |
| 11 | シオン    | 詩   | 魔術師              | 02_calm_mage.png              |
| 12 | ルナ      | 夢   | 夢の魔女            | 12_dreamy_witch.png           |
| 13 | 雪乃      | 雪   | 学園軍師            | 09_school_strategist.png      |
| 14 | アキラ    | 暁   | 探偵                | 17_detective.png              |
| 15 | シエル    | 銀   | サイバー斥候        | 10_cyberpunk_scout.png        |
| 16 | アリア    | 姫   | 姫君                | 15_noble_princess.png         |
| 17 | レオン    | 獅   | 騎士                | 04_noble_knight.png           |
| 18 | 宗次郎    | 宗   | 侍                  | 11_elegant_samurai.png        |
| 19 | 嵐        | 嵐   | 竜騎士              | 14_dragon_rider.png           |
| 20 | ゼロ      | 零   | ハッカー（最終ボス）| 20_hacker.png                 |

**全20体の画像が `public/avatars/` に配置済み（256×256 PNG）。**

### 4.2 プレイヤー側 (AVATARS 配列、20体)

20体のライトノベル主人公アーキタイプ。京アニ風の portrait を `public/avatars/players/` に統合済み（256×256 PNG）。

| #  | 名前      | 主人公アーキタイプ        | ファイル                              |
|----|-----------|---------------------------|---------------------------------------|
| 1  | ハルキ    | 異世界召喚の勇者          | players/01_haruki.png                 |
| 2  | 美琴      | 魔法学園の天才            | players/02_mikoto.png                 |
| 3  | リン      | VRMMOの最強プレイヤー     | players/03_rin.png                    |
| 4  | 蓮        | 剣道部主将                | players/04_ren.png                    |
| 5  | 千歳      | タイムリープ少女          | players/05_chitose.png                |
| 6  | 晴        | 現代の陰陽師              | players/06_haru.png                   |
| 7  | カイ      | 空の冒険者                | players/07_kai.png                    |
| 8  | 千夏      | 聖剣の村娘                | players/08_chinatsu.png               |
| 9  | 透        | 学園名探偵                | players/09_toru.png                   |
| 10 | ノア      | 未来から来た少女          | players/10_noa.png                    |
| 11 | 凪        | 異世界料理人              | players/11_nagi.png                   |
| 12 | エル      | 元魔王、今は転校生        | players/12_el.png                     |
| 13 | スミレ    | 記憶喪失の冒険者          | players/13_sumire.png                 |
| 14 | 葉月      | 機械工学の天才            | players/14_hazuki.png                 |
| 15 | 隼人      | 凄腕ガンナー              | players/15_hayato.png                 |
| 16 | ひかり    | 光の精霊使い              | players/16_hikari.png                 |
| 17 | ヨル      | 半吸血鬼                  | players/17_yoru.png                   |
| 18 | 湊        | 海の冒険者                | players/18_minato.png                 |
| 19 | 奏太      | 天才ピアニスト            | players/19_souta.png                  |
| 20 | 悠        | 神話の英雄                | players/20_yu.png                     |

---

## 5. 命名で踏んだ地雷（避けるべき方針）

キャラクター命名は **3 ラウンドの試行錯誤** を経て現状に落ち着きました。同じ失敗を繰り返さないために記録します。

### 却下: 中華風オン読み二字熟語

最初の案: **翡翠・銀狼・紅炎・蒼月・玄武** など。
依頼者からのフィードバック: **「チャイナ臭い」**。

オン読み二字熟語（特に色＋動物／自然要素）は中華ファンタジーの定番で、和風には合わない。

### 却下: ファンタジー寄りすぎる和語

第二案: **苺花・朝陽・紫苑・月夜** など。
依頼者からのフィードバック: 苺花（いちか）→「いちか」だけでよい。漢字熟語2文字は大仰。

### 採用: 自然な日本語の人名

- **ひらがな** で柔らかいキャラ（いちか・なでしこ・つむぎ）
- **一字漢字** で凛々しいキャラ（葵・朝日・響・茜・悟・嵐）
- **カタカナ** で外来・異質キャラ（メル・シキ・シオン・ルナ・アキラ・シエル・アリア・レオン・ゼロ）

→ 各キャラの世界観に合った文字種を選ぶのが正解。

---

## 6. AI 難易度設計

| Lv      | 戦略                                              |
|---------|---------------------------------------------------|
| 1–2     | ランダム                                          |
| 3–5     | Greedy（最も多く取れる手）                        |
| 6–9     | Positional（隅・端・X-square 評価）               |
| 10–14   | Minimax depth 1–2 + アルファベータ枝刈り          |
| 15–17   | Minimax depth 3                                   |
| 18–20   | Minimax depth 4 + mobility / disc parity 評価     |

実装は `pickAIMove(board, player, level)` 関数（App.jsx）。

---

## 7. ストーリーモード設計

- **進捗保存**: `localStorage.getItem('othello:story_progress')` で 0-20 の整数（クリア済み章数）
- **対戦相手は固定**: `aiMode === 'story'` の useEffect で `storyProgress + 1` のレベルを持つキャラを自動選択
- **章導入文**: `STORY_CHAPTERS` 配列、レベル毎の短い説明
- **OP/ED**: `STORY_INTRO`（プロローグ）、`STORY_ENDING`（全クリ後の結び）
- **勝利時に自動進行**: `gameOver && winner === 'B'` の useEffect で進捗をインクリメント、`storyJustAdvanced` フラグで多重発火を防止
- **負け／引き分け**: 進捗据え置き、リトライ可

---

## 8. UI 構造

### 上部アイコンツールバー（6 ボタン）

参照したのは商用オセロアプリのスクショ。lucide-react のアイコン + 日本語ラベル。

| Icon | Label    | Action                               |
|------|----------|--------------------------------------|
| Menu | メニュー | 設定モーダルを開く（モード・キャラ・レベル） |
| Lightbulb | ヒント | AI で最善手を計算して盤上に表示    |
| Undo2 | 待った   | AI 戦は人間の前手まで巻き戻し         |
| Info | 対局情報 | 現在の対局の詳細モーダル             |
| RotateCcw | 新規対局 | 盤面リセット（進捗は維持）        |
| FolderOpen | 棋譜 | 保存・読込モーダル                  |

⚠ 重要: アイコンを `<b.Icon />` のような動的 JSX 参照で書くと artifact ランタイムで壊れた経緯あり。**`ToolbarBtn` ヘルパーコンポーネントを介して呼ぶこと**。

### 盤面

- 8×8 グリッドに `aspectRatio: '1 / 1'` style を**明示**（Tailwind の `aspect-square` だけでは縦伸びすることがあった）
- 列ラベル A〜H と行ラベル 1〜8 はセルグリッドから分離した flex レイアウト
- 最終手は赤い ring (`.last-move-ring`)、合法手はゴールドのドット (`.move-hint`)、ヒントは星マーカー (`.hint-marker`)

### モーダル一覧

1. **設定** (`settingsOpen`): モード切替・キャラ・難易度・アバター
2. **対局情報** (`infoOpen`): モード・両者の駒数・手数・棋譜全文
3. **棋譜** (`kifuOpen`): 保存（名前付き）・読込・削除。localStorage `othello:save:{timestamp}` をスロットとして使用
4. **ゲームオーバー** (`gameOver`): ストーリー時は次章ボタン or エンディング、フリー時は「もう一度」
5. **パスメッセージ**: 合法手なしの自動パス通知

---

## 9. 棋譜（kifu）仕様

- **データ構造**: `{ player: 'B'|'W', row: 0-7, col: 0-7 }` の配列
- **記法**: `moveToNotation(m)` → `f5`, `d6` など（小文字 a-h + 1-8）
- **保存**: `localStorage` キー `othello:save:{Date.now()}`、JSON で `{name, timestamp, gameMode, aiMode, computerChar, level, kifu, storyProgress, counts, result}`
- **読込**: 初期盤面から手順を再生して現在状態を復元（`loadKifuMoves`）

---

## 10. ファイル構成

```
othello-game/
├── package.json              # Vite 5 / React 18 / Tailwind 3 / lucide-react 0.383
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md                 # ユーザー向けの起動手順
├── CLAUDE.md                 # ★このファイル（Claude Code 用ハンドオフ）
├── .gitignore
├── public/
│   └── avatars/              # 20体のキャラ画像 (256×256 PNG)
├── src/
│   ├── main.jsx              # React エントリ
│   ├── App.jsx               # 全実装 ~77 KB（モノリス、要分割）
│   └── index.css             # Tailwind directives
└── docs/
    └── player_character_prompts.md   # 未統合のプレイヤーアバター用プロンプト
```

---

## 11. 既知の問題・ハマりどころ

### Tailwind の arbitrary value
動的に生成されるクラス名（例 `${color}-${shade}`）はビルド時に検出されない。**全クラス名は完全な静的文字列で書く**。

### 動的 JSX 参照
`<obj.Icon />` のような動的タグは artifact ランタイムで失敗した。明示的なコンポーネント変数 (`const I = obj.Icon; <I />`) または別関数経由が安全。

### useEffect の二重発火
`storyJustAdvanced` フラグと `gameOver` 依存の useEffect の組み合わせで進捗が二重インクリメントされる可能性があったため、フラグでガード。同様のパターンを増やす際は注意。

### useEffect cleanup の罠（v9 で修正済）
`setTimeout` を立てる useEffect で、その timeout 内で更新する状態（例 `passInfo`）を deps に含めると、状態更新 → 再レンダー → 自身の cleanup が起動 → **自分が立てた timeout を自分で `clearTimeout` する** という事故が起きる。auto-pass 処理が止まる原因だった。
対処: 当該 state を deps から除き、`// eslint-disable-next-line react-hooks/exhaustive-deps` でルール抑止。

### モバイル幅でのグリッド計算
`grid-cols-[18px_repeat(8,1fr)]` で 9 列ぶん配置すると `aspect-square` の挙動が不安定。代わりに **「ラベル列を別 flex で分離 + セルだけの 8x8 grid に explicit aspectRatio」** が確実。

### ファイルサイズ問題
画像を base64 で埋め込んだ artifact 版（旧 v3）は 1.85MB に達して artifact 環境で画像が読めなくなる症状があった。Vite プロジェクト版では `/avatars/*.png` 参照に切り替え済み。

---

## 12. リファクタ推奨（Claude Code でやってほしいこと）

`App.jsx` は約 1700 行のモノリス。以下に分割すると保守性が上がります:

```
src/
├── App.jsx                       # main shell
├── components/
│   ├── ToolbarBtn.jsx
│   ├── PlayerPanel.jsx
│   ├── AvatarBadge.jsx
│   ├── LevelSelector.jsx
│   ├── Board.jsx
│   ├── modals/
│   │   ├── SettingsModal.jsx
│   │   ├── InfoModal.jsx
│   │   ├── KifuModal.jsx
│   │   └── GameOverModal.jsx
│   └── StoryPanel.jsx
├── data/
│   ├── computers.js              # COMPUTERS 配列
│   ├── avatars.js                # AVATARS 配列
│   └── story.js                  # STORY_INTRO, STORY_CHAPTERS, STORY_ENDING
├── lib/
│   ├── othelloRules.js           # getValidMoves, applyMove, etc.
│   ├── ai.js                     # pickAIMove, evaluate, minimax
│   └── storage.js                # localStorage helpers
└── styles/
    └── board.css                 # board-felt, .piece, .cell など現在 <style> 内
```

---

## 13. 改善アイデア・バックログ

具体的なタスクとその進捗は [`BACKLOG.md`](../BACKLOG.md) を参照（リポジトリ
root）。BACKLOG.md は両セッション共有、**バグ追加・優先度変更で常に更新**
される。長期的な戦略・Phase 計画はこの CLAUDE.md セクション 12（リファクタ
推奨）と本セクション直下のメモを参照。

### 戦略メモ

- **Phase 2 (進行中)**: Cloudflare Workers + Claude API レビュー機能
- **Phase 3**: Capacitor + GitHub Actions APK ビルド
- **Phase 4**: 終盤完全読み・反復深化・置換表
- **TypeScript 移行**: 完了 (Phase 1 で実施済み)
- **i18n (JA/EN)**: 完了 (Phase 1)

---

## 14. バージョン履歴

| Ver | 主な変更                                                                       |
|-----|--------------------------------------------------------------------------------|
| v1  | 基本オセロ + AI                                                                |
| v2  | 20 キャラ × 20 レベル、プレイヤーアバター、設定モーダル                        |
| v3  | ストーリー／フリーモード分離、上部アイコンツールバー、棋譜保存・読込          |
| v4  | 動的 JSX 参照のバグ修正（ToolbarBtn ヘルパー導入）                              |
| v5  | 盤面の縦伸びバグ修正（aspectRatio 明示）+ Vite プロジェクト化 + localStorage 移行 |
| v6  | プレイヤーアバター 20 体（京アニ風）統合 — `public/avatars/players/*.png`         |
| v7  | 移動候補 hint と hoshi 目印点を色分け（hint は手番駒のゴーストプレビュー化）       |
| v8  | move hint を青白いグローに変更（手番色のゴーストだと黒駒と紛らわしいため）         |
| v9  | パス処理が止まるバグ修正（auto-pass useEffect の cleanup が自身のタイマーをclear）   |
| v10 | タイトル画面追加（モード選択カード3枚 + ストーリー進捗表示 + Home ボタン追加）       |
| v11 | タイトル変更：「転生したらオセロ世界でした！」 — ライトノベル風ブランディング       |
| v12 | 第1章名のtypo修正（苺花→いちか）+ 統合挿絵指示書（A〜E 全カテゴリ・26枚） |
| v13 | 挿絵指示書をステップ別 6 ファイルに分割（docs/illustrations/）                      |
| v14 | 全 md ファイルのタイトル・呼称統一 + 各文書に作品名subtitle・相互リンク追加         |

---

## 15. ユーザー向けに気をつけたいこと

- **冗長な確認は避ける**: 「〜してもよろしいですか？」より「〜しました」と事後報告
- **画面で自明な要素はラベルで書かない**: タイトル `オセロ`、`Black · 黒` 等は削除済み
- **コードと実装は対で示す**: 何を変えたか／なぜを簡潔に
- **テンプレ的すぎない応答**: 機械的な「以下が実装です」より、変更点と判断の文脈を一緒に
