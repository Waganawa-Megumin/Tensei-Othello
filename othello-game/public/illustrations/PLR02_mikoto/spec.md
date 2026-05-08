# PLR02 美琴 ナラティブ挿絵 (per-PLR pilot, v0.36.55+)

> 「論理と魔法は同じ」 — 美琴の信条

## このフォルダの位置づけ

`public/illustrations/PLR02_mikoto/` は美琴 (PLR02 / AVATARS index 1) 専用のシーン挿絵を格納します。`src/i18n/story/{ja,en}.ts` の `narrativeByPlr[1]` で `imageBasePath: 'PLR02_mikoto/<scene>'` として宣言されているため、ここにファイルを置けば自動的に拾われます (NarrativeOverlay の二段 fallback)。**画像が未生成の間は `_shared/` 共通版が表示**されます (= テキストは美琴版、画像はジェネリック)。

## 必要なファイル一覧 (4 シーン × 2 オリエンテーション = 8 枚)

| ファイル名 | 解像度 | 用途 |
|---|---|---|
| `solitude-landscape.png` | 1672×941 | mid-route insert (sp=10 直後) |
| `solitude-portrait.png` | 941×1672 | 同上、縦画面 |
| `allies-landscape.png` | 1672×941 | mid-route insert (sp=15 直後) |
| `allies-portrait.png` | 941×1672 | 同上、縦画面 |
| `final-landscape.png` | 1672×941 | mid-route insert (sp=19 直後) |
| `final-portrait.png` | 941×1672 | 同上、縦画面 |
| `ending-landscape.png` | 1672×941 | 美琴の lap finale (chain-step ending) |
| `ending-portrait.png` | 941×1672 | 同上、縦画面 |

PNG 形式、RGB (α 不要)、各ファイル 3-5MB 目安。

## キャラ規定 (一次情報源: `public/avatars/players/PLR02_mikoto/spec.md`)

新規生成・差し替え時の正の記述。**実画像準拠**で、シーン間で一貫させること:

> 長く流れる**漆黒の髪** (やや波打ち、艶めき)、サイドの髪を**鮮やかな青いリボン蝶結び**で半分結い上げてサイドお団子テールに (シグネチャアクセサリ)。**丸/楕円の細フレーム眼鏡**。
>
> **菫色/紫の瞳**、穏やかで知的な眼差し、ほのかな学者風の微笑。
>
> **服装 (アカデミック制服)**:
> - ダークネイビー/黒のブレザー、襟・襟元に**金の縁取り**
> - **明るい青の内張/襟裏** (前縁から覗く)
> - 白いカラーシャツ
> - **金色/黄色の繊細なフィリグリー柄ネクタイ** (魔導サインを示唆)
>
> **手の小道具**: 厚い**黒革+金箔押しの魔導書** (表紙に**金の星/魔法陣サイン**) を、**胸に守るように抱えて**いる。
>
> **エネルギー**: 学究の天才。静かな自信。誰よりも先に三冊読み終えるタイプ。

## 共通トーン (全 4 シーン)

- **基調色**: 深い闇 (`#0a0805`) ベース + 琥珀ゴールド (`amber-200`) のアクセント
- **美琴専用色相**: **青** (魔法学園の紋章色、リボン、内張) + **金** (フィリグリー、魔導書の箔押し) + **紫** (瞳の薄い反射光)
- **光源**: 和洋折衷、**燭台の蒼炎・月光・ステンドグラス透過光**を中心。直接光より**間接光**で陰影を作る
- **画面構成**: 美琴を画面中央〜やや左、魔導書を必ず画面に映す。背景は**大聖堂図書館**のアーキテクチャ要素 (列柱・ステンドグラス・古い書架・燭台) を主体に
- **避けたい要素**: 文字オーバーレイ・透かし・追加キャラ (allies シーンの達人達を除く)・カジュアルなアイコン

---

## シーン 1/4: solitude — 大聖堂図書館の静夜

**コンテクスト**: ch.10 (シキ) を破った直後、美琴が深夜の大聖堂図書館で一人、達人達との棋譜を並べている。「論理と魔法は同じ」の確信が固まる瞬間。

**構図**:
- 美琴は古い樫の机に座り、開いた魔導書を前に、片手で羽根ペンを握り、もう片手で棋譜の紙束を押さえている
- 机の上には符号化された分岐表 (オセロの 8×8 マトリクスを模した羊皮紙)、燭台 1 つ、インク壷
- 背景: 高い天井のゴシック大聖堂図書館、両側に巨大な書架、奥にステンドグラスの円窓 (満月の光がそれを通って蒼く射す)
- 美琴は集中しているがリラックスした表情、薄い微笑

**光**: ステンドグラスからの**蒼い月光** (主光源、画面右奥から斜め前方へ)、燭台の**金色の小さな炎** (副光源、机に近い)、美琴の輪郭が蒼+金の二色光に染まる

