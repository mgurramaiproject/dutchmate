# Tickets 012: Grammar Content Packs

**Code name:** `grammar-packs`

**Status:** published; tickets are implementation-ready but remain subject to
the repository's normal issue and Delivery workflow.

**Source plan:** [012-grammar-packs-plan.md](./012-grammar-packs-plan.md)

**Source specification:** [012-grammar-packs-spec.md](./012-grammar-packs-spec.md)

GitHub issues are the tracker source of truth. This checked-in document mirrors
the published implementation slices and their dependency edges for offline
review.

## Delivery rules

- Implement one frontier ticket at a time in a fresh implementation session.
- Keep the work on `feature-012-grammar-packs` unless the delivery workflow
  establishes a ticket-specific branch.
- Do not start a blocked ticket early.
- Update each checklist with direct evidence as its matching issue is
  implemented; a copied checklist is not proof of completion.
- Preserve the four pattern IDs, content versions, existing learning record,
  lesson identities, Daily Five semantics, and existing popup surfaces.
- Do not add runtime AI, typing, free-form grading, a second scheduler, a new
  top-level destination, or a new schema without returning to the user.
- Run focused checks during development, then the relevant full suite,
  typecheck, browser builds/package checks, documentation checks, and manual
  evidence named by the ticket before handoff.
- Commit every intentional repository change. Finish each ticket handoff with
  a clean worktree, tracker reconciliation when published, and one concrete
  next action naming the relevant skill.

## Dependency map

```text
T01 ──> T02 ──> T03 ──> T04
  └──────────────> T04
```

T01 is the compatibility and content audit. T02 may change authored content
or validators only where T01 records a concrete gap. T03 proves the existing
surface and evidence seams. T04 is the release and independent human gate.

## T01 — Audit the existing grammar pack

