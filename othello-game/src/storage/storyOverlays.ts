/**
 * Per-save-slot "have I seen this story overlay yet?" tracking.
 *
 * Keys are scoped to the active slot id so that switching to a fresh
 * slot replays the prologue / narrative inserts. The slot id can also
 * be the literal string `'free'` for matches outside any save slot
 * (which currently means we never auto-show story overlays — those
 * surfaces only fire in story mode anyway).
 *
 * All reads/writes silently swallow localStorage errors so that
 * private-mode browsing never breaks the story flow.
 */
export type OverlayKey =
  | 'prologue'
  | 'intro:falling'
  | 'intro:arrival'
  | 'intro:gatewayClosed'
  | 'intro:gatewayOpen'
  | 'narrative:solitude'
  | 'narrative:allies'
  | 'narrative:final'
  | 'narrative:trueEnding20B'
  | 'narrative:trueEnding20C'
  | 'narrative:trueEnding20D'
  | 'narrative:chapter20A'
  | 'narrative:chapter20Atransition'
  | 'narrative:opp22.intro'
  | 'narrative:opp22.victoryNarration'
  | 'ending';

const STORAGE_PREFIX = 'othello:overlay_seen:';

function keyFor(slotId: string, overlay: OverlayKey): string {
  return `${STORAGE_PREFIX}${slotId}:${overlay}`;
}

export function hasSeenOverlay(slotId: string, overlay: OverlayKey): boolean {
  try {
    return window.localStorage.getItem(keyFor(slotId, overlay)) === '1';
  } catch {
    return false;
  }
}

export function markOverlaySeen(slotId: string, overlay: OverlayKey): void {
  try {
    window.localStorage.setItem(keyFor(slotId, overlay), '1');
  } catch {
    /* localStorage unavailable; overlay will re-trigger next session */
  }
}

/**
 * Enumerate the overlays that should be replayable from the title-
 * screen scene archive, given the slot's current progress.
 *
 * History: this used to be a strictly seen-flag-based filter
 * (`getSeenOverlays`). That broke for any path where the player
 * advanced without dismissing the canonical trigger — closing the
 * GameOver modal with × instead of "next chapter" then re-entering
 * ch.11 from the chapter-browser cursor → solitude never fires →
 * never marked seen → never lands in the archive even though the
 * player is on ch.12+. It also missed `'ending'` entirely, since
 * the endingFull text renders inline in the GameOver modal rather
 * than as a NarrativeOverlay → no dismiss → no markOverlaySeen.
 *
 * The archive's purpose is "let me re-read scenes I've encountered
 * narratively"; storyProgress is a more reliable proxy for that
 * than the seen-flag plumbing. Each mid-route insert fires AT a
 * specific milestone (10/15/19), so progress >= milestone proves
 * the player has cleared past the trigger point. Prologue stays
 * seen-flag-based because it can fire at progress=0, and the
 * true-ending pair uses its explicit achievement flag.
 *
 * Returned in canonical story order (prologue → narrative inserts →
 * ending) regardless of localStorage iteration order.
 */
export const OVERLAY_ORDER: readonly OverlayKey[] = [
  'prologue',
  'intro:falling',
  'intro:arrival',
  'intro:gatewayClosed',
  'intro:gatewayOpen',
  'narrative:solitude',
  'narrative:allies',
  'narrative:final',
  'narrative:chapter20A',
  'narrative:chapter20Atransition',
  'narrative:trueEnding20B',
  'narrative:trueEnding20C',
  'narrative:trueEnding20D',
  'narrative:opp22.intro',
  'narrative:opp22.victoryNarration',
  'ending',
];

