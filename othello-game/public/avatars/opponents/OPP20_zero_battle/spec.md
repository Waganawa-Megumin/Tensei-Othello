# OPP20_zero_battle — フード姿ゼロ (戦闘モード専用アセット)

> 「全ての変分は計算済み。詰みだ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP20_battle` |
| Slug | `zero_battle` |
| 名前 (日本語) | ゼロ (戦闘モード) |
| 名前 (英語) | Zero (Battle Mode) |
| 漢字キー | 零 |
| アーキタイプ (日本語) | ハッカー (最終ボス・フード姿) |
| アーキタイプ (英語) | Hacker (Final Boss · Hooded) |
| 難易度レベル (Story Mode) | Lv.20 |
| 名言 (日本語) | 「全ての変分は計算済み。詰みだ」 |
| 名言 (英語) | "All variations calculated. Checkmate." |

## 用途と関連アセットとの関係

本作のラスボス・ゼロは**世界観上 5 段階のアーク**を持ち、シーンによって異なるアセットを使う:

| 段階 | シーン | 使用アセット |
|---|---|---|
| 1〜2 | 章 20 戦闘前/中 (PLR00〜PLR20 視点) | **本フォルダ (`OPP20_zero_battle/`) フード姿** |
| 3 | 章 20 勝利後の対話 (PLR00 視点) | `OPP20_zero/` (フード無し銀髪紫眼) |
| 4 | PLR01 英霊ハルキとの対峙 (戦闘+対話) | `OPP20_zero/` (フード無し)、本来の姿で対峙する演出 |
| 5 | エピローグ・現世帰還後 | (専用カット絵 = 別途制作予定: 垢抜けた現世のゼロ) |

## キャラクターデザイン (維持ポイント)

> Deep dark hood pulled up, OBSCURING most of the face in shadow. ONE visible eye glowing CYAN/AQUA bright (left eye), piercing through the hood shadow. The other eye and most of the face hidden in deep darkness under the hood. Silver / white hair partially visible at the front under the hood, framing the face. Dark cyber-mask covering the lower face (mouth/nose hidden) with subtle CYAN circuit lining. Black hooded cyberpunk cloak with elaborate CYAN/AQUA neon line patterns (circuit-like glowing tracings along the hood edges, shoulders, and chest). Dark inner robe with subtle code/data hexagonal patterns and binary text accents. A small floating BLACK othello stone (orb-like) hovering near one extended hand (palm up, gesturing to control the stone) with a CYAN halo of light around it. Mysterious, calculating, omnipotent presence. The supreme calculator who has transcended humanity.

## 背景の世界観

**コードの海・抽象空間 (グリーンマトリクスコードレイン版)**

`background.png` (1024×1024 RGB) として同梱。Matrix 風のグリーンコードレインが縦に流れる暗いサイバースペース。**浮遊するオセロ盤と石が左右に配置**され、床にはグリッドと魔法陣風の円形パターンが奥行きを示す。中央が暗くなる構図のため、フード姿のキャラを合成しても視覚的に競合しない設計。**フードのシアン光と背景の緑コードのコントラスト**がラスボス感を強める。

**本フォルダ専用の背景** であり、`OPP20_zero/` が持つ青紫寄りの背景とは別アセット。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: 世界観正本 (`master_world.md`) §5.3 で確定したゼロの 5 段階アークに基づき、戦闘モード専用アセットとして本フォルダを新設。受領・合成完了。
- 現アバター (`OPP20_zero/character.png`) のフード無し版は据え置き、勝利後の対話 + PLR01 英霊戦専用として活用。
- 章 20 戦闘画面の戦闘アバター UI は本フォルダ (`OPP20_zero_battle/icon.png`) を参照する実装が必要。
- 既存挿絵 (`public/avatars/chapters/chapter_20_*` LS/PT) はフード姿で描かれているため、戦闘モードと完全整合。挿絵側の変更不要。
- マスクとフードで顔の大半を硬いエッジで構成しているため、半透明領域 (アンチエイリアス) が他キャラより少なめ (0.52%)。これは仕様通りで問題なし。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (フード姿) |
| `background.png` | PNG (RGB) | 1024×1024 | グリーンマトリクスコードレイン背景 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-zero-battle {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-zero-battle > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

### Claude Code 側の実装ポイント

章 20 のシーン分岐 (例):

```ts
// 章 20 のシーンに応じてゼロのアバターを切り替える
const zeroAvatar = getZeroAvatarBySceneAndPlayer(currentScene, currentPlayer);

function getZeroAvatarBySceneAndPlayer(scene: Scene, player: Player): string {
  // PLR01 英霊ハルキとの対戦時は、戦闘中もフード無し版を使う特例
  if (player.id === 'PLR01') {
    return '/avatars/opponents/OPP20_zero/icon.png';
  }
  // それ以外のプレイヤーで戦闘中・戦闘前ならフード姿
  if (scene === 'battle' || scene === 'pre-battle') {
    return '/avatars/opponents/OPP20_zero_battle/icon.png';
  }
  // 章 20 勝利後の対話などはフード無し版
  return '/avatars/opponents/OPP20_zero/icon.png';
}
```

## 透過処理について

このキャラの `character.png` は **Adobe Photoshop で透過処理済**。Claude 側で行ったのはリサイズ・正規化・ファイル保存・合成プレビュー生成のみ。

## 関連ドキュメント

- 世界観正本: `master_world.md` の §5.3
- ゼロの通常 (フード無し) 版: `../OPP20_zero/spec.md`
- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1
- 進捗トラッカー: `progress_tracker_chars.md`

---

最終更新: 2026-05-06 (フード姿戦闘モード専用アセット、配置・合成完了)
