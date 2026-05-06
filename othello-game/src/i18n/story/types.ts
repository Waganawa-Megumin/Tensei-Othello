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
  };
  /** Full-route ending text shown after Ch.20 victory. */
  endingFull: NarrativeScene;
  /** Hook teasing New Game+ (PLR02 unlock). Stored for future use,
   *  not surfaced in v0.31.0. */
  epilogueHook: string;
}
