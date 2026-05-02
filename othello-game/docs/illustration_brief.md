# 挿絵・キービジュアル制作指示書

> **作品**: 転生したらオセロ世界でした！（Reincarnated as an Othello Player）  
> **ステップ別ロードマップ**: [`illustrations/README.md`](./illustrations/README.md)

このドキュメントは本作の**全ビジュアルアセット**を制作するための公式指示書です。各シーンに使えるプロンプトと納品仕様、ファイル配置、コード統合手順までを統合しています。

> ⚠ **タイトル・呼称ルール**: 本作には2つの名前がある。
> - **アプリ/作品**: 転生したらオセロ世界でした！（Reincarnated as an Othello Player）
> - **作中異界**: 盤上世界（Bansho Sekai） — プレイヤーが転生する世界の固有名詞
>
> ❌ NG: `盤上世界 — Tensei Othello` のように混ぜた表記。

---

# 0. 全体について

## 0.1 制作するアセット一覧

| カテゴリ | 枚数 | 用途 | 配置先 | 状態 |
|---|---|---|---|---|
| **A. スタート画面 KV** | 1 | アプリ起動時の背景 | `public/title-bg.png` | 🔲 未制作 |
| **B. プレイヤーアバター** | 20 | 自分のキャラ選択 | `public/avatars/players/` | ✅ 完成済 |
| **C. 対戦者アバター** | 20 | 対戦相手の円形ポートレート | `public/avatars/` | ✅ 完成済 |
| **D. 章導入挿絵** | 20 | 各章のキャラ紹介背景 | `public/avatars/chapters/` | 🔲 未制作 |
| **E. ナラティブ挿絵** | 5 | 物語の節目の口絵 | `public/illustrations/` | 🔲 未制作 |

合計新規制作: **26 枚**（A 1枚 + D 20枚 + E 5枚）

## 0.2 共通スタイル

**作風基準**: 京都アニメーション × ライトノベルカラー口絵 × 和風ファンタジー

| 要素 | 指針 |
|---|---|
| 線画 | 純黒禁止、こげ茶〜セピア。柔らかく |
| シェーディング | セル＋水彩の中間。ハーフトーン使用 |
| 影色 | 紫がかったクール |
| ハイライト | 琥珀がかった暖色 |
| 背景 | 水彩ガッシュ風 painterly |
| 構図 | 余白を残す。文字オーバーレイ前提 |

### カラーパレット

```
Deep Base:        #0a0805  #14110a  #1f1810
Mid Base:         #2a2018  #3d2f24  #5c4838
Warm Accent:      #c9a961  #e6cc8a  #f5e6c0  ← UIの琥珀色と統一
Cool Accent:      #8a9ec9  #5d7ab0  #2a3f6a  ← move-hint青と統一
Stone Black:      radial(30%30%, #5a5a5a → #1a1a1a → #000)
Stone White:      radial(30%30%, #ffffff → #ebe2cc → #c5b89c)
Felt Green:       #1e3a2f  #2a5544  #3d6b56  ← 盤面色
```

### 全アセット共通 NG 事項

- ネオンカラー（蛍光ピンク、原色マゼンタ、毒々しい黄緑）
- 西洋ファンタジーの装飾過多な金縁・派手な紋章
- 写実調 / 3DCG調 / Pixar 系
- 純黒のベタ塗り（#000000）
- 画面内への文字・ロゴ・ウォーターマーク（後でCSSで重ねる）

### キャラデザ統一のコツ（重要）

D（章挿絵）を制作する際、既存のキャラクター円形ポートレート（C）を **character reference** として AI に渡すこと:

| ツール | 方法 |
|---|---|
| Niji / Midjourney v6 | `--cref [既存ポートレートURL] --cw 80` |
| NovelAI v3 | Image2Image + プロンプト併用 |
| Stable Diffusion XL | ControlNet (reference_only) または IP-Adapter |

最初の数枚で作風を固定し、その reference を後続全枚に適用すれば 20 章ぶん作っても見た目がブレません。

---

# A. スタート画面キービジュアル（1枚）

## A.1 役割

タイトル画面 (`screen === 'title'`) の背景に敷く1枚。タイトル文字「**転生したらオセロ世界でした！**」と3つのモード選択カードが画面中央〜下半分に重なるため、構図は **上半分にドラマ性、下半分は暗め余白気味** にする。

