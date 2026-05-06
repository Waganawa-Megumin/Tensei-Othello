/**
 * Step 5 of the intro flow — the door bursts open. Light, rose
 * petals, distant cheers + a glittering idol-pop teaser, all
 * backed by `gateway-open-{LS|PT}.png` (the same door geometry as
 * Step 4 but flung open with the next-world spilling through the
 * frame). Same tap-to-reveal pattern as the rest of the flow.
 *
 * The "step into the light →" button hands off to the chapter
 * card — by which point Haruki has already cracked the gods'
 * casting choices and the chapter's own Ichika reveal lands as a
 * payoff rather than a non-sequitur.
 */
import type { Messages } from '../../i18n/messages';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTapToReveal } from '../../hooks/useTapToReveal';
import { renderEmphasized } from '../../i18n/story/render';
import { TapHint } from './TapHint';

interface Props {
  t: Messages;
  onNext: () => void;
  /** See PrologueScreen — overrides the bottom button label for
   *  archive replay use. */
  nextLabel?: string;
}

export function GatewayOpenScreen({ t, onNext, nextLabel }: Props) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const bgSrc = `${import.meta.env.BASE_URL}illustrations/gateway-open-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;
  const { revealText, hasRevealed } = useTapToReveal();

  return (
    <div
      onClick={() => !hasRevealed && revealText()}
      className="fixed inset-0 z-[80] flex flex-col select-none cursor-pointer"
      style={{
        // The open-gateway artwork is bright (light flooding through
        // the doorframe), so the no-reveal vignette is intentionally
        // softer than the closed-door variant — we don't want to
        // crush the highlights before the player even taps.
        backgroundImage: hasRevealed
          ? `linear-gradient(rgba(10,8,5,0.45), rgba(10,8,5,0.65)), url(${bgSrc})`
          : `linear-gradient(rgba(10,8,5,0.10), rgba(10,8,5,0.20)), url(${bgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.6s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.gatewayOpenLabel}
    >
      {!hasRevealed && <TapHint label={t.intro.tapToContinue} />}
      {hasRevealed && (
        <div
          className="relative z-10 flex-1 flex flex-col justify-end px-6 py-10 max-w-2xl mx-auto w-full"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
          <div className="latin-display italic text-amber-200/65 text-[10px] tracking-[0.4em] uppercase mb-3">
            — {t.intro.gatewayOpenLabel} —
          </div>
          <div className="jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line mb-7 max-h-[55vh] overflow-y-auto pr-1">
            {renderEmphasized(t.intro.gatewayOpenText)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="self-end px-6 py-3 border border-amber-200/55 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
          >
            {nextLabel ?? t.intro.gatewayOpenButton}
          </button>
        </div>
      )}
    </div>
  );
}
