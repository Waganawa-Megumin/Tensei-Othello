/**
 * Reproduction tests for the recurring "endgame freeze" bug.
 *
 * Goal: walk a real game's last few moves through both
 *   (1) the pure engine functions (board.ts), and
 *   (2) a state-machine model that mirrors App.tsx's state
 *       transition rules — i.e. `currentColor`, `passInfo`, the
 *       auto-pass effect, and the gameOver derivation.
 *
 * Three endgame topologies are covered (matching the user's repro
 * matrix):
 *   a) 1 empty cell, current side can play   → board fills, GAME_OVER
 *   b) 1 empty cell, current side passes     → opp plays, GAME_OVER
 *   c) 2+ empty cells, neither side can play → double-pass GAME_OVER
 *
 * If any of these gets stuck (no transition to GAME_OVER), the test
 * surfaces it as a deterministic failure so we can find the root cause
 * without depending on the device-side freeze report.
 */
import { describe, expect, it } from 'vitest';
import {
  applyMove,
  countEmpty,
  countPieces,
  getValidMoves,
  hasAnyLegalMove,
  isGameOver,
} from '../board';
import { BLACK, EMPTY, WHITE, opponent, type Board, type Color } from '../types';

const empty = (): Board =>
  Array.from({ length: 8 }, () => Array<number>(8).fill(EMPTY) as Board[number]);

/* ------------------------------------------------------------------
   Hand-crafted endgame fixtures
   ------------------------------------------------------------------ */

/**
 * Case A: exactly one empty cell, the side to move (BLACK) can play
 * there to fill the board.
 *
 * Layout:
 *   row 0: all BLACK
 *   row 1-6: alternating fills with one cell at (3,3) reserved
 *   row 7: all WHITE except (3,3) is the only empty
 *
 * We just make sure of: 63 stones, 1 empty, BLACK has a legal move
 * at the empty cell. The exact disc pattern doesn't matter — what
 * matters is that the move is legal and after it the board is full.
 */
function fixtureA(): { board: Board; emptyCell: { row: number; col: number } } {
  const b = empty();
  // Fill everything BLACK first.
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b[r][c] = BLACK;
  // Carve out (3,1) as the empty cell. To make BLACK able to play
  // there, the row needs a flippable WHITE line bookended by a BLACK
  // anchor: B . W W W W W B  → BLACK at (3,1) flips (3,2)..(3,6).
  b[3][1] = EMPTY;
  for (let c = 2; c <= 6; c++) b[3][c] = WHITE;
  b[3][7] = BLACK;
  return { board: b, emptyCell: { row: 3, col: 1 } };
}

/**
 * Case B: exactly one empty cell, BLACK to move BUT BLACK can't play
 * there. WHITE can. So the flow is: BLACK passes → WHITE plays → board
 * is full → GAME_OVER.
 *
 * Construct: row of WHITE-WHITE-WHITE-...-WHITE, with one empty cell
 * adjacent to BLACK on one side. BLACK can't drop because there's no
 * sandwiching of WHITE behind the empty cell (BLACK . WHITE only — no
 * BLACK after the WHITE line). WHITE can drop because the empty cell
 * has BLACK on one side and a WHITE further along in the OTHER
 * direction.
 */
function fixtureB(): { board: Board; emptyCell: { row: number; col: number } } {
  const b = empty();
  // Fill the whole board with WHITE so neither side can normally play.
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b[r][c] = WHITE;
  // Carve out (0,0) as empty.
  b[0][0] = EMPTY;
  // To make it WHITE's-only legal move, we need BLACK pieces somewhere
  // sandwiching from (0,0). Place BLACK at (0,1) and a WHITE further
  // out — but the row is already WHITE everywhere. Instead, replace
  // (0,1) with BLACK; then WHITE at (0,0) flips (0,1)? No — WHITE at
  // (0,0) needs WHITE further along to anchor. (0,2)..(0,7) are all
  // WHITE, so WHITE drops at (0,0): line going right is BLACK at (0,1)
  // followed by WHITE at (0,2). That's a valid WHITE move. ✓
  // Now BLACK at (0,0): line going right is BLACK at (0,1) — same color
  // first → no flip. No other direction works (column is all WHITE,
  // diagonal goes WHITE all the way). So BLACK has no move at (0,0).
  b[0][1] = BLACK;
  return { board: b, emptyCell: { row: 0, col: 0 } };
}

/**
 * Case C: 2+ empty cells, NEITHER side can play. The classic double-
 * pass stalemate.
 *
 * Easiest construction: a pure single-color filled region with two
 * empty corners that have no flippable opponents adjacent.
 */
