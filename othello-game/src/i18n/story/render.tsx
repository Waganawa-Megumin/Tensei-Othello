import { Fragment, type ReactNode } from 'react';

/**
 * Render a string with `**bold**` markdown emphasis as React nodes.
 * Splits by `**` markers — every odd-indexed piece becomes a
 * `<strong>` (with a soft amber accent), every even piece is plain.
 *
 * Why so simple: the story scenarios use a single emphasis style
 * consistently, and only `**...**`. We don't need a full markdown
 * parser. If italics or links ever appear, extend here.
 */
export function renderEmphasized(text: string): ReactNode {
  if (!text.includes('**')) return text;
  const parts = text.split('**');
  return (
    <Fragment>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-amber-100 font-medium">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </Fragment>
  );
}

/**
 * Strip `**...**` markers from a string and return plain text.
 * Use for places where formatted children aren't supported (e.g. an
 * `<img alt>` attribute, a button label).
 */
export function stripEmphasis(text: string): string {
  return text.replace(/\*\*/g, '');
}
