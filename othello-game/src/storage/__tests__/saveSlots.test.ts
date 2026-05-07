/**
 * Coverage for the v0.36.26 chain-unlock semantics added to
 * `SaveSlot.avatarsClearedCh20`. The previous gate
 * (`storyProgress === 19`) only fired once per slot and stranded the
 * player at unlockedCount=1 max — making PLR01 英霊ハルキ effectively
 * spell-warp-only. The new behaviour: each fresh AVATARS index 0..19
 * that wins ch.20 contributes to the chain, and `unlockedCount` is a
 * derived view of `avatarsClearedCh20.length`.
 *
 * These tests exercise the two pure-ish surfaces:
 *   1. `reconcileAvatarsCleared` — read-path migration
 *      (legacy `unlockedCount` → back-derived `[0..N-1]`).
 *   2. `recordSlotResult` — the +1 chain step + the PLR01 / non-ch.20
 *      / loss / duplicate guards.
 *
 * `recordSlotResult` writes through `localStorage`; vitest's
 * jsdom-like environment is configured by the suite-level
 * `beforeEach` to give us a fresh window store per test.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getSlot,
  getSlots,
  reconcileAvatarsCleared,
  recordSlotResult,
  saveSlots,
  TOTAL_BONUS_AVATARS,
  type SaveSlot,
} from '../saveSlots';

/* ------------------------------------------------------------------ */
/* Minimal in-memory localStorage shim                                */
/* ------------------------------------------------------------------ */

class MemoryStorage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  key(i: number): string | null {
    return Array.from(this.store.keys())[i] ?? null;
  }
}

beforeEach(() => {
  const ls = new MemoryStorage();
  // Vitest with environment 'node' has no window; fabricate one.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = { localStorage: ls };
});

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).window;
});

/* ------------------------------------------------------------------ */
/* reconcileAvatarsCleared                                            */
/* ------------------------------------------------------------------ */

