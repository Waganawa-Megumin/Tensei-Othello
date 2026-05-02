# 主人公キャラクター画像生成プロンプト集

オセロのプレイヤー側 20体の主人公アバター用、京アニ風の画像生成プロンプトです。
RPG・ライトノベルの王道主人公アーキタイプを反映。

---

## 使い方

前回のキャラクター画像と同様の手順:
1. 各 **English prompt** を Midjourney / DALL-E 3 / Stable Diffusion / NovelAI へ
2. **正方形 (1:1) 512×512 もしくは 1024×1024** で生成
3. PNG をダウンロードし base64 化
4. `othello.jsx` の `AVATARS` 配列の対応エントリの `image: null` を `image: 'data:image/png;base64,...'` に書き換え

---

## 共通スタイル指定

各プロンプトに既に組み込んでいますが、調整が必要な場合の参考に:

> **Style suffix**: *in the style of Kyoto Animation, soft slice-of-life Japanese anime aesthetic, warm cel-shading, large expressive eyes with multiple light catchlights, painterly watercolor backgrounds, soft pastel color grading, head and shoulders bust portrait, centered composition, 1:1 square*

> **Common negative**: *photorealism, 3D render, harsh shadows, deformed face, extra fingers, blurry, low quality, watermark, signature, text*

---

## 1. ハルキ — 異世界転生の勇者
**設定**: 平凡な日本の高校生だったが、ある日異世界に転生してしまった少年。前世の知識を武器に冒険する。

**English prompt**:
> A cheerful Japanese anime teenage boy in his late teens, brown spiky tousled hair, bright determined hazel-amber eyes, modern Japanese school uniform white shirt with a leather adventurer's vest layered over it, holding a softly glowing magical sword, fantasy forest meadow background with floating motes of light, golden hour rays through trees, in the style of Kyoto Animation, soft warm cel-shading, isekai light novel aesthetic, head and shoulders portrait, 1:1 square

---

## 2. 美琴 — 魔法学園の天才
**設定**: 名門魔法アカデミアの首席。冷静で論理的、感情をあまり表に出さないが内には強い意志を秘めている。

**English prompt**:
> A composed Japanese anime girl in her late teens, long flowing raven-black hair tied with a navy blue silk ribbon, intelligent violet eyes behind delicate wire-rimmed glasses, formal magic academy uniform with gold trim and a star-shaped magical pin on collar, holding a small leather-bound glowing tome, gothic stone library background with stained glass windows, cool soft afternoon light, in the style of Kyoto Animation, slice-of-life magic school aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 3. リン — VRMMOの最強プレイヤー
**設定**: 現実では内気で口下手だが、ゲーム内では伝説の最強プレイヤー。

**English prompt**:
> A reserved Japanese anime girl in her teens, short bob-cut chestnut brown hair, gray-blue eyes with a quiet thoughtful expression, wearing dark purple oversized gaming hoodie over a white tee, large gaming headphones with cyan accent lights, futuristic VR visor pushed up to her forehead, holographic UI interfaces and game windows floating around her, dimly lit gamer room background with pink and cyan neon glow, in the style of Kyoto Animation, modern cyberpunk slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 4. 蓮 — 剣道部主将
**設定**: 高校剣道部主将。鋼の精神と高い責任感の持ち主。生真面目で正々堂々とした性格。

**English prompt**:
> A disciplined Japanese anime high school boy, neat short black hair slightly damp with sweat, sharp brown eyes with a focused serene expression, traditional kendo uniform white kendogi and indigo hakama, holding a bamboo shinai over shoulder, traditional wooden dojo background with paper screens, dust motes in golden afternoon light streaming through, in the style of Kyoto Animation, sports slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 5. 千歳 — タイムリープ少女
**設定**: 同じ一日を何度も繰り返している少女。何もかもを既に知っているような達観した目をしている。

**English prompt**:
> A pensive Japanese anime girl in her late teens, long pale silver hair with subtle light blue tips, melancholy lavender eyes that seem to know too much, soft sad smile, wearing a school uniform with subtle clock motif embroidered on the collar, broken antique pocket watch hanging from a chain around her neck, surreal ethereal background with floating clock fragments and frozen falling cherry blossom petals, soft pink ambient light, in the style of Kyoto Animation, melancholic time-loop aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 6. 晴 — 現代の陰陽師
**設定**: 古都に住む高校生。妖怪が見える特殊な家系の血を引く現代の陰陽師。

**English prompt**:
> A confident Japanese anime high school boy in school uniform, messy black hair with a single white streak in front, sharp gold-flecked dark amber eyes with a slight smirk, modern dark school blazer with a paper ofuda talisman tucked behind one ear, traditional Japanese magic circle in soft glowing blue light behind him, dusk Kyoto street with red torii gate in soft focus, painterly background, in the style of Kyoto Animation, urban fantasy aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 7. カイ — 空の冒険者
**設定**: 飛空艇を操る空の旅人。風と話せると言われる若き冒険者。

