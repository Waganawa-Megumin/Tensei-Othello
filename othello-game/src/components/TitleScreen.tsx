import { useState } from 'react';
import { BookOpen, Sparkles, Swords, Users } from 'lucide-react';
import type { Locale, Messages } from '../i18n/messages';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { renderEmphasized } from '../i18n/story/render';
import {
  getNextOpponent,
  getSavePointDisplay,
  type SaveSlot,
} from '../storage/saveSlots';

// Bump on every meaningful release. Surfaced in the title-screen
// footer so the user can confirm at a glance which build is live
// (handy when diagnosing PWA cache vs stale GitHub Pages deploy).
const BUILD_TAG = 'v0.36.76 · revert PLR02/03 prologue-only → default legacy 5-step';

export type TitleStartMode =
  | { mode: 'ai'; sub: 'story' }
  | { mode: 'ai'; sub: 'free' }
  | { mode: 'human' };

interface TitleScreenProps {
  storyProgress: number;
  onStart: (selection: TitleStartMode) => void;
  t: Messages;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  /** Active save slot (if any). Shown on the Story card so the user
   *  knows which save resumes when they tap. v0.36.44 — TitleScreen
   *  derives PLR slug + chapter + opponent itself via
   *  `getSavePointDisplay()` + `getNextOpponent()`; caller only needs
   *  to pass the raw slot and the prologue-seen flag. */
  activeSlot: {
    /** Raw slot record from storage. */
    slot: SaveSlot;
    /** True iff the slot is at chapter 0 AND has not yet seen the
     *  prologue overlay. Footer then shows 「序章」 instead of
     *  「第1章 vs いちか」 so the framing matches the user's actual
     *  narrative position. */
    inPrologue: boolean;
  } | null;
  /** Slim AVATARS view (locale-applied name + image path) for
   *  `getSavePointDisplay()` when the active slot is non-null. */
  avatars: ReadonlyArray<{ name: string; image: string }>;
  /** Slim COMPUTERS view — `level` + locale-applied `name`. Used by
   *  `getNextOpponent()` to show 「第N章 vs ${opp}」 in the footer. */
  opponents: ReadonlyArray<{ level: number; name: string }>;
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
  onStart,
  t,
  locale,
  onLocaleChange,
  activeSlot,
  avatars,
  opponents,
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
    <div className="stage-bg min-h-screen w-full relative py-8 max-lg:landscape:py-3 overflow-hidden flex flex-col justify-center">
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
          style={{ opacity: 0.78 }}
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

      {/* Centered content column. Replaces the previous
          `flex items-center` parent, which was visually right-
          shifted on some Android viewports (v0.36.16 →
          v0.36.17 「枠全体が少し右寄り」 report). Plain
          `mx-auto` block centering with explicit horizontal
          padding inside the column behaves the same on every
          device. */}
      <div
        className="relative w-full max-w-4xl mx-auto box-border"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >

      {/* Title block */}
      <div className="relative text-center mb-10 max-lg:landscape:mb-3 md:mb-12">
        {/* Tagline from the finished scenario — shown as a small
            poetic line above the work title. v0.36.35 bumps weight
            to medium for parity with the latin subtitle below. */}
        <p
          className="jp-display italic font-medium text-amber-100/95 text-base max-lg:landscape:text-xs md:text-lg tracking-wider mb-3 max-lg:landscape:mb-1"
          style={{ textShadow: '0 0 18px rgba(10,8,5,0.95), 0 1px 2px rgba(0,0,0,0.85)' }}
        >
          {renderEmphasized(t.story.prologue.tagline)}
        </p>
        {/* Latin subtitle. v0.36.44 — bold visual change per user
            request 「思い切りよく変更してください」: wrap the line in
            a dark pill chip with backdrop-blur. The bg illustration
            no longer competes with the glyph's hairline stems
            because the chip itself dims a strip of bg behind the
            text. White fill + tight shadow halo for the final
            edge definition. */}
        {/* Latin subtitle. v0.36.48 — drops:
            - `.latin-display` (= Cormorant Garamond italic, served
              as wide warm serif) → uses system sans-serif via
              Tailwind `font-sans` for a clean, compact look.
            - `.ornament` class — it was overriding `text-white` with
              `rgba(201, 169, 97, 0.45)` (45% amber), forcing the
              "amber-on-amber" blend the user kept reporting.
            - `italic` — sans-italic looks generic web; upright reads
              cleaner.
            User asked for 「白系で明るく」「半角で」. Sans-serif at
            text-sm/md:text-base + no extra letter-spacing renders
            the Latin chars at native half-width. */}
        <div
          className="font-sans font-semibold text-white text-sm max-lg:landscape:text-[10px] md:text-base uppercase tracking-wider mb-4 max-lg:landscape:mb-1 text-center"
          style={{
            textShadow:
              '0 0 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.85), 0 0 24px rgba(10,8,5,0.7), 0 2px 4px rgba(0,0,0,0.95)',
          }}
        >
          — Summoned as an Othello Player —
        </div>
        <h1
          className="jp-display text-amber-100 text-3xl max-lg:landscape:text-xl md:text-5xl font-bold tracking-[0.15em] mb-3 max-lg:landscape:mb-1 leading-tight"
          style={{ textShadow: '0 0 24px rgba(201, 169, 97, 0.25)' }}
        >
          召喚されたら<br className="md:hidden max-lg:landscape:hidden" />オセロ世界でした！
        </h1>
      </div>

