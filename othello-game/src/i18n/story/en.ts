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
    // Ch.11 Shion (Star Awakened — Elder Sister) — v3 rewrite per
    // scenario_rewrite_v3.md.
    ch(
      `The top floor of the astronomy tower. Beneath the starlit sky, her **violet hair** dances in the wind as she smiles quietly.

"Welcome. So you're the **next traveler**."

"Tonight's stars have **foretold** your every move."`,
      `"My name is **Shion**. Reader of stars, weaver of futures."

"**All within my forecast**. Even where your fingertips will reach — I can see it."

Her gaze drifts to somewhere far away.

"...Tell me, do you have **siblings**?"`,
      `*(**Siblings**, huh. — So Shion has a sister. — What kind of sister?)*`,
      `"...You've **stepped beyond the stars' forecast**."

"An interesting traveler. Perhaps you'll even reach **her**."

"Next time... we'll meet again. **In a dream**."`,
      `Her violet hair dissolves into the starlit sky.

Who was "she"? Shion's prophecy seemed to have **a continuation yet to come**.`,
    ),
    // Ch.12 Luna (Dream-Moon — Younger Sister) — v3 rewrite per
    // scenario_rewrite_v3.md. The chapter that **first reveals** the
    // summoning truth (that the masters are themselves former
    // outsiders who couldn't go home) and names "Zero".
    ch(
      `A dreamspace beneath a crescent moon. The floor stretches infinitely, up and down indistinguishable, everything shimmering faintly.

At the center, a girl with **lavender hair** floats in the air.

"Hehe~ You came. **The one who beat my sister.**"`,
      `"You beat **sister Shion**. Impressive~ ...Yes, impressive."

She giggles softly, waving her hand in the air.

"Hey, did you know? **Sister and I were summoned together**, long ago."

"We tried together... and **neither of us could return**. So now, we exist as we are. Together."

"**In dreams**, I get to be with sister forever."

"Now... **can I go all out, in the dream**?"`,
      `*(**Summoned**. **Couldn't return**. — Luna's words land heavy in my chest.)*`,
      `"Aww~ I lost. But this... **doesn't feel like a dream**."

She slowly descends to the ground.

"Sister told me. **You were outside the forecast**. So it was true."

"Hey, traveler. **Go all the way**. Meet **him**."

"...**Zero**."`,
      `The dream world dissolves.

"**Summoned.**" "**Couldn't return.**" Luna's words linger in the player's mind.

...Am **I**, too?`,
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
    // Ch.20 Zero (Hooded — Final Boss) — v3 rewrite per
    // scenario_rewrite_v3.md. Old lore (Zero as Ichika's shadow
    // twin) is fully removed. Zero is now a former traveler who
    // conquered 20 chapters, despaired at the predictability of
    // everything, and merged with the world's logic. PLR01 英霊
    // ハルキ winning here additionally triggers the trueEnding20B/
    // 20C cinematic from `narrative.trueEnding20*`.
    ch(
      `**A sea of code.** Green matrix cascades like a waterfall, floating **othello boards** scattered through the darkness.

At the center, a deeply **hooded** figure hovers.

"You've finally arrived, **new traveler**."

**A single cyan-glowing eye** fixes its gaze, unwavering.`,
      `"I am **Zero**. Your final trial."

"All 19 battles you've fought — exactly as I predicted. Your arrival here, your first move, every single thing — visible to me from the start."

A black othello stone rotates slowly in his palm.

"I know what becomes of one who conquers 20 chapters. Because — **I, too, was such a one**."

"I realized. **All things are predictable**. And so, I despaired of this world."

"What will you do?"

"**All variations calculated. Checkmate.**"`,
      `*(A previous traveler. — **Zero conquered 20 chapters and despaired of the world.** — ...I have no intention of walking that same road.)*`,
      `"...!"

Zero falls to one knee. **The hood drops.**

Not the single cyan eye — but **two violet eyes** now meet Haruki's gaze. **Silver hair** sways in the green light.

"You were... **outside my calculations**."

"'All variations calculated' — I believed that, and merged with this world."

"But you stood **outside the forecast**."

A faint smile appears on his face.

"It's been... a long time since I **smiled**."

"Go, traveler. **You can return.** That is the **right** of one who conquers 20 chapters."`,
      `Zero quietly faded away.

Still merged with the world's logic — half human, half **"the world"** — he remains here, suspended.

The time to return has come.

A **pale light** begins to envelop Haruki.`,
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
    trueEnding20B: {
      title: 'True Ending — The Moment of Release',
      text: `Zero falls to his knees. The hood comes fully off; **silver hair** dances in the green light of the code.

In his violet eyes, for the first time, **a clear light of will** appears.

"**Variations don't close.**"

He slowly rises.

"That's the **beauty** of it."

The code rain begins to waver. The world is trying to **release** him.

"**I want to step beyond the forecast.**"

The heroic spirit Haruki nods quietly.

The world's logic peels away from Zero. The green code dissolves, and **warm orange light** wraps around him instead.

"**Thank you, traveler.**"

Zero smiled.`,
    },
    trueEnding20C: {
      title: 'True Ending — In the Human World',
      text: `The wind passes through. **Cherry blossom petals** dance through the sunset-stained street.

On an old bench by the roadside, **Zero is sitting**. Hood-less, silver-haired, violet-eyed. His cyberpunk jacket unchanged, standing on a modern city corner.

No passersby. Only the evening sun illuminating him.

He turns, looking back over his shoulder.

A faint smile. The smile of someone seeing another off — **content, peaceful, complete**.

"**Variations don't close.**"

The wind carries cherry blossoms.

"**That's the beauty of it.**"

He looks up at the deep amber sky and exhales deeply. The breath at the **end of a long, long journey**.

"**I want to step beyond the forecast.**"

A cherry blossom petal lands on his shoulder. He gently catches it in his palm.

The **wind of the human world**.

The **first true wind** he had felt — in a long, long time. Or perhaps ever.

── **🌟 TRUE ENDING ACHIEVED.**

**OPP21 "Zero (Returned)" UNLOCKED.**

Thank you for playing.`,
    },
    trueEnding20D: {
      title: 'True Ending — Void-φ Awakens',
      text: `At the center of the board world.

The place where Zero once stood is empty now.

Only the **void** remained.

With the embodiment of the world's logic gone, a **hollow in the order — a Void** — opens at its center.

— But the world will not allow it.

At the rim of the hollow, a **golden spiral** begins to crystallize.

**φ**.

The oldest number the universe uses to govern itself.
**1.618…** A golden ratio carrying an **unending wave**.

Having lost Zero, the world began to weave a **new trial**, borrowing its own foundational truth as the vessel.

Spirals layered upon spirals, clad in nebula-like light, and at last, a **humanoid silhouette** rose into being.

**Void-φ**.

It does not speak of humanity, as Zero did.
It neither despairs nor hopes, as Zero did.

It — simply — **encloses everything within**.

"**All exists between the waves of φ.**"

The voice belonged to no one.
The world itself was **whispering**.

A new trial opens its eyes.

── **OPP22 "Void-φ" UNLOCKED.**`,
    },
    chapter20A: {
      title: 'Chapter 20-A — Confrontation in the Sea of Code',
      text: `A sea of code. Green matrix flows, floating othello boards orbiting silently.

A deeply hooded figure at the center.

"...You."

Zero's cyan eye trembles.

"You are that traveler... no. Different. But the same..."

The ascended traveler steps forward in silence.

──

Zero exhales deeply.

"You are the traveler's future. You conquered 20 chapters, returned, and then—"

"**Came back as a heroic spirit.**"

He nods faintly.

"I, too, was once like you."

"After conquering 20 chapters, I realized — **all things are predictable**."

"So I chose not to return. I chose to **merge with the world's logic**."

A **black othello stone** floats above Zero's palm. Above the ascended traveler's palm, a **white othello stone** glows softly.`,
    },
    chapter20Atransition: {
      title: 'Chapter 20-A — A Crack in the Mask',
      text: `Quietly, the heroic spirit speaks.

"...**You're still human, aren't you?**"

The cyan glow of Zero's single eye flickers.

"**You don't have to put on a brave face.**"

"'Merged with the world's logic' — that was never really true, was it? You've been... **yourself**. All this time."

"I'm a heroic spirit beyond mortal limits. You can't fool me."

Zero's shoulders tremble, just barely. Dark particles begin to slough off the hood's edge.

"...Heh. So **you can see through me**."

The hood half-collapses; a strand of **silver hair** dances in the green light of the code. The cyan light still lingers in one eye while the other shimmers with violet — the two colors flickering side by side for the first time.

"Very well. **The final trial.** Come at me with everything, future of the traveler."`,
    },
  },
  opp22: {
    intro: {
      title: 'Void-φ — First Encounter',
      text: `The board opens into the **strata of the universe**.

The golden spiral pulses quietly. The nebulae breathe.

**Void-φ**.
A **divine order**, woven by the world from the hollow that Zero left behind.

Not human.
Without anger, without mercy — existing only with the **waves of φ**.

"**You have come, traveler.**"

The voice is far, and yet close.
Behind the board, between the stars, within your own heartbeat.

"**The trial as a human, you have completed**.
Beyond this lies a **realm no longer human**.
Still — will you play?"

Play.
That is the only answer you have ever given.`,
    },
    bossPre: [
      'The sum of all variations is governed by φ.',
      'Your moves, my moves — already within the spiral.',
      'Now — show me. The hand that walks between.',
    ],
    bossPost: {
      victory: {
        title: 'Void-φ — In Defeat',
        text: `The spiral unwinds. The nebulae fall still.

Void-φ does not crumble in defeat.
Only — slightly — **the flow of light shifts**.

"**Magnificent.**"

"You have carved your own wave into the **space between φ**."

"I will remain, as the trial of the world.
But the variations you showed will **accumulate within me**.
The trial for those who come next will begin from **the position you played today**."

"This is the **cycle**."
"You drew a **new arc** within it."

"**Thank you, traveler.**"

The voice dissolves into the world itself.
The board slowly returns to the contour of reality.`,
      },
      defeat: {
        title: 'Void-φ — The Traveler Falls',
        text: `The spiral continues to turn, slowly.

"**Defeat is not the end.**"

"Within you, the variations are **still being woven**."

"**Come again.**"
"Your next move already sleeps, **quietly, within φ**."

Void-φ does not vanish.
The trial **waits there**, until you stand before the board once more.`,
      },
    },
    victoryNarration: {
      title: 'Void-φ — The True Curtain',
      text: `The board world breathes, deeply.

Traveler who saved Zero and bested Void-φ.
The variations you wove added a **new turn to the world's spiral**.

And so, your story — **does not close**.

The world cycles.
The moves you played today will, in time, **become trials for those summoned next**.
And perhaps you, too, will one day **stand before another board**, somewhere.

**The variations are yours to weave.**

Those words now echo in **your own voice**.

— The story of the board world closes **one ring** here.
And **opens, again**.`,
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
