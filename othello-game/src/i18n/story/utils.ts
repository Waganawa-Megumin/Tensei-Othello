/**
 * Shared authoring helpers for story content.
 *
 * `ch()` builds a ChapterStory from either positional args (PLR02 style,
 * keeps line count low for nested template literals) or an object
 * literal (PLR03/PLR04 style, named fields easier to scan). Both forms
 * produce the same shape — the helper lets each author pick whichever
 * reads more cleanly per-chapter.
 */
import type { ChapterStory } from './types';

export function ch(
  intro: string,
  bossPre: string,
  bossPost: string,
  victoryDialogue: string,
  victoryNarration: string,
): ChapterStory;
export function ch(obj: ChapterStory): ChapterStory;
export function ch(
  introOrObj: string | ChapterStory,
  bossPre?: string,
  bossPost?: string,
  victoryDialogue?: string,
  victoryNarration?: string,
): ChapterStory {
  if (typeof introOrObj !== 'string') return introOrObj;
  return {
    intro: introOrObj,
    bossPre: bossPre as string,
    bossPost: bossPost as string,
    victoryDialogue: victoryDialogue as string,
    victoryNarration: victoryNarration as string,
  };
}
