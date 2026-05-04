/**
 * Locale → StoryContent dispatcher.
 *
 * The story bundles live in their own files (`ja.ts` / `en.ts`) so that
 * `src/i18n/messages.ts` doesn't balloon by ~2000 lines per language.
 * This module is the single import point — `messages.ts` calls
 * `getStory(locale)` once when constructing each Messages object.
 */
import type { Locale } from '../messages';
import type { StoryContent } from './types';
import { STORY_JA } from './ja';
import { STORY_EN } from './en';

export function getStory(locale: Locale): StoryContent {
  return locale === 'ja' ? STORY_JA : STORY_EN;
}

export type { StoryContent, ChapterStory, NarrativeScene, PrologueContent } from './types';
