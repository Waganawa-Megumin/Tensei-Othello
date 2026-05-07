# PLR03 リン (Rin)

> 「現実より、得意なんだ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR03` |
| Slug | `rin` |
| 名前 (日本語) | リン |
| 名前 (英語) | Rin |
| アーキタイプ (日本語) | VRMMO の最強プレイヤー |
| アーキタイプ (英語) | VRMMO Top Player |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリーアンロック制) |
| 名言 (日本語) | 「現実より、得意なんだ」 |
| 名言 (英語) | "I'm better here than in reality." (TBD) |
| アンロック条件 | TBD |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**実画像準拠**。§2 PLR ROSTER の "VR headset on neck/forehead" は実画像で **タクティカル風ゴーグル + ヘッドホンの 2 点セット** として実現されている。

> Short BROWN tousled hair (chin-length bob, slightly choppy / contemporary cut). DARK SLATE-BLUE / cool grey eyes with a confident sharp focus, faint composed smile.
>
> **Headgear (signature loadout)**:
> - **CYAN/TURQUOISE TACTICAL GOGGLES** pushed up onto forehead (large lenses with blue-tinted glass, black rubber frame, side strap visible) — VR/gamer signature
> - **CYAN HEADPHONES** worn over ears (over-ear style, glossy black housing with cyan accent rings, small purple omega-Ω style emblem on the visible earcup — clan/guild logo)
>
> **Outfit (modern gamer streetwear)**:
> - Inner: **BLACK high-collar tactical shirt** with small front zipper detail
> - Outer: **PURPLE/violet hooded vest/hoodie** (oversized, drawstrings visible, deep violet hue)
>
> **Energy**: Cool, calm, "I've cleared this raid 200 times" confidence. Not flashy — quietly dominant. The kind of player who logs in, taps three buttons, and the boss dies.

## 背景の世界観

**サイバー HUD 仮想空間** (Cyber / Virtual cityscape with HUD overlay)

`background.png` (1024×1024 RGB) として同梱:

- 中央奥に**ネオン光るホログラフィック都市** (青・シアン・ピンク・紫のグラデーション)
- **垂直に走るネオンライン** (左右の高層建築のシルエットを描画)
- 浮遊する**矩形 UI パネル** (左右に複数、薄い枠線とアイコン)
- 床面が**広大な格子グリッド** (奥行き透視で消失点へ収束)
- 中央床面に**プレイヤー位置を示す円形 HUD マーカー** (3 重リング、シアンと淡ピンクのグロー)
- 全体が **ネオンサイバーパンクパレット** (#7F4FFF 紫 + #00E5FF シアン + #FF3FA0 ピンク基調)
- 「キャラがここに出現する」という時間性 — まさに VRMMO ログイン直後のインターフェース感

## 🎨 アセット完成度

> **STATUS: FINAL ✅ — 4/4 完全形達成 (2026-05-06)**

| アセット | 状態 |
|---|---|
| `character.png` | ✅ FINAL (RGBA 1024×1024 / 透 38.57% / 半透明 1.71% / 不透明 59.72%) |
| `background.png` | ✅ FINAL (RGB 1024×1024 / サイバー HUD 仮想空間) |
| `icon.png` | ✅ FINAL (RGBA 1024×1024 / 円形クロップ合成済) |
| `spec.md` | ✅ FINAL (本ファイル) |

### バージョン履歴

- **v1**: 前々セッションで Claude flood-fill 処理 (半透明 0.90%) — 旧版、本セッションで v2 に置換
- **v2 (現)**: 2026-05-06 受領、Adobe 透過処理 (半透明 1.71%) — **本確定版** (シアンゴーグル+ヘッドホン+紫フードの完全装備)

## 背景デザインの呼応 (キャラ ⇔ 背景)

- **シアンゴーグル/ヘッドホン** ⇔ **シアン HUD グロー** (キャラの視界の延長 = HUD)
- **紫フード** ⇔ **紫ネオン都市** (環境同化のサイバー美学)
- **黒インナー** ⇔ **黒い夜空のグラデーション** (コントラストの基調)
- **冷静な表情 + 構図中央付き** ⇔ **円形プレイヤー HUD マーカー** (中心配置の整合)

ヘッドホンの紫 Ω エンブレム ⇔ 都市内のネオン UI アイコンと意匠統一。OPP 流の「キャラ装備と背景の双方向参照」に完全準拠。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 |
| `background.png` | PNG (RGB) | 1024×1024 | サイバー HUD 仮想空間 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

## 関連ドキュメント

- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` §1
- §2 PLR ROSTER: `MASTER_CHAR_INSTRUCTIONS.md` §2 (PLR03 デザイン記述の出典 — VR headset を実画像でゴーグル+ヘッドホンに具体化)
- 進捗: `progress_tracker_chars.md` / `PLR_ROADMAP.md`
- お手本: `../PLR01_haruki_heroic/spec.md` / `../PLR00_default/spec.md` / `../PLR02_mikoto/spec.md`

---

最終更新: 2026-05-06 (Wave 2 PLR03 完成 — character v2 + サイバー HUD 背景受領、4/4 FINAL 達成)
