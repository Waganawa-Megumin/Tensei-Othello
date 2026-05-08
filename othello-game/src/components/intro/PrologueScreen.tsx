/**
 * Step 1 of the multi-step intro flow — classroom-collapse prologue.
 *
 * Tap-to-reveal pattern:
 *   Phase A: only the illustration is visible (light vignette,
 *            pulsing "tap to continue" hint).
 *   Phase B: tap anywhere to fade in the prologue narration over a
 *            heavier vignette; the "continue →" button advances to
 *            FallingScreen.
 */
import type { Messages } from '../../i18n/messages';
import type { PrologueContent } from '../../i18n/story';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useResolvedIllustrationStem } from '../../hooks/useResolvedIllustrationStem';
import { useTapToReveal } from '../../hooks/useTapToReveal';
import { renderEmphasized } from '../../i18n/story/render';
import { TapHint } from './TapHint';

interface Props {
  t: Messages;
  onNext: () => void;
  /** Override for the "next step" button. Used by the title-screen
   *  archive replay so the last scene reads 「閉じる」 instead of
   *  「次のステップへ」. */
  nextLabel?: string;
  /** Per-PLR resolved prologue content (text + optional illustration
   *  overrides). Defaults to the world-level `t.story.prologue` when
   *  not provided so existing callers keep working. (v0.36.56) */
  prologue?: PrologueContent;
}

export function PrologueScreen({ t, onNext, nextLabel, prologue }: Props) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const orientation = isLandscape ? 'landscape' : 'portrait';
  const resolvedPrologue = prologue ?? t.story.prologue;
  // PrologueScreen reuses the per-PLR `prologue` art when present
  // (a single asset covers both the overlay and this intro step's
  // background). Falls back to the shared `prologue-bg` default
  // when no override is authored or the override 404s.
  const stem = useResolvedIllustrationStem(
    resolvedPrologue.imageBasePaths?.prologue ?? '_shared/prologue-bg',
    '_shared/prologue-bg',
    orientation,
  );
  const bgSrc = `${import.meta.env.BASE_URL}illustrations/${stem}-${orientation}.png`;
  const { revealText, hasRevealed } = useTapToReveal();

  return (
    <div
      onClick={() => !hasRevealed && revealText()}
      className="fixed inset-0 z-[80] flex flex-col select-none cursor-pointer"
      style={{
        backgroundImage: hasRevealed
          ? `linear-gradient(rgba(10,8,5,0.55), rgba(10,8,5,0.78)), url(${bgSrc})`
          : `linear-gradient(rgba(10,8,5,0.15), rgba(10,8,5,0.25)), url(${bgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.6s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.prologueLabel}
    >
      {!hasRevealed && <TapHint label={t.intro.tapToContinue} />}
      {hasRevealed && (
        <div
          className="relative z-10 flex-1 flex flex-col justify-end px-6 py-10 max-w-2xl mx-auto w-full"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
          <div className="latin-display italic text-amber-200/65 text-[10px] tracking-[0.4em] uppercase mb-3">
            — {t.intro.prologueLabel} —
          </div>
          <h2 className="jp-display text-amber-100 text-xl md:text-2xl tracking-wider mb-5 leading-snug">
            {renderEmphasized(resolvedPrologue.title)}
          </h2>
          <div className="jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line mb-7 max-h-[55vh] overflow-y-auto pr-1">
            {renderEmphasized(resolvedPrologue.text)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="self-end px-6 py-3 border border-amber-200/55 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
          >
            {nextLabel ?? t.intro.nextStepLabel}
          </button>
        </div>
      )}
    </div>
  );
}
