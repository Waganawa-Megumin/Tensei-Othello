/**
 * Save-slot storage. The game has up to 10 named slots; each is a
 * resumable Story-mode save point with its own progress, lives and
 * cumulative stats. Free mode and Two-player mode do NOT use slots —
 * Free mode results go into the global FreeStats bucket below.
 *
 * All operations are async to mirror the future Capacitor Preferences
 * adapter (Phase 3 swap, no call-site changes).
 */

const SLOTS_KEY = 'othello:save_slots';
const ACTIVE_SLOT_KEY = 'othello:active_slot';
const FREE_STATS_KEY = 'othello:free_stats';
const LEGACY_STORY_PROGRESS_KEY = 'othello:story_progress';
const CHARACTER_UNLOCKS_KEY = 'othello:character_unlocks';
/**
 * Sticky flag set the first time the player clears chapter 20 while
 * running PLR01 英霊ハルキ. Drives the bonus Lv.21 OPP21 unlock —
 * until this flips to `true`, free-mode pickers render the OPP21 row
 * with a `???` placeholder. Once true it stays true.
 */
const TRUE_ENDING_KEY = 'othello:true_ending_achieved';
const VOIDPHI_AWAKENED_KEY = 'othello:voidphi_awakened';
const VOIDPHI_INTRO_SEEN_KEY = 'othello:voidphi_intro_seen';

export const MAX_SLOTS = 10;
export const INITIAL_LIVES = 5;
/**
 * Hard ceiling on `slot.lives`. Wins past this point don't accumulate —
 * a single-digit cap keeps the UI clean (♥ N), keeps the lives mechanic
 * tense (a streak of free-mode wins on a hard story chapter shouldn't
 * grant infinite retries), and acts as a clamp for legacy saves that
 * accumulated unbounded lives before this cap existed.
 */
export const MAX_LIVES = 9;
export const TOTAL_BONUS_AVATARS = 20;
export const SCHEMA_VERSION = 1 as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface OpponentRecord {
  wins: number;
  losses: number;
  draws: number;
}

export interface SaveSlot {
  /** 1..MAX_SLOTS, fixed for the lifetime of the slot. */
  id: number;
  /** User-visible name. Defaults to "Save N" / "セーブ N". */
  name: string;
  /** AVATARS index (0-19). */
  avatarIdx: number;
  createdAt: number;
  lastPlayedAt: number;
  /** 0..20, number of chapters cleared. */
  storyProgress: number;
  /** Remaining lives. Starts at INITIAL_LIVES, floor 0. */
  lives: number;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  resigns: number;
  /** Per-opponent record, keyed by opponent level (1-20). */
  vsOpponent: Record<number, OpponentRecord>;
  /** Phase 4 v0.36.10 — set true when PLR01 英霊ハルキ has just won
   *  ch.20 in this slot and the post-victory cinematic chain
   *  (trueEnding20B → 20C → 20D → opp22.intro → OPP22 battle) has
   *  not yet been completed. On slot re-entry from the title screen
   *  we use this to skip the regular IntroSequence and resume the
   *  cinematic from 20-B. Cleared after the OPP22 battle ends
   *  (win or lose) so a future PLR01 ch.20 win re-arms it. */
  voidphiEncounterPending?: boolean;
  /** v0.36.12 — per-slot flags. Pre-v0.36.12 these lived in
   *  global localStorage keys (`othello:character_unlocks` etc.),
   *  which leaked progress across slots ("表面上初期の状態でも
   *  カンストしている"). Made per-slot so each save's roster /
   *  story-arc gates are independent. The boot effect performs a
   *  one-time migration that seeds the previously-active slot from
   *  the legacy globals so existing users don't lose progress. */
  /** Number of bonus avatars unlocked on this slot (0..20).
   *  unlockedCount === 20 means PLR01 英霊ハルキ is also selectable.
   *  v0.36.26 onward this is a derived view of `avatarsClearedCh20.length`,
   *  but kept as a persisted scalar for backward compatibility (older
   *  builds reading the slot still see the right number) and to keep
   *  the AVATARS picker's `isLocked = i > unlockedCount` gate trivial. */
  unlockedCount?: number;
  /** v0.36.26 — AVATARS indices (0..19) that have cleared chapter 20
   *  on this slot at least once. The "ideal-form" unlock chain in
   *  WORLD_BIBLE: each of PLR02〜PLR20 must defeat ZERO before the
   *  21st hero (PLR01 英霊ハルキ, AVATARS index 20) is summoned.
   *  - 0 = PLR00 (default protagonist)
   *  - 1..19 = PLR02..PLR20 (the 19 bonus avatars)
   *  - PLR01 (index 20) NEVER appears here — clearing ch.20 with PLR01
   *    is the true-ending trigger, not a chain step.
   *  unlockedCount = avatarsClearedCh20.length, so once all 20 indices
   *  in [0..19] have cleared ch.20 at least once, PLR01 is unlocked.
   *  Legacy slots (pre-v0.36.26) that only have `unlockedCount` are
   *  back-derived as `[0..unlockedCount-1]` on read by `migrateSlot`. */
  avatarsClearedCh20?: number[];
  /** True iff PLR01 has cleared ch.20 on this slot at least once. */
  trueEndingAchieved?: boolean;
  /** True iff the 20-D Void-φ awakening cinematic has played on
   *  this slot, gating OPP22 selection in free mode. */
  voidphiAwakened?: boolean;
  /** True iff the player has dismissed `narrative:opp22.intro` on
   *  this slot at least once. Currently informational only. */
  voidphiIntroSeen?: boolean;
}

