/**
 * AI engine identifiers and metadata.
 *
 * Free-mode lets the player swap between thinking back-ends. Today there
 * are two:
 *   - `tensei-classic` — the always-bundled in-house minimax + αβ engine
 *     (the one that has shipped since v1). Fast, light, level-graded.
 *   - `edax`           — a WASM port of Edax 4.x (Richard Delorme, GPL),
 *     ~2400 ELO. Strong but only present when the .wasm + loader have
 *     been built and dropped into `public/edax/` — the runtime adapter
 *     gracefully falls back to Tensei Classic if they're missing.
 *
 * Story mode is locked to Tensei Classic for consistency across slots.
 */
export type EngineId = 'tensei-classic' | 'edax';

export const DEFAULT_ENGINE: EngineId = 'tensei-classic';

/** Static, UI-facing description of a selectable engine. */
export interface EngineDescriptor {
  id: EngineId;
  /** Brand name shown big in the selector. Treat as a proper noun — not localised. */
  displayName: string;
  /** i18n key for the 1–2 sentence card body (resolved by the consumer). */
  descriptionKey: 'tenseiClassicDesc' | 'edaxDesc';
  /** Author / origin line shown small below the description. */
  attribution: string;
}
