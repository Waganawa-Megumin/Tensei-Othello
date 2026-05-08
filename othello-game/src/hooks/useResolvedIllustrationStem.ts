/**
 * Two-stage illustration path resolver hook (v0.36.56).
 *
 * Used by intro-chain screens (PrologueScreen / FallingScreen /
 * ArrivalScreen / GatewayClosed/OpenScreen) that paint the artwork
 * via CSS `background-image` instead of an `<img>` tag — so the
 * standard `onError` fallback pattern in NarrativeOverlay isn't
 * available. Probes the per-PLR asset on mount/orientation flip
 * with `new Image()` and swaps to `_shared/` if it 404s.
 *
 * Returns the resolved stem (no extension, no orientation suffix);
 * the caller composes the full URL.
 */
import { useEffect, useState } from 'react';

export function useResolvedIllustrationStem(
  primaryStem: string,
  fallbackStem: string,
  orientation: 'landscape' | 'portrait',
): string {
  const [stem, setStem] = useState(primaryStem);

  useEffect(() => {
    setStem(primaryStem);
    if (primaryStem === fallbackStem) return;
    const probe = new Image();
    let cancelled = false;
    probe.onerror = () => {
      if (!cancelled) setStem(fallbackStem);
    };
    probe.src = `${import.meta.env.BASE_URL}illustrations/${primaryStem}-${orientation}.png`;
    return () => {
      cancelled = true;
      probe.onerror = null;
    };
  }, [primaryStem, fallbackStem, orientation]);

  return stem;
}
