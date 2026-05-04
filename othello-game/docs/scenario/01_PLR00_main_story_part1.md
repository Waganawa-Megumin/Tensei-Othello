# 📖 本編シナリオ / Main Story Script (PLR00 default Haruki)
## Part 1 — プロローグ + 第1〜5章

> このファイルは PLR00 デフォルトハルキの本編シナリオ。世界観は `00_WORLD_BIBLE.md` 準拠。トーンはラノベ調。
> 全セリフ・ナレーションは ja / en の i18n ペアで提供。
> 各章 = `intro` (章頭ナレーション) + `boss_pre` (対局前のキャラセリフ) + `boss_post` (対局終了直後の主人公の心の声) + `victory` (勝利時のキャラセリフ + ナレーション)

---

## 🎬 タイトル画面

### `title.tagline`
**ja**: 「石をひっくり返せ。世界も、ひっくり返せ。」
**en**: "Flip the stones. Flip the world."

### `title.subtitle`
**ja**: 〜転生したらオセロ世界でした！〜
**en**: ~ I Got Reincarnated into an Othello World! ~

### `title.start_button`
**ja**: 異邦の打ち手として、はじめる
**en**: Begin as the Outer Hand

---

## 🌌 プロローグ / Prologue

### `narrative.prologue.title`
**ja**: 序章「**放課後、世界が転換する**」
**en**: Prologue: *After-School Reversal*

### `narrative.prologue.text`
**ja**:
> 五時限目の古典の小テスト、名前しか書いてない。
> ハルキはそう思いながら、教室の窓から差す夕陽を眺めていた。
>
> ── そのときだ。
>
> **ぐらり、と床が傾いた。** いや、傾いたんじゃない。床のタイルが、一枚ずつ、**白と黒に染まっていく**。教室全体が、巨大なオセロ盤になろうとしていた。
>
> 「えっ、ちょ、まっ ──」
>
> 床が崩れる。机が宙を舞う。教科書のページがめくれて、その全ページが**棋譜**になっていく。
>
> 落ちながら、ハルキは妙に冷静な声を聞いた。
>
> 『**異邦の打ち手よ。盤上世界は、汝を待っていた。**』
>
> 「待ってない待ってない、こっちは待ってない！ せめて昼飯食べてから ──」
>
> ハルキの意識は、**白と黒の渦**に呑まれていった。

**en**:
> Fifth period: classical literature pop quiz. Name written. Nothing else.
> Haruki stared at the sunset bleeding through the classroom window, mentally preparing for his low score.
>
> — That's when it happened.
>
> **The floor tilted.** No, not tilted. Each floor tile was turning, one by one, into stark **black and white**. The entire classroom was transforming into a colossal othello board.
>
> "Wait. Wait, what — no, hold on—"
>
> The floor shattered. Desks took flight. Textbook pages ripped open and every single page filled with **game records**.
>
> Falling through space, Haruki heard a strangely calm voice:
>
> *"Outer Hand. The Board World has awaited you."*
>
> "Yeah, no — I haven't been awaiting you! At least let me eat lunch first—"
>
> Haruki's consciousness was swallowed by a **vortex of black and white**.

---

## 第1章 / Chapter 1 — いちか (アイドル / Lv.1)

### `chapter01.intro`
**ja**:
> 気がつくと、ハルキは**ステージの真ん中**に立っていた。
> ピンク色のスポットライト。ハートと星のバルーン。観客席はない。代わりに**オセロ盤が一台**。
>
> ── そして、目の前には。
>
> 「**はじめまして♡ 異邦の打ち手・ハルキくん♪**」
>
> 桃色ツインテールのアイドル少女が、ウィンクしながらマイクを差し出してきた。
>
> （**異世界初日からアイドル戦かよ。**）

