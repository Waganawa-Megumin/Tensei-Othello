/**
 * Per-move character commentary via Anthropic Claude.
 *
 * Reuses the Cloudflare Workers proxy and device-id pattern from
 * `services/claude.ts`. We don't share that file's helpers because
 * `streamMessage` is tuned for review streaming; commentary is small
 * and structured, so a one-shot tool call (à la `fetchStructuredReview`)
 * is the right shape — it's just much smaller.
 *
 * On any error (network, proxy 4xx/5xx, schema mismatch) the caller
 * gets `null` and is expected to silently drop the line. Commentary
 * must never affect the actual match.
 */
import {
  COMMENTARY_TOOL_NAME,
  buildCommentarySystemPrompt,
  buildCommentaryTool,
  buildCommentaryUserPrompt,
  coerceCommentary,
  type CommentaryArgs,
  type CommentaryLocale,
  type CommentaryResult,
} from '../prompts/commentary';

const DEVICE_ID_KEY = 'othello:device_id';

function getOrCreateDeviceId(): string {
  try {
    const stored = window.localStorage.getItem(DEVICE_ID_KEY);
    if (stored) return stored;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    return 'anonymous';
  }
}

const PROXY_URL: string =
  (import.meta.env.VITE_PROXY_URL as string | undefined) ??
  'https://tensei-othello-proxy.southern-all-stars-love-peace.workers.dev';

export interface CommentaryHandle {
  /** Aborts the in-flight request; safe to call multiple times. */
  abort: () => void;
  /** Resolves with the commentary on success, or `null` on any failure. */
  result: Promise<CommentaryResult | null>;
}

/**
 * Fetch a single commentary line. Fire-and-forget at the call site —
 * the resolver is `null` on any error path, so callers can simply
 * `if (result) setBubble(result)` without try/catch.
 */
export function fetchCharacterCommentary(
  args: CommentaryArgs,
  locale: CommentaryLocale,
): CommentaryHandle {
  const controller = new AbortController();
  const tool = buildCommentaryTool();

  const result = (async (): Promise<CommentaryResult | null> => {
    try {
      const response = await fetch(`${PROXY_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Anthropic-Version': '2023-06-01',
          'X-Device-Id': getOrCreateDeviceId(),
        },
        body: JSON.stringify({
          // Haiku 4.5 is the right tier for one-line in-character
          // reactions: low latency, tiny per-call cost (commentary
          // fires per move so cost adds up), and good enough at voice
          // mimicry from a one-line persona cue.
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          system: [
            {
              type: 'text',
              text: buildCommentarySystemPrompt(locale),
              // Cache the static system block so consecutive moves in
              // the same match cost a fraction of the first call.
              cache_control: { type: 'ephemeral' },
            },
          ],
          tools: [tool],
          tool_choice: { type: 'tool', name: COMMENTARY_TOOL_NAME },
          messages: [
            { role: 'user', content: buildCommentaryUserPrompt(args, locale) },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.warn(
          `[commentary] proxy ${response.status} ${response.statusText}: ${text}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        content?: Array<{ type?: string; name?: string; input?: unknown }>;
      };
      const block = (data.content ?? []).find(
        (b) => b.type === 'tool_use' && b.name === COMMENTARY_TOOL_NAME,
      );
      if (!block) return null;
      return coerceCommentary(block.input);
    } catch (err) {
      if (controller.signal.aborted) return null;
      console.warn('[commentary] fetch failed:', err);
      return null;
    }
  })();

  return {
    abort: () => controller.abort(),
    result,
  };
}

export type { CommentaryArgs, CommentaryLocale, CommentaryResult, CommentaryTone } from '../prompts/commentary';