export function getArchiveScenes(
  slotId: string,
  storyProgress: number,
  trueEndingAchieved: boolean,
  hasClearedFullRoute: boolean = false,
): OverlayKey[] {
  // Design A (v0.36.40+): each chain-step PLR runs its own
  // ch.1-20 lap, and `storyProgress` is reset to 0 after a ch.20
  // win so the next PLR's lap starts fresh. That means a player
  // who has just cleared ch.20 with PLR00 (and is now sitting on
  // PLR02's lap-序章) sees `storyProgress === 0` even though they
  // actually witnessed every mid-route + ending scene. To keep the
  // archive populated, treat any slot that has cleared the full
  // route at least once (avatarsClearedCh20.length > 0) as if its
  // progress had reached 20 for archive purposes.
  const effectiveProgress = hasClearedFullRoute
    ? Math.max(storyProgress, 20)
    : storyProgress;
  const available = new Set<OverlayKey>();
  // Prologue: seen-based, since it can fire at progress=0 and a
  // numeric threshold can't represent that.
  if (hasSeenOverlay(slotId, 'prologue')) available.add('prologue');
  // Mid-route narrative inserts. Each fires exactly when its
  // milestone chapter is cleared, so storyProgress >= milestone
  // means the player has had the canonical encounter.
  if (effectiveProgress >= 10) available.add('narrative:solitude');
  if (effectiveProgress >= 15) available.add('narrative:allies');
  if (effectiveProgress >= 19) available.add('narrative:final');
  // Endgame finale: the endingFull text renders in the GameOver
  // modal at storyProgress=20, so progress alone unlocks it.
  if (effectiveProgress >= 20) available.add('ending');
  // True-ending pair is PLR01-only, gated by the explicit
  // achievement flag rather than progress. The 20-A confrontation
  // scene precedes the battle, so seeing the true ending implies
  // the player saw 20-A as well — surface them as a set.
  if (trueEndingAchieved) {
    available.add('narrative:chapter20A');
    available.add('narrative:chapter20Atransition');
    available.add('narrative:trueEnding20B');
    available.add('narrative:trueEnding20C');
  }
  return OVERLAY_ORDER.filter((k) => available.has(k));
}

/**
 * Discriminated union for archive scenes. Includes per-chapter
 * narrative scenes (intro / dialogue / victory beats) alongside the
 * full-screen overlays. Used by the title-screen "scene archive"
 * UI so the player can replay every story beat they've passed,
 * not just the full-screen interludes.
 *
 * `plrIdx` (v0.36.54+) — AVATARS index identifying which PLR's lap
 * this scene belongs to. The render layer resolves overlay /
 * chapter content through the per-PLR resolver
 * (`src/i18n/story/resolve.ts`) so PLR-specific overrides plug in
 * via the `*ByPlr` maps on `StoryContent`. 0=PLR00 (default),
 * 1..19=PLR02..PLR20 (chain-step bonuses), 20=PLR01 (true-ending
 * hero, owns the chapter20A / trueEnding20B-D / opp22 scenes).
 */
export type ArchiveScene =
  | { kind: 'overlay'; key: OverlayKey; plrIdx: number }
  | { kind: 'chapter'; chapter: number; plrIdx: number };

/** Tab descriptor for the per-PLR scene archive. `played` is false
 *  for unlocked-but-not-yet-played PLRs so the UI can render the
 *  tab grayed out (the user explicitly asked for "解放済の全 PLR
 *  (グレーアウト含む)" coverage in v0.36.54). */
export interface ArchiveTab {
  /** AVATARS index. */
  plrIdx: number;
  /** True if the player has any progress for this PLR — full lap
   *  cleared or mid-lap with storyProgress > 0. */
  played: boolean;
  /** True if this PLR's full lap (or PLR01's true ending) is
   *  cleared. Used to decide whether to surface the ending entry
   *  even when the slot has rolled forward to the next PLR. */
  fullyCleared: boolean;
}

