# PLR02 美琴 ストーリー & 挿絵 ハンドオフ (Claude chat → ChatGPT 向け)

> 「論理と魔法は同じ」 — 美琴の信条
> 作品: 召喚されたらオセロ世界でした！ (Bansho Sekai)
> パイロット対象: PLR02 美琴 (魔法学園の天才・大聖堂図書館)
> 目標: 4 シーン × landscape/portrait = **8 枚**の挿絵を生成・パッケージング

このドキュメントは Claude chat 単独で読めるように書かれた**自己完結型ハンドオフ**です。Tensei-Othello の repo 知識がなくても、コンテンツ内容と納品要件が読み取れます。Claude chat はこの文書を起点に、ChatGPT (DALL-E or GPT-Image-1) へ画像生成プロンプトを送り、戻ってきた画像のキャラ・場面整合性をレビューし、合格したものを ZIP にまとめて Claude Code 側へ渡してください。

---

## 📦 ハンドオフ ZIP パッケージ

ユーザーが別セッションの Claude chat / ChatGPT に渡すための自己完結
ZIP パッケージは、**Claude Code セッション側で生成され、ユーザーが
直接受け取る**運用です (= GitHub には上げない)。

ZIP の中身 (約 4.5MB):
```
PLR02_mikoto_handoff/
├── README.md                                       ← 最初に読む使い方ガイド
├── 00_CLAUDE_CHAT_INSTRUCTIONS.md                  ← Claude chat への role 説明
├── 01_HANDOFF_per_plr_narrative_concept.md         ← 全体ハンドオフ (このファイル)
├── 02_SCENE_spec_4_scenes.md                       ← 4 シーンの ChatGPT プロンプト詳細
└── character_reference/
    ├── PLR02_mikoto_character_transparent.png      (1024×1024 RGBA, 背景透過)
    ├── PLR02_mikoto_cathedral_library_background.png (1024×1024 RGB)
    ├── PLR02_mikoto_icon.png                       (1024×1024 RGBA)
    └── PLR02_mikoto_canonical_spec.md              (キャラ正規定書)
```

**透過 character.png** が同梱されているので、ChatGPT に毎シーン参照
画像として渡せばキャラブレを最小化できます。

ZIP を再生成したい場合は Code セッションでビルドスクリプトを叩く運用
にする予定 (今は手動: `tools/build_handoff_zip.sh` を作成予定)。



---

## 1. 背景・ゴール

このゲームは 21 体のプレイヤーキャラクター (PLR00 ハルキ + PLR02..PLR20 の 19 体 + PLR01 英霊ハルキ) で章 1-20 のストーリーモードを周回するアドベンチャー。これまで PLR00 (デフォルト主人公) のみが固有挿絵 + ストーリーを持ち、他 PLR は共通挿絵を共有していました。

v0.36.55 以降、各 PLR が**自分専用のシーン挿絵 + ナラティブ**を持てる仕組みを実装。**第 1 弾パイロットが PLR02 美琴**です。これを足がかりに PLR03..PLR20 へ展開していく予定。

ゴール: 美琴専用 4 シーンの挿絵 (各 landscape + portrait) を生成して、ゲームが「美琴で周回している人」に対してテキストも絵も**美琴の世界観で**提示できるようにする。

---

## 2. キャラクター規定 (シーン間で**完全一貫**させること)

### PLR02 美琴 (Mikoto)

> Long flowing pure **BLACK hair** (slightly wavy, glossy). Side hair tied half-up into a high side bun-tail secured by a **bright BLUE RIBBON BOW** (signature accessory). Round/oval thin-framed **GLASSES**.
>
> **VIOLET/PURPLE eyes** with a calm, intelligent gaze, faint scholarly smile.
>
> **Outfit (academic uniform)**:
> - Dark navy/black blazer with **GOLD trim** along edges and lapels
> - **Bright BLUE inner-lining/lapel facing** (peeking out from front edges)
> - White collared shirt
> - **GOLDEN/yellow patterned tie** with subtle filigree (suggesting magical sigils)
>
> **Hand props**: Holding a thick, dark-bound **MAGICAL TOME** (黒革+金箔押し, decorated with a GOLD STAR/MAGIC SIGIL on the cover) — protectively against her chest.
>
> **Energy**: Studious prodigy. Quiet confidence. The kind of student who reads three books while everyone else struggles through one.

