# Step 5 — ナラティブ挿絵 残り3枚

> **作品**: 転生したらオセロ世界でした！  
> **挿絵制作ロードマップの一部** ・ [全体目次](./README.md)


| 項目 | 値 |
|---|---|
| 制作枚数 | **3枚** |
| 推定時間 | 1日 |
| 優先度 | 🟢 余裕があれば |

---

## なぜここか

- ステップ4まで揃ったところで、物語の「**中間点の感情**」を補強する余裕が出てくる
- ラノベ口絵の3大シーン（試練・仲間・決戦）を入れて世界観を完成させる

## 5-A. 「孤独な深夜の対局」（第10章クリア後）

```
A teenage protagonist sits alone at a wooden othello board in a dimly lit
inn room at midnight. Head bowed, one hand on chin in deep thought, brow
furrowed. Half-eaten food and a cold cup of tea beside them. Walls covered
in handwritten notes and game records of past matches. Moonlight streams
through a paper window. The protagonist's reflection in the dark window
glass shows determination.
Light novel illustration, melancholic deep blue palette with warm desk-lamp
amber accent, painterly, in the style of Kyoto Animation, 16:9.
```

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| ファイル名 | `solitude.png` |
| 配置先 | `public/illustrations/solitude.png` |

## 5-B. 「見守る達人たち」（第15章クリア後）

```
The protagonist plays an othello game with the alchemist character (Mel) at
a low wooden table inside a cozy lantern-lit inn. Several already-defeated
characters watch from the sidelines with warm smiles—the cheerful idol Ichika
clapping, the gentle healer Nadeshiko serving tea, the young swordsman Asahi
nodding approvingly, the bard Hibiki playing softly. Warm wooden interior,
paper lanterns, snowy landscape visible through window.
Light novel illustration, warm sepia-amber palette, painterly, in the style of
Kyoto Animation, 16:9.
```

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| ファイル名 | `allies.png` |
| 配置先 | `public/illustrations/allies.png` |

## 5-C. 「ゼロとの対峙」（第20章開始時）

```
A teenage protagonist faces the final boss ZERO across a luminous othello
board floating in a vast cosmic void of swirling green code rain and stars.
The protagonist's face is determined, eyes glowing with golden resolve, hands
gripping the edge of the board. ZERO is a hooded silhouette across from
them, only one cold cyan eye visible. Behind the protagonist, ghostly
translucent silhouettes of the 19 defeated masters stand in silent support.
Cinematic, epic, light novel cover art, in the style of Kyoto Animation,
deep cosmic black palette with golden protagonist light vs cyan villain light,
dramatic, 16:9.
```

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| ファイル名 | `final.png` |
| 配置先 | `public/illustrations/final.png` |

## 5-D. コード拡張

### 1. NARRATIVE_INSERTS マップを拡張

```js
const NARRATIVE_INSERTS = {
  prologue: { image: '/illustrations/prologue.png', text: STORY_INTRO },
  solitude: { image: '/illustrations/solitude.png',
              text: 'ここまでの戦いを思い返す。\n達人たちの一手一手が、君の中に積み重なっている——' },
  allies:   { image: '/illustrations/allies.png',
              text: 'いつしか、倒した達人たちは仲間として君の傍らにいた。\n盤上世界もまた、出会いの場であったのだ。' },
  final:    { image: '/illustrations/final.png',
              text: '最後の門番、ゼロ。\n19人の達人すべてが、君の背に立っている。' },
  ending:   { image: '/illustrations/ending.png',  text: STORY_ENDING },
};
```

### 2. トリガー追加（既存の useEffect を拡張）

```jsx
useEffect(() => {
  if (!storyJustAdvanced) return;
  if (storyProgress === 10) setNarrative('solitude');
  else if (storyProgress === 15) setNarrative('allies');
  else if (storyProgress === 20) setNarrative('ending');
}, [storyJustAdvanced, storyProgress]);

useEffect(() => {
  if (screen === 'game' && aiMode === 'story' && storyProgress === 19 && kifu.length === 0) {
    setNarrative('final');
  }
}, [screen, aiMode, storyProgress, kifu.length]);
```

## ✅ 完了基準

- [ ] 第10章クリア時に「孤独な深夜の対局」が出る
- [ ] 第15章クリア時に「見守る達人たち」が出る
- [ ] 第20章開始時に「ゼロとの対峙」が出る
- [ ] 各場面に応じた挿絵とテキストが表示される

---

**前のステップ**: [Step 4 — 節目章（5/10/15）](./step4_chapters_milestones.md)
**次のステップ**: [Step 6 — 残り15章](./step6_remaining_chapters.md)
