# Feature 017: `hebben` qualification record

**Feature:** `017-hebben-journeys`  
**Branch:** `017-hebben-journeys`  
**Status:** release qualification complete after automated checks, owner
language review, and owner manual QA on 2026-08-01.

This record is the checked-in T06 handoff. Structural validation is evidence
that the package is safe to execute, not evidence that every Dutch, English,
or Telugu string has passed human review.

## Authoring matrix

| Journey | Stable journey / skill | Target forms | Bounded person or construction scope | Practice / evidence | Review status |
| --- | --- | --- | --- | --- | --- |
| What I have and what is available | `journey.hebben.ott-possession` / `skill.hebben.ott-possession` | OTT | `heb`, `heeft`, `Heb`, `hebben`; possession and availability | five families; two repairs; additive skill evidence | structural; human review pending |
| What I feel, need, and have time for | `journey.hebben.ott-expressions` / `skill.hebben.ott-expressions` | OTT | feelings, needs, time, and bounded question inversion | five families; two repairs; separate skill evidence | structural; human review pending |
| What I had | `journey.hebben.ovt-possession` / `skill.hebben.ovt-possession` | OVT | `had` / `hadden` for past possession and background | five families; two repairs; separate skill evidence | structural; human review pending |
| What I have had | `journey.hebben.vtt-experience` / `skill.hebben.vtt-experience` | VTT | lexical `heb/heeft gehad`; present-linked completed experience | five families; two repairs; delayed evidence | structural; human review pending |
| What I have done | `journey.hebben.vtt-auxiliary` / `skill.hebben.vtt-auxiliary` | VTT | authored auxiliary `hebben` examples with selected `zijn` contrast | five families; two repairs; auxiliary skill evidence | structural; human review pending |
| What I will and would have | `journey.hebben.future-reference` / `skill.hebben.future-reference` | OTTT, OVTT, VTTT, VVTT | `zal hebben`, `zou hebben`, and labelled perfect variants | five families; two repairs; multi-form target contribution | structural; human review pending |

The pack also contains exactly eight canonical Dutch forms and twelve English
comparison records. Journey completion remains separate from form progress;
the progress denominator comes from the pack's canonical forms and not from
the number of journeys.

## Automated evidence

| Boundary | Evidence |
| --- | --- |
| Additive content | `src/verb-journeys/qualification.test.ts` validates the three-pack registry, `017-1`, eight forms, twelve comparisons, six five-line journeys, complete notices, and six owned practice banks. |
| Practice contract | Content and practice tests validate five distinct authored families per `hebben` journey, accepted answers, delayed/recombined order, and no more than two repairs. |
| Review loop | `src/vocabulary/learning-record.test.ts` verifies weak `hebben` evidence enters the existing Daily Five task path, records a result atomically, and preserves the additive task identity. |
| Persistence | Learning-record tests cover stale revisions, idempotency, export/import, clear-data behavior, and merging `werken`, `zijn`, and `hebben` evidence without replacing earlier packs. |
| Popup and accessibility | `src/popup/index.test.ts` covers the `hebben` directory, all six journey routes, Notice/map return paths, target-word color highlights and formula highlights, practice completion, retry/reset, semantic controls, keyboard-ready controls, and narrow-popup shared behavior. |
| Runtime boundary | Qualification sources remain authored and local; no audio, speech, media recording, runtime network, WebSocket, or LLM path was added. |

## Human review and QA

The feature owner confirmed completion of the Dutch, English, and Telugu
review and the manual browser QA on 2026-08-01. Manual QA found that the
`hebben` Notice displayed comparison chips but did not color-highlight the
important Dutch words inside sentences and formulas. The renderer now has a
dedicated `hebben` token map and a regression test for those highlights.

| Review | Reviewer / date | Provenance or notes | Result |
| --- | --- | --- | --- |
| Fluent-Dutch content review | Feature owner / 2026-08-01 | Owner-confirmed review of forms, stories, notices, comparisons, practice, and feedback. | Passed |
| English/Telugu meaning and clarity review | Feature owner / 2026-08-01 | Owner-confirmed review of story support, notices, comparisons, and feedback. | Passed |
| Chrome/Firefox manual QA | Feature owner / 2026-08-01 | Owner-confirmed manual QA; missing `hebben` Notice highlights were fixed and regression-tested. | Passed |

## Deferred scope and compatibility

The broader cross-verb auxiliary mini-course remains parked for later; the
shipped journey owns only its authored practical contrast. No new scheduler,
queue, mastery model, Saved resolver, permission, or runtime dependency was
introduced. The `017-1` merge path is additive and keeps earlier `015-1` and
`016-1` evidence keys intact.

## Delivery state

T01–T06 are implemented and committed on the feature branch. Do not close
child issues, run the single feature-wide code review, or open the PR in this
branch session; those are the next delivery gates after this handoff.
