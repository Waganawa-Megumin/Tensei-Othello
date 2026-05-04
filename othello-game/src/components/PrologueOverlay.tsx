/**
 * Full-screen prologue overlay shown the first time a save slot
 * enters story mode (storyProgress === 0). Pairs the finished
 * prologue art with the narration. tap-anywhere or "始める" to dismiss.
 *
 * Image loads from `/illustrations/prologue-{landscape,portrait}.png`
 * via useMediaQuery — falls back to text-only when the artifact is
 * missing.
 */
import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { renderEmphasized } from '../i18n/story/render';
import type { PrologueContent } from '../i18n/story';

interface PrologueOverlayProps {
  prologue: PrologueContent;
  /** Localised "Begin" label. */
  dismissLabel: string;
  onDismiss: () => void;
}

export function PrologueOverlay({ prologue, dismissLabel, onDismiss }: PrologueOverlayProps) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const imgSrc = `${import.meta.env.BASE_URL}illustrations/prologue-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={prologue.title}
    >
      {/* Background — illustration if present, falls back to dark stage */}
      {imgOk && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden
          onError={() => setImgOk(false)}
          className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.5 }}
        />
      )}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,8,5,0.85) 0%, rgba(10,8,5,0.7) 40%, rgba(10,8,5,0.92) 100%)',
        }}
      />

      <div className="relative min-h-full flex flex-col items-center justify-center px-5 py-10 max-w-2xl mx-auto">
        <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.4em] uppercase mb-3">
          — Prologue —
        </div>
        <h2 className="jp-display text-amber-100 text-xl md:text-2xl tracking-wider text-center mb-6 leading-snug">
          {renderEmphasized(prologue.title)}
        </h2>
        <div className="jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line max-w-prose mb-8">
          {renderEmphasized(prologue.text)}
        </div>
        <button
          onClick={onDismiss}
          className="px-6 py-2.5 border border-amber-200/60 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
