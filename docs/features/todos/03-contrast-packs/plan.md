# Plan: Contrast Packs

## Handoff status

- Priority: next approval candidate after the completed grammar-pack slice
- Primary surface: existing Lessons or Daily Five as a small authored repair insert; no new Contrast Packs destination
- Contextual entry: offered only after a supported misconception is observed or the learner opens an approved lesson item
- Daily delivery: repair exercises may enter `Today` / `Daily Five`
- Runtime AI: prohibited for v1
- Curated content: required
- Dependency: controlled exercises that emit reliable misconception codes; the
  completed grammar-pack slice now provides reviewed codes within its supported
  A0 patterns, but this plan still requires explicit design and implementation
  approval before work begins

## Product goal

Help learners repair a small set of frequent, high-impact Dutch mistakes through tightly scoped comparisons, clear explanations, and delayed repair practice.

Contrast Packs are not a general grammar coach. They operate only on:

- authored exercises;
- authored distractors;
- controlled learner actions;
- explicit misconception codes;
- approved examples and explanations.

DutchMate must not diagnose arbitrary webpage sentences or free writing.

## Initial pack candidates

Prioritize by learner frequency, transfer risk, deterministic diagnosability, and content cost:

1. `niet` versus `geen`;
2. main-clause inversion after a time/place element;
3. finite verb position in a subordinate clause;
4. separable verbs in main clauses;
5. perfect auxiliary `hebben` versus `zijn`.

Do not build all five simultaneously. Pilot one pack—preferably inversion if Sentence Forge already emits that code—then add one pack at a time.

## Learner-value hypothesis

When a learner repeatedly makes a known controlled error, a short contrast followed by a fresh but reviewed repair task will produce more durable correction than simply showing the right answer.

## Entry points

### A. Error-triggered repair

1. Learner answers a controlled exercise incorrectly.
2. Evaluator maps the selected distractor/action to a supported misconception.
3. DutchMate gives immediate task feedback.
4. When trigger policy is met, it offers:
   - “Practise this contrast (1 min)” now; or
   - schedules a repair item later.
5. The pack starts at the exact contrast, not a generic grammar menu.

### B. Existing Lessons content

The learner may encounter approved packs through existing Lessons content. Do not add a new grammar library or top-level category solely for packs. Each pack displays:

- learner-friendly title;
- one “When do I use each?” comparison;
- a few examples;
- estimated duration;
  - current bounded evidence, without pseudo-precise mastery percentages.

### C. Daily Five

A repair exercise references the pack and misconception code. Do not copy explanations or sentences into learner state.

## Trigger policy

Avoid overreacting to one slip.

Suggested pilot:

- emit a misconception event only for unambiguous controlled errors;
- offer immediate explanation after one error;
- schedule a Contrast Pack after the same code occurs twice within a bounded number of relevant attempts, or when the learner voluntarily opens it;
- apply cooldown so one code does not dominate;
- clear/soften the trigger after successful delayed repair.

Store raw events or bounded counters according to current privacy/data architecture. Keep the model explainable.

## Pack learning sequence

1. **Notice** — see two short contrasting examples.
2. **Understand** — read one concise explanation.
3. **Choose** — select the form matching a meaning/context.
4. **Repair** — correct an intentionally wrong controlled sentence.
5. **Produce** — complete or rebuild a reviewed fresh example.
6. **Revisit** — delayed Daily Five task.

“Fresh” means a different approved item in the pack, not runtime-generated language.

## Example pack: main-clause inversion

### Contrast

- `Ik werk morgen thuis.` — subject first.
- `Morgen werk ik thuis.` — time phrase first; finite verb remains second.
- `Morgen ik werk thuis.` — intentionally incorrect learner form.

### Diagnostic boundary

DutchMate may emit `MAIN_CLAUSE_NO_INVERSION` when:

- the task specifically requires `morgen` first;
- chunks are controlled;
- the learner places `ik` before `werk`;
- the authored misconception map assigns that order to the code.

DutchMate may not scan an arbitrary user sentence and claim the same diagnosis in v1.

## Data model

```yaml
schema_version: 1
id: contrast.main_clause_inversion
content_version: 1.0.0
status: approved
level: A1
title:
  en: Time first? Verb before subject
misconception_codes:
  - MAIN_CLAUSE_NO_INVERSION
prerequisites:
  - frame.main.subject_first
learning_goal:
  en: I can put the finite verb in second position when a time phrase comes first.
comparison:
  items:
    - id: subject_first
      label: Subject first
      sentence_nl: Ik werk morgen thuis.
      valid: true
    - id: time_first
      label: Time first
      sentence_nl: Morgen werk ik thuis.
      valid: true
    - id: learner_error
      label: Common learner error
      sentence_nl: Morgen ik werk thuis.
      valid: false
explanation_id: explanation.main_clause.inversion
exercise_ids:
  - contrast-exercise.inversion.choose
  - contrast-exercise.inversion.repair
  - contrast-exercise.inversion.rebuild
trigger:
  occurrences: 2
  relevant_attempt_window: 6
  cooldown_days: 3
review:
  author: ""
  reviewer: ""
  reviewed_at: ""
```

