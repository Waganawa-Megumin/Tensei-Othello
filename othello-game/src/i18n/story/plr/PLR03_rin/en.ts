/**
 * PLR03 Rin (LOST FRONTIER's #1 VR data-tactician) — English story
 * package.
 *
 * Co-located with `public/illustrations/PLR03_rin/`, `./ja.ts`,
 * `./index.ts`.
 *
 * Source content originally lived at the following line ranges of
 * `src/i18n/story/en.ts` before the v0.36.78 per-PLR folder refactor:
 *   - prologue       : en.ts:1516-1602 (prologueByPlr[2])
 *   - chapters 1..20 : en.ts:2359-3009 (chapterStoriesByPlr[2])
 *   - narrative      : en.ts:938-1041  (narrativeByPlr[2])
 *   - chainStepEnding: en.ts:1273-1335 (chainStepEndingByPlr[2])
 */
import type { PlrPackage } from '../../types';
import { ch } from '../../utils';

export const PLR03_RIN_EN: PlrPackage = {
  plrIdx: 2,
  assetFolder: 'PLR03_rin',
  prologue: {
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
      // Rin's intro chain visually matches PLR04 Ren — encount art
      // depicts the first-opponent meeting, so flow is prologue →
      // arrival → gatewayClosed → gatewayOpen → encount → chapter.
      // (v0.36.77)
      introStepOrder: 'arrival-first',
  },
  chapters: [
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
  narrative: {
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
  chainStepEnding: {
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
};
