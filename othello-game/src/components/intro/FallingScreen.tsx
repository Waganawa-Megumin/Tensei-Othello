/**
 * Step 2 of the intro flow — falling-into-Bansho-Sekai key visual.
 *
 * Reuses the existing `prologue-{LS|PT}.png` (Haruki tumbling
 * through cosmic stones above the othello board). Tap reveals the
 * god-of-this-world voice line; then the "continue →" button
 * advances to ArrivalScreen.
 */
import type { Messages } from '../../i18n/messages';
import { useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTapToReveal } from '../../hooks/useTapToReveal';
import { TapHint } from './TapHint';

interface Props {
  t: Messages;
  onNext: () => void;
}

export function FallingScreen({ t, onNext }: Props) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const imgSrc = `${import.meta.env.BASE_URL}illustrations/prologue-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;
  const { revealText, hasRevealed } = useTapToReveal();

  return (
    <div
      onClick={() => !hasRevealed && revealText()}
      className="fixed inset-0 z-[80] flex flex-col select-none cursor-pointer bg-[#050308]"
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.fallingLabel}
    >
      <div className="flex-1 flex items-center justify-center p-3 md:p-6">
        {imgOk ? (
          <img
            src={imgSrc}
            alt=""
            aria-hidden
            onError={() => setImgOk(false)}
            className="max-h-full max-w-full object-contain"
            style={{
              animation: hasRevealed
                ? 'slowZoom 8s ease-out infinite alternate'
                : 'slowZoomFirst 1.6s ease-out forwards',
            }}
          />
        ) : (
          <div className="latin-display italic text-amber-200/40 text-xs tracking-[0.3em] uppercase">
            — {t.intro.fallingLabel} —
          </div>
        )}
      </div>

      {!hasRevealed && <TapHint label={t.intro.tapToContinue} />}

      {hasRevealed && (
        <div
          className="relative z-10 px-6 pb-10 pt-4 max-w-2xl mx-auto w-full"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
          <p className="jp-display text-center text-amber-200/90 text-base md:text-lg italic leading-relaxed mb-6">
            『{t.intro.fallingVoice}』
          </p>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="px-6 py-3 border border-amber-200/55 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
            >
              {t.intro.nextStepLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
