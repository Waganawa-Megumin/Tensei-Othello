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
 * Streaming (`stream: true`) is fully supported because the upstream
 * body is piped through unchanged.
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

      const upstream = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          'Anthropic-Version':
            request.headers.get('Anthropic-Version') ?? '2023-06-01',
        },
        body: request.body,
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
