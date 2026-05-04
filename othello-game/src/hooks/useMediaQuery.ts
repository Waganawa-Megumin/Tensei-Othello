import { useEffect, useState } from 'react';

/**
 * Reactive boolean for a CSS media query. Re-renders the calling
 * component when the query result changes (e.g. user rotates the
 * device, resizes the window).
 *
 * Used primarily for picking landscape vs portrait illustration
 * variants — `useMediaQuery('(orientation: landscape)')`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    // Sync once in case the value already changed between mount and
    // effect attach.
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