export interface FreeStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  resigns: number;
  vsOpponent: Record<number, OpponentRecord>;
}

export type GameResult = 'win' | 'loss' | 'draw' | 'resign';

interface PersistedSlots {
  schemaVersion: 1;
  slots: SaveSlot[];
}

/* ------------------------------------------------------------------ */
/* Defaults                                                           */
/* ------------------------------------------------------------------ */

export function defaultSlot(id: number): SaveSlot {
  return {
    id,
    name: `Save ${id}`,
    avatarIdx: (id - 1) % 20,
    createdAt: 0,
    lastPlayedAt: 0,
    storyProgress: 0,
    lives: INITIAL_LIVES,
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    resigns: 0,
    vsOpponent: {},
    voidphiEncounterPending: false,
    unlockedCount: 0,
    avatarsClearedCh20: [],
    trueEndingAchieved: false,
    voidphiAwakened: false,
    voidphiIntroSeen: false,
  };
}

function defaultFreeStats(): FreeStats {
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    resigns: 0,
    vsOpponent: {},
  };
}

function defaultSlotsArray(): SaveSlot[] {
  const slots: SaveSlot[] = [];
  for (let i = 1; i <= MAX_SLOTS; i++) slots.push(defaultSlot(i));
  return slots;
}

/* ------------------------------------------------------------------ */
/* Reads                                                              */
/* ------------------------------------------------------------------ */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** v0.36.40 — chain-progression invariant.
 *
 *  Under Design A (v0.36.40+), each chain step PLR plays its own full
 *  ch.1-20 lap. After ch.20 win, `slot.storyProgress` is reset to 0
 *  and `avatarsClearedCh20` grows by 1, so the new PLR's lap starts
 *  fresh.
 *
 *  This means the steady-state invariant is:
 *    `storyProgress < 20`  OR  `trueEndingAchieved === true`  OR
 *    (sp == 20 AND active PLR is mid-fight on the boss)
 *
 *  A legacy slot from Design B (v0.36.26 ~ v0.36.39) can have
 *  `storyProgress === 20 && trueEnd === false && acclen < 20` —
 *  i.e. PLR0M cleared ch.20 historically but the chain advance + sp
 *  reset never fired together. Same shape comes from the spell warp
 *  `…NN20` (= "PLR NN about to fight ch.20").
 *
 *  This helper normalizes that on read: if the slot has cleared ch.20
 *  but the chain isn't fully advanced, push the chain by 1 and reset
 *  sp=0. Run from `migrateSlot` once on first read, then re-saved in
 *  the new shape. Subsequent reads are no-ops. */
