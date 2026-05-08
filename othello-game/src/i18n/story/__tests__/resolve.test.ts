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

describe('resolveMidRouteScene — fallback to shared default', () => {
  it('PLR00 (idx 0) falls back to shared narrative.solitude', () => {
    const scene = resolveMidRouteScene(story, 0, 'solitude');
    expect(scene.title).toBe(story.narrative.solitude.title);
    expect(scene.text).toBe(story.narrative.solitude.text);
    // Shared scenes don't carry imageBasePath (not yet authored).
    expect(scene.imageBasePath).toBeUndefined();
  });

  it('PLR03 (idx 2, unauthored) falls back to shared default', () => {
    const scene = resolveMidRouteScene(story, 2, 'solitude');
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

  it('PLR00 falls back to shared chainStepEnding', () => {
    const scene = resolveEndingScene(story, 0);
    expect(scene).toEqual(story.chainStepEnding);
  });

  it('PLR01 (idx 20) always returns endingFull (not chainStepEnding)', () => {
    const scene = resolveEndingScene(story, 20);
    expect(scene).toEqual(story.endingFull);
  });
});

describe('resolveChapterStory + resolvePrologueContent — shared fallback', () => {
  it('PLR02 chapter 1 falls back to shared chapterStories[0]', () => {
    const ch = resolveChapterStory(story, 1, 1);
    expect(ch).toBe(story.chapterStories[0]);
  });

  it('PLR02 prologue falls back to shared prologue', () => {
    const prologue = resolvePrologueContent(story, 1);
    expect(prologue).toBe(story.prologue);
  });
});
