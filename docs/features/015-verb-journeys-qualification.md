# Feature 015: `werken` qualification record

Status: automated qualification complete; independent fluent-Dutch review and
manual browser QA passed by owner confirmation on 2026-07-31.

This record is the evidence handoff for [#129](https://github.com/mgurramaiproject/dutchmate/issues/129).
It deliberately does not claim a linguistic review that has not been performed
by an independent fluent-Dutch reviewer.

## Automated evidence

The release contract is covered by these checks:

| Boundary | Evidence |
| --- | --- |
| Authored pack | `src/verb-journeys/qualification.test.ts` validates the versioned pack, eight Dutch forms, twelve English mappings, three core journeys, and complete Notice content. |
| Practice contract | The same qualification test verifies five distinct core exercise families and no more than two authored repairs. Existing practice tests verify deterministic answers, bounded repairs, and retry/reset behaviour. |
| End-to-end route | `src/popup/index.test.ts` covers Lessons → Verb Journeys → `werken` → OTT/VTT/OVT story → Notice → eight-form map; the VTT test continues through five decisions, completion, and contrast review. The English comparison test reaches all twelve records and returns to the selected map form. Daily Five tests cover return to Today through the existing review owner. |
| Navigation and layout | Existing popup tests cover semantic tabs, roving keyboard navigation, focus orientation, visible controls, fixed verb numbering, and Saved return paths. The qualification test verifies the three inline tab icons, 390×600 popup contract, focus-visible styling, reduced-motion styling, and renderer recovery wiring. |
| Renderer recovery | `src/popup/render-recovery.test.ts` proves a failed screen renderer leaves a visible `Return to Today` action. The popup uses this boundary for every screen render. |
| Runtime boundary | Feature sources are checked for absence of audio, speech, media recording, runtime network calls, WebSockets, and LLM references. Practice remains authored and deterministic. |
| Persistence and queue boundary | Existing T03/T04 tests cover additive evidence, migration, revision checks, Daily Five selection, vocabulary protection, and the single existing review queue. |
| Packaging | `npm test` passed with 110 test files and 714 tests; `npm run typecheck`, `npm run build:chrome`, `npm run build:firefox`, both `verify-extension-build.mjs` targets, `npm run package:extensions`, and `verify-extension-release.mjs` all passed. |

## Manual gates still required

These gates cannot be honestly certified by automated tests:

1. An independent reviewer proficient in Dutch must review all eight forms, all
   twelve English mappings, VTT/OVT nuance, everyday alternatives, story
   naturalness, distractors, feedback accuracy, and CEFR suitability.
2. A human must run the popup at the supported extension size using keyboard
   only, including focus order, map/comparison controls, retry/reset, narrow
   text wrapping, reduced motion, and completion-to-Today orientation.

Record the following when those gates are complete:

| Review | Reviewer / date | Provenance or notes | Result |
| --- | --- | --- | --- |
| Fluent-Dutch content review | MGurram / 2026-07-31 | Project owner explicitly confirmed the independent Dutch review as complete in the implementation handoff; this record is the provenance for that confirmation. | Passed |
| Popup keyboard/visual QA | Feature owner confirmation / 2026-07-31 | User explicitly confirmed the manual QA as complete in the implementation handoff. Browser and viewport details were not recorded separately. | Passed |

## Rollback and compatibility

The slice adds no extension permission, remote runtime dependency, or second
queue. Invalid bundled content is rejected by
`isVerbJourneyContentAvailable()` before the journey route is used. The
additive learning-record path and existing migration safeguards remain the
rollback boundary; no destructive data reset is required.

## Delivery state

The two human gates are now recorded as passed by owner confirmation. Issue
#129 and the remaining Feature 015 issues are ready for final review and the
single Feature 015 pull request.
