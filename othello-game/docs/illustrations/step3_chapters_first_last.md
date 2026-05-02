# Step 3 — 第1章・第20章 挿絵

> **作品**: 転生したらオセロ世界でした！  
> **挿絵制作ロードマップの一部** ・ [全体目次](./README.md)


| 項目 | 値 |
|---|---|
| 制作枚数 | **2枚** |
| 推定時間 | 半日 |
| 優先度 | 🟡 中 |

---

## なぜここか

- ストーリーの **始点（いちか）** と **終点（ゼロ）** だけでも豪華にすると劇的に締まる
- 「途中の章は素朴でも、最初と最後だけ凝ってる」 = 序破急のメリハリ

## 3-A. 第1章「いちか」挿絵

> セリフ:「ふぁいとぉ♪ 楽しんで！」

```
A bright cheerful young Japanese idol singer with strawberry-pink twintails
and a star hair clip, on a glittering pastel-pink stage with sparkles, hearts,
and pop motifs floating around. Holding a microphone with one hand and waving
encouragingly with the other, full body shot, energetic welcoming pose. A small
white-and-black othello board sits casually on a stool beside her like a stage
prop. Stage lights softly glowing.
Light novel illustration in the style of Kyoto Animation, soft pastel pink
palette, painterly background, 16:9.
```

**重要**: 既存の `public/avatars/18_idol_singer.png` を AI に **character reference として渡す** こと。

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) |
| ファイル名 | `chapter_01_ichika.png` |
| 配置先 | `public/avatars/chapters/chapter_01_ichika.png` |

## 3-B. 第20章「ゼロ」挿絵

> セリフ:「全ての変分は計算済み。詰みだ」

```
The final boss "ZERO" — an enigmatic figure in a long dark hooded cloak with
glowing cyan circuit patterns visible across the fabric. Seated calmly cross-
legged on a void of green Matrix-like code rain. Behind them, infinite othello
boards stretch into the distance, each showing a different game-state.
One gloved hand raised in a "checkmate" gesture, a single black stone floating
above the fingertips. Their face is mostly shadowed by the hood; only one
cold cyan glowing eye is visible.
Light novel illustration, deep black void with neon green code and electric
cyan accents, climactic and ominous, painterly, in the style of Kyoto
Animation, 16:9.
```

reference: `public/avatars/20_hacker.png`

| 項目 | 値 |
|---|---|
| 解像度 | 1024×768 (4:3) |
| ファイル名 | `chapter_20_zero.png` |
| 配置先 | `public/avatars/chapters/chapter_20_zero.png` |

## 3-C. コード統合

### 1. COMPUTERS 配列に chapterArt フィールドを追加

```js
const COMPUTERS = [
  { kanji: '苺', name: 'いちか', level: 1, quote: 'ふぁいとぉ♪ 楽しんで！',
    image: '/avatars/18_idol_singer.png',
    chapterArt: '/avatars/chapters/chapter_01_ichika.png' },  // ← 追加
  // ... 中略 ...
  { kanji: '零', name: 'ゼロ',  level: 20, quote: '全ての変分は計算済み。詰みだ',
    image: '/avatars/20_hacker.png',
    chapterArt: '/avatars/chapters/chapter_20_zero.png' },    // ← 追加
];
```

### 2. 設定モーダルのストーリー章カード部を更新

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

これで `chapterArt` が設定されているキャラだけ画像背景になり、設定されていないキャラは従来通りの暗背景。次のステップで他章を追加する準備が整います。

## ✅ 完了基準

- [ ] ストーリーモード設定画面で、第1章カードに「いちか」の挿絵が背景表示される
- [ ] 第20章のカードにも「ゼロ」の挿絵が出る
- [ ] 他の章は従来通り（暗い純色背景）でも違和感なし

---

**前のステップ**: [Step 2 — プロローグ + エンディング](./step2_prologue_ending.md)
**次のステップ**: [Step 4 — 節目章（5/10/15）](./step4_chapters_milestones.md)
