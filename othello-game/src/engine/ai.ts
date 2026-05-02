import {
  type Board,
  type Color,
  type Move,
  type ValidMove,
  opponent,
} from './types';
import { applyMove, getValidMoves } from './board';
import { POSITION_WEIGHTS, evaluate } from './evaluate';

interface MinimaxResult {
  score: number;
  move: Move | null;
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  toPlay: Color,
  maxColor: Color,
): MinimaxResult {
  if (depth === 0) {
    return { score: evaluate(board, maxColor), move: null };
  }

  const moves = getValidMoves(board, toPlay);
  if (moves.length === 0) {
    const oppMoves = getValidMoves(board, opponent(toPlay));
    if (oppMoves.length === 0) {
      return { score: evaluate(board, maxColor), move: null };
    }
    const r = minimax(board, depth - 1, alpha, beta, opponent(toPlay), maxColor);
    return { score: r.score, move: null };
  }

  const isMax = toPlay === maxColor;
  const sorted = [...moves].sort((a, b) =>
    isMax
      ? POSITION_WEIGHTS[b.row][b.col] - POSITION_WEIGHTS[a.row][a.col]
      : POSITION_WEIGHTS[a.row][a.col] - POSITION_WEIGHTS[b.row][b.col],
  );

  let bestMove: Move | null = null;
  let a = alpha;
  let b = beta;

  if (isMax) {
    let best = -Infinity;
    for (const m of sorted) {
      const next = applyMove(board, m.row, m.col, toPlay);
      if (next === null) continue;
      const res = minimax(next, depth - 1, a, b, opponent(toPlay), maxColor);
      if (res.score > best) {
        best = res.score;
        bestMove = { row: m.row, col: m.col };
      }
      if (res.score > a) a = res.score;
      if (b <= a) break;
    }
    return { score: best, move: bestMove };
  }

  let worst = Infinity;
  for (const m of sorted) {
    const next = applyMove(board, m.row, m.col, toPlay);
    if (next === null) continue;
    const res = minimax(next, depth - 1, a, b, opponent(toPlay), maxColor);
    if (res.score < worst) {
      worst = res.score;
      bestMove = { row: m.row, col: m.col };
    }
    if (res.score < b) b = res.score;
    if (b <= a) break;
  }
  return { score: worst, move: bestMove };
}

function depthForLevel(level: number): number {
  if (level <= 12) return 1;
  if (level <= 14) return 2;
  if (level <= 17) return 3;
  return 4;
}

export function pickAIMove(
  board: Board,
  validMoves: ValidMove[],
  level: number,
  color: Color,
): ValidMove | null {
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  if (level <= 2) {
    if (level === 1 || Math.random() < 0.7) {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }

  if (level <= 5) {
    const noise = (6 - level) * 2;
    const scored = validMoves
      .map((m) => ({ m, s: m.flips.length + (Math.random() - 0.5) * noise }))
      .sort((a, b) => b.s - a.s);
    return scored[0].m;
  }

  if (level <= 9) {
    const noise = (10 - level) * 3;
    const scored = validMoves
      .map((m) => ({
        m,
        s:
          POSITION_WEIGHTS[m.row][m.col] +
          m.flips.length * 0.3 +
          (Math.random() - 0.5) * noise,
      }))
      .sort((a, b) => b.s - a.s);
    return scored[0].m;
  }

  const depth = depthForLevel(level);
  const result = minimax(board, depth, -Infinity, Infinity, color, color);

  if (level <= 15 && Math.random() < (16 - level) * 0.04) {
    return validMoves[Math.floor(Math.random() * Math.min(2, validMoves.length))];
  }

  if (result.move) {
    const found = validMoves.find(
      (m) => m.row === result.move!.row && m.col === result.move!.col,
    );
    if (found) return found;
  }
  return validMoves[0];
}
