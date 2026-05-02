# Step 1 — スタート画面キービジュアル

> **作品**: 転生したらオセロ世界でした！  
> **挿絵制作ロードマップの一部** ・ [全体目次](./README.md)


| 項目 | 値 |
|---|---|
| 制作枚数 | **1枚** |
| 推定時間 | 半日 |
| 優先度 | 🔴 最優先 |

---

## なぜここから始めるか

- 起動した瞬間に見える**第一印象**
- 現状はテキストのみで寂しい
- これ1枚あるだけでアプリの完成度が一気に上がる

## 1-A. 画像生成

「**転生の瞬間**」構図で1枚生成：

```
A teenage Japanese protagonist seen from behind, suspended mid-fall in midair,
still wearing a modern Japanese school blazer uniform. The figure is a soft
silhouette, gender-neutral, no visible face. Below them, a vast cosmic othello
board glows like an interdimensional portal between worlds, its surface
shimmering with green felt and golden trim.

Hundreds of black obsidian and white pearl go-stones spiral upward around the
falling figure, weightless. Faint silhouettes of 20 master figures stand
arrayed at the far horizon.

Background: deep navy and violet starry void with a single golden amber light
source from above. Lower half of the frame is darker (room for title text and
UI cards).

Painterly anime light novel cover art, in the style of Kyoto Animation,
dramatic vertical composition, no visible text or logos. 16:9 widescreen.
```

### 仕様

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| 形式 | PNG または WebP |
| ファイルサイズ | 1〜3 MB |
| ファイル名 | `title-bg.png` |
| 配置先 | `public/title-bg.png` |

## 1-B. コード統合

ファイルを置いたら、`src/App.jsx` の `TitleScreen` コンポーネントを以下のように差し替え：

```jsx
// Before:
<div className="stage-bg min-h-screen w-full relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
  {/* Decorative title-screen background — radial light + scattered stones */}
  <div className="absolute inset-0 pointer-events-none">
    {/* ...パーティクル... */}
  </div>

// After:
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
  {/* ↑ 装飾パーティクルのループは削除 */}
```

## 1-C. 確認事項

- [ ] タイトル文字「転生したらオセロ世界でした！」が画像と被って読みにくくないか
- [ ] 3つのモード選択カードが画像と干渉していないか
- [ ] モバイルでも背景が崩れずに表示されるか

## ✅ 完了基準

`title-bg.png` が配置され、起動するとタイトル画面に背景画像が出ている。

---

**次のステップ**: [Step 2 — プロローグ + エンディング挿絵](./step2_prologue_ending.md)
