# Step 2 — プロローグ + エンディング挿絵

> **作品**: 転生したらオセロ世界でした！  
> **挿絵制作ロードマップの一部** ・ [全体目次](./README.md)


| 項目 | 値 |
|---|---|
| 制作枚数 | **2枚** |
| 推定時間 | 半日 |
| 優先度 | 🔴 高 |

---

## なぜここか

- ストーリーモードの「**始まりと終わり**」を絵で挟むと、ゲームが一気に物語化する
- 中身（章挿絵）が無くてもこの2枚だけで体験が締まる
- ゲームの世界観を補強する2枚

## 2-A. プロローグ画像

```
A teenage Japanese protagonist in a modern school uniform falling backward
through a dissolving classroom floor, expression of shock turning to wonder.
Below: a glowing infinite othello board portal opens. Stones rise around them.
Painterly anime light novel illustration, in the style of Kyoto Animation,
deep navy void with golden portal light, dramatic vertical motion blur, 16:9.
```

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| ファイル名 | `prologue.png` |
| 配置先 | `public/illustrations/prologue.png` |

## 2-B. エンディング画像

```
A teenage protagonist standing at the edge of a dissolving othello-board
world, looking back over their shoulder with a bittersweet smile and slight
tears in their eyes. Behind them, the 20 masters wave farewell, slowly
fading into golden particles of light. Ahead, a doorway of warm sunlight
leads back to a normal modern Japanese cityscape.
Painterly light novel epilogue art, in the style of Kyoto Animation, golden
hour with bittersweet emotion, 16:9.
```

| 項目 | 値 |
|---|---|
| 解像度 | 1920×1080 (16:9) |
| ファイル名 | `ending.png` |
| 配置先 | `public/illustrations/ending.png` |

## 2-C. ナラティブ表示モーダルの実装

`src/App.jsx` に新しい state と表示ロジックを追加：

### 1. NARRATIVE_INSERTS 定数を追加

```jsx
// インポート部分の近くに
const NARRATIVE_INSERTS = {
  prologue: { image: '/illustrations/prologue.png', text: STORY_INTRO },
  ending:   { image: '/illustrations/ending.png',   text: STORY_ENDING },
};
```

### 2. Othello コンポーネント内に state を追加

```jsx
const [narrative, setNarrative] = useState(null); // null | 'prologue' | 'ending'
```

### 3. プロローグ表示の useEffect

```jsx
// ストーリーモード開始時 + 進捗0
useEffect(() => {
  if (screen === 'game' && aiMode === 'story' && gameMode === 'ai' && storyProgress === 0 && kifu.length === 0) {
    setNarrative('prologue');
  }
}, [screen, aiMode, gameMode, storyProgress]);
```

### 4. エンディング表示の useEffect

```jsx
useEffect(() => {
  if (storyJustAdvanced && storyProgress >= 20) {
    setNarrative('ending');
  }
}, [storyJustAdvanced, storyProgress]);
```

### 5. レンダー部に追加（既存モーダル群の近くに）

```jsx
{narrative && (
  <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="max-w-3xl w-full">
      <img
        src={NARRATIVE_INSERTS[narrative].image}
        alt=""
        className="w-full rounded-sm shadow-2xl border border-amber-200/30"
      />
      <p className="jp-display text-amber-100/90 text-sm md:text-base mt-5 leading-relaxed whitespace-pre-line text-center">
        {NARRATIVE_INSERTS[narrative].text}
      </p>
      <div className="text-center mt-5">
        <button onClick={() => setNarrative(null)} className="btn">続ける</button>
      </div>
    </div>
  </div>
)}
```

## ✅ 完了基準

- [ ] ストーリーモード開始時に prologue が出る
- [ ] 第20章クリア時に ending が出る
- [ ] 「続ける」ボタンで閉じてゲームに戻れる

---

**前のステップ**: [Step 1 — スタート画面 KV](./step1_title_screen.md)
**次のステップ**: [Step 3 — 第1章・第20章 挿絵](./step3_chapters_first_last.md)
