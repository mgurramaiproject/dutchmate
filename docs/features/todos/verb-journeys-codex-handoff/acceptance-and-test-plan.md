# Acceptance Criteria and Test Plan

## 1. Release acceptance criteria

### UI preservation

- Existing top-level navigation is unchanged.
- Today’s existing heatmaps and statistics remain present and functional.
- Existing Lessons, Saved and Options behaviour remains functional.
- No global colour, typography, spacing, icon or component restyle is introduced.
- New screens use existing design tokens and reusable components.
- No unrelated visual snapshots change without explicit approval.

### Feature behaviour

- A learner can enter Verb Journeys from Lessons.
- Universal Continue resumes the correct most recent unfinished activity.
- Werken overview shows core journeys and all eight form statuses.
- The canonical Werken Verb Map contains all eight Dutch forms.
- The map preserves onvoltooid/voltooid pairing at supported widths.
- The English comparison contains all 12 patterns in three groups.
- Each English record distinguishes common Dutch, meaning-preserving Dutch and mismatch.
- OTT, VTT and OVT journeys are complete end-to-end.
- Every required learner answer is click/tap based.
- Each journey supplies five core questions and at most two targeted repair questions.
- Completion reports demonstrated and weak skills.
- Today can surface a due/weak verb skill for review.
- Progress survives extension/popup restart.

### Determinism

- Runtime correctness requires no LLM or network call.
- The same submitted answer produces the same evaluation.
- Repair selection is stable and bounded.
- Invalid content fails validation before release.

### Safety and compatibility

- Existing user data is preserved.
- Migration is idempotent.
- Feature can be disabled without destructive rollback.
- No new extension permission is added unless separately justified and approved.

## 2. Unit tests

### Content validation

Test:

- valid werken pack passes;
- missing/duplicate Dutch form fails;
- missing/duplicate English tense fails;
- dangling exercise/journey/skill IDs fail;
- invalid target span fails;
- missing feedback fails;
- invalid token solution fails;
- unbounded repair rule fails;
- reference-only form blocking A1 fails.

### Exercise evaluator

For every exercise type:

- correct answer accepted;
- wrong answer rejected;
- order matters where intended;
- option order does not alter identity;
- resubmission behaviour is defined;
- feedback matches result;
- keyboard-triggered selection equals pointer selection.

### Progress/mastery

Test:

- recognition alone does not produce full mastery;
- success across required exercise families can produce demonstrated state;
- later error moves skill to needs-practice if specified;
- journey completion is separate from form mastery;
- review dates/eligibility are deterministic;
- unknown old content IDs do not crash.

### Continue selection

Test:

- latest meaningful unfinished activity selected;
- completed activity excluded;
- tie/fallback behaviour deterministic;
- existing non-verb lesson types still work.

## 3. Persistence tests

- Clean install creates valid default state.
- Upgrade from current production schema preserves all records.
- Running migration twice produces the same result.
- Corrupt/partial new records fail safely.
- Clearing only Verb Journey progress does not clear saved words or heatmaps.
- Content-version changes do not silently grant mastery.

## 4. Integration tests

Required happy path:

```text
Lessons
  → Verb Journeys
  → Werken
  → OTT story
  → notice
  → eight-form map
  → five exercises
  → completion
  → Today review
```

Required mistake path:

```text
VTT journey
  → wrong VTT/OVT contrast
  → authored explanation
  → targeted repair
  → completion reports needs-practice or recovery
  → Today schedules correct review
```

Required comparison path:

```text
Werken
  → English comparison
  → Present/Past/Future groups
  → all 12 records reachable
  → return without losing journey position
```

## 5. Regression tests

- Today heatmap periods and values still render.
- Existing word review works.
- Existing Practical Stories/lesson routes work.
- Saved list and details work.
- Options settings persist.
- Popup opens with no new console errors.
- Extension build/package succeeds.
- Existing tests remain green.

## 6. Accessibility tests

- Complete each exercise using keyboard only.
- Focus order follows visual order.
- Current selection, correctness and status are programmatically exposed.
- Correct/incorrect state is not conveyed only by colour.
- Expandable groups expose state and labels.
- Token order controls have accessible move/remove alternatives.
- Map cells have meaningful headings.
- Screen reader output distinguishes abbreviation, full Dutch name and example.
- Reduced motion is honoured.

Use the repository’s existing a11y tooling. If none exists, add the smallest suitable automated checks plus a documented manual pass.

## 7. Visual QA

At each supported viewport:

- compare Today before/after;
- compare Lessons before/after;
- inspect Werken overview;
- inspect the eight-form map collapsed and expanded;
- inspect all three English groups;
- inspect long Dutch/English text wrapping;
- inspect focus, correct, incorrect and reference states;
- inspect Saved and Options for regressions.

The existing app is the visual source of truth. The mockup is a behavioural guide.

## 8. Content QA

A human reviewer proficient in Dutch must confirm:

- all eight werken forms;
- all 12 English mappings;
- VTT versus OVT nuance;
- everyday alternatives;
- story naturalness;
- distractor plausibility;
- feedback accuracy;
- CEFR suitability.

Automated tests cannot certify linguistic quality.

## 9. Performance and packaging

- Measure popup startup before/after using existing tools.
- Avoid eagerly rendering/loading all detailed comparison content if it harms startup.
- Keep content static and tree/package friendly.
- Confirm bundle-size change is understood.
- Confirm Content Security Policy compliance.
- Confirm no new remote runtime dependency.

## 10. Definition of done for the werken slice

- Discovery and ADR are committed.
- Schema and all validators are tested.
- Release-ready werken content passes language review.
- OTT, VTT and OVT flows work end-to-end.
- Eight Dutch and 12 English views are complete.
- Progress and review persistence work across restart.
- Existing UI and data regression tests pass.
- Accessibility manual checklist is completed.
- Feature flag/rollback path is verified.
- Documentation states how to add the next verb without copying UI logic.

