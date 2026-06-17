# Backend Runtime Monitoring

Last updated: 2026-06-18

DutchMate now exposes a privacy-safe runtime summary through:

```text
GET /health
```

This is intended to make early production checks easier without logging raw reading content.

## What `/health` Returns

The response includes:

- `ok`
- `service`
- `runtime.startedAt`
- `runtime.lastTranslateAt`
- `runtime.translateRequestsAcceptedTotal`
- `runtime.requestedTextCharactersTotal`
- `runtime.translateSuccessTotal`
- `runtime.translateFailureTotal`
- `runtime.badRequestTotal`
- `runtime.clientRateLimitedTotal`
- `runtime.providerErrorTotal`
- `runtime.providerRateLimitedTotal`
- `runtime.byContext.hover`
- `runtime.byContext.selection`

These values are in-memory counters since the current backend process started.

## Why This Helps

For DutchMate's current stage, these counters answer the most useful owner questions:

- Is the backend receiving real traffic?
- Is traffic mostly hover or selection driven?
- Are errors coming from bad requests, our own rate limit, or the provider?
- Is provider rate limiting starting to appear?
- Roughly how many source characters has this backend process handled?

`requestedTextCharactersTotal` is especially useful as a rough cost-visibility signal, because translation providers often bill by characters.

## Important Limits

This is not durable analytics.

- Counters reset when the backend process restarts or redeploys.
- This is a quick operational snapshot, not a long-term reporting system.
- It does not replace Google Cloud Billing, Render logs, or budget alerts.

## How To Check It

Production:

```bash
curl https://dutchmate-backend.onrender.com/health
```

Local:

```bash
curl http://localhost:8787/health
```

## How To Read It

Good early-share signs:

- `translateSuccessTotal` is climbing
- `providerRateLimitedTotal` stays at `0`
- `clientRateLimitedTotal` stays low
- `badRequestTotal` stays low

Warning signs:

- `providerRateLimitedTotal` increases
- `translateFailureTotal` grows quickly relative to success
- `requestedTextCharactersTotal` climbs faster than expected
- `clientRateLimitedTotal` spikes after a broader share

## Recommended Owner Habit

Before and after each broader public share:

1. Check Google Cloud Billing.
2. Check Render logs.
3. Check `GET /health`.
4. Record a short note in [google-cloud-cost-monitoring-checklist.md](google-cloud-cost-monitoring-checklist.md).

## Privacy Note

The runtime summary does not expose raw source text, translated text, email addresses, or API keys.
