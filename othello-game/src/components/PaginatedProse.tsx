import { useMemo, useState } from 'react';
import { renderEmphasized } from '../i18n/story/render';

interface PaginatedProseProps {
  /** Source text. Pages are split on blank lines (`\n\n`) so authors
   *  can control breaks by the same paragraph boundaries they already
   *  write into the i18n bundles. Single newlines stay inside a page. */
  text: string;
  /** Localized labels. */
  prevLabel: string;
  nextLabel: string;
  /** "1 / 5" template; receives current (1-indexed) and total page
   *  counts. */
  pageCounter: (current: number, total: number) => string;
}

/**
 * Page-turn reader for long story prose. Used by the GameOver modal
 * for the ch.20 ending — the full text is multiple screens of text,
 * and reading it in one scrollable blob meant the player either
 * missed paragraphs or had to scroll inside a card that itself sits
 * in a flex column. Splitting into pages with prev/next buttons makes
 * the cadence explicit and keeps each page legible without scroll.
 */
export function PaginatedProse({
  text,
  prevLabel,
  nextLabel,
  pageCounter,
}: PaginatedProseProps) {
  const pages = useMemo(() => splitIntoPages(text), [text]);
  const [page, setPage] = useState(0);
  const total = pages.length;
  const safePage = Math.min(Math.max(page, 0), total - 1);

  return (
    <div className="space-y-3">
      <p
        className="jp-display text-amber-100/85 text-sm md:text-base leading-relaxed whitespace-pre-line text-left min-h-[10rem]"
        key={safePage}
      >
        {renderEmphasized(pages[safePage] ?? '')}
      </p>
      {total > 1 && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-200/15">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage <= 0}
            className="btn text-xs px-3 py-1.5"
          >
            ◀ {prevLabel}
          </button>
          <div className="latin-display italic text-amber-200/70 text-xs tracking-wider tabular-nums">
            {pageCounter(safePage + 1, total)}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
            disabled={safePage >= total - 1}
            className="btn text-xs px-3 py-1.5"
          >
            {nextLabel} ▶
          </button>
        </div>
      )}
    </div>
  );
}

/** Split on blank lines (one or more empty lines between paragraphs).
 *  Trim each page so leading/trailing whitespace doesn't render as a
 *  forced gap. Returns at least one page even for empty input. */
function splitIntoPages(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed === '') return [''];
  const parts = trimmed
    .split(/\n[ \t]*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts : [trimmed];
}
