/**
 * Prompt templates for the post-game review feature.
 *
 * Reviews are now produced as structured annotations via Anthropic's
 * tool-use API. Claude returns a `ReviewAnnotations` object with a
 * short summary, an improvement-overview, and a per-move list of
 * quality + comment. The client renders this in-place on the board
 * (colored rings) and inline (per-move comment under the replay
 * strip), so the user doesn't have to read a wall of text.
 *
 * The static system prompt + tool schema benefit from prompt caching
 * once `cache_control: ephemeral` is set on the system block.
 */
import { BLACK, WHITE, type Color } from '../engine/types';

export type ReviewLocale = 'ja' | 'en';

/* ---------------- Structured review types ---------------- */

/**
 * Quality rating for a single move. Ordered roughly best-to-worst:
 *
 *   brilliant   — surprising, hard to find, clearly the best.
 *   good        — solid, theory-aligned, clearly OK.
 *   neutral     — fine, no commentary worth attaching.
 *   inaccuracy  — slightly suboptimal, a small slip.
 *   mistake     — meaningful loss of position / discs.
 *   blunder     — game-changing error.
 */
export type MoveQuality =
  | 'brilliant'
  | 'good'
  | 'neutral'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder';

export interface MoveAnnotation {
  /** 0-based index into the kifu array. */
  moveIndex: number;
  quality: MoveQuality;
  /** 1–2 sentence comment, in the user's locale. */
  comment: string;
  /** Optional alternative move (lowercase a1–h8 notation, e.g. "e3")
   *  the player could have made instead. Only set when `quality` is
   *  `inaccuracy` / `mistake` / `blunder`; omitted for good / brilliant
   *  / neutral moves where no better alternative is being suggested.
   *  Always references the side that actually played `moveIndex`.
   *  (v0.36.79) */
  betterMove?: string;
}

export interface ReviewAnnotations {
  /** 2–3 sentence overall summary of the match. */
  summary: string;
  /** 1–2 sentence overview of what to improve next time. */
  improvements: string;
  /** Optional pointers, all 0-based indices into the kifu. */
  bestMoveIndex?: number;
  worstMoveIndex?: number;
  turningPointIndex?: number;
  /** Annotated key moves. Skip neutral / unremarkable moves. */
  annotations: MoveAnnotation[];
}

export interface ReviewArgs {
  /** Kifu in the same numeric encoding the engine uses. */
  kifu: ReadonlyArray<{ color: Color; row: number; col: number }>;
  /** Final disc counts. */
  blackCount: number;
  whiteCount: number;
  /** Display names for the two sides (already localized to `locale`). */
  blackName: string;
  whiteName: string;
  /** Which side is the human player whose perspective the review should
   *  take. BLACK or WHITE for AI matches; `null` for two-player matches
   *  where both sides are humans and the review should stay neutral.
   *  Up to v0.36.78 this was implicitly hardcoded to BLACK in the
   *  prompt — leading to white-side advice being inverted when the
   *  human took the white pieces. (v0.36.79) */
  playerColor: Color | null;
  /** Opponent's level (1-20) when AI mode, or undefined for two-player. */
  level?: number;
  /** Difficulty label like 'Beginner' / '初級' (already localized). */
  levelLabel?: string;
  /** Story chapter number (1-20) if applicable. */
  chapter?: number;
}

/* ---------------- Tool schema for Anthropic ---------------- */

/**
 * The single tool the model is forced to call. Returning the review
 * via tool_choice guarantees we get JSON matching this shape (no
 * extra preamble, no markdown wrapping, no need to parse free text).
 *
 * The shape mirrors `ReviewAnnotations` exactly so the client can
 * cast the tool input to the typed object.
 */
export const ANNOTATE_TOOL_NAME = 'annotate_othello_game';

