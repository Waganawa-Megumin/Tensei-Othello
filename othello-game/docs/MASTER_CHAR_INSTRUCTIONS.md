# 🎨 アバター リファインメント 統合指示書 (v2 - 新セッション用)

> **これは ChatGPT に新セッションで丸ごと最初に渡す指示書です。**
> 41 キャラのアバターをチャット式で 1 体ずつ生成していきます。
>
> 構成:
> - **§1 STYLE** — 全 41 キャラ共通のスタイル指針 (最初に把握)
> - **§2 PLR ROSTER** — プレイヤー 21 体のキャラ表
> - **§3 OPP ROSTER** — 対戦相手 20 体のキャラ表

---

## 🚨 まず、ChatGPT への重要なお願い (このまま貼り付けて使う)

```
You are about to refine 41 character avatars for the game
"召喚されたらオセロ世界でした！" (Summoned to an Othello World).

This will be a CHAT-STYLE workflow: I will request one character at a time.
For each request, I will tell you the character ID (e.g. PLR00, OPP05),
attach the reference image, and you will generate ONE refined version.

Please first read this entire document (§1 STYLE, §2 PLR ROSTER, §3 OPP ROSTER)
and confirm you understand. Do NOT generate any image until I explicitly request
one with a specific character ID.

CRITICAL — before starting, please confirm whether you can generate images with
TRANSPARENT BACKGROUND (RGBA alpha channel, alpha=0 around the character).

If transparent background is NOT supported in your image generation:
  → Just confirm "transparent background not supported, will deliver white
    background" — that's fine, the user will handle transparency on their side.

If transparent background IS supported:
  → Confirm "I will deliver RGBA PNG with transparent background."

Then wait for my first request (e.g. "Generate PLR00").
```

---

# §1 STYLE — 全 41 キャラ共通のスタイル指針

## 共通仕様 (毎回適用)

```
Resolution:    1024×1024 (square; no other size accepted)
Format:        PNG
Background:    TRANSPARENT if supported, otherwise pure white (#FFFFFF) is OK
               — but ABSOLUTELY NO circular frame, vignette, or border
Composition:   Bust-up portrait
               - Character's face center exactly at image center (vertically + horizontally)
               - Top of head occupies upper 5-10% of canvas (do NOT crop the hair)
               - Character fills 75-85% of vertical space
               - Both shoulders visible, framing ends around chest level
Art style:     Anime / light novel cover art quality
Lineart:       Clear inked lines in dark sepia (#3a2418 ~ #5a3a28). NO pure black.
Saturation:    One notch HIGHER than the reference image (vivid but not muddy)
Details:       Refined hair highlights, eye shine, fabric folds, accessories
Shadows:       Cool violet-tinted (slight #8a7aaa hint)
Highlights:    Warm amber-tinted (slight #ffd9a0 hint)
```

## 絶対に守ること (Hard Constraints)

