/**
 * Story-mode intro coordinator. Walks the player through up to six
 * full-screen scenes before handing off to the actual match. The
 * exact ordering is driven by `prologue.introStepOrder`:
 *
 *   'legacy' (default — PLR00 / PLR02 / PLR03):
 *     1. PrologueScreen       — opening cinematic (real-world trigger)
 *     2. FallingScreen        — encount key visual + god voice
 *     3. ArrivalScreen        — Bansho Sekai arrival prose
 *     4. GatewayClosedScreen  — sealed gateway encounter
 *     5. GatewayOpenScreen    — gateway bursts open
 *     6. ChapterIntroScreen   — chapter card + boss line
 *
 *   'arrival-first' (PLR04 onwards whose prologue already lands them):
 *     1. PrologueScreen       — opening cinematic (real-world trigger
 *                                + fall already concluded inline)
 *     2. ArrivalScreen        — Bansho Sekai arrival prose
 *     3. GatewayClosedScreen  — sealed gateway encounter
 *     4. GatewayOpenScreen    — gateway bursts open
 *     5. FallingScreen        — encount key visual (now framed as the
 *                                first-opponent encounter rather than
 *                                a falling beat)
 *     6. ChapterIntroScreen   — chapter card + boss line
 *
 * `firstTime` collapses the sequence to the chapter card only — used
 * for every chapter beyond the first, and for re-entries past Ch.1.
 *
 * On the final step's "begin the match →" tap we call `onStart` and
 * the App shell takes over (mode, reset, screen='game').
 */
import { useState } from 'react';
import type { Messages, Locale } from '../../i18n/messages';
import type { PrologueContent } from '../../i18n/story';
import { PrologueScreen } from './PrologueScreen';
import { FallingScreen } from './FallingScreen';
import { ArrivalScreen } from './ArrivalScreen';
import { GatewayClosedScreen } from './GatewayClosedScreen';
import { GatewayOpenScreen } from './GatewayOpenScreen';
import { ChapterIntroScreen } from './ChapterIntroScreen';

interface Opponent {
  name: string;
  name_en: string;
  level: number;
  chapterArtBase?: string;
}

type Step =
  | 'prologue'
  | 'encount'
  | 'arrival'
  | 'gateway-closed'
  | 'gateway-open'
  | 'chapter';

const LEGACY_STEPS: ReadonlyArray<Step> = [
  'prologue',
  'encount',
  'arrival',
  'gateway-closed',
  'gateway-open',
  'chapter',
];

const ARRIVAL_FIRST_STEPS: ReadonlyArray<Step> = [
  'prologue',
  'arrival',
  'gateway-closed',
  'gateway-open',
  'encount',
  'chapter',
];

interface Props {
  t: Messages;
  locale: Locale;
  /** Iff true, plays the full intro sequence. Otherwise jumps
   *  straight to the chapter card. */
  firstTime: boolean;
  /** 1-indexed chapter (= opponent level). */
  chapter: number;
  opponent: Opponent;
  /** AVATARS index of the active PLR. Threaded through to
   *  `ChapterIntroScreen` so the chapter card resolves the correct
   *  per-PLR boss line (e.g., PLR02 美琴 hears Mikoto-specific
   *  bossPre, not the PLR00 ハルキ default). (v0.36.73) */
  plrIdx: number;
  /** Fired when the prologue step (= the first beat) is dismissed.
   *  The caller uses this to bookkeep `markOverlaySeen` so the scene
   *  archive picks it up. */
  onPrologueSeen?: () => void;
  /** Player tapped "begin the match →" on the chapter card. */
  onStart: () => void;
  /** Per-PLR resolved prologue content (text + illustration overrides).
   *  When present, every intro screen receives it and uses the
   *  PLR-specific assets/text where authored. (v0.36.56) */
  prologue?: PrologueContent;
}

export function IntroSequence({
  t,
  locale,
  firstTime,
  chapter,
  opponent,
  plrIdx,
  onPrologueSeen,
  onStart,
  prologue,
}: Props) {
  const steps =
    prologue?.introStepOrder === 'arrival-first'
      ? ARRIVAL_FIRST_STEPS
      : LEGACY_STEPS;

  const [idx, setIdx] = useState<number>(
    firstTime ? 0 : steps.length - 1,
  );

  const step = steps[idx];
  const advance = () => setIdx((i) => Math.min(i + 1, steps.length - 1));

  switch (step) {
    case 'prologue':
      return (
        <PrologueScreen
          t={t}
          prologue={prologue}
          onNext={() => {
            onPrologueSeen?.();
            advance();
          }}
        />
      );
    case 'encount':
      return <FallingScreen t={t} prologue={prologue} onNext={advance} />;
    case 'arrival':
      return <ArrivalScreen t={t} prologue={prologue} onNext={advance} />;
    case 'gateway-closed':
      return <GatewayClosedScreen t={t} prologue={prologue} onNext={advance} />;
    case 'gateway-open':
      return <GatewayOpenScreen t={t} prologue={prologue} onNext={advance} />;
    case 'chapter':
      return (
        <ChapterIntroScreen
          t={t}
          locale={locale}
          chapter={chapter}
          opponent={opponent}
          plrIdx={plrIdx}
          onStart={onStart}
        />
      );
  }
}