## A.2 仕様

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9 横長) |
| モバイル版（任意） | 768×1024 (3:4 縦) として `title-bg-mobile.png` |
| 形式 | PNG または WebP（透過不要） |
| ファイルサイズ | 1〜3 MB 以内 |
| ファイル名 | `title-bg.png` |
| 配置先 | `public/title-bg.png` |

## A.3 構図：「転生の瞬間」

主人公（性別中立的な後ろ姿シルエット）が、現代の制服姿のまま空中に浮かんでいる。下方に巨大なオセロ盤が広がり、その表面が異界へのポータルのように発光。盤面から無数の黒と白の石が螺旋状に立ち昇り、主人公を取り巻く。背景は深い藍色と紫の星雲のような空。最奥に20人の達人のシルエットが朧げに並ぶ。

### 公式プロンプト（英語）

```
A teenage Japanese protagonist seen from behind, suspended mid-fall in midair,
still wearing a modern Japanese school blazer uniform. The figure is a soft
silhouette, gender-neutral, no visible face. Below them, a vast cosmic othello
board glows like an interdimensional portal between worlds, its surface
shimmering with green felt and golden trim.

Hundreds of black obsidian and white pearl go-stones spiral upward around the
falling figure, weightless, some sharp in focus, others soft bokeh. Faint
silhouettes of 20 master figures stand arrayed at the far horizon, barely
visible in the misty distance.

Background: deep navy and violet starry void with a single golden amber light
source from above, like a heavenly pillar. Lower half of the frame is darker
and emptier (room for title typography and UI cards).

Painterly anime light novel cover art, in the style of Kyoto Animation meets
light-novel illustration. Dramatic vertical composition, cinematic, with empty
space in upper-center for title text overlay. Golden amber accent light from
above, deep purple and navy atmosphere. No visible text or logos in the image.
16:9 widescreen format.
```

## A.4 統合手順

```jsx
// src/App.jsx の TitleScreen コンポーネント先頭を差し替え
<div
  className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
  style={{
    backgroundImage: 'url(/title-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* 文字を読みやすくする暗いオーバーレイ */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75 pointer-events-none" />
  {/* 既存の中身（タイトル・カード・etc.）はこの下に */}
```

このとき、既存の装飾パーティクル `Array.from({ length: 12 }).map(...)` は画像と被るので削除して構いません。

---

# B. プレイヤーアバター（20体・既に完成済み）

主人公として選択するキャラクター。**画像は統合済**（`public/avatars/players/`）。

将来、章挿絵 D で「主人公が画面に登場する」場合の参考として全20体の設定を再掲。

| # | キャラ名 | 漢字 | 主人公アーキタイプ | キャッチコピー | ファイル |
|---|---|---|---|---|---|
| 1 | ハルキ | 春 | 異世界転生の勇者 | 冒険、はじまったな | `01_haruki.png` |
| 2 | 美琴 | 琴 | 魔法学園の天才 | 論理と魔法は同じ | `02_mikoto.png` |
| 3 | リン | 凛 | VRMMOの最強プレイヤー | 現実より、得意なんだ | `03_rin.png` |
| 4 | 蓮 | 蓮 | 剣道部主将 | 正々堂々、参る | `04_ren.png` |
| 5 | 千歳 | 千 | タイムリープ少女 | これで何度目だっけ | `05_chitose.png` |
| 6 | 晴 | 晴 | 現代の陰陽師 | 妖、見えてるんだ | `06_haru.png` |
| 7 | カイ | 海 | 空の冒険者 | 風が呼んでる | `07_kai.png` |
| 8 | 千夏 | 夏 | 聖剣の村娘 | 故郷を、必ず守る | `08_chinatsu.png` |
| 9 | 透 | 透 | 学園名探偵 | 謎には必ず答えがある | `09_toru.png` |
| 10 | ノア | ノ | 未来から来た少女 | 2099年から、よろしく | `10_noa.png` |
| 11 | 凪 | 凪 | 異世界料理人 | お腹空いてる？ | `11_nagi.png` |
| 12 | エル | エ | 元魔王、今は転校生 | ふふ、内緒だよ | `12_el.png` |
| 13 | スミレ | 菫 | 記憶喪失の冒険者 | 私は…誰なの？ | `13_sumire.png` |
| 14 | 葉月 | 葉 | 機械工学の天才 | これ、私が作ったの！ | `14_hazuki.png` |
| 15 | 隼人 | 隼 | 凄腕ガンナー | 撃つときは迷わない | `15_hayato.png` |
| 16 | ひかり | 光 | 光の精霊使い | みんな、笑ってほしい | `16_hikari.png` |
| 17 | ヨル | 夜 | 半吸血鬼 | 血は、欲しくない | `17_yoru.png` |
| 18 | 湊 | 湊 | 海の冒険者 | 世界の果てへ | `18_minato.png` |
| 19 | 奏太 | 奏 | 天才ピアニスト | この旋律、聴いてくれ | `19_souta.png` |
| 20 | 悠 | 悠 | 神話の英雄 | 神々よ、いざ尋常に | `20_yu.png` |

