# Plan 012: Grammar Content Packs

**Code name:** `grammar-packs`

## Handoff status

- Priority: after the shared deterministic foundation and Web Sentence Trainer.
- Status: proposed; not implementation-approved.
- Product range: A0/Pre-A1 through A2 remains the ceiling; this slice is A0 only.
- Primary surfaces: existing `Lessons`, `Today`, and mixed `Daily Five`.
- Runtime AI: prohibited.
- Interaction: click-, tap-, or keyboard-only; no typed answers.
- Initial content: the four shipped A0 grammar pattern IDs.

## Resolved grill decisions

- Feature 012 hardens and packages the four shipped patterns only:
  `a0-zijn-present`, `a0-hebben-present`, `a0-regular-present`, and
  `a0-yes-no-inversion`.
- The feature stays inside the existing `Lessons`, `Today`, and mixed `Daily
  Five` surfaces. It does not add a grammar tab, learner-facing Verb Gym,
  Sentence Forge, or Grammar Minute destination.
- Existing grammar records, evidence revisions, due scheduling, recent-exercise
  protection, Daily Five composition, lesson identity, and progress semantics
  remain the source of truth.
- `Verb Gym` and `Sentence Forge` are internal authoring families. `Grammar
  Minute` is an internal packaging label only, and may not become a second
  queue or fixed daily mix.
- New pattern IDs, a new grammar taxonomy, A1/A2 content, runtime generation,
  free-form grading, and a second scheduler are outside this feature.

## Product goal

Give a beginner a short, useful, deterministic grammar decision inside the
learning loop DutchMate already has. The learner should recognise or apply a
reviewed Dutch pattern, understand the correction, and receive honest bounded
evidence without choosing among grammar products or navigating to a new mode.

The feature succeeds only when the learner spends time making a meaningful
controlled decision, feedback is linguistically defensible, and grammar
practice strengthens rather than displaces vocabulary and real-world transfer.

## Initial scope

Reuse and, only where the audit proves a gap, minimally strengthen the four
shipped pattern IDs:

- `a0-zijn-present`;
- `a0-hebben-present`;
- `a0-regular-present`;
- `a0-yes-no-inversion`.

The existing finite exercise model, content versions, reviewed accepted
alternatives, misconception-coded distractors, `evidenceRevision`, delayed
evidence, recent-exercise protection, and mixed Daily Five contract remain
canonical. A content edit must preserve stable pattern identity and migration
behavior.

Additional exercise instances are allowed only when they remain attached to an
existing pattern, are authored and reviewed, enumerate every accepted answer
and distractor, and improve a demonstrated coverage or ambiguity gap. They do
not imply a fixed verb count, exercise quota, or completion claim.

Further A0-A2 expansion is a later authored curriculum decision. A1/A2 content
must not enter this slice merely because the schema can represent it.

## Explicit non-goals

- a learner-facing Verb Gym, Sentence Forge, or Grammar Minute destination;
- a grammar tab, new library, level picker, or curriculum taxonomy;
- a second scheduler, grammar-specific due date, or mastery percentage;
- generic Dutch parsing or arbitrary-page diagnosis;
- typed answers, typed cloze, free writing, or normalised free-form grading;
- runtime-generated sentences, distractors, explanations, or translations;
- fixed content quotas or lesson-completion claims;
- changing lesson identities, completion records, Saved behavior, heatmaps,
  settings, or ordinary review actions;
- replacing the existing Today action or turning grammar into a separate daily
  obligation;
- storing raw answers, full attempts, response timing, page text, or behavior
  timelines.

## Domain boundaries

### Grammar content pack

A grammar content pack is a reviewed, versioned set of deterministic exercises
attached to existing pattern IDs. It is a release artifact and authoring unit,
not a learner-facing destination or progress system.

### Exercise families

`Verb Gym` groups verb-form practice for authoring and fixtures. `Sentence
Forge` groups controlled construction, transformation, and repair. Neither name
appears as a required learner destination. A released exercise uses the
existing grammar primitive contract.

### Grammar Minute

`Grammar Minute` may name a concise internal package of existing grammar work
when the current Today or Daily Five flow benefits from a label. It must resolve
existing exercise references and canonical results. It cannot impose a fixed
feature mix, crowd out vocabulary/context review, or create a wrapper session,
queue, due date, or duplicate evidence record.

