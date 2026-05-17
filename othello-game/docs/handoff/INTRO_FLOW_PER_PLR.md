# 各 PLR の Intro Flow 定義 ★ 必読

> ⚠️ **Claude Code への警告**: PLR04 の intro flow は **PLR02 / PLR03 と順序が異なります**。
> 機械的に PLR02/PLR03 を真似ると **PLR04 のストーリーが壊れます**。
> 必ずこのドキュメントを読んでから組み込んでください。

> **このドキュメントの位置づけ**: 各 PLR のハンドオフパッケージ
> (`PLR<NN>_HANDOFF.zip`) には**この MD ファイルを必ず同梱**します。
> 各 PLR の lap が default 5 ステップ順序のままなのか、固有の順序を
> 採るのかを Claude Code 側が判断する一次資料です。
> リポ側の正本は `othello-game/docs/handoff/INTRO_FLOW_PER_PLR.md`。

---

## 1. システム標準 intro flow (PLR02 / PLR03 / システムのデフォルト)

`src/i18n/story/types.ts` の `PrologueContent.imageBasePaths` で定義される **デフォルトの 5 ステップ順序** (= `introStepOrder: 'legacy'` または未指定):

```
Step 1: prologue        現世での日常〜召喚直前
Step 2: encount         次元の谷を落下 / 邂逅の瞬間
Step 3: arrival         異界 (盤上世界) に着地
Step 4: gatewayClosed   封印された門 (異界の試練の始まり)
Step 5: gatewayOpen     門が開かれる (戦闘への入口)
        ↓
Ch.1 OPP01 戦闘 (Ichika)
```

PLR02 美琴・PLR03 凛はこの順序。`encount` は「**召喚されて次元の谷を落下している瞬間**」を意味する。

---

## 2. PLR04 蓮 (Ren) の固有 intro flow ★ 重要

PLR04 蓮の物語は **`encount` の意味と配置が異なります** (= `introStepOrder: 'arrival-first'`):

```
Step 1: prologue        現世・無刀館で振り下ろし、月桂冠家紋
Step 2: arrival         ★ 異界の盤面屋外に片膝着地 (canonical「緑の盤面に着地」)
Step 3: gatewayClosed   朽ちた異世界道場、戸の向こうに正体不明の人影
Step 4: gatewayOpen     戸が爆散 (打突で破壊)、戸の向こうに Ch.1 ステージの予兆光
Step 5: encount         ★ Ch.1 Ichika 戦冒頭、円形ホールでアイドル Ichika と初対面
        ↓
Ch.1 OPP01 戦闘 (Ichika)
```

### 順序の違いまとめ

| Step | PLR02 / PLR03 標準 | PLR04 蓮 |
|:-:|---|---|
| 1 | prologue | prologue |
| 2 | encount (落下) | **arrival (盤面着地)** |
| 3 | arrival (着地) | **gatewayClosed (朽ちた道場で対峙)** |
| 4 | gatewayClosed (封印門) | **gatewayOpen (戸が爆散)** |
| 5 | gatewayOpen (開門) | **encount (Ch.1 Ichika 初対面)** |

PLR04 の物語的理由:
- 蓮は剣道家として「召喚されて落下する」のではなく、**最初から異界の盤面に立っている**
- 「異界での試練」が始まる場所 = 朽ちた異世界道場 (gatewayClosed/Open)
- 「encount」は**異界の最初の達人 (Ichika) との出会い** = Ch.1 戦闘の幕開け
- canonical (`ja_chapterStoriesByPlr.ts[3]` Ch.1 intro): 「緑の盤面に着地した蓮の前に、ピンクのスポットライトが降った」── これは Ch.1 = encount = Ichika 初対面の瞬間

---

## 3. シーン名 `encount` の意味の違い

| | PLR02 / PLR03 | PLR04 |
|---|---|---|
| 意味 | 次元の谷を**落下**する瞬間 (旧 `falling`) | **異界の最初の達人 (Ichika) との出会い (encounter)** |
| 場所 | 次元の谷 (空中、抽象的) | Ch.1 Ichika の円形ホール (屋内ステージ) |
| 直前のシーン | prologue | gatewayOpen |
| 直後のシーン | arrival | Ch.1 OPP01 戦闘画面 |

シーン名 `encount` は v0.36.64 で旧 `falling` から rename されたが、**各 PLR で意味が異なる**:
- PLR02/03: 文字通り「落下」 (旧 `falling` の意味そのまま、命名だけ更新)
- PLR04: 真の意味の「邂逅」 (敵との初対面、剣道家としての始まり)

---

## 4. リポジトリ実装時の注意点 ★ 必読

### `imageBasePaths[plrIdx]` の設定

PLR04 用に登録するパスは以下:

```typescript
/* [3] PLR04 ren */ {
  prologue:      'PLR04_ren/prologue',
  encount:       'PLR04_ren/encount',
  arrival:       'PLR04_ren/arrival',
  gatewayClosed: 'PLR04_ren/gateway-closed',
  gatewayOpen:   'PLR04_ren/gateway-open',
}
```

