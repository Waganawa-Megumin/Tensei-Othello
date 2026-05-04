/**
 * Generic full-screen overlay for the mid-route narrative inserts
 * (solitude / allies / final) and the ending finale. Same shape as
 * PrologueOverlay but parameterised by `imageBaseName` so it can map
 * to /illustrations/{name}-{landscape,portrait}.png.
 *
 * Tap-anywhere or the dismiss button to advance. Only the parent
 * decides when to record the overlay as seen — this component just
 * fires `onDismiss`.
 */
import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { renderEmphasized } from '../i18n/story/render';
import type { NarrativeScene } from '../i18n/story';

interface NarrativeOverlayProps {
  scene: NarrativeScene;
  /** Filename stem under `/illustrations/` (no extension, no
   *  orientation suffix). e.g. 'solitude' / 'allies' / 'final' / 'ending'. */
  imageBaseName: string;
  /** Localised dismiss-button label (typically t.close or 「次へ」). */
  dismissLabel: string;
  onDismiss: () => void;
  /** Tone label shown above the title — "Interlude" / "幕間" etc.
   *  Optional; falls back to a neutral ornament line. */
  tone?: string;
}

export function NarrativeOverlay({
  scene,
  imageBaseName,
  dismissLabel,
  onDismiss,
  tone,
}: NarrativeOverlayProps) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const imgSrc = `${import.meta.env.BASE_URL}illustrations/${imageBaseName}-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={scene.title}
    >
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
            'linear-gradient(180deg, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.68) 40%, rgba(10,8,5,0.94) 100%)',
        }}
      />

      <div className="relative min-h-full flex flex-col items-center justify-center px-5 py-10 max-w-2xl mx-auto">
        <div className="latin-display italic ornament text-amber-200/55 text-[10px] tracking-[0.4em] uppercase mb-3">
          — {tone ?? 'Interlude'} —
        </div>
        <h2 className="jp-display text-amber-100 text-xl md:text-2xl tracking-wider text-center mb-6 leading-snug">
          {renderEmphasized(scene.title)}
        </h2>
        <div className="jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line max-w-prose mb-8">
          {renderEmphasized(scene.text)}
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
