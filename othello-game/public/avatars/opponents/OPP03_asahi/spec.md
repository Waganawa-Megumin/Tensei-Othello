# OPP03 朝日 (Asahi) — 剣士

> 「いざ尋常に！」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP03` |
| Slug | `asahi` |
| 名前 (日本語) | 朝日 |
| 名前 (英語) | Asahi |
| 漢字キー | 朝 |
| アーキタイプ (日本語) | 剣士 |
| アーキタイプ (英語) | Swordsman |
| 難易度レベル (Story Mode) | Lv.3 |
| 名言 (日本語) | 「いざ尋常に！」 |
| 名言 (英語) | "Have at thee!" |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Young swordsman embodying **East-West Fusion Bushido** — a youthful warrior who has trained in both Japanese samurai arts and Western chivalric combat.
>
> **Hair**: Black, shoulder-length, partially tied back with a red cord at the nape (samurai-style topknot influence, but loose and modern).
>
> **Face**: Warm brown eyes, bright open-mouthed grin, cheerful and honorable expression.
>
> **Inner layer**: White juban (under-kimono) with visible collar at neck. Indigo hakama trousers visible at hip/waist level.
>
> **Armor (Western fusion elements)**: Black breastplate and shoulder pauldrons (Western plate armor style) with gold edge trim and engraved Eastern motifs (cherry blossom, family crest, subtle dragon scales). The armor is fitted over the kimono, not replacing it.
>
> **Red elements (signature)**: Red haori-style scarf draped over one shoulder; red obi (sash) tied at waist. Both visually echo the rising-sun "asahi" name.
>
> **Weapon**: Single katana at waist (samurai weapon), with a Western-style gold-filigree metal scabbard accent. Hilt visible above the obi.
>
> **Detail**: Brown leather strapping for armor pieces, traditional silk cords for kimono. Gold filigree on armor edges.
>
> **Energy**: Cheerful brave warrior with the discipline of a samurai and the boldness of a knight. NOT a pure kendo gi look. NOT a pure Western plate armor look. Clear visual fusion of both.

## 背景の世界観

**朝の道場庭・桜**

背景画像は `background.png` (1024×1024 RGB) として同梱。日の出の道場庭園、桜の花びらが舞う中、東の空が朝日に染まる構図。**鎧の桜紋と背景の桜が呼応**することで、和洋融合のキャラ性と背景が完璧に調和する。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: §3 仕様書改訂議論を経て、本キャラは「純和風 (旧 §3)」でも「純西洋 (前回生成版)」でもなく、**両者を明確に融合させたデザイン**を採用。アバター・挿絵・シナリオすべてを融合デザインに揃える。
- 鎧の桜紋・家紋と背景の桜が視覚的に呼応する設計。
- 挿絵 (`public/avatars/chapters/chapter_03_*`) は旧 §3 (純和風剣道少年) で描かれている前提なので、新融合デザインに合わせて再生成が必要。

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
.avatar-asahi {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-asahi > .character {
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
- 設定改変決定の経緯: `STORY_AND_ILLUSTRATION_REDESIGN_v2.md`

---

最終更新: 2026-05-06 (和洋融合武士道で再生成・差し替え完了)
