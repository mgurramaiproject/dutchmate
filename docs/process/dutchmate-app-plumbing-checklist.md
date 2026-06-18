# DutchMate App Plumbing Checklist

Last updated: 2026-06-17

This note adapts ideas from the Vibeblog article "How I'd approach learning to build apps today, knowing what I know" for DutchMate.

Source:

- https://vibeblog.net/blog/2026-05-25-how-id-learn-to-build-apps-today/

## Why This Matters For DutchMate

The article's core point is useful: the visible app is only part of the job. For a real product, the higher-leverage work is often the plumbing around it.

That applies directly to DutchMate.

DutchMate already has:

- a front end: the public site in `frontend/`
- an extension UI: content tooltip and Options page in `src/`
- a back end: the translation service in `backend/`
- lightweight data storage: browser local storage today, with room for future server-side data later

The biggest risk for DutchMate is not "can we render a tooltip?" It is whether the system is safe, reliable, review-friendly, cheap enough to operate, and understandable enough to maintain.

## Four-Part Mental Model

Use this simple map when making product decisions:

1. Front end
2. Back end
3. Data storage
4. Plumbing

For DutchMate, the plumbing category deserves extra attention.

## DutchMate Plumbing Checklist

### 1. How does everything talk to each other?

Questions to keep asking:

- What data flows from extension to backend?
- What data flows from backend to Google Cloud Translation?
- What data stays only in the browser?
- Which requests are hover-only, selection-only, or settings-related?

DutchMate-specific rules:

- Keep the extension-to-backend request contract explicit and documented.
- Keep browser-store privacy disclosures aligned with the real request payload.
- Keep provider API keys on the backend only.
- Avoid putting new third-party calls directly in the extension unless there is a strong reason.

Current good pattern:

- extension -> DutchMate backend -> Google Cloud Translation

## 2. Where does it live, and how does it get online?

Questions to keep asking:

- Which part is public website hosting?
- Which part is backend hosting?
- Which environment variables are required?
- How do we rebuild store packages from scratch?

DutchMate-specific rules:

- Keep `frontend/` deployable as a static site with minimal dependencies.
- Keep the backend deploy path simple and reproducible.
- Keep build and package steps written down for reviewers and for future you.
- Treat browser-store packages as release artifacts, not as the source of truth.

Important repo patterns already in place:

- Render static site for `frontend/`
- Render web service for `backend/`
- scripted packaging for Chrome and Firefox
- source package instructions for Firefox AMO review

## 3. Who is allowed in, and is it safe?

Questions to keep asking:

- Are we exposing secrets?
- Are we collecting only the minimum data needed?
- Are store disclosures honest?
- Are abuse and cost controls strong enough for public sharing?

DutchMate-specific rules:

- Never ship provider secrets in the extension bundle.
- Keep normal-user builds free of developer endpoint overrides.
- Keep privacy language specific, plain, and stable across homepage, privacy page, and store forms.
- Treat translation requests as sensitive user-chosen content.
- Add cost and abuse guardrails before broadening public reach.

Practical safety areas for DutchMate:

- rate limits
- backend logging discipline
- cache boundaries
- CORS and extension-origin handling
- browser-store reviewer clarity

## 4. How do we know it works and is not quietly on fire?

Questions to keep asking:

- How do we verify Chrome and Firefox behavior after each risky change?
- How do we notice backend failures or cost spikes quickly?
- How do we know a browser-store package still matches the source?

DutchMate-specific rules:

- Keep manual browser smoke tests current.
- Keep packaging reproducible from committed source.
- Keep Google Cloud cost checks and alerts current.
- Prefer focused tests around extension state, caching, and translation request handling.
- Keep commits small enough that regressions are explainable.

Operational signals worth watching:

- translation error rate
- latency
- provider status codes
- request volume
- cache clear behavior
- browser-specific regressions

## What This Changes In Practice

When building DutchMate further, prefer this order:

1. Clarify the user-facing behavior.
2. Clarify the data flow.
3. Clarify the store/privacy impact.
4. Clarify the build/release impact.
5. Then implement the feature.

This is especially important for:

- flashcards or spaced repetition
- synced user data
- accounts or auth
- new languages
- new providers
- analytics
- paid plans

## Near-Term Guidance For DutchMate

Based on the article and the current repo state, the highest-value habits for DutchMate are:

- keep release packaging boring and reproducible
- keep store disclosures accurate and easy to reuse
- keep the backend as the only place where secrets live
- keep cost controls visible before broadening public distribution
- keep browser-specific QA explicit, especially for Chrome and Firefox

## Rule Of Thumb

If a future DutchMate feature sounds exciting but makes any of these fuzzy, pause and answer them first:

- What is the exact data flow?
- Where does the secret live?
- What changes for store review and privacy disclosure?
- How do we verify it in both browsers?
- What fails if the backend, provider, or cache misbehaves?
