import { useState } from 'react';
import { Sparkles, Swords, Users } from 'lucide-react';
import type { Locale, Messages } from '../i18n/messages';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { renderEmphasized } from '../i18n/story/render';

// Bump on every meaningful release. Surfaced in the title-screen
// footer so the user can confirm at a glance which build is live
// (handy when diagnosing PWA cache vs stale GitHub Pages deploy).
const BUILD_TAG = 'v0.32.5 · prologue-trim-and-swipe-back';

export type TitleStartMode =
  | { mode: 'ai'; sub: 'story' }
  | { mode: 'ai'; sub: 'free' }
  | { mode: 'human' };

interface TitleScreenProps {
  storyProgress: number;
  firstChapterName: string;
  onStart: (selection: TitleStartMode) => void;
  t: Messages;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  /** Active save slot (if any). Shown on the Story card so the user
   *  knows which save resumes when they tap. */
  activeSlot: { name: string; lives: number; storyProgress: number } | null;
  /** Opens the slot picker so the user can switch save. */
  onSwitchSlot: () => void;
  /** True iff the active slot has at least one previously-seen story
   *  scene. Gates whether the "回想 / Replay scenes" link renders. */
  archiveAvailable: boolean;
  /** Opens the scene-archive modal. */
  onOpenArchive: () => void;
}

