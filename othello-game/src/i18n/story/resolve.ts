/**
 * Per-PLR scene resolvers for the scene archive.
 *
 * The archive is tab-controlled — one tab per unlocked PLR — and
 * every tab walks the same lap shape (intro → ch.1-20 → mid-route
 * inserts → ending). Content currently shared by every chain-step
 * PLR can be overridden per-PLR by populating the optional `*ByPlr`
 * maps on `StoryContent`. These resolvers wrap the lookup so the
 * call site doesn't have to know whether the override is authored
 * yet — it just asks for "this PLR's chapter 7" and the resolver
 * returns the override or falls back to shared content.
 *
 * Keying convention: AVATARS index. 0=PLR00 (default), 1..19 =
 * PLR02..PLR20 (chain-step bonus avatars), 20=PLR01 英霊ハルキ
 * (true-ending hero). PLR01 only owns scenes that have no shared
 * default — true-ending cinematic + opp22 — and those live at top
 * level on `StoryContent.narrative` / `StoryContent.opp22`, not
 * here.
 */
import type {
  ChapterStory,
  NarrativeScene,
  PrologueContent,
  StoryContent,
} from './types';

/** Mid-route insert keys eligible for per-PLR override. */
export type MidRouteKey = 'solitude' | 'allies' | 'final';

/** Resolve a chapter story for a specific PLR's lap. Falls back to
 *  the shared default when no per-PLR override is authored. */
export function resolveChapterStory(
  content: StoryContent,
  plrIdx: number,
  chapter: number,
): ChapterStory | null {
  const override = content.chapterStoriesByPlr?.[plrIdx]?.[chapter - 1];
  if (override) return override;
  return content.chapterStories[chapter - 1] ?? null;
}

/** Resolve a mid-route narrative scene (solitude / allies / final)
 *  for a specific PLR's lap. */
export function resolveMidRouteScene(
  content: StoryContent,
  plrIdx: number,
  key: MidRouteKey,
): NarrativeScene {
  const override = content.narrativeByPlr?.[plrIdx]?.[key];
  if (override) return override;
  return content.narrative[key];
}

/** Resolve the lap-finale narrative scene for a specific PLR.
 *  Chain-step PLRs (idx 0..19) get the shared "homecoming"
 *  `chainStepEnding` (or its per-PLR override). PLR01 (idx 20) gets
 *  the canonical `endingFull` "door-of-light" finale — the
 *  true-ending route is hardcoded for that lone slot. */
export function resolveEndingScene(
  content: StoryContent,
  plrIdx: number,
): NarrativeScene {
  if (plrIdx === 20) return content.endingFull;
  const override = content.chainStepEndingByPlr?.[plrIdx];
  if (override) return override;
  return content.chainStepEnding;
}

/** Resolve the prologue/intro content for a specific PLR. Defaults
 *  to the world-level prologue (= the canonical "你 are summoned to
 *  Bansho Sekai" opening). When a per-PLR override is authored the
 *  archive's first-tab entries (prologue + falling/arrival/gateway)
 *  re-bind to that variant. */
export function resolvePrologueContent(
  content: StoryContent,
  plrIdx: number,
): PrologueContent {
  return content.prologueByPlr?.[plrIdx] ?? content.prologue;
}
