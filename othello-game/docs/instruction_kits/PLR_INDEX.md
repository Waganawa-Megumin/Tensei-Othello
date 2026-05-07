# 🎮 Players (PLR) — アバターパッケージ INDEX

全 21 体プレイヤーアバターの一覧 + GitHub リポジトリ照合済 (2026-05-06)

## 🚨 構造的事実 (最重要)

**GitHub `othello-game/public/avatars/players/` の 2 種混在状態**:

| フォーマット | 構造 | 該当数 |
|---|---|---:|
| **新 (modular folder)** | `PLRxx_slug/` フォルダ + character.png (RGBA 1024² cutout) + background.png + icon.png + spec.md | **1 / 21** (PLR01のみ) |
| **旧 (flat composite)** | 単体 `PLRxx_slug.png` (RGBA 512² だが**透明 0% 不透明 100% で背景・円形クロップ焼き込み済**) | **20 / 21** |

**OPP 側は 22/22 全部新フォーマット**。PLR 側 20 体の新フォーマット移行 = 真のばらつき解消ターゲット。

## 進捗一覧 (GitHub 照合後)

| ID | Slug | 名前 | アセット | ステータス | メモ |
|---|---|---|---:|---|---|
| **PLR00** | `default` | **あなた** | **4/4** | **FINAL ✅** | **Wave 1 完成 (2026-05-06): キャラv2 + 教室夕焼け背景 + icon合成** |
| PLR01 | `haruki_heroic` | 英霊ハルキ | 4/4 | FINAL ✅ | **GitHubに新フォーマットで Phase 3 マージ済** |
| **PLR02** | `mikoto` | **美琴** | **4/4** | **FINAL ✅** | **Wave 2 完成 (2026-05-06): キャラv2 + 大聖堂図書館背景** |
| **PLR03** | `rin` | **リン** | **4/4** | **FINAL ✅** | **Wave 2 完成 (2026-05-06): キャラv2 + サイバーHUD背景** |
| **PLR04** | `ren` | **蓮** | **4/4** | **FINAL ✅** | **Wave 2 完成 (2026-05-06): キャラv3 + 朝の道場背景** |
| PLR05 | `chitose` | 千歳 ⚠️ | 2/4 ⚠️ | PARTIAL | **§2乖離は旧512版から一貫**(銀髪/桜が正) |
| **PLR06** | `haru` | **晴** | **4/4** | **FINAL ✅** | **Wave 2 完成 (2026-05-06): キャラv2 + 神社セイマン背景 + ⚠️§2乖離訂正** |
| **PLR07** | `kai` | **カイ** | **4/4** | **FINAL ✅** | **Wave 2 完成 (2026-05-06): キャラv2 + 雲海浮島背景** |
| **PLR08** | `chinatsu` | **千夏** | **4/4** | **FINAL ✅** | **🎯 Wave 2 完結 (2026-05-06): キャラv2 + 故郷の村と麦畑** |
| PLR09 | `toru` | 透 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR10 | `noa` | ノア | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR11 | `nagi` | 凪 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR12 | `el` | エル | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR13 | `sumire` | スミレ | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR14 | `hazuki` | 葉月 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR15 | `hayato` | 隼人 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR16 | `hikari` | ひかり | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR17 | `yoru` | ヨル | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR18 | `minato` | 湊 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR19 | `souta` | 奏太 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |
| PLR20 | `yu` | 悠 | 1/4 | LEGACY | GitHub旧512合成版のみ (新世代未制作) |

## ステータス凡例 (本書独自)

- **FINAL**: 新フォーマット 4 アセット完成 + GitHub マージ済
- **PARTIAL**: 新世代キャラ画像 (1024 RGBA cutout) は受領済、新世代背景 + icon + FINAL spec が未済
- **LEGACY**: GitHub 旧 512 合成版のみ存在、新世代制作未着手

## 集計 (新フォーマットへの移行進捗)

```
FINAL    (新4/4):  🏁 **21 / 21**  全 PLR 完成 100% 🎯
PARTIAL  (新2/4):    0 / 21
LEGACY   (旧1/4):    0 / 21
LEGACY   (旧1/4):  12 / 21  (PLR09-20)
─────────────────────────
新フォーマット完成度 (4/4 達成体数): 🏁 **21 / 21 (100%)**
新フォーマットファイル単位:        🏁 **84 / 84 (100%)**
(参考) GitHub 既存配置率:         21 / 21 (100%) — 旧形式での暫定運用は完了
```

## 各フォルダの構成

- `PLR00_default/`, `PLR02-08_*/`: `character.png` (新 1024) + `legacy_512.png` (GitHub 旧合成) + `spec.md` (ドラフト)
- `PLR01_haruki_heroic/`: `character.png` + `background.png` + `icon.png` + `spec.md` (FINAL, GitHub と同期済) + `spec.md.local_backup`
- `PLR09-20_*/`: `legacy_512.png` (GitHub 旧合成のみ) + `spec.md` (ドラフト)
- `_archive/`: 旧 PLR01_haruki (アイス剣・茶髪革ベスト版) を `LEGACY` サフィックス付きで温存

## 関連

- 統合ロードマップ: `../../handoff_to_new_chat/instruction_kits/PLR_ROADMAP.md`
- §2 PLR ROSTER (一部実画像と乖離あり): `../../handoff_to_new_chat/instruction_kits/MASTER_CHAR_INSTRUCTIONS.md`
- アーカイブ方針: `_archive/README.md`
- reference_originals (GitHub 旧 512 同期済): `../../handoff_to_new_chat/reference_originals/`

---

最終更新: 2026-05-06 (PLR17 = 17 / 21 FINAL / 91.7% / 後ろから連続4体、§2整合化リデザイン新サブカテゴリ初出)
