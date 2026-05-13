# OPP15「シエル」全面置き換え — Claude chat → Claude Code 引き継ぎパッケージ要件

> このメモは、ch15 のボス **OPP15 シエル (Ciel / サイバー斥候 / level 15)** を
> **キャラ設定・アバター画像・章挿絵・ストーリーテキスト** まで丸ごと別キャラに
> 置き換えるにあたり、**Claude chat 側が Claude Code セッションへ渡す引き継ぎ
> パッケージが満たすべき要件**をまとめたもの。Code 側はパッケージ受領時にこの
> メモのチェックリストに沿って統合する。
>
> 作品名: 召喚されたらオセロ世界でした！ (Summoned as an Othello Player) /
> 異界の名: 盤上世界 (Bansho Sekai)
>
> 最終更新: 2026-05-13

---

## 0. 前提・固定事項（変えてはいけないもの）

- **level = 15**: AI 難易度設計上のスロット（minimax depth 3）。新キャラもここに座る。
- **構造ポジション = 「19人の達人の15番目」「ストーリー第2部の締め章 (ch15)」**: ストーリー
  上の並び順は不変。ch13(雪乃)→ch14(アキラ)→**ch15(本キャラ)**→ch16(アリア) の流れ。
- **真エンディング系（ch20-A/B/C/D, OPP21, OPP22）は ch15 と無関係** — 触らない。
- **slug はリネームする**（ユーザー決定）。`OPP15_ciel` → `OPP15_<newslug>`。
  画像フォルダ名・章挿絵ファイル名・`COMPUTERS` の `image`/`chapterArtBase` パスも全部更新。
- **旧アセットは `public/avatars-old/` へ退避**（削除しない）。

---

## 1. いま「シエル」が触っている全フットプリント（置き換え対象一覧）

Claude chat 側はこの一覧を見て「新キャラ用に何を作ればいいか」を把握できる。

### 1.1 アバター素材
| パス | 内容 | 規格 |
|---|---|---|
| `public/avatars/opponents/OPP15_ciel/character.png` | キャラ単体（透過済） | 1024×1024 RGBA |
| `public/avatars/opponents/OPP15_ciel/background.png` | このキャラ専用背景 | 1024×1024 RGB |
| `public/avatars/opponents/OPP15_ciel/icon.png` | 円形クロップ済の合成アイコン（UI でそのまま `<img>`） | 1024×1024 RGBA |
| `public/avatars/opponents/OPP15_ciel/spec.md` | このキャラの正の仕様書 | テキスト |
| `public/avatars/chapters/chapter_15_ciel-landscape.png` | 章15 挿絵（横） | 1672×941 RGB |
| `public/avatars/chapters/chapter_15_ciel-portrait.png` | 章15 挿絵（縦） | 941×1672 RGB |
| `public/avatars-old/opponents/OPP15_ciel.png` | 旧 256px 簡易版（**触らない・温存**） | 256×256 PNG |

### 1.2 コード参照
- `src/App.tsx` の `COMPUTERS` 配列 level 15 エントリ（現状）:
  ```ts
  { kanji: '銀', name: 'シエル', name_en: 'Ciel', level: 15,
    quote: '全データ把握、戦況優位', quote_en: 'All data acquired. Position favorable.',
    image: 'avatars/opponents/OPP15_ciel/icon.png',
    chapterArtBase: 'avatars/chapters/chapter_15_ciel' }
  ```
- `src/data/personas.ts` — `kanji` キーで引かれる persona フラグメント:
  ```ts
  { kanji: '銀',
    ja: 'サイバー斥候の「シエル」。機械的で簡潔、「データ」「優位」「変数確認」と無機質な語彙を使う。',
    en: 'Ciel, a cyber scout. Mechanical and terse. "Data acquired", "advantage holds", "variables nominal".' }
  ```
  ⚠ `kanji` は **persona の lookup キーを兼ねる**。新キャラの `kanji` を変えるなら
  `COMPUTERS` 側と `personas.ts` 側の両方を同じ新 `kanji` に揃える必要がある。
- `src/i18n/messages.ts` — キャラ 1 行説明:
  - ja: `'サイバー斥候「シエル」。データ最適化された手筋を高速で繰り出す。'`
  - en: `'Ciel the cyberpunk scout. Fires off data-optimized moves at high speed.'`

