# OPP15 風牙&雷牙 (Fuga & Raiga) — 神話の双子 DJ デュオ

> 「全周波数、把握済み」(風牙) / 「ビート、優位」(雷牙)
> ── 双子の声が完璧に重なる

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP15` |
| Slug | `fuga_raiga` |
| 名前 (日本語) | 風牙&雷牙 (フウガ・ライガ) |
| 名前 (英語) | Fuga & Raiga |
| 漢字キー | 風雷 |
| アーキタイプ (日本語) | 神話の双子 DJ デュオ |
| アーキタイプ (英語) | Twin-Deity Stage DJ Duo |
| 難易度レベル (Story Mode) | Lv.15 |
| 名言 (日本語) | 「全周波数、把握済み」(風牙) / 「ビート、優位」(雷牙) |
| 名言 (英語) | "All frequencies, comprehended." (Fuga) / "Beat, advantageous." (Raiga) |

## 旧キャラクターからの置換について

**OPP15 は 2026-05-13 に「サイバー斥候 シエル (Ciel)」から「神話の双子 DJ デュオ 風牙&雷牙 (Fuga & Raiga)」へ抜本リデザインされました**。理由:

1. 旧 Ciel は Zero (OPP20、サイバーハッカー) とアーキタイプが被っていた (両者ともサイバー系)
2. 物語上「Ch.20 Zero の予兆」となる立ち位置が、視覚的に同質すぎて読者の混同を招いた
3. リデザインで「神話 DJ デュオ vs サイバー隠者」「二人 vs 一人」「協調 vs 孤独」の対比軸を確立

旧 Ciel の画像は `public/avatars-old/opponents/OPP15_ciel.png` 等に退避済み。

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**物理的に独立した 2 体の双子兄弟**として描く (1 体に統合したデザインは Rev.1 で廃止済み)。

### 風牙 (Fuga) ── 左側、風の DJ

> A handsome young man, late 20s, NORMAL HUMAN SKIN tone. GREEN-GRAY medium-to-long hair flowing horizontally to the LEFT (perpetual wind effect). Glowing EMERALD GREEN eyes. Small slender HORN(s) on head (mythological accent). WHITE × NEON-GREEN × GOLD flowing stage outfit, long coat with chains and embroidery, glittery. Green-LED WIND-BAG-SHAPED HEADPHONES on both ears. Operating a WIND-BAG-SHAPED TURNTABLE/MIXER (Fūjin's wind sack reimagined as DJ equipment). Surrounded by green wind currents and SPARROWS flying. Cool, calm, observant smile.

### 雷牙 (Raiga) ── 右側、雷の DJ

> A handsome young man, late 20s ─ TWIN BROTHER of Fuga, same age, similar facial features but distinct hair color and outfit. NORMAL HUMAN SKIN tone. CRIMSON RED medium-to-long hair standing UP in spikes to the RIGHT (static electricity). Glowing ELECTRIC VIOLET eyes. Small thick curved HORN(s) on head. BLACK × CRIMSON RED × TIGER PATTERN × GOLD sharp stage outfit, dark long coat with chains, glittery. Violet-LED TAIKO-DRUM-SHAPED HEADPHONES on both ears. Holding TAIKO-DRUM-STICKS as DJ scratch batons. Surrounded by violet spider lightning and electric sparks. Confident, energetic smirk.

### コンポジション

二人は**側面に並び**、間に1〜1.5キャラ幅のギャップ。中央に**∞型の光るミキサー**。風牙の周囲は緑風とスズメ、雷牙の周囲は紫の稲妻とスパーク。**俵屋宗達の風神雷神図屏風**の原典通り、2 体の独立した神々の構図。

## 背景の世界観

**神話の円形 DJ ステージ**

ドーム天井: 左半は緑風オーロラ、右半は紫雷ストロボ、中央に光の境界線。円形 LED 床に緑紫グラデと∞シンボル。後方に風袋型スピーカー (左) と太鼓型スピーカー (右) のスタック。金細工のステージ縁にランタン。無限の暗紫色 void に浮遊。

背景画像は `background.png` (1024×1024 RGB) として同梱。`icon.png` (合成済み円形クロップ版) で最終的なゲーム内表示に最も近い見た目を確認できる。

## このキャラ固有の処理ノート

- **物理的に独立した 2 体ペア** が最重要。Rev.1 (1 体双面) は不気味の谷に陥ったため廃止
- 神格肌色は廃止 (両者とも普通の人間肌)
- 透過処理は **Python (PIL) で青背景 chroma key + デコンタミ処理** で実行 (Adobeでは鳥が消える問題があった)
- ヘッドフォン形状: 風牙=風袋型 / 雷牙=太鼓型 (両耳に同じ形)
- 角: 各キャラに小さな装飾的な角 (風牙=細長い1本、雷牙=太く曲がる1本)
- 周囲エフェクト: 風牙周辺は緑風とスズメ、雷牙周辺は紫の稲妻 (混在しない、各々独立)
- 視覚混同回避:
  - Zero (OPP20、サイバー隠者単体) との差別化: 双子 vs 一人、神話 vs サイバー、極彩色 vs 黒+シアン
  - Asahi (OPP03、双子の剣モチーフ) との差別化: 実際に2人 vs 単体 (剣はモチーフのみ)
  - Ichika (OPP01、アイドル) との差別化: DJ機材+双子 vs マイク+ピンク+単体

## 戦闘軸 (ストーリーテーマ)

- 「全周波数、把握済み」(風牙) / 「ビート、優位」(雷牙) ── 双子の声が完璧に重なる
- 蓮の応答: 「音は、踊り」「剣は、止まる」
- 戦闘軸: 風と雷の二重ビートで攻める vs 蓮の「型でも周波数でもない第三の何か」
- 物語上の位置: Ch.15 末で allies 幕間が発火、桜林の頂点に 5 達人が集まる
- Zero との対比: **二人 (Fuga & Raiga) vs 一人 (Zero)** = 協調 vs 孤独、人を踊らせる vs 人を計算する

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (双子両方が映る)。CSS/コードで背景と重ね合わせて使用 |
| `background.png` | PNG (RGB) | 1024×1024 | このキャラ専用の背景画像 (神話の円形 DJ ステージ、キャラ不在) |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済の最終アイコン (キャラ + 背景合成済み) |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

CSS 2 レイヤー合成例:

```css
.avatar-fuga_raiga {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-fuga_raiga > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

または事前合成済みの `icon.png` を直接 `<img>` で使えば 1 リクエストで済む。

## 透過処理について

このキャラの `character.png` は **Python (PIL) で青背景 chroma key + デコンタミネーション処理** によって透過化されている。

ChatGPT に「transparent background」を指定すると単色背景になるが、黒背景だと雷牙の黒衣装や髪の影が一緒に抜けてしまうため、**純青 (#0029f7) を背景色として生成依頼** → Python で B>200, R<30, B-R>150 をマスクして抜く方式を採用。エッジの青フリンジは「青の過剰分を引いて他の色を補う」デコンタミネーション処理で除去済み。

再生成依頼時の推奨ワークフロー:
1. ChatGPT に純青背景指定で再生成依頼
2. Claude (PIL) で青 chroma key + デコンタミ
3. 鳥や紫の稲妻などのディテールが保持されたか視覚確認

## 関連ドキュメント

- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1 STYLE
- §3 OPP ROSTER 全体: `MASTER_CHAR_INSTRUCTIONS.md` の §3
- 旧 OPP15 Ciel 仕様 (退避): `public/avatars-old/opponents/OPP15_ciel.png` 等

---

最終更新: 2026-05-13 (Rev.2 双子ペア版、ChatGPT 生成画像確定)