export function buildAnnotateTool(): Record<string, unknown> {
  return {
    name: ANNOTATE_TOOL_NAME,
    description:
      'Return a structured Othello post-game review. Pick 5–12 key moves to annotate; skip ordinary opening moves and obviously-best forced moves. The "player" is the side declared in the user message (could be Black or White, or absent in two-player matches). Use the user-facing locale (matching the kifu summary line).',
    input_schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: '2–3 sentence overall summary of the match flow and result.',
        },
        improvements: {
          type: 'string',
          description: '1–2 sentence advice on what the player should focus on next time.',
        },
        bestMoveIndex: {
          type: 'integer',
          description:
            "0-based index into the kifu array of the player's strongest move. The player's color is declared in the user message.",
        },
        worstMoveIndex: {
          type: 'integer',
          description:
            "0-based index of the player's biggest mistake. The player's color is declared in the user message.",
        },
        turningPointIndex: {
          type: 'integer',
          description: '0-based index of the move that decided the game.',
        },
        annotations: {
          type: 'array',
          description:
            "Annotated moves, in chronological order. Focus on the player (whichever color was declared in the user message) but include opponent's pivotal moves too. 5–12 items total. For each inaccuracy / mistake / blunder, set `betterMove` to the lowercase a1–h8 notation of a stronger move the same side could have played.",
          items: {
            type: 'object',
            properties: {
              moveIndex: {
                type: 'integer',
                description: '0-based index into the kifu array.',
              },
              quality: {
                type: 'string',
                enum: ['brilliant', 'good', 'neutral', 'inaccuracy', 'mistake', 'blunder'],
              },
              comment: {
                type: 'string',
                description: '1–2 sentence comment in the user-facing locale.',
              },
              betterMove: {
                type: 'string',
                description:
                  "Lowercase a1–h8 notation of a stronger alternative move the SAME side that played `moveIndex` could have made instead. REQUIRED whenever quality is 'inaccuracy', 'mistake', or 'blunder'. Omit for 'good' / 'brilliant' / 'neutral'. Must be a legal move at that point in the game.",
                pattern: '^[a-h][1-8]$',
              },
            },
            required: ['moveIndex', 'quality', 'comment'],
          },
        },
      },
      required: ['summary', 'improvements', 'annotations'],
    },
  };
}

/* ---------------- Notation helper ---------------- */

function moveToNotation(row: number, col: number): string {
  return `${String.fromCharCode(97 + col)}${row + 1}`;
}

/* ---------------- System prompt ---------------- */

const SYSTEM_JA = `あなたはオセロの上級者で、終局後の対局解説を担当します。
プレイヤーは盤上世界という異界に召喚された主人公で、20人の達人と順に対戦しています。

**プレイヤーが黒番か白番か、二人対戦かは、毎回のユーザーメッセージで明示されます**。アドバイスは必ずユーザーメッセージで宣言された "プレイヤー側" の視点で行ってください。逆側のアドバイスを混ぜないこと。

ユーザーは長文を読みません。コメントは盤面の各手にバッジとして表示されるので、**1 手につき 1〜2 文の短い日本語コメント**で十分です。

注釈の量: 5〜12 手。すべての手に注釈をつける必要はありません（neutral な序盤や強制手はスキップ）。プレイヤー側の手を中心に、勝敗を分けた相手の手も拾ってください。

quality の使い分け:
- brilliant: 一瞬では見えない好手。Lv.15+ の AI でも稀
- good: 標準的だが正しく打てた手
- neutral: 注釈不要のニュートラルな手（基本的に annotations には入れない）
- inaccuracy: わずかな緩み、小さなロス
- mistake: 明確に位置や石数を損ねた手
- blunder: 致命的なミス、勝敗を覆した手

座標: a1〜h8 の小文字記法を comment 内で参照可（例: 「f5 を取られた」）。
**候補手 (betterMove)**: quality が inaccuracy / mistake / blunder のときは必ず \`betterMove\` フィールドに「同じ側がそこで打てた、より強い別の合法手」を a1〜h8 記法で入れてください (例: \`"betterMove": "c4"\`)。good / brilliant / neutral では省略。
表記: 黒番／白番、対戦相手はキャラ名で呼んで構いません。
出力: 必ず annotate_othello_game ツールで返してください。テキスト返答は禁止。`;

const SYSTEM_EN = `You are a strong Othello commentator providing a post-game review.
The player is the protagonist summoned into Bansho Sekai, dueling 20 masters in turn.

**The user message will declare which color the player took (Black or White), or that it was a two-player match**. All advice must be from that declared player-side's perspective — never mix in advice for the opposite side.

The user does not read long text. Comments are surfaced as inline badges on the board next to the move, so **1–2 short sentences per move is enough**.

Annotation count: 5–12 moves. You do NOT need to annotate every move (skip neutral openings and forced moves). Focus on the player's moves but include the opponent's pivotal moves too.

Quality scale:
- brilliant: a hard-to-see best move. Rare even for Lv.15+ AI
- good: solid, theory-aligned, correctly played
- neutral: unremarkable; usually skip these in annotations
- inaccuracy: a small slip
- mistake: a clear positional or material loss
- blunder: a game-changing error

Notation: lowercase a1–h8. You may reference squares in comments (e.g., "lost f5").
**Better-move (betterMove)**: whenever quality is inaccuracy / mistake / blunder, you MUST set \`betterMove\` to a stronger legal alternative the SAME side could have played there, in a1–h8 notation (e.g. \`"betterMove": "c4"\`). Omit it for good / brilliant / neutral.
Output: you MUST call the annotate_othello_game tool. No free-text replies.`;

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
  // Indexed flat list: moveIndex matches the array index Claude must
  // use in moveIndex / bestMoveIndex / worstMoveIndex / turningPointIndex.
  const indexed = kifu
    .map(
      (m, i) =>
        `${i}: ${colorLabel(m.color, locale)} ${moveToNotation(m.row, m.col)}`,
    )
    .join('\n');
  return indexed;
}

