import { describe, expect, it } from 'vitest';
import { minimax, pickAIMove } from '../ai';
import { applyMove, createInitialBoard, getValidMoves } from '../board';
import { BLACK, EMPTY, WHITE, type Board } from '../types';

const empty = (): Board =>
  Array.from({ length: 8 }, () => Array<number>(8).fill(EMPTY) as Board[number]);

describe('minimax', () => {
  it('returns null move on a terminal board', () => {
    const b = empty();
    b[0][0] = BLACK;
    const r = minimax(b, 3, -Infinity, Infinity, BLACK, BLACK);
    expect(r.move).toBeNull();
  });

  it('finds a legal move on the initial board', () => {
    const b = createInitialBoard();
    const r = minimax(b, 1, -Infinity, Infinity, BLACK, BLACK);
    expect(r.move).not.toBeNull();
    const moves = getValidMoves(b, BLACK);
    expect(moves.some((m) => m.row === r.move!.row && m.col === r.move!.col)).toBe(true);
  });

  it('prefers a corner when available', () => {
    const b = empty();
    b[0][1] = WHITE;
    b[0][2] = WHITE;
    b[0][3] = BLACK;
    b[1][0] = BLACK;
    b[2][0] = BLACK;
    b[3][3] = BLACK;
    b[4][4] = WHITE;
    const r = minimax(b, 2, -Infinity, Infinity, BLACK, BLACK);
    expect(r.move).toEqual({ row: 0, col: 0 });
  });

  it('passes when no legal moves but opponent has them', () => {
    const b = createInitialBoard();
    const r = minimax(b, 2, -Infinity, Infinity, BLACK, BLACK);
    expect(typeof r.score).toBe('number');
  });
});

describe('pickAIMove', () => {
  it('returns null when there are no valid moves', () => {
    expect(pickAIMove(createInitialBoard(), [], 1, BLACK)).toBeNull();
  });

  it('returns the only move when there is exactly one', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, BLACK);
    const single = [moves[0]];
    expect(pickAIMove(b, single, 20, BLACK)).toBe(single[0]);
  });

  it('always picks a legal move at level 20', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, BLACK);
    const picked = pickAIMove(b, moves, 20, BLACK);
    expect(picked).not.toBeNull();
    expect(moves).toContain(picked!);
  });

  it('plays a full game without crashing at level 1', () => {
    let b = createInitialBoard();
    let toPlay = BLACK;
    let plies = 0;
    let consecutivePasses = 0;
    while (plies < 80 && consecutivePasses < 2) {
      const moves = getValidMoves(b, toPlay);
      if (moves.length === 0) {
        consecutivePasses++;
      } else {
        consecutivePasses = 0;
        const picked = pickAIMove(b, moves, 1, toPlay)!;
        const next = applyMove(b, picked.row, picked.col, toPlay);
        expect(next).not.toBeNull();
        b = next!;
      }
      toPlay = -toPlay as typeof toPlay;
      plies++;
    }
    expect(consecutivePasses).toBe(2);
  });

  it('plays a full game without crashing at level 20', () => {
    let b = createInitialBoard();
    let toPlay = BLACK;
    let plies = 0;
    let consecutivePasses = 0;
    while (plies < 80 && consecutivePasses < 2) {
      const moves = getValidMoves(b, toPlay);
      if (moves.length === 0) {
        consecutivePasses++;
      } else {
        consecutivePasses = 0;
        const picked = pickAIMove(b, moves, 20, toPlay)!;
        const next = applyMove(b, picked.row, picked.col, toPlay);
        expect(next).not.toBeNull();
        b = next!;
      }
      toPlay = -toPlay as typeof toPlay;
      plies++;
    }
    expect(consecutivePasses).toBe(2);
  });
});
