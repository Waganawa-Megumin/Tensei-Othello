/**
 * Pulsing "▼ tap to continue" hint pinned to the bottom of an intro
 * screen during the art-only phase. `pointer-events: none` so it
 * never intercepts the parent's full-screen tap-to-reveal handler.
 */
export function TapHint({ label }: { label: string }) {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ animation: 'tapPulse 1.8s ease-in-out infinite' }}
    >
      <div className="latin-display italic text-amber-200/75 text-xs tracking-[0.3em] uppercase">
        ▼ {label}
      </div>
    </div>
  );
}
