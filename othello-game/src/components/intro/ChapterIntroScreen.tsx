/**
 * Step 4 of the intro flow — chapter setup card. Used for both the
 * first-ever chapter (Ch.1, after Steps 1-3) and every subsequent
 * chapter (the only step rendered when the IntroSequence's first-
 * time guard returns false).
 *
 * Tap-to-reveal pattern:
 *   Phase A: chapter art alone with the chapter ornament + opponent
 *            name pinned to the top, plus the bottom tap hint.
 *   Phase B: tap reveals the chapter intro narration + the boss's
 *            pre-match line, followed by the "begin the match →"
 *            button that hands control back to App via `onStart`.
 */
import { useState } from 'react';
import type { Messages, Locale } from '../../i18n/messages';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTapToReveal } from '../../hooks/useTapToReveal';
import { renderEmphasized } from '../../i18n/story/render';
import { TapHint } from './TapHint';

interface Opponent {
  name: string;
  name_en: string;
  level: number;
  chapterArtBase?: string;
}

interface Props {
  t: Messages;
  locale: Locale;
  /** 1-indexed chapter (= opponent level). */
  chapter: number;
  opponent: Opponent;
  onStart: () => void;
}

export function ChapterIntroScreen({
  t,
  locale,
  chapter,
  opponent,
  onStart,
}: Props) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const story = t.story.chapterStories[chapter - 1];
  const oppName = locale === 'ja' ? opponent.name : opponent.name_en;
  const chapterArtSrc = opponent.chapterArtBase
    ? `${import.meta.env.BASE_URL}${opponent.chapterArtBase}-${
        isLandscape ? 'landscape' : 'portrait'
      }.png`
    : null;
  const { revealText, hasRevealed } = useTapToReveal();

  // Background uses the chapter art; falls back to plain stage-bg
  // when the asset is missing or fails to load (`imgOk=false`).
  const bgImage =
    chapterArtSrc && imgOk
      ? hasRevealed
        ? `linear-gradient(rgba(10,8,5,0.6), rgba(10,8,5,0.82)), url(${chapterArtSrc})`
        : `linear-gradient(rgba(10,8,5,0.18), rgba(10,8,5,0.32)), url(${chapterArtSrc})`
      : 'linear-gradient(180deg, #2a2412 0%, #1c1810 100%)';

  return (
    <div
      onClick={() => !hasRevealed && revealText()}
      className="fixed inset-0 z-[80] flex flex-col select-none cursor-pointer"
      style={{
        backgroundImage: bgImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.6s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.intro.chapterLabel(chapter)} — ${oppName}`}
    >
      {/* Hidden img used only to detect 404 → fall back to stage-bg. */}
      {chapterArtSrc && imgOk && (
        <img
          src={chapterArtSrc}
          alt=""
          aria-hidden
          className="hidden"
          onError={() => setImgOk(false)}
        />
      )}

      {/* Top-pinned chapter ornament — visible in both phases so the
          player knows *which* chapter they're about to enter even
          before reading the prose. The single-kanji handle (e.g. 苺
          for いちか) is a compact UI shorthand used on avatar badges
          and the like; on a full-screen chapter card it just floats
          there without context, so we omit it. */}
      <div className="absolute top-0 left-0 right-0 text-center pt-7 pointer-events-none">
        <div className="latin-display italic text-amber-200/75 text-[11px] tracking-[0.4em] uppercase">
          — {t.intro.chapterLabel(chapter)} —
        </div>
        <h2
          className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.2em] mt-1.5"
          style={{ textShadow: '0 0 18px rgba(0,0,0,0.85)' }}
        >
          {oppName}
        </h2>
      </div>

      {!hasRevealed && <TapHint label={t.intro.tapToContinue} />}

      {hasRevealed && (
        <div
          className="relative z-10 flex-1 flex flex-col justify-end px-6 py-10 max-w-2xl mx-auto w-full"
          style={{ animation: 'textFadeIn 0.6s ease-out' }}
        >
          {story && (
            <>
              <div className="jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line mb-4 max-h-[40vh] overflow-y-auto pr-1">
                {renderEmphasized(story.intro)}
              </div>
              <p className="jp-display italic text-amber-100/95 text-sm md:text-base leading-relaxed mb-6 px-3 border-l-2 border-amber-200/40">
                「{renderEmphasized(story.bossPre)}」 — {oppName}
              </p>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="self-center px-7 py-3 border border-amber-200 text-amber-100 bg-amber-200/[0.08] hover:bg-amber-200/[0.14] rounded-sm jp-display tracking-wider transition-colors"
          >
            {t.intro.startBattleLabel}
          </button>
        </div>
      )}
    </div>
  );
}