1. **Identity preservation 100%**
   - The new character must be UNMISTAKABLY the same as the reference
   - Same face shape, hair (color, length, hairstyle), eye (color, shape, expression)
   - Same outfit details (every button, fold, accessory, color)
   - Same props (weapons, mic, books, etc.) at same general position
   - Same pose family (don't switch from frontal to profile)

2. **NO circular frames or borders**
   - The image must be a regular square
   - Circular cropping is done by CSS later — DON'T pre-crop into a circle
   - If you see a circle in your output, the result is WRONG

3. **NO baked background scenery**
   - Just transparent (or solid white if not supported)
   - DO NOT add scenery, gradient, pattern, or color tint
   - The reference images may have backgrounds — IGNORE those backgrounds

4. **NO text, logos, watermarks, signatures, dates**

5. **DO NOT crop the top of the head**
   - Always leave a small margin above the highest point of the hair

## やるべきこと (Quality Uplift Goals)

1. **Sharper lineart** — clean, deliberate inking, no fuzzy edges
2. **Higher saturation** — one notch up, but don't oversaturate
3. **Better hair highlighting** — visible strands, glossy highlights
4. **Eye sparkle** — clear iris detail, catchlight, vibrant color
5. **Fabric & accessory detail** — visible folds, button shine, prop texture

---

# §2 PLR ROSTER — プレイヤー 21 体

各プレイヤーは「召喚されたオセロ世界の旅人 / Summoned Outer Hand」。
PLR00 が固定主人公、PLR01〜20 はストーリー全クリア後にアンロックされるバリエーション主人公。

| ID | Slug | 名前 | EN | アーキタイプ | Archetype | 名言 |
|---|---|---|---|---|---|---|
| **PLR00** | default | あなた | You | 盤上世界の旅人 | Traveler of Bansho Sekai | 「いざ、参る」 |
| **PLR01** | haruki_heroic | 英霊ハルキ | Heroic Spirit Haruki | 英霊化された旅人 | Ascended Heroic Spirit | 「変分は、お前自身が紡ぐもの」 |
| **PLR02** | mikoto | 美琴 | Mikoto | 魔法学園の天才 | Magic Academy Prodigy | 「論理と魔法は同じ」 |
| **PLR03** | rin | リン | Rin | VRMMOの最強プレイヤー | VRMMO Top Player | 「現実より、得意なんだ」 |
| **PLR04** | ren | 蓮 | Ren | 剣道部主将 | Kendo Captain | 「正々堂々、参る」 |
| **PLR05** | chitose | 千歳 | Chitose | タイムリープ少女 | Time-Loop Girl | 「これで何度目だっけ」 |
| **PLR06** | haru | 晴 | Haru | 現代の陰陽師 | Modern Onmyoji | 「妖、見えてるんだ」 |
| **PLR07** | kai | カイ | Kai | 空の冒険者 | Sky Adventurer | 「風が呼んでる」 |
| **PLR08** | chinatsu | 千夏 | Chinatsu | 聖剣の村娘 | Holy Sword Village Girl | 「故郷を、必ず守る」 |
| **PLR09** | toru | 透 | Toru | 学園名探偵 | School Detective | 「謎には必ず答えがある」 |
| **PLR10** | noa | ノア | Noa | 未来から来た少女 | Girl from the Future | 「2099年から、よろしく」 |
| **PLR11** | nagi | 凪 | Nagi | 異世界料理人 | Isekai Chef | 「お腹空いてる？」 |
| **PLR12** | el | エル | El | 元魔王、今は転校生 | Ex-Demon King Transfer | 「ふふ、内緒だよ」 |
| **PLR13** | sumire | スミレ | Sumire | 記憶喪失の冒険者 | Amnesiac Adventurer | 「私は…誰なの？」 |
| **PLR14** | hazuki | 葉月 | Hazuki | 機械工学の天才 | Steampunk Genius | 「これ、私が作ったの！」 |
| **PLR15** | hayato | 隼人 | Hayato | 凄腕ガンナー | Master Gunner | 「撃つときは迷わない」 |
| **PLR16** | hikari | ひかり | Hikari | 光の精霊使い | Light Spirit User | 「みんな、笑ってほしい」 |
| **PLR17** | yoru | ヨル | Yoru | 半吸血鬼 | Half-Vampire | 「血は、欲しくない」 |
| **PLR18** | minato | 湊 | Minato | 海の冒険者 | Sea Adventurer | 「世界の果てへ」 |
| **PLR19** | souta | 奏太 | Souta | 天才ピアニスト | Prodigy Pianist | 「この旋律、聴いてくれ」 |
| **PLR20** | yu | 悠 | Yu | 神話の英雄 | Mythic Hero | 「神々よ、いざ尋常に」 |

## PLR キャラクター固有の維持ポイント

各キャラの「絶対変えてはいけない要素」を押さえてください:

- **PLR00 (あなた / You)**: Black tousled anime hair, warm brown eyes, gentle smile, dark navy school jacket with mandarin/standing collar buttoned at neck (visible brass buttons), white shirt collar peeking out. Approachable everyman.
- **PLR01 (英霊ハルキ / Heroic Spirit Haruki)**: BROWN spiky tousled windswept hair with subtle GOLDEN HIGHLIGHTS at the tips. WARM AMBER-BROWN EYES, calm and knowing. Black/dark navy ceremonial outfit with elaborate gold trim and embroidered patterns, asymmetric draped cape/mantle on one shoulder with gold filigree edges, white collared inner shirt, gold chain accents with PURPLE WOVEN CORDS, polished gold pauldron, gold compass-like medallion on chest, large gold circular emblem belt. Subtle GOLDEN HALO of light particles around head/shoulders. A small floating BLACK OTHELLO STONE hovering above one open palm (inherited from Zero, symbolizing his role as successor/guide). Heroic spirit aesthetic — the future, ascended form of PLR00 Haruki who returned from the journey and now guides others. Dignified yet kindly.

  > 💡 **アンロック条件**: PLR00 で章 20 をクリア (通常エンディング達成) 後にアンロック。**PLR01 で章 20 を再クリアすると真エンディング達成 (OPP21 + OPP22 アンロック)**。

  > 💬 **名言**: 「変分は、お前自身が紡ぐもの」 (英: "The variations are yours to weave.") ゼロ系 3 段階 (OPP20「全ての変分は計算済み。詰みだ」=絶望/閉じた予測 → OPP21「変分は閉じない。それが、面白い」=希望/開放 → OPP22「すべては φ の波動の狭間にある」=循環/包摂) に対し、PLR01 は「介入・継承」の立場。プレイヤー (PLR00 = 過去の自分) への二人称呼びかけ ("yours") で、過去帰還した先代から後輩への助言というロアを表現。

  > 💬 **デザインルーツ**: 章 20-B 真エンディング挿絵から逆輸入されたデザイン。挿絵とアバターの視覚整合は完璧。背景は遷移空間 (緑コードレイン → 桜花びら、中央に金光柱)。
- **PLR02 (美琴 / Mikoto)**: Glasses, long flowing dark/navy hair, intelligent eyes, school uniform layered with academic robe/cape, possibly holding magical tome. Scholarly aura.
- **PLR03 (リン / Rin)**: Modern stylish gamer aesthetic, possibly VR headset on neck/forehead, confident smirk, sharp eyes, contemporary haircut. Cool gaming vibe.
- **PLR04 (蓮 / Ren)**: Black hair (short or tied back), focused intense eyes, white kendo gi or kendo-themed uniform, disciplined posture. Bamboo sword (shinai) optional.
- **PLR05 (千歳 / Chitose)**: Soft pastel hair (pink/lavender), dreamy or wistful eyes, casual school uniform. Pocket watch / hourglass charm optional. Time-loop melancholy.
- **PLR06 (晴 / Haru)**: Black hair with bangs partly covering eyes, mysterious violet/purple eyes, modern school uniform layered with traditional haori jacket, magatama charm at neck.
- **PLR07 (カイ / Kai)**: Wind-tousled brown/sandy hair, bright spirited eyes, flight goggles on forehead/neck, light adventurer outfit. Free-spirited grin.
- **PLR08 (千夏 / Chinatsu)**: Long flowing chestnut/honey hair, kind warm eyes, simple village dress with religious accents, holy sword pendant or hilt visible. Pure determination.
- **PLR09 (透 / Toru)**: Sharp neat dark hairstyle, keen analytical eyes (glasses optional), school uniform with detective notebook visible. Sherlock-style intellect.
- **PLR10 (ノア / Noa)**: Silver/platinum hair, futuristic clothing (sleek lines, holographic accents), curious eyes. Sci-fi heroine.
- **PLR11 (凪 / Nagi)**: Apron over normal clothes, kitchen knife or ladle in hand, warm friendly smile, casual hair (could be tied back). Master chef confidence.
- **PLR12 (エル / El)**: Dark hair with reddish accents or crimson highlights, slightly intense eyes (one red optional), school uniform with subtle dark/gothic accents. Charming but menacing aura.
- **PLR13 (スミレ / Sumire)**: Light/silver hair, soft uncertain eyes, adventurer outfit (cape, leather), slightly lost expression. Beautiful but melancholic.
- **PLR14 (葉月 / Hazuki)**: Goggles on forehead, messy creative hair, work apron over clothes, holding tool/gear. Inventor's gleam.
- **PLR15 (隼人 / Hayato)**: Sharp confident look, tactical jacket or sniper outfit, holding pistol/rifle (tasteful), focused cool eyes.
- **PLR16 (ひかり / Hikari)**: Bright golden/blonde hair, luminous eyes, ethereal flowing outfit with light effects. Holy/radiant aesthetic.
- **PLR17 (ヨル / Yoru)**: Black or dark purple hair, red eyes, slightly pale skin, gothic/elegant outfit (frills, dark coat), subtle fangs in smile optional. Nocturnal mystery.
- **PLR18 (湊 / Minato)**: Sun-kissed skin, salt-tousled hair (could have blue/teal accents), nautical outfit (sailor-inspired), confident grin. Ocean wanderer.
- **PLR19 (奏太 / Souta)**: Refined black or chestnut hair, artistic sensitive eyes, formal concert attire (tuxedo or recital dress), elegant poise. Music in soul.
- **PLR20 (悠 / Yu)**: Heroic stance, divine aura, classical/legendary outfit (laurel, ancient armor accents, cape), confident god-like eyes. Pinnacle hero.

---

# §3 OPP ROSTER — 対戦相手 20 体

各 OPP は「盤上世界の達人 / Master of the Board World」。ストーリーの第N章 (Lv.N) のラスボス。

| ID | Slug | 名前 | EN | アーキタイプ | Archetype | 名言 |
|---|---|---|---|---|---|---|
| **OPP01** | ichika | いちか | Ichika | アイドル | Idol Singer | 「ふぁいとぉ♪ 楽しんで！」 |
| **OPP02** | aoi | 葵 | Aoi | 弓使い | Archer | 「狙いはバッチリだよっ！」 |
| **OPP03** | asahi | 朝日 | Asahi | 剣士 | Swordsman | 「いざ尋常に！」 |
| **OPP04** | nadeshiko | なでしこ | Nadeshiko | 治療師 | Healer | 「無理せずいきましょう」 |
| **OPP05** | hibiki | 響 | Hibiki | 吟遊詩人 | Bard | 「楽しい一局を奏でよう♪」 |
| **OPP06** | tsumugi | つむぎ | Tsumugi | 獣使い | Beast Tamer | 「相棒もわくわくしてる」 |
| **OPP07** | akane | 茜 | Akane | 技師 | Engineer | 「歯車みたいにかっちりね！」 |
| **OPP08** | mel | メル | Mel | 錬金術師 | Alchemist | 「ふふ、ちょっと混ぜてみよっか？」 |
| **OPP09** | satoru | 悟 | Satoru | 修行僧 | Monk | 「無心に石を置く、ただそれだけ」 |
| **OPP10** | shiki | シキ | Shiki | 盗賊 | Rogue | 「気付いた時には遅いよ」 |
| **OPP11** | shion | シオン | Shion | 魔術師 | Mage | 「すべては予測の内だ」 |
| **OPP12** | luna | ルナ | Luna | 夢の魔女 | Dream Witch | 「夢の中でもう勝ってるよ♡」 |
| **OPP13** | yukino | 雪乃 | Yukino | 学園軍師 | School Strategist | 「この程度、解析するまでもない」 |
| **OPP14** | akira | アキラ | Akira | 探偵 | Detective | 「君の手筋、見えているよ」 |
| **OPP15** | ciel | シエル | Ciel | サイバー斥候 | Cyberpunk Scout | 「全データ把握、戦況優位」 |
| **OPP16** | aria | アリア | Aria | 姫君 | Princess | 「お手柔らかに、ですわ」 |
| **OPP17** | leon | レオン | Leon | 騎士 | Knight | 「正々堂々、参る！」 |
| **OPP18** | sojiro | 宗次郎 | Sojiro | 侍 | Samurai | 「我が一刀、避けられはせぬ」 |
| **OPP19** | arashi | 嵐 | Arashi | 竜騎士 | Dragon Rider | 「我が竜の前に膝を折れ！」 |
| **OPP20** | zero | ゼロ | Zero | ハッカー (最終ボス) | Hacker (Final Boss) | 「全ての変分は計算済み。詰みだ」 |

## OPP キャラクター固有の維持ポイント

> **📌 v2 NOTE (2026-05-06 更新)**: 以下の記述は **実際に生成・承認された完成版キャラクター画像 (`completed_so_far/characters/`) に準拠** しています。これがキャラクターの正となります。再生成依頼や差分修正の際は、これらの記述と参照画像 (`reference_originals/`) を併せて参照してください。

- **OPP01 (いちか / Ichika)**: Long flowing pink hair with two large dark-pink/magenta floral bows holding side sections, pink eyes, frilly pink-and-white idol costume with magenta chest ribbon and central jewel, frilly cuff bracelets, holding microphone, winking with one hand outstretched. Sparkling cheer.
- **OPP02 (葵 / Aoi)**: Spiky shoulder-length green hair with side braid and white feather hair-ornament, bright green eyes, big open-mouthed grin, green cloak/cape over leather chest harness with gold star buckle, brown wooden bow visible behind shoulder, quiver of arrows. Forest hunter.
- **OPP03 (朝日 / Asahi)**: Young swordsman embodying **East-West Fusion Bushido**. Black shoulder-length hair tied back at the nape with a red cord, warm brown eyes, bright open-mouthed cheerful grin. White juban (under-kimono) with visible collar + indigo hakama trousers (Japanese inner layer). Black breastplate and shoulder pauldrons (Western plate armor style) with gold edge trim and engraved Eastern motifs (cherry blossom, family crest). Red haori-style scarf draped over one shoulder, red obi sash at waist. Single katana at waist with gold-filigree metal scabbard. NOT pure kendo gi, NOT pure Western plate — clear visual fusion of both. (NOTE: 既存挿絵 `chapter_03_*` は旧 §3 で描かれているため、本融合デザインに合わせて再生成必要)
- **OPP04 (なでしこ / Nadeshiko)**: Long pink hair beneath a white veil/headcovering trimmed with green and gold, white lily flower hair-ornament, gentle green eyes, white and green healer's robe with gold filigree and crystal pendant, holding ornate gold staff topped with leaves and a green crystal. Maternal peace.
- **OPP05 (響 / Hibiki)**: Bright golden-blonde wavy hair, green beret with gold trim adorned with a blue gem and white feather, warm brown eyes, big cheerful smile, white frilly cravat, dark coat with green cloak (gold trim and blue gem at the closure), holding wooden lute/mandolin. Warm troubadour.
- **OPP06 (つむぎ / Tsumugi)**: Beastfolk girl with short messy silver-white hair and prominent brown-and-white CAT EARS, bright green eyes, playful open-mouthed grin showing a small fang, green-and-brown tribal outfit with white fur trim and gold/leather accents, jewelled choker; with a SMALL BROWN FURRY BEAST COMPANION (raccoon-cat hybrid) perched on her shoulder. Wild beastfolk vibe (NOT a human braided traveler).
- **OPP07 (茜 / Akane)**: Bright orange hair tied in a HIGH PONYTAIL with leather cord, brass-and-leather aviator goggles pushed up on forehead, warm amber/orange eyes, big bright grin, sleeveless dark-brown leather VEST over red shirt (NOT an apron), brown fingerless gloves, holding large iron spanner/wrench in one hand, brass steam-pipe contraption visible over shoulder. Eccentric inventor.
- **OPP08 (メル / Mel)**: Long sage-green wavy hair with side braid, large GOLD METAL HEADBAND ornament (NOT a witch hat), gold round-rimmed glasses, golden-yellow eyes, soft smile, white high-collared shirt under green corset/bodice with elaborate gold filigree, brown leather alchemy backpack with multiple flask-tubes (green liquid) on her back, holding a bubbling green Erlenmeyer flask. Bookish alchemist (NOT a witch).
- **OPP09 (悟 / Satoru)**: Shaved head, gold geometric/diamond seal mark on forehead, calm green eyes (OPEN, slight gentle smile — not closed in meditation), BLACK outer robe over WHITE inner robe with gold trim (NOT orange Buddhist robes), very large brown wooden prayer beads (juzu/mala) draped diagonally across chest. Quietly serene zen monk.
- **OPP10 (シキ / Shiki)**: Black tousled hair with a prominent WHITE STREAK at the front, violet eyes, dark navy hooded outfit with PURPLE inner lining (hood down), black turtleneck under armored shoulder pieces with diamond/hexagonal crest, leather straps and buckle, fingerless gloves, holding a curved silver dagger; "shh" finger-to-lips pose with confident smirk. Roguish charm.
- **OPP11 (シオン / Shion)**: Long **lavender / light purple hair** (CRITICAL: NOT dark navy, NOT silver — clearly lavender purple), violet eyes with **round-rimmed glasses** (thin gold frames). Large purple/navy WITCH HAT with elaborate gold crescent-moon and star ornaments, red diamond gems both on hat band and dangling from thin gold chain at hat brim. Dark navy/purple cloak with gold trim, gold star pendant emblem on chest with inset purple gem. Refined celestial mystic / astrologer-mage. NOT holding a tome in portrait. (NOTE: 章別挿絵 `chapter_11_*` と完全整合 — 髪色・眼鏡・帽子・ローブすべて一致)
- **OPP12 (ルナ / Luna)**: Long lavender wavy hair, dreamy violet eyes with shiny highlights, LARGE dark-purple witch hat with gold trim and ornate amethyst gem decorations, gold and crystal star-shaped earrings dangling from hat brim, dark purple/black robe with gold cross/star embroidery, small smile with hand near face. Dreamy ethereal (NOTE: the transparent cubes / floating othello stones described in the lore are placed on the BACKGROUND LAYER, not on the character).
- **OPP13 (雪乃 / Yukino)**: Long **silver / light gray hair** (NOT dark navy, NOT black) flowing past shoulders, side braid tied with blue ribbon and gold star hairpin. **Round-rimmed glasses** (visible, framed). Blue eyes, calm intellectual gaze. Navy school blazer with gold trim and gold star embroidery on lapels, large red bow tie with central blue jewel ornament, beige sweater vest, white shirt collar. Cool data-strategist composure with hand-near-chin analyzing pose. (NOTE: holographic analysis screens described in lore are placed on the BACKGROUND LAYER, not on the character. 章別挿絵 `chapter_13_*` と整合)
- **OPP14 (アキラ / Akira)**: Brown checkered/plaid deerstalker hat, dark brown short tousled hair, sharp keen blue eyes, white shirt with brown checkered tie, dark checkered waistcoat, beige trench coat with high collar, BLACK leather gloves holding ornate gold-rimmed magnifying glass. Sherlockian sleuth.
- **OPP15 (シエル / Ciel)**: Silver/white tousled hair with single bright CYAN streak in front, large purple-and-cyan tinted goggles pushed up on forehead, HETEROCHROMIA (one violet eye + one blue eye), gentle confident smile, sleek black/cyan/purple cyberpunk hooded jacket with high collar, side-mounted headphones with mic, technical gadget on shoulder. Gender-ambiguous androgynous look.
- **OPP16 (アリア / Aria)**: Long flowing golden-blonde hair with elaborate braided crown/bun on top, sapphire blue eyes, gold tiara set with a large blue diamond gem, blue diamond gem dangling earrings, soft princess smile, royal elegance. **アバター用衣装**: White frilly off-shoulder ballgown with gold trim and blue diamond gem accents. **章別挿絵用衣装 (バリエーション)**: Sapphire blue ballgown with white gloves and lace fan.

  > 💡 **2026-05-06 確定**: マルチ衣装設定 — アリアは姫君として場面で衣装を変える設定。アバター (白ドレス) と章別挿絵 (青ドレス) の両方が canonical。共通の identifying features (髪・瞳・ティアラ・サファイアジュエル) は全衣装で一貫。
- **OPP17 (レオン / Leon)**: Tousled blonde hair, noble blue eyes, gentle confident smile, polished silver platemail with gold filigree trim, blue undertunic visible at neck, large gold star/sun-burst chest crest set with a central blue diamond gem (this is the "Othello Crest" emblem — also appears in the background banner). Chivalric knight (sword not visible in this bust portrait).
- **OPP18 (宗次郎 / Sojiro)**: Long indigo (deep blue-purple) hair flowing down past shoulders, scar across one cheek, wise weathered eyes with the gravity of many battles, calm and composed face of a battle-hardened veteran samurai. Beard/goatee adds to the seasoned appearance. Black warring-states armor (Sengoku-era ōyoroi style) with crimson cord lacing (緋縅), gold laurel-wreath family crest on the chest plate, traditional kabuto motifs. Two katanas at waist (大小二本差し / daishō). Aged but not frail — a master swordsman in his prime years of veteran experience. Stoic, dignified.
- **OPP19 (嵐 / Arashi)**: Spiky messy red hair, golden/amber eyes, big confident wild grin, gold-and-black ornate plate armor with white fur mantle on right shoulder, blue diamond gem set in a gold star/cross emblem on chest, with a SMALL RED DRAGON COMPANION perched directly on his left shoulder (gold horns, fierce golden eyes — small enough to sit on shoulder, NOT a giant blue dragon silhouette). Heroic dragon-rider energy.
- **OPP20 (ゼロ / Zero — FINAL BOSS、フード姿が標準アバター)**: Deep dark hood pulled up, ONE visible cyan-glowing eye (left), other eye and most of face hidden in shadow. Silver/white hair partially visible at front under the hood. Dark cyber-mask covering lower face. Black hooded cyberpunk cloak with elaborate cyan neon line patterns. Floating black othello stone with cyan halo near extended hand. Mysterious omnipotent presence — the supreme calculator who has transcended humanity. 背景はグリーンマトリクスコードレイン。

  > 💡 **2026-05-06 確定**: 世界観正本 §5.3 に従い、フード姿が OPP20 の標準アバター。あらゆるシーン (キャラ選択画面・ストーリー戦闘・フリー戦闘) でこのフード姿が表示される。フード無し版 (現世帰還後) は **OPP21** として独立した隠しキャラに分離。

- **OPP21 (ゼロ / Zero (現世帰還) — 隠しキャラ)**: Silver/white tousled hair (NO HOOD UP — face fully visible), violet eyes (BOTH visible — NOT a single cyan-glowing eye), playful confident smirk with hand near hair, TWO PAIRS of large headphones (one set worn on head, second set worn around neck) with cyan circular displays, black cyberpunk jacket with bright purple and cyan neon accents, hood-down on a high-collar hoodie. Cool playful hacker aesthetic — the human Zero who has been redeemed and returned to the modern world. 背景は現代日本の街中・夕暮れ。

  > 💬 **名言**: 「変分は閉じない。それが、面白い。予想の外へ飛び出したくなった。」 旧名言 (フード姿時代の「全ての変分は計算済み。詰みだ」) との対比により、ゼロの予測支配からの解放と能動的な人間性回復を一文で表現。シナリオ章 20 真エンディングのクライマックスで使用。

  > 💡 **アンロック条件**: PLR01 英霊ハルキで章 20 をクリア (= 真エンディング達成) 後にアンロック。それまではキャラ選択画面で `???` 表示 (CSS フィルタで黒塗り化、アセット側の対応不要)。

- **OPP22 (ヴォイドφ / Void-φ — 隠しの隠しボス)**: Half-divine post-human entity, the world's successor to Zero generated after the true ending. White-tinted silver hair with golden light gradient at the tips (representing φ golden ratio's mystical aura), cold violet-blue eyes fading to pure white light at iris center (crystalline, glowing, NOT warm violet like Zero's), expressionless or faintly serene smile (transcendent beauty). NO HOOD (in contrast to Zero's hooded form — the void here is open). Refined sleek cyberpunk attire (black base + cyan-violet neon, deeper and colder than Zero's). Flowing white/gold light veils replacing the hood. φ symbol decoration: golden spiral patterns on chest plate, pentagram-like geometry, golden ratio rectangles in armor, earrings with crystal pendants. A small floating GOLDEN SPIRAL of light hovering in the open palm (replacing Zero's black othello stone). 背景は黄金螺旋+幾何学+銀河の神性宇宙空間 (ゼロのグリーンマトリクスとは対極の冷たい青紫+純白+淡金)。

  > 💬 **名言**: 「すべては φ の波動の狭間にある」 (英: "All exists between the waves of φ.") OPP21 ゼロの「変分は閉じない、外へ飛び出したくなった」との対比 — ゼロが「外」を志向するのに対し、ヴォイドφ は「すべては既に内側にある」と語る。「外へ出ようとした者」と「すべてを内に含む者」の対比構造で世界観の循環テーマを体現。

  > 💡 **アンロック条件**: 真エンディング達成後 (= OPP21 アンロック後) にフリーモードまたは隠しモードで挑戦可能な特別ボスとして独立。ストーリーモードには登場しない。

