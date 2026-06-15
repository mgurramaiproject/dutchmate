# Production Backend Plan

The public DutchMate extension should not ask normal users for a provider endpoint or provider API key. Those controls are useful during local development, but the production product should feel lightweight:

```text
install extension
-> hover or select text
-> get translation
```

## Recommended Shape

```text
browser extension
-> DutchMate HTTPS backend
-> translation provider
-> DutchMate backend response
-> extension tooltip
```

The extension should call one DutchMate-owned HTTPS backend. The backend should own provider keys, provider routing, quotas, abuse protection, and operational logging.

## MVP Backend Requirements

| Area | Requirement | Notes |
| --- | --- | --- |
| API | `POST /translate` | Keep the current request/response contract where possible. |
| Health | `GET /health` | Used for deployment checks and simple uptime monitoring. |
| Secrets | Provider API keys stay server-side | Never ship paid provider keys in the extension. |
| CORS | Allow extension origins | Include Chrome and Firefox extension origins after publishing IDs are known. |
| Provider adapter | One production translation provider | Start with the simplest provider that supports Dutch, English, and Telugu acceptably. |
| Rate limiting | Basic per-install or anonymous limits | Protect cost before accounts exist. |
| Abuse protection | Request size and frequency limits | Keep free use generous, but not unlimited. |
| Logging | Operational metadata only | Current MVP logs status, duration, languages, context, text length, and rate-limit state without raw page text. |
| Privacy | Clear store listing and privacy policy | Explain what text is sent for translation. |

## Extension Behavior

Before public release:

- Normal users should not need to see Provider endpoint or Provider API key.
- Developer settings can remain available in development builds or behind a deliberate advanced mode.
- The extension should use the production backend endpoint by default.
- Local persistent cache should continue to store only selected single words.
- Hover words, selected phrases, and sentences should not be persisted locally.

## Rate Limit Behavior

The current MVP backend allows up to 60 `POST /translate` requests per minute per client. Requests above that limit return `429` with a `Retry-After` header and do not call the translation provider.

Use "provider cost" or "translation quota" in product docs instead of "provider tokens." Translation providers often bill by characters, requests, or quota; tokens are only one possible billing model.

## Render Blueprint

The repo includes `render.yaml` for the first Render Web Service deployment.

Initial blueprint behavior:

- Service name: `dutchmate-backend`.
- Runtime: Node.
- Health check path: `/health`.
- Start command: `corepack pnpm backend:start`.
- Host and port: `HOST=0.0.0.0`, `PORT=10000`, matching Render's web service port-binding guidance.
- Provider: `mymemory` for the early MVP no-credit-card translation path.
- MyMemory source fallback: `MYMEMORY_SOURCE_LANGUAGE=nl`.

The first Render deploy proved that `/health` is reachable over HTTPS and that `/translate` reaches the backend. With `TRANSLATION_PROVIDER=mymemory` and `MYMEMORY_EMAIL` configured, MyMemory still returned `429` from Render. This means Render and the backend are healthy, but MyMemory is not reliable enough to treat as the dependable public provider.

Keep `MYMEMORY_EMAIL` in Render environment variables, not in the repo. Use it only for the temporary MyMemory experiment/fallback. For a polished public launch, switch Render environment variables to the approved scale-up provider.

## Not Yet

Do not add these before the basic free product is proven:

- User accounts.
- Billing.
- Paid plan entitlements.
- Cross-device vocabulary sync.
- Saved vocabulary backend.
- Full analytics pipeline.

These become appropriate when provider cost, saved learning data, or paid plans require durable identity.

## First Implementation Sequence

| Step | Status | Notes |
| --- | --- | --- |
| Choose deployment target | Done | Render Web Service is approved as the first MVP backend deployment target. |
| Choose first production provider | Done | Use MyMemory for early MVP; scale to Azure AI Translator / Microsoft Translator after traction or quota pressure. |
| Add Render deployment blueprint | Done | `render.yaml` defines the first `dutchmate-backend` web service. |
| Deploy `/health` and hosted backend | Verified | Render serves `/health` and reaches `/translate`; MyMemory returns hosted `429` even with `MYMEMORY_EMAIL` configured. |
| Choose reliable hosted translation provider | Planned | MyMemory is verified fragile on Render; next provider path should target Azure AI Translator / Microsoft Translator or another official provider. |
| Add server-side provider secret handling | Planned | Use managed secrets, not repo files. |
| Add basic rate limiting | Done | Current MVP uses in-memory per-client limits for `POST /translate`; replace with durable/edge limits for production scale. |
| Add production endpoint configuration to extension | Done | Fresh installs use `https://dutchmate-backend.onrender.com/translate` by default; Developer settings can still override it. |
| Hide normal-user Developer settings | Planned | Keep advanced/local testing path separate from public UX. |
| Write privacy policy/store disclosure | Planned | Required before public distribution. |

## Critical Recommendation

Keep the production backend boring. The backend exists first to protect secrets, control cost, and make setup invisible. Do not turn it into an account system, learning platform, or billing system until DutchMate has real usage and users ask for durable learning features.
