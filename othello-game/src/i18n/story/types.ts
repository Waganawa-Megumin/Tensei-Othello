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
  /** Optional per-scene illustration override. Path stem under
   *  `public/illustrations/` (no extension, no orientation suffix).
   *  Example: `'PLR02_mikoto/solitude'` resolves at runtime to
   *  `/illustrations/PLR02_mikoto/solitude-{landscape,portrait}.png`.
   *  When omitted, the overlay falls back to the caller's
   *  `imageBaseName` resolved against `_shared/`. The two-stage
   *  fallback in NarrativeOverlay also re-resolves to `_shared/`
   *  on 404, so authoring an override before the asset lands is
   *  safe. */
  imageBasePath?: string;
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
  /** Optional per-PLR illustration overrides for the opening cinematic.
   *  Each path is a stem under `public/illustrations/` (no extension,
   *  no orientation suffix). When omitted at any field, the
   *  consuming component falls back to its shared `_shared/` asset.
   *  Authored alongside `prologueByPlr[plrIdx]` so each PLR's
   *  summoning can be visualised distinctly. (v0.36.56) */
  imageBasePaths?: {
    /** Full prologue key art. Used by both `PrologueOverlay` (the
     *  one-shot story-launch overlay) and `PrologueScreen` (the
     *  intro flow's first step). When set, both components use this
     *  single asset; if you want PrologueScreen to use a different
     *  background, leave this unset and instead author `_shared/
     *  prologue-bg-...` per-PLR via a future `prologueBg` field. */
    prologue?: string;
    /** "Encounter" key art. Per-PLR free framing: a fall, an
     *  awakening, a face-to-face meeting, etc. Position in the step
     *  sequence is controlled by `introStepOrder` — `'legacy'` puts
     *  it at step 2 (between prologue and arrival, i.e., the
     *  "falling toward Bansho Sekai" beat), `'arrival-first'` puts
     *  it at step 5 (between gateway-open and chapter 1, i.e., the
     *  "meeting the first opponent" beat). (renamed from `falling`
     *  v0.36.64; per-PLR ordering added v0.36.72). */
    encount?: string;
    /** Arrival at Bansho Sekai — first sight of the new world. */
    arrival?: string;
    /** Sealed-gateway encounter. */
    gatewayClosed?: string;
    /** Opened-gateway threshold. */
    gatewayOpen?: string;
  };
  /** Per-PLR intro step ordering (v0.36.72).
   *  - `'legacy'` (default): prologue → encount → arrival →
   *    gatewayClosed → gatewayOpen → chapter. Encount sits at step 2
   *    as a falling/transition beat, matching PLR00 / PLR02 / PLR03
   *    whose prologue text ends WITH the fall still in progress.
   *  - `'arrival-first'`: prologue → arrival → gatewayClosed →
   *    gatewayOpen → encount → chapter. Encount becomes the last
   *    intro beat, matching PLR04 whose prologue text already shows
   *    the player landing in Bansho Sekai and whose `encount-*.png`
   *    depicts the first-opponent encounter rather than mid-air. */
  introStepOrder?: 'legacy' | 'arrival-first';
}

/** Full story bundle, one per locale. */
export interface StoryContent {
  prologue: PrologueContent;
  /** Default chapters 1..20 — shared by every chain-step PLR until
   *  per-PLR overrides ship. Length must equal 20. */
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
  /** Full-route ending text shown after Ch.20 victory.
   *  PLR01 英霊ハルキ-only true-ending finale (= "the door of light"
   *  cinematic closer). For chain-step PLRs (PLR00..PLR20) use
   *  `chainStepEnding` instead. */
  endingFull: NarrativeScene;
  /** Shared chain-step ending shown after each PLR0M (M=0,2..20)
   *  clears its own ch.1-20 lap. Plays alongside the
   *  shared "homecoming" illustration in the GameOver modal,
   *  immediately before auto-advance to the next chain step. */
  chainStepEnding: NarrativeScene;
  /* ----------------------------------------------------------------
   * Per-PLR override hooks (v0.36.54+) — the scene archive is split
   * by tab, one tab per unlocked PLR. By default every chain-step
   * PLR shares the canonical content above. To author a PLR-specific
   * variant, add an entry to the relevant `*ByPlr` map keyed on the
   * AVATARS index (0=PLR00, 1=PLR02, …, 19=PLR20, 20=PLR01).
   *
   * The resolver layer (`src/i18n/story/resolve.ts`) walks the chain
   * `byPlr[plrIdx] ?? shared` so a partial override can replace just
   * one chapter or one mid-route insert without copying the whole
   * lap. PLR-exclusive scenes that have no shared default
   * (chapter20A / trueEnding20B-D / opp22.*) live at top level above
   * because they only fire for PLR01 — leave them there.
   * --------------------------------------------------------------- */
  /** Per-PLR chapter overrides. `chapterStoriesByPlr[plrIdx][i]`
   *  replaces `chapterStories[i]` for that single PLR's lap. The
   *  array length must still equal 20 when present.
   *  Future: per-PLR ch.20 master variants (e.g., 美琴 fights ゼロ
   *  with magic-academy framing, not Haruki's hacker framing). */
  chapterStoriesByPlr?: Partial<Record<number, ReadonlyArray<ChapterStory>>>;
  /** Per-PLR mid-route narrative overrides. Only the keys provided
   *  override; the rest fall back to `narrative.{solitude,allies,final}`. */
  narrativeByPlr?: Partial<
    Record<
      number,
      Partial<{
        solitude: NarrativeScene;
        allies: NarrativeScene;
        final: NarrativeScene;
      }>
    >
  >;
  /** Per-PLR chain-step ending override. Replaces the shared
   *  `chainStepEnding` for that single PLR. */
  chainStepEndingByPlr?: Partial<Record<number, NarrativeScene>>;
  /** Per-PLR prologue + intro overrides. Default tab content for
   *  every PLR uses the world-level `prologue`. When a PLR's
   *  summoning is authored as its own opening cinematic (each PLR
   *  has a unique reason to be called to 盤上世界), drop a
   *  PrologueContent here. */
  prologueByPlr?: Partial<Record<number, PrologueContent>>;
  /** Hook teasing New Game+ (PLR02 unlock). Stored for future use,
   *  not surfaced in v0.31.0. */
  epilogueHook: string;
}
