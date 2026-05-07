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

### 4.1 コンピュータ側 (COMPUTERS 配列、21体: 通常 20 体 + 隠し 1 体)

各キャラに固有の難易度レベルが割り当てられている。**ストーリーモードでは Lv.1 から Lv.20 まで順番に対戦** する。**フリーモードでは難易度のみ自由に変更可能**（キャラはレベルに紐付き）。**Lv.21 は隠しキャラ**で真エンディング達成後に解放される。

| Lv | 名前 | 漢字 | アーキタイプ | アバターパス | アンロック |
| --- | --- | --- | --- | --- | --- |
| 1 | いちか | 苺 | アイドル | `/avatars/opponents/OPP01_ichika/icon.png` | 最初から |
| 2 | 葵 | 葵 | 弓使い | `/avatars/opponents/OPP02_aoi/icon.png` | 最初から |
| 3 | 朝日 | 朝 | 剣士 | `/avatars/opponents/OPP03_asahi/icon.png` | 最初から |
| 4 | なでしこ | 撫 | 治療師 | `/avatars/opponents/OPP04_nadeshiko/icon.png` | 最初から |
| 5 | 響 | 響 | 吟遊詩人 | `/avatars/opponents/OPP05_hibiki/icon.png` | 最初から |
| 6 | つむぎ | 紬 | 獣使い | `/avatars/opponents/OPP06_tsumugi/icon.png` | 最初から |
| 7 | 茜 | 茜 | 技師 | `/avatars/opponents/OPP07_akane/icon.png` | 最初から |
| 8 | メル | 薬 | 錬金術師 | `/avatars/opponents/OPP08_mel/icon.png` | 最初から |
| 9 | 悟 | 悟 | 修行僧 | `/avatars/opponents/OPP09_satoru/icon.png` | 最初から |
| 10 | シキ | 黒 | 盗賊 | `/avatars/opponents/OPP10_shiki/icon.png` | 最初から |
| 11 | シオン | 詩 | 魔術師 | `/avatars/opponents/OPP11_shion/icon.png` | 最初から |
| 12 | ルナ | 夢 | 夢の魔女 | `/avatars/opponents/OPP12_luna/icon.png` | 最初から |
| 13 | 雪乃 | 雪 | 学園軍師 | `/avatars/opponents/OPP13_yukino/icon.png` | 最初から |
| 14 | アキラ | 暁 | 探偵 | `/avatars/opponents/OPP14_akira/icon.png` | 最初から |
| 15 | シエル | 銀 | サイバー斥候 | `/avatars/opponents/OPP15_ciel/icon.png` | 最初から |
| 16 | アリア | 姫 | 姫君 | `/avatars/opponents/OPP16_aria/icon.png` | 最初から |
| 17 | レオン | 獅 | 騎士 | `/avatars/opponents/OPP17_leon/icon.png` | 最初から |
| 18 | 宗次郎 | 宗 | 侍 | `/avatars/opponents/OPP18_sojiro/icon.png` | 最初から |
| 19 | 嵐 | 嵐 | 竜騎士 | `/avatars/opponents/OPP19_arashi/icon.png` | 最初から |
| 20 | ゼロ (フード姿) | 零 | ハッカー（最終ボス） | `/avatars/opponents/OPP20_zero/icon.png` | 最初から |
| **🌟 21** | **ゼロ (現世帰還)** | **零** | **救済された旧ラスボス** | `/avatars/opponents/OPP21_zero_unmasked/icon.png` | **PLR01 で章 20 クリア後** |
| **🌟 22** | **ヴォイドφ** | **φ** | **神格化されし秩序 (隠しの隠し)** | `/avatars/opponents/OPP22_voidphi/icon.png` | **PLR01 で章 20 クリア後 (OPP21 と同時)** |


**全 22 フォルダが `public/avatars/opponents/` 配下に配置済み (1024×1024 RGBA)。** 各フォルダには:

- `character.png` — 1024×1024 RGBA 透過済キャラ単体 (Adobe Photoshop で処理)
- `background.png` — 1024×1024 RGB このキャラ専用背景
- `icon.png` — 1024×1024 RGBA 円形クロップ済合成アイコン (UI でそのまま `<img>` 利用可)
- `spec.md` — このキャラの正の仕様書

