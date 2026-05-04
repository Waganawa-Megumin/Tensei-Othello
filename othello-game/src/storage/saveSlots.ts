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

function migrateSlot(raw: unknown, id: number): SaveSlot {
  const base = defaultSlot(id);
  if (!isObject(raw)) return base;
  return {
    ...base,
    name: typeof raw.name === 'string' ? raw.name : base.name,
    avatarIdx:
      typeof raw.avatarIdx === 'number' && raw.avatarIdx >= 0 && raw.avatarIdx < 20
        ? raw.avatarIdx
        : base.avatarIdx,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : base.createdAt,
    lastPlayedAt:
      typeof raw.lastPlayedAt === 'number' ? raw.lastPlayedAt : base.lastPlayedAt,
    storyProgress:
      typeof raw.storyProgress === 'number' && raw.storyProgress >= 0 && raw.storyProgress <= 20
        ? raw.storyProgress
        : base.storyProgress,
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
  };
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
}

export async function recordSlotResult(input: RecordSlotResultInput): Promise<SaveSlot[]> {
  const { slotId, result, opponentLevel, isStory } = input;
  const slots = await getSlots();
  const idx = slots.findIndex((s) => s.id === slotId);
  if (idx === -1) return slots;
  const slot: SaveSlot = { ...slots[idx], vsOpponent: { ...slots[idx].vsOpponent } };

  slot.totalGames += 1;
  slot.lastPlayedAt = Date.now();
  if (slot.createdAt === 0) slot.createdAt = slot.lastPlayedAt;

  if (result === 'win') {
    slot.wins += 1;
    slot.lives = Math.min(MAX_LIVES, slot.lives + 1);
    if (isStory && slot.storyProgress < 20) {
      slot.storyProgress += 1;
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
 * increments this by 1.
 *
 * On first read the function migrates older saves: if any save slot
 * has already reached storyProgress >= 20 (the previous "all bonus
 * chars unlocked at once" state), we seed the counter at 20 so
 * existing players don't lose their earned roster.
 */
export async function getCharacterUnlocks(): Promise<number> {
  try {
    const raw = window.localStorage.getItem(CHARACTER_UNLOCKS_KEY);
    if (raw !== null) {
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n >= 0 && n <= TOTAL_BONUS_AVATARS) return n;
    }
    // Backward-compat: pull seed from any slot that already cleared.
    const slots = await getSlots();
    const cleared = slots.some((s) => s.storyProgress >= 20);
    const seed = cleared ? TOTAL_BONUS_AVATARS : 0;
    window.localStorage.setItem(CHARACTER_UNLOCKS_KEY, String(seed));
    return seed;
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