**English prompt**:
> An adventurous Japanese anime teenage boy with windswept sandy blond hair, bright sky-blue eyes full of wanderlust, brown leather aviator jacket with fur collar, brass goggles pushed up on forehead, blue silk scarf flowing in the wind, airship clouds and floating fantasy islands background, golden sunset rays painting the sky in warm hues, in the style of Kyoto Animation, sky pirate adventure aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 8. 千夏 — 聖剣の村娘
**設定**: 田舎の村で育った素朴な少女。しかし彼女は伝説の聖剣を抜く運命を背負っていた。

**English prompt**:
> A determined Japanese anime girl with shoulder-length warm honey-brown hair tied in a loose side braid, brave hazel eyes, simple cream-colored village dress with leather corseted straps, hand resting on the hilt of a glowing legendary sacred sword strapped to her back, summer countryside meadow background with distant village rooftops in soft focus, golden hour warm light, in the style of Kyoto Animation, classic JRPG heroine aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 9. 透 — 学園名探偵
**設定**: 謎の転入生。クラスで起こる事件をことごとく解決していく頭脳派。

**English prompt**:
> A sharp-eyed Japanese anime high school boy with neat dark navy hair slightly tousled, piercing intelligent gray-blue eyes with a knowing expression, wearing a high school uniform with a casually loosened black tie, leaning thoughtfully with hand at chin, classroom or library background with sunlight streaming through tall windows creating dust motes, in the style of Kyoto Animation, mystery slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 10. ノア — 未来から来た少女
**設定**: 2099年の未来から、何かを変えるために現代に送られてきた半機械の少女。

**English prompt**:
> An ethereal Japanese anime girl in her teens, sleek silver-platinum hair in a sharp asymmetric bob, calm cyan-tinted eyes with a subtle digital iris pattern, wearing a futuristic white and cyan high-collar bodysuit with glowing circuit accents along the seams, transparent holographic data panels floating around her, neon-lit futuristic Tokyo cityscape at night background with rain reflections, in the style of Kyoto Animation, sci-fi cyberpunk aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 11. 凪 — 異世界料理人
**設定**: 元現代の料理人。ある日異世界に飛ばされ、現代の食文化で人々を救うようになる。

**English prompt**:
> A friendly Japanese anime young woman in her early 20s, warm chestnut hair tied back in a low ponytail, kind warm brown eyes with a welcoming smile, wearing a white modern chef's apron over a casual sky-blue shirt, holding a wooden spoon and a small steaming bowl, fantasy tavern kitchen background with hanging copper pots and dried herbs, warm golden fireside lighting with steam rising, in the style of Kyoto Animation, cozy isekai cooking aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 12. エル — 元魔王、今は転校生
**設定**: かつて魔王として世界を脅かしたが、なぜか今は普通の高校生として生活している謎の転校生。

**English prompt**:
> A mysterious Japanese anime high school student with long flowing silver-white hair, charming gentle smirk, glowing crimson red eyes with subtle slit pupils carefully hidden behind a calm composed smile, wearing a perfectly normal Japanese school uniform with a small dark crown pin barely visible on the collar, dim school hallway background with subtle violet aura around the figure, in the style of Kyoto Animation, urban fantasy slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 13. スミレ — 記憶喪失の冒険者
**設定**: 自分が誰なのか覚えていない少女。手がかりを求めて旅をしている。

**English prompt**:
> A wistful Japanese anime girl with messy lavender-violet medium-length hair, lost amethyst eyes searching for something distant, gentle uncertain expression, wearing a torn but elegant traveler's hooded cloak with frayed edges, fragments of a broken silver locket on a chain around her neck, misty foggy ancient ruins background with broken stone pillars, soft pale cool morning light, in the style of Kyoto Animation, melancholic fantasy aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 14. 葉月 — 機械工学の天才
**設定**: 蒸気機関時代の天才メカニック少女。新しい発明に夢中の好奇心旺盛な性格。

**English prompt**:
> An energetic Japanese anime girl in her teens, vibrant copper-orange messy ponytail with stray strands, bright amber eyes full of curiosity, wearing brown leather work apron over a white blouse, brass goggles pushed up on forehead, holding a wrench in one hand and a half-built brass mechanical contraption in the other, steampunk workshop background with gears, brass pipes, and blueprints, warm afternoon workshop lighting, in the style of Kyoto Animation, steampunk slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 15. 隼人 — 凄腕ガンナー
**設定**: 早撃ちの達人。寡黙でクールだが、仲間思いの一面も。

