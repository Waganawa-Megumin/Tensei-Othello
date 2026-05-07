# PLR04 蓮 (Ren)

> 「正々堂々、参る」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR04` |
| Slug | `ren` |
| 名前 (日本語) | 蓮 |
| 名前 (英語) | Ren |
| アーキタイプ (日本語) | 剣道部主将 |
| アーキタイプ (英語) | Kendo Captain |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリーアンロック制) |
| 名言 (日本語) | 「正々堂々、参る」 |
| 名言 (英語) | "Fair and square — I am ready." (TBD) |
| アンロック条件 | TBD |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**実画像準拠** — §2 PLR ROSTER の "Bamboo sword (shinai) optional" は本キャラでは**確定要素**として採用。

> Short BLACK tousled hair (windswept top, slightly choppy front bangs that fall partially across the brow), warm BROWN eyes with a calm intense focus, faint composed expression — quiet determination of an athlete in 残心 (zanshin / lingering attention).
>
> Young Japanese male appearance, late teens (16-18). Sharp jawline, lightly tanned (training-tanned) skin tone.
>
> **Outfit (kendo gi)**:
> - White cotton **KENDOGI** (top jacket) with overlapping V-neck closure, slightly visible texture/folds
> - Black collar of inner shirt peeking out at neckline
> - Sleeves slightly rolled / disciplined fit
>
> **Hand props**: Carries a **SHINAI (bamboo sword)** resting across his right shoulder/back, visible diagonally behind him — the woven leather grips and bamboo segments clearly rendered, leather wrap (中結) and tip cap (先革) visible.
>
> **Energy**: Disciplined, dignified, ready. The kind of senior who bows deeply before every match. Not arrogant — but utterly prepared.

## 背景の世界観

**朝の道場 — 桜花びら舞う** (Morning dojo with cherry blossoms drifting)

`background.png` (1024×1024 RGB) として同梱:

- 中央奥に**伝統的な障子 (shoji 引き戸)** — 朝の光が乳白色に拡散して透ける
- 障子越しに**竹のシルエット** が透けて見える (静謐な裏庭の示唆)
- 左側に**竹刀立て (shinai-tate)** が縦に並び、複数の予備竹刀
- 右側に**水墨画の掛け軸** (竹墨絵) + その下に**桜の枝が活けられた壷**
- 床は伝統的な**畳 (tatami)** — 縁の細部まで描かれ、朝の斜光を反射
- 上部に**木の梁** + **欄間 (ranma) の格子細工**
- 空間全体に**桜の花びら** がふわふわと舞い込む (ピンクの差し色)
- **暖かい琥珀色 + 乳白色** の朝の光調

「試合前の静寂」「日常の鍛錬の場」「春の朝」が同時に込められた背景。

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 47.04% / 半透明 1.68% / 不透明 51.28%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / 朝の道場・桜花びら舞う) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル) |

### バージョン履歴

- **v1**: 前々セッションで Claude flood-fill 処理 (半透明 3.24% / v2 再生成版とラベル付されていた) — 旧版、本セッションで v3 に置換
- **v3 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 1.68%) — **本確定版** (シナイの段差・組紐・革巻きまで描写、剣道着の襟・袖の落ち感 Adobe 品質)

## 背景デザインの呼応 (キャラ ⇔ 背景)

- **白剣道着** ⇔ **障子の乳白色光** (清廉さの色彩統一)
- **黒髪 + 黒インナー** ⇔ **木の梁・木枠・水墨画** (落ち着いた木材の暗色)
- **竹刀** ⇔ **竹刀立て (背景左)** + **竹墨絵 (右掛け軸)** (キャラの武器が背景に複数の鏡像を持つ)
- **凛とした表情** ⇔ **舞い込む桜花びら** (動と静、武人と季節感)
- **真っ直ぐな立ち姿** ⇔ **障子の格子の縦線** (構図上の垂直軸の整合)

OPP18 宗次郎の侍背景 (赤い夕焼け陣旗) との対比軸として、**白朝陽**で剣道部の青年期を表現 — シリーズ通して「武の精神性の異なる時代/世代」を背景の色温度で語り分け。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | 朝の道場 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR04 デザイン記述の出典 — シナイ "optional" → 本キャラで確定要素化)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- 武の対比軸: `../../opponents/OPP18_sojiro/spec.md` (老侍・夕焼け) / `../../opponents/OPP19_arashi/spec.md` (竜騎士)
- お手本: `../PLR01_haruki_heroic/spec.md`

---

最終更新: 2026-05-06 (Wave 2 PLR04 完成 — character v3 + 朝の道場背景受領、4/4 FINAL 達成)