---

# C. 対戦者アバター（20体・既に完成済み）

異界『盤上世界』の達人20人。**画像は統合済**（`public/avatars/`）。
章挿絵 D の制作で必須の reference になります。

| Lv | キャラ名 | 漢字 | アーキタイプ | セリフ | ファイル |
|---|---|---|---|---|---|
| 1 | いちか | 苺 | アイドル | ふぁいとぉ♪ 楽しんで！ | `18_idol_singer.png` |
| 2 | 葵 | 葵 | 弓使い | 狙いはバッチリだよっ！ | `03_energetic_archer.png` |
| 3 | 朝日 | 朝 | 剣士 | いざ尋常に！ | `01_cheerful_swordsman.png` |
| 4 | なでしこ | 撫 | 治療師 | 無理せずいきましょう | `05_kind_healer.png` |
| 5 | 響 | 響 | 吟遊詩人 | 楽しい一局を奏でよう♪ | `07_musician_bard.png` |
| 6 | つむぎ | 紬 | 獣使い | 相棒もわくわくしてる | `16_beast_tamer.png` |
| 7 | 茜 | 茜 | 技師 | 歯車みたいにかっちりね！ | `08_gadget_engineer.png` |
| 8 | メル | 薬 | 錬金術師 | ふふ、ちょっと混ぜてみよっか？ | `19_alchemist.png` |
| 9 | 悟 | 悟 | 修行僧 | 無心に石を置く、ただそれだけ | `13_stoic_monk.png` |
| 10 | シキ | 黒 | 盗賊 | 気付いた時には遅いよ | `06_sly_rogue.png` |
| 11 | シオン | 詩 | 魔術師 | すべては予測の内だ | `02_calm_mage.png` |
| 12 | ルナ | 夢 | 夢の魔女 | 夢の中でもう勝ってるよ♡ | `12_dreamy_witch.png` |
| 13 | 雪乃 | 雪 | 学園軍師 | この程度、解析するまでもない | `09_school_strategist.png` |
| 14 | アキラ | 暁 | 探偵 | 君の手筋、見えているよ | `17_detective.png` |
| 15 | シエル | 銀 | サイバー斥候 | 全データ把握、戦況優位 | `10_cyberpunk_scout.png` |
| 16 | アリア | 姫 | 姫君 | お手柔らかに、ですわ | `15_noble_princess.png` |
| 17 | レオン | 獅 | 騎士 | 正々堂々、参る！ | `04_noble_knight.png` |
| 18 | 宗次郎 | 宗 | 侍 | 我が一刀、避けられはせぬ | `11_elegant_samurai.png` |
| 19 | 嵐 | 嵐 | 竜騎士 | 我が竜の前に膝を折れ！ | `14_dragon_rider.png` |
| 20 | ゼロ | 零 | ハッカー（最終ボス） | 全ての変分は計算済み。詰みだ | `20_hacker.png` |

---

# D. 章導入挿絵（20枚）

## D.1 役割

各章の導入カード（設定モーダル内のストーリーパネル）に背景として表示する横長挿絵。各キャラクターの世界観を描く。

## D.2 仕様

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) または 1024×576 (16:9) |
| 形式 | PNG または WebP |
| ファイルサイズ | 0.5〜1.5 MB 以内 |
| 命名規則 | `chapter_NN_<slug>.png` （例: `chapter_01_ichika.png`） |
| 配置先 | `public/avatars/chapters/` |

