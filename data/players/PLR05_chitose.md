# PLR05 千歳 (Chitose)

> 「これで何度目だっけ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR05` |
| Slug | `chitose` |
| 名前 (日本語) | 千歳 |
| 名前 (英語) | Chitose |
| アーキタイプ (日本語) | タイムリープ少女 |
| アーキタイプ (英語) | Time-Loop Girl |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリーアンロック制) |
| 名言 (日本語) | 「これで何度目だっけ」 |
| 名言 (英語) | "How many times have I done this now?" (TBD) |
| アンロック条件 | TBD |

## ⚠️ §2 PLR ROSTER との乖離 (2026-05-06 確認)

**重要**: §2 PLR ROSTER の旧記述は実画像と複数箇所で異なる。**実画像が一次情報源** (旧 v1 / Adobe v2 双方とも一貫して同デザイン)。**§2 側の書き換えが必要**。

| 項目 | §2 (旧記述) | 実画像 (確定 / GitHub 旧 512 + 新 v2 共通) |
|---|---|---|
| 髪 | Soft pastel hair (pink/lavender) | **長い銀/プラチナ髪** (ラベンダー光沢の差し色) |
| 制服 | casual school uniform | **濃紺セーラー服** + 白シャツ + 紺リボンタイ |
| 装飾 | Pocket watch / hourglass charm **optional** | **金縁の懐中時計が複数浮遊** (確定要素) |
| 瞳 | dreamy or wistful eyes | **薄紫の儚い瞳** (§2 と整合) |

PLR06 晴と同型の長年放置されていた仕様書バグ。

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**実画像準拠**。

> Long flowing **silver/platinum hair** (slightly wavy, with delicate **lavender/pale violet light reflections** in the highlights — gentle pastel undertone). Center parted, frames the face softly.
>
> **Soft violet/lilac eyes** with a wistful, slightly distant gaze (tinged with the melancholy of repeated time loops). Small, faint smile suggesting "I've seen this moment before."
>
> Young Japanese female appearance, mid-teens (15-17). Pale skin with subtle pink cheeks.
>
> **Outfit (Japanese sailor school uniform)**:
> - **DARK NAVY sailor flap collar** (V-shape, with two parallel white lining stripes)
> - **WHITE buttoned shirt** underneath (long sleeves)
> - **NAVY ribbon-tie** at the collar V-neck
>
> **Signature props**:
> - **TWO GOLDEN POCKET WATCHES** floating at her right side (different sizes — larger one upper, smaller below) — Roman numeral faces, ornate gold cases. The watches drift as if untethered by gravity, symbolizing her control/affliction over time.
>
> **Energy**: Quietly burdened. The youngest-looking among player avatars, but her eyes carry the weight of multiple lifetimes. Approachable but somehow distant — like meeting someone who already knows everything you're about to say.

## 背景の世界観

**砂時計の浮かぶ夕暮れ — 時間の海** (Floating hourglasses at twilight — the sea of time)

`background.png` (1024×1024 RGB) として同梱:

- 中心地平線に**柔らかい黄金の夕陽** (沈む or 昇るかは曖昧 = ループの示唆)
- 上空に**4 つの黄金の砂時計** (左右と中央付近、大小バラついて配置 — 時間が止まったり進んだりする示唆)
- **ピンク〜紫のラベンダー雲** がパステルグラデーション
- 下半分は**鏡のような水面** (空を反射、上下の境界が曖昧 = 時空の歪み)
- **桜の花びら** が複数舞い散り (はかなさの象徴)
- **金の光粒子・星屑** が空全体に拡散
- 全体パレット: 紫 + ピンク + 金 + 淡白
- 「時間がループする境界」の幻想的な空間

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**
> 🎯 旧 v1 の品質課題 (半透明 18.38% / 銀髪・白シャツの市松透け) を Adobe 再処理で完全解決

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 28.99% / 半透明 7.15% / 不透明 63.86%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / 砂時計の浮かぶ夕暮れ・時間の海) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル / §2 乖離訂正記載) |

### バージョン履歴

- **v1 (旧)**: 前々セッションで Claude flood-fill 処理 (半透明 **18.38% ⚠️** 銀髪・白シャツが市松透け、品質問題) — `_archive/PLR05_chitose_v1_floodfill_LEGACY.png` に温存
- **v2 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 **7.15%** = 神性発光範囲 4-10% 内、PLR01 英霊ハルキ 4.83% と同型) — **本確定版**

半透明 7.15% は「銀髪のハイライト・髪先のグラデーション・繊細なフェザリング」に自然分散しており、旧 v1 の「市松透け」異常値とは質的に異なる。視覚的には完全に不透明で、銀/白系統色キャラの正常範囲。

## 背景デザインの呼応 (キャラ ⇔ 背景)

- **金縁の懐中時計 ×2 (キャラ)** ⇔ **金の砂時計 ×4 (背景)** — 時間モチーフの完璧な装具呼応
- **銀/紫ラベンダー髪** ⇔ **紫・ピンクのパステル雲** — 髪色と空の主調色が同質
- **薄紫の瞳** ⇔ **紫雲のグラデーション** — 視線が空間に溶ける
- **儚い表情** ⇔ **境界の曖昧な水面** (上下反転で時空の歪み)
- **桜の浮遊感 (キャラの背後で kira kira)** ⇔ **舞う桜花びら (背景多数)** — はかなさの増幅
- **濃紺セーラー** ⇔ **黒紫の雲の影** — 暗色のアクセントで主体を引き立てる

「タイムリープ少女が時間の海に立つ」という構図 — 時間の象徴 (時計+砂時計) と無常の象徴 (桜) が二重の鏡像で配置されており、PLR ROSTER 中で最も詩的な背景連動。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | 砂時計の浮かぶ夕暮れ |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR05 デザイン記述 — **要書き換え**: 髪・制服・装飾の修正)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- 同型乖離事例: `../PLR06_haru/spec.md` (金の瞳・羽織なしの §2 乖離)
- 旧 v1 アーカイブ: `../_archive/PLR05_chitose_v1_floodfill_LEGACY.png`
- お手本: `../PLR01_haruki_heroic/spec.md`

---

最終更新: 2026-05-06 (Wave 2 PLR05 完成 — Adobe 再処理 v2 + 砂時計背景受領 + §2 乖離訂正、4/4 FINAL 達成 / 🎯 最優先課題解決)