### 1.3 ストーリー i18n（`src/i18n/story/ja.ts` / `en.ts`）
※行番号は 2026-05-13 時点の目安。投入時は **`grep -n "シエル" src/i18n/story/ja.ts` /
`grep -n "Ciel" src/i18n/story/en.ts`** で全件再確認すること。

| 区分 | 場所（ja.ts の例） | 内容 |
|---|---|---|
| **共通 章15 本文** | `chapterStories` 配列の「Ch.15 シエル」ブロック（ja ~343–357 付近の `ch(intro, bossPre, bossPost, victoryDialogue, victoryNarration)`、en ~347–365） | 章15 の標準ストーリー 5 ブロック |
| ch13 victoryNarration | `ja.ts:339` / `en.ts:343` | 「次の達人は **シエル**。── **ネオンの未来都市**に居る」→ 新キャラ名・新世界観のロケに |
| ch14(アキラ) victoryNarration | `ja.ts:1508` / `en.ts:1503` | 「次は **シエル** ── 都市最深部のデータセンター」→ 同上 |
| `narrative.allies` の19人スキル列挙 | `ja.ts:519` / `en.ts:524` | 「…アキラの推理、**シエルの確率**、アリアの所作…」→ 新キャラの代表スキル名に |
| `narrative.final` の19人スキル列挙 | `ja.ts:897` / `en.ts:898` | 「…アキラの推論、**シエルの確率**、アリアの所作…」→ 同上 |
| `narrative.final` 系 PLR00 エンディング列挙 | `ja.ts:978` / `en.ts:979` | 「…アキラの**逆推理**、**シエルの全データ**、アリアの**所作**…」→ 同上 |
| ch15 内ナラティブ（アリア伏線） | `ja.ts:1539` / `en.ts:1534` | 「（所作 ── これは**最古の記号体系**、と **シエル**が言っていた…）」→ 新キャラと整合 |
| ch16(アリア) bossPost | `ja.ts:1633` / `en.ts:1628` | 「（──流派名を、**知っている**。シオンか、**シエル**か。…）」→ 名前を残すか差し替え |
| **PLR02 美琴ルート 章15 オーバーライド** | `chapterStoriesByPlr[1]` 内（ja `1248:` から始まる配列の Ch.15 ブロック） | 美琴視点の並行章。`victoryNarration` に「美琴の魔導書」描写あり |
| **PLR03 リンルート 章15 オーバーライド** | `chapterStoriesByPlr[2]` 内（ja `1668:` から始まる配列の Ch.15 ブロック、ja ~2007–2030） | リン視点の並行章。`victoryNarration` に「リンの HUD コンソール」描写あり |
| PLR02 / PLR03 ルートの allies/final 列挙 | `narrativeByPlr[1].*` / `narrativeByPlr[2].*`（grep で要特定） | これらの達人列挙にもシエルが出る可能性あり |
| （上記すべて） | en.ts 側の対応オカレンス | ja と 1:1 で差し替え |

### 1.4 ドキュメント
- `othello-game/CLAUDE.md` §4.1 ロスター表の OPP15 行（`| 15 | シエル | 銀 | サイバー斥候 | … |`）
- `othello-game/CLAUDE.md` §5「採用: 自然な日本語の人名」の **カタカナ枠の例示**にシエルが入っている
- `public/avatars/opponents/INDEX.md` の OPP15 行（名前・アーキタイプ・quote・フォルダリンク）
- `public/avatars/README.md` — フォルダ構造の概要（slug 変更があれば軽く言及）
- `othello-game/docs/scenario/` の原稿群（ch13→15 遷移・ch15 全シーン・章ロア・動的台詞）は**原典**。
  コード反映後にここも整合させたければ更新候補（必須ではない）

---

## 2. 引き継ぎパッケージが満たすべき要件（Claude chat 側へのお願い）

> **段階的・反復納品 OK**（ユーザー方針）。すべてが一度に揃う必要はない。
> 「今回はアバター + 共通章15だけ」のような部分パッケージでよい。Code 側は
> 揃った分を統合し、未着の部分は旧アセット／旧テキストのまま動かして、
> 「次は X が必要」と報告する（→ §5）。

### B-1. 新キャラの正規定書（`spec.md`）— **これが基準点。最初に欲しい**
以下を必ず含む:
- **新 slug**: `OPP15_<newslug>` の `<newslug>`。
  命名規約は CLAUDE.md §5 に従う:
  - カタカナの外来・異質キャラ → slug はローマ字（例 `OPP15_aria` 型）
  - 一字漢字の凛々しい和風キャラ → slug は kanji 連想のローマ字
  - 「中華風オン読み二字熟語」「大仰な漢字二字熟語」は却下方針