export function normalizePostClearState(input: {
  storyProgress: number;
  avatarsClearedCh20: number[];
  trueEndingAchieved: boolean;
}): {
  storyProgress: number;
  avatarsClearedCh20: number[];
  unlockedCount: number;
} {
  let sp = input.storyProgress;
  const acc = [...input.avatarsClearedCh20];
  const trueEnd = input.trueEndingAchieved;
  if (sp >= 20 && acc.length < 20 && !trueEnd) {
    // Chain step PLR has cleared ch.20 but hasn't been advanced. Push
    // the next AVATARS index (= acc.length, since acc is sorted dense
    // 0..acc.length-1 by the chain assumption) and rewind sp to the
    // new PLR's prologue.
    const nextIdx = acc.length;
    if (nextIdx >= 0 && nextIdx < 20 && !acc.includes(nextIdx)) {
      acc.push(nextIdx);
      acc.sort((a, b) => a - b);
    }
    sp = 0;
  }
  // PLR01 ch.20 win + trueEnd not yet flipped: don't auto-flip on read
  // (the cinematic chain might still be playing). Leave to runtime.
  return {
    storyProgress: sp,
    avatarsClearedCh20: acc,
    unlockedCount: acc.length,
  };
}

/** v0.36.26 — pure helper for avatarsClearedCh20 / unlockedCount
 *  reconciliation, used by both `migrateSlot` (read path) and the
 *  saveSlots unit tests. Rules:
 *  1. If `avatarsClearedCh20` is a valid array of 0..19 indices, that
 *     is the source of truth and `unlockedCount` is its dedup'd length.
 *  2. Else if legacy `unlockedCount` is a valid 0..20 scalar, back-
 *     derive `avatarsClearedCh20 = [0..unlockedCount-1]` (chain
 *     assumption: the player necessarily cleared in AVATARS-array
 *     order because the picker forces it).
 *  3. Else both default to empty / 0. */
export function reconcileAvatarsCleared(
  rawAvatarsCleared: unknown,
  rawUnlockedCount: unknown,
): { avatarsClearedCh20: number[]; unlockedCount: number } {
  if (Array.isArray(rawAvatarsCleared)) {
    const seen = new Set<number>();
    for (const v of rawAvatarsCleared) {
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < 20) {
        seen.add(v);
      }
    }
    const list = Array.from(seen).sort((a, b) => a - b);
    return { avatarsClearedCh20: list, unlockedCount: list.length };
  }
  if (
    typeof rawUnlockedCount === 'number' &&
    rawUnlockedCount >= 0 &&
    rawUnlockedCount <= 20
  ) {
    const n = Math.floor(rawUnlockedCount);
    const list: number[] = [];
    for (let i = 0; i < n && i < 20; i++) list.push(i);
    return { avatarsClearedCh20: list, unlockedCount: list.length };
  }
  return { avatarsClearedCh20: [], unlockedCount: 0 };
}

