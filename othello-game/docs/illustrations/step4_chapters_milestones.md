# Step 4 — 節目章 3枚（第5・10・15章）

> **作品**: 転生したらオセロ世界でした！  
> **挿絵制作ロードマップの一部** ・ [全体目次](./README.md)


| 項目 | 値 |
|---|---|
| 制作枚数 | **3枚** |
| 推定時間 | 1日 |
| 優先度 | 🟡 中 |

---

## なぜここか

- 20章を5章ごとに区切る目印になる
- ストーリー進行の「**章の間隔**」を視覚的に演出
- 全章揃えるより労力1/4で印象7割

## 4-A. 第5章「響」（吟遊詩人 / 入門終わり）

> セリフ:「楽しい一局を奏でよう♪」

```
A wandering bard with shoulder-length light brown hair, eyes closed in
musical concentration, playing a wooden lute. Visible musical notes drift
through the air around him. Stone bridge over a calm river at twilight, paper
lanterns floating on the water.
Light novel illustration, dusk-blue palette with warm orange lantern accents,
painterly, in the style of Kyoto Animation, 16:9.
```

reference: `public/avatars/07_musician_bard.png`

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) |
| ファイル名 | `chapter_05_hibiki.png` |
| 配置先 | `public/avatars/chapters/chapter_05_hibiki.png` |

## 4-B. 第10章「シキ」（盗賊 / 中盤の壁）

> セリフ:「気付いた時には遅いよ」

```
A sly rogue with sharp eyes and a slight smirk, short black hair, dark
hooded coat, crouched on a curved Edo-period rooftop tile in moonlight,
holding a single black othello stone between two fingers like a shuriken.
Edo-period rooftops below, blue moonlight night.
Light novel illustration, deep indigo night palette with cyan moonlight,
painterly, in the style of Kyoto Animation, 16:9.
```

reference: `public/avatars/06_sly_rogue.png`

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) |
| ファイル名 | `chapter_10_shiki.png` |
| 配置先 | `public/avatars/chapters/chapter_10_shiki.png` |

## 4-C. 第15章「シエル」（サイバー斥候 / 終盤前段）

> セリフ:「全データ把握、戦況優位」

```
A futuristic cyberpunk scout girl with sleek silver-platinum hair in a sharp
asymmetric bob and one cybernetic cyan eye. Holographic data streams and
flowing code rain wrap around her, a translucent othello board with neon
trajectories floating in front of her. Neon-lit Tokyo cityscape at night in
the deep background. Sleek black and silver bodysuit.
Light novel illustration, deep navy with cyan and magenta neon accents,
painterly, in the style of Kyoto Animation, 16:9.
```

reference: `public/avatars/10_cyberpunk_scout.png`

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) |
| ファイル名 | `chapter_15_ciel.png` |
| 配置先 | `public/avatars/chapters/chapter_15_ciel.png` |

## 4-D. コード追加

各 `COMPUTERS` エントリに `chapterArt` フィールドを追加するだけ：

```js
{ kanji: '響', name: '響', level: 5, quote: '楽しい一局を奏でよう♪',
  image: '/avatars/07_musician_bard.png',
  chapterArt: '/avatars/chapters/chapter_05_hibiki.png' },

{ kanji: '黒', name: 'シキ', level: 10, quote: '気付いた時には遅いよ',
  image: '/avatars/06_sly_rogue.png',
  chapterArt: '/avatars/chapters/chapter_10_shiki.png' },

{ kanji: '銀', name: 'シエル', level: 15, quote: '全データ把握、戦況優位',
  image: '/avatars/10_cyberpunk_scout.png',
  chapterArt: '/avatars/chapters/chapter_15_ciel.png' },
```

設定モーダル側のレンダリングは Step 3 で既に対応済みなので追加修正不要。

## ✅ 完了基準

- [ ] 第1, 5, 10, 15, 20 章の5枚が揃い、ストーリーが「**5章ごとに視覚的山場**」を持つ構成になっている
- [ ] 残り15章は引き続き暗背景でも違和感なし

---

**前のステップ**: [Step 3 — 第1章・第20章](./step3_chapters_first_last.md)
**次のステップ**: [Step 5 — ナラティブ挿絵 残り3枚](./step5_narrative_inserts.md)
