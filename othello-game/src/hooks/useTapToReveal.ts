import { useCallback, useState } from 'react';

/**
 * Drives the two-phase "art-only → art + text" flip used by the
 * intro flow's PrologueScreen / FallingScreen / ArrivalScreen /
 * ChapterIntroScreen. The screen renders the illustration alone with
 * a tap hint, and on first tap anywhere it transitions to a darker
 * vignette + text card. The screen-level button takes over from there
 * to advance to the next step.
 */
export type ScreenPhase = 'art-only' | 'art-with-text';

export function useTapToReveal() {
  const [phase, setPhase] = useState<ScreenPhase>('art-only');
  const revealText = useCallback(() => {
    setPhase('art-with-text');
  }, []);
  return {
    phase,
    revealText,
    hasRevealed: phase === 'art-with-text',
  };
}
