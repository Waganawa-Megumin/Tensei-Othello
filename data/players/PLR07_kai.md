# PLR07 カイ (Kai)

> 「風が呼んでる」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR07` |
| Slug | `kai` |
| 名前 (日本語) | カイ |
| 名前 (英語) | Kai |
| アーキタイプ (日本語) | 空の冒険者 |
| アーキタイプ (英語) | Sky Adventurer |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリーアンロック制) |
| 名言 (日本語) | 「風が呼んでる」 |
| 名言 (英語) | "The wind's calling me." (TBD) |
| アンロック条件 | TBD |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**実画像準拠** — §2 PLR ROSTER と全項目一致 (青マフラーのみ §2 未記載の追加要素)。

> Wind-tousled SANDY/WHEAT BLONDE hair (slightly choppy, windswept upward and to the side as if perpetually in motion). Bright **VIVID BLUE eyes** (clear sky blue), spirited and confident. Free-spirited slight grin — the kind of look someone wears when there's nothing but open horizon ahead.
>
> Young Japanese male appearance, late teens (16-18). Lightly sun-kissed complexion (an outdoorsman's skin tone).
>
> **Headgear (signature loadout)**:
> - **VINTAGE PILOT GOGGLES** pushed up onto forehead (large round lenses with **blue-tinted glass**, ornate **BRASS-and-leather frame**, leather strap visible behind head — classic WWI/WWII flight aesthetic)
>
> **Outfit (sky adventurer / aviator)**:
> - **BROWN BOMBER JACKET** with thick **CREAM-COLORED SHEARLING/SHERPA collar** lining (warm protection against high-altitude cold)
> - **WHITE inner shirt** visible at the neckline
> - **BLUE SCARF** (signature accessory, NOT in §2) — knotted at the left shoulder, ends fluttering as if always caught in wind
>
> **Energy**: Open-skies optimism. The kind of person who answers "where are you going?" with "wherever the wind takes me." Adventurous but warm — not reckless. The friend who says "let's just go."

## 背景の世界観

**雲海と浮島 — 黄金の太陽光に照らされる空の領域** (Sea of clouds with floating sky islands at golden hour)

`background.png` (1024×1024 RGB) として同梱:

- 中央地平線に**輝く太陽** — 強い金色の光柱が空全体に放射
- 上空の青空に**5 つの浮島 (sky islands)** が漂う (両側に大、中央寄りに小、底面から**滝のように水が落下** — クラシック・ファンタジー / 天空の城 motif)
- 中景・近景に**柔らかい白雲が幾重にも重なる**雲海
- 上半分の空が**澄んだ青** + 下半分が**金の暖光に染まる雲海**
- 右側に**飛ぶ鳥のシルエット** (自由・冒険の象徴)
- 太陽からの**光線 (radial light rays)** が雲を貫いて画面下部に伸びる
- 全体パレット: **空の青 + 黄金 + クリーム白** = 開放・希望・冒険の三和音

「キャラがちょうどここに飛び出したばかり」「空の上にもうひとつの世界がある」感覚を凝縮。

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 40.25% / 半透明 2.13% / 不透明 57.62%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / 雲海と浮島・黄金の太陽光) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル) |

### バージョン履歴

- **v1**: 前々セッションで Claude flood-fill 処理 (半透明 1.64%) — 旧版、本セッションで v2 に置換
- **v2 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 2.13%) — **本確定版** (シーパロカラー+真鍮ゴーグルの精細描写)

## 背景デザインの呼応 (キャラ ⇔ 背景)

- **金髪** ⇔ **黄金の太陽光・雲の暖光ハイライト** — 同色系のメインアクセント
- **青い瞳 + 青マフラー** ⇔ **青空 + 雲の影の冷色** — 視線と空が同化
- **ヴィンテージゴーグル** ⇔ **空を眺める視覚装具と背景の空** — 装具と環境の自然な意味的接続
- **茶のボンバージャケット** ⇔ **茶色の浮島の岩肌** — 暖色アクセントの配置呼応
- **風で揺れる髪・揺れるマフラーの結び目** ⇔ **滝のしぶき・流れる雲** — 風の動的表現の同期
- **自由な笑顔** ⇔ **飛ぶ鳥・開けた地平線** — 精神性の空間化

PLR04 蓮 (朝の道場・閉じた室内) と対極的に、PLR07 は**完全に開放空間**で構成 — 武人 (内的鍛錬) vs 冒険者 (外的探究) の対比軸が背景設計で明確化。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | 雲海と浮島 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR07 デザイン記述の出典 — 青マフラーが追加要素)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- 対比軸: `../PLR04_ren/spec.md` (剣道部主将・閉じた道場) — 内/外、静/動の対比
- お手本: `../PLR01_haruki_heroic/spec.md`

---

最終更新: 2026-05-06 (Wave 2 PLR07 完成 — character v2 + 雲海浮島背景受領、4/4 FINAL 達成)
