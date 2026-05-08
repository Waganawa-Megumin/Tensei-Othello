/**
 * Coverage for the per-PLR archive list builder
 * (`getOrderedArchiveScenesForPlr`).
 *
 * Specifically pins down the v0.36.55 off-by-one fix: mid-route
 * narrative inserts (solitude / allies / final) appear in the archive
 * once the **milestone** chapter is cleared (sp=10/15/19), not only
 * after the **target** chapter is cleared (sp=11/16/20). Without the
 * fix, a player at sp=19 (ch.19 cleared, ch.20 not yet won) opens the
 * archive and `narrative:final` is missing — even though the live
 * trigger fired and they explicitly saw it.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getOrderedArchiveScenesForPlr,
  markOverlaySeen,
  type ArchiveScene,
} from '../storyOverlays';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
  get length() { return this.store.size; }
  key(i: number) { return [...this.store.keys()][i] ?? null; }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: globalThis.localStorage },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  (globalThis.localStorage as unknown as MemoryStorage).clear();
});

const SLOT = 'test-slot';

function build(opts: {
  plrIdx: number;
  effectiveProgress: number;
  trueEnding?: boolean;
  voidphi?: boolean;
}): ArchiveScene[] {
  return getOrderedArchiveScenesForPlr({
    slotId: SLOT,
    plrIdx: opts.plrIdx,
    effectiveProgress: opts.effectiveProgress,
    trueEndingAchieved: opts.trueEnding ?? false,
    voidphiAwakened: opts.voidphi ?? false,
  });
}

function overlayKeys(scenes: ArchiveScene[]): string[] {
  return scenes
    .filter((s) => s.kind === 'overlay')
    .map((s) => (s as { key: string }).key);
}

describe('getOrderedArchiveScenesForPlr — mid-route off-by-one (v0.36.55)', () => {
  it('sp=10 (just cleared ch.10) shows solitude in archive', () => {
    // The live trigger fires at sp=10, so by the time the player
    // opens the archive at sp=10 they have crossed the milestone.
    // Pre-fix this required sp >= 11.
    const result = build({ plrIdx: 0, effectiveProgress: 10 });
    expect(overlayKeys(result)).toContain('narrative:solitude');
  });

  it('sp=9 (mid ch.10 lap, not yet cleared) does NOT show solitude', () => {
    const result = build({ plrIdx: 0, effectiveProgress: 9 });
    expect(overlayKeys(result)).not.toContain('narrative:solitude');
  });

  it('sp=15 shows allies; sp=14 does not', () => {
    expect(overlayKeys(build({ plrIdx: 0, effectiveProgress: 15 })))
      .toContain('narrative:allies');
    expect(overlayKeys(build({ plrIdx: 0, effectiveProgress: 14 })))
      .not.toContain('narrative:allies');
  });

  it('sp=19 shows final; sp=18 does not', () => {
    expect(overlayKeys(build({ plrIdx: 0, effectiveProgress: 19 })))
      .toContain('narrative:final');
    expect(overlayKeys(build({ plrIdx: 0, effectiveProgress: 18 })))
      .not.toContain('narrative:final');
  });

  it('chapter entries still gated on the chapter itself being cleared', () => {
    // sp=19: chapters 1..19 appear, ch.20 does not even though
    // narrative:final does (mid-route is fired BEFORE ch.20 entry).
    const result = build({ plrIdx: 0, effectiveProgress: 19 });
    const chapters = result
      .filter((s) => s.kind === 'chapter')
      .map((s) => (s as { chapter: number }).chapter);
    expect(chapters).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('full lap (eff=20) lists final BEFORE ch.20 in canonical order', () => {
    const result = build({ plrIdx: 0, effectiveProgress: 20 });
    const finalIdx = result.findIndex(
      (s) => s.kind === 'overlay' && (s as { key: string }).key === 'narrative:final',
    );
    const ch20Idx = result.findIndex(
      (s) => s.kind === 'chapter' && (s as { chapter: number }).chapter === 20,
    );
    expect(finalIdx).toBeGreaterThanOrEqual(0);
    expect(ch20Idx).toBeGreaterThanOrEqual(0);
    expect(finalIdx).toBeLessThan(ch20Idx);
  });
});

describe('getOrderedArchiveScenesForPlr — PLR01 ch.20 confrontation pair', () => {
  it('chapter20A + transition only emit when PLR01 + trueEnding', () => {
    const ks = overlayKeys(
      build({ plrIdx: 20, effectiveProgress: 20, trueEnding: true }),
    );
    expect(ks).toContain('narrative:chapter20A');
    expect(ks).toContain('narrative:chapter20Atransition');
  });

  it('non-PLR01 never gets chapter20A pair, even at full progress', () => {
    const ks = overlayKeys(
      build({ plrIdx: 0, effectiveProgress: 20, trueEnding: true }),
    );
    expect(ks).not.toContain('narrative:chapter20A');
  });
});

describe('getOrderedArchiveScenesForPlr — intro chain seen-flag gate', () => {
  it('intro chain absent until prologue seen', () => {
    const ks = overlayKeys(build({ plrIdx: 0, effectiveProgress: 5 }));
    expect(ks).not.toContain('prologue');
    expect(ks).not.toContain('intro:falling');
  });

  it('intro chain emits once prologue seen-flag is set', () => {
    markOverlaySeen(SLOT, 'prologue');
    const ks = overlayKeys(build({ plrIdx: 0, effectiveProgress: 5 }));
    expect(ks).toContain('prologue');
    expect(ks).toContain('intro:falling');
    expect(ks).toContain('intro:gatewayOpen');
  });
});
