# Viral Adoption Roadmap

DutchMate should feel almost magically lightweight:

```text
Install extension
-> hover or select a Dutch word
-> instantly understand it
-> keep reading without breaking flow
```

The product should delay account creation, billing, and heavy setup until after users have already felt that value.

## Product Principles

- The first-use path should not require an account.
- The hover or selected-word tooltip is the core "aha" moment.
- Free users should get real value, not a crippled demo.
- Paid features should deepen learning, not block basic usefulness too early.
- Privacy and trust are product features, not only legal requirements.
- Cache enough to feel fast and save provider cost, but avoid silently storing what users merely read or hover over.
- Chrome and Firefox are the first supported browsers. Keep browser-specific behavior isolated so other browsers can be considered later.

## Status Legend

| Status | Meaning |
| --- | --- |
| Done | Implemented, verified by automated checks, and committed. |
| Verified | Manually checked in at least one target browser and recorded. |
| Proposed | Recommended by a design note, pending explicit product/architecture approval. |
| Planned | Recommended next work, not yet implemented. |
| Future | Important later, but not needed for the current MVP loop. |
| Backlog | Useful idea, but lower priority or dependent on traction. |

## Phase 1: Free Aha Moment

Goal: make DutchMate useful immediately without accounts, billing, or complex setup.

| Status | Feature | User Value | Notes / Next Step |
| --- | --- | --- | --- |
| Done | Chrome and Firefox build outputs | Users can install in both launch browsers. | Continue testing both before release. |
| Done | Hover translation | Instant reading help. | Word mode is default. |
| Done | Selection translation | Intentional lookup for words, short phrases, and short sentences. | Long selections show a clear limit message. |
| Done | Tooltip request ordering | Prevents stale translations from replacing newer ones. | Covered by unit tests. |
| Done | Duplicate hover reduction | Avoids repeated work when moving inside the same hovered word. | Hover still uses in-memory/session cache only. |
| Done | Provider endpoint error clarity | Users see a helpful backend-unreachable message. | Manual testing now includes provider readiness checks. |
| Done | Developer settings section | Keeps local endpoint/API-key controls available without presenting them as normal-user settings. | Hide or remove before public launch. |
| Done | Options privacy note | Explains what the cache stores in plain language. | Keep wording short and non-legalistic. |
| Done | Persistent cache for selected single words | Speeds up intentional repeat lookups and saves provider calls across sessions. | Does not persist hover words, phrases, or sentences. |
| Done | Cached word count | Gives users transparency without exposing raw cache records. | Counts unique source words, not translation-direction records. |
| Done | Clear translation cache | Gives users control over local cache. | Keep visible until public privacy story is settled. |
| Verified | Firefox cache workflow | Confirms count is visible and persists after loading the compiled extension. | Recorded in `manual-testing.md`. |
| Planned | Chrome cache workflow verification | Confirms parity in the other launch browser. | Deferred for now. |
| Planned | Production-friendly first-run setup | Avoids normal users needing provider endpoint settings. | Follow `production-backend-plan.md`. |

## Phase 2: Cost Control Without Hurting Adoption

Goal: keep the free product generous while preventing provider cost surprises.

| Status | Feature | User Value | Notes / Next Step |
| --- | --- | --- | --- |
| Done | In-memory translation cache | Fast repeat requests in the active session. | Still useful for hover and phrase translations. |
| Done | Local persistent cache policy | Stores only selected single words. | Details live in `cache-strategy.md`. |
| Done | Per-direction cache entries | Keeps `nl -> en`, `nl -> te`, and `en -> nl` separate. | Safer because translations are not always reversible. |
| Done | Backend rate limiting | Protects provider budget. | Current MVP uses in-memory per-client limits for `POST /translate`. |
| Done | Privacy-safe backend request logs | Helps debug outcomes without storing reading content. | Logs status, duration, languages, context, text length, and rate-limit state; never raw text. |
| Planned | Anonymous usage limits | Controls cost before accounts are required. | Keep generous during early traction. |
| Planned | Aggregate backend telemetry | Helps tune cost, latency, and reliability. | Build from privacy-safe metadata, not raw reading content. |
| Planned | Cache TTL tuning | Improves speed/cost balance based on real usage. | Start at 7 days and 1000 entries. |
| Done | Production backend deployment target | Gives the public extension a real HTTPS backend path. | Render Web Service is approved for the first MVP deployment. |
| Done | Render deployment blueprint | Makes the backend deployment repeatable. | `render.yaml` starts with `local-dev` for smoke testing. |
| Done | MouseTooltipTranslator provider-strategy reference | Helps DutchMate learn from a free competitor extension. | Documented in `reference-mousetooltiptranslator.md`; free web endpoints are research, not the default production path. |
| Planned | Production `/health` and `/translate` backend | Gives the public extension one stable endpoint. | Keep current request/response contract where possible. |
| Planned | Server-side provider secrets | Keeps paid provider keys out of extension code. | Use managed secrets in deployment target. |
| Planned | Privacy policy and store disclosure | Explains what text is sent for translation. | Required before public distribution. |
| Future | Provider fallback | Reduces downtime and quality issues. | Add after real provider usage exposes need. |