describe('reconcileAvatarsCleared', () => {
  it('back-derives avatarsClearedCh20 from a legacy unlockedCount', () => {
    // A slot saved by a pre-v0.36.26 build only has `unlockedCount: 5`.
    // The chain assumption is "you cleared in AVATARS-array order"
    // because the picker forces it, so [0, 1, 2, 3, 4] is the unique
    // back-derivation.
    const out = reconcileAvatarsCleared(undefined, 5);
    expect(out.avatarsClearedCh20).toEqual([0, 1, 2, 3, 4]);
    expect(out.unlockedCount).toBe(5);
  });

  it('respects an existing avatarsClearedCh20 array even if a stale unlockedCount disagrees', () => {
    // Newer slots should treat avatarsClearedCh20 as the source of
    // truth so a corrupted unlockedCount can't downgrade unlocks.
    const out = reconcileAvatarsCleared([0, 5, 17], 1);
    expect(out.avatarsClearedCh20).toEqual([0, 5, 17]);
    expect(out.unlockedCount).toBe(3);
  });

  it('dedupes and sorts a malformed avatarsClearedCh20 array', () => {
    // Defensive: a hand-edited slot or a future bug could write
    // duplicates or out-of-range indices. We keep only ints in [0,20).
    const out = reconcileAvatarsCleared([3, 3, -1, 20, 21, 7, 7, '4'], undefined);
    expect(out.avatarsClearedCh20).toEqual([3, 7]);
    expect(out.unlockedCount).toBe(2);
  });

  it('returns empty defaults when neither field is present', () => {
    const out = reconcileAvatarsCleared(undefined, undefined);
    expect(out.avatarsClearedCh20).toEqual([]);
    expect(out.unlockedCount).toBe(0);
  });

  it('rejects an out-of-range legacy unlockedCount', () => {
    // unlockedCount > TOTAL_BONUS_AVATARS is invalid; fall back to
    // empty rather than producing a bogus 25-entry array.
    const out = reconcileAvatarsCleared(undefined, 99);
    expect(out.avatarsClearedCh20).toEqual([]);
    expect(out.unlockedCount).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* recordSlotResult — chain unlock                                     */
/* ------------------------------------------------------------------ */

async function readSlot(id: number): Promise<SaveSlot> {
  const slot = await getSlot(id);
  if (!slot) throw new Error(`slot ${id} not found`);
  return slot;
}

describe('recordSlotResult chain unlock', () => {
  it('appends a fresh PLR0 ch.20 win to avatarsClearedCh20 and bumps unlockedCount', async () => {
    // Slot 1, default state (storyProgress=0, avatarsClearedCh20=[]).
    // Player wins ch.20 (opponentLevel=20) with PLR00 (avatarIdx=0).
    // Expected: avatarsClearedCh20=[0], unlockedCount=1.
    await getSlots(); // initialise default slots in storage
    await recordSlotResult({
      slotId: 1,
      result: 'win',
      opponentLevel: 20,
      isStory: true,
      playerAvatarIdx: 0,
    });
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([0]);
    expect(slot.unlockedCount).toBe(1);
  });

  it('does NOT advance the chain on a duplicate ch.20 clear with the same PLR', async () => {
    // The chain is unique-PLR-once: a PLR that has already cleared
    // ch.20 on this slot does not contribute again. This guards
    // against a free-mode or bonus replay accidentally inflating
    // unlockedCount past 20.
    await getSlots();
    await recordSlotResult({
      slotId: 1,
      result: 'win',
      opponentLevel: 20,
      isStory: true,
      playerAvatarIdx: 0,
    });
    await recordSlotResult({
      slotId: 1,
      result: 'win',
      opponentLevel: 20,
      isStory: true,
      playerAvatarIdx: 0,
    });
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([0]);
    expect(slot.unlockedCount).toBe(1);
  });

  it('does NOT advance the chain when PLR01 (avatarIdx=20) wins ch.20', async () => {
    // PLR01 英霊ハルキ is the chain-completion reward, not a chain
    // step. A PLR01 ch.20 win triggers true-ending logic in App.tsx
    // but must not push index 20 into avatarsClearedCh20 — the field
    // is defined to hold only [0..19].
    await getSlots();
    // Pre-seed: imagine the chain has filled to PLR20 (idx 19),
    // unlockedCount=20, PLR01 selectable.
    const seed: SaveSlot = {
      ...(await readSlot(1)),
      avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
      unlockedCount: TOTAL_BONUS_AVATARS,
    };
    const all = await getSlots();
    all[0] = seed;
    await saveSlots(all);

    await recordSlotResult({
      slotId: 1,
      result: 'win',
      opponentLevel: 20,
      isStory: true,
      playerAvatarIdx: 20, // PLR01
    });
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual(
      Array.from({ length: 20 }, (_, i) => i),
    );
    expect(slot.unlockedCount).toBe(TOTAL_BONUS_AVATARS);
  });

  it('does NOT advance the chain on a non-ch.20 win', async () => {
    // Only ch.20 (opponentLevel=20) counts toward the chain. A win
    // at any other level just records the W without touching unlocks.
    await getSlots();
    await recordSlotResult({
      slotId: 1,
      result: 'win',
      opponentLevel: 19,
      isStory: true,
      playerAvatarIdx: 0,
    });
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([]);
    expect(slot.unlockedCount).toBe(0);
  });

  it('does NOT advance the chain on a loss at ch.20', async () => {
    // Defeat at ch.20 must never bump unlocks — this would let the
    // player farm PLR01 by losing 19 times.
    await getSlots();
    await recordSlotResult({
      slotId: 1,
      result: 'loss',
      opponentLevel: 20,
      isStory: true,
      playerAvatarIdx: 0,
    });
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([]);
    expect(slot.unlockedCount).toBe(0);
  });

  it('walks the full PLR0→PLR19 chain so that PLR01 (idx 20) is unlocked', async () => {
    // End-to-end: simulate clearing ch.20 once with each of avatarIdx
    // 0..19 and check that unlockedCount lands at 20, which is the
    // condition the AVATARS picker uses to surface PLR01.
    await getSlots();
    for (let i = 0; i < 20; i++) {
      await recordSlotResult({
        slotId: 1,
        result: 'win',
        opponentLevel: 20,
        isStory: true,
        playerAvatarIdx: i,
      });
    }
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual(
      Array.from({ length: 20 }, (_, i) => i),
    );
    expect(slot.unlockedCount).toBe(TOTAL_BONUS_AVATARS);
  });
});

/* ------------------------------------------------------------------ */
/* getSlots — read-path migration                                      */
/* ------------------------------------------------------------------ */

describe('getSlots read-path migration', () => {
  it('back-derives avatarsClearedCh20 from a legacy persisted slot', async () => {
    // Simulate a v0.36.25 save: avatarsClearedCh20 is absent but
    // unlockedCount=3 is present (= the user cleared ch.20 with
    // PLR00..PLR03 sequentially under the old gate).
    const legacy = {
      schemaVersion: 1,
      slots: [
        {
          id: 1,
          name: 'Save 1',
          avatarIdx: 0,
          createdAt: 100,
          lastPlayedAt: 200,
          storyProgress: 20,
          lives: 5,
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          resigns: 0,
          vsOpponent: {},
          unlockedCount: 3,
        },
      ],
    };
    window.localStorage.setItem('othello:save_slots', JSON.stringify(legacy));
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([0, 1, 2]);
    expect(slot.unlockedCount).toBe(3);
  });
});
