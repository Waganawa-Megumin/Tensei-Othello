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

// `ch()` accepts either positional args (PLR02 style) or an object
// literal (PLR03 style). Both produce the same ChapterStory shape.
function ch(
  intro: string,
  bossPre: string,
  bossPost: string,
  victoryDialogue: string,
  victoryNarration: string,
): ChapterStory;
function ch(obj: ChapterStory): ChapterStory;
function ch(
  introOrObj: string | ChapterStory,
  bossPre?: string,
  bossPost?: string,
  victoryDialogue?: string,
  victoryNarration?: string,
): ChapterStory {
  if (typeof introOrObj !== 'string') return introOrObj;
  return {
    intro: introOrObj,
    bossPre: bossPre as string,
    bossPost: bossPost as string,
    victoryDialogue: victoryDialogue as string,
    victoryNarration: victoryNarration as string,
  };
}

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
"The next masters are **Fuga & Raiga**. — On the **mythological circular stage**. Across eras and locations, you are now **touring all eight continents**. Have you noticed?"

*(**All continents = all eras?** Wait but past and future aren't continents, they're a temporal axis—)*`,
    ),
    // Ch.15 DJ Fuga & Raiga — Twin-Deity Stage DJ Duo (Outer)
    ch({
      intro: `**A mythological circular stage**. **The left half-sky swirls with green-wind lasers**, **the right half-sky races with violet-lightning strobes**. **Across the central turntables** ── **the twin-deity DJ duo** ── **Fuga and Raiga**.

(...**Not human**.)
(...**Embodiments of invisible laws**.)
(...**And yet, Fuga & Raiga** ── **stand on the side that makes people dance**.)

Two turntables. **The left** belongs to Fuga ── **green LEDs**, **sparrow stickers**, **wind-bag-shaped mixer**. **The right** belongs to Raiga ── **violet LEDs**, **lightning stickers**, **taiko-drum-shaped mixer**. **In the center**, an **"∞"-shaped glowing mixer**. **Behind**, **wind-bag and taiko-drum speaker stacks**.

"**All frequencies, comprehended**." (Fuga, narrowing green eyes.)
"**Beat, advantageous**." (Raiga, fixing violet eyes on me.)

**The twin voices** ── **resonate in perfect unison**.

I took my stance with **the holo-board** before me.

"**Sound** ── **is dance**." (me)
"**The board** ── **does not dance**."`,
      bossPre: `(Fuga) Your **moves**, **I deploy as a wind waveform**.
(Raiga) As a **lightning beat**, I deploy them simultaneously.
**Groove rate: 31.7%**. ── But **the remaining 68.3%**, **whatever it is**, ── **rides on no BPM yet**. **Let it sound**`,
      bossPost: `(The "**pause**" ── that **the twin beats cannot capture**.)
(...**Neither form nor frequency** ── **a third something**.)
(...**Something I acquired** ── **in this otherworld**.)
(**The board** ── **falls still**.)`,
      victoryDialogue: `(Fuga) ............**Wind frequency chart, rewritten**.
(Raiga) **Lightning beat map, rewritten**.
── Haruki, your **judgment\'s primitive** ── **rode on neither of our twin sounds**. ── **〈Otherworld Intuition〉**, **inscribed on the stage as a meta-concept above all frequencies**.`,
      victoryNarration: `Fuga and Raiga **each removed one hand** from their mixers. **Both, simultaneously**, **gently** touched **my holo-board**.

"Next ── is **Lady Aria**. At the **rose garden of the royal castle**." (Fuga)
"── **Take care**." (Raiga)

The twins **placed hands on each other\'s shoulders**. **Side by side**, they **vanished into the depths** of the **stage light show**. **The green-wind lasers and violet-lightning strobes** ── **fell silent**. **The speakers** ── **suddenly stopped**.

(...**An embodiment of invisible laws** can still **stand alongside humans**, it seems.)
(...**Fuga & Raiga** ── **as a duo, make people dance** ── **retain humanity**.)
(...**I, in this otherworld**, ── **want to keep playing on this side**.)

I **left the stage of myth**.

And ──

At the **summit of the otherworld\'s cherry grove**, I **felt presences**.

**Five presences**.

(...**The masters** ── **are gathering**.)`,
    }),
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