旧 256×256 簡易版は `public/avatars-old/opponents/` に温存。詳細は `public/avatars/README.md` および `public/avatars/opponents/INDEX.md` 参照。

#### v4 改訂で確定したデザイン差分

OPP03 朝日は和洋融合武士道、OPP11 シオンは紫髪+眼鏡、OPP13 雪乃は銀髪+眼鏡、OPP18 宗次郎は老侍版がそれぞれ確定版。OPP16 アリアはアバター=白ドレス・章別挿絵=青ドレスの**マルチ衣装設定**として両方が canonical。

#### OPP20/21 ゼロの二段階構造 (v4 final)

世界観正本に基づく重要設計:

- **OPP20 ゼロ (フード姿)**: 最終ボスの標準アバター。あらゆるシーン (キャラ選択画面・ストーリー戦闘・フリー戦闘) で表示される
- **OPP21 ゼロ (現世帰還・隠しキャラ)**: PLR01 英霊ハルキで章 20 をクリアして真エンディング達成後にアンロックされる隠しキャラ。背景は現代日本の夕暮れの街並み

##### キャラ選択画面の表示

OPP21 はアンロック前は **CSS フィルタで `???` 表示** される (アセット側に黒塗り版を作る必要なし):

```css
.avatar-locked > * {
  filter: brightness(0) opacity(0.55);
}
.avatar-locked::after {
  content: "???";
}
```

実装: `App.tsx` の OPP 選択グリッドで `c.hidden && !trueEndingAchieved` を判定して `.avatar-locked` クラスを付与 + `disabled` で選択阻止。CSS 本体は `src/index.css`。

##### 章 20 のシーン分岐

- 章 20 戦闘前/中 (PLR00〜PLR20) → `OPP20_zero/icon.png` (フード姿)
- 章 20 戦闘中 (PLR01 英霊ハルキ・特例) → `OPP21_zero_unmasked/icon.png` (フード無し、本来の姿で対峙)
- 章 20 勝利後の対話 → `OPP21_zero_unmasked/icon.png` (フードが落ちて素顔露呈)
- PLR01 で章 20 クリア時 → 真エンディング達成 = `trueEndingAchieved` フラグ立ち = **OPP21 が以後フリーモードで選択可能**
- **20-C dismiss 後 → 20-D ヴォイドφ覚醒シネマ自動連鎖** (Phase 4 Step 3) → 20-D dismiss で `voidphiAwakened` フラグ立ち = **OPP22 が以後フリーモードで選択可能** (Lv.21 と Lv.22 は別フラグ管理)

実装は `App.tsx` 内の `aiAvatarImage` 派生 + `zeroAvatarFor()` ヘルパーで、`ZERO_HOODED = OPP20_zero/icon.png` と `ZERO_UNMASKED = OPP21_zero_unmasked/icon.png` を切り替える。アンロック判定 `trueEndingAchieved` は `localStorage('othello:true_ending_achieved')`、`voidphiAwakened` は `localStorage('othello:voidphi_awakened')` に永続化される。OPP 選択グリッドの isLocked 判定は `c.level === 22 ? !voidphiAwakened : !trueEndingAchieved` で gate を分岐。各キャラの正の記述は `public/avatars/opponents/OPPxx_*/spec.md` 参照。

### 4.2 プレイヤー側 (AVATARS 配列、デフォルト + 20 体)

ライトノベル主人公アーキタイプの portrait を `public/avatars/players/` に格納。デフォルト ("PLR00 / あなた") は index 0、続く 19 体は通常アンロック対象、最後の **PLR01 英霊ハルキは Phase 3 で 1024×1024 RGBA フォルダ構造に差し替え済み** (`PLR01_haruki_heroic/character.png` + `background.png` + `icon.png` + `spec.md`)。旧 PLR01 単体 PNG は `public/avatars-old/players/PLR01_haruki.png` に温存。

**Wave 3 (v0.36.8, 2026-05-06)**: 全 20 体 (PLR01 を除く) を新 4/4 フォルダ
形式 (`character.png` + `background.png` + `icon.png` + `spec.md`) に
移行。PLR13 と PLR15 は slug + 名前 + アーキタイプを完全変更。PLR10 /
12 / 16 / 17 / 20 はアーキタイプ刷新。旧 512 PNG は
`avatars-old/players/PLRxx_<oldslug>.png` に履歴保存。