function migrateSlot(raw: unknown, id: number): SaveSlot {
  const base = defaultSlot(id);
  if (!isObject(raw)) return base;
  const reconciled = reconcileAvatarsCleared(
    raw.avatarsClearedCh20,
    raw.unlockedCount,
  );
  // v0.36.40 — accept storyProgress 0..21 (PLR01 lap can reach 21).
  const rawSp =
    typeof raw.storyProgress === 'number' &&
    raw.storyProgress >= 0 &&
    raw.storyProgress <= 21
      ? raw.storyProgress
      : base.storyProgress;
  const trueEnd =
    typeof raw.trueEndingAchieved === 'boolean'
      ? raw.trueEndingAchieved
      : false;
  // v0.36.40 — normalize legacy "sp=20 + chain not advanced" state into
  // "next PLR ch.0". See normalizePostClearState for the rationale.
  const normalized = normalizePostClearState({
    storyProgress: rawSp,
    avatarsClearedCh20: reconciled.avatarsClearedCh20,
    trueEndingAchieved: trueEnd,
  });
  const { avatarsClearedCh20, unlockedCount } = normalized;
  return {
    ...base,
    name: typeof raw.name === 'string' ? raw.name : base.name,
    // v0.36.40 — accept avatarIdx 0..20 (was 0..19); idx=20 is PLR01.
    avatarIdx:
      typeof raw.avatarIdx === 'number' && raw.avatarIdx >= 0 && raw.avatarIdx <= 20
        ? raw.avatarIdx
        : base.avatarIdx,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : base.createdAt,
    lastPlayedAt:
      typeof raw.lastPlayedAt === 'number' ? raw.lastPlayedAt : base.lastPlayedAt,
    storyProgress: normalized.storyProgress,
    lives:
      typeof raw.lives === 'number' && raw.lives >= 0
        ? Math.min(raw.lives, MAX_LIVES)
        : base.lives,
    totalGames: typeof raw.totalGames === 'number' ? raw.totalGames : 0,
    wins: typeof raw.wins === 'number' ? raw.wins : 0,
    losses: typeof raw.losses === 'number' ? raw.losses : 0,
    draws: typeof raw.draws === 'number' ? raw.draws : 0,
    resigns: typeof raw.resigns === 'number' ? raw.resigns : 0,
    vsOpponent: isObject(raw.vsOpponent) ? (raw.vsOpponent as Record<number, OpponentRecord>) : {},
    voidphiEncounterPending:
      typeof raw.voidphiEncounterPending === 'boolean'
        ? raw.voidphiEncounterPending
        : false,
    unlockedCount,
    avatarsClearedCh20,
    trueEndingAchieved:
      typeof raw.trueEndingAchieved === 'boolean'
        ? raw.trueEndingAchieved
        : false,
    voidphiAwakened:
      typeof raw.voidphiAwakened === 'boolean'
        ? raw.voidphiAwakened
        : false,
    voidphiIntroSeen:
      typeof raw.voidphiIntroSeen === 'boolean'
        ? raw.voidphiIntroSeen
        : false,
  };
}

/* ------------------------------------------------------------------ */
/* Display helpers                                                    */
/* ------------------------------------------------------------------ */

export interface SavePointDisplay {
  /** AVATARS array index of the PLR currently active on this slot.
   *  0 = PLR00 (default), 1..19 = PLR02..PLR20 (chain steps),
   *  20 = PLR01 (heroic spirit, chain reward). */
  plrIdx: number;
  /** Strict slug "PLR00" / "PLR01" / "PLR02" / ... / "PLR20". Parsed
   *  from the avatar's image path (`avatars/players/PLRxx_slug/...`). */
  plrSlug: string;
  /** Localized display name (`あなた` / `美琴` / etc.). Already
   *  locale-applied by the caller via the AVATARS array passed in. */
  plrName: string;
  /** Current chapter (= lap progress for the active PLR). 0..20 for
   *  chain-step PLRs, 0..21 for PLR01 (ch.21 = post-true-ending). */
  chapter: number;
  /** Max chapter for the active PLR. 21 if PLR01, 20 otherwise. */
  chapterMax: number;
}

