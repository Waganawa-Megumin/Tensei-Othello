/**
 * Story-mode intro coordinator. Walks the player through up to four
 * full-screen scenes before handing off to the actual match:
 *
 *   1. PrologueScreen      — classroom-collapse opening (first run only)
 *   2. FallingScreen       — falling key visual + god voice (first run only)
 *   3. ArrivalScreen       — Bansho Sekai arrival prose (first run only)
 *   4. ChapterIntroScreen  — chapter card + boss line (every chapter)
 *
 * `firstTime` collapses the sequence to step 4 only — used for every
 * chapter beyond the first, and for re-entries to chapter 1 after the
 * slot has already booked any match.
 *
 * On step 4's "begin the match →" tap we call `onStart` and the App
 * shell takes over (mode, reset, screen='game').
 */
import { useState } from 'react';
import type { Messages, Locale } from '../../i18n/messages';
import { PrologueScreen } from './PrologueScreen';
import { FallingScreen } from './FallingScreen';
import { ArrivalScreen } from './ArrivalScreen';
import { ChapterIntroScreen } from './ChapterIntroScreen';

interface Opponent {
  name: string;
  name_en: string;
  level: number;
  chapterArtBase?: string;
}

type Step = 'prologue' | 'falling' | 'arrival' | 'chapter';

interface Props {
  t: Messages;
  locale: Locale;
  /** Iff true, plays the full prologue → falling → arrival → chapter
   *  sequence. Otherwise jumps straight to the chapter card. */
  firstTime: boolean;
  /** 1-indexed chapter (= opponent level). */
  chapter: number;
  opponent: Opponent;
  /** Fired when each prologue-side overlay is fully dismissed. The
   *  caller uses these to bookkeep `markOverlaySeen` so the scene
   *  archive picks them up. */
  onPrologueSeen?: () => void;
  /** Player tapped "begin the match →" on the chapter card. */
  onStart: () => void;
}

export function IntroSequence({
  t,
  locale,
  firstTime,
  chapter,
  opponent,
  onPrologueSeen,
  onStart,
}: Props) {
  const [step, setStep] = useState<Step>(firstTime ? 'prologue' : 'chapter');

  switch (step) {
    case 'prologue':
      return (
        <PrologueScreen
          t={t}
          onNext={() => {
            onPrologueSeen?.();
            setStep('falling');
          }}
        />
      );
    case 'falling':
      return <FallingScreen t={t} onNext={() => setStep('arrival')} />;
    case 'arrival':
      return <ArrivalScreen t={t} onNext={() => setStep('chapter')} />;
    case 'chapter':
      return (
        <ChapterIntroScreen
          t={t}
          locale={locale}
          chapter={chapter}
          opponent={opponent}
          onStart={onStart}
        />
      );
  }
}
