/**
 * Full-screen overlay showing a single chapter's narrative content
 * (intro narration, master's pre-match line, the protagonist's
 * inner thought after the match, the master's victory line, and the
 * bridging victoryNarration). Used by the title-screen scene archive
 * to let players replay every chapter beat they've cleared, with a
 * "next" button that chains seamlessly to the following scene.
 *
 * Visual style mirrors NarrativeOverlay but uses the chapter
 * illustration as backdrop instead of `/illustrations/{key}-*.png`.
 */
import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { renderEmphasized } from '../i18n/story/render';
import type { ChapterStory } from '../i18n/story';

interface ChapterStoryOverlayProps {
  /** Chapter number (1..20) — shown above the opponent name. */
  chapter: number;
  /** Localised opponent name ("いちか", "ゼロ", etc.). */
  opponentName: string;
  /** Filename stem for the chapter art. e.g.
   *  "avatars/chapters/chapter_01_ichika". The component appends
   *  `-{landscape,portrait}.png` like ChapterArt does. */
  chapterArtBase?: string;
  /** Localised story content for this chapter. */
  story: ChapterStory;
  /** Heading line — typically t.chapterCounter or just "第N章". */
  heading: string;
  /** Localized labels. */
  proseHeadingIntro: string;
  proseHeadingBossPre: string;
  proseHeadingBossPost: string;
  proseHeadingVictoryDialogue: string;
  proseHeadingVictoryNarration: string;
  dismissLabel: string;
  onDismiss: () => void;
}

export function ChapterStoryOverlay({
  chapter,
  opponentName,
  chapterArtBase,
  story,
  heading,
  proseHeadingIntro,
  proseHeadingBossPre,
  proseHeadingBossPost,
  proseHeadingVictoryDialogue,
  proseHeadingVictoryNarration,
  dismissLabel,
  onDismiss,
}: ChapterStoryOverlayProps) {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [imgOk, setImgOk] = useState(true);
  const imgSrc = chapterArtBase
    ? `${chapterArtBase}-${isLandscape ? 'landscape' : 'portrait'}.png`
    : null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0a0805]"
      role="dialog"
      aria-modal="true"
      aria-label={`Chapter ${chapter}: ${opponentName}`}
    >
      {imgSrc && imgOk && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden
          onError={() => setImgOk(false)}
          className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.6 }}
        />
      )}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,8,5,0.7) 0%, rgba(10,8,5,0.45) 40%, rgba(10,8,5,0.85) 100%)',
        }}
      />

      <div className="relative min-h-full flex flex-col items-center px-5 py-10 max-w-2xl mx-auto">
        <div className="latin-display italic ornament text-amber-200/55 text-[10px] tracking-[0.4em] uppercase mb-3">
          — Chapter {chapter} —
        </div>
        <h2 className="jp-display text-amber-100 text-xl md:text-2xl tracking-wider text-center mb-1 leading-snug">
          {heading}
        </h2>
        <div className="jp-display italic text-amber-200/70 text-sm md:text-base mb-7">
          vs {opponentName}
        </div>

        <Block heading={proseHeadingIntro} variant="narration">
          {renderEmphasized(story.intro)}
        </Block>
        <Block heading={proseHeadingBossPre} variant="dialogue" speaker={opponentName}>
          「{renderEmphasized(story.bossPre)}」
        </Block>
        <Block heading={proseHeadingBossPost} variant="thought">
          {renderEmphasized(story.bossPost)}
        </Block>
        <Block heading={proseHeadingVictoryDialogue} variant="dialogue" speaker={opponentName}>
          「{renderEmphasized(story.victoryDialogue)}」
        </Block>
        <Block heading={proseHeadingVictoryNarration} variant="narration">
          {renderEmphasized(story.victoryNarration)}
        </Block>

        <button
          onClick={onDismiss}
          className="mt-4 px-6 py-2.5 border border-amber-200/60 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display tracking-wider transition-colors"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}

interface BlockProps {
  heading: string;
  variant: 'narration' | 'dialogue' | 'thought';
  speaker?: string;
  children: React.ReactNode;
}

function Block({ heading, variant, speaker, children }: BlockProps) {
  const textClass =
    variant === 'dialogue'
      ? 'jp-display italic text-amber-100/95 text-sm md:text-base leading-loose whitespace-pre-line'
      : variant === 'thought'
        ? 'jp-display italic text-amber-100/75 text-sm leading-loose whitespace-pre-line'
        : 'jp-display text-amber-100/90 text-sm md:text-base leading-loose whitespace-pre-line';
  return (
    <div className="w-full max-w-prose mb-6">
      <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.3em] uppercase mb-1.5 flex items-center gap-2">
        <span>{heading}</span>
        {speaker && (
          <span className="text-amber-200/40 normal-case tracking-wider">
            — {speaker}
          </span>
        )}
      </div>
      <div className={textClass}>{children}</div>
    </div>
  );
}
