# Feature 018: multilingual form-matrix qualification

Status: automated qualification complete; independent linguistic review and
interactive browser QA remain release gates before the single feature review
and PR handoff.

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
| English/Telugu clarity and literal NL/EN/TE alignment | Pending independent reviewer | The exact 24 form and 24 common-use records are in `src/verb-journeys/content.ts`; reviewer and authoritative sources must be recorded here. | Pending |
| Independent fluent-Dutch review | Pending independent reviewer | Structural tests are not treated as linguistic approval. | Pending |
| Firefox and supported Chromium QA at default, 110%, and 125% zoom | Pending feature owner | Check OTT, VTTT, VVTT, longest Telugu content, keyboard focus, clipping, row alignment, and horizontal overflow. | Pending |

These gates are intentionally not marked complete by automated evidence. After
they pass, update the T03 checklist and reconcile the parent issue before the
single code-review and PR handoff.
