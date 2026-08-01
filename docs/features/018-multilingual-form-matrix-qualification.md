# Feature 018: multilingual form-matrix qualification

Status: qualification complete; ready for the single feature review and PR
handoff.

Date: 2026-08-01

## Automated evidence

| Boundary | Evidence |
| --- | --- |
| Content contract | `src/verb-journeys/content.test.ts` validates all three active packs, 24 localized form records, 24 localized common-use records, stable identities, and no `Unavailable` values. |
| Popup surface | `src/popup/index.test.ts` covers the Map-first `werken` route, all three localized card rows, the three-symbol legend, updated viewpoint labels, detail content, nearest scrolling, and the additive `zijn`/`hebben` map routes. |
| History compatibility | `src/verb-journeys/learning.test.ts` accepts old and multilingual content versions; `src/vocabulary/learning-record.test.ts` verifies legacy evidence survives import into the multilingual version. |
| Repository verification | Full test suite, typecheck, Chrome build, Firefox build, and `git diff --check` passed on this branch. |

## Human release gates

| Gate | Reviewer / date | Sources or notes | Result |
| --- | --- | --- | --- |
| English/Telugu clarity and literal NL/EN/TE alignment | User-confirmed independent review | The exact 24 form and 24 common-use records are in `src/verb-journeys/content.ts`; user confirmed the independent review complete on 2026-08-02. | Pass |
| Independent fluent-Dutch review | User-confirmed independent review | User confirmed the independent review complete on 2026-08-02; structural tests remain separate from linguistic approval. | Pass |
| Firefox and supported Chromium QA at default, 110%, and 125% zoom | User-confirmed feature-owner QA | User confirmed manual QA complete and satisfactory on 2026-08-02, including the required zoom, long-content, keyboard, clipping, alignment, and overflow checks. | Pass |

These gates are intentionally not marked complete by automated evidence. After
they pass, update the T03 checklist and reconcile the parent issue before the
single code-review and PR handoff.
