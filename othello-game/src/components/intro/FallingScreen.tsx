/**
 * Step 2 of the intro flow — falling-into-Bansho-Sekai key visual.
 *
 * Reuses the existing `prologue-{LS|PT}.png` (Haruki tumbling
 * through cosmic stones above the othello board). Both phases use
 * tap-anywhere advancement so the player can keep flowing without
 * hunting for a button:
 *
 *   Phase A: only the illustration + "▼ tap to continue" pulse.
 *            Tap reveals the god-of-this-world voice line.
 *   Phase B: voice line is overlaid on top of the illustration
 *            (NOT pushed below it — that layout pushed the line
 *            off-screen on portrait phones), and the bottom hint
 *            switches to "▼ tap to advance". Tapping anywhere then
 *            calls `onNext` to enter ArrivalScreen.
 */
import { useState } from 'react';
import type { Messages } from '../../i18n/messages';
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
      onClick={() => (hasRevealed ? onNext() : revealText())}
      className="fixed inset-0 z-[80] select-none cursor-pointer bg-[#050308] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.fallingLabel}
    >
      {/* Full-bleed key art. `object-cover` so the composition fills
          either orientation; the illustration ships in matching
          aspect ratios so it crops cleanly. */}
      {imgOk ? (
        <img
          src={imgSrc}
          alt=""
          aria-hidden
          onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: hasRevealed
              ? 'slowZoom 8s ease-out infinite alternate'
              : 'slowZoomFirst 1.6s ease-out forwards',
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center latin-display italic text-amber-200/40 text-xs tracking-[0.3em] uppercase">
          — {t.intro.fallingLabel} —
        </div>
      )}

      {/* Vignette over the key art. Light when only art is showing,
          heavier on Phase B so the overlaid voice line stays
          readable against bright corners of the illustration. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hasRevealed
            ? 'linear-gradient(180deg, rgba(10,8,5,0.40) 0%, rgba(10,8,5,0.10) 35%, rgba(10,8,5,0.82) 100%)'
            : 'linear-gradient(180deg, rgba(10,8,5,0.18) 0%, rgba(10,8,5,0.0) 50%, rgba(10,8,5,0.32) 100%)',
          transition: 'background 0.6s ease-out',
        }}
      />

      {/* Phase B: voice line overlaid above the bottom tap hint. */}
      {hasRevealed && (
        <div
          className="absolute inset-x-0 bottom-20 px-6 max-w-2xl mx-auto z-10"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
          <p
            className="jp-display text-center text-amber-100 text-base md:text-xl italic leading-relaxed"
            style={{ textShadow: '0 0 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.95)' }}
          >
            『{t.intro.fallingVoice}』
          </p>
        </div>
      )}

      {/* Bottom pulse hint — present in both phases, label switches
          on reveal so the gesture stays the same (tap anywhere). */}
      <TapHint label={hasRevealed ? t.intro.tapToAdvance : t.intro.tapToContinue} />
    </div>
  );
}
