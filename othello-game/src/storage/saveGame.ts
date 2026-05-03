/**
 * Persistent storage adapter.
 *
 * Today: thin wrapper around `window.localStorage`.
 * Phase 3 plan: swap the implementation for `@capacitor/preferences`
 * without changing the public API. All callers must therefore go
 * through this module — no direct `localStorage` calls in App code.
 *
 * The API is intentionally async even though localStorage is
 * synchronous, because Capacitor Preferences is async.
 */
import type { Color, EMPTY as EmptyT } from '../engine/types';
import type { ReviewAnnotations } from '../prompts/review';

export const STORY_PROGRESS_KEY = 'othello:story_progress';
const SAVE_PREFIX = 'othello:save:';

export const CURRENT_SCHEMA_VERSION = 1 as const;

export type GameMode = 'ai' | 'human';
export type AiMode = 'story' | 'free';

export interface MoveRecord {
  color: Color;
  row: number;
  col: number;
}

/**
 * Persisted shape (what we write to localStorage). All future fields
 * must be optional so older save files still load. When the shape
 * needs a breaking change, bump CURRENT_SCHEMA_VERSION and add a
 * branch in `migrateSlot`.
 */
interface PersistedSlotV1 {
  schemaVersion: 1;
  name: string;
  timestamp: number;
  gameMode: GameMode;
  aiMode: AiMode;
  computerChar: number;
  level: number;
  kifu: MoveRecord[];
  storyProgress: number;
  counts: { black: number; white: number };
  result: Color | typeof EmptyT | null;
  /**
   * Optional Claude review text. Older slots and slots whose review
   * came from the legacy text-streaming path keep this populated.
   * New tool-use reviews leave this `undefined` and use
   * `reviewAnnotations` instead.
   */
  review?: string;
  /**
   * Optional structured per-move annotations. Present on slots whose
   * review was generated via the annotate_othello_game tool call.
   */
  reviewAnnotations?: ReviewAnnotations;
  /**
   * Color the human played in this match (BLACK = went first, WHITE =
   * went second). Optional for backward compat — older slots predate
   * the first/second selector and assumed Black; the loader defaults
   * to BLACK when absent.
   */
  playerColor?: Color;
}

export type PersistedSlot = PersistedSlotV1;

export interface SavedSlot extends PersistedSlot {
  /** localStorage key, used to delete or reload a specific slot. */
  key: string;
}

/* ------------------------------------------------------------------ */
/* Story progress                                                      */
/* ------------------------------------------------------------------ */

export async function getStoryProgress(): Promise<number> {
  try {
    const v = window.localStorage.getItem(STORY_PROGRESS_KEY);
    if (!v) return 0;
    const p = parseInt(v, 10);
    if (isNaN(p) || p < 0 || p > 20) return 0;
    return p;
  } catch {
    return 0;
  }
}

export async function setStoryProgress(progress: number): Promise<void> {
  try {
    window.localStorage.setItem(STORY_PROGRESS_KEY, String(progress));
  } catch {
    /* ignore storage failures */
  }
}

/* ------------------------------------------------------------------ */
/* Save slots                                                          */
/* ------------------------------------------------------------------ */

export async function listSlots(): Promise<SavedSlot[]> {
  const slots: SavedSlot[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(SAVE_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw) as unknown;
        const migrated = migrateSlot(parsed);
        if (migrated) slots.push({ key, ...migrated });
      } catch {
        /* skip individual slot errors */
      }
    }
  } catch {
    return [];
  }
  slots.sort((a, b) => b.timestamp - a.timestamp);
  return slots;
}

export type NewSlotInput = Omit<PersistedSlot, 'schemaVersion' | 'timestamp'>;

export async function saveSlot(data: NewSlotInput): Promise<string | null> {
  const timestamp = Date.now();
  const key = `${SAVE_PREFIX}${timestamp}`;
  const persisted: PersistedSlot = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    timestamp,
    ...data,
  };
  try {
    window.localStorage.setItem(key, JSON.stringify(persisted));
    return key;
  } catch {
    return null;
  }
}

export async function deleteSlot(key: string): Promise<void> {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * Patch an existing slot in place. Used by the auto-save flow to attach
 * a freshly generated review to the slot that was created on gameOver
 * without bumping the timestamp or duplicating the kifu. Silently no-op
 * if the slot is missing or unparseable.
 */
export async function updateSlot(
  key: string,
  patch: Partial<Omit<PersistedSlot, 'schemaVersion' | 'timestamp'>>,
): Promise<void> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    const existing = JSON.parse(raw) as unknown;
    if (typeof existing !== 'object' || existing === null) return;
    const updated = { ...(existing as Record<string, unknown>), ...patch };
    window.localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Migration                                                           */
/* ------------------------------------------------------------------ */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Coerce an unknown blob from storage into the latest PersistedSlot
 * shape. Returns null when the blob is unrecoverable so listSlots can
 * silently skip it.
 *
 * For now, schemaVersion is always 1; the function only validates the
 * required fields. Future versions add real migration steps here.
 */
function migrateSlot(raw: unknown): PersistedSlot | null {
  if (!isObject(raw)) return null;
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1;
  if (version !== 1) return null;

  if (!Array.isArray(raw.kifu)) return null;
  if (typeof raw.timestamp !== 'number') return null;
  if (typeof raw.gameMode !== 'string') return null;
  if (typeof raw.aiMode !== 'string') return null;

  return {
    schemaVersion: 1,
    name: typeof raw.name === 'string' ? raw.name : '',
    timestamp: raw.timestamp,
    gameMode: raw.gameMode as GameMode,
    aiMode: raw.aiMode as AiMode,
    computerChar: typeof raw.computerChar === 'number' ? raw.computerChar : 0,
    level: typeof raw.level === 'number' ? raw.level : 1,
    kifu: raw.kifu as MoveRecord[],
    storyProgress: typeof raw.storyProgress === 'number' ? raw.storyProgress : 0,
    counts:
      isObject(raw.counts) &&
      typeof raw.counts.black === 'number' &&
      typeof raw.counts.white === 'number'
        ? { black: raw.counts.black, white: raw.counts.white }
        : { black: 0, white: 0 },
    result:
      raw.result === 1 || raw.result === -1 || raw.result === 0 || raw.result === null
        ? (raw.result as PersistedSlot['result'])
        : null,
    review: typeof raw.review === 'string' ? raw.review : undefined,
    reviewAnnotations: isObject(raw.reviewAnnotations)
      ? (raw.reviewAnnotations as unknown as ReviewAnnotations)
      : undefined,
    playerColor:
      raw.playerColor === 1 || raw.playerColor === -1
        ? (raw.playerColor as Color)
        : undefined,
  };
}