- **名前** `name`（ja）/ **英名** `name_en` / **`kanji`**（1 字、persona lookup キー兼用なので
  既存 21 体と被らないこと。既存: 苺 葵 朝 撫 響 紬 茜 薬 悟 黒 詩 夢 雪 暁 銀 姫 獅 宗 嵐 零 φ。
  「銀」を引き継ぐか新しい1字にするか明示）
- **アーキタイプ**（例: 「サイバー斥候」→ 新アーキタイプ名）
- **quote** `quote`（ja）/ `quote_en`（en）— 対戦相手の決め台詞、短く（現状「全データ把握、戦況優位」級）
- **ビジュアル正規定**: 髪・目・服装・小道具・背景の世界観（シーン間一貫用）
- **voice / 性格**（persona 用）: 話し言葉のレジスタ（です／だね／じゃん／敬語／古風）、
  感情ベースライン（陽気／冷淡／夢見がち）、12字以内の口癖

### B-2. アバター素材 4 ファイル（既存 OPP の 4/4 構造に準拠）
- `character.png` — 1024×1024 RGBA、透過処理済（Photoshop で背景抜き）
- `background.png` — 1024×1024 RGB、このキャラ専用背景
- `icon.png` — 1024×1024 RGBA、円形クロップ済の合成アイコン（UI でそのまま `<img>` 利用可）
- `spec.md` — B-1 の正規定書

### B-3. 章挿絵 2 ファイル
- `chapter_15_<newslug>-landscape.png` — 1672×941、RGB
- `chapter_15_<newslug>-portrait.png` — 941×1672、RGB
- 用途: 章15 の戦闘前・勝利後に `ChapterStoryOverlay`（および章導入の `ChapterIntroScreen`）で
  フルスクリーン表示される。新キャラの世界観で

### B-4. ストーリーテキスト（**ja + en 必須**。段階的納品 OK）
- **共通 `chapterStories[14]` の 5 ブロック**: `intro` / `bossPre` / `bossPost` /
  `victoryDialogue` / `victoryNarration`
- （任意・新キャラ概念が大きく変わる場合）**PLR02 美琴ルート / PLR03 リンルートの
  章15 オーバーライド**（`chapterStoriesByPlr[1]` / `[2]` の該当ブロック）を再記述
- **他章のシエル言及の差し替え案**（§1.3 の表の cross-reference 行すべて、ja + en）:
  ch13 / ch14 の「次は〈新名〉」遷移ナレ、`narrative.allies`・`narrative.final` の19人列挙、
  PLR00 エンディング列挙、ch15 内のアリア伏線ナラティブ、ch16 アリア bossPost
- **persona フラグメント**（`personas.ts`）: `{ kanji: '<新kanji>', ja: '…', en: '…' }`
- **messages.ts のキャラ 1 行説明**: ja / en

### B-5. メタデータブロック（`COMPUTERS` に流し込む値の一覧）
```
slug:           OPP15_<newslug>
kanji:          <1字>
name:           <ja名>
name_en:        <英名>
level:          15                  ← 固定（変更不可）
quote:          <ja>
quote_en:       <en>
image:          avatars/opponents/OPP15_<newslug>/icon.png
chapterArtBase: avatars/chapters/chapter_15_<newslug>
archetype(参考): <新アーキタイプ名>
```
\+ CLAUDE.md §5 命名規約への適合チェック結果（文字種選択の根拠を一言）

---

## 3. 推奨パッケージ構造（PLR02/PLR03 ハンドオフと同型）

```
OPP15_<newslug>_replacement/
├── README.md                       ← 全体説明 + 同梱物のリスト + 今回どこまで含むか
├── 00_TASK.md                      ← Code への作業手順（§4 を転記）
├── 01_QA.md                        ← 投入後 QA 観点（§5 を転記）
├── 02_ROLLBACK.md                  ← 失敗時のロールバック手順（§6 を転記）
├── BUILD_TAG.txt                   ← コミット用タグ案（例 `v0.36.xx · opp15-<newslug>-replacement`）
├── metadata.txt                    ← B-5 メタデータブロック
├── spec.md                         ← B-1 正規定書
├── avatars/                        ← B-2
│   ├── character.png
│   ├── background.png
│   ├── icon.png
│   └── spec.md
├── chapters/                       ← B-3
│   ├── chapter_15_<newslug>-landscape.png
│   └── chapter_15_<newslug>-portrait.png
└── i18n_patches/                   ← B-4（揃った分だけでも OK）
    ├── ja_chapterStories_ch15.txt        （共通 章15）
    ├── en_chapterStories_ch15.txt
    ├── ja_chapterStoriesByPlr_ch15.txt   （PLR02 / PLR03 オーバーライド、任意）
    ├── en_chapterStoriesByPlr_ch15.txt
    ├── ja_cross_references.txt            （ch13 / ch14 / allies / final / ch16 の差し替え）
    ├── en_cross_references.txt
    ├── personas_entry.txt
    └── messages_label.txt
```

