export const BLACK = 1 as const;
export const WHITE = -1 as const;
export const EMPTY = 0 as const;

export type Disc = typeof BLACK | typeof WHITE | typeof EMPTY;
export type Color = typeof BLACK | typeof WHITE;

export type Board = Disc[][];

export interface Move {
  row: number;
  col: number;
}

export interface ValidMove extends Move {
  flips: Move[];
}

export interface Counts {
  black: number;
  white: number;
}

export interface GameStatus {
  board: Board;
  currentColor: Color;
  counts: Counts;
  legalMoves: ValidMove[];
  isGameOver: boolean;
  winner: Color | typeof EMPTY | null;
}

export function opponent(color: Color): Color {
  return -color as Color;
}