**パスの key は PLR02/03 と同じ** (5 つすべて使用)。何が違うかというと**画面遷移の順序**であり、これは `prologueByPlr[plrIdx].introStepOrder` で制御する。

### 画面遷移の実装確認ポイント

- [ ] PLR04 を選択した時の prologue → Ch.1 までの遷移が **prologue → arrival → gatewayClosed → gatewayOpen → encount → Ch.1 戦闘** の順になっているか
- [ ] PLR02/PLR03 を選択した時の遷移は従来通り **prologue → encount → arrival → gatewayClosed → gatewayOpen → Ch.1 戦闘** であるか (これは触らない)
- [ ] PLR04 の `prologueByPlr[3]` に `introStepOrder: 'arrival-first'` が設定されているか
- [ ] PLR02/03 (および将来 default 順を採る PLR) には `introStepOrder` を**設定しない** (省略 = `'legacy'`)

### 実装ハンドル: `PrologueContent.introStepOrder`

v0.36.72 で `src/i18n/story/types.ts` に `introStepOrder` フィールドを正式に追加済み。`IntroSequence.tsx` がこの値を見て step 配列を切り替える:

```typescript
// types.ts
export interface PrologueContent {
  // ...既存フィールド
  /** Per-PLR intro step ordering (v0.36.72).
   *  - 'legacy' (default): prologue → encount → arrival → gatewayClosed → gatewayOpen
   *  - 'arrival-first':    prologue → arrival → gatewayClosed → gatewayOpen → encount
   */
  introStepOrder?: 'legacy' | 'arrival-first';
}

// ja.ts / en.ts
prologueByPlr: {
  1: { /* PLR02 mikoto, introStepOrder 省略 = 'legacy' */ ... },
  2: { /* PLR03 rin,    introStepOrder 省略 = 'legacy' */ ... },
  3: {
    // ...他のフィールド
    introStepOrder: 'arrival-first',
  },
}
```

### もし将来の PLR が **既存の 2 種類のどちらにも当てはまらない順序**を要求した場合

その PLR のハンドオフ MD で順序を明示した上で、`introStepOrder` の enum を拡張するか、`introStepOrder?: ReadonlyArray<Step>` 型に切り替える PR を立てる。case-by-case で判断:

- 3 PLR 以上が同じ「default ではない」順序を要求 → 名前付き enum を追加 (例: `'gateway-first'`)
- 1 PLR だけの特殊順序 → そのままその PLR 用の enum を 1 個追加 (例: `'plr05-custom'`) か、配列ベースへの切替を検討

---

## 5. 動作確認のテストケース

PLR04 を実装した後、スマホで以下の順序で画面が遷移することを確認:

```
1. タイトル画面 → PLR04 蓮 選択
2. prologue 画面: 現世・無刀館 (蓮が振り下ろし、師範代後ろ姿、月桂冠家紋)
3. arrival 画面: 異界の盤面屋外 (片膝着地、夕焼け、桜爆発、石塔)
4. gateway-closed 画面: 朽ちた異世界道場 (戸の向こうに人影、中段の構え、月夜)
5. gateway-open 画面: 戸が爆散 (上昇渦、戸の向こうにピンク予兆光)
6. encount 画面: Ch.1 Ichika 円形ホール (ピンクスポット、ハートバルーン、深い一礼)
7. Ch.1 Ichika 戦闘画面 へ
```

PLR02 / PLR03 を選択した時は従来通り (5 ステップが標準順序):

```
1. PLR02 / PLR03 選択
2. prologue 画面
3. encount 画面 (次元の谷を落下)
4. arrival 画面 (異界着地)
5. gateway-closed 画面
6. gateway-open 画面
7. Ch.1 戦闘画面 へ
```

---

## 6. なぜこの違いを認識しないと壊れるか

PLR04 のシナリオは **Ch.1 Ichika の intro テキスト (`chapterStoriesByPlr[3][0].intro`)** が **encount シーンと同じ瞬間** を描いています:

> 緑の盤面に着地した蓮の前に、ピンクのスポットライトが降った。
> ハート型のバルーンが宙に浮き、観客席のない円形ホール。中央にオセロ盤。
> 最初の達人が、待っていた。
> (略)
> ピンクのツインテールのアイドル少女が、片目をウィンクして、マイクを差し出した。
> 蓮は深く一礼した。
> 「蓮です。正々堂々、お願いします」

つまり PLR04 では:
- **encount 画像** = Ch.1 Ichika 戦冒頭のシーン (画像+本文が同期)
- **Ch.1 intro テキスト** = encount シーンと同じ内容を文字で語る

これらが **同時に表示されることで物語が機能する**。もし `encount` を arrival の前に置いたら:
- encount 画像が「Ch.1 Ichika ホール」なのに、ストーリー上「まだ異界に着いていない」状態になる
- gatewayClosed / gatewayOpen を経た後で再び Ch.1 Ichika ホール (encount) に来るので、**蓮が同じ場所に2回到着する**奇妙なフローになる
- Ch.1 intro テキストが「最初の達人 Ichika」を語る時、画像との時系列が逆転している

