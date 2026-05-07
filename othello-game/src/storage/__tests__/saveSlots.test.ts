/**
 * Coverage for the v0.36.26 chain-unlock + v0.36.40 Design A
 * (per-PLR lap) save-slot semantics:
 *
 * - `reconcileAvatarsCleared` — read-path migration of legacy
 *   `unlockedCount` to `avatarsClearedCh20`.
 * - `normalizePostClearState` — read-path normalization of the
 *   "sp=20 + chain not advanced" corner state into "sp=0 + chain
 *   advanced by 1". Catches both pre-v0.36.26 saves and spell warps
 *   like `…NN20` after the model switch.
 * - `recordSlotResult` — Design A chain advance (storyProgress
 *   resets to 0 on fresh chain-step ch.20 win) and the PLR01 /
 *   non-ch.20 / loss / duplicate guards.
 * - `getSavePointDisplay` — pure derivation of (plrSlug, plrName,
 *   chapter, chapterMax) used by the slot picker / title footer.
 *
 * `recordSlotResult` writes through `localStorage`; vitest's
 * jsdom-like environment is configured by the suite-level
 * `beforeEach` to give us a fresh window store per test.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getSavePointDisplay,
  getSlot,
  getSlots,
  normalizePostClearState,
  reconcileAvatarsCleared,
  recordSlotResult,
  saveSlots,
  slugFromAvatarImage,
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
  it('appends a fresh PLR0 ch.20 win to avatarsClearedCh20 and bumps unlockedCount, resetting storyProgress to 0', async () => {
    // Slot 1, default state (storyProgress=0, avatarsClearedCh20=[]).
    // Player wins ch.20 (opponentLevel=20) with PLR00 (avatarIdx=0).
    // v0.36.40 Design A: avatarsClearedCh20=[0], unlockedCount=1,
    // AND storyProgress reset to 0 (= next chain-step PLR's lap
    // starts from 序章).
    await getSlots(); // initialise default slots in storage
    // Pre-seed sp=19 to simulate the moment just before the ch.20
    // win — the ch.20 increment would otherwise bump it to 20, then
    // the chain-advance reset zeroes it.
    {
      const all = await getSlots();
      all[0] = { ...all[0], storyProgress: 19 };
      await saveSlots(all);
    }
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
    expect(slot.storyProgress).toBe(0);
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

  it('walks the full PLR0→PLR19 chain so that PLR01 (idx 20) is unlocked, leaving sp=0 (= PLR01 lap 序章)', async () => {
    // End-to-end: simulate clearing ch.20 once with each of avatarIdx
    // 0..19 and check that unlockedCount lands at 20, which is the
    // condition the AVATARS picker uses to surface PLR01. v0.36.40
    // Design A: each chain advance also resets storyProgress to 0,
    // so the final state is "PLR01 unlocked, sitting at PLR01 lap
    // ch.0 (= 序章 of PLR01's run)".
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
    expect(slot.storyProgress).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* getSlots — read-path migration                                      */
/* ------------------------------------------------------------------ */

describe('getSlots read-path migration', () => {
  it('back-derives avatarsClearedCh20 from a legacy persisted slot AND normalizes the post-clear state', async () => {
    // Simulate a v0.36.25 save: avatarsClearedCh20 is absent but
    // unlockedCount=3 is present (= the user cleared ch.20 with
    // PLR00..PLR03 sequentially under the old gate). The v0.36.40
    // migration runs `normalizePostClearState` after the
    // back-derivation, which sees `sp=20 + acclen=3 + !trueEnd` and
    // pushes the chain by 1 (acclen becomes 4) + resets sp to 0.
    // Net effect: legacy saves get properly placed at the next
    // chain-step PLR's 序章 the first time they're loaded.
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
    expect(slot.avatarsClearedCh20).toEqual([0, 1, 2, 3]);
    expect(slot.unlockedCount).toBe(4);
    expect(slot.storyProgress).toBe(0);
  });

  it('preserves a mid-lap legacy slot unchanged (sp < 20)', async () => {
    // No post-clear normalization needed when storyProgress < 20.
    const legacy = {
      schemaVersion: 1,
      slots: [
        {
          id: 1,
          name: 'Save 1',
          avatarIdx: 0,
          createdAt: 100,
          lastPlayedAt: 200,
          storyProgress: 7,
          lives: 5,
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          resigns: 0,
          vsOpponent: {},
          unlockedCount: 0,
        },
      ],
    };
    window.localStorage.setItem('othello:save_slots', JSON.stringify(legacy));
    const slot = await readSlot(1);
    expect(slot.avatarsClearedCh20).toEqual([]);
    expect(slot.unlockedCount).toBe(0);
    expect(slot.storyProgress).toBe(7);
  });
});

