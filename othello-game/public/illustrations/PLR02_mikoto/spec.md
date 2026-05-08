# PLR02 美琴 ナラティブ挿絵 (per-PLR pilot, v0.36.56)

> 「論理と魔法は同じ」 — 美琴の信条

## このフォルダの位置づけ

`public/illustrations/PLR02_mikoto/` は美琴 (PLR02 / AVATARS index 1) 専用のシーン挿絵を格納します。`src/i18n/story/{ja,en}.ts` の `narrativeByPlr[1]` / `chainStepEndingByPlr[1]` / `prologueByPlr[1]` で `imageBasePath` (or `imageBasePaths.<key>`) として宣言されているため、ここにファイルを置けば自動的に拾われます (二段 fallback)。**画像が未生成の間は `_shared/` 共通版が表示**されます (= テキストは美琴版、画像はジェネリック)。

## 必要なファイル一覧 (9 シーン × 2 オリエンテーション = 18 枚)

### intro chain (5 シーン × 2 = 10 枚) — 美琴召喚エピソード

| ファイル名 | 解像度 | 用途 |
|---|---|---|
| `prologue-landscape.png` | 1672×941 | PrologueOverlay + PrologueScreen (序章: 大聖堂大学図書館で召喚陣が立ち上がる) |
| `prologue-portrait.png` | 941×1672 | 同上、縦画面 |
| `falling-landscape.png` | 1672×941 | FallingScreen (次元の谷を魔導書を抱えて落下) |
| `falling-portrait.png` | 941×1672 | 同上、縦画面 |
| `arrival-landscape.png` | 1672×941 | ArrivalScreen (盤上世界の盤面草原に着地) |
| `arrival-portrait.png` | 941×1672 | 同上、縦画面 |
| `gateway-closed-landscape.png` | 1672×941 | GatewayClosedScreen (封印された魔法陣ゲート) |
| `gateway-closed-portrait.png` | 941×1672 | 同上、縦画面 |
| `gateway-open-landscape.png` | 1672×941 | GatewayOpenScreen (解錠された魔法陣、内部へ誘う光) |
| `gateway-open-portrait.png` | 941×1672 | 同上、縦画面 |

### mid-route + ending (4 シーン × 2 = 8 枚) — 章 10/15/19/20 後のシーン

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

PNG 形式、RGB (α 不要)、各ファイル 3-5MB 目安。**合計 18 枚 / 約 50-90MB**。

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

## シーン 1/9: prologue — 論文の頁、召喚陣に変わる

**コンテクスト**: 序章。深夜の現代大聖堂大学図書館で卒業論文を執筆中の美琴が、開いた魔法書のページから立ち上がる**蒼と金の召喚陣**に呼ばれて消える瞬間。盤上世界に行く**直前の最後のフレーム**。

**構図**:
- 美琴は大きな図書机の前、半立位 (椅子から立ち上がりかけ)、両手で胸の前に魔導書を抱える
- 開いたページから**蒼と金の召喚陣の幾何学パターン** (8×8 グリッド + 八方向の魔導サイン) が浮き上がり、美琴の指先・眼鏡レンズ・髪のリボン蝶結び・制服の金縁取りに**順に光を写している**
- 机上に未完の論文用紙、羽根ペン、インク壷、いくつかの魔導書
- 背景: ゴシック大聖堂大学の図書館 (現代の電灯はあるが消えていて、書架と石柱がシルエットで沈む)、窓越しに外の街灯の電気的青光が薄く差す

