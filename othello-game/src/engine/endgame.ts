/**
 * Endgame solver — stub for Phase 4.
 *
 * Will implement perfect Alpha-Beta search when empty squares <= 14,
 * maximizing final disc differential. Until then, callers should
 * fall back to the standard `minimax` from `./ai`.
 */
import type { Board, Color, Move } from './types';

export const ENDGAME_EMPTY_THRESHOLD = 14;

export interface EndgameResult {
  bestMove: Move | null;
  finalDiscDiff: number;
}

export function solveEndgame(
  _board: Board,
  _color: Color,
  _emptyCount: number,
): EndgameResult | null {
  return null;
}
