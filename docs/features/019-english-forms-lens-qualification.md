# Feature 019: English Forms Lens qualification

**Status:** qualification complete; ready for the single feature review and PR handoff
**Date:** 2026-08-02
**Branch:** `feature/019-english-forms-lens`
**ADR:** [0011 — English comparison lens is additive](../adr/0011-019-english-comparison-lens-is-additive.md)

This record separates reproducible engineering evidence from the human gates
required by the Feature 019 spec. The human gates below were confirmed by the
feature owner on 2026-08-02.

## Automated evidence

| Boundary | Evidence | Result |
| --- | --- | --- |
| Versioned content contract | `src/verb-journeys/content.test.ts` validates the `019-1` contract, stable IDs, 12 forms per pack, and 36 records across `werken`, `zijn`, and `hebben`. | Pass |
| Pack qualification | `src/verb-journeys/qualification.test.ts` validates all active packs, localized form content, six journeys per pack, and practice banks. | Pass |
| Popup contract | `src/popup/index.test.ts` passes 71 tests, including the `werken` list/detail/map flow and cross-pack `zijn`/`hebben` lens entry and detail rendering. | Pass |
| Persistence compatibility | Background and learning-record suites pass with additive `019-1` evidence, Daily Five validation, legacy import, and unchanged evidence semantics. | Pass |
| Full repository tests | `npm test`: 111 test files, 782 tests passed. | Pass |
| Typecheck | `npm run typecheck` / build typecheck. | Pass |
| Extension builds | `npm run build` completed for Chrome and Firefox. | Pass |
| Whitespace | `git diff --check`. | Pass |

## Human release gates

| Gate | Reviewer / date | Sources or notes | Result |
| --- | --- | --- | --- |
| Default popup, 110%, and 125% zoom in Firefox and supported Chromium | Feature owner (user-confirmed) / 2026-08-02 | Manual QA covered `werken`, `zijn`, and `hebben` comparison entry points in the popup, including clipping, overlap, focus, obstruction, and horizontal overflow. | Pass |
| Keyboard and accessibility QA | Feature owner (user-confirmed) / 2026-08-02 | Manual QA covered keyboard focus and activation, visible focus, tab/card state, Dutch form badges, cues, disclosures, and Previous/Next boundaries in the popup. | Pass |
| English/Telugu clarity and literal NL/EN/TE alignment | Feature owner (user-confirmed) / 2026-08-02 | Linguistic review covered the authored records in `src/verb-journeys/content.ts`: `werkenEnglishComparisonContent`, `zijnEnglishComparisonBase`, and `hebbenEnglishComparisonBase`; structural tests remain separate from linguistic approval. | Pass |
| Fluent-Dutch review | Feature owner (user-confirmed) / 2026-08-02 | Fluent-Dutch review covered all 12 comparison records in each active pack from `werkenEnglishComparisonContent`, `zijnEnglishComparisonBase`, and `hebbenEnglishComparisonBase` in `src/verb-journeys/content.ts`. | Pass |

## Handoff state

- ADR 0011, the Feature 019 plan, spec, ticket index, and this qualification
  record use feature code `019` and codename `english-forms-lens`.
- Child issues #154–#156 have implementation evidence and remain open for the
  later bundled feature review and PR workflow.
- Child issue #157 is now qualified for the bundled feature review and PR. The
  parent issue #153 remains unchanged apart from normal tracker state.
- No code review or PR was created, per the approved implementation scope.

The human gates were confirmed on 2026-08-02. Perform the one bundled code
review and PR handoff for Feature 019.