/** v0.36.40 — pure save-point display helper. Derives the
 *  `(currentPLR, currentChapter)` tuple that should be shown for a
 *  slot from the slot's chain state. After the Design A migration,
 *  `slot.storyProgress` already represents the per-PLR lap progress
 *  (resets to 0 on chain advance), and `avatarsClearedCh20.length`
 *  encodes the chain frontier directly.
 *
 *  The `avatars` arg is a slim view of the locale-applied AVATARS
 *  array (just `name` and `image` fields needed). Pass
 *  `[DEFAULT_AVATAR, ...AVATARS_DATA]` from App.tsx so PLR01 (last
 *  entry, idx 20) is at `avatars[20]`. */
export function getSavePointDisplay(
  slot: SaveSlot,
  avatars: ReadonlyArray<{ name: string; image: string }>,
): SavePointDisplay {
  const acclen = (slot.avatarsClearedCh20 ?? []).length;
  const trueEnd = slot.trueEndingAchieved ?? false;
  const sp = slot.storyProgress ?? 0;

  // Chain frontier = next PLR to be played. For trueEnd slots, the
  // frontier is locked to PLR01 (idx 20); otherwise it's the count of
  // chain-step PLRs already cleared (0=PLR00, 1=PLR02, ..., 19=PLR20,
  // 20=PLR01-just-unlocked).
  const plrIdx = trueEnd ? 20 : Math.min(acclen, 20);
  const chapterMax = plrIdx === 20 ? 21 : 20;

  // Chapter:
  //  - PLR01 + trueEnd → 21 (post-true-ending state)
  //  - PLR01 + !trueEnd → sp (PLR01's lap, can reach 20 before true ending)
  //  - chain-step PLR → sp (this PLR's lap, 0..20)
  // Defensively clamp to chapterMax.
  let chapter: number;
  if (plrIdx === 20 && trueEnd) chapter = 21;
  else chapter = Math.min(Math.max(sp, 0), chapterMax);

  const safeIdx = Math.max(0, Math.min(plrIdx, avatars.length - 1));
  const plrName = avatars[safeIdx]?.name ?? '';
  const plrSlug = slugFromAvatarImage(avatars[safeIdx]?.image ?? '');
  return { plrIdx, plrSlug, plrName, chapter, chapterMax };
}

/** Extracts the strict PLR slug ("PLR00" .. "PLR20") from an avatar's
 *  image path, e.g.
 *  "avatars/players/PLR02_mikoto/icon.png" → "PLR02". Returns "PLR??"
 *  if the path doesn't match the canonical layout (defensive). */
export function slugFromAvatarImage(image: string): string {
  const m = image.match(/PLR(\d{2})_/);
  return m ? `PLR${m[1]}` : 'PLR??';
}

export async function getSlots(): Promise<SaveSlot[]> {
  try {
    const raw = window.localStorage.getItem(SLOTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedSlots> | SaveSlot[];
      const list: unknown[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.slots)
          ? parsed.slots
          : [];
      const slots: SaveSlot[] = [];
      for (let i = 1; i <= MAX_SLOTS; i++) {
        const found = list.find((s) => isObject(s) && s.id === i);
        slots.push(migrateSlot(found, i));
      }
      return slots;
    }
  } catch {
    /* fall through */
  }
  // First-ever read: seed slot 1 with the legacy global story progress
  // (if any) so existing users keep their progress on the new system.
  const slots = defaultSlotsArray();
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORY_PROGRESS_KEY);
    if (legacy) {
      const p = parseInt(legacy, 10);
      if (!isNaN(p) && p >= 0 && p <= 20) {
        slots[0].storyProgress = p;
        slots[0].lastPlayedAt = Date.now();
      }
    }
  } catch {
    /* ignore */
  }
  await saveSlots(slots);
  return slots;
}

export async function getSlot(id: number): Promise<SaveSlot | null> {
  const slots = await getSlots();
  return slots.find((s) => s.id === id) ?? null;
}