---

# 🎬 チャット式運用ルール (User → ChatGPT)

ChatGPT が指示書全文を把握したら、ユーザーは以下の形式で1体ずつ依頼:

```
Generate avatar refinement for: PLR00

[reference image attached: PLR00_default.png]
```

ChatGPT は以下を実施:
1. §2 PLR ROSTER から PLR00 のキャラデータを引く
2. §1 STYLE の共通仕様に従う
3. PLR00 固有の維持ポイント (黒髪・濃紺学生ジャケット等) を維持
4. 1024×1024 PNG で出力 (透明背景が出せるなら透明、出せないなら白)

ユーザーが OK を出したら次のキャラへ。NG なら具体的な修正点を伝えて再生成。

## 41体の生成順 (推奨)

```
PLR00 → PLR01 → PLR02 → ... → PLR20  (21体)
OPP01 → OPP02 → OPP03 → ... → OPP20  (20体)
```

ただし**順序は厳密でなくてもOK**。気になるキャラから着手しても問題ない。

---

# ⚠️ 過去の失敗から学んだ重要事項

前回の試行で以下の問題が発生 — 今回は明示的に対策:

| 問題 | 原因 | 対策 |
|---|---|---|
| 解像度が 1254×1254 になった | サイズ指定が曖昧 | §1 で「1024×1024 (square; no other size accepted)」と明記 |
| 背景が白塗りで RGB 出力 (アルファ無し) | DALL-E 系が透明出力非対応 | §1 で「透明出せないなら白でOK」と明示。ユーザー側で透過処理 |
| 円形フレームが画像に焼き込まれた | リファレンスの円が引き継がれた | §1 で「NO circular frames」を強調 |

---

# 📋 受領後のユーザー側処理 (参考)

ユーザー側 (Claude) で以下を自動実施:

1. ✅ 解像度を 1024×1024 にリサイズ (必要なら)
2. ✅ 背景が白なら自動で透明化処理 (背景透過アルゴリズム)
3. ✅ ファイル名を正しく保存 (例: `PLR00_default.png`)
4. ✅ 検証 (透明背景・キャラ維持・サイズ)
5. ✅ 進捗トラッカー更新

これで ChatGPT は**画像生成のクオリティに集中**でき、後処理はユーザー側で確実に保証される分業になる。

---

# ✅ さあ始めよう

ChatGPT が `§1 §2 §3` を読んで「準備完了」と返答したら、ユーザーは:

```
Generate avatar refinement for: PLR00

[PLR00_default.png attached]
```

から開始。1体ずつチャット形式で進めていく。