**世界観の場所**: 大聖堂図書館 (Cathedral library / Magic academy) — ゴシック建築・ステンドグラス・燭台・古い書架・列柱

---

## 3. 共通トーン (全 4 シーン)

- **基調色**: 深い闇 (`#0a0805` 相当) + 琥珀ゴールドのアクセント
- **美琴専用色相**: **青** (魔法学園の紋章色、リボン、内張) + **金** (フィリグリー、魔導書の箔押し) + **紫** (瞳の薄い反射光)
- **光源**: 燭台の蒼炎・月光・ステンドグラス透過光・朝日 (シーンにより)。直接光より**間接光**で陰影を作る
- **画面構成**: 美琴を画面中央〜やや左、魔導書を必ず画面に映す。背景は**大聖堂図書館**の建築要素を主体に
- **避けたい要素**: 文字オーバーレイ・透かし・追加キャラ (allies シーンの達人達を除く)・カジュアルなアイコン・SD/ちびキャラ化

---

## 4. シーン仕様 (4 枚)

### 4.1 シーン 1/4: solitude — 大聖堂図書館の静夜

**ストーリー位置**: 章 10 を破った直後の幕間。一人で深夜の図書館に戻り、達人達との棋譜を並べながら「論理と魔法は同じ」の確信を固める瞬間。

**構図**:
- 美琴は古い樫の机に座り、開いた魔導書を前に羽根ペンを握っている
- 机の上に符号化された分岐表 (8×8 のオセロ盤を模した羊皮紙)、燭台 1 つ、インク壷
- 背景: 高天井のゴシック大聖堂図書館、両側に巨大な書架、奥にステンドグラスの円窓 (満月の光が蒼く射す)
- 表情: 集中しつつリラックス、薄い微笑

**光**: ステンドグラスからの**蒼い月光** (主光源、画面右奥から斜め前方) + 燭台の**金色の小さな炎** (副光源、机に近い)。輪郭が蒼+金の二色光に染まる。

**ChatGPT プロンプト (英文・そのまま使用可)**:
```
Anime-style key illustration, atmospheric. Late-night scene inside a vast gothic cathedral
library. A young woman with long flowing black hair (slightly wavy, glossy) tied half-up
into a high side bun-tail with a bright blue ribbon bow, wearing thin oval-framed glasses,
violet/purple eyes with a calm intelligent gaze, faint scholarly smile.
Outfit: dark navy blazer with gold trim along edges and lapels, bright blue inner-lining
peeking from front edges, white collared shirt, golden patterned filigree tie suggesting
magical sigils. She sits at an old oak desk, hands resting on an open thick black-leather
grimoire (cover embossed with a gold magical sigil), a feather quill in one hand, a folded
sheaf of coded branching tables (reminiscent of an 8x8 othello matrix on parchment) under
the other.
Background: towering gothic library with two-story bookshelves on each side, a large
stained-glass rose window in the far back glowing with cold moonlight (cool blue tones).
A single brass candelabrum on the desk casts warm gold rim-light. Mood: studious
prodigy in quiet certainty. Twin-source lighting (cool blue from window + warm gold from
candle) outlines her silhouette in two contrasting hues.
NEGATIVE: no text overlay, no watermark, no extra characters, no anime trope
exaggeration, no UI elements, no chibi/SD style.
Aspect ratio: 16:9 landscape (1672x941) AND 9:16 portrait (941x1672) — same composition
recomposed for each orientation.
```

**出力ファイル**:
- `solitude-landscape.png` (1672×941, PNG, RGB, ~3-5MB)
- `solitude-portrait.png` (941×1672, 同)

---

### 4.2 シーン 2/4: allies — 達人たちの定理

**ストーリー位置**: 章 15 を破った直後の幕間。達人達 5 人 (いちか・葵・朝日・なでしこ・響) が美琴の盤面を覗き込み、それぞれの「論理」を投げかけてくる。敵だった人達から「証明の続き」を渡される温かい場面。