## D.3 構図ガイド

| 要素 | ルール |
|---|---|
| 中心 | 該当キャラ全身〜膝上、表情がセリフに合致 |
| 背景 | キャラの世界観・職業を表現 |
| 小道具 | オセロ盤・石を控えめに1要素配置（場面に馴染ませる） |
| 余白 | カード上に文字を重ねるため、左右どちらかを暗めに |

## D.4 全20章プロンプト

各章は **キャラの世界観 + セリフのトーン + その章で要求されるドラマ性** を反映。
冒頭3章は明るく入門、中盤に戦略・思考系、終盤4章はラスボス級の威圧感、というレベルカーブに沿った視覚演出にしています。

### 第1章 ・ いちか（アイドル、Lv.1）
> セリフ:「ふぁいとぉ♪ 楽しんで！」

```
A bright cheerful young Japanese idol singer with strawberry-pink twintails
and a star hair clip, on a glittering pastel-pink stage with sparkles, hearts,
and pop motifs floating around. Holding a microphone with one hand and waving
encouragingly with the other, full body shot, energetic welcoming pose. A small
white-and-black othello board sits casually on a stool beside her like a stage
prop. Stage lights softly glowing. Light novel illustration in the style of
Kyoto Animation, soft pastel pink palette, painterly background, 16:9.
```

### 第2章 ・ 葵（弓使い、Lv.2）
> セリフ:「狙いはバッチリだよっ！」

```
A focused young Japanese girl archer with reddish-brown side-ponytail, drawing
a longbow back at full tension, sharp confident smirk. Sunlit autumn forest
clearing with golden leaves drifting through dappled rays. Subtle hints of an
othello grid pattern formed by the dappled sunlight on the mossy ground. Light
novel illustration in the style of Kyoto Animation, warm autumn red-amber
palette, painterly, 16:9.
```

### 第3章 ・ 朝日（剣士、Lv.3）
> セリフ:「いざ尋常に！」

```
A young samurai-style swordsman in white traditional kendo uniform with indigo
hakama, standing in a temple courtyard at sunrise, one hand resting on the
hilt of a sheathed katana in dramatic kamae stance, fierce serene expression.
Cherry blossoms drifting through the air. An octagonal stone pavement at his
feet has a faintly visible othello pattern carved into it. Light novel
illustration, golden-pink dawn lighting, painterly anime in the style of Kyoto
Animation, 16:9.
```

### 第4章 ・ なでしこ（治療師、Lv.4）
> セリフ:「無理せずいきましょう」

```
A gentle young Japanese healer in flowing white shrine-maiden robes with sage
green sash, soft warm motherly smile. Hands held in a healing gesture with
green motes of light glowing between them. Peaceful forest grove with a small
crystal-clear spring, ferns, dappled morning light. A simple othello board
rests beside her on a moss-covered stone. Light novel illustration, soft
pastoral green palette, in the style of Kyoto Animation, 16:9.
```

### 第5章 ・ 響（吟遊詩人、Lv.5）
> セリフ:「楽しい一局を奏でよう♪」

```
A wandering bard with shoulder-length light brown hair, eyes closed in
musical concentration, playing a wooden lute. Visible musical notes drift
through the air around him. Stone bridge over a calm river at twilight, paper
lanterns floating on the water. Light novel illustration, dusk-blue palette
with warm orange lantern accents, painterly, in the style of Kyoto Animation,
16:9.
```

### 第6章 ・ つむぎ（獣使い、Lv.6）
> セリフ:「相棒もわくわくしてる」

```
A young Japanese beast-tamer girl with chestnut hair in low side-braids,
crouched beside a large mythical white kitsune fox companion. Both are
grinning with anticipation. Bamboo grove background with a moss-covered stone
lantern. A wooden othello board rests on a flat tree stump nearby with stones
half-placed. Light novel illustration, lush green forest palette, painterly,
in the style of Kyoto Animation, 16:9.
```

### 第7章 ・ 茜（技師、Lv.7）
> セリフ:「歯車みたいにかっちりね！」