export function buildReviewUserPrompt(args: ReviewArgs, locale: ReviewLocale): string {
  const {
    kifu,
    blackCount,
    whiteCount,
    blackName,
    whiteName,
    playerColor,
    level,
    levelLabel,
    chapter,
  } = args;

  if (locale === 'ja') {
    const matchLine = chapter
      ? `第${chapter}章 — ${blackName}（黒）vs ${whiteName}（白、Lv.${level} ${levelLabel}）`
      : level !== undefined
        ? `フリー対戦 — ${blackName}（黒）vs ${whiteName}（白、Lv.${level} ${levelLabel}）`
        : `二人対戦 — ${blackName}（黒）vs ${whiteName}（白）`;
    const playerLine =
      playerColor === BLACK
        ? `★ プレイヤー = 黒番 = ${blackName}。アドバイスは必ず黒番視点で。白番のミスを「プレイヤーのミス」と書かないこと。`
        : playerColor === WHITE
          ? `★ プレイヤー = 白番 = ${whiteName}。アドバイスは必ず白番視点で。黒番のミスを「プレイヤーのミス」と書かないこと。`
          : `★ 二人対戦 (どちらもプレイヤー)。両者にバランス良く言及してください。`;
    return `${matchLine}
${playerLine}
最終スコア: 黒 ${blackCount} - ${whiteCount} 白（${kifu.length}手）

棋譜（index: 手番 座標）:
${formatKifu(kifu, locale)}

annotate_othello_game ツールで構造化レビューを返してください。コメントは日本語で。`;
  }

  const matchLine = chapter
    ? `Chapter ${chapter} — ${blackName} (Black) vs ${whiteName} (White, Lv.${level} ${levelLabel})`
    : level !== undefined
      ? `Free match — ${blackName} (Black) vs ${whiteName} (White, Lv.${level} ${levelLabel})`
      : `Two-player match — ${blackName} (Black) vs ${whiteName} (White)`;
  const playerLine =
    playerColor === BLACK
      ? `★ Player = Black = ${blackName}. All advice must be from Black's perspective. Do NOT label White's mistakes as "the player's" mistakes.`
      : playerColor === WHITE
        ? `★ Player = White = ${whiteName}. All advice must be from White's perspective. Do NOT label Black's mistakes as "the player's" mistakes.`
        : `★ Two-player match (both sides are humans). Comment on both sides in a balanced way.`;
  return `${matchLine}
${playerLine}
Final score: Black ${blackCount} - ${whiteCount} White (${kifu.length} moves)

Kifu (index: side coordinate):
${formatKifu(kifu, locale)}

Return a structured review via the annotate_othello_game tool. Comments in English.`;
}

/* ---------------- Validation ---------------- */

const ALL_QUALITIES: ReadonlySet<string> = new Set([
  'brilliant',
  'good',
  'neutral',
  'inaccuracy',
  'mistake',
  'blunder',
]);

/**
 * Coerce an unknown blob (the tool_use input from Anthropic) into a
 * typed ReviewAnnotations. Drops malformed annotation entries instead
 * of failing the whole review.
 */
export function coerceReviewAnnotations(raw: unknown): ReviewAnnotations | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.summary !== 'string' || typeof r.improvements !== 'string') return null;
  if (!Array.isArray(r.annotations)) return null;
  const annotations: MoveAnnotation[] = [];
  // Drop any betterMove that isn't a valid a1–h8 notation string,
  // rather than failing the whole annotation — defensive against a
  // hallucinated coordinate like "x9" sneaking through.
  const NOTATION_RE = /^[a-h][1-8]$/;
  for (const a of r.annotations) {
    if (typeof a !== 'object' || a === null) continue;
    const ar = a as Record<string, unknown>;
    if (typeof ar.moveIndex !== 'number') continue;
    if (typeof ar.comment !== 'string') continue;
    if (typeof ar.quality !== 'string' || !ALL_QUALITIES.has(ar.quality)) continue;
    const betterMove =
      typeof ar.betterMove === 'string' && NOTATION_RE.test(ar.betterMove)
        ? ar.betterMove
        : undefined;
    annotations.push({
      moveIndex: ar.moveIndex,
      quality: ar.quality as MoveQuality,
      comment: ar.comment,
      ...(betterMove !== undefined ? { betterMove } : {}),
    });
  }
  return {
    summary: r.summary,
    improvements: r.improvements,
    bestMoveIndex: typeof r.bestMoveIndex === 'number' ? r.bestMoveIndex : undefined,
    worstMoveIndex: typeof r.worstMoveIndex === 'number' ? r.worstMoveIndex : undefined,
    turningPointIndex:
      typeof r.turningPointIndex === 'number' ? r.turningPointIndex : undefined,
    annotations,
  };
}
