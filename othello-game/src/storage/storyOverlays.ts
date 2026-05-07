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
 */
export type ArchiveScene =
  | { kind: 'overlay'; key: OverlayKey }
  | { kind: 'chapter'; chapter: number };

/**
 * Build the canonical chronological replay list for a slot. The order
 * mirrors the live story flow:
 *
 *   prologue → ch.1 → ch.2 … ch.10 → solitude →
 *   ch.11 … ch.15 → allies →
 *   ch.16 … ch.19 → final →
 *   ch.20 → ending → [trueEnding 20B → 20C if achieved]
 *
 * Each entry is rendered in the archive list and feeds the
 * "▶ 連続再生" sequential playback chain.
 */
export function getOrderedArchiveScenes(
  slotId: string,
  storyProgress: number,
  trueEndingAchieved: boolean,
  voidphiAwakened: boolean = false,
): ArchiveScene[] {
  const result: ArchiveScene[] = [];
  // The intro sequence runs as a single uninterruptible chain on the
  // first story-mode entry (PrologueScreen → FallingScreen →
  // ArrivalScreen → GatewayClosedScreen → GatewayOpenScreen →
  // ChapterIntroScreen). We mark only `prologue` as seen at the end
  // so all 5 intro sub-scenes share that one flag — they're either
  // all seen or all not seen.
  if (hasSeenOverlay(slotId, 'prologue')) {
    result.push({ kind: 'overlay', key: 'prologue' });
    result.push({ kind: 'overlay', key: 'intro:falling' });
    result.push({ kind: 'overlay', key: 'intro:arrival' });
    result.push({ kind: 'overlay', key: 'intro:gatewayClosed' });
    result.push({ kind: 'overlay', key: 'intro:gatewayOpen' });
  }
  for (let i = 1; i <= 20; i++) {
    if (storyProgress < i) break;
    // Mid-route interludes fire BEFORE entering the next chapter,
    // so they slot right before the chapter they precede.
    if (i === 11) result.push({ kind: 'overlay', key: 'narrative:solitude' });
    if (i === 16) result.push({ kind: 'overlay', key: 'narrative:allies' });
    if (i === 20) result.push({ kind: 'overlay', key: 'narrative:final' });
    result.push({ kind: 'chapter', chapter: i });
  }
  if (storyProgress >= 20) {
    result.push({ kind: 'overlay', key: 'ending' });
  }
  if (trueEndingAchieved) {
    // Confrontation pair precedes the battle in the live flow:
    // page 1 (confrontation art) → page 2 (transition art).
    result.push({ kind: 'overlay', key: 'narrative:chapter20A' });
    result.push({ kind: 'overlay', key: 'narrative:chapter20Atransition' });
    result.push({ kind: 'overlay', key: 'narrative:trueEnding20B' });
    result.push({ kind: 'overlay', key: 'narrative:trueEnding20C' });
  }
  // Phase 4 Step 3 — Void-φ awakening cinematic + OPP22 encounter
  // beats. 20-D auto-plays once 20-C dismisses (see App.tsx
  // gameOver effect chain), and is gated on its own flag so a
  // `trueEndingAchieved` user who hasn't yet watched 20-D won't
  // see it as already-seen in the archive. The opp22 scenes are
  // seen-flag-based because in-battle integration is a follow-up
  // patch — players first see them in Free-mode encounters once
  // that ships.
  if (voidphiAwakened) {
    result.push({ kind: 'overlay', key: 'narrative:trueEnding20D' });
  }
  if (hasSeenOverlay(slotId, 'narrative:opp22.intro')) {
    result.push({ kind: 'overlay', key: 'narrative:opp22.intro' });
  }
  if (hasSeenOverlay(slotId, 'narrative:opp22.victoryNarration')) {
    result.push({ kind: 'overlay', key: 'narrative:opp22.victoryNarration' });
  }
  return result;
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
