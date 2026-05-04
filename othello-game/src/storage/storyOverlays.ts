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
 * Enumerate the overlays the slot has ever seen. Used by the title-
 * screen archive UI to show only the scenes the player has unlocked,
 * preserving "go back and re-read past beats" without spoiling future
 * ones.
 *
 * Returned in canonical story order (prologue → narrative inserts →
 * ending) regardless of localStorage iteration order.
 */
const OVERLAY_ORDER: readonly OverlayKey[] = [
  'prologue',
  'narrative:solitude',
  'narrative:allies',
  'narrative:final',
  'ending',
];

export function getSeenOverlays(slotId: string): OverlayKey[] {
  return OVERLAY_ORDER.filter((key) => hasSeenOverlay(slotId, key));
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
