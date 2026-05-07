# PLR00 あなた (You)

> 「いざ、参る」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR00` |
| Slug | `default` |
| 名前 (日本語) | あなた |
| 名前 (英語) | You |
| 漢字キー | 春 (春樹の「春」) |
| アーキタイプ (日本語) | 盤上世界の旅人 |
| アーキタイプ (英語) | Traveler of Bansho Sekai |
| 用途 | **デフォルトプレイヤーアバター** (最初から選択可、ストーリーモードの主人公) |
| 名言 (日本語) | 「いざ、参る」 |
| 名言 (英語) | "Then, I will go." (TBD: 確定要協議) |
| アンロック条件 | デフォルト (最初から) |

## このキャラの位置付け

世界観正本 (`master_world.md`) に基づく PLR 階層構造:

> **PLR00 ハルキ** = 現代日本の高校生、デフォルトの主人公アバター。盤上世界に召喚される直前の「現世」の姿。
> **PLR01 ハルキ (英霊)** = PLR00 の未来形。20 章を勝ち抜いて現世に戻り、さらに後の世界線で英霊化された姿。

### 三部作の起点 (構図の一貫性)

PLR00 の背景 (教室の窓辺・夕焼け) は、ゲーム後半の真エンディング演出と視覚的に呼応する三部作構成の**起点**:

```
[PLR00] 現世 (教室の窓辺・夕焼け)              ← ここから召喚される
   ↓
[PLR01] 遷移空間 (緑コードレイン+金光柱+桜)    ← 章 20-B 真エンディング
   ↓
[OPP21] 現世帰還 (現代日本の街角・夕暮れ)      ← 章 20-C エピローグ
```

3 つともが「夕暮れ・暖色系・日常への帰還」のモチーフで一貫している。

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**必ずこの記述を ChatGPT 発注プロンプトの "CRITICAL — character must EXACTLY match" セクションに反映する**。

> Black tousled anime hair (slightly windswept, with subtle warm brown highlights catching the light at the tips), warm brown eyes, gentle smile suggesting quiet determination, dark navy school jacket (gakuran) with mandarin/standing collar buttoned at neck — **visible brass buttons** at the collar closure, white shirt collar peeking out at the neckline. Approachable everyman aesthetic — a contemporary Japanese high schooler before being summoned to Bansho Sekai. Late teens (16-18). Soft front lighting, subtle warm tones suggesting "hour of departure."

## 背景の世界観

**教室の窓辺・夕焼け** (Classroom window at sunset / golden hour)

`background.png` (1024×1024 RGB) として同梱:

- 大きな引き違いのアルミサッシ窓越しに広がる**夕焼けの空** (朱・桃・金の暖色グラデーション)
- 風に揺れる**白い半透明カーテン** (左側、奥行き表現)
- 窓の外に**茂る緑樹** (右側、葉の隙間に夕陽が透ける = 木漏れ日効果)
- 左壁に**コルクボードの掲示物** (学校の公式書類風 — 教室であることの記号)
- 手前に**学校机の角** + 左下に **椅子の脚** (主人公が席についていた示唆)
- 全体が**暖かい琥珀色の斜光**で包まれる新海誠調

「召喚される直前、放課後の何気ない瞬間」という時間性を捉えた背景。

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 47.44% / 半透明 1.69% / 不透明 50.87%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / 教室窓辺・夕焼け) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル) |

### バージョン履歴

- **v1 (旧)**: 前々セッションで Claude flood-fill アルゴリズムで透過処理 (半透明 2.38%、softer edge) — `_archive/` 行きで温存推奨 (v2 で完全置換)
- **v2 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 1.31%、Adobe らしい硬質エッジ) — **本確定版**

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | 教室窓辺夕焼け背景 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考、PLR01 と同型)

```css
.avatar-default {{
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}}
.avatar-default > .character {{
  background-image: url('./character.png');
  background-size: cover;
}}
```

### Claude Code 側の実装ポイント

```ts
// PLR00 はデフォルトアバター、無条件で利用可能
function isPLR00Available(): boolean {{
  return true;
}}
```

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR00 デザイン記述の出典)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- 世界観正本: `master_world.md`
- 三部作の対: `../PLR01_haruki_heroic/spec.md` (英霊化形態) / `../../opponents/OPP21_zero_unmasked/spec.md` (現世帰還ゼロ)

---

最終更新: 2026-05-06 (Wave 1 完成 — character v2 + background 受領、4/4 FINAL 達成)
