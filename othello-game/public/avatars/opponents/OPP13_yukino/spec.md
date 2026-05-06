# OPP13 雪乃 (Yukino) — 学園軍師

> 「この程度、解析するまでもない」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP13` |
| Slug | `yukino` |
| 名前 (日本語) | 雪乃 |
| 名前 (英語) | Yukino |
| 漢字キー | 雪 |
| アーキタイプ (日本語) | 学園軍師 |
| アーキタイプ (英語) | School Strategist |
| 難易度レベル (Story Mode) | Lv.13 |
| 名言 (日本語) | 「この程度、解析するまでもない」 |
| 名言 (英語) | "This level needs no analysis." |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Long silver / light gray hair flowing past shoulders (NOT dark navy, NOT black). Side braid tied with blue ribbon and adorned with a gold star hairpin at the temple.
>
> Round-rimmed glasses (visible, framed — not rimless).
>
> Blue eyes (intelligent, calm, analytical gaze).
>
> Navy school blazer with gold trim and gold star embroidery on the lapels. Large red bow tie at the neck with a central blue jewel ornament. Beige / cream sweater vest underneath. White shirt collar visible. Subtle wheat motif embroidery on the blazer.
>
> Calm cool composure of a quiet intellectual strategist. Slight thoughtful expression with hand near chin in analyzing pose.
>
> Cool data-strategist vibe. The "snowflake-like" precision of her name (雪乃 = snow) is reflected in the cool color palette and the sharp clarity of her presence.

## 背景の世界観

**戦略室・データの海**

背景画像は `background.png` (1024×1024 RGB) として同梱。冷たい青のホログラム分析画面と雪の結晶モチーフが浮遊する戦略室。**名前 (雪乃 = 雪) と背景の雪の結晶モチーフが連動**する設計。銀髪と背景の冷ややかな青が美しく呼応する。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: §3 仕様書改訂議論を経て、雪乃は「暗紺髪+眼鏡なし」より「**銀髪+眼鏡 (章別挿絵 chapter_13_* と整合)**」を確定デザインとして採用。アバターを挿絵に寄せる方針で再生成完了。
- ホログラム分析画面は背景レイヤー側に配置。キャラ部分にはホログラムを描き込まない設計。
- 章別挿絵 (`public/avatars/chapters/chapter_13_*`) は変更不要 (既に銀髪+眼鏡で描かれているため整合)。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体。CSS/コードで背景と重ね合わせて使用 |
| `background.png` | PNG (RGB) | 1024×1024 | このキャラ専用の背景画像 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済の最終アイコン (キャラ + 背景合成済み) |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-yukino {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-yukino > .character {
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

最終更新: 2026-05-06 (銀髪+眼鏡版で再生成・差し替え完了)
