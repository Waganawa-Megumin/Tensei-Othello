# PLR02 美琴 (Mikoto)

> 「論理と魔法は同じ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR02` |
| Slug | `mikoto` |
| 名前 (日本語) | 美琴 |
| 名前 (英語) | Mikoto |
| アーキタイプ (日本語) | 魔法学園の天才 |
| アーキタイプ (英語) | Magic Academy Prodigy |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリーアンロック制) |
| 名言 (日本語) | 「論理と魔法は同じ」 |
| 名言 (英語) | "Logic and magic are the same." (TBD) |
| アンロック条件 | TBD (ストーリー進行で 1 体ずつ解放を想定) |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**実画像準拠** — §2 PLR ROSTER の "school uniform layered with academic robe/cape" 記述は実画像で「金縁の学園制服 (アカデミック装飾は uniform に統合)」として実現されているため、本書の記述を一次情報源とする。

> Long flowing pure BLACK hair (slightly wavy, glossy), with side hair tied half-up into a high side bun-tail secured by a **bright BLUE RIBBON BOW** (signature accessory). Round/oval thin-framed GLASSES.
>
> **VIOLET/PURPLE eyes** with a calm, intelligent gaze, faint scholarly smile.
>
> **Outfit (academic uniform)**:
> - Dark navy/black blazer with **GOLD trim** along edges and lapels
> - **Bright BLUE inner-lining/lapel facing** (peeking out from front edges)
> - White collared shirt
> - **GOLDEN/yellow patterned tie** with subtle filigree (suggesting magical sigils)
>
> **Hand props**: Holding a thick, dark-bound **MAGICAL TOME** (黒革+金箔押し, decorated with a GOLD STAR/MAGIC SIGIL on the cover) — protectively against her chest.
>
> **Energy**: Studious prodigy. Quiet confidence. The kind of student who reads three books while everyone else struggles through one.

## 背景の世界観

**魔法学園の大聖堂図書館** (Cathedral library / Magic academy)

`background.png` (1024×1024 RGB) として同梱:

- 中央奥に**巨大ゴシック様式のステンドグラス窓** (青・紫・金の幾何学パターン、太陽光が差し込んで虹彩光に)
- 右側に**天井まで届く木製本棚** (魔法書がぎっしり、所々に蝋燭の灯)
- 左側に**蔓と紫の花** (魔法生命の象徴) + 燭台の蝋燭群
- 中央手前に**黄金の渾天儀 (armillary sphere)** + 椅子・机 (学術空間)
- **磨かれた大理石の床** に天体図・魔法陣のパターン
- 右下に**水晶玉** (占術器具)
- 全体が **青紫のクールな主調色 + 金の暖光** で、知性と神秘性を両立

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 29.06% / 半透明 2.25% / 不透明 68.69%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / 魔法学園の大聖堂図書館) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル) |

### バージョン履歴

- **v1**: 前々セッションで Claude flood-fill 処理 (半透明 1.10%) — 旧版、本セッションで v2 に置換
- **v2 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 2.25%) — **本確定版** (青リボン + 金縁制服でアカデミック調強化)

## 背景デザインの呼応 (キャラ ⇔ 背景)

- キャラの **黄金の魔法陣付タイ** ⇔ 背景の **黄金の渾天儀** (天体魔法のモチーフ統一)
- キャラの **青リボン** ⇔ 背景の **青紫ステンドグラス** (青系統色の呼応)
- キャラの **黒魔導書** ⇔ 背景の **本棚に並ぶ魔導書群** (学究空間の中の自然な配置感)
- キャラの **金縁制服** ⇔ 背景の **金の蝋燭光** (温度感の連続性)

OPP の「キャラ装備と背景の双方向参照」設計思想に PLR02 で初めて準拠 (HANDOFF_LETTER §1 設計仕掛け)。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | 魔法学園の大聖堂図書館 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR02 デザイン記述の出典 — ただし「academic robe/cape」は本キャラでは uniform に統合)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- お手本: `../PLR01_haruki_heroic/spec.md` / `../PLR00_default/spec.md`

---

最終更新: 2026-05-06 (Wave 2 PLR02 完成 — character v2 + 大聖堂図書館背景受領、4/4 FINAL 達成)
