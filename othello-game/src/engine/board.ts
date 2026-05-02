import {
  BLACK,
  WHITE,
  EMPTY,
  type Board,
  type Color,
  type Counts,
  type Move,
  type ValidMove,
  opponent,
} from './types';

export const BOARD_SIZE = 8;

const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function createInitialBoard(): Board {
  const b: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array<number>(BOARD_SIZE).fill(EMPTY) as Board[number],
  );
  b[3][3] = WHITE;
  b[3][4] = BLACK;
  b[4][3] = BLACK;
  b[4][4] = WHITE;
  return b;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getFlipsForMove(
  board: Board,
  row: number,
  col: number,
  color: Color,
): Move[] {
  if (!inBounds(row, col) || board[row][col] !== EMPTY) return [];
  const opp = opponent(color);
  const all: Move[] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const line: Move[] = [];
    let r = row + dr;
    let c = col + dc;
    while (inBounds(r, c) && board[r][c] === opp) {
      line.push({ row: r, col: c });
      r += dr;
      c += dc;
    }
    if (line.length > 0 && inBounds(r, c) && board[r][c] === color) {
      all.push(...line);
    }
  }
  return all;
}

export function getValidMoves(board: Board, color: Color): ValidMove[] {
  const moves: ValidMove[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const flips = getFlipsForMove(board, r, c, color);
      if (flips.length > 0) {
        moves.push({ row: r, col: c, flips });
      }
    }
  }
  return moves;
}

export function hasAnyLegalMove(board: Board, color: Color): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (getFlipsForMove(board, r, c, color).length > 0) return true;
    }
  }
  return false;
}

export function applyMove(
  board: Board,
  row: number,
  col: number,
  color: Color,
): Board | null {
  const flips = getFlipsForMove(board, row, col, color);
  if (flips.length === 0) return null;
  const next = cloneBoard(board);
  next[row][col] = color;
  for (const { row: fr, col: fc } of flips) {
    next[fr][fc] = color;
  }
  return next;
}

export function countPieces(board: Board): Counts {
  let black = 0;
  let white = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = board[r][c];
      if (v === BLACK) black++;
      else if (v === WHITE) white++;
    }
  }
  return { black, white };
}

export function countEmpty(board: Board): number {
  let n = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) n++;
    }
  }
  return n;
}

export function isGameOver(board: Board): boolean {
  return !hasAnyLegalMove(board, BLACK) && !hasAnyLegalMove(board, WHITE);
}

export function getWinner(board: Board): Color | typeof EMPTY {
  const { black, white } = countPieces(board);
  if (black > white) return BLACK;
  if (white > black) return WHITE;
  return EMPTY;
}
