import type { EngineDescriptor, EngineId } from './types';

/**
 * Ordered list of engines exposed in the free-mode selector. The order
 * here is the order they appear on screen.
 */
export const ENGINES: ReadonlyArray<EngineDescriptor> = [
  {
    id: 'tensei-classic',
    displayName: 'Tensei Classic',
    descriptionKey: 'tenseiClassicDesc',
    attribution: 'Built-in (Tensei Othello)',
  },
  {
    id: 'edax',
    displayName: 'Edax',
    descriptionKey: 'edaxDesc',
    attribution: 'Richard Delorme · GPL-3.0',
  },
];

const ENGINE_IDS: ReadonlySet<string> = new Set(ENGINES.map((e) => e.id));

/** Type-guard for narrowing arbitrary strings (e.g. localStorage values). */
export function isEngineId(value: unknown): value is EngineId {
  return typeof value === 'string' && ENGINE_IDS.has(value);
}
