# Feature 015: Verb Journeys tickets

**Code name:** `verb-journeys`

**Feature code:** `015-verb-journeys`

**Branch:** `015-verb-journeys`

**Status:** Published as GitHub Issues [#123](https://github.com/mgurramaiproject/dutchmate/issues/123) through [#129](https://github.com/mgurramaiproject/dutchmate/issues/129).

**Parent issue:** [#130 — Feature 015: Verb Journeys](https://github.com/mgurramaiproject/dutchmate/issues/130)

**Source plan:** [015-verb-journeys-plan.md](./015-verb-journeys-plan.md)

**Source specification:** [015-verb-journeys-spec.md](./015-verb-journeys-spec.md)

**Prototype:** [015-verb-journeys-wireframe-prototype.html](./015-verb-journeys-wireframe-prototype.html)

## Dependency map

```text
T01 / #123 ──┬──> T02 / #124 ──> T03 / #125 ──> T04 / #126 ──┐
             ├──> T05 / #127 ─────────────────────────────────┤
             └──> T02 / #124 ──> T06 / #128 ──────────────────┤──> T07 / #129
                                                              ┘
```

T01 establishes the authored `werken` read path and the shared popup
integration boundary. T02–T06 then add independently verifiable slices where
their prerequisites are complete. T07 is the final qualification gate.

## T01 — Establish the `werken` journey read path

**GitHub:** [#123](https://github.com/mgurramaiproject/dutchmate/issues/123)

**Blocked by:** None — can start immediately.

**What to build:** Give a learner a complete read-only route from Lessons into
the numbered Verb Journeys list, the `werken` overview, the staged story and
Notice the pattern screens, and the canonical eight-form Verb Map. Use the
approved compact popup interaction contract: persistent icon-labeled Today,
Lessons, and Saved bottom tabs; visible clickable controls; fixed verb numbers;
and no audio controls.

- [x] The validated authored `werken` pack exposes stable journey, form, map,
      and target identifiers.
- [x] Lessons opens Verb Journeys without adding a new top-level popup tab.
- [x] The verb list visibly numbers `werken` as `01` and future placeholders in
      stable order.
- [x] The `werken` overview shows staged OTT, VTT, and OVT journeys plus later
      or reference material without implying beginner mastery gates.
- [x] Story, Notice the pattern, Formula, Valuable contrast, and eight-form
      map content match the approved behavior and information architecture.
- [x] The map includes all eight Dutch forms, status cues, form detail,
      practical meaning, common usage, and learning priority.
- [x] The popup retains standard dimensions, compact top spacing, persistent
      bottom tabs, keyboard-operable controls, and no audio/listening UI.
- [x] Content validation, popup navigation, keyboard, narrow-layout, and
      provider-isolation checks pass.

**Implementation evidence:** `src/verb-journeys/content.ts` provides the
versioned `werken` pack and validator; `src/popup/index.ts` and the popup
styles provide the Lessons → Verb Journeys → overview → story → Notice → map
route. Focused content and popup tests, typechecking, the full test suite, and
Chrome/Firefox builds and extension-build verification passed. No PR is opened
in this ticket-scoped handoff; the work is reserved for the single Feature 015
PR.

## T02 — Add bounded VTT practice and completion

**GitHub:** [#124](https://github.com/mgurramaiproject/dutchmate/issues/124)

**Blocked by:** T01.

**What to build:** Let a learner practise the VTT `werken` journey through five
bounded click, tap, or keyboard questions, receive deterministic feedback, get
at most the authored repair questions after a supported mistake, and reach a
completion view that reports demonstrated decisions without claiming full
verb mastery.

- [x] The five questions cover meaning, form construction, natural
      translation, Verb Map placement, and word order.
- [x] Choice, token-slot, token-order, map-placement, reset, check, and next
      controls are keyboard-operable and visibly actionable.
- [x] Correct and incorrect answers produce authored deterministic feedback.
- [x] Supported mistakes route to at most two bounded authored repair
      questions and cannot create an unbounded loop.
- [x] Completion reports the five demonstrated decisions, separates review
      needs from journey completion, and offers the next contrast review.
- [x] No typed answers, speech, audio, runtime translation, runtime LLM, or
      network-dependent grading is introduced.
- [x] Practice, completion, accessibility, and provider-isolation checks pass.

**Implementation evidence:** `src/verb-journeys/practice.ts` provides five
authored deterministic VTT questions and a two-repair session cap;
`src/popup/index.ts` provides the click/tap/keyboard practice and completion
route without persistence or network grading. Focused tests and typechecking
pass; full-suite and Chrome/Firefox build verification are recorded before
commit. No PR is opened; this slice is reserved for the single Feature 015 PR.

## T03 — Persist Verb skill evidence safely

**GitHub:** [#125](https://github.com/mgurramaiproject/dutchmate/issues/125)

**Blocked by:** T02.

**What to build:** Record VTT practice results as additive verb/form/skill and
exercise-family evidence through the existing learning-record and typed
background boundaries, preserving unrelated learning history and separating
skill evidence from journey completion.

- [ ] Evidence identity is stable across verb, form or skill, and exercise
      family.
- [ ] Demonstrated status requires the specified varied and later evidence;
      later scored errors can return a skill to needs-practice.
- [ ] Writes are additive, idempotent, stale-submission-safe, and cannot
      award duplicate evidence.
- [ ] Compatible migration, backup, export, import, clear-data, and failed-
      migration behavior preserve prior records.
- [ ] Unknown or unavailable Verb Journey content cannot crash history reads.
- [ ] Learning-record, typed-boundary, migration, and provider-isolation
      checks pass.

## T04 — Connect Verb Journey review to Today and Daily Five

**GitHub:** [#126](https://github.com/mgurramaiproject/dutchmate/issues/126)

**Blocked by:** T03.

**What to build:** Make due or weak `werken` skills eligible for the existing
Today/Daily Five grammar review path without creating a second queue,
scheduler, or learner-facing mastery system.

- [ ] Due-first selection, vocabulary protection, recent-task safety, and the
      existing grammar cap remain unchanged.
- [ ] Eligible Verb Journey skills produce a deterministic authored review
      task through the existing grammar-task pool.
- [ ] Today shows a compact verb/form or skill action without previewing an
      unfinished exercise sentence.
- [ ] Review results return through the same evidence owner and scheduling
      boundary as direct practice.
- [ ] Existing Daily Five, Today, heatmap, lesson, and Saved behavior remains
      compatible.
- [ ] Review-selection, popup, persistence, and regression checks pass.

## T05 — Add the twelve-pattern English comparison

**GitHub:** [#127](https://github.com/mgurramaiproject/dutchmate/issues/127)

**Blocked by:** T01.

**What to build:** Let a learner open a complete Present/Past/Future English
comparison from the `werken` destination, inspect one pattern at a time, and
return without losing the journey position.

- [ ] All twelve English tense patterns have stable authored records.
- [ ] Each pattern includes an English example and situation, meaning-
      preserving Dutch, common everyday Dutch, actual Dutch form or
      construction, and a concise mismatch note.
- [ ] Patterns are grouped into Present, Past, and Future sections.
- [ ] Details open and close through keyboard-operable controls without
      overwhelming the popup width.
- [ ] The comparison permits multiple English patterns to map to one Dutch
      form plus context or a time marker where appropriate.
- [ ] Return navigation preserves the selected journey and practice position.
- [ ] Comparison validation, accessibility, responsive, and Dutch-review
      checks pass.

## T06 — Add conditional Saved integration

**GitHub:** [#128](https://github.com/mgurramaiproject/dutchmate/issues/128)

**Blocked by:** T01 and T02.

**What to build:** Connect a reliably resolved saved `werken` form to the same
Verb Map and practice destinations while keeping unresolved Saved entries safe
and unchanged.

- [ ] A reliably resolved saved form identifies its lemma and form before
      opening a Verb Journey destination.
- [ ] The Saved view offers explicit Open Verb Map and Practise actions using
      the existing navigation and focus conventions.
- [ ] Map and practice actions preserve the learner's current journey state
      and evidence boundaries.
- [ ] Unresolved or malformed Saved data does not invent a lemma, crash, or
      require external NLP or a network service.
- [ ] Existing Saved review, export/import, migration, and clear-data behavior
      remains compatible.
- [ ] Saved integration, popup, accessibility, and provider-isolation checks
      pass.

## T07 — Qualify the complete `werken` slice

**GitHub:** [#129](https://github.com/mgurramaiproject/dutchmate/issues/129)

**Blocked by:** T03, T04, T05, and T06.

**What to build:** Qualify the complete Feature 015 `werken` slice for release
with the approved popup interaction contract and all existing DutchMate
quality boundaries.

- [ ] The complete route is verifiable from Lessons through overview, story,
      Notice, map, English comparison, practice, completion, review, and
      return to Today.
- [ ] Persistent bottom tabs, icon affordances, fixed verb numbering, keyboard
      operation, focus behavior, narrow-popup containment, and renderer
      non-empty recovery are verified.
- [ ] No audio, listening, speech, runtime LLM, network-dependent grading, or
      second queue exists in the feature journey.
- [ ] Full authored-content validation and independent fluent-Dutch review
      pass with provenance.
- [ ] Relevant unit, integration, migration, accessibility, build, packaging,
      offline, and provider-isolation checks pass.
- [ ] Documentation, issue state, and delivery evidence are reconciled before
      implementation handoff.
