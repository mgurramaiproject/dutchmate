# Feature 017: `hebben` qualification record

**Feature:** `017-hebben-journeys`  
**Branch:** `017-hebben-journeys`  
**Status:** automated qualification implemented; human language review and
manual browser QA pending owner confirmation.

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
| Popup and accessibility | `src/popup/index.test.ts` covers the `hebben` directory, all six journey routes, Notice/map return paths, practice completion, retry/reset, semantic controls, keyboard-ready controls, and narrow-popup shared behavior. |
| Runtime boundary | Qualification sources remain authored and local; no audio, speech, media recording, runtime network, WebSocket, or LLM path was added. |

## Manual gates still required

These gates are intentionally not checked off by automated output:

1. An independent reviewer proficient in Dutch must review the eight forms,
   twelve English comparisons, all six stories, target spans, auxiliary
   contrast, distractors, feedback, idiomaticity, and A1/A2/reference fit.
2. English and Telugu support must be checked for meaning and clarity rather
   than only non-empty fields.
3. A human must load the current Chrome and Firefox artifacts and exercise the
   `hebben` directory, keyboard/focus path, narrow popup, incorrect/retry/
   reset path, map/comparison return, completion, Today, and Daily Five review.

| Review | Reviewer / date | Provenance or notes | Result |
| --- | --- | --- | --- |
| Fluent-Dutch content review | Pending | Must be recorded by the feature owner or independent reviewer. | Pending |
| English/Telugu meaning and clarity review | Pending | Must cover story support, notices, comparisons, and feedback. | Pending |
| Chrome/Firefox manual QA | Pending | Must record browser versions, artifact commit, and the completed checklist. | Pending |

## Deferred scope and compatibility

The broader cross-verb auxiliary mini-course remains parked for later; the
shipped journey owns only its authored practical contrast. No new scheduler,
queue, mastery model, Saved resolver, permission, or runtime dependency was
introduced. The `017-1` merge path is additive and keeps earlier `015-1` and
`016-1` evidence keys intact.

## Delivery state

T01–T05 are implemented and committed on the feature branch. T06 automated
qualification is implemented here. Do not close child issues, run the single
feature-wide code review, or open the PR until the human gates above are
confirmed and the final full-build evidence is recorded.
