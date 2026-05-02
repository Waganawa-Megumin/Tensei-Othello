# tensei-othello-proxy

Cloudflare Workers proxy between the Tensei-Othello PWA / APK and the
Anthropic API. Hides the Anthropic API key as a Worker secret so the
key is never bundled into the client.

## Endpoints

| Method | Path           | Behavior                                              |
|--------|----------------|-------------------------------------------------------|
| GET    | `/health`      | Returns `ok`. CORS-open for ad-hoc curl checks.       |
| POST   | `/v1/messages` | Proxied straight to `api.anthropic.com/v1/messages`. Streaming preserved. CORS-restricted to allowed origins. |

Allowed origins are listed in `src/index.ts`:

- `https://waganawa-megumin.github.io` — GitHub Pages
- `http://localhost:5173` / `http://localhost:4173` — local dev / preview
- `https://localhost` / `capacitor://localhost` — Capacitor Android (Phase 3)

## Deployment

The Worker is deployed by GitHub Actions
(`.github/workflows/proxy-deploy.yml`) using
`cloudflare/wrangler-action@v3`. On every run the action also pushes
`ANTHROPIC_API_KEY` from GitHub Secrets to the Worker as a secret via
`wrangler secret put`.

Required GitHub Secrets:

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Workers Scripts:Edit
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account id
- `ANTHROPIC_API_KEY` — Anthropic API key (`sk-ant-api03-…`)

After the first successful deploy the URL is:

```
https://tensei-othello-proxy.<your-cf-subdomain>.workers.dev
```

The exact subdomain is shown in the GitHub Actions log.

## Health check

```
curl https://tensei-othello-proxy.<your-cf-subdomain>.workers.dev/health
# -> ok
```

## Smoke test against Anthropic

The Origin header is checked, so this only works from an allowed
origin. Easiest way to test from the command line is to fake an
allowed origin:

```
curl -X POST https://tensei-othello-proxy.<sub>.workers.dev/v1/messages \
  -H "Content-Type: application/json" \
  -H "Origin: https://waganawa-megumin.github.io" \
  -H "Anthropic-Version: 2023-06-01" \
  -d '{
    "model": "claude-haiku-4-5-20251001",
    "max_tokens": 64,
    "messages": [{"role":"user","content":"say hi"}]
  }'
```

Expected: a 200 response with a Claude assistant message in the
Anthropic Messages API JSON shape.

## Local development (optional, requires PC)

```
cd proxy
npm install
npx wrangler login        # browser-based OAuth
npx wrangler dev          # local dev at http://localhost:8787
```

Skipped in the smartphone-only flow — production deploys go through
GitHub Actions instead.

## License

Same as the parent project — see `../LICENSE.md`.
