/**
 * Coverage for the per-PLR story content resolvers (v0.36.55).
 *
 * The resolvers walk an override → shared fallback chain so that each
 * PLR's tab in the scene archive (and live in-game overlays) can opt
 * into per-PLR text without requiring all 21 PLRs to author their own
 * content. This test pins down:
 *
 *   - PLR02 (idx 1) gets the Mikoto-flavored solitude/allies/final +
 *     chainStepEnding from `narrativeByPlr[1]` / `chainStepEndingByPlr[1]`
 *   - PLR00 (idx 0) and any other unauthored PLR fall back to the
 *     shared default `narrative.*` and `chainStepEnding`
 *   - PLR01 (idx 20) gets the canonical `endingFull` from
 *     resolveEndingScene, regardless of any override
 *   - resolveChapterStory + resolvePrologueContent fall back to shared
 *     content when no override is authored (= every PLR today since
 *     v0.36.55 only ships narrativeByPlr + chainStepEndingByPlr for
 *     Mikoto)
 */

import { describe, expect, it } from 'vitest';
import { messages } from '../../messages';
import {
  resolveChapterStory,
  resolveEndingScene,
  resolveMidRouteScene,
  resolvePrologueContent,
} from '../resolve';

const story = messages.ja.story;

describe('resolveMidRouteScene — PLR02 Mikoto override (v0.36.55)', () => {
  it('PLR02 (idx 1) gets Mikoto solitude with cathedral-library text', () => {
    const scene = resolveMidRouteScene(story, 1, 'solitude');
    expect(scene.title).toContain('大聖堂図書館');
    expect(scene.text).toContain('論理と魔法は同じ');
  });

  it('PLR02 allies references 達人達の定理', () => {
    const scene = resolveMidRouteScene(story, 1, 'allies');
    expect(scene.title).toContain('達人たちの定理');
  });

  it('PLR02 final references 最終定理', () => {
    const scene = resolveMidRouteScene(story, 1, 'final');
    expect(scene.title).toContain('最終定理');
  });

  it('PLR02 scenes carry imageBasePath pointing at PLR02_mikoto/', () => {
    expect(resolveMidRouteScene(story, 1, 'solitude').imageBasePath)
      .toBe('PLR02_mikoto/solitude');
    expect(resolveMidRouteScene(story, 1, 'allies').imageBasePath)
      .toBe('PLR02_mikoto/allies');
    expect(resolveMidRouteScene(story, 1, 'final').imageBasePath)
      .toBe('PLR02_mikoto/final');
  });
});

describe('resolveMidRouteScene — PLR03 Rin override (v0.36.58)', () => {
  it('PLR03 (idx 2) gets Rin solitude with HUD-floating-space text', () => {
    const scene = resolveMidRouteScene(story, 2, 'solitude');
    expect(scene.title).toContain('HUD');
    expect(scene.text).toContain('レイ');
  });

  it('PLR03 allies references HUD 会議室 + 同志', () => {
    const scene = resolveMidRouteScene(story, 2, 'allies');
    expect(scene.title).toContain('HUD');
    expect(scene.title).toContain('同志');
  });

  it('PLR03 final references 最終ステージ前', () => {
    const scene = resolveMidRouteScene(story, 2, 'final');
    expect(scene.title).toContain('最終ステージ前');
  });

  it('PLR03 scenes carry imageBasePath pointing at PLR03_rin/', () => {
    expect(resolveMidRouteScene(story, 2, 'solitude').imageBasePath)
      .toBe('PLR03_rin/solitude');
    expect(resolveMidRouteScene(story, 2, 'allies').imageBasePath)
      .toBe('PLR03_rin/allies');
    expect(resolveMidRouteScene(story, 2, 'final').imageBasePath)
      .toBe('PLR03_rin/final');
  });
});

describe('resolveMidRouteScene — fallback to shared default', () => {
  it('PLR00 (idx 0) falls back to shared narrative.solitude', () => {
    const scene = resolveMidRouteScene(story, 0, 'solitude');
    expect(scene.title).toBe(story.narrative.solitude.title);
    expect(scene.text).toBe(story.narrative.solitude.text);
    // Shared scenes don't carry imageBasePath (not yet authored).
    expect(scene.imageBasePath).toBeUndefined();
  });

  it('PLR04 (idx 3, unauthored) falls back to shared default', () => {
    const scene = resolveMidRouteScene(story, 3, 'solitude');
    expect(scene).toEqual(story.narrative.solitude);
  });

  it('PLR01 (idx 20) falls back to shared narrative.final', () => {
    const scene = resolveMidRouteScene(story, 20, 'final');
    expect(scene).toEqual(story.narrative.final);
  });
});