export async function saveSlots(slots: SaveSlot[]): Promise<void> {
  try {
    const persisted: PersistedSlots = { schemaVersion: SCHEMA_VERSION, slots };
    window.localStorage.setItem(SLOTS_KEY, JSON.stringify(persisted));
  } catch {
    /* ignore quota errors */
  }
}

export async function getActiveSlotId(): Promise<number | null> {
  try {
    const raw = window.localStorage.getItem(ACTIVE_SLOT_KEY);
    if (!raw) return null;
    const id = parseInt(raw, 10);
    if (id >= 1 && id <= MAX_SLOTS) return id;
  } catch {
    /* ignore */
  }
  return null;
}

export async function setActiveSlotId(id: number | null): Promise<void> {
  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_SLOT_KEY);
    } else {
      window.localStorage.setItem(ACTIVE_SLOT_KEY, String(id));
    }
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Writes                                                             */
/* ------------------------------------------------------------------ */

export async function updateSlot(
  id: number,
  patch: Partial<SaveSlot>,
): Promise<SaveSlot[]> {
  const slots = await getSlots();
  const idx = slots.findIndex((s) => s.id === id);
  if (idx === -1) return slots;
  // Preserve id; touch lastPlayedAt only if explicit.
  const merged: SaveSlot = { ...slots[idx], ...patch, id };
  slots[idx] = merged;
  await saveSlots(slots);
  return slots;
}

export async function resetSlot(id: number): Promise<SaveSlot[]> {
  const slots = await getSlots();
  const idx = slots.findIndex((s) => s.id === id);
  if (idx === -1) return slots;
  // Keep the user's chosen name and avatar; everything else goes back
  // to defaults. createdAt is preserved if it was set.
  const old = slots[idx];
  slots[idx] = {
    ...defaultSlot(id),
    name: old.name,
    avatarIdx: old.avatarIdx,
    createdAt: old.createdAt,
  };
  await saveSlots(slots);
  return slots;
}

interface RecordSlotResultInput {
  slotId: number;
  result: GameResult;
  /** Opponent level 1-20. */
  opponentLevel: number;
  /** True when the match was a story-chapter attempt (only then does
   * storyProgress advance on win). */
  isStory: boolean;
  /** AVATARS index of the player avatar that fought this match
   *  (= live `p1Avatar` state). Used by the v0.36.26 unlock-chain
   *  logic: a ch.20 win with a PLR (avatar index 0..19) that hasn't
   *  cleared ch.20 on this slot yet adds that index to
   *  `slot.avatarsClearedCh20`, which advances `unlockedCount` by 1
   *  and reveals the next bonus PLR in the AVATARS picker. PLR01
   *  (index 20) NEVER advances the chain — clearing ch.20 with PLR01
   *  is the true-ending trigger, handled separately. Optional only so
   *  pre-v0.36.26 callers compile; new callers should always pass it. */
  playerAvatarIdx?: number;
}

