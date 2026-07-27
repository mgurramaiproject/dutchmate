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
