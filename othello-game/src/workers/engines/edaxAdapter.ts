/// <reference lib="webworker" />
/**
 * Adapter that wraps an Edax-WASM build (from `/edax/edax.js` +
 * `/edax/edax.wasm`) so it can be called like our existing in-process
 * `pickAIMove`. The WASM artifact is NOT bundled with the app — it has
 * to be built separately (see `scripts/build-edax-wasm.sh`) and
 * dropped into `othello-game/public/edax/` before this code can do
 * anything useful.
 *
 * If the artifact is missing, every call falls back to Tensei Classic
 * after logging a one-time warning. This keeps the engine selector
 * functional in CI / on dev machines where Edax hasn't been built.
 *
 * Contract expected from the loader (`public/edax/edax.js`):
 *   - default export: `createEdaxModule(opts?) => Promise<EdaxModule>`
 *   - `EdaxModule.ccall('edax_init', ...)` / `'edax_pick_move'` etc.
 *
 * The current loader stub is a placeholder — `tryLoadEdax()` resolves
 * to `null` until a real build replaces it. The adapter keeps the
 * surface area tiny so swapping in a real build is a one-file change.
 */
import { pickAIMove } from '../../engine/ai';
import type { Board, Color, ValidMove } from '../../engine/types';

/** Minimal interface we need from a working Edax module. */
interface EdaxModule {
  /**
   * Pick the best move for `color` on `board` at the given level.
   * Returns null if no legal moves. The adapter is responsible for
   * translating between our 8x8 nested-array board and whatever
   * encoding the WASM build expects.
   */
  pickMove(board: Board, color: Color, level: number): Promise<ValidMove | null>;
}

let modulePromise: Promise<EdaxModule | null> | null = null;
let warnedMissing = false;

async function tryLoadEdax(): Promise<EdaxModule | null> {
  // The loader path is relative to the worker's location, which Vite
  // serves from `/<base>/assets/...`. Edax assets live at
  // `<base>/edax/edax.js`, which we resolve via document base href.
  // In a Worker `self.location` exists; fall back to `/edax/` on root.
  const base = (() => {
    try {
      const href = (self as unknown as { location: { href: string } }).location.href;
      const url = new URL(href);
      // Strip everything past the deployment root; we only need origin + base path.
      // Vite worker URLs include `/assets/`, so trim from there.
      const rootIdx = url.pathname.indexOf('/assets/');
      const root = rootIdx >= 0 ? url.pathname.slice(0, rootIdx + 1) : '/';
      return `${url.origin}${root}edax/`;
    } catch {
      return '/edax/';
    }
  })();

  try {
    // Probe for the loader stub. HEAD is enough to tell us whether
    // the artifact has been built; we only do the real import if it
    // exists. This avoids a noisy 404 in the console for users who
    // never opted into Edax.
    const probe = await fetch(`${base}edax.js`, { method: 'HEAD' });
    if (!probe.ok) return null;
  } catch {
    return null;
  }

  try {
    // Dynamic import bypasses Vite's static analysis (the file isn't
    // in `src/`), which is what we want for an opt-in artifact.
    const mod = (await import(/* @vite-ignore */ `${base}edax.js`)) as {
      default?: (opts?: Record<string, unknown>) => Promise<EdaxModule>;
    };
    if (typeof mod.default !== 'function') return null;
    return await mod.default({ locateFile: (p: string) => `${base}${p}` });
  } catch {
    return null;
  }
}

function ensureLoaded(): Promise<EdaxModule | null> {
  if (!modulePromise) modulePromise = tryLoadEdax();
  return modulePromise;
}

/**
 * Pick a move using Edax if available, otherwise fall back to Tensei
 * Classic. The fallback is deliberate: missing-artifact is the common
 * case in fresh checkouts, and the user shouldn't see a black hole.
 */
export async function edaxPickMove(
  board: Board,
  moves: ValidMove[],
  level: number,
  color: Color,
): Promise<ValidMove | null> {
  const mod = await ensureLoaded();
  if (!mod) {
    if (!warnedMissing) {
      warnedMissing = true;
      console.warn(
        '[edax] WASM artifact not found at /edax/edax.js — falling back to Tensei Classic. ' +
          'Run scripts/build-edax-wasm.sh and place the output in public/edax/ to enable Edax.',
      );
    }
    return pickAIMove(board, moves, level, color);
  }
  try {
    return await mod.pickMove(board, color, level);
  } catch (err) {
    console.warn('[edax] pickMove failed, falling back to Tensei Classic:', err);
    return pickAIMove(board, moves, level, color);
  }
}
