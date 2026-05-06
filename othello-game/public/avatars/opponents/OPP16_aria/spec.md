# OPP16 アリア (Aria) — 姫君

> 「お手柔らかに、ですわ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP16` |
| Slug | `aria` |
| 名前 (日本語) | アリア |
| 名前 (英語) | Aria |
| 漢字キー | 姫 |
| アーキタイプ (日本語) | 姫君 |
| アーキタイプ (英語) | Princess |
| 難易度レベル (Story Mode) | Lv.16 |
| 名言 (日本語) | 「お手柔らかに、ですわ」 |
| 名言 (英語) | "Pray go easy on me." |

## キャラクターデザイン (維持ポイント)

> **共通**: Long flowing golden-blonde hair with elaborate braided crown/bun on top, sapphire blue eyes, gold tiara set with a large blue diamond gem, blue diamond gem dangling earrings, gentle royal smile.
>
> **アバター用**: White frilly off-shoulder ballgown with gold trim and blue diamond gem accents at the chest and choker (本ファイル `character.png` のデザイン)。
>
> **章別挿絵用 (バリエーション)**: Sapphire blue ballgown with white gloves and elegant lace fan (章 16 LS/PT 挿絵 `chapter_16_*` で採用されているデザイン)。

> 💡 **マルチ衣装設定 (2026-05-06 確定)**: アリアは姫君というキャラクター性上、場面ごとに異なるドレスを身に纏う。**アバター = 白ドレス**、**章別挿絵 = 青ドレス** という配分で両方とも canonical 採用。お姫様の衣装替えは自然な振る舞いなので、アバターと挿絵が異なる衣装を着ていても矛盾しない (むしろキャラクター性に厚みが出る)。

## 背景の世界観

**王宮舞踏会場**

背景画像は `background.png` (1024×1024 RGB) として同梱。シャンデリアと大理石の柱が並ぶ豪奢な舞踏会場。アリアの姫君としての世界観に最適。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: §3 仕様書改訂議論を経て、アバターと挿絵の衣装の不整合は「**姫君は場面で衣装を変える**」というキャラクター性で解消することに決定。両方の衣装ともに正としてキャラクターに帰属する設定。
- 髪のカール・ボリュームのある髪型は Adobe 透過処理で問題なく処理されている。
- 共通の identifying features (髪・瞳・ティアラ・サファイアジュエル) はすべての衣装で一貫しているので、画像認識・呼称面で混乱は起きない。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (白ドレス版)。CSS/コードで背景と重ね合わせて使用 |
| `background.png` | PNG (RGB) | 1024×1024 | このキャラ専用の背景画像 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済の最終アイコン (白ドレス版で合成済み) |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

CSS 2 レイヤー合成例:

```css
.avatar-aria {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-aria > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

または事前合成済みの `icon.png` を直接 `<img>` で使えば 1 リクエストで済む。

## 透過処理について

このキャラの `character.png` は **Adobe Photoshop で透過処理済**。Claude 側で行ったのはリサイズ・正規化・ファイル保存・合成プレビュー生成のみ。

## 関連ドキュメント

- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1 STYLE
- §3 OPP ROSTER 全体: `MASTER_CHAR_INSTRUCTIONS.md` の §3
- 進捗トラッカー: `progress_tracker_chars.md` / `progress_tracker_bgs.md`
- 設定改変決定の経緯: `STORY_AND_ILLUSTRATION_REDESIGN_v2.md`

---

最終更新: 2026-05-06 (マルチ衣装設定を明文化、アバターと挿絵の衣装差を canonical 化)
