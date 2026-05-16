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

describe('resolveMidRouteScene — PLR04 Ren override (v0.36.71)', () => {
  it('PLR04 (idx 3) gets Ren solitude with 朽ちた異世界の道場跡 text', () => {
    const scene = resolveMidRouteScene(story, 3, 'solitude');
    expect(scene.title).toContain('朽ちた異世界の道場跡');
    expect(scene.text).toContain('蓮');
  });

  it('PLR04 allies references 桜林の頂 + 共鳴の輪', () => {
    const scene = resolveMidRouteScene(story, 3, 'allies');
    expect(scene.title).toContain('桜林');
    expect(scene.title).toContain('共鳴の輪');
  });

  it('PLR04 final references 19 達人の集結', () => {
    const scene = resolveMidRouteScene(story, 3, 'final');
    expect(scene.title).toContain('19 達人の集結');
  });

  it('PLR04 scenes carry imageBasePath pointing at PLR04_ren/', () => {
    expect(resolveMidRouteScene(story, 3, 'solitude').imageBasePath)
      .toBe('PLR04_ren/solitude');
    expect(resolveMidRouteScene(story, 3, 'allies').imageBasePath)
      .toBe('PLR04_ren/allies');
    expect(resolveMidRouteScene(story, 3, 'final').imageBasePath)
      .toBe('PLR04_ren/final');
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

  it('PLR05 (idx 4, unauthored) falls back to shared default', () => {
    const scene = resolveMidRouteScene(story, 4, 'solitude');
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

  it('PLR04 (idx 3) chapter 1 returns the Ren-specific intro', () => {
    const ch = resolveChapterStory(story, 3, 1);
    expect(ch).not.toBe(story.chapterStories[0]);
    expect(ch?.intro).toContain('蓮');
  });

  it('PLR04 has all 20 chapters authored', () => {
    for (let chapter = 1; chapter <= 20; chapter++) {
      const ch = resolveChapterStory(story, 3, chapter);
      expect(ch).not.toBeNull();
      expect(ch).not.toBe(story.chapterStories[chapter - 1]);
    }
  });

  // v0.36.73 — guard against the regression where the rendering
  // layer (ChapterIntroScreen / GameOver modal / chapter browser)
  // bypassed the resolver and read default `chapterStories` directly,
  // making every non-PLR00 player hear "ハルキくん" lines from every
  // boss. Confirms the per-PLR override actually replaces every
  // user-visible dialogue field, not just `intro`.
  it('PLR00 (default) Ch.1 dialogue addresses ハルキ', () => {
    const ch = resolveChapterStory(story, 0, 1);
    expect(ch?.bossPre).toContain('ハルキ');
  });

  it('PLR02 (Mikoto) Ch.1 dialogue addresses 美琴, NOT ハルキ', () => {
    const ch = resolveChapterStory(story, 1, 1);
    expect(ch?.bossPre).toContain('美琴');
    expect(ch?.bossPre).not.toContain('ハルキ');
    expect(ch?.victoryDialogue).not.toContain('ハルキ');
  });

  it('PLR03 (Rin) Ch.1 dialogue addresses リン, NOT ハルキ', () => {
    const ch = resolveChapterStory(story, 2, 1);
    expect(ch?.bossPre).toContain('リン');
    expect(ch?.bossPre).not.toContain('ハルキ');
    expect(ch?.victoryDialogue).not.toContain('ハルキ');
  });

  it('PLR04 (Ren) Ch.1 dialogue addresses 蓮, NOT ハルキ', () => {
    const ch = resolveChapterStory(story, 3, 1);
    expect(ch?.bossPre).toContain('蓮');
    expect(ch?.bossPre).not.toContain('ハルキ');
    expect(ch?.victoryDialogue).not.toContain('ハルキ');
  });

  it('PLR05 (idx 4, unauthored) chapter 1 falls back to shared default', () => {
    const ch = resolveChapterStory(story, 4, 1);
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

  it('PLR04 (idx 3) returns the Ren-flavored prologue', () => {
    const p = resolvePrologueContent(story, 3);
    expect(p.title).toContain('無刀館');
    expect(p.startButton).toContain('白井一刀流');
    expect(p.text).toContain('蓮');
  });

  it('PLR04 carries imageBasePaths for all 5 intro scenes', () => {
    const p = resolvePrologueContent(story, 3);
    expect(p.imageBasePaths?.prologue).toBe('PLR04_ren/prologue');
    expect(p.imageBasePaths?.encount).toBe('PLR04_ren/encount');
    expect(p.imageBasePaths?.arrival).toBe('PLR04_ren/arrival');
    expect(p.imageBasePaths?.gatewayClosed).toBe('PLR04_ren/gateway-closed');
    expect(p.imageBasePaths?.gatewayOpen).toBe('PLR04_ren/gateway-open');
  });

  it('PLR05 (idx 4, unauthored) falls back to shared prologue', () => {
    const p = resolvePrologueContent(story, 4);
    expect(p).toBe(story.prologue);
  });

  // v0.36.76 — regression guard for the intro chain. ChatGPT-side
  // scenario authority report (INTRO_CHAIN_FIX_REQUEST.md, 2026-05-15)
  // reminded us that PLR00 default / PLR02 / PLR03 all expect the
  // standard 5-step intro chain (`prologue → encount → arrival →
  // gatewayClosed → gatewayOpen → chapter`); only PLR04 carries a
  // bespoke ordering. Make this contract explicit at the resolver
  // boundary so a future "skip intro chain" override added by mistake
  // gets caught by tests rather than by user reports.
  it('PLR00 (default) prologue leaves introStepOrder undefined (= legacy 5-step)', () => {
    const p = resolvePrologueContent(story, 0);
    expect(p.introStepOrder).toBeUndefined();
  });

  it('PLR02 (Mikoto) prologue leaves introStepOrder undefined (= legacy 5-step)', () => {
    const p = resolvePrologueContent(story, 1);
    expect(p.introStepOrder).toBeUndefined();
  });

  it('PLR03 (Rin) prologue declares introStepOrder = "arrival-first"', () => {
    // v0.36.77 — Rin's encount art depicts the first-opponent meeting
    // (not a falling beat), so the chain matches PLR04 Ren's order:
    // prologue → arrival → gatewayClosed → gatewayOpen → encount → chapter.
    const p = resolvePrologueContent(story, 2);
    expect(p.introStepOrder).toBe('arrival-first');
  });

  it('PLR04 (Ren) prologue declares introStepOrder = "arrival-first"', () => {
    const p = resolvePrologueContent(story, 3);
    expect(p.introStepOrder).toBe('arrival-first');
  });

  it('PLR03 carries imageBasePaths for all 5 intro scenes', () => {
    const p = resolvePrologueContent(story, 2);
    expect(p.imageBasePaths?.prologue).toBe('PLR03_rin/prologue');
    expect(p.imageBasePaths?.encount).toBe('PLR03_rin/encount');
    expect(p.imageBasePaths?.arrival).toBe('PLR03_rin/arrival');
    expect(p.imageBasePaths?.gatewayClosed).toBe('PLR03_rin/gateway-closed');
    expect(p.imageBasePaths?.gatewayOpen).toBe('PLR03_rin/gateway-open');
  });
});