これがシステムを壊さずとも**物語破綻**を起こす最大の理由。

---

## 7. まとめ

- [x] **PLR02 / PLR03**: システム標準 5 ステップ順序 (`prologue → encount → arrival → gatewayClosed → gatewayOpen`) = `introStepOrder` 省略 or `'legacy'`
- [x] **PLR04**: **固有順序** (`prologue → arrival → gatewayClosed → gatewayOpen → encount`) = `introStepOrder: 'arrival-first'`
- [x] `encount` の意味が PLR ごとに異なる (落下 vs 邂逅)
- [x] 実装ハンドルは `PrologueContent.introStepOrder` (v0.36.72+)
- [x] 各 PLR のハンドオフパッケージにこの MD と同形の `INTRO_FLOW_PER_PLR.md` を**必須同梱**
- [x] 動作確認は上記テストケース (節 5) で行う

---

## 8. 実装履歴

| バージョン | 変更 |
|---|---|
| v0.36.64 | `falling` → `encount` rename (シーン名のみ。順序は不変) |
| v0.36.71 | PLR04 lap 完成 — 18 挿絵 + 4 シナリオ (ja+en) を統合 |
| v0.36.72 | `PrologueContent.introStepOrder` 追加 / PLR04 を `'arrival-first'` に / firstTime gate を `'intro:gatewayOpen'` に変更 (Ch.1 勝利まで intro 再生) |
| v0.36.75 | (誤った修正) PLR02/PLR03 に `introStepOrder: 'prologue-only'` を設定 → intro chain が完全 skip され、ユーザー体験「呼び出されたら即戦闘」状態に。`'prologue-only'` enum 値は型に残置 |
| v0.36.76 | **revert**: PLR02/PLR03 の `'prologue-only'` 設定を削除 → 省略 (= `'legacy'`) に戻す。default 5-step chain が正規挙動であることを resolve.test.ts に regression guard として追加 (`introStepOrder === undefined` を assert)。教訓: ユーザー報告「序章から突然落下はおかしい」を narrative の rewind 問題と誤読し、intro chain 全 skip と過剰対応した。ChatGPT シナリオ監修側の意図は default 5-step を維持して個別シーンの内訳を整えることだった |
| v0.36.77 | **PLR03 リン を `'arrival-first'` に切替** (ユーザー指示)。PLR03 の encount 画像は「最初のボス (Ichika) との邂逅」を描いており、PLR04 蓮と同じ `prologue → arrival → gC → gO → encount → chapter` の流れが画像構図に合う。PLR02 美琴 は引き続き default `'legacy'`。テスト assert を `'arrival-first'` に更新 |
| v0.36.78 | **per-PLR co-located フォルダ構成へ refactor + `introTexts` スロット追加** (ユーザー指示「再発防止」)。 (A) 各 chain-step PLR を `src/i18n/story/plr/PLR0M_<slug>/{ja,en,index}.ts` の `PlrPackage` に co-locate (挿絵フォルダ `public/illustrations/PLR0M_<slug>/` と 1:1 名前対応)。root `ja.ts` / `en.ts` は薄いオーケストレータ (3781 行 → 913/917 行)。 (B) `PrologueContent.introTexts` (fallingVoice / arrivalText / gatewayClosedText / gatewayOpenText) を追加。4 つの intro screen は `prologue.introTexts?.X ?? t.intro.X` で per-PLR override → shared fallback。Phase A 単体では全 PLR の introTexts は未設定 (= ハルキ漏れは未修正、UI 不変)。後続の chat ターンで PLR02/PLR03 (任意で PLR04) の本文を author し、各 PLR の `prologue.introTexts` に埋める運用 |

## 8.1 教訓 — ユーザー報告の解釈は ChatGPT 監修と一緒に確認

「序章から突然落下はおかしい」というユーザー報告 (2026-05-14) は narrative
不整合ではなく、**intro chain そのものが PLR02/PLR03 で発火していなかった
過去状態を踏まえた、別の何か** (推測: 当時の archive scene が prologue
だけ表示してから「next」で intro:falling に飛ぶ繋ぎの違和感) を指して
いた可能性が高い。本来は ChatGPT シナリオ監修と意図を擦り合わせてから
コードを変更すべきだった。

今後は:
- 「intro flow / シーン回想」関連のユーザー報告は、修正を着手する前に
  `docs/handoff/INTRO_FLOW_PER_PLR.md` の Done Criteria (節 5) と
  突き合わせる
- 該当 PLR の `introStepOrder` を変更する PR は必ず Done Criteria の
  intro chain 並び (`prologue → encount → arrival → gC → gO` for
  PLR00/02/03, `prologue → arrival → gC → gO → encount` for PLR04) を
  満たすかチェックリスト形式で確認