| index | 名前 | 主人公アーキタイプ | ファイル (icon.png) | アンロック |
|---|---|---|---|---|
| 0 | あなた (PLR00 default) | 盤上世界の旅人 | `players/PLR00_default/icon.png` | 最初から |
| 1 | 美琴 | 魔法学園の天才 | `players/PLR02_mikoto/icon.png` | 1 周クリア |
| 2 | リン | VRMMOの最強プレイヤー | `players/PLR03_rin/icon.png` | 2 周 |
| 3 | 蓮 | 剣道部主将 | `players/PLR04_ren/icon.png` | 3 周 |
| 4 | 千歳 | タイムリープ少女 | `players/PLR05_chitose/icon.png` | 4 周 |
| 5 | 晴 | 現代の陰陽師 | `players/PLR06_haru/icon.png` | 5 周 |
| 6 | カイ | 空の冒険者 | `players/PLR07_kai/icon.png` | 6 周 |
| 7 | 千夏 | 聖剣の村娘 | `players/PLR08_chinatsu/icon.png` | 7 周 |
| 8 | 透 | 学園名探偵 | `players/PLR09_toru/icon.png` | 8 周 |
| 9 | ノア | **アイドル** ⚠ (旧: 未来から来た少女) | `players/PLR10_noa/icon.png` | 9 周 |
| 10 | 凪 | 異世界料理人 | `players/PLR11_nagi/icon.png` | 10 周 |
| 11 | エル | **森の精霊** ⚠ (旧: 元魔王、転校生) | `players/PLR12_el/icon.png` | 11 周 |
| 12 | **イレウユ** ⚠ (旧: スミレ) | **記憶喪失の浮遊霊** ⚠ (旧: 記憶喪失の冒険者) | `players/PLR13_yreuyu/icon.png` (旧 `PLR13_sumire`) | 12 周 |
| 13 | 葉月 | 機械工学の天才 (スチームパンク貴族) | `players/PLR14_hazuki/icon.png` | 13 周 |
| 14 | **ジエンド** ⚠ (旧: 隼人) | **凄腕ガンナーカウボーイ** ⚠ (旧: 凄腕ガンナー) | `players/PLR15_theend/icon.png` (旧 `PLR15_hayato`) | 14 周 |
| 15 | ひかり | **ジムにいたお姉さん♡** ⚠ (旧: 光の精霊使い) | `players/PLR16_hikari/icon.png` | 15 周 |
| 16 | ヨル | **吸血鬼** ⚠ (旧: 半吸血鬼) | `players/PLR17_yoru/icon.png` | 16 周 |
| 17 | 湊 | 海の冒険者 (Victorian Explorer) | `players/PLR18_minato/icon.png` | 17 周 |
| 18 | 奏太 | 天才ピアニスト | `players/PLR19_souta/icon.png` | 18 周 |
| 19 | 悠 | **神話の姫** ⚠ (旧: 神話の英雄) | `players/PLR20_yu/icon.png` | 19 周 (= AVATARS index 19、これで章 20 を制覇すると PLR01 が解放) |
| **🌟 20** | **英霊ハルキ (PLR01)** | **英霊化された旅人 (時間逆転ロア)** | `players/PLR01_haruki_heroic/icon.png` | **PLR02〜PLR20 全 19 体での章 20 制覇後** (= 21 番目の英雄として召喚) |

**PLR01 の特殊性**: 未来の英霊化形態のハルキ。WORLD_BIBLE / part4 の
規定に従い、**PLR02〜PLR20 全 19 体それぞれで章 20 を制覇した後**、
最後の特別枠として召喚される 21 番目の英雄。AVATARS 配列の最後尾
(index 20) に並ぶ。PLR01 を選択して章 20 をクリアすると**真エン
ディング達成**となり `trueEndingAchieved` フラグが立ち、隠し OPP21
ゼロ (現世帰還) + OPP22 ヴォイドφ が同時にアンロックされる。

