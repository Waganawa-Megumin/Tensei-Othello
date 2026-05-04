# 🎯 Claude Code 引き継ぎ指示書 — デフォルト一本道のシナリオ&挿絵組み込み

> 対象リポジトリ: `Tensei-Othello/othello-game/`
> スコープ: **PLR00 デフォルト主人公 (固定) のストーリーモード一本道のみ**
> アンロック (PLR01〜20) は対象外。デフォルトが完成してから次フェーズで取り組む。
>
> 関連 Backlog: `BACKLOG.md` の P2「章ごとの本格的な物語・エピソード執筆」の正式実装。

---

## 📦 同梱物 (このパッケージの中身)

```
handoff_to_claudecode/
├── README_FOR_CLAUDECODE.md          ← この指示書 (まず読む)
├── scenario_source/                   ← シナリオ素材 (8 ファイル, ~4000 行)
│   ├── 00_WORLD_BIBLE.md             ← 世界観・トーン指針 (i18n方針もここ)
│   ├── 01_PLR00_main_story_part1.md  ← プロローグ + 第1〜5章
│   ├── 01_PLR00_main_story_part2.md  ← 第6〜10章
│   ├── 01_PLR00_main_story_part3.md  ← 第11〜15章
│   ├── 01_PLR00_main_story_part4.md  ← 第16〜20章 + 5ナラティブ + ED + Epilogue
│   ├── 02_chapter_lore_part1.md      ← 第1〜10章の街/達人プロフィール
│   ├── 02_chapter_lore_part2.md      ← 第11〜20章 + 伏線資料
│   └── 03_dynamic_gameplay_dialogue.md ← 全20章×10トリガーの動的セリフ
└── game_assets_to_place/              ← 挿絵 52枚 (横版+縦版ペア)
    ├── title-bg-{landscape|portrait}.png
    ├── illustrations/
    │   ├── prologue-{landscape|portrait}.png
    │   ├── ending-{landscape|portrait}.png
    │   ├── solitude-{landscape|portrait}.png
    │   ├── allies-{landscape|portrait}.png
    │   └── final-{landscape|portrait}.png
    └── avatars/chapters/
        ├── chapter_01_ichika-{landscape|portrait}.png
        ├── chapter_02_aoi-{landscape|portrait}.png
        └── ...chapter_20_zero-{landscape|portrait}.png
```

---

## ⚠️ 既存実装との不整合 (最初に把握する重要ポイント)

調査済み: 以下の差分があります。**既存コードを修正する**ことを前提に進めてください (素材のリネームではなく)。

### A) 画像ファイル命名の差分

| 項目 | 既存コード期待 | 同梱素材 | 対応方針 |
|---|---|---|---|
| タイトル背景 | `public/title-bg.png` (1枚, 未配置) | `title-bg-landscape.png` + `-portrait.png` (2枚) | コードを **横版/縦版ペア対応** に拡張 |
| 章背景 (`chapterArt`) | `public/avatars/opponents/chapters/OPP01_ichika_chapter.png` | `public/avatars/chapters/chapter_01_ichika-{LS\|PT}.png` | コードのパス生成を新形式に変更 |
| ナラティブ挿絵 | (未参照) | `public/illustrations/{prologue\|ending\|solitude\|allies\|final}-{LS\|PT}.png` | ナラティブ挿絵の表示機能を新規追加 |

### B) シナリオ構造の差分

| 項目 | 既存 `messages.ts` | 同梱シナリオ | 対応方針 |
|---|---|---|---|
| プロローグ | `storyIntro: string` (4行) | 完全版 (~30行 + i18n) | `storyIntro` を完全版に置き換え |
| 章セリフ | `storyChapters: string[]` (各章1行) | 4ブロック構造 (intro/boss_pre/boss_post/victory) | 構造を拡張 (BACKLOG に明記の通り) |
| エンディング | `storyEndingProse: string` (3行) | 完全版 + 達人19人お見送り | 拡張 |
| ナラティブ挿絵 | (なし) | solitude / allies / final テキスト3つ | 新規追加 |
| 動的ゲーム中セリフ | (なし) | 全20章×10トリガー | 新規追加 |

### C) 挿絵が横版+縦版ペアで提供される

各挿絵が画面の向きに合わせて切り替わる前提です。実装時は CSS メディアクエリ または React の `useMediaQuery` で出し分けてください:

```tsx
// 例: 推奨パターン
const isLandscape = useMediaQuery('(orientation: landscape)');
const titleBgSrc = isLandscape ? '/title-bg-landscape.png' : '/title-bg-portrait.png';
```

または背景画像の `<picture>` + `<source media>` でも可。

---

## 📋 タスク分割 (推奨実装順)

