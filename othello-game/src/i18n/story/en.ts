/**
 * English story content (PLR00 default route).
 *
 * Source: `othello-game/docs/scenario/01_PLR00_main_story_part{1..4}.md`
 * Author: user (Pack 1, received 2026-05-04).
 *
 * `**bold**` markdown emphasis is preserved intentionally; render via
 * `src/i18n/story/render.tsx` `renderEmphasized()` which converts the
 * markers into `<strong>` spans.
 */
import type { StoryContent, ChapterStory } from './types';

const ch = (
  intro: string,
  bossPre: string,
  bossPost: string,
  victoryDialogue: string,
  victoryNarration: string,
): ChapterStory => ({ intro, bossPre, bossPost, victoryDialogue, victoryNarration });

export const STORY_EN: StoryContent = {
  prologue: {
    tagline: 'Flip the stones. Flip the world.',
    subtitle: '~ I Got Summoned into an Othello World! ~',
    startButton: 'Begin as the Outer Hand',
    title: 'Prologue: After-School Summons',
    text: `Fifth period: classical literature pop quiz. Name written. Nothing else.
Haruki stared at the **sunset** bleeding through the classroom window, mentally bracing for the inevitable failing grade.

— That's when it happened.

A pattern of **golden geometry** began to glow softly on the floor at his feet.
Circles. Stars. Letters in a script he didn't recognise. Centred on him, drawing a **summoning circle**.

"Wait, what... is this..."

Together with a high-pitched ring in his ears, his vision lurched.
A **vortex of black and white** erupted upward from beneath Haruki's feet, repainting the classroom in a single sweep.`,
  },

  chapterStories: [
    // Ch.1 Ichika
    ch(
      `**Stepping through the door**, Haruki found himself standing in the center of **a stage**.
Pink spotlights. Heart and star balloons. No audience seats. Instead — **a single othello board**.

— And in front of him.

*"Nice to meet you ♡ Outer Hand Haruki ♪"*

A pink-twintailed idol girl winked, holding out a microphone like an offering.

*(Day one of being summoned, and I'm already in an idol battle.)*`,
      `"A player who makes everyone smile is *definitely* strong ♪ Haruki, will you play with me?"`,
      `*(Playing othello in this much pink is genuinely eroding my soul.)*`,
      `"Wow~! Haruki, you're really *good*! Heehee, this just became the **opening duel of my first crush** ♡"`,
      `Ichika gave a light bow on stage.
"The next master, **Aoi**, is in the maple forest ♪"

*(Did she say "first crush"? No, I must have misheard. **Probably.**)*`,
    ),
    // Ch.2 Aoi
    ch(
      `Stepping into the maple forest, the cobblestones beneath his feet were arranged in othello grid patterns. Stone lanterns dotted the tree trunks.
Through the falling leaves, a green-haired ponytailed girl drew her bow. The **arrowhead was a white othello stone**.

"So you're my next challenger — **the Outer one**, right?"`,
      `"My aim is *perfect*! First move I take a corner and **trap you in this forest** — get ready!"`,
      `*(Shooting **arrows made of othello stones** — what kind of physics is this? Yeah, no. Don't think about it.)*`,
      `"Tch...! Well played! But next time we meet, I'll **steal every corner with a perfect shot**!"`,
      `Aoi slung her bow over her shoulder and picked up a maple leaf.
"The next master, **Asahi**, is at the old temple at sunset. He's a swordsman — be careful."

A single leaf fell onto Haruki's shoulder. Strangely heavy.
**It had the weight of an othello stone.**`,
    ),
    // Ch.3 Asahi
    ch(
      `The old temple grounds. Sunset turned the maples blood-red.
A five-story pagoda silhouetted against the sky. Banners snapping in the wind. And there, in white kendo gi and indigo hakama, a young swordsman stood with a **drawn katana**.

*(Is this... not a kendo club practice match? Is that an **actual** sword?)*

"On my honor, let us begin — **strike!**"`,
      `"My blade does not waver. **A single stone is no different from a sword's strike.** Steady your heart, and come forth!"`,
      `*(I'm in a **psychological duel with a literal swordsman**. My life has gone way beyond a classical literature pop quiz.)*`,
      `"Magnificent...! To turn my blade with mere stones — **the title of Outer Hand is no exaggeration**."`,
      `Asahi sheathed his katana and bowed deeply.
"The next master, **Lady Nadeshiko**, awaits at the spring deep in the forest. Approach her with a calm heart."

*(A polite boss — what a **blessing**. My stomach can finally rest.)*`,
    ),
    // Ch.4 Nadeshiko
    ch(
      `Deep in the forest, **moss-covered stones** surrounded a **spring as clear as crystal**.
Sunlight filtered through the leaves, dancing on the water's surface — the very air felt gentle.

Long pink hair, a white veil, kind green eyes.
"Welcome — you must be tired from your journey. I have tea ready for you."

*(**This is a trap, right?** No way someone this kind is a master... actually, yeah, definitely a master.)*`,
      `"Let's not rush. **Even unhurried, victory will wait for you.**"`,
      `*(Even the **healer-type master is calmly cornering me**. With a smile. **Terrifying.**)*`,
      `"Heehee, well done. Allow me to give you a **charm**, Haruki-sama — a green radiance to soothe your weary travels."`,
      `Nadeshiko gathered green light in her palms and gifted it to Haruki.
"The next master, **Hibiki**, sits by the bridge of lanterns. His music **mirrors the heart**. Prepare yourself."

*(People who stay kind while they're **terrifyingly strong** are the scariest of all.)*`,
    ),
    // Ch.5 Hibiki
    ch(
      `Twilight bridge. Lantern lights rippled on the water below, and above floated **lights shaped like musical notes**.

A boy in a green beret strummed his lute and smiled gently.

"Ah, I've been waiting. Tonight — I've prepared a song **just for you, Haruki**."

*(A theme song **made for me**? That's like... full final-boss flag energy?)*`,
      `"Music is a game of prediction. **The next note, the next move** — read the heart, and you win."`,
      `*(I'm playing othello with a **live BGM accompaniment**. This is so far from the high school life I imagined.)*`,
      `"Splendid! Your stones played a **melody no one has composed before**. This will become a song of your journey."`,
      `Hibiki set down his lute and closed his eyes.
"The next master — **Tsumugi**. Her partner is a divine beast. Don't take it personally if her fox is **shy with strangers**."

*(An isekai where you have to be **mindful of a fox's social anxiety**. Filing that away — might make a good song someday.)*`,
    ),
    // Ch.6 Tsumugi
    ch(
      `Stepping into the bamboo grove, **moss-covered stone lanterns** lined a small stream.
A chestnut-braided girl sat with a massive white fox — a divine beast — at her side.

"Wah, you're here! My buddy's getting excited!"

The fox locked eyes with Haruki and hissed: ***SHAA!***

"S-sorry! He's a bit shy with strangers."

*(A **shy divine beast**. The genre is too free-wheeling.)*`,
      `"Othello is a game **for two** — but I play it **with three**. Buddy, lend me your wisdom!"`,
      `*(A **fox is whispering tactical advice** to my opponent. I'm not sure where this falls on the animal ethics spectrum.)*`,
      `"Aww — buddy, so close! Haruki, you were amazing! Let's play again sometime, okay?"`,
      `The fox huffed once, then gave Haruki's hand a quick ***lick***.
"The next master is **Akane**. She's in her invention workshop. Big machine lover — she'll show you tons of weird inventions!"

*(I, Haruki, have been **acknowledged by a divine fox**. Today's main quest may already be cleared.)*`,
    ),
    // Ch.7 Akane
    ch(
      `The workshop door opened to a sea of **brass gears**, **steam pipes**, and **bottles of glowing blue liquid**.

A red-haired side-ponytail girl pushed up her goggles and looked up from a **brass-framed othello board**.

"Oh! You're the Outer Hand? Hey hey, look at this! I built a **steam engine into an othello board**! Don't ask me why!"

*(I have no problem with people who show off **completely useless inventions** with that much enthusiasm.)*`,
      `"Heheheh, my board has an **auto-flipping mechanism**! Saves your wrist! ...Wait, that doesn't change the rules, does it."`,
      `*(The **mechanism is broken**, so we're flipping by hand anyway. Inventor problems?)*`,
      `"Ngh, I lost...! But my next prototype's gonna be **way cooler**! I'll analyze your form and build a counter-board ♪"`,
      `Akane plucked a blue screw from her toolbox and handed it to Haruki.
"Thanks for the match! ...I don't actually know what this screw is for. The next master is **Mel**. Alchemy workshop. She's a fellow inventor!"

*(A master who hands out **screws of unknown purpose** as gifts. If this needs to go in the official game record, I'll struggle to write it up.)*`,
    ),
    // Ch.8 Mel
    ch(
      `A dim violet workshop. **Green smoke swirled inside flasks**, shelves crammed with **countless potion bottles**. The floor: **a checkered pattern with real othello stones scattered across it**.

A green-haired girl in a witch's hat and round glasses smiled, holding up a flask.

"Welcome, Outer one. — Mind if I call you Haruki? Care for a **potion** in place of tea?"

*(Offering a **potion as a tea substitute** — universally code for "do not drink.")*`,
      `"Alchemy is the **art of combining elements to create something new**. Othello is the same — mixing **black and white** to create **a new board**."`,
      `*(First time meeting someone who **frames othello as alchemy**. Sounds profound. Or maybe just convoluted.)*`,
      `"Heehee, well played. Your moves are **specimens worth preserving**. — Here, a small vial as thanks. **Do not drink it**, okay?"`,
      `Mel handed Haruki a small violet vial. **The cork was labeled "DO NOT DRINK"**.
"The next master is **Satoru**, a monk in the mountain temple. In his presence... well, you'll understand when you get there."

*(A master who hands you a vial **literally labeled DO NOT DRINK** — I respect the chaos energy.)*`,
    ),
    // Ch.9 Satoru
    ch(
      `A mountain temple floating above a sea of clouds.
Colonnade corridors. Distant mountains in haze. **No sound at all.**

A young monk with a shaved head, orange robes, and a golden seal mark on his forehead sat with closed eyes.
A **single black stone hovered above his palm**.

"...You have come."
Eyes still closed.
"Let us play. **Words are unnecessary**."

*(**No conversation during the game?** This might be the most awkward type of duel in any isekai.)*`,
      `"**There is a strength in not playing.** Have you ever known it?"`,
      `*(**Strength in not playing** — does that mean... passing? Othello does have passes, but I feel like that's not what he means.)*`,
      `"...Magnificent. Your moves carried **hesitation**. — **And it was for that very reason that you won**."`,
      `Satoru opened his eyes for the first time. Gentle brown irises.
"The next master is **Shiki**, the thief of moonlit nights. — When you meet him, **mind the rooftops**."

*(**"Mind the rooftops"** — usually you're warned about the ground, right? ...Oh. Oh no, he literally drops from the roof, doesn't he.)*`,
    ),
    // Ch.10 Shiki
    ch(
      `A castle town under moonlight. Tile roofs glinting silver.
Haruki walked the cobblestones, **eyes constantly tilted upward**. Thanks to Satoru's warning.

— *Tap.*

A figure dropped lightly from a rooftop.

Black hair with a white streak, violet eyes. Spinning **a black stone between his fingers**.

"Heh — you were looking up the whole time, weren't you? **I can come from below too, you know.**"

*(That warning was **only half useful**. Monk, you played me.)*`,
      `"My hand **steals**. — Your corner, **I'll claim it at the very last second**."`,
      `*(A boss who **announces "I'll steal your corner at the last moment"** is genuinely terrifying. **He's going to deliver, isn't he.**)*`,
      `"Tch — you saw through it...? You **stole my own announcement back**? — Heh. I like that. I like *you*."`,
      `Shiki turned up the corner of his mouth and leapt back onto the roof.
"The next master is **Shion**, an astrologer. — She **reads moves from the stars**. Your board... she might **already be watching it**."

Then Shiki vanished from the rooftop.

*(**"Already watching"**...? So someone is watching me right now? Where did my privacy go in this isekai?)*`,
    ),
    // Ch.11 Shion
    ch(
      `Pushing through the clouds, Haruki emerged at the top of a tower.
A gothic observatory. **A stained-glass starscape**. Floating **magic circles and pentagrams**.

A girl with violet hair and violet eyes, wearing an oversized witch hat, turned holding an ancient tome. Through the rims of her round glasses, a gaze brimming with certainty.

"Welcome, Outer Hand Haruki — ah, yes, **even your surname is written in the stars**."

*(**Reading my full legal name from the stars** — that's privacy invasion at a cosmic scale.)*`,
      `"**The stars have shown me your next move.** — But what happens, I wonder, **if you betray the stars**?"`,
      `*(**Playing a move different from what the stars predicted** — the meta-strategy is overheating my brain.)*`,
      `"Heehee, **defying the stars themselves** — that was beyond my predictions. — Be wary. **My sister will come soon**. Unlike me, she reads not the stars... but **the heart**."`,
      `Shion closed her tome and hid her smile behind a fan.
"My sister's name is **Luna**. — **The Witch of the Moon.**"

*(They're **sisters** and both masters? Are family gatherings just **othello tournaments**? I don't want to imagine.)*`,
    ),
    // Ch.12 Luna
    ch(
      `Floating in a violet nebula sky: **transparent cubic platforms**.
Before a massive full moon, silver-violet hair flowing, Luna spun and turned back.

A moon-themed hat. Crescent ornaments. **Black and white othello stones floated inside transparent cubes around her**.

"So you're the **Outer one** Sister mentioned? Heehee — I'm **cuter than her, right?**"

A wink. A heart sign.

*(**How does this sibling relationship work?** I really don't want to be the comparison metric.)*`,
      `"Sister reads the stars. I read — **your heart**. — Haruki, you're feeling a **stomach ache** right now, aren't you?"`,
      `*(She **called out my stomach ache**. No, wait — maybe she's not psychic, **maybe my face just looks that bad**.)*`,
      `"Aw, I lost ♡ Now I have **a story to brag about to Sister**. — Haruki, you'll remember **my move**, won't you?"`,
      `Luna detached one of her crescent ornaments and handed it to Haruki.
"The next master is **Yukino**. She's — **different from us. She came from the modern world**. Neither Sister's stars nor my heart-reading can **see her**. Be careful."

*(**A master from the modern world**? ...Could she be a **previous Outer Hand**? Or...)*`,
    ),
    // Ch.13 Yukino
    ch(
      `When Haruki regained his senses — **a classroom**.

An empty after-school classroom flooded with sunset. Desks in neat rows, modern Japanese cityscape outside the windows.
He glanced at his feet on instinct. — He was wearing a school uniform. **His own uniform.**

At the lectern stood a silver-haired girl. Star-shaped hairpin, glasses, navy uniform with a crimson ribbon tie.
**Holographic analysis screens** floated around her.

"Welcome, Haruki. — **The fact that I'm wearing the same uniform as you isn't a coincidence**."

*(**Is this really still the isekai?** Any chance I just... came back?)*`,
      `"I've already calculated **how many moves ahead** you can think. — But how many moves *I'm* thinking? **You'll never know**."`,
      `*(The conversation assumes **I've already lost the depth-reading battle**. — Humiliating. Also accurate.)*`,
      `"...I'm impressed. **You exceeded my predictions.** — Hey, Haruki. **When you return to the modern world, will you remember me?**"`,
      `Yukino dismissed the holograms and turned. Sunset bathed her silver hair in gold.
"The next master is — **Akira**. He resides in **Victorian London**. — Have you grown accustomed to **traveling through eras** yet?"

*(**Traveling through eras?** So next is the **past**? — What kind of isekai design is this?)*`,
    ),
    // Ch.14 Akira
    ch(
      `A foggy alley. **Gas lamps** glowing amber.
Wet cobblestones reflecting the church spire.

A boy in a deerstalker, checkered waistcoat, and brown trench coat leaned against a brick wall.
With black-gloved fingers, he plucked a **floating game-record card** out of the air.

"Elementary, my dear Haruki. — **I deduced your arrival** from yesterday's obituary section."

*(**Deducing my arrival from an obituary**? I think your detective methodology may be slightly off-target.)*`,
      `"Observation and deduction — the detective's weapons. — I've already memorized **3,427 patterns** of your playing habits. — What will you do?"`,
      `*(**3,427 patterns** — that number is so specific it sounds **suspiciously like a lie**. But if it's true, terrifying.)*`,
      `"Splendid. — **The 3,428th pattern** was your move tonight. — I shall have to update my statistics."`,
      `Akira snapped his fingers, plucked a black bowler hat from the fog, and placed it on Haruki's head.
"The next master is **Ciel**. — In the **neon-lit future metropolis**. Across eras and locations, you are now **touring all eight continents**. Have you noticed?"

*(**All continents = all eras?** Wait but past and future aren't continents, they're a temporal axis—)*`,
    ),
    // Ch.15 Ciel
    ch(
      `Nighttime megacity. **Neon and vertical streams of code rain**.
Holographic ads filled the air.

A silver-haired short-cut figure (?) with goggles pushed up, manipulating a **holographic othello board** in mid-air. Gender ambiguous, one eye violet, one eye blue.

"Finally here, Outer. — Your data has **leaked to the network**. — Every master is **watching your replays**."

*(Got it, **the concept of privacy no longer exists** in this isekai.)*`,
      `"I play by **probability distribution**. — Your moves are **80% predictable**. The remaining 20% is what's interesting."`,
      `*(**80% predicted.** So I just need to consciously increase the 20%? — But the moment I try, that becomes predictable too, right?)*`,
      `"Fascinating. — You played **the 21%**. — This is — **worth preserving in the data**."`,
      `Ciel collapsed the hologram and bowed slightly. **Haruki's game record began replaying in 3D in mid-air**.
"The next master is **Aria**. **A princess of the royal court**. — Remember your manners? She's strict about **etiquette**, too."

*(**Manners are graded now?** First privacy, now I get judged on **how I hold a teacup** — what an isekai.)*`,
    ),
    // Ch.16 Aria
    ch(
      `A marble palace. **Chandelier crystals shimmered in rainbow light**.
The floor mirrored the lights; blue roses adorned the vases.

A girl with golden ringlet curls, a sapphire-blue gown, and a tiara. In **white gloves**, holding a lace fan, she smiled with elegance.

"Welcome, Outer Hand. — First, allow me to teach you... **how to bow properly**."

*(**Manners before greetings?** No, wait — that *is* the proper court protocol, isn't it...!)*`,
      `"**Compose yourself before placing a stone.** This is royal court othello. — I shall read your moves **through your bearing**."`,
      `*(**Reading my othello through my posture** — isn't this just **tea ceremony** at this point? Although that's not quite right either.)*`,
      `"Magnificent — **deceiving my bearing-reading with bearing of your own**. — As a gentleman, I find you... **slightly** to my liking."`,
      `Aria closed her fan and gave a light bow.
"The next master is **Sir Leon**. — The young commander of the **Othello Crest Knights**. He, too, is **one of my knights**. — Well, you'll understand once you meet him."

*(**She has knights serving her?** Then Aria is... **technically the real boss?** From a hierarchy standpoint? — The class system in this isekai is too complicated.)*`,
    ),
    // Ch.17 Leon
    ch(
      `Atop the castle wall, a sunset palace.
**Banners of the Othello Crest** — three black, three white — snapped in the wind.

Silver armor, a blue surcoat, golden embroidery. A blond young man raised his **white sword** to the sky and smiled.

"You passed Lady Aria's trial well. — As commander of the **Othello Crest Knights**, I welcome you. **Let us play with honor.**"

*(**Knightly othello** — sounds **way too righteous**, which somehow makes it scarier.)*`,
      `"**The right move** — **at the right moment**. This is the way of the knight. — And your way, Lord Haruki?"`,
      `*(**My way?** ...Honestly, just **vibes and momentum**. Doesn't really translate to chivalry.)*`,
      `"Splendid — your way is **without doctrine, yet undeniably present**. — The order shall recognize you as an **honorary knight**."`,
      `Leon sheathed his sword and dropped to one knee. Every banner along the wall fluttered in unison.
"The next master is **Sir Sojiro**. — **An ancient samurai of the warring states era**. He may challenge you not just with stones — but perhaps with **a blade as well**. Be on guard."

*(**With a sword?** This is othello, not kendo, right?? No, please tell me that was a **metaphor**. Please.)*`,
    ),
    // Ch.18 Sojiro
    ch(
      `Atop a sea-facing cliff. **Crimson sunset.**
An ancient pine swayed in the wind. **Crows wheeled overhead.**

Black warring-states armor with crimson lacing. Long indigo hair, a scar across one cheek. Two swords at his waist.
The old samurai stood with the sunset at his back, speaking without turning around.

"You have come. — **Words are unnecessary**."

A sudden draw — a single flash of his blade. The **floating othello stone** above him split clean in **two**.

*(A boss who **cuts othello stones in half**. Psychologically, I'm already lost.)*`,
      `"Before me, **all boards are nullified**. — Whether you play or do not — the end is the same. — **Come**."`,
      `*(**"The end is the same"** — does that mean I lose no matter what? Or win no matter what? — Please let it be the latter. **Earnestly.**)*`,
      `"...Hmph. — **You overturned my prophecy.** — Fine player. Carry **Asahi** in your heart, I beg of you."`,
      `Sojiro sheathed both swords and turned for the first time. **Blood-red sunset** illuminated his scar.
"That boy carries **my blood**. — Across time, the school has been passed down. — I may now... **depart in peace**."

The crows scattered into the sky as one.

*(**Asahi is his blood relative?** ...Was that a setup somewhere...? — The **family tree of this isekai is chaos**.)*`,
    ),
    // Ch.19 Arashi
    ch(
      `Inside thunderclouds, a massive blue-scaled **dragon** floated in mid-air.
Astride its saddle stood a warrior — red hair, black armor, crimson cape.
A **lightning-clad sword** in his grip. Through the dragon's open jaws, **golden flame** smoldered.

"Outer Hand — **I summoned this storm for you!** Come — let us duel on the **othello board of the heavens**!"

*(**Othello in the sky? On a dragon?** — I give up on physics.)*`,
      `"The bond between me and my partner is **faster than lightning**, **hotter than flame**! With your move — **split the sky**!"`,
      `*(**"Split the sky" with a move** — what?? That's not in any othello strategy book. ChatGPT can't help me here.)*`,
      `"GWAHAHA! **Look, partner — this one's the real deal!** — Haruki, **you have what it takes to become the next storm**!"`,
      `The dragon roared at the sky; thunderclouds split and blue sky peeked through.
Arashi raised his sword high, **drawing a path across the heavens with lightning**.
"Your next destination — **the Zeroth Table**. — There, **Zero** awaits. — Go, Haruki. The **world's final move**, I entrust to you."

*(**"The world's final move"** — heavy. Much heavier than **submitting a quiz with only my name on it**.)*`,
    ),
    // Ch.20 Zero
    ch(
      `Darkness. Light. **Code rain filling all space.**

No floor, no walls, no ceiling. Just countless **glowing othello boards** floating around.

At the center, a figure in a deep hood **floated cross-legged**. Within the hood — only **a single cyan-glowing eye** was visible.

"...You have come, Outer Hand."

A flat, expressionless voice. A black stone hovered above its palm.

"**Computation has concluded.** — You will **win**."

*(**They told me I'll win.** Great. — Wait. **Then why are we fighting?**)*`,
      `"Your every move — **already computed**. — Even your **victory**, **already computed**. — But the world that lies **beyond your victory** — **cannot be computed**. — Show me that world."`,
      `*(**Zero is fighting in order to lose.** — Is this a **zen koan**? — But **you're still the strongest**, aren't you...)*`,
      `"...My thanks. — **You showed me a sight beyond computation.** — Haruki, **you have flipped the world**."

Zero's hood was whisked away by a sudden wind.
What appeared beneath — **long pink hair**. **Kind green eyes**.
"...Heehee. **The same face as Ichika**, isn't it?"`,
      `Haruki was speechless.
Zero and Ichika — the two were **twins of light and shadow**, born from the same **soul-copy of the first Outer Hand**.

"**I was the shadow side.** — At last, I can fade. — Thank you."

Zero's body dissolved into **particles of white othello stones** and ascended into the sky.

Somewhere far away — back on the stage of Chapter 1 — Ichika **smiled**.

*(**I flipped the world.** — Even though my classical lit pop quiz is still unsubmitted.)*`,
    ),
  ],

  narrative: {
    solitude: {
      title: 'Interlude — A Solitary Late-Night Game',
      text: `Between battles, Haruki sat alone in the tatami room of an old inn, arranging game records.
Moonlight. The amber glow of a paper lantern. Papers on the walls — every match against every master, written down.

*(So **this is what it means to grow stronger**. — I thought it would be... **more dramatic**.)*

No answers came from playing alone.
But **the weight of placing a single stone** had certainly grown.`,
    },
    allies: {
      title: 'Interlude — Watched Over by the Masters',
      text: `Snow at the window. Tatami room.
Ichika, Mel, Nadeshiko, Asahi, Hibiki — the masters had gathered around Haruki's match, watching over him.

"Haruki, that move's perfect ♪" "Heh, your reads have grown deep, haven't they?"
"Now then — show us **the subtleties of true play**." "Don't push yourself, okay?" "What a fine melody."

*(People who **used to be enemies** are **cheering for me**. — This isekai's **emotional thermostat is too high**. — But I don't hate it.)*`,
    },
    final: {
      title: 'Interlude — Before the Final Stand',
      text: `The standoff with Zero.
Behind Haruki — **the souls of all the masters** appeared as **points of light**.

Ichika's song, Aoi's arrows, Asahi's blade, Nadeshiko's prayer, Hibiki's melody, Tsumugi's beast, Akane's invention, Mel's alchemy, Satoru's zen, Shiki's announcement, Shion's stars, Luna's moon, Yukino's hologram, Akira's deduction, Ciel's probability, Aria's bearing, Leon's sword, Sojiro's slash, Arashi's lightning.

All of them — became **Haruki's single move**.

*(**I am not alone.** — The moment I thought it — **the whole board became visible**.)*`,
    },
  },

  endingFull: {
    title: 'Ending — The Return',
    text: `The moment Zero vanished and the Zeroth Table collapsed —
A **door of light** opened before Haruki.

Beyond it, a familiar scene — **the after-school classroom**. **Sunset**. **The unsubmitted classical lit pop quiz**.

"...I can go home."

He turned. The masters were **waving**. Silhouettes only, but he could tell each one of them apart.

"Thanks, Outer Hand ♪" "See you ♡" "Travel in good health!"
"Be well..." "It was a fine journey." "Buddy says hi."
"Wanted to show you my next invention~" "Take this — but **don't drink it**." "A bond well forged."
"Your stones — I will not forget them." "Sister, come visit again." "Take care of my sister."
"I'll preserve the data." "Looking forward to your 3,429th pattern." "A fascinating journey."
"Don't forget your **bearing**." "As an honorary knight, you may return anytime." "**The next generation** — I leave it to you."
"**GWAHAHA, I'll summon the storm for you again!**"

And finally — **two girls** stood side by side, smiling.
**Ichika**, and **the girl who had been Zero**. — Like twins, faces nearly identical.

"**Haruki — at last we can return to being one.** — Thank you."

Haruki laughed through tears.

*(**I flipped the world** — but **the world flipped me too**, didn't it.)*

The door of light closed.

— Next moment, Haruki woke up at his **classroom desk**.
Outside the window, the sunset was at the same angle. The bell hadn't rung yet.

*(...Was time **frozen** the whole time?)*

The classical lit teacher held his answer sheet, wearing a wry smile.

"You've got... **only your name written here**."

*(**Reality didn't flip.** — But my heart? **Already flipped.**)*`,
  },

  epilogueHook: `— But Haruki did not know.

The seat that opened at the Council of Stones was already calling for **the next Outer Hand**.

The **first candidate** — in a corner of modern Japan, **a single girl**.
Her name: **Mikoto**. A girl who had grown bored of logic's limits and **yearned for magic**.

— After her, **18 more Outer Hands** would be summoned in turn.
And when **all their journeys end** — the gods will perform one final **special experiment**.

*"Reintegrate the soul of the first hero Haruki with the memories of all 19 cycles, and summon him once more."*

— That will be **the 21st hero**. — **The Second Haruki**.

*(**New Game+** — was about to begin.)*`,
};