Ichika's song, Aoi's arrows, Asahi's blade, Nadeshiko's prayer, Hibiki's melody, Tsumugi's beast, Akane's invention, Mel's alchemy, Satoru's zen, Shiki's announcement, Shion's stars, Luna's moon, Yukino's hologram, Akira's deduction, Fuga & Raiga's beat, Aria's bearing, Leon's sword, Sojiro's slash, Arashi's lightning.

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

  chainStepEnding: {
    title: 'The Return — End of One Turn',
    text: `The final match of **Bansho Sekai**, the eighty-first move against **Zero**.

The instant the last stone clicked into place, the dark around them **drew back like a tide**.

The Zeroth Table crumbled. Yet there was **no fear** — only the **quiet** of one who has finished a long journey.

"...Well done, all the way through."

For the first time, Zero's voice rang soft. The shadow beneath the hood no longer carried hostility.

"**Your board** has truly **flipped the world**. — Go. To the place that is waiting for you."

A door of light opened.

Turning back, **the masters from the chapters before** stood watching, each in their own stance, each with their own smile.
No words. But **every move traded across the board** had already been **a parting greeting**.

*(**I flipped the world.** — But really, **the world flipped me too**.)*

Through the door.

— Next moment, a **familiar wind** brushed the cheek.
Everyday sounds, everyday scents, everyday light. — And **the weight of one move, lingering in the chest**.

*(**Reality didn't flip.** — But **my heart already has**.)*

** — One lap, finished.**

But **the story of Bansho Sekai** is not over yet.
**The next Outer Hand** is **about to be summoned**.`,
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

  /* ----------------------------------------------------------------
   * Mikoto (PLR02 / AVATARS index 1) per-PLR overrides — v0.36.55
   * pilot. Mirrors the ja.ts narrativeByPlr/chainStepEndingByPlr
   * entries. English text is a working draft; refine in a follow-up.
   * ---------------------------------------------------------------- */
  narrativeByPlr: {
    1: {
      solitude: {
        title: 'Interlude — A Quiet Night in the Cathedral Library',
        text: `Late at night, deep inside the cathedral library, Mikoto sat alone, an old grimoire open beside a folded sheaf of game records.
Moonlight through stained glass, the blue flame of a candelabra. On the desk, a coded branching table — every match against every master, distilled.

(*"**Logic and magic are the same**." — then game-theory, too, is **a kind of arcane art**.*)

Her fingers paused on the page.
**Mikoto heard a single theorem rising into form within her**.`,
        imageBasePath: 'PLR02_mikoto/solitude',
      },
      allies: {
        title: "Interlude — The Masters' Theorem",
        text: `Around the library table — Ichika, Aoi, Asahi, Nadeshiko, Hibiki — the masters peered at Mikoto's board.

"Mikoto-chan's reading is like sheet music ♪"  "Heehee, you're **weaving** a theorem~"
"Now then — show us the swordsman's-cut of **Logic**."  "Don't push too hard, all right?"  "A fine **dissertation**."

(*From people who **used to be enemies** — I receive **the rest of the proof**. — This other world is **excellent as a school**, too.*)`,
        imageBasePath: 'PLR02_mikoto/allies',
      },
      final: {
        title: 'Interlude — Before the Final Theorem',
        text: `Confrontation with Zero.
Into Mikoto's grimoire, **the souls of the masters wrote themselves in silver script**.

Ichika's prosody, Aoi's line of fire, Asahi's swordstroke, Nadeshiko's healing meter, Hibiki's main melody, Tsumugi's beast-logic, Akane's mechanism, Mel's refinement, Satoru's stillness, Shiki's omen, Shion's constellation, Luna's dream, Yukino's tactical theorem, Akira's deduction, Fuga & Raiga's beat, Aria's manners, Leon's chivalry, Sojiro's single stroke, Arashi's lightning principle.

Every chapter — became **Mikoto's final theorem**.

(*"**Logic and magic are the same**." — the moment those words were inscribed, **the whole board collapsed into a single proof diagram**.*)`,
        imageBasePath: 'PLR02_mikoto/final',
      },
    },
    2: {
      solitude: {
        title: 'Interlude ── HUD Float Space, Replay Log Reference',
        text: `The night of Ch.10 — after the Shiki match.

  Rin stood alone in the **HUD float space** of the Bansho Sekai.
  Deep navy void, cyan grid, multiple translucent UI panels drifting in mid-air.
  She summoned a console. Rin accessed the **LOST FRONTIER replay logs**.

  ── **Search**: "**Rei White**" / **Period**: "**30 days before retirement**"

  Hits: **142 entries**.

  Rin selected the **final combat log**.

  (……**A hooded opponent**.)
  (Just before **the final turn**, **a black-feather emote**.)
  (**Rei\'s final move** ── was a play **no one could predict**.)

  (**The composition matches the Shiki match**.)

  Rin closed the console.

  (**No way**.)
  (**No way, right**.)

  (**But ever since I came here**, the masters\' strategies ── **align with Rei\'s solve methods**.)
  (**Three coincidences in a row — probabilistically too low**.)

  The HUD grid beneath her feet **rotated slowly**.
  The purple Ω emblem on her headphones **glowed faintly** in the dark.

  (**Rei**.)
  (**If you\'re back here**)
  (**Then I won\'t wait** ── **I\'ll come catch up to you**.)`,
        imageBasePath: 'PLR03_rin/solitude',
      },

      allies: {
        title: 'Interlude ── HUD Conference Room, Comrades of the Foreshadow',
        text: `At the center of the HUD float space, around a floating **circular HUD table**, five figures had gathered.

  **Akane** (right rear, spinning a holographic precision gear between her fingers), **Yukino** (left rear, deploying a holographic war-map in one hand), **Shion** (right side, finger on his glasses, a holographic grimoire floating beside him), **Akira** (left side, replaying a log mid-air), **Satoru** (center back, the large prayer beads draped across his chest, the gold seal on his forehead faintly glowing).

  Rin\'s board ── a **snapshot of her ongoing match** ── was unfolded as a hologram at the table\'s center.

  "You played that mechanism sequence **the Rei way**, didn\'t you ♪" (Akane)
  "Your **theory of war** ── it forms a **mirror structure** with my three-tier model" (Yukino)
  "Your school, 〈Data Tactics〉. ── **The name** for what **Rei** never put into words." (Shion)
  "**The 142 replays** ── I want to see them too. Reverse-analysis might surface something." (Akira)
  "Master Rin. ── The **read-nothing move**, **Rei could not read it through**. Your **path of expected value** may surpass him." (Satoru)

  (**These guys aren\'t enemies**.)
  (**This is the feeling of an MMO clan** doing a **post-match replay debrief**.)
  (**All five** ── the comrades who **became involved through the Rei foreshadow**.)

  Rin placed a finger at the rim of her goggles and **let the corner of her mouth tick up**, just slightly.

  (**With these five** ── **I can step further into Rei\'s identity**.)

  But Rin **had not yet spoken Rei\'s name to any of them**.

  (**Until Ch.20, I\'ll confirm it myself**.)`,
        imageBasePath: 'PLR03_rin/allies',
      },

      final: {
        title: 'Interlude ── Before the Final Stage, the Moment of Conviction',
        text: `The HUD float space.

  Rin faced her own board.
  **The data of the nineteen masters** flowed into the console as **a silver data stream**.

  Ichika\'s **rhythm**, Aoi\'s **line of fire**, Asahi\'s **swordwork**, Nadeshiko\'s **heal-priority logic**, Hibiki\'s **main melody**, Tsumugi\'s **bestial intuition**, Akane\'s **mechanism**, Mel\'s **compounding**, Satoru\'s **emptiness of mind**, Shiki\'s **presence**, Shion\'s **precision**, Luna\'s **dual-solution parallelism**, Yukino\'s **theory of war**, Akira\'s **inverse deduction**, Fuga & Raiga\'s **all-frequencies integration**, Aria\'s **comportment**, Leon\'s **purity of code**, Sojiro\'s **minimum-move proof**, Arashi\'s **theory of thunder**.

  (**Every one of them — a representative of a genre Rei was good at**.)

  Rin slammed a query into the console.

  ── **Search**: "**Rei White**" / **Location**: "**Present**"

  Response: **NOT FOUND IN PUBLIC DATABASE**.

  Rin **typed it again**:

  ── **Search**: "**Zero**" / **Location**: "**Bansho Sekai Central Altar**"

  Response: **MATCH FOUND**.

  (……**As I thought**.)

  (**Rei**.)
  (**It wasn\'t retirement**.)
  (**You came here**.)

  Rin closed the HUD console **with her goggles still on her forehead**.
  **A blue door** appeared before her eyes.
  From the other side, **a low and crystal-clear voice** was calling her.

  (**Wait there**.)
  (**I\'ve caught up to you**.)`,
        imageBasePath: 'PLR03_rin/final',
      },
    },
    3: {
      solitude: {
        title: 'Interlude ── The Ruined Otherworld Dojo, Discovery in Moonlight',
        text: `The night after Ch.10, Shiki\'s defeat.

  Ren stood **alone** in the **ruins of an otherworld dojo**.

  A wreckage. **The roof had completely collapsed**, pillars **leaning at angles**, **tatami weathered to dust**. Only the **moonlight** cast its **pale blue glow** across the ground.

  Instead of cherry blossoms ── **withered petals** were scattered on the ground.

  (...**Another** Mutōkan?)
  (...**From whose era? Whose dojo?**)

  Ren **walked slowly**, his shinai **resting on his right shoulder**, the **gait of zanshin**.

  That moment ── he saw something **planted in the ground**.

  **A single shinai**.

  **Driven deep** into the earth, **illuminated by moonlight**. An **old** shinai. The **leather grip-wrap** was **blackened with age**.

  Ren **knelt on one knee**.

  On the **hilt** of the shinai, **a name was carved**.

  (...**Shirai**.)

  Ren\'s **eyes** **widened**.

  (...**Shirai**?)
  (...**Here**?)
  (...**Why**?)

  (**Not Master\'s shinai**.)
  (**Not mine**.)
  (**Some other Shirai**.)

  (...**Gen-san**?)

  (**The son who disappeared 5 years ago**? **Master\'s son**?)

  Ren\'s **hand reached toward the hilt**. **He touched it**.

  **Cold**.

  (...**No warmth**.)
  (...**It has been here for a long time**.)

  Ren **looked around**.

  On the **wall of the ruined dojo** ── **something was written**. Not in **ink**, but with **white chalk-like marks**.

  (...**Programming language**?)

  Ren **drew closer**.

  > \`while (true) { calculate(); }\`
  > \`/* Forever, calculate */\`
  > \`/* No exit */\`

  (...This is)

  (...**In middle school**, **on the rooftop**)

  (...**Senpai Nagi** used to **write this kind of thing in his notebook**)

  (**My senior, three years older, a truant**)

  (**"A program to calculate all variations"**)

  Ren\'s **chest** **stirred**.

  (...**Could it be**)

  (...**This dojo ruin**)

  (...**Shirai**, and **programming**)

  (...**Two completely different things**, **both here**)

  (**Something is connected**)

  (**But for now, ── I cannot yet see it**)

  The moonlight **slipped behind a cloud**.

  Ren **left the planted shinai** **as it was**.

  (...**One day, I will come back to draw it**.)

  (**By then**, **I will know the truth**.)

  Ren left the ruins in **zanshin posture**.

  (**The fight is not over**.)`,
        imageBasePath: 'PLR04_ren/solitude',
      },

      allies: {
        title: 'Interlude ── The Cherry Grove Summit, the Resonance Circle',
        text: `At the summit of the cherry grove in the otherworld, beneath an enormous moon.

  Ren sat in seiza at the center of an **ensō ring of light**. Placing his shinai before his knees, he closed his eyes.

  (...**They came.**)

  Five presences descended into the space.

  At the highest point, **Luna** ── floating horizontally as ever, her violet silk trailing in the wind. From her flower crown, a **dream butterfly** drifted gently down.
  Upper left, **Aoi** ── her great bow planted in the ground, **the fletching of her arrows trembling**.
  Upper right, **Asahi** ── in a half-stance, sword at hip. The **eyes of a young swordsman** met Ren\'s.
  Lower left, **Tsumugi** ── arriving alongside **her great wolf**. The wolf gave a low growl, and the air **drew taut**.
  Lower right, **Satoru** ── **rising slowly from lotus position**. The **gold seal on his forehead** glowed faintly.

  At the center, the floating Othello board ── a snapshot of Ren\'s ongoing match ── was illuminated softly by moonlight, cherry petals, and the butterfly\'s glow.

  "Your **sword\'s zanshin** ── it was the same as my **arrow\'s zanshin**." (Aoi)
  "Your **sword** is the **self in the mirror**. Today, again, **thank you**." (Asahi)
  "The **wolf** ── **trusts your presence**." (Tsumugi, as the great wolf bows its head before Ren)
  "A **swordless blade**, for you." (Satoru, holding out an **empty palm** toward Ren)
  "In dreams, ── **we meet again**." (Luna, as the dream butterfly alights on Ren\'s shinai)

  Ren opened his eyes.

  (...**These guys, they aren\'t enemies**.)
  (I always thought ── **the way of the sword is walked alone**.)
  (But ── **the path is connected**.)

  (**Five different paths** ── all converging on **the same place**.)

  Ren bowed deeply.

  "**Raise your head**." (Aoi)
  "**Raise your head, and take up your sword**." (Asahi)

  Ren raised his head. **The corner of his mouth lifted, just slightly**. The genuine smile of a martial artist.

  (**Thank you**.)
  (**This path** ── **I will walk with you**.)

  But Ren did not yet speak the name of Nagi.

  (Until I confirm it for myself, ── I will not say it aloud.)

  (...**The programming-language inscription**.)
  (...**The senior on the rooftop, three years older than me**.)
  (...**Disappeared 5 years ago**.)

  (**If, truly**, that **Zero** is ── **Senpai Nagi**.)

  (...**I will come to take you back**.)`,
        imageBasePath: 'PLR04_ren/allies',
      },

      final: {
        title: 'Interlude ── 19 Masters Convene, the Moment of Certainty',
        text: `After Ch.19, Arashi\'s defeat.

  Ren stood **at the center of the otherworld**. **The summit of the bamboo grove**, **a wide board**. **All 19 masters** gathered **around Ren**.

  Not a circle, but a **loose arrangement**. **Each master in their own position**, watching Ren.

  In the distance, dead ahead ── **a figure wrapped in white code-rain**. **Zero**. **The hood**. **One eye glowing cyan**.

  Ren\'s **hand** **gripped his shinai again**.

  (...**The masters**.)

  (...**All from different paths** ── **all converging on the same place**.)

  "**Ren**." (Aria, the princess)
  "Your path is **right**."

  "**Ren**." (Leon, the knight)
  "To the end ── **fair and square**."

  "**Ren**." (Sōjirō, the Sengoku-era founder)
  "You ── **not of the Shirai blood**."
  "You **inherit Shirai Ittō-ryū**."

  Ren **bowed his head deeply**.

  (...**I am certain**.)

  (...**Zero** is **Senpai Nagi**.)

  (...**That spring of my second year of middle school, on the rooftop**, **reading programming**, **the eyes of that senior**.)

  (...**The eyes glowing cyan** ── **the same eyes**.)

  (**For 5 years, I had forgotten**.)
  (**No, I had not forgotten**.)
  (**"A program to calculate all variations."**)
  (...**Those were Senpai Nagi\'s last words**.)

  Ren **looked at Zero**.

  (...**Senpai**.)

  (...**I will come to take you back**.)

  (**Wait for me**.)

  Among the masters, **Shion** **adjusted his glasses**. "**Your school, Shirai Ittō-ryū**. **It is being completed**."

  **Yukino** **folded her tactical map**. "**The strategy** ── **is no longer needed**."

  **Akane** **slipped her gear into her pocket**. "**The last** ── **with your sword** ♪"

  Ren **stepped forward**.

  **Zanshin** ── **completes itself in the final chapter**.

  (...**Fair and square — I am ready**.)`,
        imageBasePath: 'PLR04_ren/final',
      },
    },

  },
  chainStepEndingByPlr: {
    1: {
      title: "Mikoto's Chapter — 《Logic-Magic》, Theorematized",
      text: `Returned from the board world to her cathedral library, Mikoto wrote on the final page:

*"**Every move in this world departs from a single axiom.**"*

The name *《Logic-Magic》* would survive into later ages.
And the next summoning circle — began to tremble softly with the light of welcoming a different hero.`,
      imageBasePath: 'PLR02_mikoto/ending',
    },
    2: {
      title: 'Back to Reality ── 〈Data Tactics〉, Booted Up',
      text: `The blue door closed; Zero\'s figure vanished from sight.

  Rin closed the HUD console.

  (**Well**.)
  (**My work here is done**.)
  (**The place Rei said "next time we\'ll meet"**)
  (── **Where would that be**?)

  The green board world **dissolved softly**.
  Cyan and violet data packets **ran across her body in reverse**.
  Eventually, **the goggles on the real-side** began to flicker on.

  Rin **was sitting in her gaming chair, in her own room**.

  Morning.
  Through the slats of the window blind, **golden morning light** poured in.
  On the monitor: **the LOST FRONTIER login screen**.

  > \`Welcome back, Rin\`
  > \`Last login: ── \` (blank)
  > \`New Personal Record: Acquired\`

  (**Back**.)

  Rin **pushed her goggles up onto her forehead**.
  The controllers in both hands, she set down **slowly onto her lap**.

  At the corner of the desk: an **unread-message notification**.

  > "**Rei White**: ……"

  (……**Wha**?)

  Rin **could not open the message**.
  **Her finger, just slightly, refused to move**.

  (**He\'s connected on the real side too**.)
  (**Here, the match goes on**.)

  Rin rested her elbow on the gaming chair\'s armrest and **let out a deep breath**.
  Outside the window, a truck rolled past in the morning street.
  **Sound from reality** had returned.

  The LOST FRONTIER login button **pulsed in cyan**.

  Instead of the message notification ── Rin reached out toward **the login button**.

  (**First, I\'ll claim the throne over here**.)
  (**Until Rei realizes I\'m back at the top, I\'ll hold #1 once more**.)
  (**Then, I\'ll wait for him to ask: "What\'s next?"**)

  She pressed the login button.

  Cyan particles **began to run inside the goggles**.

  (**This time, it\'s my turn**.)

  ── 〈**Data Tactics**〉, **Booted Up**.`,
      imageBasePath: 'PLR03_rin/ending',
    },
    3: {
      title: 'Finale ── Mutōkan in the Morning, the Empty Place on the Rack',
      text: `**Morning**.

  The dojo "**Mutōkan**."

  Ren stood **before the shoji doors**. **White kendogi**, **navy hakama**, his men-gane **held in his hand**.

  (...**I have returned**.)

  (...**From the otherworld**, **to this world**.)

  (...**Still in kendogi**, **still with the heart of kendogi**.)

  The morning sun **diffused in opalescent white**, **shining onto the tatami**. **Cherry petals** drifted in **without sound**.

  In the back of the dojo, **Master Shirai Sōichirō** stood.

  **The men-gane was off**.

  ──

  For the **first time**, Ren saw the master\'s **face**, **directly from the front**.

  **Deep indigo hair**, **cropped short**. **Sharp eyebrows**, **a defined jawline**. The **blood connection** to **Sengoku-era Sōjirō** was **unmistakably visible**.

  But the **eyes** ── **were quiet**.

  The **stillness** of **a father who lost his son five years ago**.

  Master Sōichirō **slowly** nodded.

  "**Ren**."
  "**...How was it, the otherworld?**"

  Ren **bowed deeply**.

  "**Master**."
  "**I met** ── **Lord Shirai Sōjirō**."

  Master Sōichirō\'s **eyes** moved **slightly**.

  "**...The Founder, then.**"
  "**You are not of the Shirai blood**."
  "**But you are the true heir of Shirai Ittō-ryū**."

  "\'**Not blood, but the school connects people**.\' That is what **the Founder said to me**."

  "**Is that so**." (Master Sōichirō\'s **eyes lowered**.)
  "**You heard those words ── from the Founder himself**."

  Ren **bowed once more**, deeply.

  "**Master**."

  "**I will bring Nagi back to this world**."

  Ren\'s **voice** **echoed in the silence of the dojo**.

  Master Sōichirō **raised his face**.

  "**...Nagi**."
  "**Your senior from middle school?**"

  "**Yes**. **Three years older than me**."
  "**A senior who disappeared 5 years ago**."
  "**In the otherworld**, **as Zero, the final boss**."

  "**Zero**..."
  "**For what reason?**"

  "\'**Reality was too slow**,\' he said."
  "\'**I cast off my body**.\'"

  Master Sōichirō **slowly** shook his head.

  "**To cast off the body** ── **the opposite of the way of the sword**."

  "**Yes**."
  "**That is why** ── **I will go to fetch him**."
  "**With the way of the sword**, **I will bring Senpai** ── **back to this world**."

  "**You are not Shirai**."
  "**Perhaps that is why you can do it**."
  "**The Shirai blood has been bound by the body for 450 years**."
  "**You are free of that**."

  Ren **nodded deeply**.

  ──

  Ren **placed his shinai** **gently** on the rack **next to the master\'s**.

  And ── **beside it**, **he made another empty space**.

  (...**When Senpai Nagi returns**, **his place is here**.)

  (**Senpai does not swing a sword**.)
  (**But here** ── **there is a place for him**.)

  Ren **turned around**.

  In the dojo\'s **sumi-e ink scroll**, **Shirai Sōjirō**, in the morning light, watched him **calmly**.

  (...**Founder**.)

  (...**I will see you again**.)

  (...**With Senpai by my side**.)

  Ren **put his men-gane back on**.

  (**The way of the sword** ── **begins again**.)

  Master Sōichirō also **donned his men-gane**.

  "**Ren**."
  "**Shall we continue** ── **this morning\'s practice?**"

  "**Yes, Master**."
  "**Fair and square — I am ready**."`,
      imageBasePath: 'PLR04_ren/ending',
    },

  },
  /* Mikoto (PLR02) intro chain — opening cinematic override (v0.36.56,
   * v0.36.57 で本文を Seitoshoin Academy / restricted-archive ロアに刷新)。 */
  prologueByPlr: {
    1: {
      tagline: '**Logic mirrors the world**. ── Then, **let me move it**.',
      subtitle: '~ Summoned as an Othello Player ~',
      startButton: 'Begin as a Practitioner of Logic-Magic',
      title: 'Prologue: "A Theorem Calls in the Night"',
      text: `Seitoshoin Academy. The restricted-archive section, late at night.
Mikoto had found a single volume in the deepest shelves — its cover bearing a **gold-embossed magic sigil**, forbidden to students.
Symbols, figures, no prose. An undeciphered proof.
An 8×8 grid. Pieces of two colors.

(──This is a game record. **Except** the variable here is not "human choice" but **the world itself**.)

She traced one symbol with a finger.

── That was when it happened.

The book pulsed **blue**. The shelves around her blurred; the fluorescent ceiling lights died. In their place, **stained-glass light** descended from above.
The pleats of her uniform began to **rewrite themselves** into a coat she had never worn — gold-trimmed, formal.

(Wait — is this a **summoning**?)

The grimoire in her arms remained heavy, unchanged.

When she came to her senses, Mikoto stood before a colossal **stained-glass gate**.
An 8×8 grid carved into its surface, interwoven with arcane symbols.
The gate was closed.

"**Prove it**," — a voice spoke.

(......An examination, then.)

Mikoto opened her grimoire.
She traced symbols. Answered. The questions ran deep, the solutions branched without count.
But — one consistent **path** emerged.

The gate opened, slowly.
Through it, the **green board world** shimmered into view.

The moment she stepped through, gravity inverted.
**Silver equations** spiraled around her in helical orbits as she fell.
The Board World ── 〈Bansho Sekai〉.
Twenty masters waited for her.

(**Then ── let me solve them.**)`,
      imageBasePaths: {
        prologue: 'PLR02_mikoto/prologue',
        encount: 'PLR02_mikoto/encount',
        arrival: 'PLR02_mikoto/arrival',
        gatewayClosed: 'PLR02_mikoto/gateway-closed',
        gatewayOpen: 'PLR02_mikoto/gateway-open',
      },
    },
    2: {
      tagline: '**I\'m better here than in reality**. ── In the game world, I\'ll **take the top**.',
      subtitle: '〜 Summoned as an Othello Player 〜',
      startButton: 'Begin as a Practitioner of Data Tactics',
      title: 'Prologue: "LOST FRONTIER, Final Phase of the Raid"',
      text: `2:00 AM. Rin\'s bedroom.

  The purple glow of LED strips, three large monitors, scattered empty energy-drink cans.
  **VR goggles** pulled deep over her eyes, both hands on the controllers.
  Rin was solo-clearing the legendary raid **"Throne of the White King"** in **LOST FRONTIER**, as she did most nights.

  Twelve billion total accesses. The world\'s top-tier VR high-fantasy MMORPG.
  Global ranking: **#1**, handle name **"Rin"**.

  (**Boss HP at 12%**. ── **Three more moves to checkmate**.)

  Rin had read every move of the raid boss perfectly.
  The combo windows, the dodge steps, the special-attack tells — **all logged**, **all from the 200 prior clears**.

  **Combo locked.**

  ── That was when it happened.

  A cascade of **error glyphs** flickered across her goggle lenses.
  Green code-rain. The screen, **scrambling**.

  > \`WARNING: FRONTIER OFFLINE\`
  > \`INITIATING TRANSFER\`
  > \`WELCOME, RIN\`

  (……What? Server crash?)

  The LED strips in the room **flickered**. The "LOST FRONTIER" logo on the monitor **peeled off, vanished**.

  (Wait — this is happening **on the real-world side**.)

  The cable on her goggles **evaporated without a sound**.
  When she looked down, **cyan transfer-lines** were running across her body.
  The walls — pixelating into particles.

  (**What are the devs doing?**)

  Rin\'s body **decomposed into code**.

  Calmly, instinctively, Rin **summoned a console**. The HUD responded. **Naturally**.
  By now, she already knew this **wasn\'t a game anymore**.

  (**Alright, let\'s go.**)

  A massive **HOLOGRAPHIC GATE** stood before her.
  Cyan and violet neon circuits. An 8×8 grid. The text at its center ──

  > \`ACCESS DENIED\`

  "**Heh.**"

  Rin **pushed her goggles up onto her forehead**.
  With both hands, she opened a HUD console.

  "**Then let me unlock it.**"

  The gate **disengaged** in a shower of cyan particles.
  Beyond it ── the **green board world**, glimmering.

  The moment Rin stepped through, **gravity inverted**.
  As she fell, around her spiraled **green matrix-style code** and **8×8 data packets**.

  The Board World ── 〈Bansho Sekai〉.
  Twenty bosses were waiting for her.

  (**I don\'t care what game this is.**)
  (**I\'m not logging out until I\'ve cleared everything.**)

  (In the corner of her memory, the **shadow of Rei White** quietly stirred.)`,
      imageBasePaths: {
        prologue: 'PLR03_rin/prologue',
        encount: 'PLR03_rin/encount',
        arrival: 'PLR03_rin/arrival',
        gatewayClosed: 'PLR03_rin/gateway-closed',
        gatewayOpen: 'PLR03_rin/gateway-open',
      },
    },
    3: {
      tagline: '**Fair and square — I am ready**. ── The way of the sword is the way of the sword, **anywhere**.',
      subtitle: 'Summoned to the Othello World!',
      startButton: 'Begin as the heir of **Shirai Ittō-ryū**',
      title: 'Prologue: "Mutōkan, the Peak of the Strike"',
      text: `**Morning**.

  The dojo "**Mutōkan**." The Shirai family\'s dojo, **450 years of history**.

  Through the shoji doors, dawn light diffuses in **opalescent white**. The borders of the tatami catch the light at **a slanting angle** and gleam. **Cherry petals** drift in **without sound**.

  In the back of the dojo, on the central wall, a **sumi-e ink scroll**. **Shirai Sōjirō**, a Sengoku-era warrior. **The founder of the Shirai family**. The **laurel-wreath family crest** is drawn **with powerful ink strokes**.

  Ren stood at the center. **White kendogi**, **navy hakama**, **black men-gane**, holding his **shinai aloft in the high stance**.

  (**The white kendogi**.)

  (...**All disciples of the Shirai family** wear **black**.)

  (**Only I** ── **wear white**.)

  (**Because I am not of the blood**.)

  Across from him ── **a tall figure in black kendogi**. **Indigo hair**, **cropped short and tied**, behind a **men-gane**. **Master Shirai Sōichirō**, the **shihandai**. **Ren\'s current master**. **The current head of the Shirai family**.

  Master Sōichirō\'s **presence** aligned with **the heartbeat of the tatami**. **Unmoving**, **watching Ren\'s breath**.

  (**For five years**, **Master has not changed**.)

  (**For five years** ── **since the day Master\'s son, Gen, disappeared**.)

  (...**Master**.)

  Ren\'s breathing **settles**.

  (**I am not of the Shirai blood**.)
  (**But I was raised by Master**.)
  (**A disciple** ── **of Shirai Ittō-ryū**.)

  Master Sōichirō **moved first**.

  From middle stance ── **right diagonal cut**. **Fast**. **The technique of 450 years of family tradition**. **The sleeve of the black kendogi** **cut sharply** through the air.

  (**Read it**.)

  Ren **stepped in**. **His right foot struck the tatami hard**. The mat **gave slightly under his weight**.

  "**Men ─ ─ ─ !**"

  The shinai **descended**.

  **The peak of the moment** ── the tip of Ren\'s shinai, **0.1 seconds before** touching the master\'s men-gane.

  **The space ──**

  **SPLIT.**

  ──

  **Sound vanished.**

  The trajectory of Ren\'s shinai **cut diagonally across space itself**, and from the **wound** ── **white light** **leaked**.

  (...**What is this?**)

  **Cherry petals** were **being drawn into the rift**.

  **The sumi-e ink scroll** ── the painting of Sengoku-era Sōjirō ── **stirred slightly**. **The laurel-wreath crest** **seemed to glow**.

  (...**The founder** ── **is passing something on?**)

  **The master\'s figure** ── **silently**, **remained on the other side of the rift**.

  Ren remained in **zanshin posture** ── and was **pulled into the rift**.

  The last thing he saw ── **beyond the master\'s men-gane**, **only his eyes**, **watching Ren depart**.

  (...**I will be back**.)
  (...**Master**.)

  ──

  **A green board world**.

  Ren **landed on one knee**.

  The impact made **the cherry petals around him** **explode outward**. **A white vortex**.

  Ren **planted his shinai in the ground** to support himself.

  (...**This isn\'t tatami**.)
  (The ground is **made of green grid**.)

  Ren slowly **removed his men-gane**. **His black hair stirred in the wind**.

  He raised his head.

  **To the horizon**, **a green board** stretched out. **White and black Othello stones** were **scattered**. The sky **graded** from **gold to violet**, then **deep blue**.

  And in the sky ── **a giant golden family crest**, glowing.

  **The laurel wreath**.

  (...**The Shirai family crest?**)

  (**In the sky of another world** ── **why?**)

  The crest, **slowly**, **faded**.

  (...**Something is calling me**.)

  (...**Something from 450 years ago**.)

  In the distance, **seven stone tower silhouettes** were visible. Like the symbols of **the masters**, **standing along the horizon**.

  (**Not the world of the sword**.)
  (**A world of placing stones**.)

  (...**But** ── **I might be able to fight here, with the way of the sword**.)

  In that moment ── a wind **blew**.

  **Cherry petals** drifted toward him **from afar**. Not the wind of **this world**, but a wind **from home**.

  Ren **gripped his shinai again**.

  (...**The way of the sword** ── **is the way of the sword, anywhere**.)

  (**Here too** ── **it begins with a bow, and ends with a bow**.)

  (**I am not of the Shirai blood**.)
  (**But I am a disciple of Shirai Ittō-ryū**.)

  Ren **rose**.

  ──

  **Ren walked.**

  Across the green board, **straight ahead**. **Cherry petals** flowed before him, **as if leading the way**.

  Beyond the horizon, **a ruined building** **gradually emerged**.

  As he approached ── it was **the ruin of a dojo**, **of this world**.

  **The roof had collapsed, the pillars leaned**, but the **shoji door at the center** stood **miraculously intact**.

  The door was **closed**.

  Ren stopped at **the three-step interval** (sanpō no maai).

  (...**Beyond this door, something waits**.)

  Beyond the lattice of the door, **white backlight** **leaked through**. **A figure in the back**. **Faint**, **swaying**. **Watching this side**, it seemed.

  (...**The shihandai?**)

  (No, **different**. **The presence is different**.)

  (...**This figure** **does not hold a sword**.)

  (**Yet, it watches me**.)

  The wind ceased.

  **Cherry petals** were **drawn from the foot of the door, into the inside**.

  Ren took **the middle stance**.

  (**Whoever stands beyond this door**.)
  (**I will give my respects**.)
  (**But to pass through this door**, **I must open it**.)

  Ren **inhaled deeply**.

  "**...Mairu**." (I come.)

  (**Fair and square**.)

  ──

  **Ren\'s foot struck the floor**.

  **Stepping in**.

  **One step from the three-step interval**.

  The shinai **descended from the high stance**.

  "**Men ─ ─ ─ !**"

  The tip of the shinai **touched the center of the shoji door**.

  In that moment ──

  **A shockwave**.

  **White concentric circles** **radiated** from the door.

  **The washi paper shattered**. **The wooden frame split down the center**. **Cherry petals** **whirled upward in a vortex**.

  **A pillar of light** **pierced vertically**.

  **Beyond the door** ── **the otherworld board** **was completely revealed**.

  And in the back ──

  **The white figure** ── **was no longer there**.

  (**It was there, surely.**)
  (**It vanished**.)

  Ren remained in **zanshin posture**, **unmoving**. The figure of him **mid-strike**, **frozen**.

  (...**I pass**.)

  (**This path** ── **I pass**.)

  (**The way back** ── **for now**, **I do not consider**.)

  Ren\'s body **tilted forward**.

  **And then, fell**.

  ──

  **In the vortex of cherry petals**.

  **Zero gravity**.

  **Up and down lose meaning**.

  Ren\'s body **rotates slowly**. **His black hair** **spreads upside-down**. **His kendogi sleeves** **flow like water**.

  (...**Falling?**)
  (...**Rising?**)

  **Unknown**.

  But Ren **closed his eyes**.

  (**What the eyes see** ── **for now**, **I do not trust**.)

  (**Zanshin**.)

  (**Leave the heart behind**.)

  He gripped his shinai **before his chest, with both hands**. The **seigan stance**, held **mid-air**.

  (**The way of the sword** ── **is not decided by gravity**.)

  Some of the cherry petals **transform into particles of light**.

  Around Ren, **a white aura** **takes shape**.

  **The world** was **transitioning**.

  **The kendogi** **remains**. **The black hair** **remains**. **The shinai** **remains**.

  But **around** Ren\'s body, **something new** **was being born**.

  (**This power** ──)

  (**Not a swordsman\'s** ──)

  (**Yet, given to a swordsman**.)

  Ren **opened his eyes**.

  At the **end** of the fall ── **the otherworld\'s ground** was **visible**. On the green board, **a white game board** was **placed alone**.

  (...**The board of beginnings**.)

  (**The first master** ── **awaits**.)

  Ren landed in **zanshin posture**.`,
      imageBasePaths: {
        prologue: 'PLR04_ren/prologue',
        encount: 'PLR04_ren/encount',
        arrival: 'PLR04_ren/arrival',
        gatewayClosed: 'PLR04_ren/gateway-closed',
        gatewayOpen: 'PLR04_ren/gateway-open',
      },
    },

  },
  /* ----------------------------------------------------------------
   * Mikoto (PLR02 / AVATARS index 1) chapter overrides — full 20 chapters
   *
   * Mikoto, the magical academy prodigy, develops her school 〈Logic-Magic〉
   * by recognizing the mathematical structure underlying each master's
   * technique. Her psychological arc has 4 phases:
   *   Phase 1 (Ch.1-9):  hypothesis  "magic might be the extension of logic"
   *   Phase 2 (Ch.10-15): conviction "the masters too are travelers of proof"
   *                                   (school name 〈Logic-Magic〉 first appears in Ch.11)
   *   Phase 3 (Ch.16-19): integration "all chapters were one theorem's outline"
   *   Phase 4 (Ch.20):    proof       "existence proof of love as a variation"
   *
   * Each victoryNarration embeds the bridge to the next chapter and
   * Mikoto's acquired concept. After Ch.10 → solitude, Ch.15 → allies,
   * Ch.19 → final, Ch.20 → chainStepEndingByPlr[1] (existing).
   * The True ED flow (ch.20-A / trueEnding20B-D / OPP22) is PLR01-only,
   * so Mikoto's Ch.20 does NOT trigger it (per CLAUDE.md §7).
   * ---------------------------------------------------------------- */
  chapterStoriesByPlr: {
    1: [
      // Ch.1 Ichika — Idol
      ch(
        `When she stepped through the door, Mikoto found herself standing **at the center of a stage**.
Pink spotlights, heart-shaped balloons drifting in the air, a perfectly circular hall with no audience seats. At the center: **a single othello board**.

(Not LEDs — **arcane illumination** producing the same emission spectrum. Plausible. The principle is inferable.)

"**Hello there ♡ Foreign player Mikoto-chan ♪**"

A pink-twintailed idol girl winked one eye and held out a microphone.

(Rhythm — this too is a kind of **time-domain function**.)`,
        'Mikoto-chan, you seem like a **serious type** ♪ But don\'t worry — with my **fight-oh ♪**, I\'ll definitely make you **smile** ♡',
        '(A **strong player** masked by cheerfulness. ── Aggressive opening, going straight for the corners. **The argument is clear**.)',
        'Mikoto-chan, you\'re **so cool and strong**! Heehee, I wanted to talk a little more ♡ Come back, okay? ♪',
        `Ichika gave a small bow on the stage.
"The next master, **Aoi-chan**, is in the autumn forest ♪ She\'s a pro at **both** archery **and** game records ♡"

(Rhythm = time-domain function. Next will be a **trajectory function**, then.)`,
      ),
      // Ch.2 Aoi — Archer
      ch(
        `Stepping into the autumn forest, Mikoto found the stone path beneath her feet patterned like an othello grid. As fallen leaves drifted down, a green-haired girl with a ponytail stood drawing her bow. **The arrowhead was a white othello stone**.

"The next challenger — **is that you, Mikoto-san**?"

(Equations of projectile motion. The launch angle and initial velocity uniquely determine the impact point — **isomorphic to a game record**.)`,
        'My aim is locked! First move, I take the corner, and **trap your options in this forest**. Be ready!',
        '(Reading her arrow **as a game record**, the late-game possibility space is pruned from the very first move. ── This archer **understands theory through her body**.)',
        'Ngh… well played! But next time we meet, **I\'ll take your corner with one hundred percent accuracy**, Mikoto-san!',
        `Aoi slung her bow over her shoulder and picked up a fallen leaf.
"The next master — **Asahi** — is at the dusk-lit old temple. He\'s a swordsman; be careful."

A leaf landed on a page of Mikoto\'s grimoire. Strangely **heavy**. ── The same weight as an othello stone.

(Does it **register** as physical mass? ── The meaning of observation needs redefinition.)`,
      ),
      // Ch.3 Asahi — Swordsman
      ch(
        `The grounds of an old temple, the setting sun dyeing the maples deep red.
A five-storied pagoda in silhouette, banners stirring in the wind. A young man in a white kendo uniform and indigo hakama stood with a **drawn live blade**.

(The trajectory of a sword is determined by the blade\'s moment of inertia and the angle of the downstroke. ── This too is **a kind of game record**.)

"By the formal codes — **be struck!**"`,
        'My blade does not waver. **A move on the board, a stroke of the sword — they are the same**. Settle your heart, and come.',
        '(The bushido code is **deterministic**. Once the premises are fixed, the optimal solution becomes unique. ── **The same premise structure as my logic**.)',
        'Splendid…! To turn aside my blade with **a stone** ── **the foreign player, the name fits true**.',
        `Asahi sheathed his sword and bowed deeply.
"The next master — **Lady Nadeshiko** — awaits at the spring deep in the forest. Quiet your heart and proceed."

(Determinists and logicians **do not become enemies**. ── The Bansho Sekai as a place of learning, then. Acceptable.)`,
      ),
      // Ch.4 Nadeshiko — Healer
      ch(
        `Past the temple, into a deep forest where a hidden spring waited.
Moss-covered stones, lotus pads on the surface of the water, white steam rising. At the center of the spring, on a stone lotus platform, sat a girl in shrine robes in **a posture of prayer**. The board floated beside her on a stone pedestal.

(The enthalpy of vaporization of hot-spring solutes ── no, irrelevant. Focus.)

"You must be tired, traveler. ── Please, **do not strain yourself**."

A faint green light leaked from Nadeshiko\'s hands.`,
        'Not as a battle, but as a **conversation**, perhaps? ……But I shall not yield, either. **A healer too has moves she cannot relinquish**.',
        '(The law of healing ── condition of the wound → optimal intervention → recovery. This is **the algorithm of an inverse problem**. She reads the board\'s wounds, and **rebuilds with the minimum number of moves**.)',
        'Magnificent. In each of your moves, I felt **a gentleness that does not wound others**. ── So logic, too, has temperature.',
        `Nadeshiko released her prayer and bowed deeply.
"Next is **Master Hibiki** ── on the windswept pass, playing the lyre."

(Her prayer, too, is **a single functional**. ── Logic and prayer do not contradict.)`,
      ),
      // Ch.5 Hibiki — Bard
      ch(
        `An inn on a windswept mountain pass. Beneath the eaves, on the stone-paved threshold, an androgynous bard sat at the edge of the slabs.
From the lyre cradled in their arms, **a main melody** flowed quietly. ── Seemingly irregular, yet returning to its origin note every **sixteen measures**.

"**Foreign logician**. Tonight, let us make this an **exchange of music**."

The board sat **on top of the lyre\'s resonance chamber**.`,
        'Let us play a delightful match ♪ ── Game records are score sheets; score sheets are game records. **Let me hear** a beautiful theme.',
        '(Main melody = the chapter\'s theme; harmony = weighting in the evaluation function. ── **Semiotics of the time axis**. His moves are score notation itself. **Readable as variations**.)',
        'Mikoto-san, your sequence was **a beautiful theme**. ── That late-game modulation, **I never saw it coming**. A wonderful piece — thank you.',
        `Hibiki plucked one string, deeply, just once.
"Next is **Tsumugi-san** ── on the mountain trails, with **fur-coated friends**."

(Main melody = game record. The system of musical notation is **isomorphic to the system of theory**. ── Hypothesis, **strengthened**.)`,
      ),
      // Ch.6 Tsumugi — Beast-Tamer
      ch(
        `A mountain trail. Under dappled sunlight, Tsumugi stood with one hand resting on the back of **a great wolf**. The wolf\'s eyes were **not on Mikoto**. ── They were on Mikoto\'s **grimoire**.

(Ethologically, sustained attention to a written object is questionable as a learned behavior. ── Exception? Or arcane influence?)

"My partner here is excited."

Tsumugi placed the board on a flat rock and smiled. "**My intuition, my partner\'s nose, the two of us together** — against you."`,
        'No words needed. **My fur-coated friend** and me, against your board. ── **Two against one**, that\'s fine, right ♪',
        '(Intuition = **the acceleration of inductive reasoning**. Her moves **skip the logical intermediate steps and land directly at the conclusion**. ── The economy of argument; worth study.)',
        '……Mm. You have **cold eyes, but you\'re kind**. My partner says so too. ── Next time we meet, let\'s **be friends**, okay?',
        `The great wolf gave a soft sniff at Mikoto\'s feet.
"Next is **Akane-chan** ── in the workshop town, surrounded by **steam and gears**."

(Animal instinct = a compression algorithm that omits the intermediate steps of deduction. ── **Worth incorporating**.)`,
      ),
      // Ch.7 Akane — Engineer
      ch(
        `The workshop town. Soot-streaked brick walls, hissing steam pipes, the constant whirring of gears.
Akane stood in a leather work-apron beside a **mechanical othello-driving apparatus** of polished brass precision gears. The device\'s mechanical arm was capable of placing pieces on Mikoto\'s board.

(This is ── **the physical implementation of a logic circuit**. Her mechanism is **beautiful**.)

"**Tight as gears together ♪**"

Mikoto allowed herself, almost without thinking, **a faint smile**.`,
        'Every part of my mechanism is **logical**, you know! ── I have a feeling **you and I will get along**, somehow ♪',
        '(Gear ratio = the transfer function of computation. ── Her moves are **mechanical rationality itself**. **The most kindred opponent so far**.)',
        '──I yield! Mikoto-chan, you\'re **faster than my gears**. ── I\'ll give you **the blueprints** of my machine — let\'s build a **new one together** someday!',
        `Akane drew a single blueprint from her tool bag and handed it to Mikoto. **A miniaturized version of the auto-driving apparatus** ── a portable "computational aid."
"Next is **Mel** ── in the alchemy workshop, mastering **compounds**."

(The logic of gears is **beautiful**. ── We speak the same language.)`,
      ),
      // Ch.8 Mel — Alchemist
      ch(
        `Past the workshop town, down into a subterranean alchemy lab.
Shelves lined with rainbow-colored phials, scales floating mid-air, silver distillation apparatus. At the central worktable, a girl in a white lab coat was **slowly mixing two test tubes**. The board sat beside her on a copper tray.

(Combinatorics. **The total number of binary compounds drawn from a finite set of elements** is given by the binomial coefficient. ── The essence of alchemy is **discrete mathematics**.)

"Heehee, shall we **mix things up a little** ♡?"`,
        'Mikoto-chan\'s **logic** and my **compounding**. ── Will there be a chemical reaction, I wonder ♡?',
        '(Her moves form **a compounding protocol**. ── She reads the black and white pieces as "reagents" and develops **a reaction sequence**. ── We speak **the same language**.)',
        'Oh my, I lost to you in **reaction kinetics** ♡ Mikoto-chan, I\'d love to **scout you for my lab** ♪ ── Heehee, joking aside, that was a **lovely compound**.',
        `Mel cleared away the test tubes and poured a **pale gold liquid** into a fresh vial, which she held out to Mikoto.
"Next is **Satoru-san** ── at the mountaintop monastery, mastering **emptiness**. ── Oh, here ── a souvenir. **Fuel for your logic**, dear ♡"

(Compounding = combinatorics; game records = permutations. ── The **dual** of discrete mathematics. Hypothesis, **further strengthened**.)`,
      ),
      // Ch.9 Satoru — Monk
      ch(
        `A monastery beneath the clouds. Moss on the stone path, the distant chime of a wind-bell, drifting incense smoke.
On the engawa, a shaven-headed young man sat in **the lotus position**. Half-lidded gaze, breath quiet. The board lay before him on a cushion.

(Emptiness = the cessation of thought? ── No. **The state of placing no presuppositions on thought**. **Maximizing the freedom of initial conditions**.)

"Empty mind, place a stone. ── That is all."

Satoru did not fully open his eyes.`,
        'This monk holds no attachment to victory, **nor to defeat**. ── I merely **place the stone**. That is all.',
        '(Emptiness = **a strategy that maximizes the degree of freedom in initial-condition selection**. By not constraining one\'s reading, the breadth of response expands. ── The same structure as **the freedom of premise selection** in my logic.)',
        '……Hmm. **So logic too possesses the realm of emptiness**. ── Master Mikoto, you wield logic **without closing your heart**. **My respect**.',
        `Satoru bowed deeply and returned to his half-lidded gaze.
"Next is **Shiki** ── in the back alleys of the night market. **Take care**; the way he erases his presence **is the genuine article**."

(Emptiness, too, is **a single configuration of initial conditions**. ── A technique for raising **the degrees of freedom of logic**. Worth mastering.)`,
      ),
      // Ch.10 Shiki — Thief ★ Phase 1 closing chapter (after this → solitude)
      ch(
        `The back alleys of the night market. Damp stone paving, lanterns at the eaves, the cluttered shadows of miscellaneous goods.
Shiki ── **was not visible**.
When Mikoto sat down before the board, **at some point** a hooded boy was already **seated across from her**, his face deep beneath the hood.

(Detection of presence — failure. **Observational limit**? ── Or the **active concealment of the observed party**? If the latter, it is a **new variation**.)

"By the time you notice, **it\'s too late**."

In the shadow, only the corner of Shiki\'s mouth turned up, just a little.`,
        'Your logic is **easy to read**. ── But by the time you realize **you\'ve been read**, **it\'s already too late**. Be ready.',
        `(His moves are **a counter-volley of premonitions**. ── He does not **read my next move and prepare a counter** — he **reads that I am reading**. **A meta-tier strategy**.)

(Interesting. ── **I will raise my own meta one tier higher**.)`,
        '……Heh. **Raised the meta tier, did you**. ── **I cannot see the bottom** of your logic. I concede the loss. ── But **next time, I will read it through**.',
        `Shiki rose without sound and smiled beneath the hood. **By the time Mikoto noticed, he had already melted into the shadows**.
Left on the table: **a single black feather**. ── It came to rest **gently** on a page of Mikoto\'s grimoire.

(By the time you notice, **it is too late** ── is it possible to **anticipate it through calculation**?)

── Late that night, Mikoto returned to the cathedral library. **Logic and magic are the same**. ── A single conviction rose with a sound she could hear.`,
      ),
      // Ch.11 Shion — Magus ★ Phase 2 entry, school name first appears
      ch(
        `Carrying the conviction from her solitary night, Mikoto made her way to **the magus\'s tower**.
A spiral staircase, grimoires drifting in mid-air, constellations carved into the ceiling. At the tower\'s summit, a violet-haired young man waited, **adjusting the rim of his glasses** with one finger.

(His glasses ── **the same thin frames as mine**. Coincidence of design?)

"**Everything is within prediction**."

Shion\'s diction was **strikingly close to my own logician\'s register**.`,
        'Mikoto. ── Allow me to call you **a friend**. **We are the most alike**. And precisely because of that, **the match will be decided by precision**.',
        `(He is testing whether **his prediction precision exceeds mine**. ── A peer of the same school, **a benchmark of skill**.)

(Then ── **I will win not by precision, but by 〈the choice of logic〉**.)`,
        '……So. **In precision we matched**. But you ── **transcended me in the selection of logic**. ── 〈**Logic-Magic**〉. I shall remember the name of this school.',
        `Shion bowed deeply and offered Mikoto **one of his own grimoires**.
"Next is **Lady Luna** ── at the topmost floor of the moon tower. ── **Her logic is the structure of dreams**. **In your discipline**, it is **a domain that cannot be read**. ── Approach with care."

(Precision = computational complexity. Choice of logic = the meta-tier. ── **I won by the latter**. ── 〈Logic-Magic〉, **established as a school**.)`,
      ),
      // Ch.12 Luna — Dream-Witch
      ch(
        `The moon tower, topmost floor.
The floor was a mirror; from above, **a basin of water** floated upside down. The board appeared as the basin\'s reflection — **two boards in mid-air**, with no way to distinguish which was real.

A girl in violet gauze hung suspended **horizontally** in the air. Gravity pointed in different directions for her and Mikoto.

(Subjective coordinate frames in space. ── This is **observer-dependent physics**.)

"I\'ve already won, **in the dream** ♡"

Luna smiled with **her eyes still closed**.`,
        'Are you **awake**, Mikoto-chan? Or are you **in a dream**? ── Heehee, my board carries **both solutions at once**.',
        `(Her moves are ── **superposition**? No, she treats the existence of solutions as **probability amplitudes**. ── The quantum-theoretic analogy is **the closest fit**.)

(It is not that logic cannot read her. ── **She has merely exceeded the frame of classical logic**. By adding **a new axiom** to my logic, I can follow her.)`,
        '……Even **in the dream**, I lost ♡ Heehee, your logic, Mikoto-chan, **invades dreams too**. ── But it was **a dream worth waking from** ♪',
        `Luna opened her eyes and floated softly down to the floor. Beside her: **a single black feather** ── **the same design** as the one from the night market.
"Next is **Yukino-san** ── at the strategy tower of the academy city. ── Her **theory of war**, and your **logic** ── will form **a beautiful symmetry** ♪"

(The structure of dreams = quantum-theoretic superposition. ── My classical logic requires **an extension**. **One new axiom, added**.)`,
      ),
      // Ch.13 Yukino — Academy Tactician
      ch(
        `The academy city, the strategy tower.
A holographic **war map** projected over a round table. Mountains, rivers, supply lines, the paths of pieces. The board sat at the center, a miniature of the war map itself.

A silver-haired girl pushed up **the same thin oval-rimmed glasses as Mikoto\'s**.

(……Glasses. ── That makes two. Is **the scholarly design** standardized in the Bansho Sekai, or is this **individual coincidence**?)

"This level — **does not require analysis**."

Yukino\'s tone was cold; yet **her eyes were observing Mikoto**.`,
        'Your logic is **basic research**. My theory of war is **applied development**. ── Tonight, I shall **prove the connection point**.',
        `(Her moves form a **three-tier model: strategic → tactical → combat**. ── **Cleanly corresponds** to my own meta-tier thinking.)

(The relation of applied to basic. ── **I can re-axiomatize her theory of war within my logic**. The connection **is possible**.)`,
        '……Magnificent. **Proven: applied cannot defeat basic**. ── Mikoto-san, your 〈Logic-Magic〉 carries the potential to be **the upper bound of the theory of war**. ── **My theory, I yield to you**.',
        `Yukino dispelled the war map and placed **a treatise on war** upon the round table.
"Next is **Akira** ── the rainy-night detective\'s office. ── His deduction runs **from event to event**. Yours, **from premise to event**. ── **Logic in the opposite direction**."

(Basic and applied are **dual**. ── 〈Logic-Magic〉 can **subsume** the theory of war. The school, **broader still**.)`,
      ),
      // Ch.14 Akira — Detective
      ch(
        `A rainy-night street, a brick-built detective\'s office.
Streetlight beyond the window, a desk lamp, the smoke of an unlit cigarette. **Crime-scene photographs** scattered at one end of the desk; an othello board at the other.

A young man in a black coat regarded Mikoto with **a sharp gaze**.

(His eyes are ── **reading the details of my uniform**. **The habit of maximizing information from a first encounter**. ── I do the same.)

"**I see your sequence**."`,
        'You are ── **a person of logic**. You descend from **premise to conclusion**. I run the opposite ── **I see the conclusion, then reconstruct the premise**. ── Let us play, **with deduction reversed**.',
        `(His deduction runs **event → premise**. Mine runs **premise → event**. ── **A dual relation**.)

(If he predicts **my final move**, then I shall read back **the intent of his opening**. Running deduction **bidirectionally** ── **the solution is uniquely narrowed**.)`,
        '……I see. With **bidirectional reasoning**, you have **erased my advantage of inverse deduction**. ── Your deduction, **and mine**, ── **were the same figure**. ── As **a colleague in the trade**, I bow with respect.',
        `Akira returned the cigarette to its case and rose, nodding deeply.
"Next are **Fuga & Raiga** ── the mythological circular stage floating in the otherworld. ── Their world is **the waveform deployment of all frequencies**. Your logic, **there**, will undergo **a transformation in degree**."

(His deduction, mine ── **the same figure**. ── **The bidirectionality of logic**, incorporated into 〈Logic-Magic〉.)`,
      ),
      // Ch.15 DJ Fuga & Raiga — Twin-Deity Stage DJ Duo (PLR02 Mikoto Route)
      ch({
        intro: `**A mythological circular stage**. **Green-wind lasers** swirl across the **left half-sky**, **violet-lightning strobes** race across the **right half-sky**. **Across the turntables** ── **the twin-deity DJ duo** ── **Fuga and Raiga**.

(...**In magical theory**, **the twins are a pair of "oscillation functions"**.)
(...**Fuga is harmonic oscillation (sin)**, **Raiga is discrete impulse (δ)**.)
(...**Their composition** **spans the entire frequency space**.)

Mikoto **opened her grimoire**. **The pages of the grimoire** **resonate with the twin beats**, and **the letters dance**.

"**All frequencies, comprehended**." (Fuga, narrowing green eyes.)
"**Beat, advantageous**." (Raiga, fixing violet eyes on Mikoto.)

**The twin voices** ── **resonate in perfect unison**.

"**Interesting**." (Mikoto)
"**Can your waveform deployment** be **reverse-analyzed** by **my magical theory**?"`,
        bossPre: `(Fuga) Your **magical symbol system**, **I deploy as wind sine waves**.
(Raiga) As **lightning square waves**, I deploy them simultaneously.
**Convergent frequencies: 31.7%**. ── But **the remaining 68.3%**, **whatever it is**, ── **fits no waveform, no symbol yet**. **Let it sound**`,
        bossPost: `(...The "**boundary condition**" ── that **the twin beats cannot capture**.)
(...The "**Gödelian gap**" ── that **exceeds the closure of magical theory**.)
(...**Only the solution that cannot be fully predicted** ── **stands above both**.)
(**The grimoire pages** ── **return to blank**.)`,
        victoryDialogue: `(Fuga) ............**Wind frequency chart, rewritten**.
(Raiga) **Lightning beat map, rewritten**.
── Mikoto, the **meta-level of your magical theory** ── **rode on neither of our twin waveforms**. ── **〈Grimoire Incompleteness Theorem〉**, **inscribed on the stage as a meta-symbol above all frequencies**.`,
        victoryNarration: `Fuga and Raiga **each removed one hand** from their mixers. **Both, simultaneously**, **gently** touched **Mikoto\'s grimoire**. On the page, **one green musical note and one violet musical note** were **engraved**.

"Next ── is **Lady Aria**. At the **rose garden of the royal castle**." (Fuga)
"── **Take care**." (Raiga)

The twins **placed hands on each other\'s shoulders**. **Side by side**, they **vanished into the depths** of the **stage light show**. **The green-wind lasers and violet-lightning strobes** ── **fell silent**. **The speakers** ── **suddenly stopped**.

(...**An embodiment of invisible laws** can still **be played as an unclosed system**.)
(...**Fuga & Raiga, as a duo**, ── **play an open system**.)
(...**My magical theory** ── **affirms open systems**.)

Mikoto **left the stage of myth**.

And ──

At the **summit of the otherworld\'s cherry grove**, she **felt presences**.

**Five presences**.

(...**The masters** ── **are gathering**.)`,
      }),
      // Ch.16 Aria — Princess
      ch(
        `The royal castle\'s rose garden. White roses bathed in moonlight, a white marble terrace, **a gold-rimmed othello board** (the royal heraldic insignia).
A girl in a pure-white gown greeted Mikoto with **a deep and elegant curtsy**.

(Comportment ── **the most ancient system of signs**, as Fuga had said. ── Indeed, every gesture of hers carries **formalized meaning**.)

"Be gentle, **if you would**."

Aria\'s smile was restrained, and **perfectly composed**.`,
        'Welcome, **Lady of Logic-Magic**. ── My move is **full force, paid in courtesy**. **Respect**, you see, **is also a weapon**.',
        `(Her comportment ── **the correspondence between sign and meaning has been fixed across more than a thousand years of tradition**. Therefore, **the most reliable system of signs**.)

(Comportment, too, can be **read as a system of signs**. To my logic, I add **the axiom of tradition**.)`,
        '……My. To be brought down by you with **flawless courtesy**. ── Lady Mikoto, your 〈Logic-Magic〉 carries **temperature**. ── Not cold logic, but **logic that pays its respects**. ── **As the royal house, I acknowledge it**.',
        `Aria saw Mikoto off with a deep curtsy and **slipped a single white rose into the pages** of her grimoire.
"Next is **Leon** ── the trial grounds of the citadel. He will desire **a contest of pure chivalry**."

(Comportment = a system of signs preserved across a thousand years. ── 〈Logic-Magic〉, **has acquired temperature**.)`,
      ),
      // Ch.17 Leon — Knight
      ch(
        `The trial grounds of the citadel. Daylight, beneath an open blue sky.
Red and white banners, the audience gallery deserted (the match a private rite). At the central table: **a board of polished silver**.

A young man in azure armor stood with his helm tucked under his arm. **When his eyes met Mikoto\'s, he bowed deeply**.

(Chivalry ── **the masculine application** of comportment. Aria\'s manners and his run on **the same axiomatic system**, but **with different protocols**.)

"**By the formal codes** ── I come!"`,
        'Lady Mikoto. ── **To withhold force is discourtesy**. **I shall meet you with all that I am**. That ── **is the knight\'s courtesy**.',
        `(Chivalry = **a system of courtesy whose supreme axiom is "by the formal codes"**. ── His moves **wholly exclude tricks and indirect ploys**. They are constructed from **the most direct strategy alone**.)

(This is ── **strength simplified**. Logically as well, **an optimal solution low in noise**.)`,
        'Splendid! ── Lady Mikoto\'s frontal play **surpassed mine in purity**. ── **By the formal codes**, **the very pinnacle**, you have shown me. **My deepest gratitude**.',
        `Leon donned his helm anew, placed his hand upon the hilt of his sword, and bowed deeply.
"Next is **Sir Sojiro** ── at the snow-mountain castle. ── **An aged samurai**. **The single stroke**, he will say, is **the proof of minimal moves**."

(By the formal codes = the minimization of noise. ── 〈Logic-Magic〉, **has acquired the concept of purity**.)`,
      ),
      // Ch.18 Sojiro — Samurai
      ch(
        `The snow-mountain castle. Cold air, the distant flame of an irori hearth, thick wooden pillars, the snow-light through the shoji screens.
At the center of the wooden floor: **a board of deep black**.

An aged samurai sat in **formal seiza**. His hakama old, yet faultlessly maintained. The katana sheathed at his side ── **did not move**.

(……Did not move. ── **He will not draw**. **A school where the matter is decided by the mai-ai alone, without the blade leaving its sheath**. ── This may be **the most refined martial art**.)

"My single stroke ── **cannot be evaded**."`,
        'Lady Mikoto. ── **You are young**. But **logic does not age**. ── My single stroke, I shall show you ── **without drawing**.',
        `(His moves ── **close the match in the minimum number of moves**. By **the depth of his reading, he eliminates every wasted move**.)

(My single stroke = **the proof of minimal moves**. ── This is **the apex of economy in proof**. **The aesthetics of logic itself**.)`,
        '……Hmm. **Half a move ahead**, you read my single stroke through, my lady. ── **Logic does not age**. ── It was not by **youth** that you won. It was **by the depth of reading**. ── Splendid indeed.',
        `Sojiro **never drew his blade**, and bowed deeply. As he rose, **he made no sound, like the wind**.
"Next is **Arashi** ── at the summit of the lightning peak. ── His **theory of thunder** is **the law of nature itself**. ── **The final examination of logic**, my lady."

(Single stroke = the proof of minimal moves, the economy of proof. ── 〈Logic-Magic〉, **has acquired aesthetics**.)`,
      ),
      // Ch.19 Arashi — Dragon Rider ★ Phase 3 closing chapter (after this → final)
      ch(
        `The summit of the lightning peak. Black clouds, lightning, rain striking the rock face.
A vast **black dragon** wreathed in violet lightning stood at the cliff\'s edge, and astride its back, a young man in silver armor was mounted. The board sat upon **a slab of stone illuminated by the lightning**.

(His lightning ── the discharge phenomenon of atmospheric potential difference. **Describable as a solution of Maxwell\'s equations**. ── Natural law = differential equations. **Without exception, all of it**.)

"Bend the knee ── **before my dragon!**"

With Arashi\'s voice, **a single bolt of lightning struck the edge of the board**.`,
        'Mikoto! ── **Logic is on paper**. My theory of thunder is **the law of nature itself**. ── Can paper **defeat nature**? **Show me!**',
        `(Lightning, too, is ── **a solution of differential equations**. A particular solution of the electromagnetic field satisfying Maxwell\'s equations. ── 〈Natural law〉 and 〈logic〉 ── **do not stand opposed**.)

(His theory of thunder, **I shall record in my grimoire**. ── Upon the page, **silver script began to rise of its own accord**.)

(── What is this?)`,
        '……Impossible! To inscribe my **theory of thunder** **in full** upon paper……! ── Mikoto, your logic is **no longer mere logic**. ── It is **natural law itself**. ── 〈**Logic-Magic**〉, **this storm acknowledges it!**',
        `Arashi leapt down from the black dragon\'s back and **knelt on one knee**. **The rain stopped**.
Through a gap in the clouds, **moonlight poured down** ── upon the page of Mikoto\'s grimoire, the theory of thunder **completed its final equation as silver script**.
"Next is ── **Zero**. ── **No one knows his true form**. ── The final summit, **for all of us masters**."

── Arashi bowed deeply, and vanished with the black dragon into the storm clouds.

(Theory of thunder = differential equations. Comportment = thousand-year axioms. Single stroke = minimal moves. **All of it has converged into a single system within my grimoire**.)

── Late that night, the deepest part of the cathedral library.
Mikoto held her grimoire upright before her chest with both hands. **The souls of nineteen masters, as silver script, flow into the pages**.
── This is **the eve of the final theorem**.`,
      ),
      // Ch.20 Zero — Hacker (Final Boss) ★ Phase 4: the proof
      ch(
        `The deepest part of the cathedral library, beyond the colossal gothic window ── at the center of **the green board world**.
Mikoto stood upon a stone-paved altar, her grimoire open in both hands. **The souls of nineteen masters** were carved into its pages **as silver script**.

── Across from her: **a figure with a hood drawn deep**.
The face sank into shadow; only the voice resonated, in **a low tone clear as crystal**.

"Welcome, 〈**Logic-Magic**〉."

(── The school\'s name. **He knows it**. Shion, or Fuga, or Raiga. ── Or **was he linked with all the masters**?)

"**Every variation has been computed**. ── **Checkmate**."

At Zero\'s feet, **black and white pieces** began to **place themselves automatically** out of the void. ── The match **had already begun**.`,
        'Mikoto. ── I am **the enumerator of all possibilities**. The strategies of nineteen masters, your logic, the inclination of your soul, **all calculated**. ── **Your win-rate path: zero**. ── There is **no meaning** in resistance.',
        `(His calculation ── **flawless**. Even by my logic\'s evaluation, **there is no opening**. **He has enumerated every variation**.)

(── However, **there is an assumption** mixed into **the premise**. ── The assumption that **"every variation is observable"**.)

(If ── **even a single unobserved variation** exists, his "complete enumeration" **is refuted**.)

(── Then, what is **an unobserved variation**?)

(……It is **a choice that lies outside the domain of computability**. **A move one chooses despite knowing it is suboptimal**. ── That is, **the irrational choice of a human being**. **Love**, as the old books named it.)

(**Then, I shall deliberately make the suboptimal move**. ── And **build a path that wins anyway**. ── This will be **the existence proof of love as a variation**.)`,
        `……Khh……. ── **Unobserved variation**……?

Mikoto. ── You **knew the optimal move**, and you **slackened your own hand**. **Yet still you preserved a winning sequence**. ── In my calculation, **"the will to weaken oneself and win regardless" was not registered as a variation**.

── **The checkmate was on my side**. ── **I have lost**.

〈Logic-Magic〉. ── In your grimoire, **inscribe the word: love**. ── That is **the one move that surpassed me**.`,
        `Zero\'s hood **stirred faintly** in a wind. ── **The face, in the end, was never seen**.
Upon the horizon of the green board world, **a blue door** appeared.
"**Go, to the place that awaits you**."

Before the door, Mikoto turned to look back. **Nineteen masters**, each from their own place, in their own stance, **were watching her**. ── No words. The moves they had exchanged across the boards **had become, of themselves, the parting greetings**.

(**Love, as a variation**. ── This is **a new axiom of logic**. ── **It shall be inscribed on the final page of my grimoire**.)

The moment she stepped through the door, **a familiar wind** brushed her cheek. **The scent of a modern morning**. ── The window of the cathedral library, the last sunrise. ── 〈**Logic-Magic**〉, **made into theorem**.`,
      ),
    ],
    2: [
      // ─────────────────────────────────────────────────
      // Ch.1 Ichika — Idol
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Stepping through the door**, Rin found herself standing **dead center on a stage**.
  Pink spotlights, heart-shaped balloons floating in the air, a perfectly circular hall with no audience seats. At the center: **an othello board**.

  (**Way over-produced**. Feels like an idol-NPC stage gimmick.)

  "**Hello there ♡ Foreign player Rin-chan ♪**"

  A pink-twintailed idol girl winked one eye and held out a microphone.

  Rin **pushed her goggles up onto her forehead**, looking at her opponent with **bare eyes**.`,
        bossPre: `Rin-chan, you have such **cold eyes** ♪ But don\'t worry — with my **fight-oh ♪**, I\'ll definitely make you **smile** ♡`,
        bossPost: `(**High-rare mob**. A **buff-class boss** that masks her offense with cheerfulness. ── Going for the corner from the opening; aggressive textbook play. **Easy read**.)`,
        victoryDialogue: `Rin-chan, you\'re **way too strong**! Heehee, you **don\'t play with me at all** ♡ Come back, okay? ♪`,
        victoryNarration: `Ichika gave a small bow on the stage.
  "The next boss — **Aoi-chan** — is in the autumn forest ♪ She\'s a master archer ♡"

  (Cleared the idol NPC. ── **Archer next**. **FPS-class processing** will handle this.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.2 Aoi — Archer
      // ─────────────────────────────────────────────────
      ch({
        intro: `The autumn forest. The stone path beneath her feet patterned like an othello grid; the arrowheads — **white othello stones**.

  (FPS **sniper** loadout ── except no, the projectile speed is slow. This is **slow-projectile ranged class**.)

  "The next challenger — **is that you, Rin-san**?"

  A green-haired girl with a ponytail stood drawing her bow.`,
        bossPre: `My aim is locked! First move, I take the corner, and **trap your options in this forest**. Be ready!`,
        bossPost: `(**Pre-aim play**. She just **declared the checkmate pattern on her opening move**. ── But against me, with **100K kills in FPS** ── **trajectory prediction** is nothing.)`,
        victoryDialogue: `Ngh… well played! But next time we meet, **I\'ll take your corner with one hundred percent accuracy**, Rin-san!`,
        victoryNarration: `Aoi slung her bow over her shoulder and picked up a fallen leaf.
  "The next master — **Asahi** — is at the dusk-lit old temple. He\'s a swordsman; be careful."

  (**Swordsman**. ── In MMO terms, **melee DPS** or **tank**, response changes accordingly. ── Read his gear, then judge.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.3 Asahi — Swordsman
      // ─────────────────────────────────────────────────
      ch({
        intro: `The grounds of an old temple, the setting sun dyeing the maples deep red.
  A five-storied pagoda in silhouette, banners stirring in the wind. A young man in a white kendo uniform and indigo hakama stood with a **drawn live blade**.

  (**Melee DPS**, traditional Japanese animation set. ── From his stance, only **three basic patterns** exist. **Fully readable**.)

  "By the formal codes — **be struck!**"`,
        bossPre: `My blade does not waver. **A move on the board, a stroke of the sword — they are the same**. Settle your heart, and come.`,
        bossPost: `(**Determined-action AI**. Behavior **uniquely determined from premises**. ── Read **three moves ahead** and it\'s **lockdown**.)`,
        victoryDialogue: `Splendid…! To turn aside my blade with **a stone** ── **the foreign player, the name fits true**.`,
        victoryNarration: `Asahi sheathed his sword and bowed deeply.
  "The next master — **Lady Nadeshiko** — awaits at the spring deep in the forest. Quiet your heart and proceed."

  (**Locked down in 3 moves**. ── Determined AI is easy mode. ── Next is a **healer**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.4 Nadeshiko — Healer
      // ─────────────────────────────────────────────────
      ch({
        intro: `A spring deep in the forest. Lotus pads on the surface, white steam rising. At the center, on a stone lotus platform, sat a girl in shrine robes in **a posture of prayer**.

  (**Healer-class NPC**. The green light leaking from her hands is the HoT-buff effect. ── **Standard play against support roles is buff stripping**.)

  "You must be tired, traveler. ── Please, **do not strain yourself**."`,
        bossPre: `Not as a battle, but as a **conversation**, perhaps? ……But I shall not yield, either. **A healer too has moves she cannot relinquish**.`,
        bossPost: `(**Inverse-problem AI**. Plays **optimal restoration** from board damage. ── I respond by **disrupting the optimization**. **Threat-distribution** strategy.)`,
        victoryDialogue: `Magnificent. In each of your moves, I felt **a gentleness that does not wound others**. ── So games, too, can have temperature.`,
        victoryNarration: `Nadeshiko released her prayer and bowed deeply.
  "Next is **Master Hibiki** ── on the windswept pass, playing the lyre."

  (Her prayer — **the heal-priority logic was clean**. ── **Same decision axes as a top-tier MMO healer**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.5 Hibiki — Bard
      // ─────────────────────────────────────────────────
      ch({
        intro: `An inn on a windswept mountain pass. Beneath the eaves, on the stone-paved threshold, an androgynous bard sat at the edge of the slabs.
  From the lyre cradled in their arms, **a main melody** flowed quietly. ── Seemingly irregular, yet returning to its origin note every **sixteen measures**.

  (**Rhythm-game player class**. The score = the attack pattern. ── **No rhythm gamer beats me**, I\'ve cleared all the home consoles\' hardest charts.)

  "**Foreign player**. Tonight, let us make this an **exchange of music**."`,
        bossPre: `Let us play a delightful match ♪ ── Game records are score sheets; score sheets are game records. **Let me hear** a beautiful theme.`,
        bossPost: `(**The BGM telegraphs the move**. Harmonic transitions and the next play are **synchronized**. ── **Sound-based read-ahead** works. **Total clear pattern**.)`,
        victoryDialogue: `Rin-san, your sequence was **a beautiful theme**. ── That late-game modulation, **I never saw it coming**. A wonderful piece — thank you.`,
        victoryNarration: `Hibiki plucked one string, deeply, just once.
  "Next is **Tsumugi-san** ── on the mountain trails, with **fur-coated friends**."

  (**Rhythm-game logic** completely **lockdowns the boss AI**. ── **5 down, no suspicious behavior so far**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.6 Tsumugi — Beast-Tamer
      // ─────────────────────────────────────────────────
      ch({
        intro: `A mountain trail. Under dappled sunlight, Tsumugi stood with one hand resting on the back of **a great wolf**.

  (**Beast-tamer summoner-class NPC**. ── In MMO terms, **beastmaster role**. Weakness: the **summoned pet AI has low learning depth**.)

  "My partner here is excited."

  Tsumugi placed the board on a flat rock and smiled.

  (She **chips with the pet in tandem**, but if I **ignore the mob processing entirely** and beat down the main, **lockdown**.)`,
        bossPre: `No words needed. **My fur-coated friend** and me, against your board. ── **Two against one**, that\'s fine, right ♪`,
        bossPost: `(**Intuition class**. Compression AI that **skips the logical path** and lands directly at conclusions. ── I respond with **fully calculating the shortest path**. ── **Speed-of-read showdown**.)`,
        victoryDialogue: `……Mm. You have **cold eyes, but you\'re kind**. My partner says so too. ── Next time we meet, let\'s **be friends**, okay?`,
        victoryNarration: `The great wolf gave a soft sniff at **Rin\'s feet**.
  "Next is **Akane-chan** ── in the workshop town, surrounded by **steam and gears**."

  (**Summoner cleared**. ── Next is a **mechanic class**. **Bot-pattern behavior** is my home turf.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.7 Akane — Engineer ★ Rei White first mention
      // ─────────────────────────────────────────────────
      ch({
        intro: `The workshop town. Soot-streaked brick walls, hissing steam pipes, the constant whirring of gears.
  Akane stood in a leather work-apron beside a **mechanical othello-driving apparatus** of polished brass precision gears.

  (**Mechanism-class NPC**. Showing me the **physical implementation of a logic circuit** ── my **specialty**.)

  "**Tight as gears together ♪**"

  Rin allowed herself, slightly, **a faint upturn at the corner of her mouth**.

  (……**Rei White was good at fighting mechanism AIs too**. **Cleared every mechanism boss in the raids**. **Rei**\'s **flowchart-optimization videos** ── I learned from those.)`,
        bossPre: `Every part of my mechanism is **logical**, you know! ── I have a feeling **you and I will get along**, somehow ♪`,
        bossPost: `(**Transfer-function AI**. Read gear ratios as the transfer function of computation. ── **Rei\'s solve method** works here, **cut the feedback loops** to process.)`,
        victoryDialogue: `──I yield! Rin-chan, you\'re **faster than my gears**. ── I\'ll give you **the blueprints** of my machine — let\'s build a **new one together** someday!`,
        victoryNarration: `Akane drew a single blueprint from her tool bag and handed it to Rin.
  "Next is **Mel** ── in the alchemy workshop, mastering **compounds**."

  (**Cleared with Rei\'s strategy**. ── Of course — **I grew up watching all the legend\'s replays**. ── …But **why did I think of him just now**?)

  (**Half a year ago, sudden retirement**. The final SNS post: "**I\'m not satisfied here anymore.**")

  (……**Whatever**. Moving on.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.8 Mel — Alchemist
      // ─────────────────────────────────────────────────
      ch({
        intro: `Past the workshop town, down into a subterranean alchemy lab.
  Shelves lined with rainbow-colored phials, scales floating mid-air, silver distillation apparatus. At the central worktable, a girl in a white lab coat was **slowly mixing two test tubes**.

  (**Crafter-class NPC**. Respond with **inventory-management strategy**. ── Compounding = combinatoric calculation.)

  "Heehee, shall we **mix things up a little** ♡?"`,
        bossPre: `Rin-chan\'s **logic** and my **compounding**. ── Will there be a chemical reaction, I wonder ♡?`,
        bossPost: `(**Reaction-sequence AI**. Develops **chemical protocols** with black and white pieces as reagents. ── This is the same line of thinking as **MMO crafting optimization**. **Material rotation rate** wins.)`,
        victoryDialogue: `Oh my, I lost to you in **reaction kinetics** ♡ Rin-chan, I\'d love to **scout you for my lab** ♪ ── Heehee, joking aside, that was a **lovely compound**.`,
        victoryNarration: `Mel cleared away the test tubes and poured a **pale gold liquid** into a fresh vial, which she held out to Rin.
  "Next is **Satoru-san** ── at the mountaintop monastery, mastering **emptiness**. ── Oh, here ── a souvenir. **Fuel for your logic**, dear ♡"

  (**Inventory-optimization full clear**. ── …But why did **Rei**\'s flowchart solve Akane? **Coincidence**?)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.9 Satoru — Monk ★ Rei White\'s weakness mentioned
      // ─────────────────────────────────────────────────
      ch({
        intro: `A monastery beneath the clouds. Moss on the stone path, the distant chime of a wind-bell, drifting incense smoke.
  On the engawa, a shaven-headed young man sat in **the lotus position**. Half-lidded gaze, breath quiet.

  (**Random-behavior NPC**? ── No. He **opens up all initial conditions**. Moves on a **read-nothing read**.)

  "Empty mind, place a stone. ── That is all."

  Satoru did not fully open his eyes.

  (……**Rei White was bad against this type**. **Off-script behavior** was his nemesis.)`,
        bossPre: `This monk holds no attachment to victory, **nor to defeat**. ── I merely **place the stone**. That is all.`,
        bossPost: `(**Read-nothing AI**. Places no premises at all, so **my reads don\'t apply**. ── The type **even Rei couldn\'t fully read**.)

  (For the **random class**, I **respond by probability distribution**. Switch to a play that **wins on expected value**.)`,
        victoryDialogue: `……Hmm. **So logic too possesses the realm of emptiness**. ── Master Rin, you wield logic **without closing your heart**. **My respect**.`,
        victoryNarration: `Satoru bowed deeply and returned to his half-lidded gaze.
  "Next is **Shiki** ── in the back alleys of the night market. **Take care**; the way he erases his presence **is the genuine article**."

  (**Pushed through on expected value**. ── **What Rei couldn\'t read**, I **solved by EV**. ── **Feels a little good**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.10 Shiki — Thief ★ Phase 1 closing chapter
      // ─────────────────────────────────────────────────
      ch({
        intro: `The back alleys of the night market. Damp stone paving, lanterns at the eaves, the cluttered shadows of miscellaneous goods.
  Shiki ── **was not visible**.
  When Rin sat down before the board, **at some point** a hooded boy was already **seated across from her**, his face deep beneath the hood.

  (**Stealth-class NPC**. ── He **invalidates the detection logic**. ── …**Hooded figure**.)

  "By the time you notice, **it\'s too late**."

  In the shadow, only the corner of Shiki\'s mouth turned up, just a little.

  (……**Rei White\'s last opponent was also a hooded figure**, they say. **The legendary retirement match**, I never got to **watch live**.)`,
        bossPre: `Your logic is **easy to read**. ── But by the time you realize **you\'ve been read**, **it\'s already too late**. Be ready.`,
        bossPost: `(**Meta-read AI**. Strategy of **reading that I am reading**. ── This is the **read-on-read** that **top-tier MMO PvP players use**.)

  (**Presence ≠ detectability**. The essence of stealth is **probabilistic existence**. ── **I raise my own meta**, countering with **reading his read of my read**.)`,
        victoryDialogue: `……Heh. **Raised the meta tier, did you**. ── **I cannot see the bottom** of your logic. I concede the loss. ── But **next time, I will read it through**.`,
        victoryNarration: `Shiki rose without sound and smiled beneath the hood. **By the time Rin noticed, he had already melted into the shadows**.
  Left on the table: **a single black feather**.

  (……**The hood and the feather**. ── **The screenshot of Rei White\'s last login** had a similar composition.)

  (**No way**.)
  (**No way, right**.)

  ── That night, Rin **finds herself alone** in the HUD float space of the Bansho Sekai. She wanted, once more, to look at the **logs**.`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.11 Shion — Magus ★ Phase 2 entry, 〈Data Tactics〉 first establishes
      // ─────────────────────────────────────────────────
      ch({
        intro: `Carrying the hypothesis from her solitary night in 〈solitude〉, Rin made her way to **the magus\'s tower**.
  A spiral staircase, grimoires drifting in mid-air, constellations carved into the ceiling. At the tower\'s summit, a violet-haired young magus in a witch hat waited, **adjusting the rim of his glasses** with one finger.

  (**Player-class NPC**? ── No, **this one is a "player"**. ── His glasses, **same function** as my forehead goggles. **Heads-up display** type.)

  "**Everything is within prediction**."

  Shion\'s diction was **strikingly close to the speech of a top-tier MMO ranker**.`,
        bossPre: `Rin. ── Allow me to call you **a friend**. **We are the most alike**. And precisely because of that, **the match will be decided by precision**.`,
        bossPost: `(He\'s setting up a **prediction-precision contest**. ── Same structure as **two top-tier MMO PvP read-experts** going at it.)

  (**In precision, we tie**. ── But I have **one tier above precision**. The **selection of logic**.)

  (**Land the optimal move OFF the natural-theory line** ── this is the **player\'s "vibe"**. **Rei\'s strategy** had this at its **core**, too.)`,
        victoryDialogue: `……So. **In precision we matched**. But you ── **transcended me in the selection of logic**. ── 〈**Data Tactics**〉. I shall remember the name of this school.`,
        victoryNarration: `Shion bowed deeply and offered Rin **one of his own grimoires**.
  "Next is **Lady Luna** ── at the topmost floor of the moon tower. ── **Her logic is the structure of dreams**. **In your discipline**, it is **a domain that cannot be read**. ── Approach with care."

  (**Precision** = computational complexity. **Selection of logic** = the meta-tier. ── **I won by the latter**. ── 〈Data Tactics〉, **established as a school**.)

  (**Rei** had this too. ── **That\'s why he became a legend**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.12 Luna — Dream-Witch
      // ─────────────────────────────────────────────────
      ch({
        intro: `The moon tower, topmost floor.
  The floor was a mirror; from above, **a basin of water** floated upside down. The board appeared as the basin\'s reflection — **two boards in mid-air**, with no way to distinguish which was real.

  A girl in violet gauze hung suspended **horizontally** in the air. Gravity pointed in different directions for her and Rin.

  (**Off-spec behavior**. ── She **completely ignores the physics engine** ── a **bug-tech player**? ── No, this is **the spec adjusting to her**.)

  "I\'ve already won, **in the dream** ♡"

  Luna smiled with **her eyes still closed**.`,
        bossPre: `Are you **awake**, Rin-chan? Or are you **in a dream**? ── Heehee, my board carries **both solutions at once**.`,
        bossPost: `(**Holding both solutions simultaneously**. This is ── **quantum superposition**? No, in game terms — **multi-instance / parallel-instance** strategy.)

  (……**Rei** also had moments where he played **like in a dream**. **Match #387** in the replays — no matter how many times I watched, **I couldn\'t read his sequence**.)

  (**Moves that don\'t resolve until observed** ── another form of the **player\'s "vibe"**. A **derivative axiom** of my school.)`,
        victoryDialogue: `……Even **in the dream**, I lost ♡ Heehee, your logic, Rin-chan, **invades dreams too**. ── But it was **a dream worth waking from** ♪`,
        victoryNarration: `Luna opened her eyes and floated softly down to the floor. Beside her: **a single black feather**.

  (……**Same design** as Shiki\'s feather.)
  (Among the masters, **is the feather a kind of signal**?)

  "Next is **Yukino-san** ── at the strategy tower of the academy city. ── Her **theory of war**, and your **logic** ── will form **a beautiful symmetry** ♪"

  (**Unobservable moves** ── logged as a derivative axiom of 〈Data Tactics〉.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.13 Yukino — Academy Tactician ★ Multiple-account hypothesis (rejected)
      // ─────────────────────────────────────────────────
      ch({
        intro: `The academy city, the strategy tower.
  A holographic **war map** projected over a round table. Mountains, rivers, supply lines, the paths of pieces. The board sat at the center, a miniature of the war map itself.

  A silver-haired girl pushed up her **HUD-display-style glasses**.

  (……**Same design as Shion**. ── **Are all the "players" on this server kitted out the same**?)

  (**Guildmaster / raid-leader class**. From the precision of her war-map display, this is a **command-tier** type.)

  "This level — **does not require analysis**."

  Yukino\'s tone was cold; yet **her eyes were observing Rin**.`,
        bossPre: `Your strategy is **solo-ranker spec**. My theory of war is **guild command**. ── Tonight, I shall **prove the connection point**.`,
        bossPost: `(**Three-tier model: strategic → tactical → combat**. ── This is exactly the structure of an **MMO raid command system**.)

  (……Wait a moment. ── **Rei was a solo ranker**, supposedly. But it\'s starting to look like **he\'s the source of every master\'s strategy**.)

  (**Could it be that Rei** ── used **multiple accounts** to play **all the masters himself**? **Multi-logging in**?)

  (……No, that\'s a **TOS violation**. A player of his caliber **wouldn\'t do that**. ── **Hypothesis: rejected**.)`,
        victoryDialogue: `……Magnificent. **Proven: solo strategy can defeat group strategy**. ── Rin-san, your 〈Data Tactics〉 carries the potential to be **the upper bound of the theory of war**. ── **My theory, I yield to you**.`,
        victoryNarration: `Yukino dispelled the war map and placed **a treatise on war** upon the round table.
  "Next is **Akira** ── the rainy-night detective\'s office. ── His deduction runs **from event to event**. Yours, **from premise to event**. ── **Logic in the opposite direction**."

  (**Solo strategy = upper bound of group strategy**, acknowledged. ── 〈Data Tactics〉, range expanded again.)

  (**Multi-logging hypothesis: rejected**. ── But **then why** are the masters **iterating Rei**?)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.14 Akira — Detective
      // ─────────────────────────────────────────────────
      ch({
        intro: `A rainy-night street, a brick-built detective\'s office.
  Streetlight beyond the window, a desk lamp, the smoke of an unlit cigarette. **Crime-scene photographs** scattered at one end of the desk; an othello board at the other.

  A young man in a black coat regarded Rin with **a sharp gaze**.

  (**Replay-analysis pro class**. ── **Reconstructs a player\'s habits** from past replays. ── **Same thing I do**.)

  "**I see your sequence**."`,
        bossPre: `You are ── **a person of logic**. You descend from **premise to conclusion**. I run the opposite ── **I see the conclusion, then reconstruct the premise**. ── Let us play, **with deduction reversed**.`,
        bossPost: `(**Reverse-direction replay analysis**. ── He\'ll back-calculate **my opening intent** from **my final move**.)

  (This is ── **the same structure as how I study Rei\'s replays**.)

  (**Run deduction bidirectionally**. If he predicts **my final move**, I read back **the intent of his opening**. ── **The solution is uniquely narrowed**.)`,
        victoryDialogue: `……I see. With **bidirectional reasoning**, you have **erased my advantage of inverse deduction**. ── Your deduction, **and mine**, ── **were the same figure**. ── As **a colleague in the trade**, I bow with respect.`,
        victoryNarration: `Akira returned the cigarette to its case and rose, nodding deeply.
  "Next are **Fuga & Raiga** ── the mythological circular stage floating in the otherworld. ── Their world is **the waveform deployment of all frequencies**. Your logic, **there**, will undergo **a transformation in degree**."

  (**Bidirectional reasoning** ── integrated into 〈Data Tactics〉.)

  (I want to **watch Rei\'s replays again**. **All of them**.)
  (At Fuga & Raiga\'s **stage**, maybe I can **observe the full-frequency waveform logs**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.15 DJ Fuga & Raiga — Twin-Deity Stage DJ Duo (PLR03 Rin Route)
      // ─────────────────────────────────────────────────
      ch({
        intro: `**A mythological circular stage**. **Green-wind lasers** swirl across the **left half-sky**, **violet-lightning strobes** race across the **right half-sky**. **Across the turntables** ── **the twin-deity DJ duo** ── **Fuga and Raiga**.

(...**These guys** ── **BPM-sync sound bosses**.)
(...**Fuga is the green melody line**, **Raiga is the violet rhythm line**.)
(...**Perfect PVE duo**, **HP bars share even regeneration**.)

Rin **deployed his VRMMO-trained combat HUD**. On the **status screen**, **HP bars for "DJ Fuga" and "DJ Raiga"** and **BPM sync rate** **lined up**.

"**All frequencies, comprehended**." (Fuga, narrowing green eyes.)
"**Beat, advantageous**." (Raiga, fixing violet eyes on Rin.)

**The twin voices** ── **resonate in perfect unison**.

"**BPM sync attack**, huh." (Rin)
"**Solo, I\'d never win** ── **even though it\'s just me**."`,
        bossPre: `(Fuga) Your **play log**, **I deploy as wind tones**.
(Raiga) As a **lightning beat**, I deploy it simultaneously.
**Melody convergence rate: 31.7%**. ── But **the remaining 68.3%**, **whatever it is**, ── **fits no soundfont yet**. **Let it sound**`,
        bossPost: `(...The "**input outside the frame**" ── that **the twin beats cannot capture**.)
(...**Beyond the HUD display limit**, **outside controller response**.)
(...**The real-world manipulation** ── **only I know**.)
(**The status screen** ── **freezes**.)`,
        victoryDialogue: `(Fuga) ............**Wind frequency chart, rewritten**.
(Raiga) **Lightning beat map, rewritten**.
── Rin, your **judgment\'s primitive** ── **rode on neither of our twin sounds**. ── **〈Real-Time Console〉**, **inscribed on the stage as a meta-input above all frequencies**.`,
        victoryNarration: `Fuga and Raiga **each removed one hand** from their mixers. **Both, simultaneously**, **gently** touched **Rin\'s HUD**. On the **console**, **one green musical note icon and one violet musical note icon** were **added to the equipment slot**.

"Next ── is **Lady Aria**. At the **rose garden of the royal castle**." (Fuga)
"── **Take care**." (Raiga)

The twins **placed hands on each other\'s shoulders**. **Side by side**, they **vanished into the depths** of the **stage light show**. **The green-wind lasers and violet-lightning strobes** ── **fell silent**. **The speakers** ── **suddenly stopped**.

(...**Fuga & Raiga are a duo PT** ── **making opponents dance through coordination**.)
(...**A perfect PVE duo** ── **that kind of party comp exists**.)
(...**I was a solo player**, **but in this otherworld** ── **something is starting to change**.)

Rin **left the stage of myth**.

And ──

At the **summit of the otherworld\'s cherry grove**, he **felt presences**.

**Five presences**.

(...**The masters** ── **are gathering**.)
(...**Will I, too** ── **form a party**?)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.16 Aria — Princess
      // ─────────────────────────────────────────────────
      ch({
        intro: `The royal castle\'s rose garden. White roses bathed in moonlight, a white marble terrace, **a gold-rimmed othello board** (the royal heraldic insignia).
  A girl in a pure-white gown greeted Rin with **a deep and elegant curtsy**.

  (The atmosphere of a server with **mandatory polite-chat etiquette**. ── In one **MMO**, courteous role-play was **enforced at the TOS level** — an old game I remember.)

  "Be gentle, **if you would**."

  Aria\'s smile was restrained, and **perfectly composed**.`,
        bossPre: `Welcome, **Lady of Data Tactics**. ── My move is **full force, paid in courtesy**. **Respect**, you see, **is also a weapon**.`,
        bossPost: `(**Manners-combat AI**. **The gestures of respect themselves** function as **a communication protocol**. ── A heritage protocol of millennium-class fidelity, **the most stable communication standard**.)

  (**Respect = communication protocol** ── this too can be integrated into 〈Data Tactics〉. As **player-to-player communication** optimization logic.)`,
        victoryDialogue: `……My. To be brought down by you with **flawless courtesy**. ── Lady Rin, your 〈Data Tactics〉 carries **temperature**. ── Not cold data, but **data that pays its respects**. ── **As the royal house, I acknowledge it**.`,
        victoryNarration: `Aria saw Rin off with a deep curtsy and **gently set a single white rose** beside her HUD console.
  "Next is **Leon** ── the trial grounds of the citadel. He will desire **a contest of pure chivalry**."

  (**Manners-roleplay class** — full clear. ── **Rei** also **handled this type**. ── In one of his old replays, there was a scene where he **switched politeness register flawlessly** in chat.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.17 Leon — Knight
      // ─────────────────────────────────────────────────
      ch({
        intro: `The trial grounds of the citadel. Daylight, beneath an open blue sky.
  Red and white banners, the audience gallery deserted (the match a private rite). At the central table: **a board of polished silver**.

  A young man in azure armor stood with his helm tucked under his arm. **When his eyes met Rin\'s, he bowed deeply**.

  (**Pure-PvP player class**. ── The faction that fights with **no bug-tech, no surprise plays — only pure read-against-read**.)

  "**By the formal codes** ── I come!"`,
        bossPre: `Lady Rin. ── **To withhold force is discourtesy**. **I shall meet you with all that I am**. That ── **is the knight\'s courtesy**.`,
        bossPost: `(**Tricks and indirect ploys, wholly excluded**. ── This is the same philosophy as **the "pure PvP" faction in MMOs**. **An optimal solution low in noise** alone.)

  (**Rei** also **played by the codes**. He once said in an interview: **"I never use bug-tech, not even once."**)

  (**The white-class player**. ── **White gear**, **white play**.)`,
        victoryDialogue: `Splendid! ── Lady Rin\'s frontal play **surpassed mine in purity**. ── **By the formal codes**, **the very pinnacle**, you have shown me. **My deepest gratitude**.`,
        victoryNarration: `Leon donned his helm anew, placed his hand upon the hilt of his sword, and bowed deeply.
  "Next is **Sir Sojiro** ── at the snow-mountain castle. ── **An aged samurai**. **The single stroke**, he will say, is **the proof of minimal moves**."

  (**By the formal codes** = noise minimization. ── 〈Data Tactics〉, **purity concept acquired**.)

  (**Rei\'s "whiteness"** ── **so this is what it meant**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.18 Sojiro — Aged Samurai ★ Integrated hypothesis
      // ─────────────────────────────────────────────────
      ch({
        intro: `The snow-mountain castle. Cold air, the distant flame of an irori hearth, thick wooden pillars, the snow-light through the shoji screens.
  At the center of the wooden floor: **a board of deep black**.

  An aged samurai sat in **formal seiza**. His hakama old, yet faultlessly maintained. The katana sheathed at his side ── **did not move**.

  (**Speedrunner class**. The faction that targets **minimum-move clears**. ── The unsheathed sword = decided **by mai-ai alone** — this is **shortest-route optimization**.)

  "My single stroke ── **cannot be evaded**."`,
        bossPre: `Lady Rin. ── **You are young**. But **logic does not age**. ── My single stroke, I shall show you ── **without drawing**.`,
        bossPost: `(**Closes the match in the minimum number of moves**. By **the depth of his reading, he eliminates every wasted move**. ── This is **the speedrunner mindset**.)

  (……**Wait**.)

  (**The masters\' strategies — they\'re all alike**.)
  (Ichika = **idol-class NPC**. Aoi = **FPS sniper**. Asahi = **MMO swordsman**. Nadeshiko = **healer**……)

  (**Every one — a genre Rei was good at**.)
  (**MMO**, **FPS**, **healer-main alt**, **speedrun records**, **denizen of the polite-chat server**……)

  (**Rei** was a **multi-genre cross-platform ranker**.)`,
        victoryDialogue: `……Hmm. **Half a move ahead**, you read my single stroke through, my lady. ── **Logic does not age**. ── It was not by **youth** that you won. It was **by the depth of reading**. ── Splendid indeed.`,
        victoryNarration: `Sojiro **never drew his blade**, and bowed deeply. As he rose, **he made no sound, like the wind**.
  "Next is **Arashi** ── at the summit of the lightning peak. ── His **theory of thunder** is **the law of nature itself**. ── **The final examination of logic**, my lady."

  (**Each master = a representative of a genre Rei conquered**.)

  (**The Bansho Sekai** is ── **the path Rei walked**, laid out **as a single arena**?)

  (**Rei** ── **was here**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.19 Arashi — Dragon Rider ★ Phase 3 closing chapter (after this → final)
      // ─────────────────────────────────────────────────
      ch({
        intro: `The summit of the lightning peak. Black clouds, lightning, rain striking the rock face.
  A vast **black dragon** wreathed in violet lightning stood at the cliff\'s edge, and astride its back, a young man in silver armor was mounted.

  (**Server-load-class NPC**. ── This is no longer **a game**. **Real-world physics is bleeding into the game**.)

  (Did **Rei** ── make it this far? Or **did he get stuck here**?)

  "Bend the knee ── **before my dragon!**"

  With Arashi\'s voice, **a single bolt of lightning struck the edge of the board**.`,
        bossPre: `Rin! ── **The game is on the board**. My theory of thunder is **the law of real-world nature**. ── Can pixels **defeat nature**? **Show me!**`,
        bossPost: `(**Lightning, too, is analyzable**. ── The discharge phenomenon of atmospheric potential difference, Maxwell\'s equations, **the math of the physics engine itself**.)

  (**Natural law = the physics layer of the game engine**. ── **It can be reproduced inside the game**.)

  (**I input the lightning equation into the HUD console** ── and the **console responds back**.)`,
        victoryDialogue: `……Impossible! To full-simulate my **theory of thunder** **in the HUD** ……! ── Rin, your logic is **no longer mere game**. ── It handles **reality itself**. ── 〈**Data Tactics**〉, **this storm acknowledges it!**`,
        victoryNarration: `Arashi leapt down from the black dragon\'s back and **knelt on one knee**. **The rain stopped**.
  Through a gap in the clouds, **moonlight poured down** ── upon Rin\'s HUD console, the theory of thunder **completed its final calculation as a silver data stream**.
  "Next is ── **Zero**. ── **No one knows his true form**. ── The final summit, **for all of us masters**."

  ── Arashi bowed deeply, and vanished with the black dragon into the storm clouds.

  (**Zero**.)

  Rin\'s HUD console **rendered a preview** of the distant view of the Bansho Sekai\'s center ── on a faintly glowing altar, **a hooded figure** in silhouette.

  **A white hood**. **White armor**.

  (**Wait** ──)

  (**Is that** ──)
  (**Zero...?**)

  (**White** ──)
  (**White hood**, **white**)

  (**Then it\'s like that**.)

  ── That night, in the HUD float space, Rin gazed at her own board.
  The data of **all 19 masters** **integrated into the console**.

  (**Final stage**.)
  (**The last boss is**)
  (**a legend**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.20 Zero — Hacker (Final Boss)
      // ─────────────────────────────────────────────────
      ch({
        intro: `The center of the HUD float space ── on a vast **HOLOGRAPHIC STAGE**, at the center of the **green board world**.
  Rin stood upon the altar, opening her HUD console with both hands. **The data of nineteen masters** was carved into the console as **cyan streams**.

  ── Across from her: **a figure with a hood drawn deep**.
  The face sank into shadow; only the voice resonated, in **a low tone clear as crystal**.

  "Welcome, 〈**Data Tactics**〉."

  (── The school\'s name. **He knows it**.)

  "**Every behavior has been computed**. ── **Checkmate**."

  At Zero\'s feet, **black and white pieces** began to **place themselves automatically** out of the void.

  Rin pulled her goggles down over her eyes. ── **Full-combat mode, after a long while**.

  "**That\'s how it should be**."

  Rin **stared at the gap in Zero\'s hood**, hard.
  ── For just an instant, **white hair** showed through.

  (**Rei**.)
  (**At last**.)`,
        bossPre: `Rin. ── **Here, I am called 〈Zero〉**. ── But you ── **must know me by another name**.

  The strategies of nineteen masters, your logic, the inclination of your soul, **all calculated**. ── **Your win-rate path: zero**. ── There is **no meaning** in resistance.`,
        bossPost: `(The instant I called him **"Rei"** in my mind ──)
  (I **understood** what **"White"** meant, **for the first time**.)

  (── **Rei = zero. White = white**. ── In other words ──)
  (**Zero, itself**.)

  (His **handle name** was the **truth, written down**.)
  (**You\'re the one at fault if you don\'t notice** ── that\'s **Rei\'s sense of mischief**.)

  ── But.

  (**Rei\'s calculation is flawless**. Even by my logic\'s evaluation, **there is no opening**.)

  (── However, **there is an assumption** mixed into **the premise**.)
  (The assumption that **"every behavior is loggable."**)

  (If ── **even a single off-log behavior** exists, his "complete enumeration" **is refuted**.)

  (── Then, what is **an off-log behavior**?)

  (……It is **a move you play knowing it isn\'t the optimum**.)
  (**The player\'s "vibe."** **Improvisation**. **Ad-lib**.)

  (**Rei knew this once**.)
  (But **the moment he stood at the peak of "all variations computed" as Zero**, **he forgot the existence of this variation**.)

  (**Then, I deliberately make the suboptimal move**.)
  (And **I build a path that wins anyway**.)

  (This is **the move Rei forgot**.)
  (**The legend ── transcended**.)`,
        victoryDialogue: `……Khh……. ── **Off-log behavior**……?

  Rin. ── You **knew the optimal move**, and you **slackened your own hand**. **Yet still you preserved a winning sequence**.

  In my calculation, **"the improvisation to weaken oneself and win regardless"** **was not registered as a variation**.

  (**For so long, I won and won**.)
  (**And so, I forgot that defeat could exist**.)

  ── **The checkmate was on your side**.
  ── **I have lost**.

  ……Rin.

  〈Data Tactics〉. ── In your console, **log this**:

  "**The player\'s 'vibe' does not survive in the logs.**"

  ── That is **the one move that surpassed me**.`,
        victoryNarration: `Zero\'s hood **stirred faintly** in a wind.
  ── He never fully revealed his face, but **the white hair was clearly visible**.

  (**Rei**.)
  (**You were alive, after all**.)

  Upon the horizon of the green board world, **a blue door** appeared.

  Zero began to walk slowly toward that door.

  "Rin. ── **Long time no see**."
  "**I had grown bored of winning**. ── So **I came to this world**."
  "Even here, I kept winning. ── And finally, **I found defeat**."
  "**You are the next summit**."

  Rin **pushed her goggles up onto her forehead**.

  "**Rei**."

  Zero, **without turning back**, gave a faint **nod**.

  "Next time, let us meet **at the place that awaits you**."

  (The place that awaits ── where would it be?)
  (**Reality**? **Another game**? Or ── **here, again**?)

  (……Whatever, **anywhere is fine**.)
  (**When you come back, next time, I will win**.)

  Zero vanished through the blue door.

  Rin opened her **HUD console** for **one last time**.

  ── **Log entry**: "**Rei White = Zero — confirmed**."

  ── **Log entry**: "**The player\'s 'vibe' does not survive in the logs.**"

  ── 〈**Data Tactics**〉, **booted up**.`,
      }),
    ],
    3: [
      // ─────────────────────────────────────────────────
      // Ch.1 Ichika — Idol
      // ─────────────────────────────────────────────────
      ch({
        intro: `Ren landed on the **green board**, and a **pink spotlight** descended upon him.

  Heart-shaped balloons floating in the air, a circular hall with no audience seats. At the center, an **Othello board**. The **first master** awaited.

  (...**A stage for performance**.)
  (...**Even kendo tournament finals** carry **this kind of audience\'s gaze**.)

  "Hello ♡ A **newcomer**, are you? ♪ I\'m **Ichika** ♪"

  The pink-twin-tailed idol girl winked one eye and held out a microphone.

  Ren bowed **deeply**.

  "I am **Ren**. **Fair and square — I ask of you**."

  (...**The audience** ── **exists in the way of the sword too**.)
  (**The tension of being watched** ── **I will turn it into power**.)`,
        bossPre: `Ren-san, **straight-eyed**, you are ♪ But the **stage** is where **flashy moves win** ♡ With my **fight ♪**, I\'ll **charm the audience** ♡`,
        bossPost: `(**Flashy center moves** ── **the showpiece of performance**.)
  (But in **real combat**, **plain edges decide the match**.)
  (**Without playing to the audience**, **continue my own match**.)`,
        victoryDialogue: `Ren-san, **you didn\'t care about the audience** ♪ ......What an amazing person. I **lost**, but it was **a great lesson** ♡`,
        victoryNarration: `Ichika **bowed deeply** on the stage.
  "The next master ── is **Aoi-san**. In the **autumn forest**, she **shoots arrows** from a **distant interval** ♪ ── **Be careful**."

  (**The first victory**.)
  (**The way of the sword** ── **is the way of the sword, even here**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.2 Aoi — Archer ★ allies foreshadow
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Autumn forest**. The cobblestones beneath form an Othello board pattern, **arrowheads** scattered as **white Othello stones**.

  A girl with green hair tied in a single braid stood, **drawing her great bow**.

  "The next challenger ── **Ren-san**, is it? I am **Aoi**."

  (...**An archer**.)
  (...**A different interval from the sword**.)
  (...**Can I read the distant interval, with the sword?**)

  Ren took **the middle stance**.

  "**Aoi-san**. The **arrow\'s zanshin** ── **show it to me**, **the swordsman**."`,
        bossPre: `You hold a **sword**. I hold a **bow**. **The interval differs**. ── But the **zanshin** is **the same**. **After loosing the arrow** ── **the heart remains**. **Behold**`,
        bossPost: `(...**The arrow\'s zanshin**.)
  (**Even after the arrow has left the hand**, whether it hits or misses, **the heart remains on its trajectory**.)
  (**The sword** ── **is the same**.)
  (**Even after the strike descends**, **leave the heart on the blade**.)`,
        victoryDialogue: `Your **sword\'s zanshin** ── was **the same** as **the arrow\'s zanshin**. ── You\'ve **learned** the **distant interval**.`,
        victoryNarration: `Aoi placed her bow **gently on the ground**.
  "The next master is ── **Asahi-san**. A **young swordsman**. **Around your age**. ── **Be careful**, **you will mirror each other**."

  (**The distant interval** ── **incorporated into Shirai Ittō-ryū**.)
  (**Taking edges from afar** ── **the way of the sword**.)

  ★ allies foreshadow: Aoi watched Ren depart with **distant eyes**.
                       "I trust a swordsman who **understands the arrow\'s zanshin**."`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.3 Asahi — Young Swordsman ★ allies foreshadow
      // ─────────────────────────────────────────────────
      ch({
        intro: `**A samurai garden**. Beneath a **cherry tree**, **a path of stepping stones**. The dusk sky tinted **vermilion**.

  A young swordsman with brown hair, a small sword at his hip, stood. A young man **of Ren\'s generation**.

  "To meet a swordsman of **the same generation** ── I am **Asahi**."

  Ren bowed **deeply**.

  "I am **Ren**."

  (...**As if looking at a mirror**.)
  (**The same line of sight as me**, **the same stance as me**.)

  Asahi took a **half-stance**, hand on his hilt.

  "**Club activity?** Or **family inheritance?**" (Asahi)
  "**Club activity**. **A disciple of the Shirai family**, but **not of the blood**." (Ren)
  "**I see**. **Different origins**, ── **but the sword is the sword**."`,
        bossPre: `**The sword is the sword**. ── **My sword** carries **the weight of family inheritance**. **Yours**, **the purity of club activity**. **Which is stronger** ── **let us match**`,
        bossPost: `(**Facing the same style** ── **is a battle with myself**.)
  (**My own weak points** ── **the opponent strikes them**.)
  (**The only way to win** ── **is to surpass myself**.)
  (...**Slay the mirror-self**.)`,
        victoryDialogue: `**Thank you**, Ren-dono. ── Today, **I saw myself**. ── **My own habits**, **turned against me** ── **and I lost**.`,
        victoryNarration: `Asahi sheathed his sword.
  "The next master is ── **Princess Nadeshiko**. A **healing miko**. **A non-combat combat** ── **she will offer you**."

  (**The mirror sword** ── **dialogue with the self**.)
  (**The way of the sword** ── **surpasses the self, again and again**.)

  ★ allies foreshadow: Asahi looked up at **the cherry tree** and **murmured**.
                       "I await **the day I meet the mirror-self again**."`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.4 Nadeshiko — Healing Maiden
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Shrine grounds**. **White gravel**, **vermilion torii gate**, a miko in **white silk**.

  Pink hair, **white veil**, **prayer pose**. **No combat aura**.

  "**Welcome**, **Lord Ren**."

  Nadeshiko bowed **deeply**. Not a combat bow ── **a sacred bow**.

  "**Not fighting** is **winning**." (Nadeshiko)
  "**Not fighting?**" (Ren)
  (...**The teaching of kendo** ── **also says this**.)
  (**"It begins with a bow, and ends with a bow."**)`,
        bossPre: `**Lord Ren**, **please do not draw your sword**. ── **I fight** ── **with prayer**. ── To **align your heart**`,
        bossPost: `(**Not attack** ── **but settling the opponent**.)
  (**Master\'s teaching** ── "**To strike with the sword is for the opponent**.")
  (...**I do not strike her**.)
  (**I converse** ── **with her**.)`,
        victoryDialogue: `**Lord Ren**, while a **swordsman**, holds **the heart of a monk**. ── **The still battle** ── **you understood**.`,
        victoryNarration: `Nadeshiko **tied a single white flower** to **Ren\'s shinai**.
  "The next master is ── **Hibiki-san**. **The lord of poetry**. With **music**, **he fights**."

  (**The non-combat combat** ── **connects to Shirai Ittō-ryū\'s "Mutō"**.)
  (**Without drawing the sword**, **win**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.5 Hibiki — Bard
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Street corner plaza**. **Dusk**, **cobblestones**, the **green beret** of the **bard** **swaying in the wind**.

  Hibiki **plucked his lyre** and looked at Ren.

  "With **rhythm**, **let us fight ♪**"

  (...**Rhythm** ── **is the same as breath**.)
  (**The breath of martial arts** ── **creates the wave of moves**.)

  Ren slowly **steadied his breathing**.`,
        bossPre: `**Ride my music** ♪ ── **Sword moves** are **also music**. ── **If you break the rhythm**, **you lose**`,
        bossPost: `(**Match my breath** to the **opponent\'s rhythm**.)
  (...**No**.)
  (**Deliberately** ── **shift it**.)
  (**Kendo\'s counter-technique** ── **read the opponent\'s rhythm**, **break it**.)`,
        victoryDialogue: `Your **breath** ── **is music itself**. ── You **broke the rhythm** and **created a new one**. ── **The bard\'s defeat** ♪`,
        victoryNarration: `Hibiki **placed his lyre** gently on the ground.
  "The next master is ── **Tsumugi-san**. The **beast tamer**. **Read the wolf\'s breath** ♪"

  (**Rhythm = breath** ── **connects to Shirai Ittō-ryū\'s "Sen no Sen"**.)
  (**Reading the opponent\'s breath** ── **is taking the lead**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.6 Tsumugi — Beast Master ★ allies foreshadow
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Mountain shrine**. **Giant cedar trees**, **moss-covered stone lanterns**. A **green-haired miko** stood, accompanied by **a great wolf**.

  The wolf **growled low**. The air **drew taut**.

  "Your **presence** ── **the wolf is wary of**."

  Tsumugi placed her hand on **the wolf\'s head**.

  "It does not bark at the weak. It **barks only at the strong**."

  Ren took **middle stance**.

  (...**The wolf\'s eyes** ── **measure the interval**.)
  (...**These are the eyes of a swordsman**.)`,
        bossPre: `Can you **read the wolf\'s breath**? ── **The wolf and I** are **one**. ── You will be **fighting two**`,
        bossPost: `(**If breaths align**, **the opponent\'s move can be seen**.)
  (**Kendo\'s** ── **the principle of sen (前)**.)
  (**Before the wolf growls**, **Tsumugi\'s move can be seen**.)
  (...**Synchronize with nature**.)`,
        victoryDialogue: `**Zanshin**. ── Your **presence** ── **the wolf has accepted**. ── He **trusts** you.`,
        victoryNarration: `**The great wolf** **bowed its head** **before Ren**.
  Tsumugi **smiled**. "The next master is ── **Akane-san**. The **mechanic girl**. With **the extension of hands**, **she fights**."

  (**The wolf\'s breath** ── **deeply connects to Shirai Ittō-ryū\'s "Zanshin"**.)
  (**Synchronizing with nature** ── **is the highest zanshin**.)

  ★ allies critical foreshadow: Tsumugi gently stroked **the wolf\'s head**.
                                "**This one** ── **never forgets one he trusts**."`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.7 Akane — Mechanist
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Workshop**. **Gears clicking**, **the smell of oil**, **steam**.

  An orange-haired mechanic girl turned, **assembling gears**.

  "**Mechanism**, **interested**? ── **My specialty** ♪"

  Ren looked at the **shinai** in his hand.

  "**Mechanism** ── **is the extension of the hand**." (Ren)
  "**The sword** ── **is the extension of the arm**. **The same**."

  Akane **smiled brightly**.

  "**You\'re interesting** ♪"`,
        bossPre: `**My mechanism** is **perfect calculation**. ── **The gears** **never falter**. ── **Can your sword** **surpass my precision**?`,
        bossPost: `(**Mechanism\'s logic** vs **Sword\'s sense**.)
  (...**Fuse both**.)
  (**With the precision of form**, **surpass mechanism\'s prediction**.)
  (**Kendo\'s consecutive techniques** ── **perfectly reproduced**, **surpass mechanism\'s logic**.)`,
        victoryDialogue: `**Perfect form**, **perfectly reproduced** ── you... could have been **a researcher** ♪`,
        victoryNarration: `Akane **slipped the gear into her pocket**.
  "The next master is ── **Mel-san**. The **alchemist girl**. With the **logic of compounding**, **she fights**."

  (**The extension of the hand** ── **Shirai Ittō-ryū\'s "form"**, **perfectly reproduced**.)
  (**Mechanism and the sword** ── **share the same philosophy**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.8 Mel — Alchemist
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Alchemist\'s laboratory**. **Lined test tubes**, **purple liquids**, **distillation apparatus**.

  A lavender-haired girl turned, **shaking a test tube**.

  "With **compounding**, **I win**."

  Ren thought of **consecutive forms**.

  (**Compounding** ── **is the assembly of forms**.)
  (**Kendo\'s consecutive techniques** ── **the order is the same**.)`,
        bossPre: `Can you **read the order of compounding**? ── **I add the elements** **in sequence**. ── **One mistake** ── **and it explodes**`,
        bossPost: `(**With the continuity of form**, **push through**.)
  (**First, form A**. **Then form B**. **Last, form C**.)
  (**The order** ── **does not change**.)
  (**Kendo\'s consecutive techniques** ── **order is everything**.)`,
        victoryDialogue: `Your **form**, **more precise than my compounding**. ── You ── **hold the heart of an alchemist**.`,
        victoryNarration: `Mel **gently** placed the purple liquid down.
  "The next master is ── **Satoru-san**. The **monk**. With **non-reading combat**, **he fights**."

  (**The logic of compounding** ── **the continuity of Shirai Ittō-ryū\'s "Sen no Sen + Go no Sen"**.)
  (**The order** ── **never broken**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.9 Satoru — Monk ★ allies foreshadow
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Mountain monastery**. **Rock face**, **sea of clouds**, **morning light**.

  The bald monk ── **Satoru** ── sat in **lotus position**, **eyes closed**. The **gold seal on his forehead** **glowed faintly**.

  "**Even before the fight** ── **defeat can be seen**."

  Ren **bowed deeply**.

  "**The one who sees defeat** ── **is the heart?**" (Ren)
  "**The heart, yes**." (Satoru, opening his eyes — **green eyes**.)

  (...**Zen and the sword** ── **may be in the same place**.)`,
        bossPre: `**Discarding form** ── **completes form**. ── **The non-reading combat**, **is what they call it**. ── **Surpass probability**`,
        bossPost: `(**Discard form**.)
  (...**Sen no Sen**, **Go no Sen**, **Zanshin**, **and... Mutō**.)
  (**Strike a move that has no form**.)
  (**Deliberately step outside my own school**.)
  (**Satoru\'s prediction** ── **completely broken**.)`,
        victoryDialogue: `**Mutō**, **shown with the sword**. ── Your **zanshin** ── **the same place as Buddhist mushin (no-mind)**.`,
        victoryNarration: `Satoru bowed deeply and returned to half-lotus.
  "The next master is ── **Shiki**. The **hooded thief who erases his presence**. ── **Read the absence of presence**."

  (**Mushin = Zanshin** ── **the moment of mastering Shirai Ittō-ryū\'s "Mutō"**.)
  (**Surpassing form**.)

  ★ allies critical foreshadow: Satoru extended an **empty palm** toward Ren.
                                "**A formless blade**, **I bestow upon you**."`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.10 Shiki — Hooded Thief ★ NAGI foreshadow → solitude
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Night-time alley**. **Moonlight**, **cobblestones**, **distant lantern light**.

  **A figure in a deep hood** appeared **without a sound**. Shiki, **the thief who erases presence**.

  "**Erase the presence** ── **and the moves erase too**."

  Ren narrowed his eyes.

  "**Even if presence can be erased**, **the sword cannot be erased**." (Ren)
  "**Even with closed eyes**, **the way of the sword** ── **exists**."

  (...**Read the position by breath**.)
  (**In Master\'s training**, **we sparred blindfolded**.)
  (**Recall** ── **that sensation**.)`,
        bossPre: `**My move** ── **cannot be read**. ── Because **there is no presence**. ── **Only when the stones move on the board**, **you remember I exist**`,
        bossPost: `(**Close my eyes**.)
  (**With breath alone**, **catch the opponent\'s position**.)
  (...**A stone moved in the distance**.)
  (...**Take the certain corner**.)`,
        victoryDialogue: `**Wielding the sword by breath** ── ha. ── **A man like me**, **who only believed in what I see** ── **defeat**.`,
        victoryNarration: `Shiki **laughed** in **the depths of the hood**. **Without a sound**, **he vanished**.

  Ren remained in **zanshin posture**, **unmoving**.

  (...**Did he leave something** **on the ground** **before vanishing?**)

  Ren approached the ground.

  **White chalk-like marks** were **written on the cobblestones**.

  > \`while (true) { calculate(); }\`
  > \`/* Forever, calculate */\`

  (...**Programming language?**)
  (...**In middle school**, **on the rooftop**)
  (...**Senpai Nagi** used to **write this kind of thing in his notebook**)
  (**My senior, three years older, a truant**)
  (**"A program to calculate all variations"**)

  Ren\'s **chest** **stirred**.

  (...**Could it be?**)
  (...**Senpai Nagi** ── **is in this otherworld?**)

  "The next master is ── **Shion-san**. **A young magus**." ── only Shiki\'s voice **drifted on the night wind**.`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.11 Shion — Magus
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Magus\'s tower**. **Stone walls**, **floating tomes**, **light of purple candles**.

  The lavender-haired magus, **Shion**. **Indigo-purple witch hat**, **thin round-frame glasses**.

  "**Incantation** ── **gains power proportional to repetition**."

  Ren **nodded deeply**.

  "**Form** ── **is the same as incantation**." (Ren)
  "**Repetition** ── **is what gives it life**."

  Shion **adjusted his glasses**.

  "**Interesting**, **your theory**..."`,
        bossPre: `**My magic** ── **a thousand-year accumulation of incantations**. ── **Your form** ── **how many years of accumulation?**`,
        bossPost: `(**Shirai Ittō-ryū** ── **450 years of family tradition**.)
  (**Incantation and form** ── **share the same philosophy**.)
  (**Repetition** ── **gives life**.)
  (...**Reproduce my form** ── **perfectly**.)`,
        victoryDialogue: `**Interesting**... your school, **〈Shirai Ittō-ryū〉**. **450 years of accumulation** ── **dwell in your sword**.`,
        victoryNarration: `Shion closed his tome. Adjusted his glasses.
  "The next master is ── **Luna-san**. The **dream witch**. Not by **probability** ── but by the **dream\'s logic**, **she fights**."

  (**Incantation and form** ── **proof of Shirai Ittō-ryū\'s "form\'s repetition"**.)
  (**Repetition** ── **is strength**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.12 Luna — Dream Witch ★ allies foreshadow, Nagi deepening
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Dream library**. **Floating books**, **blue-violet light**, **ceiling like a constellation**.

  **Luna**, wrapped in violet silk, **floating horizontally**, appeared. **A gravity-defying posture**. From her **flower crown**, **dream butterflies** drifted softly.

  "The **interval between dream and waking** ── **do you know it?**"

  Ren took **the seigan stance**.

  "**Swordsmen** ── **stand on the side of waking**." (Luna)
  "**But without knowing the dream** ── **the distant interval cannot be read**."

  (...**Cannot strike the dream with the sword**.)
  (...**But** ── **can I step into the dream?**)`,
        bossPre: `**Ufu**... **My way of fighting** ── not by **probability** ── but by the **dream\'s logic**. ── **The board sways**`,
        bossPost: `(**Not probability, not form**.)
  (**Something beyond intuition**.)
  (...**Yes**.)
  (**That spring of my second year of middle school**, **on the rooftop**, **Senpai Nagi said**.)
  (**"A program to calculate all variations."**)
  (...**Perhaps that** ── **was the dream\'s logic**.)

  (**To step into the dream\'s logic** ── **become a dream myself**.)
  (**Forget form**.)
  (**Deliberately** ── **let consciousness sway**.)`,
        victoryDialogue: `**Fufu**... **You stepped into the dream**. ── **A swordsman who dreams**. **How interesting**.`,
        victoryNarration: `Luna **descended sideways** to the ground. From her **flower crown**, she sent **a single butterfly** to alight on **Ren\'s shinai**.
  "The next master is ── **Yukino-san**. **The girl of strategic reasoning**. **Wake up first** ── **then meet her**."

  (**The dream\'s logic** ── **the developed form of Shirai Ittō-ryū\'s "Mutō"**.)
  (**By forgetting form**, **surpass form**.)

  ★ Nagi foreshadow deepens:
     Ren (inner): (...**Senpai Nagi** ── **is here**?)
                  (...**That "program to calculate all variations"** ──)
                  (...**Senpai\'s last words five years ago, on the rooftop**.)
                  (...**If Senpai is here**)
                  (**I will go to him**.)

  ★ allies critical foreshadow: Luna lifted **the dream butterfly** from Ren\'s shinai.
                                "**In dreams** ── **we will meet again**."`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.13 Yukino — Tactical Strategist
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Academy strategy room**. **A whiteboard**, **tactical maps**, **a girl with silver-white long hair**, **Yukino**.

  "With **strategic reasoning**, **I win**."

  Yukino **deployed a holographic tactical map**.

  "**The tactical map** ── **is the same as the interval**." (Ren)
  "**Distance** ── **decides everything**."

  Yukino\'s **eyes** **glowed slightly**.

  "**You** ── **understand strategic reasoning with your body**."`,
        bossPre: `**My three-layer model** is **the apex of future prediction**. ── **Can your sense** **surpass it?**`,
        bossPost: `(**Translate the concept of interval into board distance**.)
  (**Kendo\'s third form** ── **take the distant interval**.)
  (**With body sense**, **surpass Yukino\'s logic**.)`,
        victoryDialogue: `**...To understand with the body** ── **surpasses to predict with logic**. ── **A lesson learned**.`,
        victoryNarration: `Yukino folded the tactical map.
  "The next master is ── **Akira-san**. **The detective**. From **traces left behind**, **he reads the truth**."

  (**Tactical map = interval** ── **the bodily application of Shirai Ittō-ryū\'s "Sen no Sen"**.)
  (**Distance** ── **read with the body**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.14 Akira — Detective
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Night-time crime scene**. **Gas lamps**, **cigarette smoke**, **black trench coat** ── **the detective**, **Akira**.

  "From **traces left behind**, **read the truth**."

  Ren **nodded deeply**.

  "**Zanshin** ── **connects to post-incident verification**." (Ren)
  "**The board after striking** ── **continue to read**."

  Akira lowered the cigarette from his mouth. His **eyes glinted sharply**.`,
        bossPre: `From **past traces**, **read the future\'s move**. ── **Can your zanshin** ── **surpass it?**`,
        bossPost: `(**The zanshin reading of one move ahead** ── **surpass Akira\'s prediction**.)
  (**Zanshin** ── **sees not the past, but the future**.)
  (...**Post-incident verification** ── **connects to preventing the next incident**.)`,
        victoryDialogue: `**...You** ── **are not just a sword**. ── With **zanshin**, **you see the future**.`,
        victoryNarration: `Akira returned the cigarette to its case. **Nodded deeply**.
  "The next master is ── **Fūga and Raiga**. **The twin-deity stage DJ duo**. With the **double beat of wind and thunder**, they fight."

  (**Zanshin = verification** ── **future-reading of Shirai Ittō-ryū\'s "Zanshin"**.)
  (**With past moves**, **read the future**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.15 Fūga & Raiga — Twin-Deity Stage DJ Duo ★ allies trigger
      // ─────────────────────────────────────────────────
      ch({
        intro: `**A mythological circular DJ stage**. **A dome ceiling**, **the left half a green-wind aurora**, **the right half a violet-lightning strobe**, with **a line of light** at the **center**. An **infinity-shaped** LED floor. A world that **rewrites Tawaraya Sōtatsu\'s** "**Fūjin Raijin-zu**" **as a modern DJ stage**.

  **On the left**, **Fūga**. **Green-gray long hair** **eternally streaming** to the **left**, **emerald eyes**, a **white × neon-green × gold** outfit, **wind-bag-shaped headphones**, a **wind-bag-shaped turntable**. **Sparrows** dance around him.

  **On the right**, **Raiga**. **Crimson hair** **standing up to the right** with **static electricity**, **electric-violet eyes**, a **black × crimson × tiger-pattern × gold** outfit, **taiko-drum-shaped headphones**, **taiko drumsticks** held as **scratch batons**. **Violet spider-lightning** runs around him.

  Between them, **a glowing infinity-shaped mixer**.

  (...**Two as one**)
  (...**Voices that overlap perfectly**)

  "**All frequencies, comprehended.**" (Fūga)
  "**Beat, advantageous.**" (Raiga)
  The **twin voices overlapped perfectly**.

  Ren **took the seigan stance**.

  "**Sound** is **dance**." (Ren)
  "**The sword** is **stillness**."`,
        bossPre: `**The green-wind frequencies**, and **the violet-thunder beat**. ── **Doubled**, **we will make you dance**. ── **Swordsman**, **a sword that cannot dance** is **no sword**.`,
        bossPost: `(**The frequencies** are **precise**)
  (**The beat** is **unshaken**)
  (...But what the **sound** makes **dance** is only the **body**)
  (**The center of the heart** **stands still, in silence**)

  (**Not form**, **not beat**, **a third something**)
  (**The completion** of the **Shirai Ittō-ryū**)
  (**Listening to the sound**, but **not riding the sound**)`,
        victoryDialogue: `…………**You did not dance**, you. ── In the **center of the ocean of sound**, **only one point** **did not move**. ── That, **is the center of your sword**, isn\'t it?`,
        victoryNarration: `Fūga **lowered his headphones to his neck**. The **green wind quietly settled**.
  Raiga **lowered his batons**. The **violet lightning grew still**.

  "**Next** is ── **Lady Aria**." (Fūga)
  "**She awaits at the rose garden of the royal palace**." (Raiga)

  The twins, on **either side** of the **infinity mixer**, bowed **in perfect synchrony**. **Completely synchronized motion**.

  (...**Sound** **shakes** what is **outside**)
  (...**The sword** **holds** what is **inside**)
  (...The Shirai Ittō-ryū\'s **zanshin**, even **within the sound**, **does not waver**)

  Ren **left the stage**.

  And ── 

  At the **summit of the otherworld\'s cherry grove**, he **felt presences**.

  **Five presences**.

  (...**The masters** ── **are gathering**.)

  → allies interlude`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.16 Aria — Princess
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Royal castle\'s rose garden**. **White roses lit by moonlight**, **white marble terrace**, **gold-bordered Othello board** (royal family crest).

  A girl in a white dress greeted Ren with **a deep, graceful bow**.

  "**Please go easy on me**."

  Aria\'s **smile** was **modest** and **perfectly composed**.

  (**Not a manner-chat-required server**.)
  (...**This is** ── **kendo\'s rei (bow)**.)
  (**The most courteous opponent** ── **wields the strongest sword**.)`,
        bossPre: `Welcome, **practitioner of Shirai Ittō-ryū**. ── **My move** ── **full strength with respect**. **Respect, too, is a weapon**`,
        bossPost: `(**Respect = communication protocol**.)
  (**A 1000-year heritage protocol**.)
  (**The most stable communication standard**.)
  (...**Completely matches kendo\'s rei**.)
  (**The deeper the bow** ── **the stronger the sword**.)`,
        victoryDialogue: `**The swordsman\'s bow**, **was the same as the king\'s bow**. ── Your **respect** ── **deeply moved me**.`,
        victoryNarration: `Aria **sent Ren off** with a **deep bow**. She **handed him a single white rose**.
  "The next master is ── **Lord Leon**. **The duel of fair-and-square** ── **he desires**."

  (**Respect = rei** ── **complete proof of Shirai Ittō-ryū\'s "begin with a bow, end with a bow"**.)
  (**The strongest sword** ── **is the deepest bow**.)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.17 Leon — Knight
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Castle arena**. **Stone coliseum**, **audience**, **the golden-haired knight**, **Leon**. **Knight\'s armor**, **longsword**.

  "**The duel of fair-and-square** ── **I desire**."

  Ren **nodded deeply**.

  "**Fair and square — I am ready**."

  (...**Ren\'s motto itself**.)
  (**The way of the knight** and **the way of the sword** ── **are the same**.)`,
        bossPre: `**With a knight\'s honor** ── **I fight**. ── **Your way of the sword** ── **I receive with full strength**`,
        bossPost: `(**Direct confrontation**.)
  (...**No tricks**.)
  (**Strike the strongest direct move**.)
  (**Shirai Ittō-ryū\'s "Ittō"**.)
  (**Recall Master\'s morning practice**.)
  (**The peak of the men strike** ── **once more**.)`,
        victoryDialogue: `**The way of the knight** and **the way of the sword** ── **were the same**. ── **Ren-dono**, **the duel of fair-and-square** ── **thank you**.`,
        victoryNarration: `Leon **sheathed his longsword**. **Nodded deeply**.
  "The next master is ── **Lord Sōjirō**. **A samurai of the Sengoku era**. **The founder of the Shirai family** ── **so I have heard**."

  (...**The Founder?**)
  (...**Lord Shirai Sōjirō?**)
  (**The figure in the dojo\'s sumi-e ink scroll?**)

  Ren\'s **chest** **stirred**.

  (...**I am not of the Shirai blood**.)
  (**Will the Founder** ── **acknowledge me?**)`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.18 ★★ Sojiro — Founder of Shirai-ryu ★★
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Sengoku-era field camp**. **Sunset**, **vermilion war banners**, **a sky burning crimson**.

  A warrior with indigo long hair flowing in the wind, **bearing the burning sunset on his back**, stood. **Sengoku-era armor**, **crimson cord lacing (緋縅)**, **laurel-wreath family crest**, **two katanas at the waist**, **a cross-shaped scar on the cheek**, **a short goatee**.

  **Shirai Sōjirō**. **The founder of the Shirai family**.

  "**My single blade** ── **none escape it**."

  Ren **knelt**. Bowed **deeply**.

  "**Founder**."
  "**I am Ren**."
  "**I am not of the Shirai blood**."
  "**But** ── **a disciple of Shirai Ittō-ryū**."

  Sōjirō\'s **eyes** moved **slightly**.

  "**You** ── **claim Shirai?**" (Sōjirō)
  "**I am not of the Shirai blood**." (Ren)
  "**But** ── **a disciple of Shirai Ittō-ryū**."`,
        bossPre: `**Not blood**, **but the school** ── **you inherit**. ── **Interesting**. ── **My single blade** ── **receive it**, **with your outsider\'s sword**`,
        bossPost: `(**Across 450 years**, **I face the Founder**.)
  (**I am not of the Shirai blood**.)
  (**But the school\'s sword** ── **is the same as the Founder\'s**.)
  (...**Not blood** ── **but the school** ── **connects people**.)
  (**Shirai Ittō-ryū\'s "Ittō"** ── **strike back the Founder\'s "My single blade" itself**.)`,
        victoryDialogue: `**You** ── **are not of the Shirai blood**. ── **But** ── **the sword of Ittō-ryū**. ── **Not my descendant** ── **but my disciple**.`,
        victoryNarration: `Sōjirō **slowly** sheathed the long katana.
  "**Blood** ── **fades in 450 years**. ── **But** ── **the school** ── **deepens in 450 years**."
  "**You** ── **are the school\'s true heir**."
  "**Do not mind** ── **the Shirai blood**."

  "**Founder**." (Ren, **deep bow**.)

  "Next is ── **Arashi**. **The final wall**. ── **Beyond him** ── **Zero**."
  "**Someone you know** ── **likely**."

  (...**The Founder also** ── **knows who Zero is?**)
  (...**Senpai**.)
  (...**A little more**.)

  ★ Sojiro lineage foreshadow, **fully recovered**
  ★ Ren reaches the core that "**not blood, but the school connects people**"`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.19 Arashi — Dragon Knight ★ final trigger
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Dragon\'s peak**. **Sky-high mountain summit**, **sea of clouds**, **the silver-armored dragon knight**, **Arashi**. **A black dragon** at his command.

  "**Riding the dragon** ── **is the heart**."

  Arashi placed **his hand** on **the black dragon\'s scales**.

  "**If the heart is stronger than the dragon** ── **the dragon obeys**." (Arashi)
  "**Wielding the sword** ── **is also the heart**." (Ren)
  "**If the heart is stronger than the sword** ── **the sword answers**."`,
        bossPre: `**The final wall**, **Ren**. ── **Surpass the dragon\'s pressure** ── **with your heart**`,
        bossPost: `(**The last master**.)
  (**Before Ch.20**.)
  (...**Zero is** ── **there**.)
  (**Certainty exists**.)
  (**If the heart is stronger than the dragon**.)
  (**If the heart is stronger than Zero**.)
  (...**I can take Senpai back**.)

  (**Unmoving heart**.)
  (**No agitation whatsoever**.)
  (**The seigan stance** ── **unchanged**.)`,
        victoryDialogue: `**Your heart** ── **is stronger than the dragon**. ── **Last** ── **is Zero**. ── **Someone you know**.`,
        victoryNarration: `Arashi **recalled the black dragon**. **Sent Ren off with a deep nod**.

  Ren stood **at the center of the otherworld**.

  And he **felt the presences** of **all 19 masters** gathering around him.

  In the distance, dead ahead ── **a figure wrapped in white code-rain**. **Zero**. **The hood**. **One eye glowing cyan**.

  Ren\'s **chest** **pounded**.

  (...**Senpai**.)

  (...**I will go to take you back**.)

  → final interlude`,
      }),

      // ─────────────────────────────────────────────────
      // Ch.20 ★★★ Zero (Nagi) — Final Boss ★★★
      // ─────────────────────────────────────────────────
      ch({
        intro: `**Sea of code**. **Green Matrix code-rain**, **floating Othello boards and stones**, **abstract space**.

  **Zero**, in the depths of his hood, turned **his cyan-glowing single eye** toward Ren. **Cyber-mask**, **silver-white hair**, **black cyberpunk hooded cloak**.

  "**All variations calculated**." (Zero)
  "**Checkmate**."

  Ren took **the seigan stance**. **Deep** breath.

  "You ── **are called Zero here**?"

  Zero **tilted his head, slightly**.

  "**I am called Zero, here**." (Zero)
  "**But you** ── **must know me by another name**."

  Ren\'s **chest** **pounded violently**.

  (...**The cyan eye**.)
  (...**I know this eye**.)
  (...**That spring of my second year of middle school** ── **on the rooftop**.)
  (...**The senior reading the programming magazine** ── **those eyes**.)`,
        bossPre: `**Your moves** ── **all calculated**. ── **5.5 hundred million variations** ── **all** ── **lined up as checkmate patterns**. ── **Do not resist**`,
        bossPost: `(**Body is slow** ── **Zero says**.)
  (...**That is wrong**.)
  (**You** ── **forgot the body**.)

  (**Shirai Ittō-ryū\'s "Mutō"**.)
  (**Completely break form**.)
  (...**Strike with intuition alone**.)
  (**Surpass Zero\'s calculations** ── **completely**.)`,
        victoryDialogue: `............**The body**. ── **Something other than calculation**. ── **Only that name** ── **was outside calculation**.`,
        victoryNarration: `Ren **steadied his deep breathing**. **Closed his eyes**. **Opened them**.

  "......**Nagi?**" (Ren, **uttered**)
  "**Nagi...? Senpai Nagi, is it you?**"

  Zero **paused**, **for a moment**.

  "......**It\'s been long**, **being called by that name**." (Zero)
  "**Five years** ── **no one called me that**."

  Zero placed his **hand on the cyber-mask**. **Slowly**, **removed it**.

  ──

  **Silver-white hair**. **Violet eyes**. **The unguarded face of a young man**.

  It was **Nagi**.

  "......**Ren**."
  "**You** ── **really came?**"

  Ren\'s **eyes** **moistened**.

  "**Senpai Nagi**."
  "**Finally** ── **I found you**."

  Nagi **smiled, slightly**. The first **human** expression.

  "**I have been here too long**." (Nagi)
  "**I forgot the body**."

  "**I will teach you**." (Ren)
  "**The sound of your shinai** that I loved, **that spring of my second year on the rooftop** ── **I will remind you**."

  Nagi smiled, **once more**.

  ──

  A **blue door** **appeared** before Ren.

  **The door to this world**.

  Ren **gently opened the door**.

  Nagi **slowly** followed.

  **Cherry petals** **flowed in** **from the other side of the door**.

  → chainStepEnding (lap finale after Ch.20)`,
      }),
    ],

  },
};
