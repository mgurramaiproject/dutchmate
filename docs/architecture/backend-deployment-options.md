# Backend Deployment Options

DutchMate needs one boring production backend before public browser-store release:

```text
extension -> DutchMate HTTPS backend -> translation provider
```

The first deployment target should optimize for low setup friction, safe secret handling, readable logs, easy health checks, and a simple rollback path.

## Current Backend Shape

The backend is currently a small Node HTTP service:

- `GET /health`
- `POST /translate`
- environment-based provider secrets
- configurable in-memory rate limits
- privacy-safe request metadata logs

That makes a normal Node web-service host the lowest-friction first deployment. Edge/serverless platforms may be attractive later, but they may require adapting the server entry point.

## Options

| Target | Low-Cost Fit | Secret Handling | Logs / Health | CORS / Extension Fit | Fit For Current Code | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Render Web Service | Strong for MVP. Free web services exist; Starter is currently listed at $7/month. | Supports environment variables and secret files. | Health checks and log retention are available. | Plain HTTPS endpoint works well for Chrome and Firefox extension calls. | Excellent. Existing Node HTTP server maps naturally. | Best first choice for minimal code change. |
| Railway | Good developer experience, but production Pro currently has a $20 minimum usage plan. | Supports service variables and secrets. | Health checks and logs are available. | Plain HTTPS endpoint works well. | Excellent. Existing Node HTTP server maps naturally. | Nice DX, but cost floor is higher than Render for this stage. |
| Fly.io | Usage-based and production-capable. | Supports secrets and private networking. | Strong operational model, but more infrastructure-shaped. | Plain HTTPS endpoint works well. | Good, usually via app/machine config. | Powerful, but slightly more operational overhead than needed for first public MVP. |
| Cloudflare Workers | Very strong low-cost/edge story; paid Workers currently start at $5/month and include large request allotments. | Supports secrets, env bindings, and edge-native rate limiting tools. | Workers Logs are included on Free and Paid plans. | Excellent for global extension traffic. | Medium. Current Node HTTP server would need an adapter or rewrite to a Worker `fetch` handler. | Best later candidate if latency/edge rate limiting becomes more important than Node simplicity. |

## Recommendation

Use **Render Web Service** for the first production backend.

Why:

- It fits the current Node backend with the fewest code changes.
- It supports environment variables/secrets, health checks, logs, HTTPS, and normal web service deployment.
- It gives us a cheap path from prototype to public MVP.
- It lets us validate real extension traffic before investing in edge-specific architecture.

Do not optimize for the theoretical best global edge architecture yet. First, prove that the public extension can reliably call one DutchMate-owned backend without exposing provider keys or making users configure endpoints.

## Not Recommended Yet

Do not move to Cloudflare Workers as the first deployment unless we explicitly decide to port the backend to a Worker shape. Cloudflare is attractive for a later production-hardening phase, especially for edge latency and durable/edge rate limits, but it is not the smallest next step for the current codebase.

Do not add Kubernetes, custom VPS operations, or multi-region deployment yet. Those add operational burden before DutchMate has production usage.

## Decision Criteria For Approval

Render is approved for the immediate goal:

- fastest path to a real HTTPS backend,
- minimal code churn,
- simple secret management,
- easy manual verification from Chrome and Firefox.

Choose Cloudflare Workers instead if the immediate goal is:

- edge-first architecture,
- built-in edge products such as Workers Rate Limiting, KV, D1, or Durable Objects,
- willingness to adapt the backend entry point before the first deployment.

## Sources Checked

- Render pricing: https://render.com/pricing
- Fly.io pricing: https://fly.io/pricing
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Railway pricing: https://railway.com/pricing