      {/* Mode selection cards */}
      <div className="relative w-full grid md:grid-cols-3 max-lg:landscape:grid-cols-3 gap-3 max-lg:landscape:gap-2 md:gap-4 mb-6 max-lg:landscape:mb-2">
        {/* Story mode card */}
        <button
          onClick={() => onStart({ mode: 'ai', sub: 'story' })}
          className="group relative text-left min-w-0 p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-zinc-950/45 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
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
              className="mb-3 px-2.5 py-2 bg-amber-200/[0.05] border border-amber-200/20 rounded-sm flex items-center justify-between gap-2 min-w-0 hover:bg-amber-200/[0.08]"
            >
              {/* whitespace-pre-line preserves the `\n` between
                  the slot name (line 1) and the current-state
                  detail (line 2) emitted by t.slotInUseFooter,
                  giving a two-line summary instead of a single
                  ellipsized line. */}
              <span className="jp-display text-amber-100/90 text-xs whitespace-pre-line leading-relaxed min-w-0">
                {(() => {
                  const sp = getSavePointDisplay(activeSlot.slot, avatars);
                  const next = getNextOpponent(sp, opponents);
                  return t.slotInUseFooter(
                    activeSlot.slot.name,
                    activeSlot.slot.lives,
                    sp.plrSlug,
                    sp.plrName,
                    next.nextChapter,
                    next.opponentName,
                    activeSlot.inPrologue,
                  );
                })()}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="latin-display italic text-amber-200/65 text-[10px] tracking-wider whitespace-nowrap">
                  {t.slotSwitch} ▸
                </span>
              </span>
            </div>
          )}
          {/* Scene-archive entry, lifted out of the slot strip so it
              is actually discoverable. v0.36.52: the inline 13px
              BookOpen icon was getting missed on mobile. A full-
              width row inside the Story card is far easier to spot
              and keeps the click target generous. */}
          {activeSlot && archiveAvailable && (
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
              className="mb-3 px-2.5 py-2 bg-amber-200/[0.05] border border-amber-200/20 rounded-sm flex items-center justify-between gap-2 min-w-0 hover:bg-amber-200/[0.08]"
            >
              <span className="flex items-center gap-2 jp-display text-amber-100/90 text-xs min-w-0">
                <BookOpen
                  size={14}
                  strokeWidth={1.6}
                  className="text-amber-200/75 shrink-0"
                />
                <span className="truncate">{t.archiveModalTitle}</span>
              </span>
              <span className="latin-display italic text-amber-200/65 text-[10px] tracking-wider whitespace-nowrap shrink-0">
                {t.archiveOpenLabel}
              </span>
            </div>
          )}
          {hasProgress && (
            <div className="mt-auto pt-3 border-t border-amber-200/15">
              <div className="mb-1.5">
                <span className="latin-display italic text-amber-200/50 text-[10px] tracking-[0.25em] uppercase">
                  Progress
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      i < storyProgress
                        ? 'bg-amber-400/80'
                        : i === storyProgress
                          ? 'bg-emerald-400/85'
                          : 'bg-zinc-800/60'
                    }`}
                  />
                ))}
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
        </button>

        {/* Free mode card */}
        <button
          onClick={() => onStart({ mode: 'ai', sub: 'free' })}
          className="group text-left min-w-0 p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-zinc-950/45 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
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
          className="group text-left min-w-0 p-5 max-lg:landscape:p-3 md:p-6 border border-amber-200/30 hover:border-amber-200/70 bg-zinc-950/45 bg-gradient-to-br from-amber-200/[0.04] to-transparent hover:from-amber-200/[0.08] rounded-sm transition-all"
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

      </div> {/* end centered content column */}
    </div>
  );
}
