# OPP20 ゼロ (Zero) — ハッカー (最終ボス)

> 「全ての変分は計算済み。詰みだ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP20` |
| Slug | `zero` |
| 名前 (日本語) | ゼロ |
| 名前 (英語) | Zero |
| 漢字キー | 零 |
| アーキタイプ (日本語) | ハッカー (最終ボス) |
| アーキタイプ (英語) | Hacker (Final Boss) |
| 難易度レベル (Story Mode) | Lv.20 |
| 名言 (日本語) | 「全ての変分は計算済み。詰みだ」 |
| 名言 (英語) | "All variations calculated. Checkmate." |
| アンロック | 最初から (フリーモード Lv.20 で選択可) |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Deep dark hood pulled up, OBSCURING most of the face in shadow. ONE visible eye glowing CYAN/AQUA bright (left eye), piercing through the hood shadow. The other eye and most of the face hidden in deep darkness under the hood. Silver / white hair partially visible at the front under the hood, framing the face. Dark cyber-mask covering the lower face (mouth/nose hidden) with subtle CYAN circuit lining. Black hooded cyberpunk cloak with elaborate CYAN/AQUA neon line patterns (circuit-like glowing tracings along the hood edges, shoulders, and chest). Dark inner robe with subtle code/data hexagonal patterns and binary text accents. A small floating BLACK othello stone (orb-like) hovering near one extended hand (palm up, gesturing to control the stone) with a CYAN halo of light around it. Mysterious, calculating, omnipotent presence. The supreme calculator who has transcended humanity.

## 背景の世界観

**コードの海・抽象空間 (グリーンマトリクスコードレイン)**

`background.png` (1024×1024 RGB) として同梱。Matrix 風のグリーンコードレインが縦に流れる暗いサイバースペース。**浮遊するオセロ盤と石が左右に配置**され、床にはグリッドと魔法陣風の円形パターンが奥行きを示す。中央が暗くなる構図のため、フード姿のキャラを合成しても視覚的に競合しない設計。**フードのシアン光と背景の緑コードのコントラスト**がラスボス感を強める。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: 世界観正本 (`master_world.md`) §5.3 に基づき、**OPP20 ゼロは「フード姿」をデフォルト・標準アバターとする**。あらゆるシーン (キャラ選択画面・ストーリー戦闘・フリー戦闘) でこのフード姿が表示される。
- 「フード無し版 (現世に戻った後の垢抜けたゼロ)」は別キャラ **OPP21** として独立管理される。詳細は `../OPP21_zero_unmasked/spec.md`。
- 章 20 勝利後の対話演出 (フードが落ちて素顔が現れる) は、**ストーリーモードのスクリプト演出**として一時的に OPP21 のアセットを呼び出す形で実装する。OPP20 のキャラ選択画面アバターはフード姿のまま据え置き。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (フード姿) |
| `background.png` | PNG (RGB) | 1024×1024 | グリーンマトリクスコードレイン背景 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-zero {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-zero > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

## 関連ドキュメント

- 世界観正本: `master_world.md` の §5.3
- ゼロのフード無し版 (OPP21 隠しキャラ): `../OPP21_zero_unmasked/spec.md`
- ヴォイドφ (OPP22 さらなる隠しボス): `../OPP22_voidphi/spec.md` (今後作成予定)
- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1
- 進捗トラッカー: `progress_tracker_chars.md`

---

最終更新: 2026-05-06 (OPP も 21 体管理に再構成。ゼロのデフォルトはフード姿に確定)