---

## 4. Claude Code 側の統合手順（`00_TASK.md` に転記）

1. **ブランチ**: 自セッションの `claude/<task>-<hash>` ブランチで作業。着手前に
   `git fetch origin main && git merge origin/main`。
2. **旧アセット退避**:
   - `mkdir -p public/avatars-old/opponents/OPP15_ciel_<YYYY-MM> public/avatars-old/chapters`
   - `git mv public/avatars/opponents/OPP15_ciel/{character.png,background.png,icon.png,spec.md} public/avatars-old/opponents/OPP15_ciel_<YYYY-MM>/`
   - `git mv public/avatars/chapters/chapter_15_ciel-landscape.png public/avatars/chapters/chapter_15_ciel-portrait.png public/avatars-old/chapters/`
   - 旧 256px `public/avatars-old/opponents/OPP15_ciel.png` は**触らない**
3. **新アバター配置**: `public/avatars/opponents/OPP15_<newslug>/` に 4 ファイル。
   `file`/`identify` で寸法検証（character/background/icon = 1024×1024）。
4. **新章挿絵配置**: `public/avatars/chapters/chapter_15_<newslug>-{landscape,portrait}.png`。
   寸法検証（landscape 1672×941 / portrait 941×1672）。
5. **`COMPUTERS` 更新**（`src/App.tsx` の level 15 エントリ）: `kanji` / `name` / `name_en` /
   `quote` / `quote_en` / `image` / `chapterArtBase` を metadata.txt の値に。
6. **persona 更新**（`src/data/personas.ts`）: 旧 `{ kanji: '銀', … }` を新 `kanji` + 新 ja/en に。
   `kanji` を変えた場合は `COMPUTERS` 側と一致しているか確認。
7. **messages 更新**（`src/i18n/messages.ts`）: ja / en のキャラ 1 行説明を差し替え。
8. **i18n story 更新**（`src/i18n/story/ja.ts` / `en.ts`）:
   - 共通 `chapterStories[14]` の 5 ブロック
   - （来ていれば）`chapterStoriesByPlr[1]` / `[2]` の 章15 ブロック
   - 他章のシエル言及（ch13 / ch14 victoryNarration、`narrative.allies` / `narrative.final` の
     19人列挙、PLR00 エンディング列挙、ch15 内アリア伏線、ch16 アリア bossPost、
     `narrativeByPlr` の該当箇所）
   - **漏れチェック**: `grep -rn "シエル" src/i18n/ && grep -rn "Ciel" src/i18n/` が空（または
     新コードのみ）になるまで。`docs/scenario/` の歴史的記述は対象外。
9. **ドキュメント更新**: CLAUDE.md §4.1 ロスター表の OPP15 行 + §5 カタカナ例示（シエル→新名）、
   `public/avatars/opponents/INDEX.md` の OPP15 行、`public/avatars/README.md`（slug 変更を一言）。
10. **version bump**: `package.json` の `version`、`src/components/TitleScreen.tsx` の `BUILD_TAG`。
11. **検証**: `npm run typecheck` → `npm test -- --run`（全テスト pass）→ `npm run build`
    （precache 件数は ±0 のはず: 旧 4+2 が抜けて新 4+2 が入る）。
12. **commit + push**: `git push -u origin <自ブランチ>`。
13. **main へ反映**: GitHub MCP（`mcp__github__create_pull_request` → `mcp__github__merge_pull_request`）
    で main へマージ → live deploy。※PR 作成はユーザー明示の場合のみ。CLAUDE.md §0 のローカル
    マージ手順（`git checkout main && git merge <branch> && git push origin main`）でも可。
14. **BACKLOG.md** の In Progress → Done。`completed` 日付・`by` セッション・`commit` ハッシュ記入。
15. **未着項目があれば** ステータス報告に明記して次の納品を依頼（例:「現状: アバター・共通章15
    反映済 / 未着: PLR02・PLR03 オーバーライド・ch16 言及差し替え」）。