export async function recordSlotResult(input: RecordSlotResultInput): Promise<SaveSlot[]> {
  const { slotId, result, opponentLevel, isStory, playerAvatarIdx } = input;
  const slots = await getSlots();
  const idx = slots.findIndex((s) => s.id === slotId);
  if (idx === -1) return slots;
  const slot: SaveSlot = {
    ...slots[idx],
    vsOpponent: { ...slots[idx].vsOpponent },
    avatarsClearedCh20: [...(slots[idx].avatarsClearedCh20 ?? [])],
  };

  slot.totalGames += 1;
  slot.lastPlayedAt = Date.now();
  if (slot.createdAt === 0) slot.createdAt = slot.lastPlayedAt;

  if (result === 'win') {
    slot.wins += 1;
    slot.lives = Math.min(MAX_LIVES, slot.lives + 1);
    if (isStory && slot.storyProgress < 20) {
      slot.storyProgress += 1;
    }
    // v0.36.40 — Design A chain-unlock: a ch.20 win with a fresh
    // chain-step PLR (avatarIdx 0..19) adds that PLR to
    // avatarsClearedCh20, bumps unlockedCount, AND resets
    // storyProgress to 0 so the next chain PLR's lap starts fresh
    // from ch.0 (= 序章). PLR01 (index 20) is excluded — it's the
    // chain-completion reward, not a chain step, so its ch.20 win
    // doesn't reset sp (true-ending logic in App.tsx handles it).
    if (
      isStory &&
      opponentLevel === 20 &&
      typeof playerAvatarIdx === 'number' &&
      playerAvatarIdx >= 0 &&
      playerAvatarIdx < 20 &&
      !(slot.avatarsClearedCh20 ?? []).includes(playerAvatarIdx)
    ) {
      const next = [...(slot.avatarsClearedCh20 ?? []), playerAvatarIdx].sort(
        (a, b) => a - b,
      );
      slot.avatarsClearedCh20 = next;
      slot.unlockedCount = next.length;
      // Hard reset the per-PLR lap pointer so the new chain frontier
      // starts at ch.0. This is the core of Design A — each chain
      // step replays its own ch.1-20 lap rather than just fighting
      // ch.20 once. See plan
      // /root/.claude/plans/plr00-20-iridescent-hartmanis.md
      slot.storyProgress = 0;
    }
  } else if (result === 'loss') {
    slot.losses += 1;
    slot.lives = Math.max(0, slot.lives - 1);
  } else if (result === 'resign') {
    slot.resigns += 1;
    slot.losses += 1;
    slot.lives = Math.max(0, slot.lives - 1);
  } else {
    slot.draws += 1;
    // Draws don't change lives or progress.
  }

  const opp = slot.vsOpponent[opponentLevel] ?? { wins: 0, losses: 0, draws: 0 };
  if (result === 'win') opp.wins += 1;
  else if (result === 'loss' || result === 'resign') opp.losses += 1;
  else opp.draws += 1;
  slot.vsOpponent[opponentLevel] = opp;

  slots[idx] = slot;
  await saveSlots(slots);
  return slots;
}

/* ------------------------------------------------------------------ */
/* Free-mode stats                                                    */
/* ------------------------------------------------------------------ */

export async function getFreeStats(): Promise<FreeStats> {
  try {
    const raw = window.localStorage.getItem(FREE_STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (isObject(parsed)) {
        const base = defaultFreeStats();
        return {
          ...base,
          totalGames: typeof parsed.totalGames === 'number' ? parsed.totalGames : 0,
          wins: typeof parsed.wins === 'number' ? parsed.wins : 0,
          losses: typeof parsed.losses === 'number' ? parsed.losses : 0,
          draws: typeof parsed.draws === 'number' ? parsed.draws : 0,
          resigns: typeof parsed.resigns === 'number' ? parsed.resigns : 0,
          vsOpponent:
            isObject(parsed.vsOpponent)
              ? (parsed.vsOpponent as Record<number, OpponentRecord>)
              : {},
        };
      }
    }
  } catch {
    /* ignore */
  }
  return defaultFreeStats();
}