Intentionally incorrect Dutch must be explicitly marked and excluded from positive example search, speech, and generic sentence pools.

## Exercise and distractor model

Each wrong option should state what, if anything, it diagnoses:

```yaml
options:
  - text: Morgen werk ik thuis.
    correct: true
  - text: Morgen ik werk thuis.
    correct: false
    misconception_code: MAIN_CLAUSE_NO_INVERSION
  - text: Morgen werkt ik thuis.
    correct: false
    misconception_code: SUBJECT_VERB_FORM_MISMATCH
```

If a distractor does not cleanly represent a supported misconception, omit the code and provide only item-specific feedback.

## Shared misconception registry

Maintain one registry:

```yaml
code: MAIN_CLAUSE_NO_INVERSION
scope: controlled_main_clause_order
learner_description:
  en: Subject was placed before the finite verb after a first-position time phrase.
supported_sources:
  - sentence_forge
contrast_pack_id: contrast.main_clause_inversion
```

Requirements:

- stable codes;
- precise scope;
- source allowlist;
- associated feedback/pack;
- deprecation/remapping policy;
- no generic “grammar wrong” code.

## Feedback design

Immediate feedback:

> Because `morgen` is first, the finite verb `werk` comes next: `Morgen werk ik thuis.`

Pack feedback:

- one contrast;
- one usable rule;
- one meaning note;
- no excessive terminology;
- optional English/Telugu contrast only when reviewed.

Do not claim the short rule covers questions, subordinate clauses, or every fronted element if the pack does not.

## AI-assisted authoring workflow

ChatGPT/Codex may draft candidate packs offline:

- contrast examples;
- original controlled exercises;
- distractors and proposed misconception codes;
- concise explanations;
- English/Telugu contrast notes;
- prerequisite and CEFR suggestions.

The authoring prompt must require:

- one narrow contrast only;
- explicit scope and counterexamples;
- all intentionally incorrect Dutch marked;
- alternative correct answers listed;
- fresh repair items drawn only from the output pack;
- output as `draft`;
- uncertainty notes.

Review must confirm:

- rule accuracy and limitations;
- all correct examples are natural;
- incorrect examples represent realistic errors;
- code is diagnostic from the controlled interaction;
- repair tasks have one defensible answer;
- translations explain meaning rather than mechanically mirror form;
- no copyrighted exercise text was copied.

## Implementation phases

### Phase 0 — evidence and source audit

- Inventory existing misconception codes/distractors.
- Count which codes are currently reliable in controlled tasks.
- Select one pilot based on actual exercise evidence, not personal preference alone.

### Phase 1 — registry and pack schema

- Define misconception registry, pack, contrast item, trigger, and review metadata.
- Add validator preventing invalid examples from entering positive pools.
- Draft one pack and reviewer preview.
- Pause for approval.

### Phase 2 — browsable pack

- Add the approved pack to Lessons.
- Implement notice–understand–choose–repair–produce flow.
- Track pack targets.

### Phase 3 — event-triggered repair

- Connect only allowlisted exercise sources.
- Add transparent trigger/cooldown policy.
- Offer/schedule without interrupting every mistake.

### Phase 4 — Daily Five and delayed check

- Schedule a different approved repair item.
- Mark a pack improved only after delayed success, not immediate repetition alone.

### Phase 5 — one-pack-at-a-time expansion

- Review learner errors and usefulness.
- Add the next pack only if it covers a common, reliably detectable issue.

## Tests

- schema and registry reference tests;
- tests preventing invalid examples from positive pools;
- diagnostic mapping tests for every authored distractor;
- trigger threshold/cooldown tests;
- scheduler diversity and delayed-repair tests;
- alternative-answer and ambiguity tests;
- content snapshots and review-status enforcement;
- UI accessibility and intentionally-wrong labeling;
- regressions for Sentence Forge/Verb Gym feedback.

## Learner-value gates

- The targeted error occurs often enough to justify a pack.
- Learners understand the explanation and can repair a different approved example.
- Delayed performance improves.
- Packs do not feel punitive or repetitive.
- The feature never overstates its diagnostic coverage.
- Authoring/review cost per pack is acceptable.

## Acceptance criteria

- One approved pack works in Lessons.
- At least one controlled source emits its code reliably.
- Triggering uses bounded, explainable rules and cooldown.
- A fresh approved repair exercise reaches Daily Five.
- Invalid learner examples cannot leak into normal language pools.
- No arbitrary sentence diagnosis, runtime AI, or full-grammar claim exists.

## Stop-and-ask conditions

Pause if:

- no existing controlled exercise can diagnose the chosen contrast;
- pack content is unreviewed;
- a distractor may also be grammatical in context;
- trigger frequency requires new telemetry or privacy policy;
- the requested pack expands into a broad grammar checker;
- the feature would label arbitrary saved/web sentences as erroneous.
