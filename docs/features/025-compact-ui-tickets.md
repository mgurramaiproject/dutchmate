# Feature 025 — Practical Dutch Compact UI Tickets

**Codename:** `compact-ui`
**Parent issue:** [#195 — Practical Dutch compact UI](https://github.com/mgurramaiproject/dutchmate/issues/195)
**Status:** Published
**Prepared:** 2026-08-05

The tickets are ordered by dependency frontier. Each child issue is labelled
`ready-for-agent`; the parent issue remains open and unchanged.

## 01 — Compact Practical Dutch topic rows [x]

**Issue:** [#196](https://github.com/mgurramaiproject/dutchmate/issues/196)

**Blocked by:** None — can start immediately.

**What it delivers:** Each Practical Dutch topic is an exactly three-row
selection unit with compact ready, Continue, and completed states. A learner
can open A1 or A2 by pointer or keyboard while existing progress and
accessibility behavior remain intact.

## 02 — Compact focused shell and Read stage [x]

**Issue:** [#197](https://github.com/mgurramaiproject/dutchmate/issues/197)

**Blocked by:** None — can start immediately.

**What it delivers:** Opening an A1 or A2 lesson provides the compact
`← Practical Dutch` header, CEFR level, gated stage rail, one scroll region,
compact Read content, and session-local translation visibility.

## 03 — Compact Notice, Practise, and Keep stages

**Issue:** [#198](https://github.com/mgurramaiproject/dutchmate/issues/198)

**Blocked by:** [#197 — Compact focused shell and Read stage](https://github.com/mgurramaiproject/dutchmate/issues/197).

**What it delivers:** Learners can continue through Notice, Practise, and Keep
using the compact shell without changing support, feedback, evidence,
completion, resume, restart, or review-selection semantics.

## 04 — Cross-browser and viewport qualification

**Issue:** [#199](https://github.com/mgurramaiproject/dutchmate/issues/199)

**Blocked by:**

- [#196 — Compact Practical Dutch topic rows](https://github.com/mgurramaiproject/dutchmate/issues/196)
- [#197 — Compact focused shell and Read stage](https://github.com/mgurramaiproject/dutchmate/issues/197)
- [#198 — Compact Notice, Practise, and Keep stages](https://github.com/mgurramaiproject/dutchmate/issues/198)

**What it delivers:** The complete compact flow is qualified across Chromium
and Firefox, supported zoom levels, keyboard and assistive technology paths,
long content, one-scroll-region behavior, and neighboring-surface regressions.

## Frontier

Tickets #196 and #197 can start immediately. Ticket #198 becomes available
after #197. Ticket #199 becomes available after #196, #197, and #198.
