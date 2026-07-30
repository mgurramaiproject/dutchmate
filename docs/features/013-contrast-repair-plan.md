# Plan 013: Contrast Repair

**Code name:** `contrast-repair`

**Feature code:** `013-contrast-repair`

**Branch:** `feature-013-contrast-repair`

**Status:** Grilled plan; implementation and qualification complete; merged in PR [#112](https://github.com/mgurramaiproject/dutchmate/pull/112)

**Queue source:** [historical Contrast Packs plan](./todos/03-contrast-packs/plan.md)

**Specification:** [013-contrast-repair-spec.md](./013-contrast-repair-spec.md)
published as [GitHub issue #107](https://github.com/mgurramaiproject/dutchmate/issues/107)
with `ready-for-agent`.

**Tickets:** [013-contrast-repair-tickets.md](./013-contrast-repair-tickets.md)
published as GitHub issues [#108](https://github.com/mgurramaiproject/dutchmate/issues/108)
through [#111](https://github.com/mgurramaiproject/dutchmate/issues/111), each
with `ready-for-agent`.

## Handoff status

- Priority: next candidate after the completed Feature 012 grammar-pack slice.
- Primary surfaces: existing `Lessons`, `Today`, and mixed `Daily Five`.
- Runtime AI: prohibited.
- Content: authored, versioned, and independently linguistically reviewed.
- Interaction: click-, tap-, or keyboard-only; no typed answers.
- Pilot: one time-first main-clause inversion contrast.
- `to-spec` and `to-tickets`: approved and published. T01–T04 are implemented,
  qualified, merged, and reconciled.

## Product goal

Help a beginner repair one frequent, high-impact Dutch mistake through a
tightly scoped comparison, a concise explanation, and a delayed reviewed
repair task.

Contrast Repair is not a general grammar coach. It may operate only on
authored exercises, authored distractors, controlled learner actions,
explicit misconception codes, and approved examples and explanations. It
must not diagnose arbitrary webpage sentences or free writing.

The learner should reach the exact contrast that caused the controlled error,
make a meaningful decision, and leave with an honest next practice
opportunity. The feature succeeds by improving useful recognition and
controlled application, not by claiming uncued production or formal CEFR
mastery.

## Pilot contrast

The first pack is `contrast.main_clause_inversion`:

- `Ik werk morgen thuis.` — subject first.
- `Morgen werk ik thuis.` — a time phrase comes first and the finite verb
  remains second.
- `Morgen ik werk thuis.` — an intentionally incorrect learner form.

The controlled misconception code is `MAIN_CLAUSE_NO_INVERSION`. It is valid
only when an authored task explicitly requires the time phrase first, the
available chunks are controlled, and the learner selects the mapped incorrect
order. It is not a general parser result and may not be emitted from an
arbitrary user sentence.

The existing shipped yes/no inversion pattern remains separate. Its current
`a0-yes-no-inversion` identity and evidence are not silently relabelled as
this new contrast.

## Learner entry and trigger policy

Contrast Repair stays inside the existing learning loop:

1. A learner answers a controlled exercise incorrectly.
2. The evaluator records a supported misconception only for an unambiguous
   authored distractor.
3. DutchMate gives the normal immediate correction.
4. After one clear error, it may offer “Practise this contrast (1 min)” but
   does not start the pack without the learner choosing it.
5. After the same code occurs twice within six relevant controlled attempts,
   the pack may be scheduled as a repair insert, subject to a three-day
   cooldown.
6. A successful delayed repair softens or clears the trigger so one code does
   not dominate the learner's practice.

The learner may also open an approved pack from an existing lesson item. The
pack starts at its exact contrast; there is no grammar menu, new library, or
new top-level destination. Daily Five may carry one repair task through its
existing mixed selection rules, without creating a second scheduler or
copying pack content into learner state.

The exact bounded representation of trigger evidence must reuse the current
local privacy and learning-record boundary. It may not become a raw event
log, response-timing history, page-text store, or full attempt history.

## Pack learning sequence

Each pilot pack is a short, finite sequence:

1. **Notice** — see two short contrasting examples.
2. **Understand** — read one concise explanation and one meaning note.
3. **Choose** — select the form matching a supplied meaning or context.
4. **Repair** — correct an intentionally wrong controlled sentence.
5. **Produce** — complete or rebuild a reviewed fresh example using controls.
6. **Revisit** — receive a different approved repair item later through Daily
   Five when eligible.

“Fresh” means a different approved item from the same pack, not runtime-
generated language. The pilot may use fewer stages if the existing surface
cannot support the complete sequence without adding a new mode; it may not
pretend that explanation or lesson completion is repair evidence.

## Content and domain contract

- A contrast pack is a reviewed, versioned release artifact tied to one narrow
  contrast and one or more stable misconception codes.
- Every positive example, intentionally incorrect example, accepted answer,
  alternative answer, distractor, explanation, feedback message, and repair
  item is authored and reviewable before release.
- Intentionally incorrect Dutch is explicitly marked and excluded from
  positive example pools, speech, and generic sentence pools.
- A distractor without a clean supported diagnosis receives item-specific
  feedback only; it does not receive a generic grammar code.
- Explanations state their scope and do not claim to cover questions,
  subordinate clauses, or every fronted element when the pilot does not.
- English or Telugu contrast notes are optional and appear only when reviewed;
  Dutch remains the learning language.
- Draft or unreviewed content cannot enter the runtime bundle.
- AI may assist offline with candidate authoring, but the runtime is fully
  deterministic and release approval remains human.

## Reuse seams and compatibility boundaries

The future specification should test the highest existing seams possible:

- the reviewed grammar-content validator and report used by Feature 012;
- the canonical grammar-result and bounded learning-record path, including
  `evidenceRevision` and misconception counts;
- the existing Daily Five candidate-selection and vocabulary-protection
  rules;
- the existing Lessons/Daily Five exercise renderer, keyboard behavior,
  feedback announcement, and narrow-popup containment;
- the typed background boundary that already rejects malformed grammar
  messages.

The feature must preserve existing pattern IDs and content versions, lesson
identity and completion, local export/import compatibility, ordinary review,
the single Today action, mixed Daily Five semantics, offline deterministic
practice, and the no-raw-answer privacy boundary. A new learner-facing
destination, independent queue, second scheduler, arbitrary parser, free-form
grading model, or runtime provider request is outside this plan.

## Delivery phases

### Phase 0 — Compatibility and content audit

- Map the current grammar content, misconception fields, result path, Daily
  Five selection, lesson route, popup renderer, and tests.
- Confirm the pilot can be represented without relabelling the existing
  yes/no inversion pattern.
- Produce a concrete gap list and baseline checks before changing runtime
  behavior.

### Phase 1 — Author and qualify the pilot pack

- Add the smallest reviewed pilot content model or extension of the existing
  grammar content contract.
- Enumerate the pilot's accepted answers, distractors, codes, feedback,
  examples, fresh repair items, review metadata, and provenance.
- Prove draft, malformed, ambiguous, and intentionally incorrect content is
  rejected from the runtime bundle.

### Phase 2 — Connect one repair path end to end

- Record only supported controlled misconception evidence.
- Offer the learner an explicit immediate repair choice after a clear error.
- Route one approved pack through existing Lessons or Daily Five controls and
  the canonical result seam.
- Apply the bounded trigger, cooldown, delayed-repair, duplicate, and stale-
  submission rules without introducing a second progress system.

### Phase 3 — Qualify learner value and release safety

- Verify the pilot remains small, understandable, keyboard-operable,
  narrow-popup safe, provider-free, and vocabulary-protecting.
- Run focused content, learning-record, Daily Five, background, popup, and
  privacy checks, followed by the repository's full verification ladder,
  browser builds/package checks, documentation checks, and `git diff --check`.
- Record independent fluent-Dutch review and owner-confirmed browser evidence
  before implementation handoff is considered complete.

## Explicitly out of scope

- the other proposed packs (`niet`/`geen`, subordinate clauses, separable
  verbs, or `hebben`/`zijn` perfect auxiliary choice);
- changing or expanding the four Feature 012 pattern identities;
- arbitrary webpage diagnosis, free writing, typed cloze, speech grading, or
  runtime AI;
- a grammar tab, Contrast Packs destination, second scheduler, fixed grammar
  quota, or standalone session;
- sentence-specific mastery, grammar percentages, formal CEFR claims, or
  lesson-completion claims;
- automatic saving, browsing telemetry, raw answers, response timing, or full
  attempt history;
- copying pack explanations or sentences into learner state;
- provider requests during practice or runtime-generated content.

## Stop-and-ask conditions

Return to the user before implementation if the design requires a new
destination, a new queue or due state, a new grading model, arbitrary parsing,
runtime generation, a migration that threatens existing export/import, a
change to Daily Five vocabulary protection, or independent linguistic review
cannot establish that the pilot is safe to release.

## Next approval gate

The specification and ticket breakdown are now published as GitHub issue #107
and child issues #108–#111. The next action is to approve implementation of
the frontier ticket T01 / #108 in a fresh session. Implementation remains
unauthorized until that approval is explicit.