## Learner flow

1. Existing Lessons or Daily Five selects an eligible exercise.
2. The learner sees one concise goal and one click-only task.
3. The learner may revise the choice before the first Check where that surface
   supports Check; retry, Reveal, and Skip retain their existing semantics.
4. Feedback names the controlled rule or target without overstating
   proficiency.
5. The canonical existing learning-result path updates the underlying grammar
   evidence at most once for the first scored result.
6. The next task follows existing due, evidence, and recent-exercise behavior.
   No family-specific progress screen appears.

## Content and review contract

- Production content is human-reviewed and versioned with the extension.
- Draft or unapproved content never enters a runtime bundle.
- Every exercise has a clear prompt, bounded context, finite choices, explicit
  accepted answers, misconception-coded distractors, scoped feedback, source
  references, provenance, author, reviewer, review state, and review date.
- If multiple Dutch answers are valid, accepted alternatives are authored
  explicitly or the prompt is changed to create one defensible target.
- Deliberately incorrect Dutch is marked as such and excluded from positive
  example pools.
- English and Telugu helpers may be shown when already present, but Dutch
  remains the learning language.
- Every explanation states its scope and does not claim to cover all Dutch word
  order, tense meaning, or proficiency.
- AI may assist offline with draft authoring only; approval remains human and
  explicit.

## Compatibility and learner-value gates

The implementation must demonstrate that:

- all four existing pattern IDs and content versions remain resolvable;
- existing lesson identities, completion records, and lesson-stage behavior are
  unchanged;
- one learner action updates one canonical learning result;
- delayed evidence, recent-exercise protection, and local scheduling retain
  their current semantics;
- Daily Five remains mixed, due-first, and vocabulary-protecting without a
  fixed grammar allocation or duplicate target;
- no new network request or raw learner-data storage is introduced;
- no learner must choose a grammar product or discover a new destination;
- every task requires a meaningful controlled decision rather than a completion
  click;
- feedback is concise, accurate, and scoped;
- keyboard and narrow-popup behavior remain usable;
- existing Today, Lessons, Saved, Settings, heatmaps, review, export/import,
  and offline behavior remain intact.

## Implementation phases

### Phase 0 — compatibility and content audit

- Map the four pattern IDs, content renderer, learning evidence, Daily Five
  grammar cap, lesson route, and existing tests.
- Compare the source plan with current runtime behavior and remove obsolete
  assumptions.
- Confirm whether any content or validation gap actually requires a code change.
- Produce a bounded gap list; do not invent curriculum during the audit.

### Phase 1 — harden the shipped A0 slice

- Make the smallest authored content or validator changes needed for the four
  patterns.
- Verify correct, incorrect, ambiguous, retry, reveal, skip, and keyboard paths.
- Preserve content versions, pattern IDs, storage shape, and migration behavior.
- Add no new schema unless the compatibility audit identifies a concrete
  existing-contract failure and the user explicitly approves the expansion.

### Phase 2 — preserve existing delivery surfaces

- Verify Lessons and Daily Five use the same canonical exercise and result
  seams.
- Verify selection avoids immediate repetition and does not duplicate a target
  already present in the current Daily Five snapshot.
- Confirm Today remains a single calm entry surface and does not grow a grammar
  panel or second primary action.

### Phase 3 — qualify the release

- Run focused grammar/content/learning/Daily Five/popup tests.
- Run typecheck, the full relevant suite, Chrome and Firefox builds or package
  checks, documentation checks, and `git diff --check`.
- Record manual keyboard, focus, narrow-popup, offline, and learner-flow
  evidence in the matching ticket checklist.
- Stop if any gate requires a new destination, scheduler, grading model, or
  unreviewed curriculum.

## Stop-and-ask conditions

Pause for explicit product direction if:

- a new learner-facing destination appears necessary;
- a pattern cannot be taught with deterministic click-only controls;
- accepted alternatives require a new grading model;
- the four shipped patterns are insufficient and new curriculum is proposed;
- grammar evidence, Daily Five semantics, or lesson identity must change;
- a new schema, queue, due state, or runtime provider request is proposed;
- independent linguistic review cannot establish that an exercise is safe to
  release.