### 🟥 Task 1: アセットの配置 (5分)

`handoff_to_claudecode/game_assets_to_place/` の中身をリポジトリの `othello-game/public/` に**そのまま**コピー:

```bash
# リポジトリルートで実行
cp -r handoff_to_claudecode/game_assets_to_place/* othello-game/public/
```

確認:
```bash
ls othello-game/public/title-bg-*.png            # 2 枚
ls othello-game/public/illustrations/*.png        # 10 枚
ls othello-game/public/avatars/chapters/*.png    # 40 枚
# 合計 52 枚が配置されること
```

**コミット**: `feat(assets): place default-route illustrations (52 images)`

---

### 🟥 Task 2: i18n 構造の拡張 (`messages.ts`)

#### 2-1. 型定義の拡張

`src/i18n/messages.ts` の `interface Messages` に以下を追加:

```ts
// === 新規追加 ===

// 章ごとの構造化シナリオ (intro/boss_pre/boss_post/victory)
export interface ChapterStory {
  intro: string;       // 章導入ナレーション
  bossPre: string;     // 対局前の達人セリフ
  bossPost: string;    // 対局終了直後の主人公心の声
  victoryDialogue: string;  // 勝利時の達人セリフ
  victoryNarration: string; // 勝利後ナレーション (次章への橋渡し)
}

export interface NarrativeScene {
  title: string;
  text: string;
}

// プロローグ (タイトル画面のサブテキスト + 開始時のナレーション)
export interface PrologueContent {
  tagline: string;       // タイトル画面のキャッチコピー (「石をひっくり返せ。世界も、ひっくり返せ。」)
  subtitle: string;      // (「〜転生したらオセロ世界でした！〜」)
  startButton: string;   // (「異邦の打ち手として、はじめる」)
  text: string;          // 「序章: 放課後、世界が転換する」 本文
}

// 動的ゲームプレイセリフ (1章ぶん)
export interface ChapterDynamicLines {
  opener: string[];           // 1〜4手目あたり
  midNormal: string[];
  midWinning: string[];
  midLosing: string[];
  cornerTakenByPlayer: string[];
  cornerTakenByOpponent: string[];
  endgameClose: string[];
  endgameWinning: string[];
  endgameLosing: string[];
  finalMove: string[];
}

// 主人公の心の声 (キャラ問わず共通)
export interface ProtagonistInnerVoice {
  opening: string[];
  midgame: string[];
  endgame: string[];
  cornerTaken: string[];
  cornerLost: string[];
  bigFlip: string[];
  losing: string[];
  winning: string[];
  pass: string[];
  gameWon: string[];
  gameLost: string[];
}

interface Messages {
  // ... 既存のフィールド ...

  // === 新規追加 ===
  prologue: PrologueContent;
  chapterStories: readonly ChapterStory[];  // length === 20
  chapterDynamicLines: readonly ChapterDynamicLines[];  // length === 20
  protagonistInnerVoice: ProtagonistInnerVoice;
  narrative: {
    solitude: NarrativeScene;
    allies: NarrativeScene;
    final: NarrativeScene;
  };
  endingFull: NarrativeScene;        // 完全版エンディング
  epilogueHook: string;              // ニューゲーム+ への伏線 (アンロック実装時に使う)
}
```

#### 2-2. ja / en の中身を埋める

`scenario_source/01_PLR00_main_story_part1〜4.md` から **すべての `chapter01.intro` 形式のテキスト** を抽出して、上記構造に流し込む。

具体的なマッピング:
- `01_PLR00_main_story_part1.md` の `chapter01.intro` の **ja** ブロック → `messagesJa.chapterStories[0].intro`
- 同 **en** → `messagesEn.chapterStories[0].intro`
- 同様に `chapter01.boss_pre` → `chapterStories[0].bossPre`
- ...第20章 (`chapterStories[19]`) まで

ナラティブ・プロローグ・ED は part4.md 末尾。

**動的セリフ**は `03_dynamic_gameplay_dialogue.md` から:
- `chapter01.gameplay.opener.ichika.0`〜`.2` → `chapterDynamicLines[0].opener[0]〜[2]`
- 主人公心の声は同ファイルの「Part 1 — 共通プール」セクション → `protagonistInnerVoice`

> 💡 **作業効率**: `messages.ts` 追加分だけで 2000〜2500 行に達するため、`src/i18n/` 配下に分割推奨:
> ```
> src/i18n/
> ├── messages.ts          ← 既存の型定義 + 既存フィールドのまま
> ├── story/
> │   ├── ja.ts           ← 日本語のシナリオ全部
> │   ├── en.ts           ← 英語のシナリオ全部
> │   └── index.ts        ← Locale → Story 切替ヘルパー
> └── useLocale.ts        ← 既存
> ```

