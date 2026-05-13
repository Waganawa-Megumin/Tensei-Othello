# OPP ROSTER — 対戦相手 20 体

ストーリーモードでは Lv.1 から Lv.20 まで順番に対戦する。フリーモードでは難易度のみ自由変更可能 (キャラはレベルに紐付き)。

| Lv | ID | 名前 | アーキタイプ | フォルダ | 名言 |
|---:|---|---|---|---|---|
| 1 | OPP01 | いちか (Ichika) | アイドル | [`OPP01_ichika/`](./OPP01_ichika/) | 「ふぁいとぉ♪ 楽しんで！」 |
| 2 | OPP02 | 葵 (Aoi) | 弓使い | [`OPP02_aoi/`](./OPP02_aoi/) | 「狙いはバッチリだよっ！」 |
| 3 | OPP03 | 朝日 (Asahi) | 剣士 | [`OPP03_asahi/`](./OPP03_asahi/) | 「いざ尋常に！」 |
| 4 | OPP04 | なでしこ (Nadeshiko) | 治療師 | [`OPP04_nadeshiko/`](./OPP04_nadeshiko/) | 「無理せずいきましょう」 |
| 5 | OPP05 | 響 (Hibiki) | 吟遊詩人 | [`OPP05_hibiki/`](./OPP05_hibiki/) | 「楽しい一局を奏でよう♪」 |
| 6 | OPP06 | つむぎ (Tsumugi) | 獣使い | [`OPP06_tsumugi/`](./OPP06_tsumugi/) | 「相棒もわくわくしてる」 |
| 7 | OPP07 | 茜 (Akane) | 技師 | [`OPP07_akane/`](./OPP07_akane/) | 「歯車みたいにかっちりね！」 |
| 8 | OPP08 | メル (Mel) | 錬金術師 | [`OPP08_mel/`](./OPP08_mel/) | 「ふふ、ちょっと混ぜてみよっか？」 |
| 9 | OPP09 | 悟 (Satoru) | 修行僧 | [`OPP09_satoru/`](./OPP09_satoru/) | 「無心に石を置く、ただそれだけ」 |
| 10 | OPP10 | シキ (Shiki) | 盗賊 | [`OPP10_shiki/`](./OPP10_shiki/) | 「気付いた時には遅いよ」 |
| 11 | OPP11 | シオン (Shion) | 魔術師 | [`OPP11_shion/`](./OPP11_shion/) | 「すべては予測の内だ」 |
| 12 | OPP12 | ルナ (Luna) | 夢の魔女 | [`OPP12_luna/`](./OPP12_luna/) | 「夢の中でもう勝ってるよ♡」 |
| 13 | OPP13 | 雪乃 (Yukino) | 学園軍師 | [`OPP13_yukino/`](./OPP13_yukino/) | 「この程度、解析するまでもない」 |
| 14 | OPP14 | アキラ (Akira) | 探偵 | [`OPP14_akira/`](./OPP14_akira/) | 「君の手筋、見えているよ」 |
| 15 | OPP15 | 風牙&雷牙 (Fuga & Raiga) | 神話の双子 DJ デュオ | [`OPP15_fuga_raiga/`](./OPP15_fuga_raiga/) | 「全周波数、把握済み」「ビート、優位」 |
| 16 | OPP16 | アリア (Aria) | 姫君 | [`OPP16_aria/`](./OPP16_aria/) | 「お手柔らかに、ですわ」 |
| 17 | OPP17 | レオン (Leon) | 騎士 | [`OPP17_leon/`](./OPP17_leon/) | 「正々堂々、参る！」 |
| 18 | OPP18 | 宗次郎 (Sojiro) | 侍 | [`OPP18_sojiro/`](./OPP18_sojiro/) | 「我が一刀、避けられはせぬ」 |
| 19 | OPP19 | 嵐 (Arashi) | 竜騎士 | [`OPP19_arashi/`](./OPP19_arashi/) | 「我が竜の前に膝を折れ！」 |
| 20 | OPP20 | ゼロ (Zero) — フード姿 (最終ボス) | ハッカー (最終ボス) | [`OPP20_zero/`](./OPP20_zero/) | 「全ての変分は計算済み。詰みだ」 |
| 21★ | OPP21 | ゼロ (Zero) — 現世帰還 (隠しキャラ) | 救済された旧ラスボス | [`OPP21_zero_unmasked/`](./OPP21_zero_unmasked/) | (アンロック条件: PLR01 で章 20 クリア) |

## 各キャラフォルダの中身

```
OPPxx_slug/
├── character.png   1024×1024 RGBA (透過済キャラ画像)
├── background.png  1024×1024 RGB  (背景画像)
├── icon.png        1024×1024 RGBA (円形クロップ済の合成アイコン)
└── spec.md         このキャラの仕様書
```

## 制作ノート

- 全 20 体の `character.png` は **Adobe Photoshop で透過処理済**
- 各キャラの `spec.md` の「キャラクターデザイン」は **実際に生成・承認された完成版画像に準拠** した記述
- 旧 `MASTER_CHAR_INSTRUCTIONS.md` 時点での §3 仕様書と異なる箇所がある場合、こちらが正
- 背景画像は全 20 体すべて重複なし (差分閾値 < 1.0 でチェック済)

## 統合先 (Claude Code 向け参考)

ゲームリポジトリ `Tensei-Othello` の `othello-game/public/avatars/` ディレクトリに統合する想定。既存の 256×256 簡易版アバターは `public/avatars-old/` 等にリネームして温存し、本ディレクトリ構造を新しい `public/avatars/opponents/` として配置することを推奨。

---

最終更新: 2026-05-13 (OPP15 リデザイン: シエル → 風牙&雷牙 神話の双子 DJ デュオ)
