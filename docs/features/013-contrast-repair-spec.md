# Feature 013: Contrast Repair

**Code name:** `contrast-repair`

**Feature code:** `013-contrast-repair`

**Branch:** `feature-013-contrast-repair`

**Status:** Published as [GitHub issue #107](https://github.com/mgurramaiproject/dutchmate/issues/107) with `ready-for-agent`; implementation requires separate approval

**Source plan:** [013-contrast-repair-plan.md](./013-contrast-repair-plan.md)

## Problem Statement

DutchMate currently gives precise feedback when a learner selects a known
wrong answer in a controlled grammar exercise, but that correction can remain
a one-off event. A learner who repeatedly places the subject before the finite
verb after putting a time phrase first needs a short comparison and a fresh
chance to repair the same contrast later.

The learner needs help with one practical distinction at a time. They should
not have to find a grammar library, interpret a generic grammar diagnosis, or
complete a typed exercise. DutchMate also cannot safely infer this error from
an arbitrary webpage sentence or free writing.

## Solution

Add one reviewed Contrast Pack for the narrow time-first main-clause inversion
contrast. The pack teaches:

- `Ik werk morgen thuis.` — subject first;
- `Morgen werk ik thuis.` — time phrase first, finite verb second;
- `Morgen ik werk thuis.` — an intentionally incorrect learner form.

The controlled code `MAIN_CLAUSE_NO_INVERSION` is emitted only when an
authored exercise explicitly controls the chunks and maps the learner's
incorrect order to that code. The pilot is separate from the existing
yes/no-inversion pattern and does not relabel or expand that pattern's
identity.

After a clear controlled error, DutchMate gives normal immediate feedback and
may offer the learner an explicit one-minute contrast repair. After the same
code occurs twice within six relevant controlled attempts, it may offer a
different reviewed repair item through the existing mixed Daily Five flow,
subject to a three-day cooldown. A successful delayed repair clears the
trigger for that code.

The learner can also enter the approved pack from its existing lesson
companion route. The pilot companion is attached to the A1 appointment lesson,
where time-first scheduling examples are useful and natural. The pack starts
at the exact contrast and uses the existing Lessons and Daily Five interaction
patterns. It adds no grammar tab, new destination, second scheduler, runtime
provider request, or typed answer surface.

## User Stories

1. As a beginner learning Dutch, I want to see the subject-first and time-first forms together, so that I can notice what changes when a time phrase starts the sentence.
2. As a beginner learning Dutch, I want one short explanation of the pilot contrast, so that I can use a practical rule without learning unnecessary terminology.
3. As a learner who selects a known incorrect word order, I want immediate feedback that names the finite verb position, so that I understand why my choice was rejected.
4. As a learner who makes the same controlled word-order mistake again, I want DutchMate to recognise the supported misconception, so that I can practise the exact contrast rather than receive generic grammar feedback.
5. As a learner who makes one clear controlled mistake, I want an optional repair offer, so that DutchMate can help without interrupting or forcing a lesson.
6. As a learner who declines an immediate repair offer, I want to continue the current flow normally, so that one mistake does not block my lesson or review.
7. As a learner who opens the approved lesson companion, I want to start directly at the time-first contrast, so that I do not have to search through a grammar catalogue.
8. As a learner, I want the pack to show a learner-friendly title and a practical “when do I use each?” comparison, so that the exercise connects to meaning rather than labels alone.
9. As a learner, I want to choose between finite reviewed options, so that I can demonstrate supported recognition without typing Dutch.
10. As a learner, I want to repair an intentionally incorrect controlled sentence, so that I can apply the rule immediately after seeing it.
11. As a learner, I want to rebuild a fresh reviewed sentence with buttons or keyboard controls, so that I can apply the contrast to a different example.
12. As a learner, I want the fresh repair item to differ from the item that triggered the pack, so that repeating the same answer does not create a false sense of learning.
13. As a learner, I want a delayed repair task to appear in Daily Five only when eligible, so that the practice fits my existing routine.
14. As a learner, I want vocabulary practice to remain protected when a repair task enters Daily Five, so that grammar does not crowd out saved-word review.
15. As a learner, I want a three-day cooldown after a repair offer, so that one repeated error does not dominate my daily practice.
16. As a learner who successfully completes a delayed repair, I want the same trigger to soften or clear, so that DutchMate responds to improvement.
17. As a learner, I want Reveal, Skip, Retry, and first-Check behavior to remain consistent with existing grammar practice, so that the new pack feels familiar.
18. As a keyboard-only learner, I want every choice, repair control, reset action, and primary action to be operable from the keyboard, so that I can complete the pack without a pointer.
19. As a learner using the narrow extension popup, I want the comparison, explanation, feedback, and controls to remain contained and readable, so that the repair does not become visually overwhelming.
20. As a learner using DutchMate offline after content is bundled, I want the pack to work without a provider request, so that deterministic practice remains available.
21. As a learner, I want Dutch to remain the learning language while optional English or Telugu notes clarify meaning, so that helper languages support rather than replace Dutch practice.
22. As a learner, I want deliberately incorrect Dutch to be visibly and internally marked as incorrect, so that I never mistake a teaching distractor for a valid example.
23. As a learner, I want DutchMate to stay silent when an error is not unambiguous in a controlled exercise, so that it does not make an overconfident grammar diagnosis.
24. As a learner, I want my repair state to remain local and bounded, so that DutchMate does not store raw answers, page text, response timing, or a full attempt history.
25. As a learner, I want existing lesson completion and grammar progress to remain intact, so that adding the pack does not erase or retroactively rewrite what I have already done.
26. As a learner, I want export and import to preserve compatible repair state without requiring a new account, so that my local learning record remains portable.
27. As a content reviewer, I want every example, accepted answer, distractor, explanation, and repair item enumerated, so that I can review exactly what learners will see.
28. As a content reviewer, I want each misconception code to have a precise scope and allowlisted source, so that the code cannot silently become a generic grammar error.
29. As a content reviewer, I want draft, malformed, ambiguous, and unreviewed content rejected before bundling, so that unsafe content cannot reach learners.
30. As a product owner, I want the pilot to reuse existing Lessons, Daily Five, storage, and feedback contracts, so that the feature adds learner value without creating parallel product systems.
31. As a maintainer, I want the existing four grammar pattern IDs and content versions preserved, so that current records, lessons, and backups remain compatible.
32. As a maintainer, I want duplicate or stale submissions to have no additional effect, so that one learner action cannot create multiple evidence changes.
33. As a maintainer, I want the immediate offer and delayed task to reference pack content rather than copy sentences into learner state, so that content updates remain versioned and storage stays small.
34. As a fluent Dutch reviewer, I want the rule explanation to state its limits, so that the pilot does not imply that it covers questions, subordinate clauses, or every fronted element.
35. As a delivery reviewer, I want automated, build, accessibility, privacy, and independent linguistic checks recorded, so that the pilot is ready for a trustworthy implementation handoff.

## Implementation Decisions

- The feature adds one `ContrastPack` content family alongside the existing
  reviewed grammar content. The pilot identity is
  `contrast.main_clause_inversion`, content version `1.0.0`, level A1, and
  code `MAIN_CLAUSE_NO_INVERSION`.
- The pack contains the positive comparison, the intentionally incorrect
  example, a concise explanation, one meaning note, a finite set of
  click-only exercises, a different fresh repair item, and review metadata.
  Every learner-visible string is authored, versioned, and independently
  reviewable.
- The pilot's controlled source exercise is a sentence-order task in the A1
  appointment lesson companion. It uses finite chunks and explicitly maps
  only the subject-before-finite-verb error after a first-position time phrase
  to `MAIN_CLAUSE_NO_INVERSION`.
- The existing `a0-yes-no-inversion` pattern remains unchanged. Its pattern
  ID, content version, exercises, evidence, lesson identity, and progress
  semantics are not reused as a shortcut for the new main-clause contrast.
- Misconception codes form one reviewed registry. Each code has a stable
  identifier, narrow scope, learner-facing description, allowlisted source,
  associated pack, and a policy for deprecation or remapping. There is no
  generic “grammar wrong” code.
- A distractor that is not an unambiguous supported diagnosis may still have
  item-specific corrective feedback, but it does not contribute to a
  misconception trigger.
- The evaluator records only the bounded result of a supported controlled
  action. It does not parse arbitrary text, inspect webpage sentences for
  grammar, store raw answers, or record a general learner behavior timeline.
- The existing local learning record gains bounded per-code repair state. The
  state stores only the information needed to apply the six-attempt trigger,
  three-day cooldown, delayed-repair clearing, duplicate protection, and
  recent repair-item diversity. Missing state in an older backup defaults to
  empty; values are clamped during parsing and merge.
- Contrast repair state is not a mastery dimension, grammar percentage,
  sentence-specific due date, or separate progress record. The in-session
  notice, understand, choose, repair, and produce sequence is transient except
  for the bounded trigger and selection markers.
- Daily Five reuses its existing snapshot, due-first behavior, vocabulary
  protection, completion accounting, and continuation behavior. It gains a
  typed contrast repair task reference containing the pack identity,
  content version, and exercise identity; it stores no copied explanation or
  sentence text. At most one contrast repair task may occupy the grammar
  portion of a Daily Five snapshot.
- Contrast repair shares the existing grammar result boundary. A first scored
  action updates the canonical result once and may return immediate feedback
  plus an optional repair offer. Duplicate or stale evidence revisions do not
  create another trigger or result.
- The immediate offer is explicit and dismissible. Choosing it opens the
  approved pack; declining it leaves the learner in the current flow.
- The delayed task is selected only after two matching codes within six
  relevant controlled attempts, outside the cooldown, and with a different
  reviewed exercise available. A successful delayed repair clears that code's
  pending trigger. Reveal and Skip do not count as successful repair evidence.
- The lesson companion uses the existing focused practice flow, locked
  orientation, explicit Exit action, and stage semantics. It does not add a
  top-level tab or a new grammar family selector.
- The existing typed background message boundary validates all new pack and
  repair-task identifiers, content versions, outcome variants, and revision
  fields before they reach the learning record.
- Content validation expands every pilot exercise and checks stable IDs,
  review state, provenance, scope, positive/incorrect partitioning, accepted
  alternatives, distractor mappings, feedback, fresh-item references, and
  absence of runtime-generated content.
- Practice makes no provider request. All examples, explanations, options,
  feedback, and repair items are bundled and deterministic.
- The implementation preserves current lesson completion, grammar pattern
  records, local export/import, ordinary review, Today navigation, mixed Daily
  Five composition, keyboard behavior, focus behavior, and narrow-popup
  containment.

## Testing Decisions

- Tests verify externally observable behavior at the approved existing seams;
  they do not assert private helper structure, DOM implementation details, or
  storage serialization incidental to the public contract.
- The content validator/report is tested with valid pilot content plus draft,
  missing-review, ambiguous-answer, unclassified-distractor, incorrectly
  pooled, invalid-code, and duplicate-ID fixtures. The report must expose the
  exact learner-visible material needed for human review.
- The learning-record seam is tested for one supported misconception, a
  non-diagnostic wrong answer, the two-within-six threshold, attempts outside
  the relevant window, the three-day cooldown, voluntary entry, successful
  delayed clearing, unavailable fresh items, bounded counters, backup
  migration, import merge, and clamped malformed state.
- The canonical result seam is tested for first-Check-only mutation, retry
  behavior, Reveal and Skip non-success, duplicate submission, stale revision,
  invalid pack/exercise references, and no raw answer or page-context storage.
- Daily Five is tested for a due eligible contrast task, one-task maximum,
  vocabulary protection, due-first selection, duplicate target protection,
  completion accounting, continuation after completion, and stable snapshot
  references without copied pack content.
- The background boundary is tested to reject malformed or unknown pack IDs,
  codes, content versions, exercise IDs, outcomes, and revision values while
  accepting valid requests.
- The popup seam is tested through learner-visible interaction for the lesson
  companion, immediate offer, dismiss path, pack sequence, fresh repair,
  feedback announcement, retry, Reveal, Skip, Exit, keyboard operation,
  visible focus, and narrow-popup containment.
- Persistence tests verify older records and backups load unchanged, missing
  repair state defaults safely, and export/import retains only the bounded
  approved state.
- Provider-isolation tests verify that opening, practising, completing, and
  revisiting the pack performs no translation or other network request.
- Existing grammar content, grammar-learning, learning-record, Daily Five,
  background message, popup, backup, release, and privacy tests are the prior
  art. New tests should extend those suites at their public seams rather than
  introduce a parallel fixture or harness.
- Release qualification includes the repository's full test suite,
  typecheck, Chrome and Firefox builds/package checks, documentation checks,
  `git diff --check`, keyboard/manual popup evidence, offline evidence, and
  independent fluent-Dutch review of the public pilot content.

## Out of Scope

- `niet` versus `geen`, subordinate-clause verb position, separable verbs, and
  perfect auxiliary choice;
- changing or expanding the four existing grammar pattern identities;
- arbitrary webpage grammar diagnosis, free writing, typed cloze, speech
  grading, or runtime AI;
- a grammar tab, Contrast Packs destination, second scheduler, fixed grammar
  quota, or standalone repair session;
- sentence-specific mastery, grammar percentages, formal CEFR claims, or
  lesson-completion claims;
- automatic saving, browsing telemetry, raw answers, response timing, full
  attempt history, or copied pack content in learner state;
- provider requests during practice or runtime-generated examples,
  explanations, translations, distractors, or repair items;
- a broader grammar taxonomy, unrestricted code registry, or migration that
  rewrites existing pattern records;
- a learner study or product-wide effectiveness claim as part of the pilot's
  implementation acceptance. The pilot may define later learning-validation
  work, but release qualification must not overstate evidence.

## Further Notes

- The plan's proposed trigger policy is made concrete here: one clear error
  may produce an immediate optional offer; two matching codes in six relevant
  attempts may produce a delayed task; cooldown is three local days; delayed
  success clears the pending trigger.
- “Fresh” means a different approved item in the same content version, not a
  runtime-generated sentence. If no safe fresh item exists, DutchMate should
  retain immediate feedback and omit the delayed offer.
- The pilot is intentionally narrower than a general word-order lesson. Its
  feedback must say what it covers and avoid implying that the same rule
  diagnoses questions, subordinate clauses, or every fronted phrase.
- Implementation remains subject to the repository's one-frontier-ticket
  workflow. The next execution artifact is a separately approved ticket
  breakdown; this specification does not authorize implementation by itself.