**既存の `storyIntro / storyEndingProse / storyChapters` は当面残す** (後方互換)。
新しい `prologue / chapterStories / endingFull` を**並行追加**して、UI 側で段階的に切り替える。
最終的に古い3つは削除する PR を別立てで出す。

**コミット**: `feat(i18n): add structured chapter stories + dynamic dialogue (default route)`

---

### 🟥 Task 3: ChapterArt のパス変更 + 横縦対応

#### 3-1. キャラデータのパス変更 (`src/App.tsx` 156〜175行付近)

```diff
- { kanji: '苺', name: 'いちか', ..., chapterArt: 'avatars/opponents/chapters/OPP01_ichika_chapter.png' },
+ { kanji: '苺', name: 'いちか', ..., chapterArtBase: 'avatars/chapters/chapter_01_ichika' },
```

`chapterArt: string` → `chapterArtBase: string` に名前変更し、拡張子と向きサフィックスは ChapterArt コンポーネント側で付ける。

20体すべてに対して変換:
- OPP01 ichika → `chapter_01_ichika`
- OPP02 aoi → `chapter_02_aoi`
- ...
- OPP20 zero → `chapter_20_zero`

#### 3-2. ChapterArt コンポーネントを横縦対応に (App.tsx 928〜940行)

```tsx
function ChapterArt({ srcBase, alt }: { srcBase?: string; alt: string }) {
  const [ok, setOk] = useState(true);
  const isLandscape = useMediaQuery('(orientation: landscape)');
  if (!srcBase || !ok) return null;
  const src = `/${srcBase}-${isLandscape ? 'landscape' : 'portrait'}.png`;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className={isLandscape
        ? "w-full aspect-[16/9] object-cover rounded-sm border border-amber-200/15 mb-3"
        : "w-full aspect-[9/16] object-cover rounded-sm border border-amber-200/15 mb-3"
      }
    />
  );
}
```

`useMediaQuery` フックは新規作成 (簡易実装):

```ts
// src/hooks/useMediaQuery.ts
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
```

**コミット**: `feat(art): wire up chapter art with landscape/portrait variants`

---

### 🟧 Task 4: 章ブラウザの拡張 (App.tsx 4189〜4236行付近)

#### 4-1. プロローグ表示を完全版に

```diff
- {storyProgress === 0 && cursor === 1 && (
-   <p className="...">{t.storyIntro}</p>
- )}
+ {storyProgress === 0 && cursor === 1 && (
+   <div className="...">
+     <PrologueIllustration />  {/* 新規: 横/縦の prologue.png を表示 */}
+     <p className="...">{t.prologue.text}</p>
+   </div>
+ )}
```

#### 4-2. 各章の表示を 4 ブロック構造に

`{t.storyChapters[cursor - 1]}` を以下に置き換え:

```tsx
const story = t.chapterStories[cursor - 1];
return (
  <div className="space-y-3">
    <p className="jp-display ... whitespace-pre-line">{story.intro}</p>
    <p className="jp-display italic text-amber-200/70 ...">「{story.bossPre}」</p>
  </div>
);
```

`bossPost` と `victory*` は **対局結果モーダル** で表示する (Task 5)。

#### 4-3. ナラティブ挿絵の挿入位置

シナリオには 5 つのナラティブ挿絵があり、各章の合間に表示する位置の推奨:

| 挿絵 | 表示タイミング |
|---|---|
| `prologue` | 章ブラウザの第1章の前 (上記 4-1) |
| `solitude` | 第10章クリア後の章遷移時 |
| `allies` | 第15章クリア後の章遷移時 |
| `final` | 第20章開始前 |
| `ending` | 第20章クリア後 (game-over modal 内) |

**コミット**: `feat(story): chapter browser shows full 4-block scenario + narrative inserts`

---

### 🟧 Task 5: 対局結果モーダルにストーリー要素を追加

第N章クリア時:
- **画面**: ChapterArt (該当章の挿絵) + 達人勝利セリフ (`victoryDialogue`) + 主人公心の声 (`bossPost`) + 次章への橋渡しナレーション (`victoryNarration`)
- **第20章クリア時**: さらに「Final ナラティブ」(`narrative.final`) → 「Ending」(`endingFull`) を順次表示

第N章敗北時:
- 励ましメッセージ (`storyEncouragement` を流用) + 達人ボイス
- 「もう一度」ボタンを目立つ位置に

**コミット**: `feat(story): game-over modal shows victory dialogue and narration`

---

### 🟦 Task 6: 動的ゲーム中セリフ (任意・ポリッシュ)

対局中、状況に応じて短いトーストでセリフ表示:

