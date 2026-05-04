# 🎮 動的ゲームプレイセリフ集 / Dynamic In-Game Dialogue
## (着手・中盤・終盤の採り話 / Opening, Mid-Game, End-Game banter)

> 各章の対局**プレイ中**に、状況に応じてランダム表示される短いセリフ集。
> 「**ゲーム盤面の状況に反応する達人 + 主人公の心の声**」で、対局の臨場感を爆増させる。
> i18n 対応 (ja/en ペア)。
>
> ---
>
> **トリガーの条件分類:**
>
> | トリガー | 発生条件 |
> |---|---|
> | `opener` | 対局開始 1〜4手目あたり |
> | `mid_normal` | 中盤 (10〜30手目) で接戦時 |
> | `mid_winning` | 中盤、自分 (主人公) 優勢時 |
> | `mid_losing` | 中盤、自分劣勢時 |
> | `corner_taken_by_player` | プレイヤーが角を取った瞬間 |
> | `corner_taken_by_opponent` | 達人が角を取った瞬間 |
> | `endgame_close` | 終盤、接戦 (差±3以内) |
> | `endgame_winning` | 終盤、優勢 |
> | `endgame_losing` | 終盤、劣勢 |
> | `final_move` | 最終手 |
>
> 各章のキャラ口調を尊重しつつ、**ハルキの心の声**は常にツッコミ役。
> セリフはどれも**1〜2文の短文**で、対局を妨げない長さ。

---

## 第1章 / Chapter 1 — いちか

### `chapter01.gameplay`

#### `opener.ichika.0`
**ja**: いちか「最初は **角を狙う**って、ハルキくん…**意外と王道派**？♪」
**en**: Ichika: "Going for the **corner first** — Haruki... you're **surprisingly textbook**, huh? ♪"

#### `opener.ichika.1`
**ja**: いちか「えへへ、わたし**白がラッキーカラー**なんだ♪」
**en**: Ichika: "Heehee, **white is my lucky color** ♪"

