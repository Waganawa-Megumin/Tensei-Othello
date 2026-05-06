# OPP09 悟 (Satoru) — 修行僧

> 「無心に石を置く、ただそれだけ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP09` |
| Slug | `satoru` |
| 名前 (日本語) | 悟 |
| 名前 (英語) | Satoru |
| 漢字キー | 悟 |
| アーキタイプ (日本語) | 修行僧 |
| アーキタイプ (英語) | Monk |
| 難易度レベル (Story Mode) | Lv.9 |
| 名言 (日本語) | 「無心に石を置く、ただそれだけ」 |
| 名言 (英語) | "An empty mind places the stone. Nothing more." |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Shaved head, gold geometric/diamond seal mark on forehead, calm green eyes (OPEN, slight gentle smile — not closed in meditation), BLACK outer robe over WHITE inner robe with gold trim (NOT orange Buddhist robes), very large brown wooden prayer beads (juzu/mala) draped diagonally across chest. Quietly serene zen monk.

## 背景の世界観

**禅寺・石庭**

背景画像は `background.png` (1024×1024 RGB) として同梱。キャラクターと共通の世界観・色調で統一されており、`icon.png` (合成済み円形クロップ版) で最終的なゲーム内表示に最も近い見た目を確認できる。

## このキャラ固有の処理ノート

背景に円相 (enso) が描かれており、合成すると頭部背後で後光のような効果になる。

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
.avatar-satoru {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-satoru > .character {
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