function fixtureC(): { board: Board; emptyCount: number } {
  const b = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b[r][c] = BLACK;
  // Two empty cells in opposite corners. Neither side can play because
  // for any drop, the surrounding stones are all the same color (no
  // sandwich possible). BLACK can't drop (own color all around → no
  // flips). WHITE can't drop (no WHITE anchor anywhere on the board).
  b[0][0] = EMPTY;
  b[7][7] = EMPTY;
  return { board: b, emptyCount: 2 };
}

/* ------------------------------------------------------------------
   Engine-layer assertions: pure board → game-over check
   ------------------------------------------------------------------ */

describe('engine: endgame freeze repro (pure functions)', () => {
  it('case A: BLACK fills the last cell → board full, isGameOver=true', () => {
    const { board, emptyCell } = fixtureA();
    expect(countEmpty(board)).toBe(1);
    expect(hasAnyLegalMove(board, BLACK)).toBe(true);

    // BLACK's legal move is the empty cell.
    const blackMoves = getValidMoves(board, BLACK);
    expect(blackMoves).toHaveLength(1);
    expect(blackMoves[0].row).toBe(emptyCell.row);
    expect(blackMoves[0].col).toBe(emptyCell.col);

    // Apply it.
    const next = applyMove(board, emptyCell.row, emptyCell.col, BLACK);
    expect(next).not.toBeNull();
    expect(countEmpty(next!)).toBe(0);

    // After the move: board full, neither side can move, isGameOver=true.
    expect(hasAnyLegalMove(next!, BLACK)).toBe(false);
    expect(hasAnyLegalMove(next!, WHITE)).toBe(false);
    expect(isGameOver(next!)).toBe(true);
  });

  it('case B: BLACK passes, WHITE plays the last cell → GAME_OVER', () => {
    const { board, emptyCell } = fixtureB();
    expect(countEmpty(board)).toBe(1);

    // BLACK has no legal move.
    expect(hasAnyLegalMove(board, BLACK)).toBe(false);
    // WHITE has the one legal move.
    const whiteMoves = getValidMoves(board, WHITE);
    expect(whiteMoves).toHaveLength(1);
    expect(whiteMoves[0].row).toBe(emptyCell.row);
    expect(whiteMoves[0].col).toBe(emptyCell.col);

    // The "is game over yet" test BEFORE the pass: only one side has a
    // move, so isGameOver should be FALSE (game still has play left).
    expect(isGameOver(board)).toBe(false);

    // Apply WHITE's move.
    const next = applyMove(board, emptyCell.row, emptyCell.col, WHITE);
    expect(next).not.toBeNull();
    expect(countEmpty(next!)).toBe(0);
    expect(isGameOver(next!)).toBe(true);
  });

  it('case C: 2+ empty cells, neither side can play → isGameOver=true immediately', () => {
    const { board, emptyCount } = fixtureC();
    expect(countEmpty(board)).toBe(emptyCount);
    expect(emptyCount).toBeGreaterThanOrEqual(2);

    // Both sides have zero moves.
    expect(hasAnyLegalMove(board, BLACK)).toBe(false);
    expect(hasAnyLegalMove(board, WHITE)).toBe(false);

    // Engine must report game over even though the board isn't full.
    expect(isGameOver(board)).toBe(true);
  });
});

/* ------------------------------------------------------------------
   App-state transition model
   ------------------------------------------------------------------ */

/**
 * Mirror of App.tsx's relevant state shape. The actual file uses
 * separate `useState` slots; here we collapse them into one record so
 * the transition function reads like the production logic.
 */
interface AppState {
  board: Board;
  currentColor: Color;
  passInfo: Color | null;
  /** Match-end flag, derived from board+currentColor + resigned. We
   *  test it against `(noCurrent && noOpp) || resigned`, mirroring the
   *  exact derivation at App.tsx line 1732. */
  resigned: boolean;
}

interface DerivedState {
  noCurrent: boolean;
  noOpp: boolean;
  gameOver: boolean;
}

/** Compute derived flags exactly the way App.tsx does. */
function derive(s: AppState): DerivedState {
  const noCurrent = !hasAnyLegalMove(s.board, s.currentColor);
  const noOpp = !hasAnyLegalMove(s.board, opponent(s.currentColor));
  const gameOver = (noCurrent && noOpp) || s.resigned;
  return { noCurrent, noOpp, gameOver };
}

/**
 * One discrete tick of App's transition system. Given a state, return
 * the next state — picking from:
 *   - GAME_OVER: nothing to do
 *   - PASS: current side has no move, opponent does → flip turn
 *   - MOVE: current side has at least one move → play their first one
 *           (model: deterministic move, opp plays the only legal
 *           non-passing move)
 *
 * Returns `null` if the system is stuck (no valid next state) — that
 * is exactly the "freeze" we're hunting. Also returns `null` when
 * gameOver is reached so the driver loop can stop.
 */