```
A bright cheerful steampunk engineer girl with copper-orange messy ponytail
and brass goggles on her forehead, brown leather work apron over a white
blouse. She holds a wrench triumphantly raised, surrounded by floating brass
gears and clockwork. Workshop interior with warm copper lighting, blueprints
on the wall. A clockwork-style othello board with rotating mechanical pieces
sits on the workbench. Light novel illustration, sepia-warm palette, painterly,
in the style of Kyoto Animation, 16:9.
```

### 第8章 ・ メル（錬金術師、Lv.8）
> セリフ:「ふふ、ちょっと混ぜてみよっか？」

```
A mischievous young alchemist girl in a wide purple witch hat, tipping a
flask of glowing emerald potion. Magical sparkles rising upward. Cluttered
alchemy workshop with shelves of colored bottles, crystal apparatus, candle-
light. A black-and-white-checkered alchemy circle is drawn on the floor in
chalk, vaguely othello-board-like. Light novel illustration, deep purple and
amber palette, painterly, in the style of Kyoto Animation, 16:9.
```

### 第9章 ・ 悟（修行僧、Lv.9）
> セリフ:「無心に石を置く、ただそれだけ」

```
A serene young Buddhist monk with shaved head in saffron-orange robes, seated
in lotus position before a wooden othello board, eyes closed, an aura of
absolute stillness around him. Mountain temple veranda overlooking a misty
valley at dawn. A single black stone hovers above the board, suspended by his
focus. Light novel illustration, muted earth tones with golden temple light,
painterly, in the style of Kyoto Animation, 16:9.
```

### 第10章 ・ シキ（盗賊、Lv.10）
> セリフ:「気付いた時には遅いよ」

```
A sly rogue with sharp eyes and a slight smirk, short black hair, dark
hooded coat, crouched on a curved Edo-period rooftop tile in moonlight,
holding a single black othello stone between two fingers like a shuriken.
Edo-period rooftops below, blue moonlight night. Light novel illustration,
deep indigo night palette with cyan moonlight, painterly, in the style of
Kyoto Animation, 16:9.
```

### 第11章 ・ シオン（魔術師、Lv.11）
> セリフ:「すべては予測の内だ」

```
A cool composed mage with long lavender hair and intelligent violet eyes
behind glasses, wearing dark navy robes with silver star-embroidery. Holding
open an ancient grimoire, faint magical pentacles and constellation-circles
glowing in the air around her. Gothic study with arched windows revealing
starlight. Light novel illustration, deep blue and silver palette, painterly,
in the style of Kyoto Animation, 16:9.
```

### 第12章 ・ ルナ（夢の魔女、Lv.12）
> セリフ:「夢の中でもう勝ってるよ♡」

```
A dreamy floating witch girl with long flowing lavender hair and a crescent-
moon hat, drifting weightlessly in a starlit dreamscape. Translucent crystal
cubes (each containing a tiny othello stone) and small moons orbit around
her. She winks at the viewer playfully and blows a kiss. Light novel
illustration, lavender and silver dream palette with stardust, painterly, in
the style of Kyoto Animation, 16:9.
```

### 第13章 ・ 雪乃（学園軍師、Lv.13）
> セリフ:「この程度、解析するまでもない」

```
A composed Japanese girl strategist with long silver-blonde hair and glasses,
school uniform with a long dark coat over the shoulders. Surrounded by
holographic battle maps, floating tactical diagrams, and a translucent
othello board overlay with calculated move-vectors visible. Indoor classroom
at dusk with cool blue ambient light. Cool calculated expression. Light novel
illustration, cool blue and grey palette with cyan glowing data overlays,
painterly, in the style of Kyoto Animation, 16:9.
```

### 第14章 ・ アキラ（探偵、Lv.14）
> セリフ:「君の手筋、見えているよ」

```
A young Japanese detective in a tan trenchcoat over a school uniform, navy
hair, leaning against a brick wall with one finger raised in a thoughtful
"aha" gesture. Evidence cards (each showing an othello move notation like
"f5", "d6") float around him. Foggy alleyway at dusk, gas lamp glow, slight
mystery atmosphere. Light novel illustration, sepia-warm noir palette,
painterly, in the style of Kyoto Animation, 16:9.
```

### 第15章 ・ シエル（サイバー斥候、Lv.15）
> セリフ:「全データ把握、戦況優位」

