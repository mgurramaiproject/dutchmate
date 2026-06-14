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
| Logging | Operational metadata only | Avoid storing raw page text unless explicitly needed and disclosed. |
| Privacy | Clear store listing and privacy policy | Explain what text is sent for translation. |

## Extension Behavior

Before public release:

- Normal users should not need to see Provider endpoint or Provider API key.
- Developer settings can remain available in development builds or behind a deliberate advanced mode.
- The extension should use the production backend endpoint by default.
- Local persistent cache should continue to store only selected single words.
- Hover words, selected phrases, and sentences should not be persisted locally.

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
| Choose deployment target | Planned | Keep it boring and easy to operate. |
| Choose first production provider | Planned | Recheck language support, pricing, latency, and terms. |
| Deploy `/health` and `/translate` | Planned | Reuse the current backend contract where possible. |
| Add server-side provider secret handling | Planned | Use managed secrets, not repo files. |
| Add basic rate limiting | Planned | Start anonymous and generous. |
| Add production endpoint configuration to extension | Planned | Avoid user-entered endpoint for public builds. |
| Hide normal-user Developer settings | Planned | Keep advanced/local testing path separate from public UX. |
| Write privacy policy/store disclosure | Planned | Required before public distribution. |

## Critical Recommendation

Keep the production backend boring. The backend exists first to protect secrets, control cost, and make setup invisible. Do not turn it into an account system, learning platform, or billing system until DutchMate has real usage and users ask for durable learning features.
