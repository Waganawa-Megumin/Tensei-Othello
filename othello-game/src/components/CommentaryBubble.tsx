/**
 * Floating one-line commentary bubble shown above the AI side's
 * PlayerPanel. The text is fed in from `App.tsx` (sourced from
 * `services/commentary.ts`); this component just handles presentation
 * and the auto-fade.
 *
 * The component is intentionally dumb: every time the `commentary`
 * prop's identity changes, a fresh fade-in cycle starts via a `key`
 * remount. The parent is in charge of clearing the prop after some
 * delay if it wants the bubble to disappear; we don't auto-hide here
 * (gives the parent fine-grained control over timing without wiring a
 * callback).
 */
import type { CommentaryTone } from '../prompts/commentary';

interface CommentaryBubbleProps {
  text: string;
  tone: CommentaryTone;
}

const TONE_RING: Record<CommentaryTone, string> = {
  taunt: 'border-rose-300/70 bg-rose-950/40',
  thoughtful: 'border-amber-200/70 bg-amber-950/40',
  shock: 'border-violet-300/70 bg-violet-950/40',
  cheer: 'border-emerald-300/70 bg-emerald-950/40',
  neutral: 'border-amber-200/40 bg-stone-950/50',
};

export function CommentaryBubble({ text, tone }: CommentaryBubbleProps) {
  return (
    <div
      // Position is owned by the parent (it picks left/right depending
      // on which side the AI is on); we just lay out the inner bubble.
      className={`commentary-bubble pointer-events-none rounded-sm border px-3 py-2 backdrop-blur-sm ${TONE_RING[tone]}`}
      role="status"
      aria-live="polite"
    >
      <p className="jp-display text-amber-100/95 text-[12px] md:text-sm leading-snug">
        {text}
      </p>
    </div>
  );
}
