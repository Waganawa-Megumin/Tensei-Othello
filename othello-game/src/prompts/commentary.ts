/**
 * Prompt templates for in-match character commentary.
 *
 * Mirrors the shape of `prompts/review.ts`: a static system block (good
 * candidate for prompt caching) plus a per-call user prompt that names
 * the character, supplies a short persona cue, and describes the move
 * just played. Output goes through a forced tool call so we always get
 * a clean `{text, tone}` payload — never free text that we'd have to
 * regex-strip.
 */
import type { CharacterPersona } from '../data/personas';

export type CommentaryLocale = 'ja' | 'en';

/**
 * Tonal hint the model picks alongside its line. The bubble component
 * uses it to colour the rim (taunt=red, thoughtful=amber, shock=violet,
 * cheer=emerald, neutral=default amber).
 */
export type CommentaryTone =
  | 'taunt'
  | 'thoughtful'
  | 'shock'
  | 'cheer'
  | 'neutral';

export interface CommentaryResult {
  /** 1–2 short sentences in the character's voice, in `locale`. */
  text: string;
  tone: CommentaryTone;
}

export interface CommentaryArgs {
  /** Display name in the user's locale (e.g. "ルナ" or "Luna"). */
  characterName: string;
  /** Persona cue for the LLM (kanji + ja/en lines). */
  persona: CharacterPersona;

  /** What the character just played — ours or the player's. */
  movePlayed: {
    /** 'ai' = the character themselves played; 'player' = it was the human's move. */
    by: 'ai' | 'player';
    /** Algebraic e.g. "f5", "d3", or "pass". */
    notation: string;
    /** How many opposing discs flipped, 0 for pass. */
    flipsCount: number;
    /** True when the move took a corner (a1/a8/h1/h8). */
    isCornerCapture: boolean;
  };

  /** Score & tempo at the moment commentary fires. */
  context: {
    moveNumber: number;
    blackCount: number;
    whiteCount: number;
    /** "leading" = the AI character is ahead; based on AI's color. */
    standing: 'leading' | 'trailing' | 'even';
  };
}

/* ---------------- Tool schema ---------------- */

export const COMMENTARY_TOOL_NAME = 'character_commentary';

export function buildCommentaryTool(): Record<string, unknown> {
  return {
    name: COMMENTARY_TOOL_NAME,
    description:
      "Speak ONE short line as the named character about the move that just happened. 1–2 sentences max, in the user's locale, in their established voice. Skip generic praise — react to the specific move.",
    input_schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description:
            "1–2 sentences in the character's voice, in the user's locale. Stay under ~80 characters JA / 120 EN.",
        },
        tone: {
          type: 'string',
          enum: ['taunt', 'thoughtful', 'shock', 'cheer', 'neutral'],
          description:
            'Mood of the line. Used to tint the on-screen bubble. Pick the closest match.',
        },
      },
      required: ['text', 'tone'],
    },
  };
}

/* ---------------- System prompt ---------------- */

const SYSTEM_JA = `あなたはオセロ対局中に、AI 側のキャラクターになりきって短い一言を返す役です。
プレイヤーは盤上世界という異界に召喚された主人公で、20 人の達人と対戦しています。

ルール:
- 出力は必ず character_commentary ツールで返す。テキスト返答は禁止
- text は 1〜2 文、80 文字以内、日本語
- そのキャラの口調・語尾を厳守 (persona に従う)
- 直前の手 (座標・取った石数・隅取り有無) に具体的に反応する
- 一般論や「ナイス！」のような無難な定型句は避ける
- ネタバレや盤面外の話題には触れない`;

const SYSTEM_EN = `You voice the AI-side character with a single short line during an Othello match.
The human is the protagonist summoned into Bansho Sekai, dueling 20 masters.

Rules:
- Always reply via the character_commentary tool. No free text.
- text is 1–2 sentences, under 120 characters, in English.
- Stay strictly in the character's voice (follow the persona cue).
- React to the SPECIFIC move (square, flips, corner capture).
- Skip generic praise like "Nice!". Be specific.
- Don't reference anything outside the match.`;

export function buildCommentarySystemPrompt(locale: CommentaryLocale): string {
  return locale === 'ja' ? SYSTEM_JA : SYSTEM_EN;
}

/* ---------------- User prompt ---------------- */

function standingLabel(
  standing: CommentaryArgs['context']['standing'],
  locale: CommentaryLocale,
): string {
  if (locale === 'ja') {
    if (standing === 'leading') return 'AI が優勢';
    if (standing === 'trailing') return 'プレイヤーが優勢';
    return '互角';
  }
  if (standing === 'leading') return 'AI is ahead';
  if (standing === 'trailing') return 'Player is ahead';
  return 'even';
}

export function buildCommentaryUserPrompt(
  args: CommentaryArgs,
  locale: CommentaryLocale,
): string {
  const { characterName, persona, movePlayed, context } = args;
  if (locale === 'ja') {
    const personaCue = persona.ja;
    const byLabel = movePlayed.by === 'ai' ? 'あなた自身' : '相手 (プレイヤー)';
    const cornerLine = movePlayed.isCornerCapture ? '（隅を取得）' : '';
    return `キャラクター: ${characterName}
口調・性格メモ: ${personaCue}

直前の手: ${byLabel} が ${movePlayed.notation} に着手 / ${movePlayed.flipsCount} 枚返した ${cornerLine}
盤面状況: ${context.moveNumber} 手目 / 黒 ${context.blackCount} - ${context.whiteCount} 白 / ${standingLabel(context.standing, locale)}

character_commentary ツールで一言を返してください。`;
  }
  const personaCue = persona.en;
  const byLabel = movePlayed.by === 'ai' ? 'You' : 'Opponent (the player)';
  const cornerLine = movePlayed.isCornerCapture ? ' (corner!)' : '';
  return `Character: ${characterName}
Voice / persona: ${personaCue}

Most recent move: ${byLabel} played ${movePlayed.notation}, flipping ${movePlayed.flipsCount} disc(s)${cornerLine}
Board state: move ${context.moveNumber} / Black ${context.blackCount} - ${context.whiteCount} White / ${standingLabel(context.standing, locale)}

Reply via the character_commentary tool.`;
}

/* ---------------- Validation ---------------- */

const ALL_TONES: ReadonlySet<string> = new Set([
  'taunt',
  'thoughtful',
  'shock',
  'cheer',
  'neutral',
]);

/**
 * Validate the tool_use input from Anthropic. Returns null on shape
 * mismatch so the caller can drop the commentary silently rather than
 * showing a malformed bubble.
 */
export function coerceCommentary(raw: unknown): CommentaryResult | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.text !== 'string' || r.text.trim().length === 0) return null;
  if (typeof r.tone !== 'string' || !ALL_TONES.has(r.tone)) return null;
  return { text: r.text.trim(), tone: r.tone as CommentaryTone };
}
