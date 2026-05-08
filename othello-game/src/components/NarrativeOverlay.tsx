/**
 * Generic full-screen overlay for the mid-route narrative inserts
 * (solitude / allies / final), the ending finale, and the true-
 * ending epilogues. Same layout as PrologueScreen / ArrivalScreen:
 *
 *   Phase A: only the illustration is visible (light vignette,
 *            pulsing "tap to continue" hint).
 *   Phase B: tap anywhere to fade in the narration over a heavier
 *            vignette; the "next/close" button advances.
 *
 * Tap-to-reveal mirrors the in-game intro flow so the archive
 * playback feels identical to the first time the player encountered
 * the scene during the run.
 */
import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTapToReveal } from '../hooks/useTapToReveal';
import { renderEmphasized } from '../i18n/story/render';
import { TapHint } from './intro/TapHint';
import type { NarrativeScene } from '../i18n/story';

interface NarrativeOverlayProps {
  scene: NarrativeScene;
  /** Filename stem under `/illustrations/` (no extension, no
   *  orientation suffix). e.g. 'solitude' / 'allies' / 'final' / 'ending'. */
  imageBaseName: string;
  /** Localised dismiss-button label (typically t.close or 「次へ」). */
  dismissLabel: string;
  /** Localised "tap to continue" hint shown during phase A. */
  tapHintLabel?: string;
  onDismiss: () => void;
  /** Tone label shown above the title — "Interlude" / "幕間" etc.
   *  Optional; falls back to a neutral ornament line. */
  tone?: string;
}

export function NarrativeOverlay({
  scene,
  imageBaseName,
  dismissLabel,
  tapHintLabel,
  onDismiss,
  tone,
}: NarrativeOverlayProps) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const { revealText, hasRevealed } = useTapToReveal();
  const imgSrc = `${import.meta.env.BASE_URL}illustrations/_shared/${imageBaseName}-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;

  return (
    <div
      onClick={() => !hasRevealed && revealText()}
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0a0805] select-none cursor-pointer"
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
          style={{
            opacity: hasRevealed ? 0.55 : 0.95,
            transition: 'opacity 0.6s ease-out',
          }}
        />
      )}
      {/* Vignette — light during phase A so the art reads cleanly,
          heavier during phase B so the prose stays legible against
          bright corners of the illustration. */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: hasRevealed
            ? 'linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.35) 40%, rgba(10,8,5,0.7) 100%)'
            : 'linear-gradient(180deg, rgba(10,8,5,0.18) 0%, rgba(10,8,5,0.0) 50%, rgba(10,8,5,0.32) 100%)',
          transition: 'background 0.6s ease-out',
        }}
      />

      {!hasRevealed && <TapHint label={tapHintLabel ?? 'tap to reveal'} />}

      {hasRevealed && (
        <div
          className="relative min-h-full flex flex-col items-center justify-center px-5 py-10 max-w-2xl mx-auto"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
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
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="px-6 py-2.5 border border-amber-200/60 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
          >
            {dismissLabel}
          </button>
        </div>
      )}
    </div>
  );
}