/** Compute the tab list for the per-PLR scene archive.
 *
 *  Tabs surface every "unlocked" PLR — the same set the AVATARS
 *  picker treats as selectable (i ≤ unlockedCount). Cleared chain
 *  steps live in `avatarsClearedCh20`; the chain frontier is the
 *  next idx after that (= avatarsClearedCh20.length); PLR01 (idx
 *  20) appears only after every chain step is cleared.
 *
 *  `played` differentiates "this PLR has actual scenes to show"
 *  from "tab visible but empty" — drives the grayed-out styling. */
export function getArchiveTabs(input: {
  unlockedCount: number;
  avatarsClearedCh20: ReadonlyArray<number>;
  storyProgress: number;
  trueEndingAchieved: boolean;
}): ArchiveTab[] {
  const { unlockedCount, avatarsClearedCh20, storyProgress, trueEndingAchieved } =
    input;
  const cleared = new Set(avatarsClearedCh20);
  const acclen = avatarsClearedCh20.length;
  const tabs: ArchiveTab[] = [];

  // Cleared chain-step PLRs (idx 0..19), in chronological order.
  // The user's chain order is whatever order they cleared them in,
  // but `avatarsClearedCh20` is kept sorted by `recordSlotResult`,
  // so iterating the sorted set yields a stable ascending list.
  const sortedCleared = [...avatarsClearedCh20].sort((a, b) => a - b);
  for (const idx of sortedCleared) {
    if (idx >= 0 && idx <= 19) {
      tabs.push({ plrIdx: idx, played: true, fullyCleared: true });
    }
  }

  // Chain frontier (= next chain step to play). Visible as long as
  // it falls within the unlocked range. Played only if storyProgress
  // > 0 (= player has actually started a match in this lap).
  if (acclen < 20 && acclen <= unlockedCount) {
    const frontier = acclen;
    if (!cleared.has(frontier)) {
      tabs.push({
        plrIdx: frontier,
        played: storyProgress > 0,
        fullyCleared: false,
      });
    }
  }

  // PLR01 (idx 20) — only visible once the chain is complete (all
  // 19 chain steps cleared, i.e., unlockedCount >= 20).
  if (unlockedCount >= 20) {
    tabs.push({
      plrIdx: 20,
      played: trueEndingAchieved || storyProgress > 0,
      fullyCleared: trueEndingAchieved,
    });
  }

  return tabs;
}

/** Build the per-PLR replay list. The order mirrors the live story
 *  flow for that single PLR's lap:
 *
 *    prologue → ch.1 → ch.2 … ch.10 → solitude →
 *    ch.11 … ch.15 → allies →
 *    ch.16 … ch.19 → final →
 *    [chapter20A → transition for PLR01 only] →
 *    ch.20 → ending →
 *    [trueEnding 20B/C/D + opp22.* for PLR01 only]
 *
 *  Used by both the title-screen archive (per-tab list) and the
 *  sequential "▶ 連続再生" playback chain. The `plrIdx` field
 *  embedded on every returned scene tells the render layer which
 *  PLR's content to resolve (see `src/i18n/story/resolve.ts`). */