**光**: 主光源は**魔導書から立ち上がる蒼+金の召喚陣** (画面中央)、副光源は**窓外からの現代の電気青光** (背景の輪郭づくり)。机のキャンドルは**消えかけ** (= 魔法側の光に呑まれる)。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, mystical-summoning moment. A young woman with long flowing
black hair (slightly wavy, glossy) tied half-up into a high side bun-tail with a bright
blue ribbon bow, thin oval-framed glasses, violet/purple eyes with a calm intelligent
gaze. She wears a dark navy blazer with gold trim along edges and lapels, bright blue
inner-lining peeking from front edges, white collared shirt, golden patterned filigree
tie with magical sigils.
She stands half-rising from a chair at a large library desk, both hands holding a thick
black-leather grimoire (gold sigil on cover) protectively against her chest. From the
open pages of an OTHER spellbook on the desk, an intricate blue-and-gold summoning
circle (8x8 othello grid + eight magical sigils radiating outward) is rising into the
air, its light progressively traveling along her fingertips, the lenses of her glasses,
the blue ribbon bow in her hair, the gold trim of her blazer.
On the desk: an unfinished thesis manuscript, feather quill, ink bottle, a few
grimoires. Background: a contemporary gothic cathedral university library, modern
electric lamps unlit, bookshelves and stone columns silhouetted in shadow, pale electric
blue streetlight bleeding through the tall windows.
Lighting: dominant blue-and-gold halo radiates from the center summoning circle; cool
electric blue rim-light from the windows defines the background. A nearly-extinguished
candle on the desk is being eclipsed by the magical light.
Mood: a studious prodigy at the threshold of being called to another world.
NEGATIVE: no text overlay, no watermark, no other characters, no UI elements,
no chibi/SD style.
Aspect: 16:9 landscape (1672x941) AND 9:16 portrait (941x1672).
```

**出力ファイル**: `prologue-landscape.png`, `prologue-portrait.png`

---

## シーン 2/9: falling — 次元の谷の落下

**コンテクスト**: 序章と到着の中間。美琴が次元の谷を魔導書を抱えたまま落下、周囲を**銀の方程式**が流れる。重力感と速度感のあるダイナミックな構図。

**構図**:
- 美琴は画面中央、**斜め後方落下** (頭は画面上方に近い、足は下方)、髪と制服の裾が逆向きに流れる
- 両手で魔導書を胸に抱え、表情は驚きと決意の中間 (恐怖ではない)
- 周囲に**銀色の数式・公理・幾何学線**が高速で流れる軌跡 (= 魔導書から漏れ出している知的エネルギー)
- 画面下方 (= 落下先) に**緑の盤上世界が小さく見える** (オセロ盤面状の大地、遠景の街並み)

**光**: 主光源は**美琴の魔導書からの銀光** (周囲を放射状に照らす)、副光源は画面下方からの**緑の世界光** (足元へ向かって強くなる)。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, dynamic falling scene. Same girl (Mikoto, full character
spec as previous scene). She is mid-fall through a dimensional void, her body angled
diagonally (head toward upper screen, feet toward lower), hair and the hem of her
blazer streaming opposite to her direction of motion. Both hands clutch her thick
black-leather grimoire to her chest. Expression: surprise mixed with determination, NOT
fear.
Surrounding her, streams of silver mathematical equations, axiomatic statements, and
geometric lines flow at high speed in motion-blur trails — knowledge leaking from her
grimoire as she falls.
Far below her (lower screen): a small glimpse of a GREEN board-world surface
(othello-board-like landscape, distant cityscape).
Lighting: dominant silver glow radiating outward from her grimoire; secondary green
world-light rising from below toward her feet, growing stronger lower in the frame.
Mood: free-fall through theorems, gravity-and-knowledge composition.
NEGATIVE: no text overlay, no watermark, no other characters, no UI, no chibi.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**: `falling-landscape.png`, `falling-portrait.png`

---

## シーン 3/9: arrival — 盤上世界の盤面草原に着地

**コンテクスト**: 落下が終わり、美琴が**盤上世界の盤面草原**に着地する瞬間。世界を初めて目にする美琴の視点。背景にゴシック建築の遠景。

**構図**:
- 美琴は画面下半分、**中腰で着地後の姿勢** (片膝が軽く地面に、もう片足は前方着地)、魔導書はまだ胸に抱えたまま
- 髪と制服が落下時の風を引きずって**まだ静止しきっていない**
- 美琴の目線 (画面奥向き) の先に**盤面状の草原** (緑のフェルトに大きな黒白の石が散在) と、遠景に**異界のステンドグラス建築** (大聖堂風だが現実より幻想的な、淡く発光する塔群)
- 空は紫紺、二重月 (大小 2 つ)、それぞれ淡い金光を放つ

**光**: 主光源は**遠景のステンドグラス建築の柔らかい複数色光** (青・紫・金が混ざる)、副光源は**二重月の月光** (上方から)、補助に美琴の魔導書からの薄い銀光。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, contemplative arrival scene. Same girl (Mikoto).
She has just landed in a half-crouched pose (one knee lightly touching the ground, the
other foot forward), still clutching her grimoire to her chest. Her hair and blazer
hem are still settling from the fall — not entirely at rest yet. She gazes forward into
the distance.
Setting: she has arrived in the BANSHO SEKAI (board world). The ground is a vast green
felt-like board prairie scattered with large black and white othello stones (taller
than her). In the distance: fantastical stained-glass architecture — cathedral-like
luminous spires that suggest a magic-academy world, glowing faintly in mixed colors.
Sky: deep purple-indigo, with TWO moons (one large, one smaller), both casting a soft
gold light.
Lighting: dominant soft multicolor glow from the distant stained-glass architecture
(blue, violet, gold mixed); secondary moonlight from above; subtle silver auxiliary
light from her grimoire.
Mood: a logician's first sight of an impossible world, awe + analytical curiosity.
NEGATIVE: no text overlay, no watermark, no other characters, no UI, no chibi.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**: `arrival-landscape.png`, `arrival-portrait.png`

---

## シーン 4/9: gatewayClosed — 封印された魔法陣ゲート

**コンテクスト**: 美琴が盤上世界の入り口に立つ。**巨大な魔法陣ゲート**が封印されており、美琴の魔導書がページを開いて応じ始める。盤上世界の秘儀との初めての接触。

**構図**:
- 美琴は画面中央寄り、**ゲートに対峙**して立位 (背中越しに少し美琴の顔が見える 3/4 リアビュー)
- 巨大な**石造りのアーチゲート** (高さは美琴の 5 倍以上)、表面に**封印の魔法陣** (8×8 のオセロ盤を模した石彫が中央に、周囲に古代魔導文字)。封印が薄く赤光を発している
- 美琴は両手で魔導書を開き、ページが**蒼く発光** (= 解錠の鍵を読み取ろうとしている)
- 周囲は淡い霧、空は曇った紫

**光**: 主光源は**ゲートの封印の薄い赤光** (前方から美琴に当たる)、副光源は**美琴の魔導書からの蒼光** (美琴の顔と胸元を青く染める、赤と対比的)、補助に**画面奥からの淡い金光** (= ゲート向こうの世界の光が漏れている予感)。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, threshold composition. Same girl (Mikoto). She stands
facing a massive sealed magical archway (3/4 rear view — we see her back and a glimpse
of her profile). The arch is stone-built, towering more than 5x her height, covered in
sealing magic runes — at the center an 8x8 othello-board pattern carved in relief,
surrounded by ancient magical script. The seal glows a faint dim red.
Mikoto holds her grimoire OPEN with both hands; the pages glow blue (her counter-
spell reading the lock).
Surroundings: a thin pale mist, sky is overcast violet.
Lighting: dominant dim red light from the gate's seal hitting her front; secondary
blue glow from her open grimoire painting her face and chest in cool tones (contrasting
with the red); subtle warm gold leak from BEHIND the arch hinting at the world beyond.
Mood: a logician confronting an ancient axiomatic puzzle.
NEGATIVE: no text overlay, no watermark, no other characters, no UI, no chibi.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**: `gateway-closed-landscape.png`, `gateway-closed-portrait.png`

---

## シーン 5/9: gatewayOpen — 解錠された魔法陣ゲート

**コンテクスト**: 美琴の魔導書が封印を解読、**魔法陣ゲートが開く**。**金+蒼の二重渦**が美琴を内部へ誘う。ストーリー本編 (章 1) への入り口。

**構図**:
- 同じゲート位置、しかし**封印の魔法陣が解錠** (赤光が消え、代わりに**金+蒼の渦巻き状の門光**が中央から放射)
- 美琴は**ゲートに向かって一歩踏み出した姿勢** (画面手前に少し進む、後ろから見るとマント風に制服が広がる)
- 美琴の魔導書のページが**閉じかけ** (= 役目を終える)、周囲に金の数式の残光が散る
- ゲート内側に**緑の盤上世界の風景** (= シーン 3 で見た景色がより近く・鮮明に) が透けて見える

**光**: 主光源は**ゲートからの金+蒼の二重光** (前方からと中心から両方)、画面全体が温度の高い祝祭感に。美琴の輪郭が金+蒼の二色で縁取られ、背景の夜は明るい黎明の色に変わる。

**ChatGPT プロンプト (英文)**:
```
Anime-style key illustration, triumphant threshold-crossing. Same girl (Mikoto), same
gate position as the previous closed-gateway scene. The seal has been unlocked — the
red glow is GONE, replaced by a swirling double vortex of gold-and-blue light radiating
from the gate's center. Through the now-open arch, the green Bansho Sekai landscape is
clearly visible (the same world from the arrival scene, but closer and more vivid).
Mikoto has taken one step forward toward the gate (slight rear 3/4 view — her blazer
flaring like a cape behind her). Her grimoire is half-closing in her hands (its task
complete); residual gold mathematical equations scatter around her like sparks.
Lighting: dominant gold-and-blue twin light from the gate (frontal + central);
overall mood is festive and warm. Mikoto's silhouette is rimmed by both gold and blue.
The night-sky background has shifted to dawn-pale colors.
Mood: a theorem proven, a door opening, the beginning of the journey.
NEGATIVE: no text overlay, no watermark, no other characters, no UI, no chibi.
Aspect: 16:9 landscape (1672x941) + 9:16 portrait (941x1672).
```

**出力ファイル**: `gateway-open-landscape.png`, `gateway-open-portrait.png`

---

## シーン 6/9: solitude — 大聖堂図書館の静夜

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

## シーン 7/9: allies — 達人たちの定理

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

## シーン 8/9: final — 最終定理の前に

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

## シーン 9/9: ending — 美琴の章の閉じ

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

Claude chat 経由で ChatGPT に投げて生成 → Claude chat で品質確認 → 18 枚を以下のいずれかで Code 側へ:

- **ZIP**: `PLR02_mikoto.zip` の中身が `PLR02_mikoto/<scene>-<orientation>.png` × 18
- **個別 PNG 18 枚**: ファイル名がそのまま `prologue-landscape.png` / `solitude-landscape.png` などになっていればここ (このフォルダ) に展開

Code 側 (= 私) は受領時に:
1. Pillow でファイル dimension を verify (1672×941 / 941×1672 必須)
2. キャラ規定との一貫性をスポットチェック (黒髪+青リボン+紫眼+魔導書)
3. `git add public/illustrations/PLR02_mikoto/*.png` + commit (`assets(narrative): add PLR02_mikoto illustrations`)
4. `npm run build` で PWA precache 更新
5. live URL (`?v=…`) で美琴版が出ていることを確認

未生成のシーンがあっても **二段 fallback** で `_shared/` 共通版が表示されるので、段階的着地で構いません。intro chain 5 + mid-route 4 = 9 シーンを 5 ロットに分けてもよし、9 シーン一気でもよし。

---

最終更新: 2026-05-08 (Plan v0.36.56 step 6 — intro chain 5 シーン拡張)