```
A futuristic cyberpunk scout girl with sleek silver-platinum hair in a sharp
asymmetric bob and one cybernetic cyan eye. Holographic data streams and
flowing code rain wrap around her, a translucent othello board with neon
trajectories floating in front of her. Neon-lit Tokyo cityscape at night in
the deep background. Sleek black and silver bodysuit. Light novel illust-
ration, deep navy with cyan and magenta neon accents, painterly, in the style
of Kyoto Animation, 16:9.
```

### 第16章 ・ アリア（姫君、Lv.16）
> セリフ:「お手柔らかに、ですわ」

```
An elegant young princess in a flowing pastel sky-blue ballgown with intricate
silver lace, holding a delicate ivory fan, polite confident smile. Grand
palace ballroom with crystal chandeliers and marble floors. An ornately
carved ivory-and-ebony othello board rests on a marble pedestal beside her.
Light novel illustration, pastel blue and gold palette, painterly, in the
style of Kyoto Animation, 16:9.
```

### 第17章 ・ レオン（騎士、Lv.17）
> セリフ:「正々堂々、参る！」

```
A noble young knight in shining silver-blue plate armor with a flowing white
cape, sword raised vertically in a salute. Standing on a castle parapet at
golden hour dawn, sunlight streaming behind him. Banners with a checkered
black-and-white emblem fly in the wind. Determined heroic expression. Light
novel illustration, heroic golden-hour palette, painterly, in the style of
Kyoto Animation, 16:9.
```

### 第18章 ・ 宗次郎（侍、Lv.18）
> セリフ:「我が一刀、避けられはせぬ」

```
A grim sharp-eyed samurai in dark traditional armor with crimson cord lacing,
hand on katana hilt in iaido draw stance, standing on a cliff at sunset with
crows circling overhead. Determined fierce expression, scar across one cheek.
A single white stone falls past him, cleaved in half mid-air by an unseen
strike. Light novel illustration, dramatic crimson and black palette,
painterly, in the style of Kyoto Animation, 16:9.
```

### 第19章 ・ 嵐（竜騎士、Lv.19）
> セリフ:「我が竜の前に膝を折れ！」

```
A heroic dragon rider in heavy ornate plated armor astride a massive blue-
scaled dragon, hovering above storm clouds with lightning flashing behind.
The dragon roars, opening its jaws to reveal a glowing othello-board pattern
on its tongue. Epic scale, low-angle dramatic shot. Light novel illustration,
stormy blue-grey palette with white-gold lightning accents, painterly, in the
style of Kyoto Animation, 16:9.
```

### 第20章 ・ ゼロ（ハッカー、最終ボス、Lv.20）
> セリフ:「全ての変分は計算済み。詰みだ」

```
The final boss "ZERO" — an enigmatic figure in a long dark hooded cloak with
glowing cyan circuit patterns visible across the fabric. Seated calmly cross-
legged on a void of green Matrix-like code rain. Behind them, infinite othello
boards stretch into the distance, each showing a different game-state.
One gloved hand raised in a "checkmate" gesture, a single black stone floating
above the fingertips. Their face is mostly shadowed by the hood; only one
cold cyan glowing eye is visible. Light novel illustration, deep black void
with neon green code and electric cyan accents, climactic and ominous,
painterly, in the style of Kyoto Animation, 16:9.
```

## D.5 統合方法（章挿絵）

`COMPUTERS` 配列に `chapterArt` フィールドを追加：

```js
const COMPUTERS = [
  { kanji: '苺', name: 'いちか', level: 1, quote: 'ふぁいとぉ♪ 楽しんで！',
    image: '/avatars/18_idol_singer.png',
    chapterArt: '/avatars/chapters/chapter_01_ichika.png' },  // ← 追加
  // ...
];
```

設定モーダルのストーリーパネル、現在章カード部を変更：

```jsx
<div
  className="border border-amber-200/30 rounded-sm p-4 relative overflow-hidden"
  style={opp.chapterArt ? {
    backgroundImage: `linear-gradient(rgba(10,8,5,0.5), rgba(10,8,5,0.85)), url(${opp.chapterArt})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : { background: 'rgba(245, 230, 200, 0.04)' }}
>
  {/* 既存の章カード内容 */}
