# OPP11 シオン (Shion) — 魔術師

> 「すべては予測の内だ」

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `OPP11` |
| Slug | `shion` |
| 名前 (日本語) | シオン |
| 名前 (英語) | Shion |
| 漢字キー | 詩 |
| アーキタイプ (日本語) | 魔術師 |
| アーキタイプ (英語) | Mage |
| 難易度レベル (Story Mode) | Lv.11 |
| 名言 (日本語) | 「すべては予測の内だ」 |
| 名言 (英語) | "All within my forecast." |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。

> Long **lavender / light purple hair** flowing past shoulders (CRITICAL: NOT dark navy, NOT silver — clearly lavender purple, matching the chapter illustrations).
>
> Violet eyes with **round-rimmed glasses** (thin gold frames, visible — matching the chapter illustrations).
>
> Large purple/navy WITCH HAT with elaborate gold crescent-moon and star ornaments. Red diamond gems both on the hat band (sparkling accent) and dangling from a thin gold chain at the hat brim.
>
> Dark navy/purple cloak with gold trim. Gold star pendant emblem on chest with small inset purple gem.
>
> Refined celestial mystic / astrologer-mage aesthetic. Calm confident expression with slight knowing smile.
>
> NOT holding a tome in this portrait (the chapter illustrations show her with a tome in study scenes; the avatar shows her free-handed bust composition).

## 背景の世界観

**天文塔・星空**

背景画像は `background.png` (1024×1024 RGB) として同梱。**帽子の三日月・星金装飾と背景の星座・夜空が呼応**する設計。ラベンダー髪と背景の青紫が美しく調和し、占星術師の世界観が完成する。

## このキャラ固有の処理ノート

- **2026-05-06 確定**: §3 仕様書改訂議論を経て、シオンは「暗紺髪・眼鏡なし (前回生成版)」を「**ラベンダー紫髪+丸眼鏡** (章別挿絵 chapter_11_* と完全整合)」に変更。当初は「髪色のみ変更」の最小修正案だったが、再生成時に眼鏡も追加することで挿絵とのマッチング度が大幅に向上した。
- 章別挿絵では古書を読む研究シーンとして描かれているが、portrait では古書を置いた状態として両立。
- 帽子の天体装飾と背景の星座が呼応する設計を維持。

## シオン × ルナ 姉妹設定 (要正式記録)

作者からの新情報: 本キャラ (Lv.11 シオン) と Lv.12 ルナ (夢の魔女) は**姉妹**。覚醒・夢・夜空・幻想という対称テーマ。シオンの紫髪化により、ルナ (薄紫ラベンダー) とのカラーリングがより自然なペアに見えるようになった。CLAUDE.md・§3 への正式記録は要作者判断。

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体。CSS/コードで背景と重ね合わせて使用 |
| `background.png` | PNG (RGB) | 1024×1024 | このキャラ専用の背景画像 |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済の最終アイコン (キャラ + 背景合成済み) |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-shion {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-shion > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

または事前合成済みの `icon.png` を直接 `<img>` で使えば 1 リクエストで済む。

## 透過処理について

このキャラの `character.png` は **Adobe Photoshop で透過処理済**。Claude 側で行ったのはリサイズ・正規化・ファイル保存・合成プレビュー生成のみ。再生成依頼時は外部で透過処理 → このディレクトリの `character.png` を上書き、という運用を維持してください。

## 関連ドキュメント

- 全 41 体共通のスタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1 STYLE
- §3 OPP ROSTER 全体: `MASTER_CHAR_INSTRUCTIONS.md` の §3
- 進捗トラッカー: `progress_tracker_chars.md` / `progress_tracker_bgs.md`
- 設定改変決定の経緯: `STORY_AND_ILLUSTRATION_REDESIGN_v2.md`

---

最終更新: 2026-05-06 (紫髪+眼鏡版で再生成・差し替え完了、章別挿絵と完全整合)
