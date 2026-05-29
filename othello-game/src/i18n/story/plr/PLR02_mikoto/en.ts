/**
 * PLR02 美琴 (Mikoto, the logic mage of St. Bibliotheca Academy) —
 * English story package.
 *
 * Co-located with `public/illustrations/PLR02_mikoto/`, `./ja.ts`,
 * `./index.ts`.
 *
 * Source content originally lived at the following line ranges of
 * `src/i18n/story/en.ts` before the v0.36.78 per-PLR folder refactor:
 *   - prologue       : en.ts:1464-1515 (prologueByPlr[1])
 *   - chapters 1..20 : en.ts:1913-2358 (chapterStoriesByPlr[1])
 *   - narrative      : en.ts:903-937   (narrativeByPlr[1])
 *   - chainStepEnding: en.ts:1263-1272 (chainStepEndingByPlr[1])
 */
import type { PlrPackage } from '../../types';
import { ch } from '../../utils';

export const PLR02_MIKOTO_EN: PlrPackage = {
  plrIdx: 1,
  assetFolder: 'PLR02_mikoto',
  prologue: {
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
      // Mikoto's illustrations run "restricted archive (arrival) → sigil
      // gate (gateway-closed) → seal breaks, board world revealed
      // (gateway-open) → dive through the silver-equation void (encount),"
      // and her prologue follows that order. So she uses the same
      // arrival-first flow as PLR03/04 (the old legacy default would
      // play encount→arrival in reverse). Only `fallingVoice` (final
      // encount step) skips markdown `**`, since FallingScreen
      // interpolates it as plain text.
      introStepOrder: 'arrival-first',
      introTexts: {
        arrivalText: `Seitoshoin Academy. The restricted-archive section, late at night.
  The instant her finger traced a symbol, **the gold sigil on the open page** pulsed **blue**.
  The shelves dissolved into **stained-glass light**; her uniform **rewrote itself** into a gold-trimmed coat.

  (Wait ── is this a **summoning**?)

  Only the grimoire in her arms stayed **heavy**, unchanged.
  (Then it's real. ── I'll treat it as an object of observation.)`,
        gatewayClosedText: `When she came to, a colossal **stained-glass gate** stood before her. An 8×8 grid, **densely** carved with undeciphered symbols. The gate was closed.

  "**Prove it**," ── a voice, from somewhere.

  (An examination. ── I don't mind.)

  Mikoto opened her grimoire.`,
        gatewayOpenText: `She traced the symbols. The questions ran deep, the solutions branched without count ── but **one consistent path** emerged.

  As she set her finger down, the gate's lattice **dissolved into gold**, and it opened.
  Through it, shimmering ── the **green board world**. White and black stones upon the board.

  (Proof complete. ── On to the next theorem.)`,
        fallingVoice: `A fall, too, is just a theorem. ── So I'll solve it, and move the world.`,
      },
  },
  chapters: [
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
  narrative: {
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
  chainStepEnding: {
      title: "Mikoto's Chapter — 《Logic-Magic》, Theorematized",
      text: `Returned from the board world to her cathedral library, Mikoto wrote on the final page:

*"**Every move in this world departs from a single axiom.**"*

The name *《Logic-Magic》* would survive into later ages.
And the next summoning circle — began to tremble softly with the light of welcoming a different hero.`,
      imageBasePath: 'PLR02_mikoto/ending',
  },
};
