import type { Color } from '../engine/types';
import {
  ANNOTATE_TOOL_NAME,
  buildAnnotateTool,
  buildReviewSystemPrompt,
  buildReviewUserPrompt,
  coerceReviewAnnotations,
  type ReviewAnnotations,
  type ReviewArgs,
  type ReviewLocale,
} from '../prompts/review';

/**
 * Stable device identifier sent as `X-Device-Id` to the proxy. Used for
 * future per-device rate limiting; today the proxy ignores it.
 */
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

/**
 * Cloudflare Workers proxy URL. Override at build time with
 * `VITE_PROXY_URL` if you deploy to a different account.
 */
const PROXY_URL: string =
  (import.meta.env.VITE_PROXY_URL as string | undefined) ??
  'https://tensei-othello-proxy.southern-all-stars-love-peace.workers.dev';

/* ---------------- Anthropic Messages API typings ---------------- */

interface SystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

interface UserMessage {
  role: 'user';
  content: string;
}

interface MessagesRequest {
  model: string;
  max_tokens: number;
  system?: SystemBlock[];
  messages: UserMessage[];
  stream: true;
}

/* ---------------- Streaming callbacks ---------------- */

export interface StreamCallbacks {
  /** Called for every text fragment in the assistant's reply. */
  onText: (delta: string) => void;
  /** Called once on terminal failure. After this no more callbacks fire. */
  onError: (error: Error) => void;
  /** Called once when the stream ends cleanly. */
  onDone: () => void;
}

export interface StreamMessageHandle {
  /** Aborts the in-flight request; safe to call multiple times. */
  abort: () => void;
}

/* ---------------- Low-level: streaming Messages API ---------------- */

function streamMessage(
  request: Omit<MessagesRequest, 'stream'>,
  callbacks: StreamCallbacks,
): StreamMessageHandle {
  const controller = new AbortController();

  void (async () => {
    try {
      const response = await fetch(`${PROXY_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Anthropic-Version': '2023-06-01',
          'X-Device-Id': getOrCreateDeviceId(),
        },
        body: JSON.stringify({ ...request, stream: true } satisfies MessagesRequest),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        callbacks.onError(
          new Error(`Proxy returned ${response.status} ${response.statusText}: ${text}`),
        );
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        callbacks.onError(new Error('Response has no readable body'));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      const handleSseLine = (raw: string) => {
        const line = raw.trim();
        if (!line.startsWith('data:')) return;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') return;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: { type?: string; text?: string };
          };
          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'text_delta' &&
            typeof event.delta.text === 'string'
          ) {
            callbacks.onText(event.delta.text);
          }
        } catch {
          /* ignore unparseable SSE chunk */
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const raw of lines) handleSseLine(raw);
      }
      // Flush any final partial line that didn't end with '\n'. Without
      // this, the last text_delta in a stream that closes mid-line is
      // lost — which manifests as a review that gets cut off near the
      // end.
      if (buffer.length > 0) handleSseLine(buffer);
      callbacks.onDone();
    } catch (err) {
      if (controller.signal.aborted) return;
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return { abort: () => controller.abort() };
}

/* ---------------- High-level: post-game review ---------------- */

export type { ReviewArgs, ReviewLocale, ReviewAnnotations } from '../prompts/review';

export function streamReview(
  args: ReviewArgs,
  locale: ReviewLocale,
  callbacks: StreamCallbacks,
): StreamMessageHandle {
  return streamMessage(
    {
      // Sonnet 4.6 strikes the right balance between coherence over a
      // 60-move game and per-call cost (~$0.02 per review). 3000 tokens
      // gives the review enough headroom to cover opening / midgame /
      // endgame plus key turning points without truncating; reviews
      // usually land around 1.5–2.5k tokens.
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: [
        {
          type: 'text',
          text: buildReviewSystemPrompt(locale),
          // Cache the static system block so repeat reviews under 5 min
          // cost a fraction of the first call.
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: buildReviewUserPrompt(args, locale) }],
    },
    callbacks,
  );
}

/* ---------------- High-level: structured annotated review ---------------- */

export interface StructuredReviewHandle {
  /** Aborts the in-flight request; safe to call multiple times. */
  abort: () => void;
  /** Resolves with the parsed annotations on success. */
  result: Promise<ReviewAnnotations>;
}

/**
 * Non-streaming structured review. Forces the model to call the
 * `annotate_othello_game` tool, which guarantees a JSON object matching
 * the ReviewAnnotations shape. The whole review arrives in one shot
 * (no partial render), which is acceptable because the response is
 * tens of moves of comments, not a multi-paragraph essay.
 *
 * The Cloudflare proxy pipes the body through unchanged, so this
 * works against the same /v1/messages endpoint as streamReview.
 */
export function fetchStructuredReview(
  args: ReviewArgs,
  locale: ReviewLocale,
): StructuredReviewHandle {
  const controller = new AbortController();
  const tool = buildAnnotateTool();

  const result = (async (): Promise<ReviewAnnotations> => {
    const response = await fetch(`${PROXY_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Anthropic-Version': '2023-06-01',
        'X-Device-Id': getOrCreateDeviceId(),
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: [
          {
            type: 'text',
            text: buildReviewSystemPrompt(locale),
            cache_control: { type: 'ephemeral' },
          },
        ],
        tools: [tool],
        tool_choice: { type: 'tool', name: ANNOTATE_TOOL_NAME },
        messages: [{ role: 'user', content: buildReviewUserPrompt(args, locale) }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Proxy returned ${response.status} ${response.statusText}: ${text}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ type?: string; name?: string; input?: unknown }>;
    };
    const block = (data.content ?? []).find(
      (b) => b.type === 'tool_use' && b.name === ANNOTATE_TOOL_NAME,
    );
    if (!block) {
      throw new Error('Model did not call the annotate_othello_game tool');
    }
    const parsed = coerceReviewAnnotations(block.input);
    if (!parsed) {
      throw new Error('Tool output failed schema validation');
    }
    return parsed;
  })();

  return {
    abort: () => controller.abort(),
    result,
  };
}

// Re-export Color so consumers don't have to dig into engine types just
// for the kifu shape.
export type { Color };