export async function recordFreeResult(input: {
  result: GameResult;
  opponentLevel: number;
}): Promise<FreeStats> {
  const stats = await getFreeStats();
  const next: FreeStats = { ...stats, vsOpponent: { ...stats.vsOpponent } };
  next.totalGames += 1;
  if (input.result === 'win') next.wins += 1;
  else if (input.result === 'loss') next.losses += 1;
  else if (input.result === 'resign') {
    next.resigns += 1;
    next.losses += 1;
  } else next.draws += 1;

  const opp = next.vsOpponent[input.opponentLevel] ?? { wins: 0, losses: 0, draws: 0 };
  if (input.result === 'win') opp.wins += 1;
  else if (input.result === 'loss' || input.result === 'resign') opp.losses += 1;
  else opp.draws += 1;
  next.vsOpponent[input.opponentLevel] = opp;

  try {
    window.localStorage.setItem(FREE_STATS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

/* ------------------------------------------------------------------ */
/* Character unlocks (global, app-wide counter)                       */
/* ------------------------------------------------------------------ */

/**
 * Number of bonus character avatars the player has unlocked. 0 means
 * only the default protagonist is available; 20 means the entire
 * roster (including the special "first hero" Haruki at the end of
 * AVATARS_DATA) has been earned. Each full 20-chapter story clear
 * increments this by 1 via `setCharacterUnlocks` from the game-over
 * effect — there is no auto-seed from existing slots, so a returning
 * player who only ever cleared the route once still owns just the
 * single character that clear earned them. (An earlier seed that
 * granted all 20 at once on any cleared slot has been removed; users
 * who got hit by it can hit "キャラクター解放を初期化" in settings.)
 */
export async function getCharacterUnlocks(): Promise<number> {
  try {
    const raw = window.localStorage.getItem(CHARACTER_UNLOCKS_KEY);
    if (raw !== null) {
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n >= 0 && n <= TOTAL_BONUS_AVATARS) return n;
    }
    window.localStorage.setItem(CHARACTER_UNLOCKS_KEY, '0');
    return 0;
  } catch {
    return 0;
  }
}

export async function setCharacterUnlocks(n: number): Promise<void> {
  const clamped = Math.max(0, Math.min(TOTAL_BONUS_AVATARS, Math.floor(n)));
  try {
    window.localStorage.setItem(CHARACTER_UNLOCKS_KEY, String(clamped));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* True-ending flag (= bonus Lv.21 OPP21 unlock)                      */
/* ------------------------------------------------------------------ */

export async function getTrueEndingAchieved(): Promise<boolean> {
  try {
    return window.localStorage.getItem(TRUE_ENDING_KEY) === '1';
  } catch {
    return false;
  }
}

export async function setTrueEndingAchieved(v: boolean): Promise<void> {
  try {
    if (v) window.localStorage.setItem(TRUE_ENDING_KEY, '1');
    else window.localStorage.removeItem(TRUE_ENDING_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Void-φ awakening flag (= bonus Lv.22 OPP22 unlock, Phase 4 Step 3) */
/* ------------------------------------------------------------------ */

/**
 * `true` once the player has watched the Void-φ awakening cinematic
 * (chapter 20-D), which auto-plays the first time they finish the
 * standard true ending (20-B → 20-C). Distinct from
 * `trueEndingAchieved` so OPP21 (Zero returned) and OPP22 (Void-φ)
 * have independent unlock gates — though in practice they cascade
 * through the same trigger.
 */
export async function getVoidphiAwakened(): Promise<boolean> {
  try {
    return window.localStorage.getItem(VOIDPHI_AWAKENED_KEY) === '1';
  } catch {
    return false;
  }
}

export async function setVoidphiAwakened(v: boolean): Promise<void> {
  try {
    if (v) window.localStorage.setItem(VOIDPHI_AWAKENED_KEY, '1');
    else window.localStorage.removeItem(VOIDPHI_AWAKENED_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * `true` once the player has watched the Void-φ intro narrative
 * (first-encounter scene shown before the first OPP22 free-mode
 * fight). Used to gate "show intro vs jump straight to match".
 * In-battle integration of intro/bossPre/Post is left for a
 * follow-up patch — the flag is plumbed end-to-end now so the
 * flow can be wired without another storage migration.
 */
export async function getVoidphiIntroSeen(): Promise<boolean> {
  try {
    return window.localStorage.getItem(VOIDPHI_INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export async function setVoidphiIntroSeen(v: boolean): Promise<void> {
  try {
    if (v) window.localStorage.setItem(VOIDPHI_INTRO_SEEN_KEY, '1');
    else window.localStorage.removeItem(VOIDPHI_INTRO_SEEN_KEY);
  } catch {
    /* ignore */
  }
}