**Chain unlock の動作 (v0.36.40 以降, Design A)**: 各スロットは
`slot.avatarsClearedCh20: number[]` を持ち、章 20 を初制覇した
AVATARS index (0..19) を蓄積する。PLR01 (index 20) は chain の終点
であって chain step ではないので、この配列には入らない。

**Design A の核**: 各 chain step PLR は**自身の章 1-20 lap を全走**する。
PLR0M で章 20 を勝利すると `recordSlotResult` が:
1. `avatarsClearedCh20` に M を追加
2. `slot.unlockedCount = avatarsClearedCh20.length` 派生更新
3. **`slot.storyProgress` を 0 にリセット** (= 次の chain step PLR の
   lap 序章へ)
4. App.tsx の gameOver 効果が `setP1Avatar(nextUnlocks)` で次の
   PLR に自動切替

これにより、saved point identity は常に「現在 active な PLR + その PLR
の lap progress」を表す。PLR00 で章 1-20 を制覇 → PLR02 lap 序章 →
PLR02 で章 1-20 → PLR03 lap 序章 → ... → PLR20 で章 1-20 → PLR01 lap
序章 → PLR01 で章 1-20 → 真エンディング (= ch.21 状態)。総試合数は
PLR00 (20) + PLR02..PLR20 各 20 (= 380) + PLR01 (20+1) = **約 421 試合**
で全制覇。

**Design B (v0.36.26〜v0.36.39) からの切替**: 旧設計では各 chain
step は章 20 のみ 1 試合だった (storyProgress 20 で打ち止め)。
v0.36.40 で「各 PLR が自身の lap を全走」に方針転換。
`storyProgress >= 20` というゲートに依存していた表示 / chapter
browser ロジックは `trueEndingAchieved` ベースに更新。Legacy slot
(sp=20 + acclen<20 + !trueEnd) は `migrateSlot` の
`normalizePostClearState` で読込時に sp=0 + acclen+1 へ自動正規化。

`slot.unlockedCount = avatarsClearedCh20.length` を維持しているため、
20 に到達すると AVATARS picker の `isLocked = i > unlockedCount`
ゲートを通過して PLR01 が選択可能になる。実装位置:

- `src/storage/saveSlots.ts:recordSlotResult` — `playerAvatarIdx` 引数
  を受け取り、ch.20 win かつ未蓄積 PLR0..19 のときに `avatarsClearedCh20`
  に push + `unlockedCount` 更新 + **`storyProgress = 0` リセット**
  (Design A、v0.36.40〜)
- `src/storage/saveSlots.ts:normalizePostClearState` — Design A 移行時
  の自動正規化。Legacy / spell-warp 由来の `sp=20 + acclen<20 + !trueEnd`
  状態を `sp=0 + acclen+1` へ。`migrateSlot` の読込パスから 1 回呼ばれる
- `src/storage/saveSlots.ts:getSavePointDisplay` — slot から
  `(plrIdx, plrSlug, plrName, chapter, chapterMax)` を導出する純関数。
  SlotPicker / TitleScreen / 設定パネルが共通で利用
- `src/storage/saveSlots.ts:reconcileAvatarsCleared` — 旧スロット
  (`unlockedCount=N` のみ) から `[0..N-1]` を back-derive する純関数
  ヘルパー。`migrateSlot` の読み取りパスから呼ばれる
- `App.tsx` の gameOver 効果は `recordSlotResult` の戻り値で
  `slotBefore.unlockedCount` → `slotAfter.unlockedCount` の差分を見て
  unlock UI (`setUnlockedThisRun` + `setP1Avatar(nextUnlocks)`) を発火
- `App.tsx` の `castSpell` (呪文 warp) は `unlockedCount=N` 設定と
  併せて `avatarsClearedCh20=[0..N-1]` を同期書き込み

**検出ロジック (PLR01 判定)**: `AVATARS[p1Avatar].image.includes('PLR01_haruki_heroic')` (App.tsx の gameOver 効果内 + `aiAvatarImage` 派生)。

**過去の誤った記述**: v0.36.25 までこのセクションは「PLR00 で章 20
をクリアすると PLR01 が解放される」と書いていた。これは WORLD_BIBLE
の理想形 (PLR02〜PLR20 全制覇後) と旧コード実体 (1 スロット最大
unlockedCount=1 で打ち止め) のどちらとも一致しない誤った中間案で、
v0.36.26 で世界観に合わせて実装側を理想形に揃え、本記述も統一した。

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

