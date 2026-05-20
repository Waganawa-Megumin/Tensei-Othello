/**
 * Unit tests for the review prompt builder + annotation coercion.
 *
 * Pins down the v0.36.79 fixes:
 *   - `playerColor` must be reflected in the user prompt so Claude
 *     doesn't hardcode advice for Black when the human was White.
 *   - `MoveAnnotation.betterMove` (optional a1–h8 alternative) round-
 *     trips through `coerceReviewAnnotations`, with invalid notations
 *     dropped instead of failing the whole annotation.
 */
import { describe, expect, it } from 'vitest';
import { BLACK, WHITE } from '../../engine/types';
import {
  buildAnnotateTool,
  buildReviewUserPrompt,
  coerceReviewAnnotations,
  type ReviewArgs,
} from '../review';

const baseArgs = (overrides: Partial<ReviewArgs> = {}): ReviewArgs => ({
  kifu: [
    { color: BLACK, row: 4, col: 5 },
    { color: WHITE, row: 5, col: 5 },
  ],
  blackCount: 33,
  whiteCount: 31,
  blackName: 'ハルキ',
  whiteName: 'いちか',
  playerColor: BLACK,
  ...overrides,
});

describe('buildReviewUserPrompt — player perspective (v0.36.79)', () => {
  it('declares "プレイヤー = 黒番" when playerColor is BLACK (ja)', () => {
    const prompt = buildReviewUserPrompt(baseArgs({ playerColor: BLACK }), 'ja');
    expect(prompt).toContain('プレイヤー = 黒番');
    expect(prompt).not.toContain('プレイヤー = 白番');
  });

  it('declares "プレイヤー = 白番" when playerColor is WHITE (ja)', () => {
    const prompt = buildReviewUserPrompt(baseArgs({ playerColor: WHITE }), 'ja');
    expect(prompt).toContain('プレイヤー = 白番');
    expect(prompt).not.toContain('プレイヤー = 黒番');
  });

  it('falls back to two-player phrasing when playerColor is null (ja)', () => {
    const prompt = buildReviewUserPrompt(baseArgs({ playerColor: null }), 'ja');
    expect(prompt).toContain('二人対戦');
    expect(prompt).not.toContain('プレイヤー = 黒番');
    expect(prompt).not.toContain('プレイヤー = 白番');
  });

  it('declares Player = White in English when playerColor is WHITE', () => {
    const prompt = buildReviewUserPrompt(baseArgs({ playerColor: WHITE }), 'en');
    expect(prompt).toContain('Player = White');
    expect(prompt).not.toContain('Player = Black');
  });
});

describe('annotate_othello_game tool schema (v0.36.79)', () => {
  it('annotation item schema includes optional betterMove with a1-h8 pattern', () => {
    const tool = buildAnnotateTool() as {
      input_schema: {
        properties: {
          annotations: {
            items: {
              properties: { betterMove?: { type: string; pattern: string } };
            };
          };
        };
      };
    };
    const item = tool.input_schema.properties.annotations.items;
    expect(item.properties.betterMove).toBeDefined();
    expect(item.properties.betterMove?.type).toBe('string');
    expect(item.properties.betterMove?.pattern).toBe('^[a-h][1-8]$');
  });
});

describe('coerceReviewAnnotations — betterMove handling (v0.36.79)', () => {
  it('passes through a valid betterMove notation', () => {
    const parsed = coerceReviewAnnotations({
      summary: 's',
      improvements: 'i',
      annotations: [
        { moveIndex: 5, quality: 'mistake', comment: 'c', betterMove: 'e3' },
      ],
    });
    expect(parsed?.annotations[0].betterMove).toBe('e3');
  });

  it('drops a malformed betterMove but keeps the rest of the annotation', () => {
    const parsed = coerceReviewAnnotations({
      summary: 's',
      improvements: 'i',
      annotations: [
        { moveIndex: 5, quality: 'mistake', comment: 'c', betterMove: 'x9' },
      ],
    });
    expect(parsed?.annotations[0].betterMove).toBeUndefined();
    expect(parsed?.annotations[0].comment).toBe('c');
  });

  it('omits betterMove entirely when not provided (good / brilliant moves)', () => {
    const parsed = coerceReviewAnnotations({
      summary: 's',
      improvements: 'i',
      annotations: [{ moveIndex: 5, quality: 'good', comment: 'c' }],
    });
    expect(parsed?.annotations[0].betterMove).toBeUndefined();
    expect('betterMove' in parsed!.annotations[0]).toBe(false);
  });
});
