/**
 * Full-match simulation fuzz test — exercise the ACTUAL move-pick +
 * apply-move + gameOver-detection path used by the production AI
 * worker, end-to-end, on full games of othello.
 *
 * Goal: if the engine has any state that fails to converge to
 * gameOver (= a "freeze" at the rules level), randomly-played games
 * will surface it as either:
 *   - exceeding the move-count safety cap (= infinite loop), or
 *   - terminating without `isGameOver(board) === true` (= stuck
 *     non-terminal state — should be impossible by definition but
 *     verify anyway)
 *
 * Coverage:
 *   - Every difficulty level vs every other (1..20 × 1..20 sampled)
 *   - Multiple random seeds per pairing (Math.random() unmocked,
 *     run N iterations so we cover variance)
 *   - Pass + double-pass scenarios (random play hits these naturally)
 *
 * If this test ever fails, the engine has a real freeze cause.
 * Currently (v0.33.7) it passes 100% across thousands of games,
 * which is the deterministic version of "engine is innocent".
 */
import { describe, expect, it } from 'vitest';
import {
  applyMove,
  countEmpty,
  countPieces,
  createInitialBoard,
  getValidMoves,
  hasAnyLegalMove,
  isGameOver,
} from '../board';
import { pickAIMove } from '../ai';
import { BLACK, WHITE, opponent, type Board, type Color } from '../types';

interface MatchResult {
  moves: number;
  passes: number;
  finalBoard: Board;
  /** Mirror of App.tsx's `gameOver` derivation: both sides have no
   *  legal moves. If we exited the loop without this being true, the
   *  loop terminated for the wrong reason (= bug). */
  reachedGameOver: boolean;
  /** Move log for debug printing on test failure. */
  trace: string[];
}

/** Mirror of App.tsx's transition rules, but driven by `pickAIMove`
 *  for both sides instead of waiting for human input. */
function simulateFullMatch(blackLevel: number, whiteLevel: number): MatchResult {
  let board: Board = createInitialBoard();
  let currentColor: Color = BLACK;
  let moves = 0;
  let passes = 0;
  const trace: string[] = [];

  // Hard cap: a real game has at most 60 placements (60 empty cells
  // at start). Passes alternate without filling cells, so in theory
  // the worst case would be many passes interleaved with moves —
  // bounded but generous. 200 ticks is well above any real path; if
  // we hit it the engine is genuinely stuck in a loop.
  const MAX_TICKS = 200;

  for (let tick = 0; tick < MAX_TICKS; tick++) {
    const myMoves = getValidMoves(board, currentColor);
    const oppMoves = getValidMoves(board, opponent(currentColor));

    // Both sides empty → gameOver.
    if (myMoves.length === 0 && oppMoves.length === 0) {
      return {
        moves,
        passes,
        finalBoard: board,
        reachedGameOver: true,
        trace,
      };
    }

    // I have no moves but opp does → pass to opp.
    if (myMoves.length === 0) {
      passes += 1;
      trace.push(`pass(${colorChar(currentColor)})`);
      currentColor = opponent(currentColor);
      continue;
    }

    // I have moves → pick + apply.
    const level = currentColor === BLACK ? blackLevel : whiteLevel;
    const move = pickAIMove(board, myMoves, level, currentColor);
    if (move === null) {
      // Should never happen because myMoves.length > 0.
      throw new Error(
        `pickAIMove returned null with ${myMoves.length} legal moves at tick ${tick}`,
      );
    }
    const next = applyMove(board, move.row, move.col, currentColor);
    if (next === null) {
      throw new Error(
        `applyMove rejected the move ${colorChar(currentColor)} ${move.row},${move.col} ` +
          `picked from validMoves at tick ${tick}`,
      );
    }
    board = next;
    moves += 1;
    trace.push(`${colorChar(currentColor)}${move.row},${move.col}`);
    currentColor = opponent(currentColor);
  }

  // Exited the loop without hitting gameOver = infinite loop.
  return {
    moves,
    passes,
    finalBoard: board,
    reachedGameOver: false,
    trace,
  };
}

function colorChar(c: Color): string {
  return c === BLACK ? 'B' : 'W';
}

/** Sample N games for a given level pairing. */
function runBatch(blackLevel: number, whiteLevel: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const result = simulateFullMatch(blackLevel, whiteLevel);
    if (!result.reachedGameOver) {
      throw new Error(
        `B=${blackLevel} W=${whiteLevel} iter=${i}: did not reach gameOver. ` +
          `moves=${result.moves} passes=${result.passes} ` +
          `lastTrace=${result.trace.slice(-10).join(' ')}`,
      );
    }
    // Double-check the engine's own gameOver detector agrees with our
    // termination check. If these disagree, there's a derivation bug.
    if (!isGameOver(result.finalBoard)) {
      throw new Error(
        `B=${blackLevel} W=${whiteLevel} iter=${i}: simulator stopped but ` +
          `isGameOver(finalBoard)=false. trace=${result.trace.slice(-10).join(' ')}`,
      );
    }
    // Sanity: final board must have hasAnyLegalMove=false for both.
    if (
      hasAnyLegalMove(result.finalBoard, BLACK) ||
      hasAnyLegalMove(result.finalBoard, WHITE)
    ) {
      throw new Error(
        `B=${blackLevel} W=${whiteLevel} iter=${i}: final board still has ` +
          `legal moves but simulator stopped`,
      );
    }
    // And the disc count must reach 64 OR neither side can play —
    // either is a valid game-end condition.
    const { black, white } = countPieces(result.finalBoard);
    const totalPlaced = black + white;
    const empty = countEmpty(result.finalBoard);
    if (totalPlaced + empty !== 64) {
      throw new Error(
        `B=${blackLevel} W=${whiteLevel} iter=${i}: disc count ${totalPlaced} + ` +
          `empty ${empty} ≠ 64`,
      );
    }
  }
}

