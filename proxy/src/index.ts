/**
 * Tensei-Othello — Anthropic API proxy
 *
 * Tiny Cloudflare Worker that sits between the PWA / future APK and
 * the Anthropic API. Its only job is to attach the API key (kept as
 * a Worker secret) to outgoing requests so the client never has to
 * see it.
 *
 * Endpoints:
 *   GET  /health        -> "ok"
 *   POST /v1/messages   -> forwarded to api.anthropic.com/v1/messages
 *
 * Streaming (`stream: true`) is fully supported — only the request
 * body is buffered (so we can validate `model` and `max_tokens`); the
 * upstream response body is piped through unchanged.
 *
 * Cost protection (added 2026-06-08 after Opus 4.x spend showed up on
 * the proxy's API key in the dashboard):
 *   - Model allowlist: only Sonnet 4.6 and Haiku 4.5 are forwarded.
 *     Game code never asks for anything else; refusing other models at
 *     the proxy means even a leaked API key cannot be used to bill
 *     Opus through this Worker.
 *   - Request body size cap: real game payloads are well under 64 KB.
 *   - Output token cap: hard upper bound on `max_tokens` so a runaway
 *     client can't blow up output cost.
 *
 * NOTE on rate limiting: a per-device daily quota using KV is planned
 * but not in this commit — the Anthropic dashboard "spend limit"
 * setting is the actual safeguard for now. Add KV counters in a
 * follow-up if abuse becomes a concern.
 */

interface Env {
  /** Anthropic API key. Set via `wrangler secret put ANTHROPIC_API_KEY`. */
  ANTHROPIC_API_KEY: string;
}

const ANTHROPIC_BASE = 'https://api.anthropic.com';

/**
 * Models the game is allowed to call. Anything else is rejected with
 * 400 before reaching Anthropic. Family prefix match so Anthropic's
 * date-pinned variants (e.g. `claude-sonnet-4-6-20251101`) keep working
 * without code changes.
 */
const ALLOWED_MODEL_PREFIXES = [
  'claude-sonnet-4-6',
  'claude-haiku-4-5',
] as const;

function isAllowedModel(model: unknown): model is string {
  if (typeof model !== 'string') return false;
  return ALLOWED_MODEL_PREFIXES.some(
    (p) => model === p || model.startsWith(`${p}-`),
  );
}

/** Hard cap on request body size. Real game payloads are < 20 KB. */
const MAX_BODY_BYTES = 256 * 1024;

/**
 * Hard cap on `max_tokens`. Review uses 3000, commentary uses 200, so
 * 4096 covers both with headroom and prevents an attacker from asking
 * for a giant generation.
 */
const MAX_OUTPUT_TOKENS = 4096;

/**
 * Origins allowed to call the proxy. Anything else gets a 403 even if
 * the request is otherwise valid — keeps random sites from using our
 * Anthropic credit if they discover the URL.
 */
const ALLOWED_ORIGINS = new Set<string>([
  'https://waganawa-megumin.github.io',
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173', // Vite preview server
  // Capacitor Android (Phase 3) — preserved here so the same proxy works
  // once the WebView build ships.
  'https://localhost',
  'capacitor://localhost',
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    headers['Access-Control-Allow-Headers'] =
      'Content-Type, Anthropic-Version, X-Device-Id';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

function jsonResponse(
  body: unknown,
  init: ResponseInit,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
      ...(init.headers ?? {}),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // CORS preflight
    if (request.method === 'OPTIONS') {
      const status = origin && ALLOWED_ORIGINS.has(origin) ? 204 : 403;
      return new Response(null, { status, headers: corsHeaders(origin) });
    }

    // Public health check (no Origin restriction so curl works).
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response('ok', {
        headers: { 'Content-Type': 'text/plain', ...corsHeaders(origin) },
      });
    }

    // From here on, refuse anything from an unknown Origin. (Allow null
    // Origin only for the health check, not for spend-incurring routes.)
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse(
        { error: 'origin_not_allowed' },
        { status: 403 },
        origin,
      );
    }

    if (url.pathname === '/v1/messages' && request.method === 'POST') {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return jsonResponse(
          { error: 'api_key_not_configured' },
          { status: 500 },
          origin,
        );
      }

      // Fast-reject oversized payloads using Content-Length when
      // present. Falls back to the post-read length check below for
      // chunked uploads where Content-Length isn't set.
      const declaredLength = Number(request.headers.get('Content-Length'));
      if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return jsonResponse(
          { error: 'request_too_large', max_bytes: MAX_BODY_BYTES },
          { status: 413 },
          origin,
        );
      }

      const rawBody = await request.text();
      if (rawBody.length > MAX_BODY_BYTES) {
        return jsonResponse(
          { error: 'request_too_large', max_bytes: MAX_BODY_BYTES },
          { status: 413 },
          origin,
        );
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(rawBody) as Record<string, unknown>;
      } catch {
        return jsonResponse(
          { error: 'invalid_json' },
          { status: 400 },
          origin,
        );
      }

      if (!isAllowedModel(parsed.model)) {
        return jsonResponse(
          {
            error: 'model_not_allowed',
            model: parsed.model,
            allowed_prefixes: ALLOWED_MODEL_PREFIXES,
          },
          { status: 400 },
          origin,
        );
      }

      // Clamp max_tokens so a misconfigured / malicious caller can't
      // ask Anthropic to generate tens of thousands of output tokens.
      if (
        typeof parsed.max_tokens === 'number' &&
        parsed.max_tokens > MAX_OUTPUT_TOKENS
      ) {
        parsed.max_tokens = MAX_OUTPUT_TOKENS;
      }

      const upstream = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          'Anthropic-Version':
            request.headers.get('Anthropic-Version') ?? '2023-06-01',
        },
        body: JSON.stringify(parsed),
      });

      // Stream the response straight back. Don't buffer.
      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: {
          'Content-Type':
            upstream.headers.get('Content-Type') ?? 'application/json',
          ...corsHeaders(origin),
        },
      });
    }

    return jsonResponse({ error: 'not_found' }, { status: 404 }, origin);
  },
};
