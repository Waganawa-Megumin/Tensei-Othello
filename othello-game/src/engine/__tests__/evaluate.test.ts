import { describe, expect, it } from 'vitest';
import { POSITION_WEIGHTS, evaluate } from '../evaluate';
import { BLACK, EMPTY, WHITE, type Board } from '../types';
import { createInitialBoard } from '../board';

const empty = (): Board =>
  Array.from({ length: 8 }, () => Array<number>(8).fill(EMPTY) as Board[number]);

describe('POSITION_WEIGHTS', () => {
  it('rates corners highest and X-squares lowest', () => {
    expect(POSITION_WEIGHTS[0][0]).toBe(120);
    expect(POSITION_WEIGHTS[0][7]).toBe(120);
    expect(POSITION_WEIGHTS[7][0]).toBe(120);
    expect(POSITION_WEIGHTS[7][7]).toBe(120);
    expect(POSITION_WEIGHTS[1][1]).toBe(-40);
    expect(POSITION_WEIGHTS[6][6]).toBe(-40);
  });
});

describe('evaluate', () => {
  it('returns 0 on the symmetric initial board', () => {
    const b = createInitialBoard();
    expect(evaluate(b, BLACK)).toBe(0);
    expect(evaluate(b, WHITE)).toBe(0);
  });

  it('returns +100000 for a terminal win for the maximizing colour', () => {
    const b = empty();
    b[0][0] = BLACK;
    expect(evaluate(b, BLACK)).toBe(100000);
    expect(evaluate(b, WHITE)).toBe(-100000);
  });

  it('returns 0 on a terminal tie', () => {
    const b = empty();
    b[0][0] = BLACK;
    b[7][7] = WHITE;
    expect(evaluate(b, BLACK)).toBe(0);
  });

  it('rewards owning a corner', () => {
    const b = empty();
    b[3][3] = BLACK;
    b[4][4] = WHITE;
    b[3][4] = BLACK;
    b[4][3] = WHITE;
    const before = evaluate(b, BLACK);
    b[0][0] = BLACK;
    const after = evaluate(b, BLACK);
    expect(after).toBeGreaterThan(before);
  });
});
