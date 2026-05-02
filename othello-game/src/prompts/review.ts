/**
 * Prompt templates for the post-game review feature.
 *
 * Two pieces:
 *   - getReviewSystemPrompt(locale): the static, cacheable system block
 *     that defines the persona, rules and 5-section output structure.
 *   - buildReviewUserPrompt(args, locale): the per-game user message
 *     containing the kifu, final disc counts and match metadata.
 *
 * Keeping the system prompt static means Anthropic's prompt-cache hits
 * on every review after the first within ~5 minutes, dropping the
 * input-token cost by an order of magnitude.
 */
import { BLACK, type Color } from '../engine/types';

export type ReviewLocale = 'ja' | 'en';

export interface ReviewArgs {
  /** Kifu in the same numeric encoding the engine uses. */
  kifu: ReadonlyArray<{ color: Color; row: number; col: number }>;
  /** Final disc counts. */
  blackCount: number;
  whiteCount: number;
  /** Display names for the two sides (already localized to `locale`). */
  blackName: string;
  whiteName: string;
  /** Opponent's level (1-20) when AI mode, or undefined for two-player. */
  level?: number;
  /** Difficulty label like 'Beginner' / '初級' (already localized). */
  levelLabel?: string;
  /** Story chapter number (1-20) if applicable. */
  chapter?: number;
}

/* ---------------- Notation helper ---------------- */

function moveToNotation(row: number, col: number): string {
  return `${String.fromCharCode(97 + col)}${row + 1}`;
}

/* ---------------- System prompt ---------------- */

const SYSTEM_JA = `あなたはオセロの上級者で、終局後の対局解説を担当します。
プレイヤーは盤上世界という異界に転生した主人公（黒番）で、20人の達人と順に対戦しています。
解説は **必ず以下の5節構成** で、見出しを Markdown の \`##\` で書いてください：

## 総評
全体の流れと結果を 2〜3 文で。

## 勝敗を分けたポイント
中盤か終盤の決定的な局面を 1〜2 個。手番（黒/白）と座標（例 f5）を明示。

## 悪手・疑問手
3〜5 個まで。各項目で：
- 何手目の何の手か（例: 第18手 d3）
- なぜ悪いか
- より良い代替手の候補

## よかった手
1〜2 個。座標と短い理由。

## 次回への助言
1〜2 文で、プレイヤーが次の対局で意識すべき点。

文体：丁寧だが説教臭くなく、技術的に的確に。冗長な前置きや謝辞は不要。
表記：黒番・白番、手数は \`第N手\` の形式、座標は a1〜h8 の小文字。
盤上世界の世界観を尊重し、対戦相手はキャラ名で呼んで構いません。`;

const SYSTEM_EN = `You are a strong Othello commentator providing a post-game review.
The player is the protagonist (Black) reincarnated into Bansho Sekai, dueling 20 masters in turn.
Your review **must follow this 5-section structure**, with headings as Markdown \`##\`:

## Overview
The flow and result of the game in 2–3 sentences.

## Decisive Moments
1–2 critical positions in the middle or endgame. State the side (Black/White) and the coordinate (e.g. f5).

## Mistakes
3–5 items. For each:
- which move and what it was (e.g. "Move 18: d3")
- why it was bad
- a better alternative

## Good Moves
1–2 items. Coordinates and a short reason.

## Advice for Next Time
1–2 sentences on what the player should focus on.

Tone: friendly but technically precise; no preamble, no thanks, no apologies.
Notation: refer to "Black" / "White", use "Move N" for move numbers, lowercase a1–h8 for coordinates.
You may refer to the opponent by their character name; respect the Bansho Sekai setting.`;

export function buildReviewSystemPrompt(locale: ReviewLocale): string {
  return locale === 'ja' ? SYSTEM_JA : SYSTEM_EN;
}

/* ---------------- User message builder ---------------- */

function colorLabel(color: Color, locale: ReviewLocale): string {
  if (locale === 'ja') return color === BLACK ? '黒' : '白';
  return color === BLACK ? 'Black' : 'White';
}

function formatKifu(
  kifu: ReadonlyArray<{ color: Color; row: number; col: number }>,
  locale: ReviewLocale,
): string {
  // Pair up (Black, White) per move number, formatted "1. f5 / d6"
  const lines: string[] = [];
  for (let i = 0; i < kifu.length; i += 2) {
    const moveNo = i / 2 + 1;
    const black = kifu[i];
    const white = kifu[i + 1];
    const blackStr = black ? moveToNotation(black.row, black.col) : '-';
    const whiteStr = white ? moveToNotation(white.row, white.col) : '-';
    lines.push(`${moveNo}. ${blackStr} / ${whiteStr}`);
  }
  // Also include a flat list for Claude's convenience.
  const flat = kifu
    .map((m) => `${colorLabel(m.color, locale)}:${moveToNotation(m.row, m.col)}`)
    .join(', ');
  return `${lines.join('\n')}\n\n[flat] ${flat}`;
}

export function buildReviewUserPrompt(args: ReviewArgs, locale: ReviewLocale): string {
  const { kifu, blackCount, whiteCount, blackName, whiteName, level, levelLabel, chapter } = args;

  if (locale === 'ja') {
    const matchLine = chapter
      ? `第${chapter}章 — ${blackName}（黒）vs ${whiteName}（白、Lv.${level} ${levelLabel}）`
      : level !== undefined
        ? `フリー対戦 — ${blackName}（黒）vs ${whiteName}（白、Lv.${level} ${levelLabel}）`
        : `二人対戦 — ${blackName}（黒）vs ${whiteName}（白）`;
    return `${matchLine}
最終スコア: 黒 ${blackCount} - ${whiteCount} 白（${kifu.length}手）

棋譜（手数. 黒 / 白）:
${formatKifu(kifu, locale)}

上記の対局を、システムプロンプトの 5 節構成で講評してください。`;
  }

  const matchLine = chapter
    ? `Chapter ${chapter} — ${blackName} (Black) vs ${whiteName} (White, Lv.${level} ${levelLabel})`
    : level !== undefined
      ? `Free match — ${blackName} (Black) vs ${whiteName} (White, Lv.${level} ${levelLabel})`
      : `Two-player match — ${blackName} (Black) vs ${whiteName} (White)`;
  return `${matchLine}
Final score: Black ${blackCount} - ${whiteCount} White (${kifu.length} moves)

Kifu (move#. Black / White):
${formatKifu(kifu, locale)}

Review the game above, following the 5-section structure in the system prompt.`;
}