export function getOrderedArchiveScenesForPlr(input: {
  slotId: string;
  plrIdx: number;
  /** This PLR's effective lap progress (0..20). For a cleared
   *  chain-step PLR pass 20; for the chain frontier pass the slot's
   *  current `storyProgress`; for unplayed PLRs pass 0. */
  effectiveProgress: number;
  trueEndingAchieved: boolean;
  voidphiAwakened: boolean;
}): ArchiveScene[] {
  const { slotId, plrIdx, effectiveProgress, trueEndingAchieved, voidphiAwakened } =
    input;
  const isPlr01 = plrIdx === 20;
  const result: ArchiveScene[] = [];

  // Intro chain — the world-opening cinematic. Currently shared
  // across every PLR's tab; per-PLR override is plumbed via
  // `prologueByPlr` on StoryContent so a future "美琴 sees a
  // different summoning portal" variant slots in without touching
  // this list.
  if (hasSeenOverlay(slotId, 'prologue')) {
    result.push({ kind: 'overlay', key: 'prologue', plrIdx });
    result.push({ kind: 'overlay', key: 'intro:falling', plrIdx });
    result.push({ kind: 'overlay', key: 'intro:arrival', plrIdx });
    result.push({ kind: 'overlay', key: 'intro:gatewayClosed', plrIdx });
    result.push({ kind: 'overlay', key: 'intro:gatewayOpen', plrIdx });
  }

  // Chapters with mid-route inserts slotted before the relevant
  // chapter. PLR01 additionally gets the chapter20A/transition
  // confrontation pair before its ch.20 battle.
  for (let i = 1; i <= 20; i++) {
    if (effectiveProgress < i) break;
    if (i === 11) result.push({ kind: 'overlay', key: 'narrative:solitude', plrIdx });
    if (i === 16) result.push({ kind: 'overlay', key: 'narrative:allies', plrIdx });
    if (i === 20) result.push({ kind: 'overlay', key: 'narrative:final', plrIdx });
    if (i === 20 && isPlr01 && trueEndingAchieved) {
      result.push({ kind: 'overlay', key: 'narrative:chapter20A', plrIdx });
      result.push({ kind: 'overlay', key: 'narrative:chapter20Atransition', plrIdx });
    }
    result.push({ kind: 'chapter', chapter: i, plrIdx });
  }

  // Lap finale — chainStepEnding for PLR00..PLR20, endingFull for
  // PLR01. Resolver layer picks the right scene by plrIdx.
  if (effectiveProgress >= 20) {
    result.push({ kind: 'overlay', key: 'ending', plrIdx });
  }

  // PLR01-only true-ending continuation. opp22.* are seen-flag
  // gated because their in-battle entry-point is free-mode-only and
  // not all PLR01 finishers will have triggered them yet.
  if (isPlr01 && trueEndingAchieved) {
    result.push({ kind: 'overlay', key: 'narrative:trueEnding20B', plrIdx });
    result.push({ kind: 'overlay', key: 'narrative:trueEnding20C', plrIdx });
    if (voidphiAwakened) {
      result.push({ kind: 'overlay', key: 'narrative:trueEnding20D', plrIdx });
    }
    if (hasSeenOverlay(slotId, 'narrative:opp22.intro')) {
      result.push({ kind: 'overlay', key: 'narrative:opp22.intro', plrIdx });
    }
    if (hasSeenOverlay(slotId, 'narrative:opp22.victoryNarration')) {
      result.push({ kind: 'overlay', key: 'narrative:opp22.victoryNarration', plrIdx });
    }
  }

  return result;
}

/** Legacy whole-slot archive list. Pre-v0.36.54 the archive was a
 *  single flat list across the slot's entire story progress; v0.36.54
 *  splits it into per-PLR tabs. This shim concatenates every tab's
 *  scenes so any caller still using the flat list keeps working
 *  until they migrate. New callers should use
 *  `getOrderedArchiveScenesForPlr` directly. */
export function getOrderedArchiveScenes(
  slotId: string,
  storyProgress: number,
  trueEndingAchieved: boolean,
  voidphiAwakened: boolean = false,
  hasClearedFullRoute: boolean = false,
): ArchiveScene[] {
  const effectiveProgress = hasClearedFullRoute
    ? Math.max(storyProgress, 20)
    : storyProgress;
  // Single synthetic PLR00 view to preserve the old behavior.
  return getOrderedArchiveScenesForPlr({
    slotId,
    plrIdx: 0,
    effectiveProgress,
    trueEndingAchieved,
    voidphiAwakened,
  });
}

/**
 * Drop all overlay-seen flags for a slot. Used when the user resets
 * a save slot or starts a brand-new one, so the prologue + narrative
 * beats fire fresh on the next playthrough.
 */
export function resetOverlaysSeen(slotId: string): void {
  try {
    const prefix = `${STORAGE_PREFIX}${slotId}:`;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    for (const k of keys) window.localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
}
