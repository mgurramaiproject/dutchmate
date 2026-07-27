# 009-proficiency-path: Implementation tickets

Parent issue: [#81 — A0 grammar progression specification](https://github.com/mgurramaiproject/dutchmate/issues/81)

Source plan: [009-proficiency-path-plan.md](./009-proficiency-path-plan.md)

Source specification: [009-proficiency-path-spec.md](./009-proficiency-path-spec.md)

Approved prototype direction: [Paper Rail review prototype](../../frontend/009-proficiency-path-prototype.html)

The canonical tracker records live issue state. This checked-in document mirrors the published child-ticket contracts so the implementation plan remains reviewable offline. Update each checklist with direct evidence as its matching issue is implemented. Work the frontier: #89 is the current human-validation gate; later tickets remain blocked by their listed dependencies.

## Delivery rules

- Implement one frontier ticket at a time in a fresh agent session using `$implement`; `$implement` drives `$tdd` internally and finishes with `$code-review` before committing.
- Keep the feature on `feature-009-proficiency-path` unless the delivery workflow establishes a ticket-specific branch.
- Preserve the twelve published lessons, their identifiers and completion records, the existing A0/A1/A2 filters, local vocabulary, normal translation, and the single Daily Five habit.
- Use the existing lesson-stage rail and Paper Rail shell. Do not create a grammar tab, second queue, placement flow, Verb Gym, Sentence Forge, Grammar Minute, or `Find my starting point` control.
- The first tracer uses calm single-check density: one decisive exercise per screen, correction before Check, and exact feedback after the first Check.
- Encounter Coaching in this delivery uses exact normalized reviewed subject-plus-form pairs only. It does not scan pages, persist raw encounter text, or add provider requests.
- New lessons are additive gap-filling only: one grammar companion on the existing A0 lesson plus three new A0 mini-lessons.
- Run focused tests during development, then typecheck, the relevant full suite, build/package checks, documentation checks, and the manual evidence named by the ticket before handoff.
- Update the matching GitHub issue checklist and Delivery fields with direct evidence. Do not start a blocked ticket early.

## Dependency map

```text
#82 ──> #83 ──┬──> #84 ──┐
             ├──> #85 ──┼──> #87 ──> #88 ──> #89
             └──> #86 ──┘
```

`#89` is the current human-validation gate after #88 engineering qualification. It remains blocked pending independent browser evidence, a qualified Dutch reviewer, and the delayed learner pilot; it cannot be satisfied by automated tests alone.

## T01 — Prove the `a0-zijn-present` tracer

GitHub: [#82](https://github.com/mgurramaiproject/dutchmate/issues/82)

**Blocked by:** None — can start immediately.

**What to build:** Prove one complete grammar companion through Lessons, one calm single-check click-only exercise, honest local pattern evidence, one mixed Daily Five task, and one exact-pair Encounter Coaching match. This establishes the minimum shared content, exercise, evidence, scheduling, and message contracts.

- [x] The existing `A0 · Hallo, ik ben…` lesson exposes a separately versioned `a0-zijn-present` companion without changing its identity, version, completion, or saved candidates. (`src/lessons/catalog.ts`, `src/lessons/catalog.test.ts`)
- [x] Read and Notice teach reviewed `zijn` forms; Practise provides a keyboard-operable choose-form exercise with finite accepted answers, misconception-coded distractors, and exact feedback. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, popup lesson flow)
- [x] The learner can change a selection before Check; only the first Check creates evidence; retry teaches without adding evidence; Reveal or Skip never records success. (`src/grammar/learning.ts`, `src/grammar/learning.test.ts`, popup grammar check state)
- [x] The local record represents introduction, scored practice, due scheduling, bounded recent exercise identity, and Introduced or Practising without raw answers, response times, page text, or full attempts. (`src/grammar/learning.ts`, `src/vocabulary/learning-record.ts`)
- [x] Daily Five can contain one labelled `zijn` task alongside vocabulary without changing vocabulary mastery. (`src/vocabulary/daily-five.ts`, `src/vocabulary/learning-record.ts`, popup Daily Five grammar rendering)
- [x] Exact normalized reviewed subject-plus-form matches are constrained to introduced `zijn` patterns. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [ ] Encounter practice adds no provider request, scans no page, persists no lookup text or URL, and stays silent for ambiguous or unstudied forms.
- [ ] Lesson, background, Daily Five, popup, webpage-lookup, tooltip, privacy, and preservation tests prove the tracer.

## T02 — Make the `zijn` tracer durable and reviewable

GitHub: [#83](https://github.com/mgurramaiproject/dutchmate/issues/83)

**Blocked by:** [T01 / #82](https://github.com/mgurramaiproject/dutchmate/issues/82)

**What to build:** Make the tracer portable, migration-safe, schedulable, and linguistically reviewable before adding more patterns.

- [x] Applied thresholds, local-day scheduling, delayed unseen/recombined evidence, bounded misconception counters, capped recent identities, and continued due practice are implemented. (`src/grammar/learning.ts`, `src/grammar/learning.test.ts`)
- [x] Typed result submission is idempotent and rejects stale, duplicated, unknown, or incompatible evidence without fabricating progress. (`src/background/messages.ts`, `src/background/learning-controller.ts`, `src/vocabulary/learning-record.ts`)
- [x] The mixed Daily Five snapshot resumes task identities and completed positions without persisting unfinished token or answer arrangements. (`src/vocabulary/daily-five.ts`, `src/vocabulary/learning-record.ts`, `src/vocabulary/learning-record.test.ts`)
- [x] Backup version 3 is atomic, imports versions 1 and 2, exports grammar evidence and the mixed snapshot, merges conservatively, and clears grammar data. (`src/vocabulary/learning-record.ts`, `src/vocabulary/learning-record.test.ts`)
- [x] Migration and round-trip tests preserve all twelve lesson records, saved items, and vocabulary mastery unchanged. (`src/vocabulary/learning-record.test.ts`)
- [x] The bundled validator covers stable identities, links, finite alternatives, misconception distractors, exact feedback, supported primitives, review metadata, sources, and provenance. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] Invalid grammar content disables grammar surfaces safely while translation, saved vocabulary, and existing lessons remain available. (`src/background/learning-controller.ts`, `src/vocabulary/learning-record.ts`)
- [x] A deterministic human-readable tracer content report is generated and tested. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)

## T03 — Teach `a0-hebben-present` end to end

GitHub: [#84](https://github.com/mgurramaiproject/dutchmate/issues/84)

**Blocked by:** [T02 / #83](https://github.com/mgurramaiproject/dutchmate/issues/83)

**What to build:** Add the new `A0 · Ik heb dit nodig` lesson and teach reviewed present `hebben` forms through the established Lessons, Daily Five, and Encounter Coaching loop.

- [x] Stable lesson `a0-ik-heb-dit-nodig` and pattern `a0-hebben-present` use the existing Read, Notice, Practise, Replay, and Keep flow. (`src/lessons/catalog.ts`, `src/grammar/content.ts`, `src/popup/index.ts`, `src/popup/index.test.ts`)
- [x] Reviewed content retains Dutch, English, and Telugu support. (`src/lessons/catalog.ts`, `src/lessons/catalog.test.ts`, `src/grammar/content.ts`)
- [x] Click-only exercises use finite answers, known misconception categories, varied contexts, exact correction, first-Check evidence, retry, Reveal, and Skip. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/grammar/learning.ts`, `src/grammar/learning.test.ts`, `src/popup/index.ts`, `src/popup/index.test.ts`)
- [x] Both reviewed `u hebt` and `u heeft` alternatives are accepted where the context permits either. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] Due `hebben` practice participates in mixed Daily Five without changing vocabulary behavior. (`src/vocabulary/daily-five.ts`, `src/vocabulary/daily-five.test.ts`, `src/vocabulary/learning-record.ts`, `src/vocabulary/learning-record.test.ts`)
- [x] Exact reviewed `hebben` pairs may offer Encounter Coaching only after introduction, with no provider calls or raw persistence. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/content/webpage-lookup-module.ts`, `src/content/webpage-lookup-module.test.ts`, `src/content/tooltip-view-adapter.ts`)
- [x] Validation and review output contain every released sentence, answer, distractor, feedback item, source, and review field. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] Existing lessons, progress, saved candidates, `zijn`, and the shared contracts remain compatible. (`src/popup/index.test.ts`, `src/vocabulary/learning-record.test.ts`, `src/grammar/learning.test.ts`, `src/background/message-handler.test.ts`)

## T04 — Teach `a0-regular-present` end to end

GitHub: [#85](https://github.com/mgurramaiproject/dutchmate/issues/85)

**Blocked by:** [T02 / #83](https://github.com/mgurramaiproject/dutchmate/issues/83)

**What to build:** Add the new `A0 · Ik woon en werk hier` lesson and teach reviewed present-tense agreement for a small useful regular-verb inventory.

- [x] Stable lesson `a0-ik-woon-en-werk-hier` and pattern `a0-regular-present` use the existing focused lesson flow. (`src/lessons/catalog.ts`, `src/grammar/content.ts`, `src/popup/index.ts`, `src/popup/index.test.ts`)
- [x] Reviewed content covers verbs such as `wonen`, `werken`, `leren`, and `maken` in subject-first main clauses. (`src/lessons/catalog.ts`, `src/lessons/catalog.test.ts`, `src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] Click-only practice includes subject changes, varied contexts, finite answers, stable misconception categories, exact feedback, and honest first-Check evidence. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/grammar/learning.ts`, `src/grammar/learning.test.ts`, `src/background/message-handler.test.ts`)
- [x] Due practice participates in mixed Daily Five without altering vocabulary mastery or protected positions. (`src/vocabulary/daily-five.ts`, `src/vocabulary/daily-five.test.ts`, `src/vocabulary/learning-record.ts`, `src/vocabulary/learning-record.test.ts`)
- [x] Exact reviewed subject-plus-form pairs can trigger Encounter Coaching only for an Introduced pattern, with no extra provider request or raw text persistence. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/content/webpage-lookup-module.ts`, `src/content/webpage-lookup-module.test.ts`, `src/content/tooltip-view-adapter.ts`)
- [x] Every authored or safely expanded combination appears in validation and the human-readable report. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/lessons/catalog.ts`, `src/lessons/catalog.test.ts`)
- [x] Existing lessons, progress, saved candidates, `zijn`, and `hebben` remain unchanged. (`src/popup/index.test.ts`, `src/vocabulary/learning-record.test.ts`, `src/background/message-handler.test.ts`)

## T05 — Teach `a0-yes-no-inversion` end to end

GitHub: [#86](https://github.com/mgurramaiproject/dutchmate/issues/86)

**Blocked by:** [T02 / #83](https://github.com/mgurramaiproject/dutchmate/issues/83)

**What to build:** Add the new `A0 · Woon je hier?` lesson and teach simple yes/no question order through click-based token ordering and precise `jij/je` versus `u` correction.

- [x] Stable lesson `a0-woon-je-hier` and pattern `a0-yes-no-inversion` use the existing focused lesson flow. (`src/lessons/catalog.ts`, `src/grammar/content.ts`, `src/popup/index.ts`, `src/popup/index.test.ts`)
- [x] Notice and Practise teach finite-verb-before-subject order, `jij/je` loss of `-t`, and reviewed retained `-t` before `u`. (`src/lessons/catalog.ts`, `src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] `order-tokens` is keyboard-operable, click-only, correctable before Check, and does not persist unfinished placement. (`src/popup/index.ts`, `src/popup/index.test.ts`, `src/grammar/learning.ts`, `src/grammar/learning.test.ts`)
- [x] Contrast and repair exercises identify retained `-t`, dropped `-t`, and invalid word order with exact feedback. (`src/grammar/content.ts`, `src/grammar/content.test.ts`)
- [x] Due inversion practice participates in Daily Five with normal first-Check, retry, Reveal, Skip, and scheduling behavior. (`src/vocabulary/daily-five.ts`, `src/vocabulary/daily-five.test.ts`, `src/vocabulary/learning-record.ts`, `src/vocabulary/learning-record.test.ts`, `src/background/message-handler.test.ts`)
- [x] Exact reviewed inversion pairs may offer Encounter Coaching only after introduction, with no extra provider request or raw persistence. (`src/grammar/content.ts`, `src/content/webpage-lookup-module.ts`, `src/content/webpage-lookup-module.test.ts`)
- [x] Validation, review output, and regressions cover all released language and preserve earlier patterns and lessons. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `src/lessons/catalog.test.ts`, `src/popup/index.test.ts`, `src/background/message-handler.test.ts`)

## T06 — Complete the A0 Foundation progression experience

GitHub: [#87](https://github.com/mgurramaiproject/dutchmate/issues/87)

**Blocked by:** [T03 / #84](https://github.com/mgurramaiproject/dutchmate/issues/84), [T04 / #85](https://github.com/mgurramaiproject/dutchmate/issues/85), and [T05 / #86](https://github.com/mgurramaiproject/dutchmate/issues/86)

**What to build:** Integrate the four reviewed patterns into a coherent additive A0 Foundation experience with recommendation, separate pattern progress, Paper Rail presentation, and balanced Daily Five composition.

- [x] A0 browsing presents the existing companion and three additive lessons while preserving A0/A1/A2 filters and direct selection.
- [x] Lesson metadata exposes each companion pattern's progress inline; Today does not duplicate it in a separate foundation-path panel.
- [x] Completed lessons remain complete; old completion never grants retroactive grammar evidence.
- [x] Introduced, Practising, and Applied remain separate from lesson completion.
- [x] Paper Rail preserves focused-flow orientation, Exit, keyboard behavior, live feedback, target sizing, and restrained celebration.
- [x] Daily Five enforces at most two grammar tasks, at least three vocabulary positions when eligible, due-first selection, overdue grammar protection, and starvation resistance.
- [x] Queue reopen resumes the same snapshot and does not fabricate filler.
- [x] All released click-only primitives behave consistently across Lessons, Daily Five, and Encounter Coaching.
- [x] Regression tests preserve all twelve lessons, progress, saved items, vocabulary mastery, translation, and A1/A2 availability.

## T07 — Qualify the A0 release candidate

GitHub: [#88](https://github.com/mgurramaiproject/dutchmate/issues/88)

**Blocked by:** [T06 / #87](https://github.com/mgurramaiproject/dutchmate/issues/87)

**What to build:** Produce the engineering, accessibility, privacy, compatibility, packaging, and content evidence needed for independent human validation.

- [x] Popup accessibility checks cover semantic controls, names, keyboard order, Enter/Space, focus, live results, targets, reduced motion, containment, and no horizontal scrolling. (`src/popup/index.test.ts`, `src/popup/styles.test.ts`, `docs/features/009-proficiency-path-validation.md`)
- [x] Encounter checks cover exact/ambiguous matching, dismissal, focus return, scrolling, lookup replacement, provider/storage failure, disablement, and zero incremental calls. (`src/content/webpage-lookup-module.test.ts`, `src/content/tooltip-view-adapter.test.ts`, `docs/features/009-proficiency-path-validation.md`)
- [x] Privacy checks prove no page scan, broader permission, raw encounter persistence, URL history, response timing, raw answers, full attempts, or behavioral timeline. (`src/content/webpage-lookup-module.test.ts`, `src/vocabulary/learning-record.test.ts`, `src/background/message-handler.test.ts`, `docs/features/009-proficiency-path-validation.md`)
- [x] Safe-failure checks keep translation, saved vocabulary, and all twelve lessons available when grammar content, storage, messages, imports, or versions fail. (`src/background/message-handler.test.ts`, `src/vocabulary/learning-record.test.ts`, `src/lessons/catalog.test.ts`, `docs/features/009-proficiency-path-validation.md`)
- [x] Focused tests, typecheck, relevant full suite, Chrome/Firefox builds, package verification, documentation links, whitespace, and release consistency pass. (`src/release/release-docs-consistency.test.ts`, `scripts/verify-extension-build.test.ts`, `docs/features/009-proficiency-path-validation.md`)
- [x] Manual browser evidence is fully scoped for popup sizing, keyboard-only completion, focus, tooltip edges, scrolling, import/export, storage failure, and lesson preservation, with execution handed to the independent human gate. (`docs/features/009-proficiency-path-validation.md`, `docs/release/manual-testing.md`)
- [x] The full deterministic content report and human-review/pilot packet are ready. (`src/grammar/content.ts`, `src/grammar/content.test.ts`, `docs/features/009-proficiency-path-validation.md`)

## T08 — Validate Dutch content and the delayed learning pilot

GitHub: [#89](https://github.com/mgurramaiproject/dutchmate/issues/89)

**Blocked by:** [T07 / #88](https://github.com/mgurramaiproject/dutchmate/issues/88)

**Execution:** Human validation; label `ready-for-human`.

**What to build:** Independently validate the A0 candidate with a second qualified Dutch reviewer and a small delayed learner pilot, then record a release or revise decision.

- [x] The data-minimizing reviewer, browser, learner-pilot, and decision packet is checked in; no participant data belongs in git. (`docs/features/009-proficiency-path-human-validation.md`)
- [x] Project owner reviewed every released sentence, alternative, distractor, explanation, feedback item, source, and provenance entry; formal qualification details were not recorded separately.
- [x] Product-owner findings are resolved; no blocking finding was reported.
- [x] The 6–10 learner pilot requirement was explicitly waived as infeasible; existing project-owner testing is recorded as usability evidence only.
- [x] No cohort baseline or delayed check was run; this accepted deviation means no learning-efficacy claim is made.
- [x] Project owner reported that the current build looks good in Chrome and Firefox; browser versions and operating systems were not recorded.
- [x] Encounter Coaching was included in the product validation scope; no disruption, false-positive, dismissal, or incremental-provider defect was reported.
- [x] Results, limitations, reviewer/date, deviations, and the revise-before-PR decision are recorded in the validation packet.

**Accepted limitation:** The project owner completed the available Chrome/Firefox and content review, but a 6–10 learner pilot was not feasible and was waived. Human validation passed with no learning-efficacy claim; browser versions/OS and separate reviewer qualification details were not recorded. The bundled PR is deferred because final branch review found engineering/spec gaps in Encounter Coaching, grammar timing/scheduling, progress-label semantics, delayed evidence, and review metadata.

## Tracker state at publication

| Ticket | GitHub | Label | Execution | Delivery Status | Default Status |
| --- | --- | --- | --- | --- | --- |
| T01 | [#82](https://github.com/mgurramaiproject/dutchmate/issues/82) | `ready-for-agent` | Agent | Ready | Todo |
| T02 | [#83](https://github.com/mgurramaiproject/dutchmate/issues/83) | `ready-for-agent` | Agent | Blocked | Todo |
| T03 | [#84](https://github.com/mgurramaiproject/dutchmate/issues/84) | `ready-for-agent` | Agent | Blocked | Todo |
| T04 | [#85](https://github.com/mgurramaiproject/dutchmate/issues/85) | `ready-for-agent` | Agent | Blocked | Todo |
| T05 | [#86](https://github.com/mgurramaiproject/dutchmate/issues/86) | `ready-for-agent` | Agent | Blocked | Todo |
| T06 | [#87](https://github.com/mgurramaiproject/dutchmate/issues/87) | `ready-for-agent` | Agent | Blocked | Todo |
| T07 | [#88](https://github.com/mgurramaiproject/dutchmate/issues/88) | `ready-for-agent` | Agent | Blocked | Todo |
| T08 | [#89](https://github.com/mgurramaiproject/dutchmate/issues/89) | `ready-for-human` | Human | Blocked | Todo |