16. **ターン終了時の必須報告**（CLAUDE.md §0.4 のテーブル形式）を出す。`?v=` suffix は
    `<YYYYMMDD>opp15<newslug>` 等。

---

## 5. 検証チェックリスト（`01_QA.md` に転記）

- [ ] キャラ選択画面で level 15 が新アイコンに切り替わっている
- [ ] フリーモード Lv.15 戦で新背景が出る／動的コメンタリーが新 persona の口調になる
- [ ] ストーリーモード ch15: 章導入・戦闘前・勝利後の章挿絵が新キャラ版
- [ ] ch15 の intro / bossPre / bossPost / victoryDialogue / victoryNarration が新テキスト（ja/en 切替で追従）
- [ ] ch13 / ch14 の「次は〈新名〉」遷移ナレが新名・新ロケ
- [ ] `narrative.allies` / `narrative.final` の19人列挙に新名・新スキルが入り、旧「シエルの確率」が残っていない
- [ ] PLR00 エンディング列挙の「シエルの全データ」相当が新キャラ版
- [ ] ch15 内のアリア伏線ナラティブ（「最古の記号体系…」）が新キャラと整合
- [ ] ch16 アリアの「流派名を、知っている。シオンか、シエルか」が整合（名前を残す／差し替える）
- [ ] PLR02 美琴ルート / PLR03 リンルートの ch15 が新キャラ版（オーバーライドを納品した場合）
- [ ] シーン回想アーカイブで章15 が新挿絵で再生される
- [ ] CLAUDE.md §4.1 / §5、INDEX.md、README.md の表記が新名・新 slug
- [ ] 旧アセットが `public/avatars-old/` に退避済み（live バンドルからは消えている）
- [ ] `grep -rn "シエル\|Ciel\|OPP15_ciel\|chapter_15_ciel" src/ public/avatars public/avatars/opponents/INDEX.md`
      が新コードに残っていない（`avatars-old/`・`docs/scenario/` の歴史的記述は除外）
- [ ] `npm run typecheck` / 全テスト / `npm run build` すべて pass

---

## 6. ロールバック（`02_ROLLBACK.md` に転記）

- **テキストだけ戻す**: `src/i18n/story/*.ts` の `chapterStories[14]` 等を該当 commit から revert。
  旧シエルテキストに戻る。
- **画像だけ戻す**: `git mv public/avatars-old/opponents/OPP15_ciel_<YYYY-MM>/* public/avatars/opponents/OPP15_ciel/`
  ／章挿絵も `avatars-old/chapters/` から戻す。`COMPUTERS` の `image` / `chapterArtBase` も旧
  `OPP15_ciel` パスに戻す。
- **完全ロールバック**: 該当 commit（または PR マージ commit）を `git revert`。旧シエルが全面復帰。

---

## 7. 既知の注意点

- **`kanji` は persona の lookup キー兼用**。新 `kanji` がユニークか確認し、`COMPUTERS` と
  `personas.ts` で必ず一致させる。
- **level 15 固定**（minimax depth 3 のスロット）。「15番目の達人」というストーリーポジションも不変。
- **`avatars-old/chapters/` は現状存在しない**（`opponents/` と `players/` のみ）→ 退避時に `mkdir` が要る。
- **per-PLR 専用挿絵**（`public/illustrations/PLR0x_*/`）には章挿絵は無い。章挿絵は
  `avatars/chapters/` に集約。新キャラの per-PLR 専用挿絵は現状不要。
- **`docs/scenario/` の原稿**は原典。コードに反映した後でここも整合させると望ましいが必須ではない。
  歴史的記述（旧シエル設定の痕跡）は QA の grep 対象から除外する。
- **Tailwind の動的クラス名・動的 JSX 参照**の地雷（CLAUDE.md §11）は今回の作業範囲では踏まないが、
  もし新キャラ用に UI 分岐を足すなら注意。

---

## 8. このメモの位置づけ

OPP15 シエル専用の引き継ぎ要件メモ。同様の「既存 OPP/PLR を slug ごと丸ごと差し替える」
タスクが将来出たら、本メモを雛形として `docs/handoff/oppNN_<old>_replacement.md` を起こすとよい
（§1 を対象キャラの grep 結果で埋め直し、§2〜§7 はほぼそのまま流用可能）。