</div>
```

---

# E. ナラティブ挿絵（5枚）

物語の節目に表示する、ラノベ口絵的なドラマチックな1枚。

## E.1 仕様

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| 形式 | PNG または WebP |
| ファイルサイズ | 1〜2 MB 以内 |
| 配置先 | `public/illustrations/` |

## E.2 5枚のリスト

| # | ファイル名 | タイミング | 主題 |
|---|---|---|---|
| E-1 | `prologue.png` | OP テキスト表示時 | 転生の瞬間 |
| E-2 | `solitude.png` | 第10章クリア後 | 孤独な深夜の対局 |
| E-3 | `allies.png` | 第15章クリア後 | 倒した達人たちが仲間に |
| E-4 | `final.png` | 第20章開始時 | ゼロとの対峙 |
| E-5 | `ending.png` | エンディング表示時 | 現実への帰還 |

## E.3 各シーンのプロンプト

### E-1. プロローグ：「転生の瞬間」

A.3 と共通でも可（A の構図を使い回す）。専用にするなら：

```
A teenage Japanese protagonist in a modern school uniform falling backward
through a dissolving classroom floor, expression of shock turning to wonder.
Below: a glowing infinite othello board portal opens. Stones rise around them.
Painterly anime light novel illustration, in the style of Kyoto Animation,
deep navy void with golden portal light, dramatic vertical motion blur, 16:9.
```

### E-2. 「孤独な深夜の対局」

```
A teenage protagonist sits alone at a wooden othello board in a dimly lit
inn room at midnight. Head bowed, one hand on chin in deep thought, brow
furrowed. Half-eaten food and a cold cup of tea beside them. Walls covered
in handwritten notes and game records of past matches. Moonlight streams
through a paper window. The protagonist's reflection in the dark window
glass shows determination. Light novel illustration, melancholic deep blue
palette with warm desk-lamp amber accent, painterly, in the style of Kyoto
Animation, 16:9.
```

### E-3. 「見守る達人たち」

```
The protagonist plays an othello game with the alchemist character (Mel) at
a low wooden table inside a cozy lantern-lit inn. Several already-defeated
characters watch from the sidelines with warm smiles—the cheerful idol Ichika
clapping, the gentle healer Nadeshiko serving tea, the young swordsman Asahi
nodding approvingly, the bard Hibiki playing softly. Warm wooden interior,
paper lanterns, snowy landscape visible through window. Light novel
illustration, warm sepia-amber palette, painterly, in the style of Kyoto
Animation, 16:9.
```

### E-4. 「ゼロとの対峙」

```
A teenage protagonist faces the final boss ZERO across a luminous othello
board floating in a vast cosmic void of swirling green code rain and stars.
The protagonist's face is determined, eyes glowing with golden resolve, hands
gripping the edge of the board. ZERO is a hooded silhouette across from
them, only one cold cyan eye visible. Behind the protagonist, ghostly
translucent silhouettes of the 19 defeated masters stand in silent support
- Ichika, Aoi, Asahi, Nadeshiko, Hibiki, and so on. Cinematic, epic, light
novel cover art, in the style of Kyoto Animation, deep cosmic black palette
with golden protagonist light vs cyan villain light, dramatic, 16:9.
```

### E-5. 「現実への帰還」

```
A teenage protagonist standing at the edge of a dissolving othello-board
world, looking back over their shoulder with a bittersweet smile and slight
tears in their eyes. Behind them, the 20 masters wave farewell, slowly
fading into golden particles of light. Ahead, a doorway of warm sunlight
leads back to a normal modern Japanese cityscape (their home town visible
in the distance). Painterly light novel epilogue art, in the style of Kyoto
Animation, golden hour with bittersweet emotion, deep warm tones, 16:9.
```

## E.4 統合方法（ナラティブ挿絵）

```js
// App.jsx に NARRATIVE_INSERTS マップを追加
const NARRATIVE_INSERTS = {
  prologue: '/illustrations/prologue.png',
  solitude: '/illustrations/solitude.png',
  allies:   '/illustrations/allies.png',
  final:    '/illustrations/final.png',
  ending:   '/illustrations/ending.png',
};
```

表示は専用モーダルまたはオーバーレイで：

```jsx
{showNarrative && (
  <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full">
      <img src={NARRATIVE_INSERTS[currentNarrative]} className="w-full rounded-sm shadow-2xl" />
      <p className="jp-display text-amber-100/85 text-sm md:text-base mt-4 leading-relaxed">
        {narrativeText}
      </p>
      <button onClick={() => setShowNarrative(false)} className="btn mt-4">続ける</button>
    </div>
  </div>
)}
```

トリガー：
- `prologue`: ストーリーモード開始かつ `storyProgress === 0` のとき1回
- `solitude`: `storyProgress` が 0→10 に進んだ瞬間
- `allies`: `storyProgress` が 14→15 に進んだ瞬間
- `final`: `storyProgress === 19` で第20章対局開始時
- `ending`: `storyProgress === 20` で勝利時

---

# F. 段階的制作プラン

予算・時間が限られる場合の推奨優先順：

## Tier 1（最低限・1日相当）
- **A. スタート画面 KV**（1枚）

これだけでアプリの第一印象が一気に向上します。

## Tier 2（中量・1週間相当）
- Tier 1 +
- **E-1 プロローグ + E-5 エンディング**（物語の額縁）
- **D-1 (いちか) + D-20 (ゼロ)**（最初と最後の章だけ豪華）

「始まりと終わりが豪華」だと体験全体が引き締まる。

## Tier 3（フル・3〜4週間相当）
- Tier 2 +
- **D 全20章**
- **E 残り3枚**

完全なラノベ作品レベル。

## 一気に作る場合のコツ

**D（章挿絵）20枚を一気に作る場合**:
1. 最初に D-1（いちか）を3〜5パターン生成して、最良のものを選定
2. その採用画像のスタイルを固定 reference として、残り19枚に適用
3. 章ごとのキャラ要素は変えるが、**塗り・線・色味は揃える**

これで20枚作っても作画ブレを防げます。

---

# G. ファイル配置 全体マップ

最終的なディレクトリ構造：

```
public/
├── title-bg.png                          ← A
├── avatars/
│   ├── 01_cheerful_swordsman.png         ← C ✅
│   ├── 02_calm_mage.png                  ← C ✅
│   ├── ...                               (20 files)
│   ├── 20_hacker.png                     ← C ✅
│   ├── players/
│   │   ├── 01_haruki.png                 ← B ✅
│   │   ├── 02_mikoto.png                 ← B ✅
│   │   ├── ...                           (20 files)
│   │   └── 20_yu.png                     ← B ✅
│   └── chapters/
│       ├── chapter_01_ichika.png         ← D
│       ├── chapter_02_aoi.png            ← D
│       ├── ...                           (20 files)
│       └── chapter_20_zero.png           ← D
└── illustrations/
    ├── prologue.png                      ← E-1
    ├── solitude.png                      ← E-2
    ├── allies.png                        ← E-3
    ├── final.png                         ← E-4
    └── ending.png                        ← E-5