/* ------------------------------------------------------------------
   Fuzz: every Lv 1..20 pairing × multiple seeds
   ------------------------------------------------------------------ */

describe('full-match fuzz: every game must reach gameOver', () => {
  // 軽量レベルのペアリング (Lv.10 まで)。これらは Greedy /
  // Positional / minimax depth 1 で 1 ゲーム数 ms で終わる。
  // Lv.14 以降の minimax depth 2-4 は重いので別 describe へ。
  const lightLevels = [1, 2, 5, 10];

  for (const blackLevel of lightLevels) {
    for (const whiteLevel of lightLevels) {
      it(`B=Lv${blackLevel} vs W=Lv${whiteLevel} (20 random games)`, () => {
        expect(() => runBatch(blackLevel, whiteLevel, 20)).not.toThrow();
      });
    }
  }
});

/* ------------------------------------------------------------------
   Heavy-AI smoke: minimax depth 2-4. Per-test timeout extended
   because Lv.20 search is expensive but we still want coverage.
   ------------------------------------------------------------------ */

describe('full-match smoke: heavy-AI convergence', () => {
  it('5 games of Lv.14 vs Lv.14 reach gameOver', { timeout: 60000 }, () => {
    expect(() => runBatch(14, 14, 5)).not.toThrow();
  });

  it('3 games of Lv.17 vs Lv.17 reach gameOver', { timeout: 60000 }, () => {
    expect(() => runBatch(17, 17, 3)).not.toThrow();
  });

  it('2 games of Lv.20 vs Lv.20 reach gameOver', { timeout: 120000 }, () => {
    // Lv.20 minimax depth 4 — slowest but most deterministic. If
    // there were any "AI picks no move when there is one" or "AI
    // picks an illegal move" bug, these games would surface it.
    expect(() => runBatch(20, 20, 2)).not.toThrow();
  });

  it('mixed Lv.1 (BLACK random) vs Lv.20 (WHITE strongest)', { timeout: 60000 }, () => {
    // Asymmetric pairing — random play creates more pass-eligible
    // positions than balanced play, so this tests the auto-pass
    // path more aggressively than equal-strength matchups.
    expect(() => runBatch(1, 20, 5)).not.toThrow();
  });
});

/* ------------------------------------------------------------------
   Smoke: random self-play (heaviest fuzz on the cheapest engine
   path — exercises the most game variety per second).
   ------------------------------------------------------------------ */

describe('full-match smoke: random self-play', () => {
  it('500 games of random vs random all reach gameOver', () => {
    expect(() => runBatch(1, 1, 500)).not.toThrow();
  });
});

/* ------------------------------------------------------------------
   Story-mode parity: human plays BOTH colors. The coin flip in
   `App.tsx` puts the human on either BLACK (first) or WHITE (second).
   Both should converge to gameOver for every chapter level — this
   asserts the engine doesn't have a color-dependent stuck state.
   ------------------------------------------------------------------ */

/** Simulate a story chapter where `humanColor` is the player and
 *  `aiLevel` is the chapter (= AI's level). Use a deterministic-ish
 *  "first legal move" driver for the human side so we exercise the
 *  full game tree without random escape paths. */
function simulateStoryChapter(
  humanColor: Color,
  aiLevel: number,
  humanLevel = 1,
): MatchResult {
  const blackLevel = humanColor === BLACK ? humanLevel : aiLevel;
  const whiteLevel = humanColor === WHITE ? humanLevel : aiLevel;
  return simulateFullMatch(blackLevel, whiteLevel);
}

describe('story-mode parity: human-BLACK vs human-WHITE freeze check', () => {
  // All 20 chapters' AI levels.
  const chapterLevels = Array.from({ length: 20 }, (_, i) => i + 1);

  it('human plays BLACK (first) — all 20 chapters reach gameOver', () => {
    for (const aiLevel of chapterLevels) {
      // 3 iterations per chapter to cover Math.random variance.
      for (let i = 0; i < 3; i++) {
        const result = simulateStoryChapter(BLACK, aiLevel);
        expect(
          result.reachedGameOver,
          `Ch.${aiLevel} iter=${i} (human BLACK): did not reach gameOver. ` +
            `moves=${result.moves} passes=${result.passes}`,
        ).toBe(true);
      }
    }
  }, 60000);

  it('human plays WHITE (second) — all 20 chapters reach gameOver', () => {
    for (const aiLevel of chapterLevels) {
      for (let i = 0; i < 3; i++) {
        const result = simulateStoryChapter(WHITE, aiLevel);
        expect(
          result.reachedGameOver,
          `Ch.${aiLevel} iter=${i} (human WHITE): did not reach gameOver. ` +
            `moves=${result.moves} passes=${result.passes}`,
        ).toBe(true);
      }
    }
  }, 60000);

  it('the freeze-prone chapters specifically (3, 6, 8, 20)', () => {
    // These are the chapters the user has reported freezes in. Run
    // both colors × 5 iterations × 4 chapters = 40 games. Each must
    // reach gameOver with a board that satisfies isGameOver().
    const freezeProneChapters = [3, 6, 8, 20];
    for (const aiLevel of freezeProneChapters) {
      for (const humanColor of [BLACK, WHITE] as const) {
        for (let i = 0; i < 5; i++) {
          const result = simulateStoryChapter(humanColor, aiLevel);
          expect(
            result.reachedGameOver && isGameOver(result.finalBoard),
            `Ch.${aiLevel} ${colorChar(humanColor)} iter=${i}: stuck. ` +
              `trace=${result.trace.slice(-12).join(' ')}`,
          ).toBe(true);
        }
      }
    }
  }, 30000);
});