**en**:
> When Haruki regained his senses, he was standing in the center of **a stage**.
> Pink spotlights. Heart and star balloons. No audience seats. Instead — **a single othello board**.
>
> — And in front of him.
>
> *"Nice to meet you ♡ Outer Hand Haruki ♪"*
>
> A pink-twintailed idol girl winked, holding out a microphone like an offering.
>
> *(Day one in the isekai and I'm already in an idol battle.)*

### `chapter01.boss_pre` (いちか)
**ja**: 「みんなを笑顔にする打ち手なら、ぜったい強いよ♪ ハルキくん、わたしと勝負しよ？」
**en**: "A player who makes everyone smile is *definitely* strong ♪ Haruki, will you play with me?"

### `chapter01.boss_post` (ハルキ心の声)
**ja**: （ピンクの空間で対局するの、**魂が削られる**んだけど？）
**en**: *(Playing othello in this much pink is genuinely eroding my soul.)*

### `chapter01.victory.dialogue` (いちか)
**ja**: 「すご〜い！ ハルキくん、ほんとに強いんだ！ えへへ、わたしの**初恋の対局**になっちゃった♡」
**en**: "Wow~! Haruki, you're really *good*! Heehee, this just became the **opening duel of my first crush** ♡"

### `chapter01.victory.narration`
**ja**:
> いちかは舞台の上で軽くお辞儀をした。
> 「次の街の達人・**葵ちゃん**は、紅葉の森にいるよ♪」
>
> （初恋って言ったか？ いや聞き間違いだろう。**多分。**）

**en**:
> Ichika gave a light bow on stage.
> "The next master, **Aoi**, is in the maple forest ♪"
>
> *(Did she say "first crush"? No, I must have misheard. **Probably.**)*

---

## 第2章 / Chapter 2 — 葵 (弓使い / Lv.2)

### `chapter02.intro`
**ja**:
> 紅葉の森に出ると、足元の石畳がオセロの盤目になっていた。木の幹には**石灯籠**。
> 落ち葉が舞う中、緑髪のポニーテール少女が弓を構えていた。**矢の先端は、なんと、白いオセロ石**。
>
> 「次の挑戦者は ── **君だね、異邦さん**？」

**en**:
> Stepping into the maple forest, the cobblestones beneath his feet were arranged in othello grid patterns. Stone lanterns dotted the tree trunks.
> Through the falling leaves, a green-haired ponytailed girl drew her bow. The **arrowhead was a white othello stone**.
>
> "So you're my next challenger — **the Outer one**, right?"

### `chapter02.boss_pre` (葵)
**ja**: 「狙いはバッチリだよっ！ 一手目で角を取って、君を**森に閉じ込める**から覚悟して！」
**en**: "My aim is *perfect*! First move I take a corner and **trap you in this forest** — get ready!"

### `chapter02.boss_post` (ハルキ心の声)
**ja**: （オセロ石で**矢を射る**ってどういう物理学？ いや、考えるだけ無駄か。）
**en**: *(Shooting **arrows made of othello stones** — what kind of physics is this? Yeah, no. Don't think about it.)*

### `chapter02.victory.dialogue` (葵)
**ja**: 「ぐぬぬ…見事！ でも次に会う時は、**百発百中で君の角を奪う**からね！」
**en**: "Tch...! Well played! But next time we meet, I'll **steal every corner with a perfect shot**!"

### `chapter02.victory.narration`
**ja**:
> 葵は弓を肩にかけ、紅葉を一枚拾い上げた。
> 「次の達人・**朝日**は、夕暮れの古寺にいるよ。剣士だから、気をつけて」
>
> 葉が一枚、ハルキの肩に落ちた。妙に重い。**オセロ石の重さがした。**

**en**:
> Aoi slung her bow over her shoulder and picked up a maple leaf.
> "The next master, **Asahi**, is at the old temple at sunset. He's a swordsman — be careful."
>
> A single leaf fell onto Haruki's shoulder. Strangely heavy.
> **It had the weight of an othello stone.**

---

## 第3章 / Chapter 3 — 朝日 (剣士 / Lv.3)

### `chapter03.intro`
**ja**:
> 古寺の境内、夕陽が紅葉を真っ赤に染めていた。
> 五重塔のシルエット。揺れる幟旗。そして、白い剣道着に藍の袴の少年が、**真剣**を抜いて立っていた。
>
> （え、剣道部の練習試合じゃなくて？ ガチの真剣？）
>
> 「いざ尋常に ── **打たれよ！**」

**en**:
> The old temple grounds. Sunset turned the maples blood-red.
> A five-story pagoda silhouetted against the sky. Banners snapping in the wind. And there, in white kendo gi and indigo hakama, a young swordsman stood with a **drawn katana**.
>
> *(Is this... not a kendo club practice match? Is that an **actual** sword?)*
>
> "On my honor, let us begin — **strike!**"

### `chapter03.boss_pre` (朝日)
**ja**: 「拙者の剣は、迷わぬ。**石の一手も、剣の一閃と同じ**。心を定め、参られよ」
**en**: "My blade does not waver. **A single stone is no different from a sword's strike.** Steady your heart, and come forth!"

### `chapter03.boss_post` (ハルキ心の声)
**ja**: （**剣豪と心理戦**してるんだけど。古典の小テストどころじゃない人生になってる。）
**en**: *(I'm in a **psychological duel with a literal swordsman**. My life has gone way beyond a classical literature pop quiz.)*

### `chapter03.victory.dialogue` (朝日)
**ja**: 「見事…！ 拙者の剣を、石で凌ぐとは ── **異邦の打ち手、その名に偽りなし**」
**en**: "Magnificent...! To turn my blade with mere stones — **the title of Outer Hand is no exaggeration**."

### `chapter03.victory.narration`
**ja**:
> 朝日は刀を鞘に納め、深く一礼した。
> 「次の達人・**なでしこ殿**は、深き森の泉にて待っておる。心を静めて参られよ」
>
> （礼儀正しい敵キャラ、**ありがたい**。胃が休まる。）

**en**:
> Asahi sheathed his katana and bowed deeply.
> "The next master, **Lady Nadeshiko**, awaits at the spring deep in the forest. Approach her with a calm heart."
>
> *(A polite boss — what a **blessing**. My stomach can finally rest.)*

---

## 第4章 / Chapter 4 — なでしこ (治療師 / Lv.4)

### `chapter04.intro`
**ja**:
> 森の奥に進むと、**苔むした石**と**水晶のように透き通った泉**があった。
> 木漏れ日が水面に反射して、空気そのものが優しい。
>
> 桃色の長い髪、白いベール、緑色の優しい瞳。
> 「ようこそ ── 旅でお疲れでしょう？ お茶が入っていますわ」
>
> （**これは罠か。** こんな優しい人が達人なわけ……あるな、たぶん。）

**en**:
> Deep in the forest, **moss-covered stones** surrounded a **spring as clear as crystal**.
> Sunlight filtered through the leaves, dancing on the water's surface — the very air felt gentle.
>
> Long pink hair, a white veil, kind green eyes.
> "Welcome — you must be tired from your journey. I have tea ready for you."
>
> *(**This is a trap, right?** No way someone this kind is a master... actually, yeah, definitely a master.)*

### `chapter04.boss_pre` (なでしこ)
**ja**: 「無理せずいきましょう。**急がずとも、勝ちはあなたを待っていますよ**」
**en**: "Let's not rush. **Even unhurried, victory will wait for you.**"

### `chapter04.boss_post` (ハルキ心の声)
**ja**: （**癒し系の達人にも普通に追い詰められる**。優しいまま追い詰めてくる。怖い。）
**en**: *(Even the **healer-type master is calmly cornering me**. With a smile. **Terrifying.**)*

### `chapter04.victory.dialogue` (なでしこ)
**ja**: 「ふふ、見事ですわ。ハルキ様には**お守り**を一つ ── 旅の疲れを癒す、緑の輝きです」
**en**: "Heehee, well done. Allow me to give you a **charm**, Haruki-sama — a green radiance to soothe your weary travels."

### `chapter04.victory.narration`
**ja**:
> なでしこは手のひらに緑色の光を集め、ハルキに渡した。
> 「次の達人・**響さん**は、提灯灯る橋のたもとにおります。あの方の音色は、**心を映します**。準備をなさって」
>
> （優しいまま強い人、**いちばん怖い**。）

**en**:
> Nadeshiko gathered green light in her palms and gifted it to Haruki.
> "The next master, **Hibiki**, sits by the bridge of lanterns. His music **mirrors the heart**. Prepare yourself."
>
> *(People who stay kind while they're **terrifyingly strong** are the scariest of all.)*

---

## 第5章 / Chapter 5 — 響 (吟遊詩人 / Lv.5)

### `chapter05.intro`
**ja**:
> 黄昏の橋。提灯の灯が水面に映って揺れ、空には**音符の形をした光**が浮かんでいた。
>
> 緑のベレー帽の少年が、リュートを爪弾きながら微笑む。
>
> 「やあ、待っていたよ。今夜は ── **ハルキくんのための一曲**を、用意したんだ」
>
> （**俺のためのテーマ曲**って、もう完全にラスボス前のフラグでは？）

**en**:
> Twilight bridge. Lantern lights rippled on the water below, and above floated **lights shaped like musical notes**.
>
> A boy in a green beret strummed his lute and smiled gently.
>
> "Ah, I've been waiting. Tonight — I've prepared a song **just for you, Haruki**."
>
> *(A theme song **made for me**? That's like... full final-boss flag energy?)*

### `chapter05.boss_pre` (響)
**ja**: 「音楽は予測のゲーム。**次の音、次の手** ── 心が読めれば、勝てるのさ」
**en**: "Music is a game of prediction. **The next note, the next move** — read the heart, and you win."

### `chapter05.boss_post` (ハルキ心の声)
**ja**: （**BGM付きでオセロ**してる人生、想像してた高校生活と違いすぎる。）
**en**: *(I'm playing othello with a **live BGM accompaniment**. This is so far from the high school life I imagined.)*

### `chapter05.victory.dialogue` (響)
**ja**: 「お見事！ 君の打つ音は、**まだ誰も奏でたことのない旋律**だったよ。 ── 旅の歌になるね」
**en**: "Splendid! Your stones played a **melody no one has composed before**. This will become a song of your journey."

### `chapter05.victory.narration`
**ja**:
> 響はリュートを置き、目を閉じた。
> 「次の達人は ── **つむぎ**。彼女の相棒は神獣だ。気を悪くしないでくれ、彼女の狐は**人見知り**でね」
>
> （**狐の人見知りに気を遣う異世界**。覚えておこう、いつか歌になるかもしれない。）

**en**:
> Hibiki set down his lute and closed his eyes.
> "The next master — **Tsumugi**. Her partner is a divine beast. Don't take it personally if her fox is **shy with strangers**."
>
> *(An isekai where you have to be **mindful of a fox's social anxiety**. Filing that away — might make a good song someday.)*

---

> **続きは Part 2 (`01_PLR00_main_story_part2.md`) へ → 第6〜10章**