**構図**:
- 美琴は卓の手前、開いた盤面 (オセロ盤、対局途中) の前に座っている
- 卓を半周するように 5 人の達人が美琴の背後・横から盤面を見下ろしている:
  - **いちか** (右奥、いちごピンクの髪、アイドル系、笑顔)
  - **葵** (左奥、和風武者鎧、弓を背負って真剣な眼差し)
  - **朝日** (右、和洋融合の若い剣士、頷く姿勢)
  - **なでしこ** (左、白い巫女系治療師ローブ、優しい微笑)
  - **響** (中央背後、リュート/竪琴を抱えた吟遊詩人、微笑)
- 卓の中央に大判の魔導書 (開かれている)、ページに**銀色の文字が浮かび上がりつつある**
- 背景: 図書館中央の卓を囲むゴシックアーチ、奥に階段と書架、天井から下がる古いシャンデリア (蝋燭は消えている、月光のみが射す)

**光**: 全体に**柔らかい月光+うっすらと床から上がる魔導書の銀光** (美琴の魔法の予兆)、達人達の輪郭はやや控えめに、**美琴の魔導書のページが画面中央のハイライト**。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, warm group composition. Same girl as previous scene
(Mikoto: long black hair with bright blue ribbon side bun-tail, oval glasses, violet eyes,
navy blazer with gold trim & blue inner-lining & gold filigree tie, holding a black-leather
grimoire). She sits at a wide round library table, an open othello board mid-game in
front of her, a thick open grimoire at the table center with silver glyphs faintly rising
from the page.
Five fellow masters surround her, leaning in to study the board:
- Right rear: a cheerful idol-archetype girl with strawberry-pink hair (Ichika), light
  smiling expression
