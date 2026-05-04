import { DEFAULT_ENGINE, type EngineId } from '../engine/engines/types';
import { isEngineId } from '../engine/engines/registry';

/**
 * Persisted free-mode AI engine selection. Mirrors the same pattern as
 * `othello:coin_style`: read once on mount, write through a setter.
 */
const AI_ENGINE_KEY = 'othello:ai_engine';

export function loadAiEngine(): EngineId {
  try {
    const v = window.localStorage.getItem(AI_ENGINE_KEY);
    return isEngineId(v) ? v : DEFAULT_ENGINE;
  } catch {
    return DEFAULT_ENGINE;
  }
}

export function saveAiEngine(engine: EngineId): void {
  try {
    window.localStorage.setItem(AI_ENGINE_KEY, engine);
  } catch {
    /* localStorage unavailable; selection survives only in memory */
  }
}
