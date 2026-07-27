# 009-proficiency-path: independent human-validation record

Status: **BLOCKED pending external evidence**.

This is the result template for T08 / #89. It is intentionally separate from the engineering evidence in [009-proficiency-path-validation.md](./009-proficiency-path-validation.md). The agent can prepare the protocol and preserve the product boundary, but cannot act as the qualified Dutch reviewer, recruit participants, or claim browser and learning results that were not observed.

No participant data belongs in git. Store consent, raw notes, and any participant-level observations outside the repository. Commit only anonymized aggregate results, reviewer sign-off, limitations, and the final release / revise decision.

## Preconditions

- Engineering qualification: T07 / #88, commit `54a6d5e`.
- Browser artifacts: `dist/chrome` and `dist/firefox` generated from the feature branch.
- Approved scope: four reviewed A0 patterns, fifteen bundled lessons, existing Today/Lessons/Saved surfaces, exact Encounter Coaching, and the existing local learning record.
- Forbidden claims: formal CEFR certification, independent speaking/writing proficiency, and product efficacy from clicks, completion, or return frequency.

## Reviewer record

The reviewer must be a second fluent Dutch reviewer with grammar-teaching competence and must inspect the generated report from `createGrammarContentReport()` rather than only the source code.

| Field | Record |
| --- | --- |
| Reviewer name or agreed identifier | _pending_ |
| Qualification / grammar-teaching competence | _pending_ |
| Review date | _pending_ |
| Artifact commit | _pending_ |
| Sources and provenance checked | _pending_ |
| Findings | _pending_ |
| Findings resolved or explicitly rejected | _pending_ |
| Reviewer decision | _pending_ |

Reviewer checklist:

- [ ] Every released Dutch story line, prompt, answer, accepted alternative, distractor, correction, and encounter form is linguistically acceptable.
- [ ] `jij/je` inversion and retained `u` forms are correct and the misconception feedback is understandable.
- [ ] English and Telugu helpers preserve the intended meaning and do not introduce a new learning claim.
- [ ] Context tags, sources, reviewer metadata, and reuse provenance are complete.
- [ ] Any finding is resolved in code/content or explicitly recorded as a release blocker.

## Browser evidence

Record one row per browser after loading the generated artifact on a normal readable webpage. This is a human observation, not a DOM-test assertion.

| Browser / version / OS | Artifact commit | Tester | Result | Notes / defects |
| --- | --- | --- | --- | --- |
| Chrome | _pending_ | _pending_ | _pending_ | _pending_ |
| Firefox | _pending_ | _pending_ | _pending_ | _pending_ |

Each browser pass must cover popup sizing and narrow containment, keyboard-only tab and grammar completion, visible focus, live correction, reduced motion, tooltip edges and scrolling, import/export, storage failure, provider failure recovery, extension disablement, and preservation of prior lesson progress. Encounter Coaching must also be checked for exact and ambiguous matches, dismissal, focus return, false positives, and zero incremental provider calls.

## Observed Firefox feedback before revision

- Tester: project owner.
- Browser: Firefox; version and operating system were not recorded.
- Positive result: the popup rendered and the tester reported that the Firefox check looked good overall.
- Revision findings: Today spent too much vertical space on the foundation-pattern card; its `Practising` state and next step were unclear; the lower actions were hidden below the fold; and the grammar contribution inside Daily Five did not feel substantial or valuable enough.
- Product questions raised: whether the foundation-pattern surface belongs on Today, whether the lower actions are redundant with the top tabs, and how to make grammar practice feel like useful transfer rather than another small click.

This is a usability finding, not a release sign-off. The findings require a revised build and a repeat browser check before the browser gate can be marked complete.

Previous revision under test: Today kept one primary Daily Five action and an optional compact lesson-resume action; the A0 path was reduced to a compact row in Lessons; redundant Today actions were removed; and grammar tasks named the practical pattern capability before the exercise.

## Follow-up Chrome and Firefox feedback before revision

- Browsers: Chrome and Firefox; versions and operating systems were not recorded.
- Lessons: the compact `A0 path` row duplicated the CEFR metadata already present on each lesson and did not visibly change after practice, so it was still confusing and is being removed.
- Lessons: filtered results restarted numbering at `01`; lesson numbers need to remain stable from the full catalog.
- Today: `Continue lesson` needed a centered, clearly lesson-specific button treatment.
- Saved: Export failed to download the learning backup in the browser.

This is another usability/functional finding, not a release sign-off. The revised build must be re-tested in both browsers before these observations can be marked resolved.

Latest revision under test: the A0 path row is removed completely; lesson numbers come from the full catalog rather than the filtered view; the Today resume action is centered and styled as a secondary lesson button; and Saved Export uses the popup's native download link path.

## Follow-up Today feedback before revision

- After completing one lesson, the Today lesson action disappeared because `Continue lesson` was only shown for an incomplete lesson.
- The requested distinction is now explicit: incomplete work uses `Continue lesson`; after a completed lesson, the action becomes `Learn another lesson` and opens the Lessons tab.
- Today also shows the local count beneath the action, such as `1 lesson completed today`.

This remains a browser usability finding until the revised state is re-tested in Chrome and Firefox.

## Learner pilot

This is a small voluntary product-learning check, not telemetry or a statistically powered efficacy study.

- [ ] Recruit 6–10 target learners, including at least three genuine A0/Pre-A1 learners.
- [ ] Obtain informed consent and allow withdrawal without explanation.
- [ ] Keep participant identity and raw notes outside the repository.
- [ ] Run a short baseline before supported practice.
- [ ] Run the supported lesson and mixed Daily Five flow using reviewed A0 material.
- [ ] Run a delayed check 2–7 days later using reviewed unseen or recombined material.
- [ ] Review Encounter Coaching separately for disruption, false positives, dismissal, and zero incremental provider requests.

Aggregate-only result table:

| Measure | Baseline | Delayed check | Threshold / interpretation |
| --- | ---: | ---: | --- |
| Median first-Check score | _pending_ | _pending_ | Delayed must exceed baseline for the directional gate |
| Targeted misconception rate | _pending_ | _pending_ | Delayed rate must be lower |
| Core-flow completion without intervention | _pending_ | n/a | At least 80%; participants must understand correction and retain prior lesson progress |
| Reading disruption / false-positive notes | _pending_ | n/a | Qualitative review; no silent acceptance of serious disruption |

## Decision record

| Field | Record |
| --- | --- |
| Reviewer findings resolved | _pending_ |
| Browser evidence complete | _pending_ |
| Pilot aggregate recorded | _pending_ |
| Limitations and deviations | _pending_ |
| Final decision: release / revise | _pending_ |
| Decision date and owner | _pending_ |

If either directional learning threshold fails, or if the browser/content gate finds a serious defect, record **revise**, create the smallest follow-up issue, and keep the A0 release claim bounded. Do not weaken thresholds after seeing the results.
