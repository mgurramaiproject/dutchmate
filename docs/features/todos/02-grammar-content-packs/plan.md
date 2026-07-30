# Plan: Grammar content packs on the Verb Path

## Handoff status

- Priority: 2, after Plan 00 and Web Sentence Trainer
- Status: superseded by completed Feature 012; retained as historical queue input
- Canonical implementation record: [Feature 012 plan](../../012-grammar-packs-plan.md), [specification](../../012-grammar-packs-spec.md), and [tickets](../../012-grammar-packs-tickets.md)
- Primary surfaces: existing `Lessons`, `Today`, and `Daily Five`
- Runtime AI: prohibited
- Interaction: click-only; no typing or free-form grading
- Initial content: the four shipped A0 grammar patterns
- Internal families: Verb Gym, Sentence Forge, and Grammar Minute

This is one delivery plan. “Verb Gym,” “Sentence Forge,” and “Grammar Minute” are names for content or presentation families inside the existing Verb Path; they are not separate learner destinations, queues, mastery systems, or tabs.

## Product goal

Give A0 learners short, friendly, deterministic practice that helps them recognize and apply the next Dutch pattern without making them choose a grammar topic or understand a curriculum taxonomy.

The plan succeeds only when the learner spends time making a meaningful controlled decision, receives honest feedback, and returns to the existing learning loop without losing vocabulary or context practice.

## Initial scope

Reuse and strengthen the four shipped pattern IDs:

- `a0-zijn-present`;
- `a0-hebben-present`;
- `a0-regular-present`;
- `a0-yes-no-inversion`.

Use their existing finite deterministic exercise content, learning stages, bounded evidence, `evidenceRevision`, recent-exercise protection, and Daily Five grammar cap. Do not define a new verb taxonomy or promise a fixed verb/exercise count.

Further A0-A2 expansion is a later authored curriculum decision. A1/A2 content must not enter this slice merely because the schema can represent it.

## Explicit non-goals

- a learner-facing Verb Gym, Sentence Forge, or Grammar Minute destination;
- a grammar tab, `Stories | Grammar` switch, or new grammar library;
- a second scheduler, grammar-specific due date, or mastery percentage;
- a generic Dutch parser, arbitrary-page diagnosis, or free writing correction;
- typed answers, typed cloze, or normalized free-form grading;
- runtime-generated sentences, distractors, explanations, or translations;
- fixed content quotas or lesson-completion claims;
- replacing existing Today, Lessons, Saved, heatmaps, settings, or review actions.

## Family boundaries

### Verb Gym: pattern practice family

Use the name internally for grouped authoring and test fixtures around a reviewed verb pattern. The learner sees the existing lesson goal and exercise, not a new gym mode. Content must be tied to an existing pattern ID and the current deterministic exercise primitive.

### Sentence Forge: controlled production family

Use the name internally for approved sentence-frame and token-selection exercises. The learner selects from controlled options or reconstructs an approved sentence. Every accepted output must be authored or enumerated deterministically; the UI must not ask the learner to type Dutch.

If a frame has multiple valid Dutch answers, either author the accepted alternatives explicitly or change the prompt so the controlled task has one defensible target. Do not mark a valid alternative wrong because it differs from the preferred example.

### Grammar Minute: packaging family

Grammar Minute is a compact presentation wrapper inside existing Today/Daily Five behavior, only after at least two reliable approved content sources exist. It must resolve existing exercise references rather than copy sentences or create a new content store.

If the current Daily Five already supplies a mixed bounded queue, Grammar Minute may be one selected item or a label/deep link into that item. It must not impose a fixed feature mix, crowd out vocabulary/context review, or double-count activity and learning evidence.

## Content and review contract

- Production content is human-reviewed and versioned with the extension.
- Draft content never enters runtime bundles.
- The initial slice uses existing content and contracts; no new schema is justified only by the internal family names.
- English/Telugu helpers may be displayed when already present, but Dutch remains the learning language.
- Every explanation states its scope and does not claim to cover all Dutch word order or tense meaning.
- Deliberately incorrect Dutch is marked as such and excluded from positive example pools.
- AI may assist offline with draft authoring only; approval remains human and explicit.

## Learner flow

1. Existing Lessons or Daily Five selects an eligible exercise.
2. The learner sees one concise goal and one click-only task.
3. Feedback names the controlled rule or target without overstating proficiency.
4. The canonical existing learning result updates the underlying grammar evidence once.
5. The next task follows existing due/evidence behavior; no family-specific progress screen appears.

## Implementation phases

### Phase 0 — compatibility and content audit

- Map the four pattern IDs, exercise renderer, learning evidence, Daily Five grammar cap, and lesson route.
- Identify duplicate or obsolete plan assumptions.
- Confirm no new storage, queue, tab, or evaluator is required.
- Produce a short content gap list; do not invent missing curriculum during the audit.

### Phase 1 — harden the shipped A0 slice

- Add or adjust only the smallest deterministic exercises needed for the four existing patterns.
- Verify keyboard/click accessibility, exact feedback, evidence updates, and recent-exercise protection.
- Preserve current content versions and migration behavior.

### Phase 2 — controlled frame additions, only if approved

- Add one reviewed frame at a time to an existing pattern.
- Validate every output and accepted alternative before approval.
- Keep content inside Lessons/Daily Five and the current grammar cap.

### Phase 3 — Grammar Minute packaging, only after evidence

- Determine whether the current Today/Daily Five UI needs a label or deep link at all.
- Select an existing approved exercise deterministically.
- Reuse the source exercise result and avoid a wrapper session unless the current architecture proves one is necessary.

## Learner-value gates

- Learners can start without choosing among grammar products.
- Each task has a clear goal and takes a useful action, not merely a completion click.
- Feedback is concise, accurate, and scoped.
- Existing Daily Five remains balanced and vocabulary/context practice is not displaced.
- Delayed evidence supports the pattern progression without pseudo-precision.
- No increase in network requests, raw learner-data storage, or navigation complexity.

## Tests and acceptance

- Existing four pattern IDs and content versions remain resolvable.
- Deterministic exercise fixtures cover correct, incorrect, ambiguous, and keyboard paths.
- No typing control or free-form answer path is introduced.
- One learner action updates one canonical learning result.
- Daily Five does not duplicate a grammar target or impose a fixed new mix.
- Draft/unapproved content cannot ship.
- Existing Today, Lessons, Saved, settings, heatmaps, review actions, and offline behavior regressions pass.
- No runtime AI or practice-time translation request is introduced.

## Stop-and-ask conditions

Pause for user direction if:

- a new learner-facing destination appears necessary;
- a pattern cannot be taught with deterministic click-only controls;
- accepted alternatives require a new grading model;
- the four shipped patterns are insufficient and new curriculum content is not reviewed;
- Daily Five or existing grammar evidence must change semantics;
- Grammar Minute would require a second queue, progress system, or duplicate content.