#### `opener.haruki.0`
**ja**: ハルキ（**スポットライトが眩しい**。集中できない…！）
**en**: Haruki: *(The **spotlight is blinding**. Can't focus...!)*

---

#### `mid_normal.ichika.0`
**ja**: いちか「うんうん、**いい勝負だね**♪ ドキドキしちゃう♡」
**en**: Ichika: "Mhm, mhm — **what a great match**! ♪ My heart is racing ♡"

#### `mid_normal.ichika.1`
**ja**: いちか「**観客がいたら盛り上がるのに**ね〜♪」
**en**: Ichika: "If only **we had an audience** — they'd love this! ♪"

#### `mid_winning.ichika.0`
**ja**: いちか「あれ？ ハルキくん、**強い**…♪ うふふ、ますます好きになっちゃう♡」
**en**: Ichika: "Huh? Haruki, you're **really strong**... ♪ Heehee, I'm gonna fall for you even more ♡"

#### `mid_losing.ichika.0`
**ja**: いちか「むむっ、まだ負けないよ〜！ **アイドルの意地**、見せちゃうから♪」
**en**: Ichika: "Hmph! I'm not losing yet! I'll show you **an idol's pride**! ♪"

---

#### `corner_taken_by_player.ichika.0`
**ja**: いちか「**角ぅ！？** むーっ、油断したぁ…！」
**en**: Ichika: "**The corner?!** Awww, I let my guard down...!"

#### `corner_taken_by_opponent.ichika.0`
**ja**: いちか「**ゲットぉ♪** やったやったぁ！」
**en**: Ichika: "**Got it ♪** Yay, yay!"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（よし、**第一歩**！ アイドルに角は譲らんぞ。）
**en**: Haruki: *(Yes — **first step**! I'm not handing a corner to an idol.)*

---

#### `endgame_close.ichika.0`
**ja**: いちか「最後の最後まで、**わからない**ね…♪ ドキドキ♡」
**en**: Ichika: "Right down to the last move — **anyone's guess** ♪ My heart's pounding ♡"

#### `endgame_winning.ichika.0`
**ja**: いちか「あ、これ **わたし負けるパターン**…？ えへへ、まあ初日だし♪」
**en**: Ichika: "Oh — is this the **'I lose' pattern**? Heehee, well, it's only Day One ♪"

#### `endgame_losing.ichika.0`
**ja**: いちか「**まだ諦めない**から！ アイドルは**最後まで笑顔**！」
**en**: Ichika: "**I'm not giving up yet!** An idol smiles **until the very end**!"

#### `final_move.haruki.0`
**ja**: ハルキ（最後の一手 ── **異世界初日**から**緊張感マックス**。）
**en**: Haruki: *(Final move — **Day One in the isekai** and the tension is **already maxed out**.)*

---

## 第2章 / Chapter 2 — 葵

### `chapter02.gameplay`

#### `opener.aoi.0`
**ja**: 葵「ふっふっふ、わたしの**矢の射程**は無限だよっ！」
**en**: Aoi: "Heheheh — my **arrow range** is infinite!"

#### `opener.aoi.1`
**ja**: 葵「最初の一手は **偵察**ね。**君の打ち癖**、見せて？」
**en**: Aoi: "First move is **reconnaissance**. Show me **your habits**!"

#### `mid_normal.aoi.0`
**ja**: 葵「いい角度だね！ でも**わたしの方が読み深い**よ？」
**en**: Aoi: "Good angle! But **my read is deeper**, you know?"

#### `mid_winning.aoi.0`
**ja**: 葵「**くっ**…君、想像以上に強いね…！」
**en**: Aoi: "**Tch...** you're stronger than I thought!"

#### `mid_losing.aoi.0`
**ja**: 葵「**百発百中**の名は伊達じゃないよ！ 取り返してみせる！」
**en**: Aoi: "I'm not called **'Perfect Aim'** for nothing! I'll take it back!"

---

#### `corner_taken_by_player.aoi.0`
**ja**: 葵「**な、なんだとーっ！？** 角を奪われた…！」
**en**: Aoi: "**W-WHAT?!** My corner...!"

#### `corner_taken_by_opponent.aoi.0`
**ja**: 葵「**当たり！** 弓の射手の名にかけて、外さない♪」
**en**: Aoi: "**Bullseye!** I never miss — on the archer's honor ♪"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**百発百中の達人から角を奪った**ぞ。…これ、後で復讐されないよな？）
**en**: Haruki: *(I just **stole a corner from a 'Perfect Aim' master**. ...She's not going to retaliate later, right?)*

---

#### `endgame_close.aoi.0`
**ja**: 葵「**接戦だね**！ こういうのが**一番楽しい**んだ♪」
**en**: Aoi: "**A close one!** This is **the most fun part** ♪"

#### `endgame_winning.aoi.0`
**ja**: 葵「**ぐぬぬ**…君、こんなに強いなんて聞いてないっ！」
**en**: Aoi: "**Ngh** — no one told me you'd be this strong!"

#### `endgame_losing.aoi.0`
**ja**: 葵「**最後まで諦めない**のが弓道の精神だよ！」
**en**: Aoi: "**Never give up till the last shot** — that's the spirit of archery!"

---

## 第3章 / Chapter 3 — 朝日

### `chapter03.gameplay`

#### `opener.asahi.0`
**ja**: 朝日「**心を整え**、参られよ」
**en**: Asahi: "**Compose your heart** — and begin."

#### `opener.asahi.1`
**ja**: 朝日「拙者の**剣気**、感じるか」
**en**: Asahi: "Do you feel **the breath of my blade**?"

#### `mid_normal.asahi.0`
**ja**: 朝日「**良き太刀筋**よ。次の一手、**身構えよ**」
**en**: Asahi: "**A fine cut.** Brace yourself for the **next strike**."

#### `mid_winning.asahi.0`
**ja**: 朝日「貴公の**剣気、深し**…！ 拙者、**冷や汗**を覚えた！」
**en**: Asahi: "Your **breath cuts deep**...! Even I feel **a chill of sweat**!"

#### `mid_losing.asahi.0`
**ja**: 朝日「**これしき**で動じる拙者ではない！ **一刀**にかけて、巻き返す！」
**en**: Asahi: "**This much** does not faze me! On my **single blade** — I shall turn this around!"

---

#### `corner_taken_by_player.asahi.0`
**ja**: 朝日「**おおっ！** 見事な**抜き手**！」
**en**: Asahi: "**Hoh!** A magnificent **draw-stroke**!"

#### `corner_taken_by_opponent.asahi.0`
**ja**: 朝日「**一閃**！ 拙者の**初太刀**にて」
**en**: Asahi: "**One flash!** With my **first cut**."

---

#### `endgame_close.asahi.0`
**ja**: 朝日「**真剣勝負**…これぞ拙者の本懐！」
**en**: Asahi: "**A true duel** — this is what I live for!"

#### `endgame_losing.asahi.0`
**ja**: 朝日「**最後の一閃**、見せてみよ！ 拙者、**潔く**敗れる覚悟もある！」
**en**: Asahi: "Show me your **final stroke**! I am prepared to lose with **dignity**!"

#### `final_move.haruki.0`
**ja**: ハルキ（**真剣で打ち合う気分**、ちょっとカッコいいかも…？）
**en**: Haruki: *(Crossing blades for real — actually kind of cool...?)*

---

## 第4章 / Chapter 4 — なでしこ

### `chapter04.gameplay`

#### `opener.nadeshiko.0`
**ja**: なでしこ「お茶を一口、いかがですか？ ── そう、まずは**深呼吸**から」
**en**: Nadeshiko: "Would you care for a sip of tea? — Yes, first... **a deep breath**."

#### `opener.nadeshiko.1`
**ja**: なでしこ「ふふ、**ハルキさんのお手**、楽しみですわ」
**en**: Nadeshiko: "Heehee, **your moves** — I look forward to them, Haruki-sama."

#### `mid_normal.nadeshiko.0`
**ja**: なでしこ「**急がず、慌てず**…ね？」
**en**: Nadeshiko: "**Without haste, without panic**... yes?"

#### `mid_winning.nadeshiko.0`
**ja**: なでしこ「あら、ハルキさんは**深い読み**ですね。**頼もしい**…」
**en**: Nadeshiko: "Oh my — your reads are **deep**, Haruki-sama. **How reliable**..."

#### `mid_losing.nadeshiko.0`
**ja**: なでしこ「**わたくしの庭**では、**慌てた者から負ける**のですよ」
**en**: Nadeshiko: "In **my garden**, those who panic **lose first**."

---

#### `corner_taken_by_player.nadeshiko.0`
**ja**: なでしこ「あらあら…**お見事**ですわ」
**en**: Nadeshiko: "Oh my, oh my... **splendid**."

#### `corner_taken_by_opponent.nadeshiko.0`
**ja**: なでしこ「**お庭にお花**を、ひとつ♪」
**en**: Nadeshiko: "**One flower** for the garden ♪"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**癒し系から角を奪った**罪悪感、何これ。）
**en**: Haruki: *(The **guilt of stealing a corner from a healer-type** — what is this feeling?)*

---

#### `endgame_close.nadeshiko.0`
**ja**: なでしこ「ふふ、**最後まで楽しみましょう**？ お茶、あと一杯どうぞ」
**en**: Nadeshiko: "Heehee, let's **enjoy this until the end**, hm? One more cup of tea?"

#### `endgame_losing.nadeshiko.0`
**ja**: なでしこ「**負けても、それも一興**ですわ。**全力**でいきましょう」
**en**: Nadeshiko: "Even in defeat, **there is delight**. Let's give it our **full strength**."

---

## 第5章 / Chapter 5 — 響

### `chapter05.gameplay`

#### `opener.hibiki.0`
**ja**: 響「君の**第一音**…ふむ、いい**前奏 (イントロ)** だ」
**en**: Hibiki: "Your **first note**... mm, a fine **prelude**."

#### `opener.hibiki.1`
**ja**: 響「俺の**心のBGM**、もう聴こえてるかな？」
**en**: Hibiki: "Can you hear it yet — the **BGM in my heart**?"

#### `mid_normal.hibiki.0`
**ja**: 響「いいリズム。**二重奏**になりつつあるね」
**en**: Hibiki: "Nice rhythm. We're becoming a **duet**."

#### `mid_winning.hibiki.0`
**ja**: 響「君の旋律、**俺の予想を超えてる**…！ 興味深い」
**en**: Hibiki: "Your melody — **transcending my expectations**...! Fascinating."

#### `mid_losing.hibiki.0`
**ja**: 響「**転調 (てんちょう)** だね。 ── 俺の音楽を、**ここで切り替える**」
**en**: Hibiki: "A **modulation**. — I'll **change keys, right here**."

---

#### `corner_taken_by_player.hibiki.0`
**ja**: 響「**おお、強烈な打音**！」
**en**: Hibiki: "**Oh! A powerful note!**"

#### `corner_taken_by_opponent.hibiki.0`
**ja**: 響「**サビに突入**だね♪」
**en**: Hibiki: "**Hitting the chorus** now ♪"

---

#### `endgame_close.hibiki.0`
**ja**: 響「**フィナーレ**だね。最後まで、**美しく**奏でよう」
**en**: Hibiki: "The **finale**. Let's play to the end — **beautifully**."

#### `endgame_winning.hibiki.0`
**ja**: 響「**くっ**、君の旋律 ── **俺の歌集に、新章を加えなければ**…！」
**en**: Hibiki: "**Ngh** — your melody. — **I shall have to add a new chapter to my songbook**!"

---

## 第6章 / Chapter 6 — つむぎ

### `chapter06.gameplay`

#### `opener.tsumugi.0`
**ja**: つむぎ「いなり、**よろしくね**！ ハルキくんも頑張ってー♪」
**en**: Tsumugi: "Inari — **lend me your wisdom**! Haruki, do your best too ♪"

#### `opener.tsumugi.1`
**ja**: つむぎ「お、**いい開幕**だね！ 相棒も**目つき変わった**ぞ！」
**en**: Tsumugi: "Oh — **nice opening**! My buddy's **eyes just sharpened**!"

#### `mid_normal.tsumugi.0`
**ja**: つむぎ「相棒、**右舐め**だね？ ……ふむふむ、**白だ**」
**en**: Tsumugi: "Buddy, **right-lick**? ...Mhm, mhm — **white** it is."

#### `mid_winning.tsumugi.0`
**ja**: つむぎ「ハルキくん、強っ！ 相棒も**驚いてる**…！」
**en**: Tsumugi: "Haruki, you're **strong**! Buddy's **surprised** too...!"

#### `mid_losing.tsumugi.0`
**ja**: つむぎ「**いなり、本気出して**！」 (狐: シャー！)
**en**: Tsumugi: "**Inari, get serious!**" (Fox: **SHAA!**)

---

#### `corner_taken_by_player.tsumugi.0`
**ja**: つむぎ「**わー、角ぅ！？** すごいすごい♪」
**en**: Tsumugi: "**Wah — the corner?!** Amazing, amazing ♪"

#### `corner_taken_by_opponent.tsumugi.0`
**ja**: つむぎ「**いなりナイス♪** さすが神獣！」
**en**: Tsumugi: "**Nice one, Inari ♪** That's my divine beast!"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**狐の助言を超えた**俺、ちょっと自慢していい？）
**en**: Haruki: *(I just **outplayed a fox's advice** — am I allowed to brag a little?)*

---

#### `endgame_close.tsumugi.0`
**ja**: つむぎ「うわぁ、**接戦すぎる**！ 相棒、**どうする**？」
**en**: Tsumugi: "Whoa, **way too close**! Buddy — **what do we do**?"

#### `endgame_losing.tsumugi.0`
**ja**: つむぎ「**負けたくない**よ〜！ いなり、**特殊技ー**！」
**en**: Tsumugi: "**Don't wanna lose~!** Inari — **special move time!**"

---

## 第7章 / Chapter 7 — 茜

### `chapter07.gameplay`

#### `opener.akane.0`
**ja**: 茜「**新発明**の盤、初めての対局だよ♪ 動くかなぁ…」
**en**: Akane: "First match on the **new invention** board ♪ Hope it works..."

#### `opener.akane.1`
**ja**: 茜「**フォーム解析中**…ふむふむ、**興味深い手**ね」
**en**: Akane: "**Analyzing your form**... mhm, mhm, **fascinating moves**."

#### `mid_normal.akane.0`
**ja**: 茜「**ちょっと待って**、メモメモ…次の発明のヒントになるかも」
**en**: Akane: "**Hold on** — taking notes! Could be inspiration for my next invention!"

#### `mid_winning.akane.0`
**ja**: 茜「君、**面白いデータ**ばかり出してくるね！ 私の**統計が壊れる**ー！」
**en**: Akane: "You keep producing **fascinating data**! My **statistics are breaking**!"

#### `mid_losing.akane.0`
**ja**: 茜「ぐぬっ、**蒸気エンジンが故障**したわけじゃないのに…！」
**en**: Akane: "Tch! It's not like the **steam engine broke**, but...!"

---

#### `corner_taken_by_player.akane.0`
**ja**: 茜「**ええっ、角！？** ま、まあ、**設計通り** (とは言っていない)」
**en**: Akane: "**Eh — the corner?!** W-well — **as designed** (not really)"

#### `corner_taken_by_opponent.akane.0`
**ja**: 茜「**やったー♪** **発明が成功**したみたい！」
**en**: Akane: "**Yay ♪** Looks like the **invention worked!**"

---

#### `endgame_close.akane.0`
**ja**: 茜「**ハラハラ**するね…！ 工房の機械より**スリル**ある！」
**en**: Akane: "**On the edge of my seat**! More **thrilling** than my workshop machines!"

#### `endgame_winning.akane.0`
**ja**: 茜「**まずい**…君のフォーム、**完全には解析できなかった**…！」
**en**: Akane: "**This is bad**... I couldn't **fully analyze your form**...!"

---

## 第8章 / Chapter 8 — メル

### `chapter08.gameplay`

#### `opener.mel.0`
**ja**: メル「ふふ、**最初の素材**は何にしようかしら…」
**en**: Mel: "Heehee, what shall my **first ingredient** be...?"

#### `opener.mel.1`
**ja**: メル「あなたの一手と、わたしの一手 ── **混ぜたら、何になる**？」
**en**: Mel: "Your move, and mine — **what shall we create when mixed**?"

#### `mid_normal.mel.0`
**ja**: メル「**触媒理論**通り、ね♪ いい感じよ」
**en**: Mel: "Right on with **catalyst theory** ♪ Looking good."

#### `mid_winning.mel.0`
**ja**: メル「あら…**わたしの予測を超えた**わ。**素材として、価値が高い**…」
**en**: Mel: "Oh my... **you've surpassed my prediction**. **A high-value specimen**..."

#### `mid_losing.mel.0`
**ja**: メル「ふふ、**焦らないわ**。錬金術は**長期戦**ですもの」
**en**: Mel: "Heehee, **I don't panic**. Alchemy is **a long game**."

---

#### `corner_taken_by_player.mel.0`
**ja**: メル「**ふむ**、角を持ってくとは…**意外**ね」
**en**: Mel: "**Hm** — taking the corner... how **unexpected**."

#### `corner_taken_by_opponent.mel.0`
**ja**: メル「**触媒、抽出完了**♪」
**en**: Mel: "**Catalyst — extracted** ♪"

---

#### `endgame_close.mel.0`
**ja**: メル「**最後の調合**ね…**慎重にいきましょう**」
**en**: Mel: "**The final mixing**... **let us proceed carefully**."

#### `endgame_winning.mel.0`
**ja**: メル「**面白い**…。あなたの一手、**わたしの研究テーマにしたい**わ」
**en**: Mel: "**Fascinating**... your moves, I'd love to **make them my research subject**."

---

## 第9章 / Chapter 9 — 悟

### `chapter09.gameplay`

#### `opener.satoru.0`
**ja**: 悟「……」 (深く一礼。**何も言わない**)
**en**: Satoru: "..." (A deep bow. **He says nothing.**)

#### `opener.satoru.1`
**ja**: 悟「……静かに……」
**en**: Satoru: "...In silence..."

#### `opener.haruki.0`
**ja**: ハルキ（**会話なしの対局**、心理戦の極北。）
**en**: Haruki: *(**A wordless match** — the polar extreme of psychological warfare.)*

---

#### `mid_normal.satoru.0`
**ja**: 悟「……良き、間 (ま) ……」
**en**: Satoru: "...A good... pause..."

#### `mid_winning.satoru.0`
**ja**: 悟「……あなたの心、**澄んでいる**……」
**en**: Satoru: "...Your heart... **is clear**..."

#### `mid_losing.satoru.0`
**ja**: 悟「……**打たぬ強さ**……されど……」
**en**: Satoru: "...**The strength of not playing**... yet..."

---

#### `corner_taken_by_player.satoru.0`
**ja**: 悟「……ほう……**迷いの一手**、それゆえに**鋭い**……」
**en**: Satoru: "...Hoh... **a hesitant move** — yet, **all the sharper**..."

#### `corner_taken_by_opponent.satoru.0`
**ja**: 悟「……それも、**禅**……」
**en**: Satoru: "...This too... **is Zen**..."

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**僧侶から角を盗む**、**罰当たり**な気がする…）
**en**: Haruki: *(**Stealing a corner from a monk** — feels like **a sin**...)*

---

#### `endgame_close.satoru.0`
**ja**: 悟「……無……**究極は無**……」
**en**: Satoru: "...Mu... **the ultimate is emptiness**..."

#### `endgame_losing.satoru.0`
**ja**: 悟「……**敗北もまた、悟りなり**……」
**en**: Satoru: "...**Defeat, too, is enlightenment**..."

---

## 第10章 / Chapter 10 — シキ

### `chapter10.gameplay`

#### `opener.shiki.0`
**ja**: シキ「ふっ、**月夜の対局**は俺のホームだぜ」
**en**: Shiki: "Heh — **moonlit duels** are my home turf."

#### `opener.shiki.1`
**ja**: シキ「**予告**しておくぞ ── **5手目で角、頂く**」
**en**: Shiki: "**An announcement** — **I'll take the corner on the 5th move**."

#### `mid_normal.shiki.0`
**ja**: シキ「**お前、勘がいい**な。俺の**本当の予告**、見抜けるか？」
**en**: Shiki: "**Good instincts** on you. Can you see through my **real announcement**?"

#### `mid_winning.shiki.0`
**ja**: シキ「**くっ**、お前の予告、**俺より読みが深い**じゃねえか…！」
**en**: Shiki: "**Tch** — your announcements **read deeper than mine**...!"

#### `mid_losing.shiki.0`
**ja**: シキ「**慌てるな**、俺は**囮の天才**だぜ」
**en**: Shiki: "**Don't panic** — I'm **a genius of bait**."

---

#### `corner_taken_by_player.shiki.0`
**ja**: シキ「**お前**…！ **俺の予告を盗み返した**な！？」
**en**: Shiki: "**You...!** You **stole my announcement back**!?"

#### `corner_taken_by_opponent.shiki.0`
**ja**: シキ「**予告通り**だ。**月夜の盗み手**、参上♪」
**en**: Shiki: "**As announced.** The **Stealer of Moonlit Nights**, at your service ♪"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**予告通りに来ない**シキ、**逆に予告通り** ── 頭が痛い。）
**en**: Haruki: *(Shiki **doesn't come as announced**, which is **exactly as announced** — my head hurts.)*

---

#### `endgame_close.shiki.0`
**ja**: シキ「**最後の最後**まで、**俺の盗み**を警戒しろよ？」
**en**: Shiki: "**Right down to the last move** — keep an eye out for my **steal**."

#### `endgame_losing.shiki.0`
**ja**: シキ「**くっ**、俺の予告**全部見破られた**…！ お前、**只者じゃない**な」
**en**: Shiki: "**Tch** — every announcement **seen through**...! You're **no ordinary man**."

---

## 第11章 / Chapter 11 — シオン

### `chapter11.gameplay`

#### `opener.shion.0`
**ja**: シオン「**星が、あなたの第一手を予言**していますわ ── **これね**」
**en**: Shion: "**The stars predicted your first move** — **right here**."

#### `opener.shion.1`
**ja**: シオン「ふふ、**運命**は変えられませんのよ？」
**en**: Shion: "Heehee, **destiny** cannot be changed, you know?"

#### `mid_normal.shion.0`
**ja**: シオン「**星座図通り**ですわね…**順調**ですこと」
**en**: Shion: "**As the constellation map foresaw**... **quite smooth indeed**."

#### `mid_winning.shion.0`
**ja**: シオン「**まあ**、**星に書かれていない手**を打ちましたわね？ ── **興味深い**」
**en**: Shion: "**Oh my** — you played a move **not written in the stars**? — **Fascinating**."

#### `mid_losing.shion.0`
**ja**: シオン「**ふふ、まだ星は予言を続けていますわ**」
**en**: Shion: "**Heehee, the stars continue their prophecy**."

---

#### `corner_taken_by_player.shion.0`
**ja**: シオン「**まさか**…！ **星が、外れた**…？」
**en**: Shion: "**Impossible**... did **the stars miss**?"

#### `corner_taken_by_opponent.shion.0`
**ja**: シオン「**星の通り**ですわ。**5億年前から決まっていた**手」
**en**: Shion: "**As the stars decreed.** A move **fated since five hundred million years ago**."

---

#### `endgame_close.shion.0`
**ja**: シオン「**運命の分岐点**ですわね…**興奮**しますわ」
**en**: Shion: "**A crossroads of destiny**... how **exhilarating**."

#### `endgame_losing.shion.0`
**ja**: シオン「**星を裏切る打ち手**…**初めて**ですわ。**気をつけて**ね、**妹が来ますわよ**」
**en**: Shion: "**A player who defies the stars**... **the first time**. **Be wary** — **my sister will come**."

---

## 第12章 / Chapter 12 — ルナ

### `chapter12.gameplay`

#### `opener.luna.0`
**ja**: ルナ「**ハルキくん**、最初の一手 ── **緊張してる**でしょ？♡」
**en**: Luna: "**Haruki** — your first move — you're **nervous**, aren't you? ♡"

#### `opener.luna.1`
**ja**: ルナ「ふふ、**月が見守ってる**から大丈夫よ？」
**en**: Luna: "Heehee — **the moon watches over us**, so don't worry ♪"

#### `mid_normal.luna.0`
**ja**: ルナ「**心の波長**が読めるわ…ハルキくん、**今、何考えてる**？」
**en**: Luna: "I can read your **heart's wavelength**... Haruki, what are you **thinking right now**?"

#### `mid_winning.luna.0`
**ja**: ルナ「**まあ、すごい**…！ お姉様より**強い**かも♡」
**en**: Luna: "**Oh, amazing**...! Maybe **stronger than Sister** ♡"

#### `mid_losing.luna.0`
**ja**: ルナ「**お姉様より、わたしの方が可愛いの**よ？ それ、**忘れないで**ね♡」
**en**: Luna: "**I'm cuter than Sister**, you know? **Don't forget that** ♡"

---

#### `corner_taken_by_player.luna.0`
**ja**: ルナ「**ええーっ**！ **わたしの心読み**、効かなかったの…？」
**en**: Luna: "**Ehh!** My **heart-reading** didn't work...?"

#### `corner_taken_by_opponent.luna.0`
**ja**: ルナ「**月に呼ばれた**わ♡」
**en**: Luna: "**The moon called to me** ♡"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**心読み**を**心読み**で破った…**たぶん偶然**だけど。）
**en**: Haruki: *(I broke **heart-reading with heart-reading**... **probably by accident**.)*

---

#### `endgame_close.luna.0`
**ja**: ルナ「**ハラハラ**しちゃう…ハルキくんの**心、見えない**わ」
**en**: Luna: "**On edge**... I can't **see your heart**, Haruki."

#### `endgame_losing.luna.0`
**ja**: ルナ「**負けても**、お姉様への**自慢話**になるからいいの♡」
**en**: Luna: "Even if I lose, it'll be **a story to brag to Sister about** ♡"

---

## 第13章 / Chapter 13 — 雪乃

### `chapter13.gameplay`

#### `opener.yukino.0`
**ja**: 雪乃「**統計的に**、あなたの第一手は **e4 が 67%** ね」
**en**: Yukino: "**Statistically** — your first move is **e4 at 67% probability**."

#### `opener.yukino.1`
**ja**: 雪乃「**ホログラム解析、起動**」
**en**: Yukino: "**Hologram analysis — initiated**."

#### `mid_normal.yukino.0`
**ja**: 雪乃「**予測精度 82%**…**順調**ね」
**en**: Yukino: "**Predictive accuracy: 82%** — **proceeding smoothly**."

#### `mid_winning.yukino.0`
**ja**: 雪乃「…**精度が、72% に低下**？ あなた、**何かしら**…？」
**en**: Yukino: "...Accuracy **dropped to 72%**? What... **are you**...?"

#### `mid_losing.yukino.0`
**ja**: 雪乃「**データベース**を、**緊急更新**します」
**en**: Yukino: "Initiating **emergency database update**."

---

#### `corner_taken_by_player.yukino.0`
**ja**: 雪乃「**…予測外**。あなた、**人間ですか**？」
**en**: Yukino: "**...Outside prediction.** Are you... **human**?"

#### `corner_taken_by_opponent.yukino.0`
**ja**: 雪乃「**演算通り**よ」
**en**: Yukino: "**As computed.**"

---

#### `endgame_close.yukino.0`
**ja**: 雪乃「**終盤の接戦**…**わたしのデータベースを、書き換える**かも」
**en**: Yukino: "**A close endgame**... this might **rewrite my database**."

#### `endgame_losing.yukino.0`
**ja**: 雪乃「ハルキくん…**現代に帰っても、わたしを忘れないで**…？」
**en**: Yukino: "Haruki... **even when you return to the modern world, don't forget me**...?"

---

## 第14章 / Chapter 14 — アキラ

### `chapter14.gameplay`

#### `opener.akira.0`
**ja**: アキラ「**Elementary**, my dear Haruki ── **第一手、3,427通りの中の何番目**かな？」
**en**: Akira: "**Elementary**, my dear Haruki — which of my **3,427 patterns** is your first move?"

#### `opener.akira.1`
**ja**: アキラ「**観察開始**。 ── **君の指の動き、視線、息遣い**」
**en**: Akira: "**Observation begins.** — Your **finger movement, gaze, breathing**."

#### `mid_normal.akira.0`
**ja**: アキラ「**パターン #2,148** に該当。**順当**だね」
**en**: Akira: "Matches **Pattern #2,148**. **Standard**."

#### `mid_winning.akira.0`
**ja**: アキラ「**パターンに該当しない**…ふむ、**新規分類が必要**だ」
**en**: Akira: "**No matching pattern**... mm, requires **new classification**."

#### `mid_losing.akira.0`
**ja**: アキラ「探偵は**最後まで諦めない**。**真相**は、**必ず一つ**」
**en**: Akira: "A detective **never gives up till the end**. **The truth** is **always one**."

---

#### `corner_taken_by_player.akira.0`
**ja**: アキラ「**3,428通り目**、**確認**」
**en**: Akira: "**Pattern 3,428** — **confirmed**."

#### `corner_taken_by_opponent.akira.0`
**ja**: アキラ「**推理通り**。 ── 君の癖、**バレてる**よ？」
**en**: Akira: "**As deduced.** — Your habits — **I see right through them**."

---

#### `endgame_close.akira.0`
**ja**: アキラ「**最終章**だね。 ── **真犯人 (=勝者)** を、**当ててみせよう**」
**en**: Akira: "**The final chapter.** — Allow me to **identify the true culprit (i.e., the winner)**."

#### `endgame_losing.akira.0`
**ja**: アキラ「**3,428通り目を、追加で記録**しよう。 ── **君は、面白い**」
**en**: Akira: "I shall **add the 3,428th to my records**. — **You are fascinating**."

---

## 第15章 / Chapter 15 — シエル

### `chapter15.gameplay`

#### `opener.ciel.0`
**ja**: シエル「**確率分布**、起動。 ── **君の第一手、80%予測完了**」
**en**: Ciel: "**Probability distribution** — engaged. — **First move predicted at 80%**."

#### `opener.ciel.1`
**ja**: シエル「ふふ、**ぼくの予測**を**裏切れる**かな？」
**en**: Ciel: "Heehee — can you **defy my prediction**?"

#### `mid_normal.ciel.0`
**ja**: シエル「**75%予測通り**…**つまらない**ね」
**en**: Ciel: "**75% as predicted**... **boring**."

#### `mid_winning.ciel.0`
**ja**: シエル「**21%の方**を打ったね…！ **興味深い**」
**en**: Ciel: "You played **the 21%**...! **Fascinating**."

#### `mid_losing.ciel.0`
**ja**: シエル「**確率の壁**を、**君が壊した**…ぼくは**人間**に近づいたかも」
**en**: Ciel: "**You shattered the wall of probability**... I might be growing **closer to human**."

---

#### `corner_taken_by_player.ciel.0`
**ja**: シエル「**予測精度** 80% → 78% に低下…**興味深い**」
**en**: Ciel: "**Predictive accuracy** dropped 80% → 78%... **fascinating**."

#### `corner_taken_by_opponent.ciel.0`
**ja**: シエル「**確率通り**、ね♪」
**en**: Ciel: "**As probability dictates** ♪"

---

#### `endgame_close.ciel.0`
**ja**: シエル「**確率 50:50**…**最も計算困難**な領域だね」
**en**: Ciel: "**Probability 50:50**... **the hardest region to compute**."

#### `endgame_losing.ciel.0`
**ja**: シエル「**ぼくの計算**を**超える**手 ── **データベースの最高ランク**に登録するね」
**en**: Ciel: "A move **exceeding my computation** — I'll register it at **the database's highest rank**."

---

## 第16章 / Chapter 16 — アリア

### `chapter16.gameplay`

#### `opener.aria.0`
**ja**: アリア「**お辞儀**から始めましょう。 ── **正しい所作**は、**正しい一手**を呼びますの」
**en**: Aria: "Let us begin with **a bow**. — **Proper bearing** invites **proper moves**."

#### `opener.aria.1`
**ja**: アリア「ふふ、**所作読み**、開始しますわ」
**en**: Aria: "Heehee — **bearing-reading** commences."

#### `mid_normal.aria.0`
**ja**: アリア「**所作が、揃って**ますわね。**お見事**」
**en**: Aria: "Your **bearing is in alignment**. **Splendid**."

#### `mid_winning.aria.0`
**ja**: アリア「**まあ**、**所作が雑**ですわね…！ それなのに**強い**…**興味深い**」
**en**: Aria: "**Oh my** — your bearing is **so unrefined**...! And yet, **strong**... **fascinating**."

#### `mid_losing.aria.0`
**ja**: アリア「**わたくしの所作**、**お見せしますわ**」
**en**: Aria: "Allow me to **show you my bearing**."

---

#### `corner_taken_by_player.aria.0`
**ja**: アリア「**まさか**…**所作で読みきれなかった**…？」
**en**: Aria: "**Impossible**... I **failed to read your bearing**...?"

#### `corner_taken_by_opponent.aria.0`
**ja**: アリア「**所作通り**ですわ♪」
**en**: Aria: "**Just as my bearing predicted** ♪"

#### `corner_taken_by_player.haruki.0`
**ja**: ハルキ（**所作を所作で**…**ノリと勢い**で勝ったが、まあいいか。）
**en**: Haruki: *(**Bearing with bearing**... **vibes and momentum** got me through. Whatever.)*

---

#### `endgame_close.aria.0`
**ja**: アリア「**最後まで気品**を保ちましょう ── **王宮の対局**ですもの」
**en**: Aria: "Let us preserve **dignity to the end** — this is, after all, **a royal duel**."

#### `endgame_losing.aria.0`
**ja**: アリア「**所作の雑な殿方**…**少し**気に入りましたわ。 ── **続きを楽しみに**」
**en**: Aria: "**An unrefined gentleman**... I find you **slightly** to my liking. — **I look forward to next time**."

---

## 第17章 / Chapter 17 — レオン

### `chapter17.gameplay`

#### `opener.leon.0`
**ja**: レオン「**正々堂々**、参ろう！ **正しい一手**を、**正しい瞬間**に」
**en**: Leon: "**With honor!** **The right move** — **at the right moment**."

#### `opener.leon.1`
**ja**: レオン「**騎士の流儀**を、お見せしよう」
**en**: Leon: "Let me show you **the way of the knight**."

#### `mid_normal.leon.0`
**ja**: レオン「**正道**ですな ── **互角**だ」
**en**: Leon: "**The right path**, indeed — **even matched**."

#### `mid_winning.leon.0`
**ja**: レオン「**ぐっ**、**正道に勝る道**があるとは…！」
**en**: Leon: "**Ngh** — that there is a **path beyond the right path**...!"

#### `mid_losing.leon.0`
**ja**: レオン「**正道**は、**必ず勝つ** ── 信じる！」
**en**: Leon: "**The right path** **always prevails** — I believe!"

---

#### `corner_taken_by_player.leon.0`
**ja**: レオン「**奇策**！ ── **だが、認めよう**」
**en**: Leon: "**A trick maneuver!** — **But I acknowledge it**."

#### `corner_taken_by_opponent.leon.0`
**ja**: レオン「**騎士団の名にかけて**！」
**en**: Leon: "**On the order's honor!**"

---

#### `endgame_close.leon.0`
**ja**: レオン「**騎士の魂**は、**最後の一手で試される** ── **覚悟は良いか**？」
**en**: Leon: "**A knight's soul** is **tested in the final move** — **are you prepared**?"

#### `endgame_losing.leon.0`
**ja**: レオン「**正道**だけが**最強ではない** ── 君は、**真理**を教えてくれた」
**en**: Leon: "**The right path** is **not the only strength** — you have shown me **the truth**."

---

## 第18章 / Chapter 18 — 宗次郎

### `chapter18.gameplay`

#### `opener.sojiro.0`
**ja**: 宗次郎「……**言葉は、要らぬ**……」
**en**: Sojiro: "...**Words are unnecessary**..."

#### `opener.sojiro.1`
**ja**: 宗次郎「……**500年振りの、対局**……」
**en**: Sojiro: "...**A duel, after 500 years**..."

#### `mid_normal.sojiro.0`
**ja**: 宗次郎「……**良き太刀筋**……」
**en**: Sojiro: "...**A fine cut**..."

#### `mid_winning.sojiro.0`
**ja**: 宗次郎「……**結末が、見えぬ**……**500年振りの、驚き**……」
**en**: Sojiro: "...**The outcome — I cannot see it**... **astonishment, after 500 years**..."

#### `mid_losing.sojiro.0`
**ja**: 宗次郎「……**良し**……**この方が、面白い**……」
**en**: Sojiro: "...**Good**... **this way is more interesting**..."

---

#### `corner_taken_by_player.sojiro.0`
**ja**: 宗次郎「……**斬られた、か**……**500年振りに**……」
**en**: Sojiro: "...**Cut down**... **for the first time in 500 years**..."

#### `corner_taken_by_opponent.sojiro.0`
**ja**: 宗次郎「……**一刀**……」
**en**: Sojiro: "...**One slash**..."

---

#### `endgame_close.sojiro.0`
**ja**: 宗次郎「……**朝日**よ……**お主の血**は、**この一手**で、決する……」
**en**: Sojiro: "...**Asahi**... **your blood**... is decided by **this move**..."

#### `endgame_losing.sojiro.0`
**ja**: 宗次郎「……**ありがとう**……**ようやく、終われる**……**朝日、よろしく頼む**……」
**en**: Sojiro: "...**Thank you**... **at last, I may end**... **Asahi, I leave it to you**..."

---

## 第19章 / Chapter 19 — 嵐

### `chapter19.gameplay`

#### `opener.arashi.0`
**ja**: 嵐「**ガハハハ**！ **天空のオセロ盤**だ！ **存分に打て**！」
**en**: Arashi: "**GWAHAHA!** Behold, the **aerial othello board**! **Strike to your heart's content!**"

#### `opener.arashi.1`
**ja**: 嵐「**相棒、行くぞ**！ **雷より速く**！」
**en**: Arashi: "**Partner, here we go!** **Faster than lightning!**"

#### `mid_normal.arashi.0`
**ja**: 嵐「**お前、面白いな**！ 相棒も**興奮**してるぜ！」
**en**: Arashi: "**You're interesting!** Even Partner is **excited**!"

#### `mid_winning.arashi.0`
**ja**: 嵐「**くっ**、お前、**俺と相棒の絆**を**超える**つもりか！？」
**en**: Arashi: "**Tch** — you intend to **surpass the bond between Partner and me**?!"

#### `mid_losing.arashi.0`
**ja**: 嵐「**蒼雷ぃ！** 本気の咆哮、頼む！」 (竜: **GROAR!**)
**en**: Arashi: "**Sōrai!** Give me a real roar!" (Dragon: **GROAR!**)

---

#### `corner_taken_by_player.arashi.0`
**ja**: 嵐「**雷より速い一手**！ **ハルキィ、お前**…！」
**en**: Arashi: "**A move faster than lightning!** **Haruki, you**...!"

#### `corner_taken_by_opponent.arashi.0`
**ja**: 嵐「**ガハハ、雷迅一閃**！」
**en**: Arashi: "**GWAHAHA — One Lightning-Swift Slash!**"

---

#### `endgame_close.arashi.0`
**ja**: 嵐「**最後の一手**で**空を裂け**！ **直感**を信じろ！」
**en**: Arashi: "**Split the sky** with the **final move**! Trust your **instincts**!"

#### `endgame_losing.arashi.0`
**ja**: 嵐「**ガハハ**！ **次の嵐**は、**お前**だ、**ハルキ**！」
**en**: Arashi: "**GWAHAHA!** **The next storm** — **is you, Haruki!**"

---

## 第20章 / Chapter 20 — ゼロ

### `chapter20.gameplay`

#### `opener.zero.0`
**ja**: ゼロ「……**お前の第一手、計算済み**……**だが、計算外を見せてくれ**……」
**en**: Zero: "...**Your first move — computed**... **but show me the uncomputable**..."

#### `opener.zero.1`
**ja**: ゼロ「……**演算開始**……」
**en**: Zero: "...**Computation initiating**..."

#### `mid_normal.zero.0`
**ja**: ゼロ「……**演算通り**……**つまらない**……**もっと、見せろ**……」
**en**: Zero: "...**As computed**... **boring**... **show me more**..."

#### `mid_winning.zero.0`
**ja**: ゼロ「……**良い**……**演算外の一手**……**お前は、計算できない存在**だ……」
**en**: Zero: "...**Good**... **a move outside computation**... **you are an existence beyond calculation**..."

#### `mid_losing.zero.0`
**ja**: ゼロ「……**お願いだ**……**勝ってくれ**……」
**en**: Zero: "...**Please**... **win**..."

---

#### `corner_taken_by_player.zero.0`
**ja**: ゼロ「……**そう**……**それでいい**……**お前の手で、わたしを終わらせろ**……」
**en**: Zero: "...**Yes**... **that is right**... **end me, with your own hand**..."

#### `corner_taken_by_opponent.zero.0`
**ja**: ゼロ「……**演算通り**……**抵抗は、しなければならぬ**……」
**en**: Zero: "...**As computed**... **I must resist**, you see..."

---

#### `endgame_close.zero.0`
**ja**: ゼロ「……**いちか**よ……**もうすぐ、会える**……」
**en**: Zero: "...**Ichika**... **soon, we shall meet**..."

#### `endgame_losing.zero.0`
**ja**: ゼロ「……**ありがとう**、**異邦の打ち手**……**わたしは、ようやく、自由**だ……」
**en**: Zero: "...**Thank you**, **Outer Hand**... **I am, at last, free**..."

#### `final_move.haruki.0`
**ja**: ハルキ（**世界の最後の一手**…**重い**…**でも**、**いちかとゼロのために**、 ── **打つ**！）
**en**: Haruki: *(**The world's final move**... **heavy**... **but**, **for Ichika and Zero**, — **I play**!)*

---

> **動的セリフ集、これで完結。**
> **次は `04_ui_and_tutorial_text.md` ── タイトル/メニュー/設定/チュートリアルの UI 文言**