- Left rear: a serious archer-warrior girl in mixed-japanese armor (Aoi), bow on her back
- Right side: a fusion-style swordsman young man (Asahi), calm nodding posture
- Left side: a healer girl in white shrine-mage robes (Nadeshiko), gentle smile
- Center back: a bard with a lyre/lute (Hibiki), faint smile
Background: gothic library central reading hall, arches behind, descending dark
chandeliers (unlit), bookshelves stretching into shadow.
Lighting: soft cool moonlight from above + subtle silver glow rising from the open
grimoire page (highlight focal point at table center). The masters' silhouettes are
slightly less brightly lit so Mikoto + grimoire remain the visual anchor.
Mood: studious camaraderie — former rivals sharing a proof.
NEGATIVE: no text overlay, no watermark, no extra unrelated characters, no UI, no chibi.
Aspect ratio: 16:9 landscape (1672x941) AND 9:16 portrait (941x1672).
```

**出力ファイル**:
- `allies-landscape.png` (1672×941)
- `allies-portrait.png` (941×1672)

---

### 4.3 シーン 3/4: final — 最終定理の前に

**ストーリー位置**: 章 19 (嵐) を破った直後、ゼロ戦の前夜。**美琴の魔導書に達人達 19 人の魂が銀の文字となって刻まれていく**。論理と魔法が完全に合流する瞬間 = 「最終定理」の予兆。

**構図**:
- 美琴は画面中央、立位、両手で胸の前に開いた魔導書を掲げている
- 魔導書のページから**銀色の魔法陣** (オセロ盤を模した 8×8 グリッドが八方に展開) が周囲に広がり、19 人ぶんの魂のシルエットが**銀の文字列**として書のページに流れ込んでいく
- 背景: 大聖堂図書館の最深部、巨大なゴシック窓 (窓越しにオセロ世界 = 緑の盤面世界が薄く見える、ゼロのフード姿が遠景に蒼い影として立っている)
- 美琴の表情は静かな決意、紫の瞳にうっすらと**金の魔法サイン**が反射

**光**: 魔導書から**金+銀の二重ハロー** (主光源)、背景は薄暗く、ゼロのフード影は逆光で輪郭のみ。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, climactic. Same girl (Mikoto, full character spec as before).
She stands at center frame, holding her open thick black-leather grimoire upright with
both hands at chest level. From the grimoire's pages an intricate silver magic circle
(8x8 grid resembling an othello board) unfolds in eight directions, with 19 ghostly
silver-letter silhouettes streaming into the pages from around her — each silhouette
suggests a different master archetype (idol, archer, swordsman, healer, bard, beast-
tamer, engineer, alchemist, monk, thief, mage, witch, tactician, detective, cyber-scout,
princess, knight, samurai, lightning-knight).
Background: deepest part of the gothic cathedral library. A colossal stained-glass
window behind her shows a faint green othello board world, and at the far center a
small hooded silhouette (Zero) stands as a blue-shadowed afterimage.
Lighting: a twin halo of gold + silver radiates from the grimoire as the dominant light
source; the rest of the scene is dimly lit. The gold trim of her blazer, the blue inner
lining, and her violet eye reflections all catch the grimoire's light. Her expression is
calm resolve.
NEGATIVE: no text overlay, no watermark, no UI, no anime trope poses, no chibi/SD.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**:
- `final-landscape.png` (1672×941)
- `final-portrait.png` (941×1672)

---

### 4.4 シーン 4/4: ending — 美琴の章の閉じ

**ストーリー位置**: 章 20 をクリアして美琴の周回が終わる時の lap finale。現世 (大聖堂図書館) に戻った美琴が、最後のページに「**この世界の手筋は、すべてひとつの公理から出発する**」と書く。〈論理魔導〉の名が後の世に残る。次の召喚陣が次の英雄を呼ぶための光で震え始める。

**構図**:
- 美琴は朝の図書館の窓辺の机に座り、魔導書の最終ページに羽根ペンで一文を書き終えるところ
- 机の周囲の絨毯に**ほのかに発光する召喚陣の輪郭** (オセロ模様の幾何学パターン)、それが**部分的に光を増し始めている** (= 次の召喚の前兆)
- 背景: 大聖堂図書館、朝の柔らかい黄金光がステンドグラスを通って差し込む、書架から本が静かに本来の場所に戻っていく光景 (魔導の余韻)
- 美琴の表情は穏やかな満足感、書き終えた瞬間の静かな微笑

**光**: 朝日の**温かい黄金光** (主光源、画面右奥から斜め) + 机の召喚陣からの**蒼+金の薄い光** (副光源、床側から)。前のシーン 3 の冷たい闇とは対照的に、画面全体が**温度の高い静謐**。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, contemplative epilogue. Same girl (Mikoto, character spec
as before). She sits at a window-side desk in the cathedral library, finishing the final
sentence with a feather quill on the last page of her open grimoire. Her expression: a
quiet, satisfied smile, the moment of closure.
Around the desk on the carpet: a softly luminous summoning circle (faint geometric
othello-pattern lines) is partially brightening — a subtle premonition of the next
summoning, beginning to glow more strongly in some sections.
Background: cathedral library at dawn. Warm golden morning light streams through
stained-glass windows. In the distance, books are quietly returning to their shelves on
their own (the lingering hum of completed magic).
Lighting: warm golden morning sunlight is the dominant light source (back-right, three-
quarter angle), with a secondary thin blue+gold uplight from the summoning circle on
the floor. Mood: warm, calm, complete — opposite in tone to the cold-darkness of the
"final" scene that preceded it.
NEGATIVE: no text overlay, no watermark, no additional characters, no UI, no chibi.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**:
- `ending-landscape.png` (1672×941)
- `ending-portrait.png` (941×1672)

---

## 5. Claude chat 側でのレビュー観点 (= 採否判断)

ChatGPT から戻ってきた各画像について、以下を確認:

1. **キャラ整合性**:
   - 黒髪 + 青リボン蝶結びの side bun-tail があるか
   - 細フレーム眼鏡 (oval) を着けているか
   - 紫/菫色の瞳か
   - ネイビー/黒のブレザー + 金縁取り + 青内張り + 金フィリグリー柄ネクタイか
   - 黒革+金箔押しの魔導書を抱えている / 持っているか (final・ending では特に重要)

2. **シーン整合性**:
   - solitude: 一人・大聖堂図書館・夜・月光+燭台・棋譜+魔導書
   - allies: 達人 5 人 + 美琴・卓囲み・銀文字浮かぶ魔導書・図書館中央
   - final: 美琴単体・魔導書から銀の魔法陣・ゼロの蒼影背景・劇的
   - ending: 美琴単体・朝の窓辺・召喚陣の床光・満足の微笑

3. **技術的整合性**:
   - アスペクト比 (landscape: 16:9 = 1672×941、portrait: 9:16 = 941×1672)
   - 解像度がフル (1672×941 / 941×1672) かそれ以上 (リサイズ可能)
   - PNG 形式 (JPG 不可・α 不要)
   - 透かし・テキスト・UI 要素なし
   - SD/ちびキャラ化していない

4. **ジャンル整合性**:
   - アニメスタイルのキー・イラスト調 (リアル系・水彩系は不可)
   - 構図が「物語の一場面」として読める (ポートレート単体ではなく、シーンの空気感がある)

不適合な画像があれば、ChatGPT に**修正プロンプト**を投げて再生成。例: 「リボンが赤くなっている → 青リボンに修正」「眼鏡なし → 眼鏡追加」「魔導書が薄い → 厚い黒革+金箔押し」など。

---

## 6. 納品フォーマット (Code 側へ渡す)

合格した 8 枚を以下のいずれかで Claude Code 側に渡してください:

### 方式 A: ZIP (推奨)

ZIP 名: `PLR02_mikoto.zip`

中身のフォルダ構造:
```
PLR02_mikoto/
├── solitude-landscape.png
├── solitude-portrait.png
├── allies-landscape.png
├── allies-portrait.png
├── final-landscape.png
├── final-portrait.png
├── ending-landscape.png
└── ending-portrait.png
```

### 方式 B: 個別 PNG 8 枚

ファイル名は上記そのまま (`solitude-landscape.png` などの 8 枚)。Code 側で `public/illustrations/PLR02_mikoto/` に展開します。

### 方式 C: 段階的着地

8 枚すべてを同時に揃える必要はありません。**準備できたシーンから順次納品**してください。Code 側は**二段 fallback**を実装しているため、未生成のシーンは自動的に共通版 (`_shared/<scene>-<orientation>.png`) で埋まります。テキストは美琴版のまま。

---

## 7. ハンドオフのリレー (3 主体間)

```
[Claude Code]                     [Claude chat]                     [ChatGPT]
   ↑  ↓                              ↑  ↓                              ↑  ↓
   ↓  実装/コード/repo                ↓  概念/シナリオ/プロンプト管理     ↓  画像生成
   ↓                                  ↓                                  ↓
   ▲ 完成パッケージ受領 ←── 確認 ──── ▲ 画像受領 ──── プロンプト送付 ──→ ▲