/* ------------------------------------------------------------------ */
/* normalizePostClearState                                            */
/* ------------------------------------------------------------------ */

describe('normalizePostClearState', () => {
  it('advances the chain when sp=20 + acclen<20 + !trueEnd (= legacy / spell-warp corner state)', () => {
    // The "PLR0M just won ch.20 but the chain advance never fired"
    // shape can come from pre-v0.36.40 saves or the spell warp
    // `…NN20`. Migration shifts it to "next chain step PLR's 序章".
    expect(
      normalizePostClearState({
        storyProgress: 20,
        avatarsClearedCh20: [],
        trueEndingAchieved: false,
      }),
    ).toEqual({
      storyProgress: 0,
      avatarsClearedCh20: [0],
      unlockedCount: 1,
    });
    expect(
      normalizePostClearState({
        storyProgress: 20,
        avatarsClearedCh20: [0, 1, 2],
        trueEndingAchieved: false,
      }),
    ).toEqual({
      storyProgress: 0,
      avatarsClearedCh20: [0, 1, 2, 3],
      unlockedCount: 4,
    });
  });

  it('is a no-op when sp < 20 (= mid-lap state)', () => {
    expect(
      normalizePostClearState({
        storyProgress: 7,
        avatarsClearedCh20: [0, 1],
        trueEndingAchieved: false,
      }),
    ).toEqual({
      storyProgress: 7,
      avatarsClearedCh20: [0, 1],
      unlockedCount: 2,
    });
  });

  it('is a no-op for the trueEnd state (= PLR01 chain finished, ch.21 reached)', () => {
    expect(
      normalizePostClearState({
        storyProgress: 20,
        avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
        trueEndingAchieved: true,
      }),
    ).toEqual({
      storyProgress: 20,
      avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
      unlockedCount: 20,
    });
  });

  it('is a no-op when chain is already full (acclen=20, !trueEnd) — PLR01 lap in progress', () => {
    // sp >= 20 + acclen=20 + !trueEnd is the brief window after
    // PLR01 wins ch.20 but before the cinematic chain flips
    // trueEnd. We don't auto-flip on read (the runtime handles it).
    expect(
      normalizePostClearState({
        storyProgress: 20,
        avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
        trueEndingAchieved: false,
      }),
    ).toEqual({
      storyProgress: 20,
      avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
      unlockedCount: 20,
    });
  });
});

/* ------------------------------------------------------------------ */
/* slugFromAvatarImage                                                */
/* ------------------------------------------------------------------ */

describe('slugFromAvatarImage', () => {
  it.each([
    ['avatars/players/PLR00_default/icon.png', 'PLR00'],
    ['avatars/players/PLR02_mikoto/icon.png', 'PLR02'],
    ['avatars/players/PLR13_yreuyu/icon.png', 'PLR13'],
    ['avatars/players/PLR20_yu/icon.png', 'PLR20'],
    ['avatars/players/PLR01_haruki_heroic/icon.png', 'PLR01'],
  ])('extracts %s → %s', (image, expected) => {
    expect(slugFromAvatarImage(image)).toBe(expected);
  });

  it('falls back to PLR?? when the image path does not match', () => {
    expect(slugFromAvatarImage('foo/bar.png')).toBe('PLR??');
    expect(slugFromAvatarImage('')).toBe('PLR??');
  });
});

/* ------------------------------------------------------------------ */
/* getSavePointDisplay                                                */
/* ------------------------------------------------------------------ */

const TEST_AVATARS: ReadonlyArray<{ name: string; image: string }> = [
  { name: 'あなた',     image: 'avatars/players/PLR00_default/icon.png' },
  { name: '美琴',       image: 'avatars/players/PLR02_mikoto/icon.png' },
  { name: 'リン',       image: 'avatars/players/PLR03_rin/icon.png' },
  { name: '蓮',         image: 'avatars/players/PLR04_ren/icon.png' },
  { name: '千歳',       image: 'avatars/players/PLR05_chitose/icon.png' },
  { name: '晴',         image: 'avatars/players/PLR06_haru/icon.png' },
  { name: 'カイ',       image: 'avatars/players/PLR07_kai/icon.png' },
  { name: '千夏',       image: 'avatars/players/PLR08_chinatsu/icon.png' },
  { name: '透',         image: 'avatars/players/PLR09_toru/icon.png' },
  { name: 'ノア',       image: 'avatars/players/PLR10_noa/icon.png' },
  { name: '凪',         image: 'avatars/players/PLR11_nagi/icon.png' },
  { name: 'エル',       image: 'avatars/players/PLR12_el/icon.png' },
  { name: 'イレウユ',   image: 'avatars/players/PLR13_yreuyu/icon.png' },
  { name: '葉月',       image: 'avatars/players/PLR14_hazuki/icon.png' },
  { name: 'ジエンド',   image: 'avatars/players/PLR15_theend/icon.png' },
  { name: 'ひかり',     image: 'avatars/players/PLR16_hikari/icon.png' },
  { name: 'ヨル',       image: 'avatars/players/PLR17_yoru/icon.png' },
  { name: '湊',         image: 'avatars/players/PLR18_minato/icon.png' },
  { name: '奏太',       image: 'avatars/players/PLR19_souta/icon.png' },
  { name: '悠',         image: 'avatars/players/PLR20_yu/icon.png' },
  { name: '英霊ハルキ', image: 'avatars/players/PLR01_haruki_heroic/icon.png' },
];