```tsx
// 例: 角を取った瞬間
function onCornerTaken(byPlayer: boolean) {
  const lines = byPlayer
    ? t.protagonistInnerVoice.cornerTaken
    : t.chapterDynamicLines[currentChapter - 1].cornerTakenByOpponent;
  showToast(pickRandom(lines), { duration: 2500 });
}
```

設計指針:
- 表示頻度を抑えて邪魔にならないように (例: 角取得時 80%, 序盤手番時 30%)
- 同じセリフを連続表示しないよう、最近表示分は数手スキップ
- 主人公心の声は画面下に半透明バナー (3 秒で消える)
- 相手キャラセリフはアバター横の吹き出し

**コミット**: `feat(story): in-game dynamic dialogue based on board state`

---

### 🟦 Task 7: タイトル画面の背景画像

`src/components/TitleScreen.tsx` に背景画像を入れる:

```tsx
function TitleScreen() {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const bgSrc = `/title-bg-${isLandscape ? 'landscape' : 'portrait'}.png`;
  return (
    <div
      className="..."
      style={{
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* タイトルテキスト・ボタン群 */}
      <h1>{t.prologue.tagline}</h1>
      <p>{t.prologue.subtitle}</p>
      <button>{t.prologue.startButton}</button>
    </div>
  );
}
```

**コミット**: `feat(title): wire up title-bg landscape/portrait`

---

## 🚫 やらないこと (スコープ外・明確な禁止事項)

- ❌ **PLR01〜PLR20 のアンロック実装** — 別フェーズで取り組む
- ❌ **アンロックキャラ用の画像生成・配置** — 同梱物に含まれていない
- ❌ **キャラ切替によるシナリオ分岐** — デフォルト一本道のみで動く設計に固定
- ❌ **既存の AI ロジック (`engine/`) の改変** — シナリオ統合のみ、AI は無関係
- ❌ **アバター選択で PLR00 以外を選べる UI 改変** — ストーリーモードでは PLR00 固定
- ❌ **`storyChapters[]` の即時削除** — 段階的に移行 (Task 2 注記参照)

---

## ✅ 完成判定

すべての PR がマージされて以下が成立すれば「デフォルト一本道完成」:

1. ✅ タイトル画面に `title-bg` が表示される (横/縦切替)
2. ✅ ストーリーモードを開始すると、章ブラウザにプロローグ全文 + プロローグ挿絵が表示
3. ✅ 各章のカードに横版/縦版自動切替の挿絵 + 4 ブロック構造の本文が表示
4. ✅ 対局終了時、勝利したら達人ボイス + 主人公心の声 + 次章への橋渡しナレーション
5. ✅ 第10/15章クリア時に solitude/allies の挿絵 + テキスト
6. ✅ 第20章開始前に final 挿絵
7. ✅ 第20章クリア時に達人19人お見送り + ending 挿絵 + 完全版 ending 本文
8. ✅ 日英切替で全シナリオが言語連動
9. ✅ (任意) 対局中の動的セリフが表示される

→ 完成すると、**「PLR00 ハルキの一本道ラノベ」として完結したゲーム体験**になる。アンロック実装の土台もできる。

---

## 📅 推奨スケジュール (1人 Claude Code セッション)

| 日 | タスク |
|---|---|
| Day 1 | Task 1 (アセット配置) + Task 2-1 (型定義) + Task 7 (タイトル) |
| Day 2 | Task 2-2 (ja/en 流し込み) ← 一番重い |
| Day 3 | Task 3 (ChapterArt) + Task 4 (章ブラウザ拡張) |
| Day 4 | Task 5 (game-over modal) + Task 6 (動的セリフ・任意) |

複数セッション並行なら Task を別ブランチで分割して、最後にマージ。

---

## 🔗 参考リソース (シナリオ設計の根拠)

- `scenario_source/00_WORLD_BIBLE.md` — トーン指針・i18n 方針・キャラ関係図
- `scenario_source/02_chapter_lore_part*.md` — 各キャラの口調・性格 (セリフ追加時の参照)
- `scenario_source/_TOC_default_route_complete.md` — 全シナリオ TOC

---

## 📞 質問・判断に迷ったとき

- **トーンの判断**: `00_WORLD_BIBLE.md` の「トーンの指針 (ラノベ調)」セクションに準拠
- **キャラ口調**: `02_chapter_lore_part*.md` の各キャラ「口癖」欄を参照
- **伏線の整合性**: `00_WORLD_BIBLE.md` の主要伏線マップ (A〜G) を確認
- **i18n 翻訳**: 直訳ではなくローカライズ。ラノベ翻訳のお作法 (`00_WORLD_BIBLE.md` 参照)

不明点が生じた場合は BACKLOG に「🟡 Question」エントリを追加して、決定を待つ運用にしてください。