```

ステップ:
1. **Claude chat**: この文書を読み、§4 の各シーンプロンプトを ChatGPT に投げる
2. **ChatGPT**: 画像生成 (各シーン 2 枚 = landscape + portrait)
3. **Claude chat**: §5 のレビュー観点で品質確認、不適合は再生成依頼
4. **Claude chat**: 合格分を §6 のフォーマットでパッケージ
5. **ユーザー**: 受領した ZIP/PNG を Claude Code に渡す
6. **Claude Code**: `public/illustrations/PLR02_mikoto/` に展開、commit、live deploy。`?v=` 付き URL でユーザーに確認依頼

---

## 8. 受領後の Code 側処理 (参考、ユーザー視点では透過)

Code 側で以下を自動実施:
1. ファイル受領
2. Pillow で dimension verify (1672×941 / 941×1672)
3. キャラ規定の spot check (Optional, AI vision 経由)
4. `git add public/illustrations/PLR02_mikoto/*.png`
5. commit (`assets(narrative): add PLR02_mikoto illustrations`)
6. `npm run build` で PWA precache 更新
7. live URL (`?v=…`) で美琴で周回したときに新しい挿絵が出ることを確認

---

## 補足: 後続 PLR への展開

PLR03..PLR20 + PLR01 についても同じプロセスを繰り返す予定です。各 PLR の `public/avatars/players/PLR<NN>_<slug>/spec.md` のキャラ規定 + その PLR 固有の世界観 (例: PLR03 リン = VRMMO、PLR06 晴 = 現代陰陽師、PLR12 エル = 森の精霊) に合わせて 4 シーン (solitude / allies / final / ending) のテキスト + 挿絵を作っていきます。

PLR02 美琴で確立した**共通フォーマット** (4 シーン × 2 オリエンテーション + spec.md + ハンドオフ文書 + 二段 fallback コード基盤) はそのまま再利用できます。

---

最終更新: 2026-05-08 (v0.36.55 リリース時点)