function step(
  s: AppState,
  driver: (board: Board, color: Color) => { row: number; col: number } | null,
): AppState | null {
  const d = derive(s);
  if (d.gameOver) return null; // terminal

  if (d.noCurrent && !d.noOpp) {
    // Auto-pass: flip currentColor without changing board.
    return {
      ...s,
      currentColor: opponent(s.currentColor),
      passInfo: null, // App clears it after the 1.6s timer
    };
  }

  if (!d.noCurrent) {
    const move = driver(s.board, s.currentColor);
    if (!move) return null; // driver failed
    const next = applyMove(s.board, move.row, move.col, s.currentColor);
    if (!next) return null; // illegal move
    return {
      ...s,
      board: next,
      currentColor: opponent(s.currentColor),
    };
  }

  // noCurrent && noOpp ⇒ gameOver should be true above. If we got
  // here, the derivation is broken — surface as stuck.
  return null;
}

/**
 * Run the transition function up to N steps and return the final
 * state. `null` means it didn't terminate (= the freeze).
 */
function runToTermination(
  initial: AppState,
  driver: (board: Board, color: Color) => { row: number; col: number } | null,
  maxSteps = 5,
): { steps: number; state: AppState; reachedGameOver: boolean } | null {
  let s = initial;
  for (let i = 0; i < maxSteps; i++) {
    const d = derive(s);
    if (d.gameOver) return { steps: i, state: s, reachedGameOver: true };
    const next = step(s, driver);
    if (next === null) {
      const stillD = derive(s);
      return stillD.gameOver
        ? { steps: i, state: s, reachedGameOver: true }
        : null;
    }
    s = next;
  }
  return null;
}

/** Driver that picks the first legal move (deterministic). */
function firstLegalDriver(board: Board, color: Color): { row: number; col: number } | null {
  const moves = getValidMoves(board, color);
  if (moves.length === 0) return null;
  return { row: moves[0].row, col: moves[0].col };
}

describe('app-state transition model: endgame must reach GAME_OVER', () => {
  it('case A: BLACK to play the last cell → 1 step → GAME_OVER', () => {
    const { board } = fixtureA();
    const result = runToTermination(
      { board, currentColor: BLACK, passInfo: null, resigned: false },
      firstLegalDriver,
    );
    expect(result).not.toBeNull();
    expect(result!.reachedGameOver).toBe(true);
    expect(countEmpty(result!.state.board)).toBe(0);
    expect(countPieces(result!.state.board).black + countPieces(result!.state.board).white).toBe(64);
  });

  it('case B: BLACK passes → WHITE plays the last cell → GAME_OVER', () => {
    const { board } = fixtureB();
    const result = runToTermination(
      { board, currentColor: BLACK, passInfo: null, resigned: false },
      firstLegalDriver,
    );
    expect(result).not.toBeNull();
    expect(result!.reachedGameOver).toBe(true);
    expect(countEmpty(result!.state.board)).toBe(0);
    // Should have taken exactly 2 transitions: pass + play.
    expect(result!.steps).toBe(2);
  });

  it('case C: double-pass stalemate → GAME_OVER on tick 0 (state already terminal)', () => {
    const { board } = fixtureC();
    const result = runToTermination(
      { board, currentColor: BLACK, passInfo: null, resigned: false },
      firstLegalDriver,
    );
    expect(result).not.toBeNull();
    expect(result!.reachedGameOver).toBe(true);
    expect(result!.steps).toBe(0); // gameOver detected without any transition
    // Board still has 2 empty cells — gameOver due to no-moves, not full.
    expect(countEmpty(result!.state.board)).toBe(2);
  });

  it('case C variant: WHITE to move first → still terminates immediately', () => {
    const { board } = fixtureC();
    const result = runToTermination(
      { board, currentColor: WHITE, passInfo: null, resigned: false },
      firstLegalDriver,
    );
    expect(result).not.toBeNull();
    expect(result!.reachedGameOver).toBe(true);
    expect(result!.steps).toBe(0);
  });
});

/* ------------------------------------------------------------------
   Worker contract: validMoves=[] should resolve null, not hang
   ------------------------------------------------------------------ */

describe('worker contract: pickAIMove on empty validMoves', () => {
  it('returns null when given no legal moves — never throws or hangs', async () => {
    const { pickAIMove } = await import('../ai');
    const { board } = fixtureC();
    // Both sides empty; ask the AI for any color.
    expect(pickAIMove(board, [], 1, BLACK)).toBeNull();
    expect(pickAIMove(board, [], 20, WHITE)).toBeNull();
    // And from the engine's getValidMoves (the worker's actual path):
    expect(getValidMoves(board, BLACK)).toEqual([]);
    expect(getValidMoves(board, WHITE)).toEqual([]);
  });
});
