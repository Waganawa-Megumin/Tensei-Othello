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
  | 'narrative:solitude'
  | 'narrative:allies'
  | 'narrative:final'
  | 'narrative:trueEnding20B'
  | 'narrative:trueEnding20C'
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
const OVERLAY_ORDER: readonly OverlayKey[] = [
  'prologue',
  'narrative:solitude',
  'narrative:allies',
  'narrative:final',
  'narrative:trueEnding20B',
  'narrative:trueEnding20C',
  'ending',
];

export function getArchiveScenes(
  slotId: string,
  storyProgress: number,
  trueEndingAchieved: boolean,
): OverlayKey[] {
  const available = new Set<OverlayKey>();
  // Prologue: seen-based, since it can fire at progress=0 and a
  // numeric threshold can't represent that.
  if (hasSeenOverlay(slotId, 'prologue')) available.add('prologue');
  // Mid-route narrative inserts. Each fires exactly when its
  // milestone chapter is cleared, so storyProgress >= milestone
  // means the player has had the canonical encounter.
  if (storyProgress >= 10) available.add('narrative:solitude');
  if (storyProgress >= 15) available.add('narrative:allies');
  if (storyProgress >= 19) available.add('narrative:final');
  // Endgame finale: the endingFull text renders in the GameOver
  // modal at storyProgress=20, so progress alone unlocks it.
  if (storyProgress >= 20) available.add('ending');
  // True-ending pair is PLR01-only, gated by the explicit
  // achievement flag rather than progress.
  if (trueEndingAchieved) {
    available.add('narrative:trueEnding20B');
    available.add('narrative:trueEnding20C');
  }
  return OVERLAY_ORDER.filter((k) => available.has(k));
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