- **進捗保存**: スロットごと `slot.storyProgress` (0-20)。Phase 2 で
  `localStorage('othello:save_slots')` 配下に集約。旧
  `othello:story_progress` (legacy 単独キー) は migration 経路で
  slot[0] にシードされるのみで、現役は使われない。
- **対戦相手は固定**: `aiMode === 'story'` の useEffect で
  `storyProgress + 1` のレベルを持つキャラを自動選択 (`Math.min` で
  20 にクランプされ、Lv.21/22 はストーリーには出ない)。
- **章導入文**: `t.story.chapterStories[i]` (i18n)。レベル毎の
  intro / bossPre / bossPost / victoryDialogue / victoryNarration。
- **OP/ED**: `t.story.prologue` / `t.story.endingFull`。
- **勝利時に自動進行**: gameOver 効果で `recordSlotResult` が
  `slot.storyProgress` を +1 (`< 20` 時のみ)。`resultRecorded`
  フラグで多重発火防止。
- **負け／引き分け**: 進捗据え置き。`lives` は -1 (resign 含む)。
- **真エンディング (Phase 3 → Phase 4 Step 3 で 4 段化、v0.36.2 で
  毎回再生化、v0.36.6 で章 20-A 対峙シーンを前段に追加して 5 段化)**:
  PLR01 英霊ハルキで章 20 を**開始した瞬間**から、勝利後まで
  以下が連鎖再生:
  0. **章 20-A 対峙シーン (`narrative.chapter20A`、v0.36.6 追加)** —
     `startStoryChapter(20, …)` で PLR01 が ch.20 に入ると、盤面
     リセット直後に NarrativeOverlay がフルスクリーンで覆い、
     新 bossPre (「君は人間なんだろ?」テーマ) を読み終えてから
     対局開始。挿絵: `/illustrations/chapter_20a_confrontation-{landscape,portrait}.png`。
  1. シネマティック `narrative.trueEnding20B` (解放の瞬間) →
     `narrative.trueEnding20C` (現世エピローグ) → **`narrative.trueEnding20D`
     (Phase 4 Step 3 追加: ヴォイドφ覚醒)** が NarrativeOverlay 経由で
     連続再生。**v0.36.2 から `!trueEndingAchieved` /
     `!voidphiAwakened` の冪等性ガードを撤去し、毎回 PLR01 ch.20 win
     で再発火するように変更** (ユーザー要望「一回だけでなく何回も
     出してもらえないですかね」)。
  2. 初回のみ `trueEndingAchieved` (`localStorage('othello:true_ending_achieved') = '1'`)
     と `voidphiAwakened` (`localStorage('othello:voidphi_awakened') = '1'`)
     のフラグが立ち、隠し Lv.21 OPP21 と Lv.22 OPP22 がアンロック。
     2 回目以降の win では setStateFlag は冪等でフラグ状態は変わらず、
     OPP21/22 はアンロック済のまま (アンロック判定: OPP 選択画面の
     isLocked は `c.level === 22 ? !voidphiAwakened : !trueEndingAchieved`
     で gate を分岐)。
  3. 視聴済みは scene archive に登録、`getOrderedArchiveScenes` の
     順序は prologue → ch1..20 → 幕間 → ED → 20B → 20C → 20D →
     opp22.intro → opp22.victoryNarration。
  実装は App.tsx gameOver 効果内 + storyOverlay 連鎖 dismiss。
  挿絵: `/illustrations/trueEnding20{B,C}-{landscape,portrait}.png`
  + `/illustrations/chapter_20d_voidphi-{landscape,portrait}.png`
  (NarrativeOverlay の `imageBaseName` に渡される)。OPP22 専用の
  intro / bossPre / bossPost / victoryNarration テキスト 5 ブロック
  は i18n に格納済み (`t.story.opp22.*`)、archive 経由で再生可能。
  in-battle 統合 (free-mode で OPP22 戦時に bossPre / bossPost を
  画面に出す) は follow-up patch で対応予定。

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