## Phase 3: Learning Features

Goal: add features that make DutchMate a learning habit, not just a lookup tool.

| Status | Feature | User Value | Notes / Next Step |
| --- | --- | --- | --- |
| Future | Saved vocabulary | Turns intentional lookups into a learning list. | Should be explicit, not inferred from passive hover. |
| Future | Review queue | Helps users return to useful words. | Start simple before spaced repetition. |
| Future | Simple spaced repetition | Builds long-term retention. | Account may become useful here. |
| Future | Example sentences | Adds context beyond direct translation. | Could become paid/premium. |
| Future | Optional learning history | Helps users see progress. | Needs clear privacy controls. |
| Backlog | Grouped word records with multiple translations | Better learning data model than raw cache entries. | Do this for vocabulary, not provider cache. |

## Phase 4: Accounts And Paid Plans

Goal: introduce identity only after users have felt value and need durable learning features or higher limits.

| Status | Feature | User Value | Notes / Next Step |
| --- | --- | --- | --- |
| Planned | No-account free usage | Keeps install-to-value fast. | Keep as long as provider cost allows. |
| Future | Account for saved learning data | Enables sync and durable progress. | Do not require for first hover/selection. |
| Future | Paid higher quotas | Gives heavy users more capacity. | Backend owns quotas and entitlement. |
| Future | Premium explanations | Adds value beyond basic translation. | Good paid candidate. |
| Future | Cross-device vocabulary sync | Lets learners continue across browsers/devices. | Requires account and data controls. |
| Future | Billing integration | Supports subscriptions. | Add only near paid beta. |
| Future | Export and delete account data | Builds trust and supports compliance. | Required before serious public account launch. |

## Free And Paid Shape

| Plan | Should Include | Should Avoid |
| --- | --- | --- |
| Free, no account | Hover translation, selection translation, MVP languages, local selected-word cache, clear cache, generous basic limits. | Login wall, provider setup, confusing endpoint/API-key fields for normal users. |
| Paid, account required | Higher quotas, richer explanations, saved vocabulary, review mode, sync, premium provider routing. | Blocking the basic "hover or select and understand" moment. |

Introduce accounts only when one of these is true:

- Provider costs need quota enforcement.
- Paid subscriptions are ready.
- Saved vocabulary or learning history needs cross-device sync.
- Abuse prevention becomes necessary.
- Users are asking for durable personal learning features.

## Cache Strategy Summary

| Layer | Status | Purpose | Persistence |
| --- | --- | --- | --- |
| In-memory cache | Done | Fast repeat requests during active browsing. | Lost when background worker/browser lifecycle clears it. |
| Local persistent cache | Done | Fast repeat lookup for intentional selected single words. | Stored in `storage.local` with TTL and max-entry cap. |
| Sync cache | Not recommended | Raw translation history should not move across devices by default. | Use sync later for saved vocabulary/settings, not passive cache. |

Persistent cache rules:

- Persist successful single-word selections only.
- Do not persist hover translations.
- Do not persist selected phrases or sentences.
- Keep cache entries separated by translation direction.
- Count unique source words in Options for user clarity.

## Planning Practices

- Keep each increment small enough to explain in one paragraph.
- Commit after each completed, verified step.
- Keep manual testing docs accurate after behavior changes.
- Prefer user trust and speed over feature volume.
- Do not introduce auth, billing, or dashboards before the first-use loop feels excellent.
- Before public release, hide or remove Developer settings from the normal user path.

## Critical Recommendation

Do not make DutchMate feel like a SaaS dashboard too early. The winning experience is not "manage translations"; it is "read naturally and understand more Dutch than before."

The best near-term sequence is:

1. Finish browser verification for Chrome and Firefox.
2. Keep polishing the free hover and selection experience.
3. Move provider setup behind a production backend before public release.
4. Add explicit saved vocabulary only after translation feels fast and reliable.
5. Add accounts when users want saved progress or when provider cost makes quotas necessary.
6. Add paid plans after users already have a habit.

The account wall should come after value, not before it.