**ChatGPT 用プロンプト (英文)**:
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
exaggeration, no UI elements.
Aspect ratio: 16:9 (landscape) — output at 1672x941.
Also output a portrait variant at 941x1672 with the same composition recomposed
vertically (focus on the figure + grimoire + window above her).
```

---

## シーン 2/4: allies — 達人たちの定理

**コンテクスト**: ch.15 (シエル) を破った直後、達人達 (いちか・葵・朝日・なでしこ・響) が美琴の盤面を覗き込み、それぞれの「論理」を投げかける。学園の同窓のように、敵だった者たちが**証明の続きを共有**してくれる温かい場面。

**構図**:
- 美琴は卓の手前、開いた盤面 (オセロ盤、対局途中) の前に座っている
- 卓を半周するように、5 人の達人が美琴の背後/横から盤面を見下ろしている: いちか (右奥、笑顔)、葵 (左奥、弓を背負った武者姿、真剣)、朝日 (右、和洋融合の剣士、頷く)、なでしこ (左、白衣風の治療師、優しく)、響 (中央背後、リュート/竪琴を抱えた吟遊詩人、微笑)
- 卓の中央に大判の魔導書 (開かれている)、書のページに**銀色の文字が浮かび上がりつつある**
- 背景: 図書館の中央卓を囲むゴシックアーチ、奥には階段と書架、天井から下がる古いシャンデリア (蝋燭は消えている、月光のみが射す)

**光**: 全体に**柔らかい月光+うっすらと床から上がる魔導書の銀光** (美琴の魔法の予兆)、達人達の輪郭はやや控えめに、**美琴の魔導書のページが画面中央のハイライト**

**ChatGPT 用プロンプト (英文)**:
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
NEGATIVE: no text overlay, no watermark, no extra unrelated characters, no UI.
Aspect ratio: 16:9 landscape (1672x941) and 9:16 portrait (941x1672) variants.
```

---

## シーン 3/4: final — 最終定理の前に

**コンテクスト**: ch.19 (嵐) を破った直後、ゼロ戦の前夜。**美琴の魔導書に達人達 19 人の魂が銀の文字となって刻まれていく**。論理と魔法が完全に合流する瞬間 = 「最終定理」の予兆。

**構図**:
- 美琴は画面中央、立位、両手で胸の前に開いた魔導書を掲げている
- 魔導書のページから**銀色の魔法陣** (オセロ盤を模した 8×8 グリッドが八方に展開) が周囲に広がり、19 人ぶんの魂のシルエットが**銀の文字列**として書のページに流れ込んでいく
- 背景: 大聖堂図書館の最深部、巨大なゴシック窓 (窓越しにオセロ世界 = 緑の盤面世界が薄く見える、ゼロのフード姿が遠景に蒼い影として立っている)
- 美琴の表情は静かな決意、紫の瞳にうっすらと**金の魔法サイン**が反射

**光**: 魔導書から**金+銀の二重ハロー** (主光源)、背景は薄暗く、ゼロのフード影は逆光で輪郭のみ。美琴の制服の金縁取り・青内張り・紫瞳がすべて魔導書の光を反射

**ChatGPT 用プロンプト (英文)**:
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
NEGATIVE: no text overlay, no watermark, no UI, no anime trope poses.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

---

## シーン 4/4: ending — 美琴の章の閉じ

**コンテクスト**: 章 20 クリア後、現世 (大聖堂図書館) に戻った美琴が、最後のページに「**この世界の手筋は、すべてひとつの公理から出発する**」と書く。〈論理魔導〉の名が後の世に残る。次の召喚陣が次の英雄を呼ぶための光で震え始める。

**構図**:
- 美琴は朝の図書館の窓辺の机に座り、魔導書の最終ページに羽根ペンで一文を書き終えるところ
- 机の周囲に**ほのかに発光する召喚陣の輪郭** (床の絨毯に淡く光るオセロ模様の幾何学パターン)、それが**部分的に光を増し始めている** (= 次の召喚の前兆)
- 背景: 大聖堂図書館、朝の柔らかい黄金光がステンドグラスを通って差し込む、書架から本が静かに本来の場所に戻っていく光景 (魔導の余韻)
- 美琴の表情は穏やかな満足感、書き終えた瞬間の静かな微笑

**光**: 朝日の**温かい黄金光** (主光源、画面右奥から斜め)、机の召喚陣からの**蒼+金の薄い光** (副光源、床側から)。前夜のシーン 3 の冷たい闇とは対照的に、画面全体が**温度の高い静謐**

**ChatGPT 用プロンプト (英文)**:
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
NEGATIVE: no text overlay, no watermark, no additional characters, no UI.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

---

## 納品フォーマット

Claude chat 経由で ChatGPT に投げて生成 → Claude chat で品質確認 → 8 枚を以下のいずれかで Code 側へ:

- **ZIP**: `PLR02_mikoto.zip` の中身が `PLR02_mikoto/<scene>-<orientation>.png` × 8
- **個別 PNG 8 枚**: ファイル名がそのまま `solitude-landscape.png` などになっていればここ (このフォルダ) に展開

Code 側 (= 私) は受領時に:
1. Pillow でファイル dimension を verify (1672×941 / 941×1672 必須)
2. キャラ規定との一貫性をスポットチェック (黒髪+青リボン+紫眼+魔導書)
3. `git add public/illustrations/PLR02_mikoto/*.png` + commit (`assets(narrative): add PLR02_mikoto illustrations`)
4. `npm run build` で PWA precache 更新
5. live URL (`?v=…`) で美琴版が出ていることを確認

未生成のシーンがあっても **NarrativeOverlay の二段 fallback** で `_shared/` 共通版が表示されるので、段階的着地で構いません。

---

最終更新: 2026-05-08 (Plan v0.36.55 step 6)
