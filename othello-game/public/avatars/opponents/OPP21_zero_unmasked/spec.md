# OPP21 ゼロ (Zero) — 現世帰還 (隠しキャラ)

> (名言は要決定 — 真エンディング後の彼を象徴するセリフ)

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP21` |
| Slug | `zero_unmasked` |
| 名前 (日本語) | ゼロ (現世帰還) |
| 名前 (英語) | Zero (Returned) |
| 漢字キー | 零 |
| アーキタイプ (日本語) | 救済された旧ラスボス |
| アーキタイプ (英語) | Redeemed Former Final Boss |
| 難易度レベル | Lv.21 (隠しキャラ) |
| 名言 (日本語) | (要決定) |
| 名言 (英語) | (TBD) |
| **アンロック条件** | **PLR01 英霊ハルキで章 20 をクリア (= 真エンディング達成)** |

## このキャラの位置付け

世界観正本 (`master_world.md`) §5.3 で確定したゼロの 5 段階アークの**段階 5: 現世帰還後の姿**。

**OPP20** (ラスボスのフード姿) を倒した先に、PLR01 英霊ハルキの存在によってゼロが現世に送り返され、**垢抜けて人間性を取り戻したゼロ**として独立した隠しキャラとなる。

### キャラ選択画面での表示

| 状態 | 表示 |
|---|---|
| 真エンディング未達成 | グリッド上で **`???` 表示** (CSS フィルタで黒塗り化、名前は伏せる) |
| 真エンディング達成後 | 通常表示 (アバターアイコン + 名前 + アーキタイプ) |

CSS フィルタの実装例 (案):

```css
.avatar-locked {
  filter: brightness(0) opacity(0.6);
  position: relative;
}
.avatar-locked::after {
  content: "???";
  color: white;
  font-size: 2em;
  font-weight: bold;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: none;
}
```

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Silver/white tousled hair (NO HOOD UP — face fully visible), violet eyes (BOTH visible — NOT a single cyan-glowing eye), playful confident smirk with hand near hair, TWO PAIRS of large headphones (one set worn on head, second set worn around neck) with cyan circular displays, black cyberpunk jacket with bright purple and cyan neon accents, hood-down on a high-collar hoodie. Cool playful hacker aesthetic — the human Zero who has been redeemed and returned to the modern world.

## 背景の世界観

**現代日本の街中・夕暮れ (黄昏時の住宅街)**

`background.png` (1024×1024 RGB) として同梱。新海誠的な大気感を持つ日本の街並み:
- 桜の木+街灯+ベンチ (左側、暖色のノスタルジー演出)
- 商店街+電柱+電線+自販機 (右側、現代日本の生活感)
- 中央の道路は中央が空いた構図でキャラ合成可能
- 黄昏のオレンジ・ピンク・パステル空+暖色ライティング
- 落ちる花びらと光のフレア

**真エンディング演出のカット絵としても兼用**: PLR01 英霊ハルキで章 20 をクリアした後、フードが落ちたゼロが現世に送り返される演出で、この背景画像をフルスクリーン表示することで「ゼロが帰還した」感を最大化できる。

紫サイバージャケットと夕焼けオレンジが**補色関係**で美しく調和し、「サイバー世界 → 現実世界への帰還」という対比を視覚化する設計。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: 世界観正本に基づき、ゼロのアセットを 2 キャラに分離。フード姿 = OPP20 (標準ラスボス)、フード無し = OPP21 (真エンディング達成後の隠しキャラ)。
- **背景は受領完了** (2026-05-06)、現代日本の夕暮れの街並み、新海誠的タッチ。
- アンロック前のキャラ選択画面では CSS フィルタで `???` 表示。アセット側に黒塗り版を作る必要なし。
- 真エンディング演出のシーケンス:
  1. PLR01 英霊ハルキで章 20 戦闘 → 勝利
  2. フード姿 (OPP20) からフードが落ちる演出 → フード無し顔露呈
  3. **`OPP21_zero_unmasked/background.png` のフルスクリーン表示** で現世帰還を表現
  4. **OPP21 アンロック完了通知** → フリーモードで Lv.21 の隠しキャラとして選択可能になる
- ヴォイドφ (OPP22) はさらに後に解放されるさらなる隠しボス。詳細は `master_world.md` §5.4。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (フード無し) |
| `background.png` | PNG (RGB) | 1024×1024 | 現代日本の街中・夕暮れ |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-zero-unmasked {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-zero-unmasked > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

## 関連ドキュメント

- 世界観正本: `master_world.md` の §5.3 (ゼロの 5 段階アーク)
- ゼロのフード姿 (OPP20 標準ラスボス): `../OPP20_zero/spec.md`
- ヴォイドφ (OPP22 さらなる隠しボス): `../OPP22_voidphi/spec.md` (今後作成予定)

---

最終更新: 2026-05-06 (背景配置完了、現代日本の街中・夕暮れ採用)