**GitHub:** [#102](https://github.com/mgurramaiproject/dutchmate/issues/102)

**Blocked by:** None.

**What to build:** Establish a checked, repository-grounded gap list for the
four shipped A0 patterns before changing runtime behavior.

- [x] Map the four pattern IDs, content versions, exercises, primitives,
  accepted answers, distractors, feedback, review metadata, and companion
  lessons.
- [x] Map the exercise renderer and keyboard/focus behavior in Lessons and
  Daily Five.
- [x] Map first-Check, retry, Reveal, Skip, `evidenceRevision`, scheduling,
  recent-exercise protection, and duplicate/stale submission guards.
- [x] Map Daily Five grammar cap, due-first selection, duplicate-target
  protection, and vocabulary protection.
- [x] Run the existing focused grammar/content/learning/Daily Five/popup checks
  and record the baseline.
- [x] Identify only concrete content, accessibility, selection, or validation
  gaps; do not invent new curriculum or speculative schema work.
- [x] Confirm whether T02 or T03 needs a code change. T02 needs the four
  validator/content-governance fixes recorded in
  [the T01 audit](./012-grammar-packs-audit.md); no T03 runtime fix is
  indicated by the audit. If no gap exists, close
  the ticket with evidence and avoid unnecessary implementation.

## T02 — Harden reviewed four-pattern content

**GitHub:** [#103](https://github.com/mgurramaiproject/dutchmate/issues/103)

**Blocked by:** [T01 / #102](https://github.com/mgurramaiproject/dutchmate/issues/102).

**What to build:** Make the smallest authored-content or build-time validation
changes required by the T01 gap list while keeping existing pattern identity and
runtime contracts stable.

- [x] Keep all content attached to one of the four shipped pattern IDs.
- [x] Preserve content versions and local-record migration behavior.
- [x] Add or adjust an exercise only when its prompt, context, accepted
  alternatives, distractors, misconception codes, and feedback are fully
  enumerated. T02 adds no exercise; the existing sixteen remain fully
  enumerated.
- [x] Confirm every released answer is linguistically defensible and every
  deliberately incorrect example is excluded from positive pools.
- [x] Record author, reviewer, review state, review date, sources, and
  provenance for every changed item.
- [x] Add deterministic fixtures for correct, incorrect, ambiguous, retry,
  Reveal, Skip, and repeated-selection behavior where coverage is missing.
- [x] Prove draft or unreviewed content cannot enter the runtime bundle.
- [x] Run the focused content and grammar-learning checks.

**T02 evidence (2026-07-30):** `src/grammar/content.ts` now requires the
canonical four-pattern pack, second-review metadata at pattern and exercise
level, and a complete accepted-answer/distractor partition for every choice.
`createGrammarContentReport()` emits every exercise's review metadata.
`src/grammar/content.test.ts` covers missing-pack, draft-pattern,
draft-exercise, multi-answer, report-completeness, and unclassified-choice
fixtures. Existing grammar-learning, Daily Five, storage, popup, background,
and webpage-encounter tests remain green. Independent fluent-Dutch release
review remains a T04 gate.

## T03 — Qualify existing Lessons and Daily Five integration

**GitHub:** [#104](https://github.com/mgurramaiproject/dutchmate/issues/104)

**Blocked by:** [T02 / #103](https://github.com/mgurramaiproject/dutchmate/issues/103),
or T01 if T02 records no required content change.

**What to build:** Prove the hardened pack remains inside the existing learner
loop and does not fork evidence, scheduling, navigation, or daily composition.

- [x] Existing Lessons expose the reviewed pattern practice without changing
  lesson identity, completion, or saved-candidate behavior.
- [x] Existing Daily Five can select eligible grammar work without creating a
  second queue, fixed grammar mix, duplicate target, or vocabulary starvation.
- [x] Existing Today remains a single calm daily entry surface with no grammar
  tab, panel, separate Grammar Minute session, or learner-facing family mode.
- [x] One first scored action creates at most one canonical learning result;
  duplicate or stale submissions cannot mutate the record twice.
- [x] Retry, Reveal, Skip, local scheduling, delayed evidence, and
  recent-exercise protection retain their existing semantics.
- [x] Every visible action is keyboard-operable with visible focus and clear
  accessible naming; feedback remains announced and narrow-popup contained.
- [x] Practice adds no provider request and stores no raw answers, page text,
  response timing, or full attempt history.
- [x] Run focused popup, background, Daily Five, privacy, and preservation
  checks.

**T03 evidence (2026-07-30):** The existing Lessons, Today, Daily Five, and
learning-record contracts remain unchanged. New regression coverage proves
mixed Daily Five keeps two eligible grammar tasks distinct while reserving
three vocabulary positions; duplicate and stale grammar submissions produce
one evidence revision; and Daily Five Reveal remains unscored and idempotent.
The typed background boundary repeats the duplicate-result check, while popup
coverage verifies keyboard-operable grammar choices and announced result
feedback. Focused verification passed: 6 files, 155 tests, covering grammar
learning, Daily Five selection, learning-record persistence, background
routing, popup behavior, and webpage privacy boundaries. No runtime code or
schema change was required for T03.

## T04 — Release qualification and human review

**GitHub:** [#105](https://github.com/mgurramaiproject/dutchmate/issues/105)

**Blocked by:** [T03 / #104](https://github.com/mgurramaiproject/dutchmate/issues/104).

**What to build:** Qualify the complete four-pattern pack for implementation
handoff and independent human validation without claiming language proficiency.

- [x] Run the relevant full test suite.
- [x] Run typecheck.
- [x] Run Chrome and Firefox builds or package/release checks required by the
  current repository workflow.
- [x] Run documentation consistency checks and `git diff --check`.
- [ ] Manually verify keyboard-only Lessons and Daily Five flows, visible focus,
  feedback announcement, narrow-popup containment, offline practice, and no
  unexpected provider request.
- [ ] Have changed public content checked by a second fluent Dutch reviewer
  with grammar-teaching competence; record reviewer and date.
- [x] Verify all four pattern IDs and existing lesson/progress/storage contracts
  remain compatible with export/import and release artifacts.
- [x] Record known limitations without converting controlled evidence into a
  formal CEFR or independent-production claim.
- [ ] Reconcile the checked-in checklist with the published GitHub issues and
  Delivery state once the tracker work is approved and available.

**T04 automated evidence (2026-07-30):** `npm run verify` passed with 100 test
files and 643 tests, typecheck, and Chrome/Firefox builds. The release gate
`npm run verify:release` then produced and verified
`release/dutchmate-chrome-0.4.1.zip` and
`release/dutchmate-firefox-0.4.1.zip`, including required extension files,
browser-specific manifests, popup roles, fixed 390x600 layout, scroll and
focus styles, and reduced-motion styles. Existing content, grammar-learning,
learning-record, backup, popup, background, and release-doc consistency tests
cover all four canonical pattern IDs and the preserved lesson/progress/storage
contracts. `git diff --check` passed.

**T04 remaining gates:** No interactive Chrome/Firefox browser pass was
performed in this session, and no independent second fluent-Dutch reviewer was
available; those remain explicit human gates. The pack demonstrates bounded,
controlled practice evidence only and makes no formal CEFR or
independent-production claim. GitHub issue and Delivery reconciliation also
remain pending because the GitHub API was unavailable from this environment.

## Explicitly deferred work

The following do not receive tickets in this tree:

- new A1/A2 patterns or a broader grammar curriculum;
- learner-facing Verb Gym, Sentence Forge, or Grammar Minute modes;
- a grammar tab, second scheduler, grammar due date, or mastery percentage;
- typed or free-form Dutch production;
- arbitrary-page grammar parsing or runtime AI;
- fixed content quotas, lesson-completion claims, or formal CEFR claims;
- a new content store or grammar-specific progress record.

## Implementation handoff

The next concrete action after approval is to implement T01 in a fresh session
using the repository's implementation workflow, with `$tdd` for the smallest
behavioral check and `$code-review` before committing. If T01 finds no gap,
close it with evidence and move directly to the next approved frontier rather
than manufacturing work.
