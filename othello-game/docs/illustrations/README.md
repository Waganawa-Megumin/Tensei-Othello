# 挿絵制作ロードマップ

> **作品**: 転生したらオセロ世界でした！（Reincarnated as an Othello Player）  
> **包括リファレンス**: [`../illustration_brief.md`](../illustration_brief.md) ・ **プロジェクト**: [`../../README.md`](../../README.md)

優先度順の6ステップで挿絵を段階的に制作します。各ステップは独立して取り組めます。

## ステップ全体像

| Step | 制作物 | 枚数 | 推定 | 優先度 | リンク |
|---|---|---|---|---|---|
| **Step 1** | スタート画面 KV | 1 | 半日 | 🔴 最優先 | [step1_title_screen.md](./step1_title_screen.md) |
| **Step 2** | プロローグ + エンディング | 2 | 半日 | 🔴 高 | [step2_prologue_ending.md](./step2_prologue_ending.md) |
| **Step 3** | 第1章 + 第20章 | 2 | 半日 | 🟡 中 | [step3_chapters_first_last.md](./step3_chapters_first_last.md) |
| **Step 4** | 節目章（5/10/15） | 3 | 1日 | 🟡 中 | [step4_chapters_milestones.md](./step4_chapters_milestones.md) |
| **Step 5** | ナラティブ残り3枚 | 3 | 1日 | 🟢 余裕 | [step5_narrative_inserts.md](./step5_narrative_inserts.md) |
| **Step 6** | 残り15章 | 15 | 3〜5日 | 🟢 完成形 | [step6_remaining_chapters.md](./step6_remaining_chapters.md) |

合計 26 枚の新規制作。

## 推奨進行

**最低限**: Step 1 だけでも第一印象が一気に向上
**最小完成体験**: Step 1 + Step 2（物語の額縁が揃う）
**節目演出**: Step 1〜4（5章ごとに視覚的山場）
**完全版**: Step 1〜6（本格的なラノベ作品レベル）

各ステップは独立しているので、興味と時間に応じて好きな順で進められます。
ただし **Step 1 → 2 → 3 → 4 → 5 → 6** の順が、効果対労力比的に最適です。

## 共通リファレンス

詳細仕様・カラーパレット・全プロンプト集は
→ [`../illustration_brief.md`](../illustration_brief.md) を参照

## 完成時のファイル配置

```
public/
├── title-bg.png                          ← Step 1
├── avatars/
│   ├── 01_cheerful_swordsman.png         ✅ 完成済
│   ├── ...                               (20 files)
│   ├── players/
│   │   └── ...                           (20 files) ✅ 完成済
│   └── chapters/
│       ├── chapter_01_ichika.png         ← Step 3
│       ├── chapter_05_hibiki.png         ← Step 4
│       ├── chapter_10_shiki.png          ← Step 4
│       ├── chapter_15_ciel.png           ← Step 4
│       ├── chapter_20_zero.png           ← Step 3
│       └── (残り 15 files)               ← Step 6
└── illustrations/
    ├── prologue.png                      ← Step 2
    ├── solitude.png                      ← Step 5
    ├── allies.png                        ← Step 5
    ├── final.png                         ← Step 5
    └── ending.png                        ← Step 2
```

## 推奨ツール

| ツール | 強み | 適したステップ |
|---|---|---|
| **Niji 6 (Midjourney)** | ラノベ口絵調が標準 | Step 1, 2, 3, 4, 5, 6（万能） |
| **NovelAI v3** | 京アニ風が安定、表情コントロール | Step 3, 4, 6（章挿絵） |
| **Stable Diffusion XL + Anime LoRA** | 自由度最大、ControlNet | Step 1, 2（KV・口絵） |

**作画統一のコツ**: Step 3 の「いちか」を 3〜5 パターン生成してベストショットを「アンカー」として固定。Step 4, 6 で reference として使い回すと20章揃えても作画ブレなし。