describe('resolveEndingScene — chain-step PLRs vs PLR01', () => {
  it('PLR02 gets the Mikoto chainStepEnding override', () => {
    const scene = resolveEndingScene(story, 1);
    expect(scene.title).toContain('論理魔導');
    expect(scene.imageBasePath).toBe('PLR02_mikoto/ending');
  });

  it('PLR03 gets the Rin chainStepEnding (Data Tactics 起動)', () => {
    const scene = resolveEndingScene(story, 2);
    expect(scene.title).toContain('データ・タクティクス');
    // imageBasePath may or may not be present depending on patch shape
    // (PLR03 patch did not set imageBasePath on chainStepEnding entry).
  });

  it('PLR00 falls back to shared chainStepEnding', () => {
    const scene = resolveEndingScene(story, 0);
    expect(scene).toEqual(story.chainStepEnding);
  });

  it('PLR01 (idx 20) always returns endingFull (not chainStepEnding)', () => {
    const scene = resolveEndingScene(story, 20);
    expect(scene).toEqual(story.endingFull);
  });
});

describe('resolveChapterStory — PLR02 chapter override (v0.36.57)', () => {
  it('PLR02 (idx 1) chapter 1 returns the Mikoto-specific intro', () => {
    const ch = resolveChapterStory(story, 1, 1);
    // Mikoto's ch.1 narrative places her on a stage with
    // 「ステージの真ん中」 phrasing — distinct from PLR00 Haruki's.
    expect(ch).not.toBe(story.chapterStories[0]);
    expect(ch?.intro).toContain('美琴');
  });

  it('PLR02 has all 20 chapters authored', () => {
    for (let chapter = 1; chapter <= 20; chapter++) {
      const ch = resolveChapterStory(story, 1, chapter);
      expect(ch).not.toBeNull();
      expect(ch).not.toBe(story.chapterStories[chapter - 1]);
    }
  });

  it('PLR00 (idx 0) chapter 1 falls back to shared chapterStories[0]', () => {
    const ch = resolveChapterStory(story, 0, 1);
    expect(ch).toBe(story.chapterStories[0]);
  });

  it('PLR03 (idx 2) chapter 1 returns the Rin-specific intro', () => {
    const ch = resolveChapterStory(story, 2, 1);
    expect(ch).not.toBe(story.chapterStories[0]);
    expect(ch?.intro).toContain('リン');
  });

  it('PLR03 has all 20 chapters authored', () => {
    for (let chapter = 1; chapter <= 20; chapter++) {
      const ch = resolveChapterStory(story, 2, chapter);
      expect(ch).not.toBeNull();
      expect(ch).not.toBe(story.chapterStories[chapter - 1]);
    }
  });

  it('PLR04 (idx 3, unauthored) chapter 1 falls back to shared default', () => {
    const ch = resolveChapterStory(story, 3, 1);
    expect(ch).toBe(story.chapterStories[0]);
  });
});

describe('resolvePrologueContent — PLR02 intro chain override (v0.36.56-57)', () => {
  it('PLR02 (idx 1) returns the Mikoto-flavored prologue', () => {
    const p = resolvePrologueContent(story, 1);
    // v0.36.57 で本文を Seitoshoin Academy / 禁書区画 ロアに刷新。
    expect(p.title).toContain('学府の夜');
    expect(p.tagline).toContain('論理は世界を写す');
    expect(p.text).toContain('聖図書院学園');
    expect(p.text).toContain('Bansho Sekai');
    expect(p.startButton).toContain('論理魔導');
  });

  it('PLR02 carries imageBasePaths for all 5 intro scenes', () => {
    const p = resolvePrologueContent(story, 1);
    expect(p.imageBasePaths?.prologue).toBe('PLR02_mikoto/prologue');
    expect(p.imageBasePaths?.encount).toBe('PLR02_mikoto/encount');
    expect(p.imageBasePaths?.arrival).toBe('PLR02_mikoto/arrival');
    expect(p.imageBasePaths?.gatewayClosed).toBe('PLR02_mikoto/gateway-closed');
    expect(p.imageBasePaths?.gatewayOpen).toBe('PLR02_mikoto/gateway-open');
  });

  it('PLR00 (idx 0) falls back to shared prologue (= world default)', () => {
    const p = resolvePrologueContent(story, 0);
    expect(p).toBe(story.prologue);
    expect(p.imageBasePaths).toBeUndefined();
  });

  it('PLR03 (idx 2) returns the Rin-flavored prologue', () => {
    const p = resolvePrologueContent(story, 2);
    expect(p.title).toContain('LOST FRONTIER');
    expect(p.startButton).toContain('データ・タクティクス');
    expect(p.text).toContain('リン');
  });

  it('PLR04 (idx 3, unauthored) falls back to shared prologue', () => {
    const p = resolvePrologueContent(story, 3);
    expect(p).toBe(story.prologue);
  });
});
