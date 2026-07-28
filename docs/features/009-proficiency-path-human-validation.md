# 009-proficiency-path: independent human-validation record

Status: **Human validation passed with accepted limitations**.

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
| Reviewer name or agreed identifier | Project owner |
| Qualification / grammar-teaching competence | Reviewer sign-off supplied by the project owner; formal qualification details were not recorded separately. |
| Review date | 2026-07-27 |
| Artifact commit | `04359b1` |
| Sources and provenance checked | Generated content report and released A0 grammar/lesson sources. |
| Findings | No blocking content findings reported. |
| Findings resolved or explicitly rejected | Product-owner feedback was resolved in the branch; no unresolved finding was reported. |
| Reviewer decision | Human validation passed with the pilot limitation recorded below; T09 addresses the final branch-review engineering gaps. |

Reviewer checklist:

- [x] Every released Dutch story line, prompt, answer, accepted alternative, distractor, correction, and encounter form was reviewed.
- [x] `jij/je` inversion and retained `u` forms were reviewed for correctness and understandable misconception feedback.
- [x] English and Telugu helpers were reviewed for intended meaning and bounded claims.
- [x] Context tags, sources, reviewer metadata, and reuse provenance were reviewed.
- [x] Product-owner findings were resolved in code/content; no remaining finding was reported.

## Browser evidence

Record one row per browser after loading the generated artifact on a normal readable webpage. This is a human observation, not a DOM-test assertion.

| Browser / version / OS | Artifact commit | Tester | Result | Notes / defects |
| --- | --- | --- | --- | --- |
| Chrome | `04359b1` / version and OS not recorded | Project owner | Pass | Project owner reported that the current build looks good; no defect reported. |
| Firefox | `04359b1` / version and OS not recorded | Project owner | Pass | Project owner reported that the current build looks good; no defect reported. |

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

## Follow-up Daily Five feedback before revision

- The `Review 5 more` action needed the same local-progress cue as the lesson action.
- The count uses generic reviewed-item wording because the canonical rhythm `reviews` field can include vocabulary and grammar review tasks.

This remains a browser usability finding until the revised state is re-tested in Chrome and Firefox.

Latest revision under test: completed Daily Five now shows the local reviewed-item count directly beneath `Review 5 more` and omits the redundant `5 of 5 today` progress line.

Browser sign-off recorded 2026-07-27: the project owner reported that the current `04359b1` build looks good in both Firefox and Chrome. Browser versions, operating systems, and per-check notes were not recorded separately.

## Learner pilot

This is a small voluntary product-learning check, not telemetry or a statistically powered efficacy study.

Accepted deviation: recruiting a 6–10 learner cohort was not feasible. The project owner had already completed the available end-to-end product testing, which is recorded as usability evidence only. No learning-efficacy claim is made from that testing.

- [x] The 6–10 learner pilot requirement was explicitly waived as infeasible; no participant data was collected.
- [x] Existing project-owner testing covered the available product usability signal; it is not treated as a cohort or efficacy result.
- [x] Encounter Coaching was included in the completed product validation scope; no disruption, false-positive, dismissal, or incremental-provider defect was reported.

Aggregate-only result table:

| Measure | Baseline | Delayed check | Threshold / interpretation |
| --- | ---: | ---: | --- |
| Median first-Check score | not collected | not collected | Pilot waived; no efficacy claim |
| Targeted misconception rate | not collected | not collected | Pilot waived; no efficacy claim |
| Core-flow completion without intervention | owner-tested | n/a | Product-owner usability signal only |
| Reading disruption / false-positive notes | no defect reported | n/a | Product-owner validation signal only |

## Decision record

| Field | Record |
| --- | --- |
| Reviewer findings resolved | Yes; no blocking finding reported. |
| Browser evidence complete | Yes; project owner reported Pass in Chrome and Firefox on `04359b1`. |
| Pilot aggregate recorded | Not run; explicit feasibility waiver recorded. |
| Limitations and deviations | No formal learner cohort, browser versions/OS, or separate reviewer qualification record. No efficacy claim. |
| Final decision: release / revise | Human validation passed with the pilot limitation recorded below; T09 engineering follow-up is complete, while the pilot waiver remains a release limitation. |
| Decision date and owner | 2026-07-27 · Project owner |

The directional learning thresholds were not evaluated because the pilot was waived. Keep the A0 release claim bounded: human validation covered the reviewed and owner-tested product candidate, not learning efficacy. T09 resolved the final branch-review findings in commit `f45dd4b`; browser versions/OS and separate reviewer qualification details remain unrecorded.

## Final branch-review findings

The final standards/spec review against `main` found these engineering follow-ups before PR; T09 resolved them:

- Encounter Coaching now launches one reviewed exercise, records shared evidence, and guards dismissal against stale responses.
- The earliest-incomplete-pattern recommendation is now compactly discoverable from Today and Lessons without an A0 path panel.
- Lesson grammar `Reveal` and `Skip` now persist safe next-day outcomes without success evidence.
- Grammar introduction now waits until the teaching encounter is reached.
- Unstarted patterns no longer display a learner-facing progress label.
- Delayed evidence now requires 24 elapsed hours.
- Released grammar metadata now records `second-review-complete` and the completed human review.

These were implementation/spec findings, not browser or content-review findings. They are resolved in T09; the pilot waiver and unrecorded browser/reviewer metadata remain explicit limitations.
