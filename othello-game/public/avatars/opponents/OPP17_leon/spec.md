# OPP17 レオン (Leon) — 騎士

> 「正々堂々、参る！」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP17` |
| Slug | `leon` |
| 名前 (日本語) | レオン |
| 名前 (英語) | Leon |
| 漢字キー | 獅 |
| アーキタイプ (日本語) | 騎士 |
| アーキタイプ (英語) | Knight |
| 難易度レベル (Story Mode) | Lv.17 |
| 名言 (日本語) | 「正々堂々、参る！」 |
| 名言 (英語) | "I'll fight with honor!" |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Tousled blonde hair, noble blue eyes, gentle confident smile, polished silver platemail with gold filigree trim, blue undertunic visible at neck, large gold star/sun-burst chest crest set with a central blue diamond gem (this is the "Othello Crest" emblem — also appears in the background banner). Chivalric knight (sword not visible in this bust portrait).

## 背景の世界観

**城の中庭・朝**

背景画像は `background.png` (1024×1024 RGB) として同梱。キャラクターと共通の世界観・色調で統一されており、`icon.png` (合成済み円形クロップ版) で最終的なゲーム内表示に最も近い見た目を確認できる。

## このキャラ固有の処理ノート

胸のオセロクレストと背景の旗が同じ意匠で意図的に統一されている。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体。CSS/コードで背景と重ね合わせて使用 |
| `background.png` | PNG (RGB) | 1024×1024 | このキャラ専用の背景画像 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済の最終アイコン (キャラ + 背景合成済み) |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

CSS 2 レイヤー合成例:

```css
.avatar-leon {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-leon > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

または事前合成済みの `icon.png` を直接 `<img>` で使えば 1 リクエストで済む。

## 透過処理について

このキャラの `character.png` は **Adobe Photoshop で透過処理済**。Claude 側で行ったのはリサイズ・正規化・ファイル保存・合成プレビュー生成のみ。再生成依頼時は外部で透過処理 → このディレクトリの `character.png` を上書き、という運用を維持してください。

## 関連ドキュメント

- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1 STYLE
- §3 OPP ROSTER 全体: `MASTER_CHAR_INSTRUCTIONS.md` の §3
- 進捗トラッカー: `progress_tracker_chars.md` / `progress_tracker_bgs.md`

---

最終更新: 2026-05-06 (実画像準拠の v2 仕様書)
