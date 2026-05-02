# オセロ — 盤上世界

ストーリーモード付きのオセロゲーム。Claude（Anthropic）と一緒に開発中。

## 起動方法

```bash
npm install
npm run dev
```

`http://localhost:5173` で開きます。

```bash
npm run build      # 本番ビルド (dist/)
npm run preview    # ビルド済みのプレビュー
```

## プロジェクト構成

```
othello-game/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── avatars/                    # 20体のキャラ画像 (256×256 PNG)
│       ├── 01_cheerful_swordsman.png
│       ├── 02_calm_mage.png
│       └── ... (20 files)
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # 全実装 (single file ~78 KB)
│   └── index.css                   # Tailwind imports
└── README.md
```

## 主要機能

### ゲームモード
- **ストーリーモード**: 第1〜20章を順番に攻略。各章ごとにキャラと難易度が固定。`window.localStorage` 互換の persistent storage で進捗保存（ブラウザだけで動く）
- **フリーモード**: 20体のキャラと20段階のレベルを自由に設定
- **二人対戦**: 黒・白それぞれにプレイヤーアバターを割り当て

### AI
- Lv.1–5: ランダム / 直接取れる枚数優先 (greedy)
- Lv.6–9: 隅・端・X-square を考慮した positional 評価
- Lv.10–14: 1–2 手の minimax + アルファベータ
- Lv.15–17: 3 手読み
- Lv.18–20: 4 手読み + mobility / disc-parity 評価

### UI
- 上部アイコンツールバー: メニュー / ヒント / 待った / 対局情報 / 新規対局 / 棋譜
- 盤面: A〜H × 1〜8 ラベル付き、最終手を赤丸表示、合法手にゴールドのドット
- 棋譜: 標準オセロ記法（c5 d6 など）で記録、保存・読込可能
- 対局情報モーダル: 現在の手数・残マス・両者の駒数・棋譜全文

## キャラクター

20体のコンピュータキャラ — RPG・アニメ風ファンタジー（剣士、魔術師、騎士、姫、忍、竜騎士、ハッカーなど多様）。詳細は `App.jsx` の `COMPUTERS` 配列を参照。

20体のプレイヤーキャラ — 京アニ風ライトノベル主人公アーキタイプ。現状 `image: null` で漢字フォールバック表示。生成画像を `public/avatars/players/` 等に配置して `AVATARS` 配列の image を `/avatars/players/xxx.png` に書き換えれば反映されます。

## 技術スタック

| 役割              | ライブラリ                           |
|-------------------|--------------------------------------|
| Build             | Vite 5                               |
| UI Framework      | React 18                             |
| Styling           | Tailwind CSS 3                       |
| Icons             | lucide-react                         |
| Persistent Storage | `window.localStorage` 互換 API       |

シングルファイル `App.jsx` に全実装が詰まっています（パターンとしては Anthropic Artifacts の制約に合わせた設計）。Claude Code で自由に分解・リファクタしてください。

## 改善アイデア

- [ ] プレイヤーアバター画像 20 体（京アニ風）を生成・統合 — `player_character_prompts.md` 参照
- [ ] 対局のサウンド（駒を置く音、勝利ファンファーレ）
- [ ] スマホ向け縦長レイアウトの最適化
- [ ] AI の評価関数を Edax 等の評価値テーブルで強化
- [ ] オンライン対戦（WebSocket / WebRTC）
- [ ] キャラのカード化／リスト化、勝率トラッキング
