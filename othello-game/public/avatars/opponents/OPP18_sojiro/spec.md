# OPP18 宗次郎 (Sojiro) — 侍

> 「我が一刀、避けられはせぬ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP18` |
| Slug | `sojiro` |
| 名前 (日本語) | 宗次郎 |
| 名前 (英語) | Sojiro |
| 漢字キー | 宗 |
| アーキタイプ (日本語) | 侍 |
| アーキタイプ (英語) | Samurai |
| 難易度レベル (Story Mode) | Lv.18 |
| 名言 (日本語) | 「我が一刀、避けられはせぬ」 |
| 名言 (英語) | "My blade — none escape it." |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Long indigo (deep blue-purple) hair flowing down past shoulders, scar across one cheek, wise weathered eyes with the gravity of many battles, calm and composed face of a battle-hardened veteran samurai. Beard/goatee adds to the seasoned appearance. Black warring-states armor (Sengoku-era ōyoroi style) with crimson cord lacing (緋縅), gold laurel-wreath family crest on the chest plate, traditional kabuto motifs and floral patterns on inner kimono. Two katanas at waist (大小二本差し / daishō: long katana + short wakizashi) with red cord wrapping. Aged but not frail — a master swordsman in his prime years of veteran experience. Stoic, dignified, weight of authority.

## 背景の世界観

**戦国野営地・夜明け**

背景画像は `background.png` (1024×1024 RGB) として同梱。戦国時代の野営地に陣旗が立ち並び、東の空が朝焼けに染まる構図。**鎧の緋縅 (赤い組紐) と背景の夕焼け・陣旗の赤が呼応**して、歴戦の老侍の世界観が完成する。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: §3 仕様書改訂議論を経て、本キャラは「若武者バージョン (前回生成版)」より「老侍バージョン (旧 §3)」のほうが**ストーリー上の多様性 (キャラ年齢層の幅)** に貢献するため、老侍を採用。
- 既存挿絵 (`public/avatars/chapters/chapter_18_*`) はこの老侍仕様で描かれている前提なので、**挿絵側は変更不要**。シナリオも維持で OK。
- 鎧の緋縅と背景の夕焼け・陣旗の赤が呼応する設計。

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
.avatar-sojiro {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-sojiro > .character {
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

最終更新: 2026-05-06 (老侍版で再生成・差し替え完了)
