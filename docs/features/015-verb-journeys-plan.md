# Plan 015: Verb Journeys

**Code name:** `verb-journeys`

**Feature code:** `015-verb-journeys`

**Branch:** `015-verb-journeys`

**Status:** Grilled plan; specification and tickets are not yet approved or created.

**Source handoff:** [Verb Journeys Codex CLI handoff](./todos/verb-journeys-codex-handoff/README.md)

**Architecture decision:** [ADR 0008](../adr/0008-015-verb-journeys-use-an-additive-pack-and-skill-record.md)

## Product goal

Help a DutchMate learner understand and use one high-utility verb through
short, staged, first-person journeys. The learner sees a useful context,
notices the target form, places it in one complete Dutch Verb Map, makes
controlled choices, receives precise remediation, and later reviews weak
skills from the existing Today/Daily Five loop.

The first releasable slice proves this with `werken`, without redesigning
DutchMate or introducing a second learning product.

## Resolved decisions

- The feature code is `015-verb-journeys`; the codename is `verb-journeys`;
  the dedicated branch is `015-verb-journeys`, created from clean `main`.
- Existing `Lesson` records remain unchanged. An additive `VerbJourneyPack`
  is exposed through the existing Lessons library/category pattern; no new
  top-level popup tab is added.
- Verb Journey progress is stored as an additive `verbJourneys` section in
  the existing local learning record and backup/migration boundary. It is
  keyed by verb, form or skill, and exercise family. Existing lesson
  completion and per-pattern GrammarRecord evidence remain separate.
- Existing lesson-specific Continue behavior remains in the first slice.
  Today review is added through the existing Today/Daily Five path, but
  cross-activity universal Continue is deferred until a shared resume
  descriptor can be introduced safely.
- Due or weak Verb Journey skills enter the existing Daily Five grammar-task
  pool, preserving its due-first behavior, vocabulary protection, and grammar
  cap. No second queue, scheduler, or learner-facing progress system is
  introduced.
- The five required pedagogical exercise families use the smallest useful
  controls: single choice, tap-to-slots construction, token ordering/repair,
  and Verb Map placement. Existing choice and token patterns are reused;
  match-pairs is not added unless the `werken` content proves it necessary.
- The `werken` pack is exposed only when its authored content passes the
  repository's existing availability validation. No user-facing setting or
  new permission is needed.
- The first slice contains all eight Dutch forms and all twelve English
  comparison patterns, but only OTT, VTT, and OVT are core journeys. Advanced
  forms remain visible reference content and are not beginner mastery gates.
- Required production practice is first-person focused. Stories may contain
  other persons when natural, but the feature does not imply mastery of the
  full conjugation paradigm.
- Story and help content follows the existing Dutch-English-Telugu support
  contract. Dense Verb Map and English-comparison content stays Dutch-English
  unless the existing UI contract requires more.
- Saved-to-verb links are deferred when the existing data cannot reliably
  resolve a saved conjugated form to a lemma. No speculative NLP or external
  service is added to the first slice.
- Verb skill status requires success in at least two relevant exercise
  families, including a later delayed or recombined attempt. A later scored
  error may move the skill to `needs-practice`; journey completion and skill
  evidence remain separate.
- Runtime correctness is deterministic and provider-free. There are no typed
  answers, runtime LLM calls, network-dependent grading, arbitrary parsing,
  or broad UI restyles.

## Proposed verification seams

The specification should use these highest existing seams:

1. The authored Verb Journey pack validator and availability report, proving
   complete eight-form/twelve-pattern coverage, reference integrity, bounded
   exercises, and review metadata.
2. Pure journey/evaluator logic, proving deterministic answers, targeted
   repair selection, question caps, and skill-status derivation.
3. The existing `LearningRecordStore` and typed background boundary, proving
   additive persistence, idempotent migration, Daily Five eligibility,
   stale-submission protection, export/import compatibility, and preservation
   of existing records.
4. Existing popup/Lessons integration, proving navigation, keyboard behavior,
   feedback announcements, narrow-layout containment, Verb Map/comparison
   access, and Today entry.

Existing Daily Five, lesson, heatmap, Saved, Options, build, and packaging
checks should be extended or reused for regression coverage rather than
duplicating their internal implementation tests.

## Delivery shape to refine after approval

1. Baseline the current Lessons, grammar, Daily Five, persistence, popup,
   accessibility, and build behavior.
2. Add and validate the additive `werken` content contract.
3. Implement pure deterministic journey evaluation, repair selection, and
   skill-status logic.
4. Add upgrade-safe verb progress persistence and Daily Five selection.
5. Integrate the `werken` entry, overview, journeys, Verb Map, comparison,
   completion, and Today path using existing UI primitives.
6. Run content review, accessibility and narrow-popup QA, regression checks,
   typecheck, tests, browser builds, packaging, and documentation checks.

Each phase must remain independently verifiable and commit-sized. No broad
refactor or expansion to additional verbs begins until the complete `werken`
slice is accepted.

## Approval gates

1. Approve the proposed seams and authorize `to-spec`; only then create the
   Feature 015 specification under `docs/features/` and publish its GitHub
   parent issue.
2. Review and approve the resulting specification and its tracker issue.
3. Authorize `to-tickets`; only then create the Feature 015 ticket document
   under `docs/features/` and publish the approved vertical ticket graph.
4. Review and approve ticket granularity and blocking edges before any
   implementation begins.

Until those approvals occur, this branch contains planning/domain records
   only and no implementation work.