**English prompt**:
> A stoic Japanese anime young man in his late teens to early 20s, short messy jet black hair, sharp serious dark eyes with a piercing focused gaze, wearing a long dark coat with high collar over a leather harness with multiple gun holsters visible, holding a sleek modern revolver casually, dramatic gritty city alleyway background at twilight with light rain, in the style of Kyoto Animation, modern action thriller aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 16. ひかり — 光の精霊使い
**設定**: 光の精霊を操ることができる優しい巫女。誰かを助けるためなら自分を犠牲にすることもいとわない。

**English prompt**:
> A gentle Japanese anime girl with long flowing pale blonde hair with soft golden highlights, kind sky-blue eyes with a serene smile, wearing a white shrine maiden inspired dress with delicate gold trim and a green leaf accent, holding a small floating orb of warm golden light, soft sunlit meadow background with golden particle motes drifting in the air, dawn light, in the style of Kyoto Animation, fantasy healer aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 17. ヨル — 半吸血鬼
**設定**: 人間と吸血鬼のハーフ。血を吸わずに済む方法を探している、孤独な夜の住人。

**English prompt**:
> A brooding Japanese anime young man with disheveled jet-black hair with subtle red highlights, deep crimson eyes with vertical slit pupils, slight fanged smirk, wearing a dark gothic high-collared coat with red cravat at the throat, against a moonlit gothic Tokyo night cityscape background with a crimson moon, dramatic moody atmosphere, in the style of Kyoto Animation, gothic urban fantasy aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 18. 湊 — 海の冒険者
**設定**: 海賊船の若き航海士。世界の果てを夢見る冒険者。

**English prompt**:
> An adventurous Japanese anime teenage boy with sun-bleached medium-length blue-tinged black hair, bright sea-green eyes full of excitement, wearing an open white sailor shirt over a navy striped undershirt, weathered red bandana around forehead, ship's deck background with white sails and wide ocean horizon at golden sunset, sea spray in the air, in the style of Kyoto Animation, ocean adventure aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 19. 奏太 — 天才ピアニスト
**設定**: 若くして世界的に注目される天才ピアニスト。音楽を語るときだけ饒舌になる。

**English prompt**:
> A graceful Japanese anime young man in his late teens, soft slightly tousled honey-brown hair, gentle warm hazel eyes with long lashes, calm artistic expression, wearing a formal black concert tailcoat with crisp white shirt and black bow tie, hands raised gracefully over a grand black piano with golden musical notes drifting in the air around him, classical concert hall background with crystal chandeliers in soft focus, warm spotlight, in the style of Kyoto Animation, music slice-of-life aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 20. 悠 — 神話の英雄
**設定**: 神々の戦いに召喚された英雄。全ての試練を乗り越え、究極の戦いに挑む。

**English prompt**:
> A heroic Japanese anime young man in his early 20s, long flowing dark midnight-black hair partially tied back, fierce determined gold eyes, wearing intricate ornate divine armor with celestial silver patterns and a flowing deep blue cape, holding a glowing legendary spear of light, epic Mount Olympus-style sky background with parting clouds and divine golden rays piercing through, dramatic divine lighting, in the style of Kyoto Animation, epic fantasy mythic aesthetic, soft cel-shading, head and shoulders portrait, 1:1 square

---

## 反映後のコード例

```javascript
const AVATARS = [
  { kanji: '春', name: 'ハルキ', setting: '異世界転生の勇者', quote: '冒険、はじまったな',
    image: 'data:image/png;base64,iVBORw0KGgoAAAA...' },  // ← 生成画像をbase64で
  // ... 他19キャラも同様
];
```

`AvatarBadge` コンポーネントが image を優先表示し、null なら漢字フォールバックする実装になっているので、お気に入りから順次差し替えで OK です。

---

## ロスター一覧

| Lv | 名前 | 主人公アーキタイプ |
|---|---|---|
| 1 | ハルキ | 異世界転生 |
| 2 | 美琴 | 魔法学園 |
| 3 | リン | VRMMO |
| 4 | 蓮 | 学園剣道 |
| 5 | 千歳 | タイムリープ |
| 6 | 晴 | 現代陰陽師 |
| 7 | カイ | 空の冒険 |
| 8 | 千夏 | 聖剣 |
| 9 | 透 | 学園推理 |
| 10 | ノア | SF未来 |
| 11 | 凪 | 異世界料理 |
| 12 | エル | 元魔王 |
| 13 | スミレ | 記憶喪失 |
| 14 | 葉月 | 蒸気機械 |
| 15 | 隼人 | ガンアクション |
| 16 | ひかり | 光の精霊 |
| 17 | ヨル | 半吸血鬼 |
| 18 | 湊 | 大海航路 |
| 19 | 奏太 | 音楽 |
| 20 | 悠 | 神話 |

**設計意図**: 京アニ風スライス・オブ・ライフ系から、SF・ダークファンタジー・冒険ものまで、ライトノベル / RPG の主人公アーキタイプを 20 ジャンル網羅。男女比はほぼ半々、現代～異世界～未来～神話と時代もばらけて、誰でもお気に入りが見つかる構成にしました。
