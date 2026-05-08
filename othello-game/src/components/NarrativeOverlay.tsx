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
  /** Default filename stem under `/illustrations/_shared/` (no
   *  extension, no orientation suffix). e.g. 'solitude' / 'allies' /
   *  'final' / 'ending'. The scene's own `imageBasePath` (when present)
   *  takes priority and is tried first; this `imageBaseName` is the
   *  shared fallback when the per-PLR asset is missing or absent. */
  imageBaseName: string;
  /** Localised dismiss-button label (typically t.close or 「次へ」). */
  dismissLabel: string;
  /** Localised "tap to continue" hint shown during phase A. */
  tapHintLabel?: string;
  onDismiss: () => void;
  /** Tone label shown above the title — "Interlude" / "幕間" etc.
   *  Optional; falls back to a neutral ornament line. */
  tone?: string;
  /** When true, this is a replay (= the player has already seen this
   *  beat in the current slot). Surfaces a top-right "skip" button
   *  during phase A so a returning player can dismiss without waiting
   *  through the tap-to-reveal beat. First-time viewers (isReplay=false)
   *  must tap through normally. */
  isReplay?: boolean;
  /** Localised label for the skip button. Falls back to 「スキップ ▶」. */
  skipLabel?: string;
}

export function NarrativeOverlay({
  scene,
  imageBaseName,
  dismissLabel,
  tapHintLabel,
  onDismiss,
  tone,
  isReplay,
  skipLabel,
}: NarrativeOverlayProps) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgErrored, setImgErrored] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const { revealText, hasRevealed } = useTapToReveal();
  const orientation = isLandscape ? 'landscape' : 'portrait';
  // Two-stage path resolution: prefer the scene-level override
  // (e.g. 'PLR02_mikoto/solitude'), fall back to the shared asset
  // (`_shared/<imageBaseName>`) when the override 404s. The fallback
  // covers the authoring window where i18n declares the override
  // before the per-PLR illustration has actually shipped.
  const primaryStem = scene.imageBasePath ?? `_shared/${imageBaseName}`;
  const fallbackStem = `_shared/${imageBaseName}`;
  const stem = usedFallback ? fallbackStem : primaryStem;
  const imgSrc = `${import.meta.env.BASE_URL}illustrations/${stem}-${orientation}.png`;
  const imgOk = !imgErrored;

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
          // Reset attempt history when the resolved URL flips (e.g.,
          // orientation change) so the primary stem is retried.
          key={imgSrc}
          src={imgSrc}
          alt=""
          aria-hidden
          onError={() => {
            // First failure: retry against the shared fallback. Second
            // failure (= shared asset is also missing): give up and
            // hide the image, the prose still renders cleanly.
            if (!usedFallback && primaryStem !== fallbackStem) {
              setUsedFallback(true);
            } else {
              setImgErrored(true);
            }
          }}
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

      {/* Skip button — replay-only, phase A only. Lets a returning
          player dismiss the beat without waiting through the
          tap-to-reveal cadence. First-time viewers tap through
          normally. */}
      {isReplay && !hasRevealed && (
        <button
          type="button"
          aria-label={skipLabel ?? 'スキップ'}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-3 right-3 z-[80] px-3 py-1.5 border border-amber-200/40 hover:border-amber-200 text-amber-100 text-xs jp-display tracking-wider rounded-sm bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors"
        >
          {skipLabel ?? 'スキップ ▶'}
        </button>
      )}

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
