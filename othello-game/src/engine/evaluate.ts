import {
  type Board,
  type Color,
  EMPTY,
  opponent,
} from './types';
import { BOARD_SIZE, countPieces, getValidMoves } from './board';

export const POSITION_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [
  [120, -20, 20,  5,  5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [ 20,  -5, 15,  3,  3, 15,  -5,  20],
  [  5,  -5,  3,  3,  3,  3,  -5,   5],
  [  5,  -5,  3,  3,  3,  3,  -5,   5],
  [ 20,  -5, 15,  3,  3, 15,  -5,  20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20,  5,  5, 20, -20, 120],
];

const TERMINAL_WIN = 100_000;
const MOBILITY_WEIGHT = 8;
const DISC_PARITY_WEIGHT = 5;
const ENDGAME_THRESHOLD = 50;

export function evaluate(board: Board, maxColor: Color): number {
  const opp = opponent(maxColor);
  const counts = countPieces(board);
  const myMoves = getValidMoves(board, maxColor);
  const oppMoves = getValidMoves(board, opp);

  if (myMoves.length === 0 && oppMoves.length === 0) {
    const my = maxColor === 1 ? counts.black : counts.white;
    const op = maxColor === 1 ? counts.white : counts.black;
    if (my > op) return TERMINAL_WIN;
    if (my < op) return -TERMINAL_WIN;
    return 0;
  }

  let pos = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = board[r][c];
      if (v === EMPTY) continue;
      if (v === maxColor) pos += POSITION_WEIGHTS[r][c];
      else pos -= POSITION_WEIGHTS[r][c];
    }
  }

  const mobility = (myMoves.length - oppMoves.length) * MOBILITY_WEIGHT;
  const total = counts.black + counts.white;
  const my = maxColor === 1 ? counts.black : counts.white;
  const op = maxColor === 1 ? counts.white : counts.black;
  const discParity = total > ENDGAME_THRESHOLD ? (my - op) * DISC_PARITY_WEIGHT : 0;

  return pos + mobility + discParity;
}