```

---

# H. 納品チェックリスト（各画像）

- [ ] 解像度が規定通り
- [ ] 画像内に文字・ロゴ・ウォーターマークが入っていない
- [ ] 京アニ系の作画統一感がある（純黒輪郭線禁止）
- [ ] キャラの表情・ポーズがセリフと矛盾していない
- [ ] ファイル名が指示通り（コード内の参照と一致）
- [ ] PNG/WebP で規定サイズ以内
- [ ] 余白配置がオーバーレイ用 UI を妨げない

---

# I. 推奨ツール早見表

| ツール | 強み | 弱み | 用途推奨 |
|---|---|---|---|
| **Niji 6 (Midjourney)** | ラノベ口絵調が標準 | 細かい指示が効きにくい | A, D, E |
| **NovelAI v3** | 京アニ風が安定、表情コントロール | painterly 感やや弱い | D（キャラ重視） |
| **Stable Diffusion XL + Anime LoRA** | 自由度最大、ControlNet | 試行錯誤多い | 全カテゴリ |
| **Midjourney v6 niji style** | 構図のドラマ感 | キャラ統一性は工夫いる | A, E |

20枚を作る場合、**最初の2〜3枚で作風固定 → reference として残りに適用** が鉄則。

---

最低限はAだけでも見栄えします。Bを揃えると一気に「作品」になり、Cまで足すとラノベの完成度に近づきます。
