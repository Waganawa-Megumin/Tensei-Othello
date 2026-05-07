/**
 * Story content shape for the PLR00 default route.
 *
 * Source: `othello-game/docs/scenario/01_PLR00_main_story_part{1..4}.md`
 * (Pack 1 from the user, ja/en pairs).
 *
 * Strings may contain markdown-style **bold** emphasis (literal
 * double-asterisks). Render with the small helper in
 * `src/i18n/story/render.tsx` so the asterisks become real <strong>
 * spans. Plain-text consumers can also strip the markers themselves
 * if formatting isn't available in their context.
 */

/** Single chapter's 4-block story content. */
export interface ChapterStory {
  /** Chapter intro narration (the scene-setter the player reads on the
   *  chapter card before the match). */
  intro: string;
  /** Master's pre-match line (shown as direct dialogue 「」). */
  bossPre: string;
  /** Protagonist's inner thought immediately after the match starts /
   *  finishes — typically a quick-witted reaction shown in (). */
  bossPost: string;
  /** Master's victory-time dialogue (after the player wins). */
  victoryDialogue: string;
  /** Brief narration that closes the chapter and bridges to the next
   *  master. Often previews the next opponent. */
  victoryNarration: string;
}

/** A single full-screen narrative scene (overlay). */
export interface NarrativeScene {
  title: string;
  text: string;
}

/** Title screen + opening narration. */
export interface PrologueContent {
  /** Tagline shown big on the title screen. */
  tagline: string;
  /** Subtitle ribbon under the title. */
  subtitle: string;
  /** Label on the story-mode start button. */
  startButton: string;
  /** Prologue narration (full-screen overlay on first story launch). */
  text: string;
  /** Heading shown above the prologue text. */
  title: string;
}

/** Full story bundle, one per locale. */
export interface StoryContent {
  prologue: PrologueContent;
  /** Chapters 1..20. Length must equal 20. */
  chapterStories: ReadonlyArray<ChapterStory>;
  /** Mid-route narrative inserts (full-screen overlays). */
  narrative: {
    /** After Ch.10 — solitary game-record review at an inn. */
    solitude: NarrativeScene;
    /** After Ch.15 — defeated masters watch over Haruki's match. */
    allies: NarrativeScene;
    /** Before Ch.20 — masters' souls join Haruki for the final stand. */
    final: NarrativeScene;
    /** Phase 3 — true-ending cinematic, scene B (the moment of
     *  release: Zero accepts the world is open, the code rain
     *  dissolves into orange light). Plays only when PLR01 英霊
     *  ハルキ has just cleared chapter 20. */
    trueEnding20B: NarrativeScene;
    /** Phase 3 — true-ending cinematic, scene C (epilogue:
     *  Zero standing in modern Tokyo at dusk, looking back).
     *  Always follows trueEnding20B, terminates on the OPP21 +
     *  OPP22 unlock notification. */
    trueEnding20C: NarrativeScene;
    /** Phase 4 Step 3 — Void-φ awakening cinematic. Plays
     *  automatically right after `trueEnding20C` finishes, the
     *  first time the true ending is achieved. Marks
     *  `voidphi_awakened` localStorage flag so the OPP22 selection
     *  gate flips from `trueEndingAchieved` to `voidphiAwakened`. */
    trueEnding20D: NarrativeScene;
    /** Phase 4 Step 4 —章 20-A 対峙シーン (page 1 of 2): full-screen
     *  overlay shown right BEFORE the PLR01 英霊ハルキ vs ゼロ
     *  chapter-20 match starts. Page 1 sits on the confrontation
     *  illustration (両者がコードの海で対峙) and covers the intro
     *  narrative + Zero's "I, too, was once like you" confession.
     *  On dismiss the chapter20Atransition overlay chains in.
     *  PLR00 routes don't see either page — they get the regular
     *  ch.20 intro card and the canonical bossPre. */
    chapter20A: NarrativeScene;
    /** Phase 4 Step 4 —章 20-A 対峙シーン (page 2 of 2): chains
     *  from chapter20A. Sits on the transition illustration
     *  (闇粒子が剥がれ、フードが半分崩れ、銀髪が現れる) which syncs
     *  with the dialogue beat where ハルキの「君は人間なんだろ?」
     *  cracks Zero's facade. On dismiss the battle starts. */
    chapter20Atransition: NarrativeScene;
  };
  /** Phase 4 Step 3 — narrative content for the OPP22 ヴォイドφ
   *  encounter (free-mode only, after voidphiAwakened). Surfaced in
   *  the scene archive so players can re-read the lore. In-battle
   *  free-mode integration of intro / bossPre / bossPost is left for
   *  a follow-up patch. */
  opp22: {
    /** First-encounter intro shown before OPP22's first free-mode
     *  fight. */
    intro: NarrativeScene;
    /** Three pre-match dialogue lines spoken by Void-φ. */
    bossPre: ReadonlyArray<string>;
    /** Post-battle commentary, branched by player victory/defeat. */
    bossPost: {
      victory: NarrativeScene;
      defeat: NarrativeScene;
    };
    /** Closing narration after the player defeats OPP22 — true
     *  finale of the route. Echoes PLR01's quote in the player's
     *  own voice. */
    victoryNarration: NarrativeScene;
  };
  /** Full-route ending text shown after Ch.20 victory. */
  endingFull: NarrativeScene;
  /** Hook teasing New Game+ (PLR02 unlock). Stored for future use,
   *  not surfaced in v0.31.0. */
  epilogueHook: string;
}