function makeSlot(patch: Partial<SaveSlot>): SaveSlot {
  return {
    id: 1,
    name: 'Test',
    avatarIdx: 0,
    createdAt: 0,
    lastPlayedAt: 0,
    storyProgress: 0,
    lives: 5,
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
    ...patch,
  };
}

describe('getSavePointDisplay', () => {
  it('fresh slot → PLR00 あなた / ch.0 / max 20', () => {
    const sp = getSavePointDisplay(makeSlot({}), TEST_AVATARS);
    expect(sp).toEqual({
      plrIdx: 0,
      plrSlug: 'PLR00',
      plrName: 'あなた',
      chapter: 0,
      chapterMax: 20,
    });
  });

  it('PLR00 mid-lap (sp=5) → PLR00 あなた / ch.5 / max 20', () => {
    const sp = getSavePointDisplay(
      makeSlot({ storyProgress: 5 }),
      TEST_AVATARS,
    );
    expect(sp.plrSlug).toBe('PLR00');
    expect(sp.plrName).toBe('あなた');
    expect(sp.chapter).toBe(5);
    expect(sp.chapterMax).toBe(20);
  });

  it('post-PLR00 chain advance (sp=0, acclen=[0]) → PLR02 美琴 / ch.0', () => {
    // The state recordSlotResult leaves after PLR00's ch.20 win
    // under Design A. The save point identity is "PLR02 lap 序章".
    const sp = getSavePointDisplay(
      makeSlot({ storyProgress: 0, avatarsClearedCh20: [0], unlockedCount: 1 }),
      TEST_AVATARS,
    );
    expect(sp.plrIdx).toBe(1);
    expect(sp.plrSlug).toBe('PLR02');
    expect(sp.plrName).toBe('美琴');
    expect(sp.chapter).toBe(0);
    expect(sp.chapterMax).toBe(20);
  });

  it('mid-PLR03-lap (sp=15, acclen=[0,1]) → PLR03 リン / ch.15', () => {
    const sp = getSavePointDisplay(
      makeSlot({
        storyProgress: 15,
        avatarsClearedCh20: [0, 1],
        unlockedCount: 2,
      }),
      TEST_AVATARS,
    );
    expect(sp.plrSlug).toBe('PLR03');
    expect(sp.plrName).toBe('リン');
    expect(sp.chapter).toBe(15);
    expect(sp.chapterMax).toBe(20);
  });

  it('chain complete, PLR01 lap 序章 (acclen=[0..19], !trueEnd) → PLR01 英霊ハルキ / ch.0 / max 21', () => {
    const sp = getSavePointDisplay(
      makeSlot({
        storyProgress: 0,
        avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
        unlockedCount: 20,
        trueEndingAchieved: false,
      }),
      TEST_AVATARS,
    );
    expect(sp.plrIdx).toBe(20);
    expect(sp.plrSlug).toBe('PLR01');
    expect(sp.plrName).toBe('英霊ハルキ');
    expect(sp.chapter).toBe(0);
    expect(sp.chapterMax).toBe(21);
  });

  it('PLR01 mid-lap (sp=15, acclen=[0..19]) → PLR01 英霊ハルキ / ch.15 / max 21', () => {
    const sp = getSavePointDisplay(
      makeSlot({
        storyProgress: 15,
        avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
        unlockedCount: 20,
        trueEndingAchieved: false,
      }),
      TEST_AVATARS,
    );
    expect(sp.plrSlug).toBe('PLR01');
    expect(sp.chapter).toBe(15);
    expect(sp.chapterMax).toBe(21);
  });

  it('true ending achieved (any sp) → PLR01 英霊ハルキ / ch.21 / max 21', () => {
    const sp = getSavePointDisplay(
      makeSlot({
        storyProgress: 20,
        avatarsClearedCh20: Array.from({ length: 20 }, (_, i) => i),
        unlockedCount: 20,
        trueEndingAchieved: true,
      }),
      TEST_AVATARS,
    );
    expect(sp.plrSlug).toBe('PLR01');
    expect(sp.plrName).toBe('英霊ハルキ');
    expect(sp.chapter).toBe(21);
    expect(sp.chapterMax).toBe(21);
  });
});