export function TitleScreen({
  storyProgress,
  firstChapterName,
  onStart,
  t,
  locale,
  onLocaleChange,
  activeSlot,
  onSwitchSlot,
  archiveAvailable,
  onOpenArchive,
}: TitleScreenProps) {
  const hasProgress = storyProgress > 0 && storyProgress < 20;
  const completed = storyProgress >= 20;
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [bgOk, setBgOk] = useState(true);
  const bgSrc = `${import.meta.env.BASE_URL}title-bg-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;

  return (
    <div className="stage-bg min-h-screen w-full relative flex flex-col items-center justify-center px-4 py-8 max-lg:landscape:py-3 overflow-hidden">
      {/* Title-screen background illustration. Loaded from public/ so
          its presence/absence is independent of the JS bundle — if the
          PNG isn't shipped (or 404s) the existing dark stage-bg shows
          through unchanged. */}
      {bgOk && (
        <img
          src={bgSrc}
          alt=""
          aria-hidden
          onError={() => setBgOk(false)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.45 }}
        />
      )}
      {/* Dark vignette over the bg image so foreground text stays
          readable even on bright illustration regions. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(10,8,5,0.55) 75%, rgba(10,8,5,0.85) 100%)',
        }}
      />

      {/* Decorative title-screen background — radial light + scattered stones */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 120% 60% at 50% 30%, rgba(201, 169, 97, 0.15), transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(140, 100, 200, 0.08), transparent 70%)',
          }}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const seed = (i * 7) % 100;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${(seed * 1.7) % 100}%`,
                top: `${(seed * 2.3 + 5) % 90}%`,
                width: `${4 + (seed % 8)}px`,
                height: `${4 + (seed % 8)}px`,
                background:
                  i % 2 === 0
                    ? 'radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000)'
                    : 'radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c)',
                opacity: 0.18 + (seed % 30) / 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}
      </div>

      {/* Title block */}
      <div className="relative text-center mb-10 max-lg:landscape:mb-3 md:mb-12">
        {/* Tagline from the finished scenario — shown as a small
            poetic line above the work title. */}
        <p className="jp-display italic text-amber-100/85 text-sm max-lg:landscape:text-xs md:text-base tracking-wider mb-3 max-lg:landscape:mb-1">
          {renderEmphasized(t.story.prologue.tagline)}
        </p>
        <div className="latin-display italic ornament text-amber-200/50 text-xs max-lg:landscape:text-[9px] md:text-sm uppercase tracking-[0.4em] mb-4 max-lg:landscape:mb-1">
          — Summoned as an Othello Player —
        </div>
        <h1
          className="jp-display text-amber-100 text-3xl max-lg:landscape:text-xl md:text-5xl font-bold tracking-[0.15em] mb-3 max-lg:landscape:mb-1 leading-tight"
          style={{ textShadow: '0 0 24px rgba(201, 169, 97, 0.25)' }}
        >
          召喚されたら<br className="md:hidden max-lg:landscape:hidden" />オセロ世界でした！
        </h1>
        <p className="jp-display italic text-amber-200/60 text-sm md:text-base tracking-wider max-lg:landscape:hidden">
          {t.titleSubhead}
        </p>
      </div>

      {/* Mode selection cards */}
      <div className="relative w-full max-w-4xl grid md:grid-cols-3 max-lg:landscape:grid-cols-3 gap-3 max-lg:landscape:gap-2 md:gap-4 mb-6 max-lg:landscape:mb-2">
        {/* Story mode card */}
        <button
          onClick={() => onStart({ mode: 'ai', sub: 'story' })}
          className="group relative text-left p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-3 max-lg:landscape:mb-1.5">
            <Sparkles
              size={18}
              strokeWidth={1.4}
              className="text-amber-200/70 group-hover:text-amber-100 transition-colors"
            />
            <div className="latin-display italic text-amber-200/50 text-[10px] tracking-[0.3em] uppercase">
              {t.titleStoryLabel}
            </div>
          </div>
          <h3 className="jp-display text-amber-100 text-xl max-lg:landscape:text-base md:text-2xl font-bold tracking-wider mb-2 max-lg:landscape:mb-1">
            {t.titleStoryHeading}
          </h3>
          <p className="jp-display text-amber-200/60 text-xs md:text-sm leading-relaxed mb-4 max-lg:landscape:hidden">
            {t.titleStoryDesc}
          </p>
          {activeSlot && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSwitchSlot();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSwitchSlot();
                }
              }}
              className="mb-3 px-2.5 py-2 bg-amber-200/[0.05] border border-amber-200/20 rounded-sm flex items-center justify-between gap-2 hover:bg-amber-200/[0.08]"
            >
              <span className="jp-display text-amber-100/90 text-xs truncate">
                {t.slotInUseFooter(activeSlot.name, activeSlot.lives)}
              </span>
              <span className="latin-display italic text-amber-200/65 text-[10px] tracking-wider whitespace-nowrap">
                {t.slotSwitch} ▸
              </span>
            </div>
          )}
          {archiveAvailable && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onOpenArchive();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenArchive();
                }
              }}
              className="mb-3 px-2.5 py-1.5 border border-amber-200/15 rounded-sm flex items-center justify-between gap-2 hover:border-amber-200/40 hover:bg-amber-200/[0.04]"
            >
              <span className="jp-display italic text-amber-200/75 text-[11px]">
                {t.archiveOpenLabel}
              </span>
              <span className="latin-display italic text-amber-200/55 text-[10px] tracking-wider">
                ▸
              </span>
            </div>
          )}
          {hasProgress && (
            <div className="mt-auto pt-3 border-t border-amber-200/15">
              <div className="flex items-center justify-between mb-1.5">
                <span className="latin-display italic text-amber-200/50 text-[10px] tracking-[0.25em] uppercase">
                  Progress
                </span>
                <span className="latin-display text-amber-100 text-sm tabular-nums">
                  {storyProgress} / 20
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      i < storyProgress ? 'bg-amber-400/80' : 'bg-zinc-800/60'
                    }`}
                  />
                ))}
              </div>
              <div className="jp-display italic text-amber-200/55 text-[11px] mt-2">
                {t.titleStoryContinue(storyProgress + 1)}
              </div>
            </div>
          )}
          {completed && (
            <div className="mt-auto pt-3 border-t border-amber-400/30">
              <div className="latin-display italic text-amber-300/80 text-[10px] tracking-[0.25em] uppercase mb-1">
                {t.titleStoryCompletedLabel}
              </div>
              <div className="jp-display italic text-amber-100/80 text-[11px]">
                {t.titleStoryCompleted}
              </div>
            </div>
          )}
          {!hasProgress && !completed && (
            <div className="jp-display italic text-amber-200/70 text-[11px] mt-auto">
              {t.titleStoryFreshStart(firstChapterName)}
            </div>
          )}
          {/* Scenario-supplied CTA from the finished prologue. Sits as
              a subtle action line under all states so the user always
              sees the "what does this button do?" prompt. */}
          <div className="jp-display italic text-amber-100/80 text-[11px] tracking-wider mt-3 pt-2 border-t border-amber-200/10">
            ▸ {t.story.prologue.startButton}
          </div>
        </button>

        {/* Free mode card */}
        <button
          onClick={() => onStart({ mode: 'ai', sub: 'free' })}
          className="group text-left p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-3 max-lg:landscape:mb-1.5">
            <Swords
              size={18}
              strokeWidth={1.4}
              className="text-amber-200/70 group-hover:text-amber-100 transition-colors"
            />
            <div className="latin-display italic text-amber-200/50 text-[10px] tracking-[0.3em] uppercase">
              {t.titleFreeLabel}
            </div>
          </div>
          <h3 className="jp-display text-amber-100 text-xl max-lg:landscape:text-base md:text-2xl font-bold tracking-wider mb-2 max-lg:landscape:mb-1">
            {t.titleFreeHeading}
          </h3>
          <p className="jp-display text-amber-200/60 text-xs md:text-sm leading-relaxed mb-4 max-lg:landscape:hidden">
            {t.titleFreeDesc}
          </p>
          <div className="jp-display italic text-amber-200/70 text-[11px] max-lg:landscape:hidden">
            {t.titleFreeMeta}
          </div>
        </button>

        {/* Two-player mode card */}
        <button
          onClick={() => onStart({ mode: 'human' })}
          className="group text-left p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-3 max-lg:landscape:mb-1.5">
            <Users
              size={18}
              strokeWidth={1.4}
              className="text-amber-200/70 group-hover:text-amber-100 transition-colors"
            />
            <div className="latin-display italic text-amber-200/50 text-[10px] tracking-[0.3em] uppercase">
              {t.titleTwoPlayersLabel}
            </div>
          </div>
          <h3 className="jp-display text-amber-100 text-xl max-lg:landscape:text-base md:text-2xl font-bold tracking-wider mb-2 max-lg:landscape:mb-1">
            {t.titleTwoPlayersHeading}
          </h3>
          <p className="jp-display text-amber-200/60 text-xs md:text-sm leading-relaxed mb-4 max-lg:landscape:hidden">
            {t.titleTwoPlayersDesc}
          </p>
          <div className="jp-display italic text-amber-200/70 text-[11px] max-lg:landscape:hidden">
            {t.titleTwoPlayersMeta}
          </div>
        </button>
      </div>

      {/* Footer hint + language toggle */}
      <div className="relative flex flex-col items-center gap-3 max-lg:landscape:gap-1">
        <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.3em] uppercase max-lg:landscape:hidden">
          {t.titleFooterHint}
        </div>
        <div className="flex gap-1 jp-display text-[11px]">
          <button
            onClick={() => onLocaleChange('ja')}
            className={`px-3 py-1 rounded-sm border transition-colors ${
              locale === 'ja'
                ? 'border-amber-200/60 text-amber-100 bg-amber-200/[0.06]'
                : 'border-transparent text-amber-200/55 hover:text-amber-200/85'
            }`}
            aria-pressed={locale === 'ja'}
          >
            日本語
          </button>
          <button
            onClick={() => onLocaleChange('en')}
            className={`px-3 py-1 rounded-sm border transition-colors latin-display ${
              locale === 'en'
                ? 'border-amber-200/60 text-amber-100 bg-amber-200/[0.06]'
                : 'border-transparent text-amber-200/55 hover:text-amber-200/85'
            }`}
            aria-pressed={locale === 'en'}
          >
            English
          </button>
        </div>
        <div className="latin-display italic text-amber-200/30 text-[9px] tracking-[0.25em] mt-1 select-all">
          {BUILD_TAG}
        </div>
      </div>
    </div>
  );
}
