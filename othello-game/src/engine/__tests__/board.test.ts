import { describe, expect, it } from 'vitest';
import {
  applyMove,
  cloneBoard,
  countEmpty,
  countPieces,
  createInitialBoard,
  getFlipsForMove,
  getValidMoves,
  getWinner,
  hasAnyLegalMove,
  inBounds,
  isGameOver,
} from '../board';
import { BLACK, EMPTY, WHITE, opponent, type Board } from '../types';

const empty = (): Board =>
  Array.from({ length: 8 }, () => Array<number>(8).fill(EMPTY) as Board[number]);

describe('createInitialBoard', () => {
  it('places exactly four discs in the center cross pattern', () => {
    const b = createInitialBoard();
    expect(b[3][3]).toBe(WHITE);
    expect(b[4][4]).toBe(WHITE);
    expect(b[3][4]).toBe(BLACK);
    expect(b[4][3]).toBe(BLACK);
    expect(countPieces(b)).toEqual({ black: 2, white: 2 });
    expect(countEmpty(b)).toBe(60);
  });
});

describe('opponent', () => {
  it('flips black/white', () => {
    expect(opponent(BLACK)).toBe(WHITE);
    expect(opponent(WHITE)).toBe(BLACK);
  });
});

describe('inBounds', () => {
  it('detects in/out of bounds', () => {
    expect(inBounds(0, 0)).toBe(true);
    expect(inBounds(7, 7)).toBe(true);
    expect(inBounds(-1, 0)).toBe(false);
    expect(inBounds(8, 0)).toBe(false);
    expect(inBounds(0, 8)).toBe(false);
  });
});

describe('getFlipsForMove', () => {
  it('returns no flips on the four opening squares for the wrong colour', () => {
    const b = createInitialBoard();
    expect(getFlipsForMove(b, 3, 3, BLACK)).toEqual([]);
  });

  it('returns the standard four black opening moves', () => {
    const b = createInitialBoard();
    expect(getFlipsForMove(b, 2, 3, BLACK)).toEqual([{ row: 3, col: 3 }]);
    expect(getFlipsForMove(b, 3, 2, BLACK)).toEqual([{ row: 3, col: 3 }]);
    expect(getFlipsForMove(b, 4, 5, BLACK)).toEqual([{ row: 4, col: 4 }]);
    expect(getFlipsForMove(b, 5, 4, BLACK)).toEqual([{ row: 4, col: 4 }]);
  });

  it('flips a horizontal line', () => {
    const b = empty();
    b[3][2] = BLACK;
    b[3][3] = WHITE;
    b[3][4] = WHITE;
    b[3][5] = WHITE;
    const flips = getFlipsForMove(b, 3, 6, BLACK);
    expect(flips).toEqual([
      { row: 3, col: 5 },
      { row: 3, col: 4 },
      { row: 3, col: 3 },
    ]);
  });

  it('flips a diagonal line', () => {
    const b = empty();
    b[2][2] = BLACK;
    b[3][3] = WHITE;
    b[4][4] = WHITE;
    const flips = getFlipsForMove(b, 5, 5, BLACK);
    expect(flips).toEqual([
      { row: 4, col: 4 },
      { row: 3, col: 3 },
    ]);
  });

  it('does not flip when line is open', () => {
    const b = empty();
    b[3][3] = WHITE;
    b[3][4] = WHITE;
    expect(getFlipsForMove(b, 3, 5, BLACK)).toEqual([]);
  });

  it('returns no flips on an occupied square', () => {
    const b = createInitialBoard();
    expect(getFlipsForMove(b, 3, 4, WHITE)).toEqual([]);
  });

  it('flips along multiple directions in one move', () => {
    const b = empty();
    b[2][3] = BLACK;
    b[4][3] = BLACK;
    b[3][2] = BLACK;
    b[3][4] = BLACK;
    b[3][3] = WHITE;
    b[2][2] = BLACK;
    b[4][4] = BLACK;
    b[4][2] = BLACK;
    b[2][4] = BLACK;
    expect(getFlipsForMove(b, 3, 3, BLACK)).toEqual([]);
  });
});

describe('getValidMoves', () => {
  it('returns the four standard openings for black on the initial board', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, BLACK);
    const keys = moves.map((m) => `${m.row},${m.col}`).sort();
    expect(keys).toEqual(['2,3', '3,2', '4,5', '5,4']);
    for (const m of moves) {
      expect(m.flips).toHaveLength(1);
    }
  });

  it('returns four moves for white on the initial board', () => {
    const b = createInitialBoard();
    expect(getValidMoves(b, WHITE)).toHaveLength(4);
  });

  it('returns an empty array for a colour with no legal moves', () => {
    const b = empty();
    b[0][0] = BLACK;
    expect(getValidMoves(b, BLACK)).toEqual([]);
    expect(getValidMoves(b, WHITE)).toEqual([]);
  });
});

describe('applyMove', () => {
  it('returns a new board with the move and flips applied', () => {
    const b = createInitialBoard();
    const next = applyMove(b, 2, 3, BLACK);
    expect(next).not.toBeNull();
    expect(next![2][3]).toBe(BLACK);
    expect(next![3][3]).toBe(BLACK);
    expect(b[3][3]).toBe(WHITE); // original board untouched
  });

  it('returns null for an illegal move', () => {
    const b = createInitialBoard();
    expect(applyMove(b, 0, 0, BLACK)).toBeNull();
    expect(applyMove(b, 3, 3, BLACK)).toBeNull();
  });
});

describe('cloneBoard', () => {
  it('produces a deep copy', () => {
    const b = createInitialBoard();
    const c = cloneBoard(b);
    c[0][0] = BLACK;
    expect(b[0][0]).toBe(EMPTY);
  });
});

describe('hasAnyLegalMove / isGameOver / getWinner', () => {
  it('detects mid-game state', () => {
    const b = createInitialBoard();
    expect(hasAnyLegalMove(b, BLACK)).toBe(true);
    expect(isGameOver(b)).toBe(false);
  });

  it('detects an empty (filled) board with no moves as game over', () => {
    const b = empty();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b[r][c] = BLACK;
    expect(isGameOver(b)).toBe(true);
    expect(getWinner(b)).toBe(BLACK);
  });

  it('returns EMPTY winner on a tie', () => {
    const b = empty();
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) b[r][c] = (r * 8 + c) % 2 === 0 ? BLACK : WHITE;
    expect(getWinner(b)).toBe(EMPTY);
  });
});

describe('countPieces', () => {
  it('counts both colours independently', () => {
    const b = empty();
    b[0][0] = BLACK;
    b[0][1] = BLACK;
    b[7][7] = WHITE;
    expect(countPieces(b)).toEqual({ black: 2, white: 1 });
  });
});
