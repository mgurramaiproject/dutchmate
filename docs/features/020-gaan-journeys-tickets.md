# Feature 020: `gaan` Verb Journeys tickets

**Parent:** [GitHub issue #159](https://github.com/mgurramaiproject/dutchmate/issues/159)

**Specification:** [020-gaan-journeys-spec.md](./020-gaan-journeys-spec.md)

**Branch:** `020-gaan-journeys`

**Status:** Breakdown approved and published as GitHub issues #160–#166. All
are open and labeled `ready-for-agent`.

**Child issues:** [#160](https://github.com/mgurramaiproject/dutchmate/issues/160),
[#161](https://github.com/mgurramaiproject/dutchmate/issues/161),
[#162](https://github.com/mgurramaiproject/dutchmate/issues/162),
[#163](https://github.com/mgurramaiproject/dutchmate/issues/163),
[#164](https://github.com/mgurramaiproject/dutchmate/issues/164),
[#165](https://github.com/mgurramaiproject/dutchmate/issues/165), and
[#166](https://github.com/mgurramaiproject/dutchmate/issues/166).

## Dependency map

```text
T01 Add additive gaan pack and first movement journey
 ├── T02 Add near-future plans journey
 ├── T03 Add past movement journey
 ├── T04 Add completed movement journey
 ├── T05 Add future and conditional movement journey
 └── T06 Add earlier and completed-future reference journey
      └── T07 Connect review and qualify the complete package
```

T07 is blocked by T02–T06. T02–T06 are independent content slices after T01;
their shared pack foundation is the only implementation gate. Each ticket is a
complete, demoable learner path and extends the same additive pack, deterministic
practice, learning-record, and popup seams.

## T01 — Add additive `gaan` pack and first movement journey

**GitHub:** [#160](https://github.com/mgurramaiproject/dutchmate/issues/160)

**What to build:** Add the irregular `gaan` pack beside `werken`, `zijn`, and
`hebben` through the existing Lessons Verb Journey flow. The first journey,
“Going somewhere and leaving,” must work end to end from story and notice
through the shared eight-form map or English comparison, five-question practice,
evidence, completion, and return navigation.

**Blocked by:** None — can start immediately.

- [ ] The additive registry selects `gaan` by stable identity while preserving existing pack identifiers, evidence, exports/imports, and learner history.
- [ ] The `gaan` pack has a versioned identity, eight Dutch form records, twelve English comparison records, stable IDs, and structural validation.
- [ ] The first journey teaches movement/departure with bounded person scope and five reviewed Dutch/English/Telugu story lines.
- [ ] The journey has literal target spans, a complete notice, five authored question families, capped repairs, evidence, completion, and return behavior.
- [ ] The four-verb directory and `gaan` overview use the existing popup interaction and progress contracts.
- [ ] Focused content, practice, learning, popup, typecheck, and build checks pass for this vertical slice.

## T02 — Add near-future plans journey

**GitHub:** [#161](https://github.com/mgurramaiproject/dutchmate/issues/161)

**What to build:** Extend the `gaan` package with a complete journey for plans
and near-future `gaan` plus an infinitive. Learners distinguish ordinary
present plans from explicit future phrasing and practise bounded inversion such
as `ga je?` through the existing story, notice, map/comparison, practice,
evidence, completion, and return flow.

**Blocked by:** T01 — Add additive `gaan` pack and first movement journey.

- [ ] The journey teaches `gaan` plus an infinitive in authored A1 situations and distinguishes it from nearby present/future choices.
- [ ] The journey includes bounded person and inversion contrasts without expanding to uncued full-paradigm production.
- [ ] The journey has five reviewed story lines, valid target spans, a complete notice, five authored questions, and no more than two repairs.
- [ ] The journey routes to its own questions and records evidence against stable `gaan` skills.
- [ ] Existing map/comparison, token, retry/reset, completion, and accessibility behavior remains deterministic.
- [ ] Focused content, practice, popup, typecheck, and build checks pass without regressions to T01 or earlier packs.

## T03 — Add past movement journey

**GitHub:** [#162](https://github.com/mgurramaiproject/dutchmate/issues/162)

**What to build:** Extend the `gaan` package with a complete journey for past
movement using `ging` and `gingen`. Learners distinguish past movement, routine,
and background through authored situations and finish the same complete practice
and evidence path.

**Blocked by:** T01 — Add additive `gaan` pack and first movement journey.

- [ ] The journey teaches `ging`/`gingen` at the approved A1/A2 boundary with useful time and context cues.
- [ ] Story, notice, and feedback distinguish past movement from present movement and nearby completed-event meanings.
- [ ] The journey has five reviewed story lines, valid targets, a complete notice, five authored questions, and repairs capped at two.
- [ ] Accepted answers, duplicate-token identity, selected-token order, removal by occurrence, retry, and reset remain deterministic.
- [ ] Completion and evidence distinguish demonstrated past-movement skill from journey completion.
- [ ] Focused content, practice, popup, typecheck, and build checks pass without regressions to T01 or earlier packs.

## T04 — Add completed movement journey

**GitHub:** [#163](https://github.com/mgurramaiproject/dutchmate/issues/163)

**What to build:** Add the complete movement-perfect journey for authored forms
such as `ik ben gegaan`, `zij is gegaan`, and `wij zijn gegaan`. Learners
recognise and construct the bounded `zijn` auxiliary contrast without entering a
general auxiliary or participle-formation course.

**Blocked by:** T01 — Add additive `gaan` pack and first movement journey.

- [ ] The journey teaches present-linked completed movement and the bounded `zijn` auxiliary boundary through reviewed authored examples.
- [ ] The notice and practice may contrast a selected `hebben` construction but do not create a general auxiliary curriculum.
- [ ] The journey has five reviewed story lines, valid targets, a complete notice, five authored questions, and repairs capped at two.
- [ ] The journey routes to its own question set and records auxiliary/movement evidence without re-keying existing packs.
- [ ] Map/comparison focus, feedback, progress, completion, return, and accessibility remain deterministic.
- [ ] Focused content, practice, learning, popup, typecheck, and build checks pass without regressions to T01 or earlier packs.

## T05 — Add future and conditional movement journey

**GitHub:** [#164](https://github.com/mgurramaiproject/dutchmate/issues/164)

**What to build:** Add the complete A2 journey for explicit future and
conditional movement using `zal gaan` and `zou gaan`. Learners choose between
future prediction/plan and conditional possibility in context and complete the
full authored practice and evidence path.

**Blocked by:** T01 — Add additive `gaan` pack and first movement journey.

- [ ] The journey distinguishes `zal gaan` from `zou gaan` through authored situations and explicit feedback.
- [ ] The journey remains within the A2 foundation progression and does not claim formal future-tense mastery.
- [ ] The journey has five reviewed story lines, valid targets, a complete notice, five authored questions, and repairs capped at two.
- [ ] The journey routes to its own questions, preserves delayed/recombined word order, and records evidence safely.
- [ ] Future/conditional forms render correctly in the map, comparison lens, popup, and narrow layout.
- [ ] Focused content, practice, learning, popup, typecheck, and build checks pass without regressions to T01 or earlier packs.

## T06 — Add earlier and completed-future reference journey

**GitHub:** [#165](https://github.com/mgurramaiproject/dutchmate/issues/165)

**What to build:** Complete the sixth `gaan` journey for earlier and
completed-future movement. Forms such as `was gegaan`, `zal gegaan zijn`, and
`zou gegaan zijn` remain clearly labelled later/reference content but are fully
playable through story, notice, map/comparison, practice, evidence, completion,
and return.

**Blocked by:** T01 — Add additive `gaan` pack and first movement journey.

- [ ] The journey covers the approved VVT, VTTT, and VVTT reference boundary with reviewed, context-rich content.
- [ ] Later/reference labels affect priority only; the journey has no placeholder copy, lock, misleading gate, or dead end.
- [ ] The journey has five reviewed story lines, valid targets, a complete notice, five authored questions, and repairs capped at two.
- [ ] Long future/reference Dutch and Telugu content remains readable at the popup width and zoom checks.
- [ ] The complete `gaan` pack now has six complete journeys, eight map forms, twelve English comparisons, stable references, and no content fall-through.
- [ ] Focused qualification, content, practice, popup, typecheck, and build checks pass without regressions to T01–T05 or earlier packs.

## T07 — Connect review and qualify the complete package

**GitHub:** [#166](https://github.com/mgurramaiproject/dutchmate/issues/166)

**What to build:** Make the completed `gaan` pack part of the existing
Today/Daily Five review loop and complete the release qualification gate.
Verify additive persistence, migration, export/import, progress semantics,
accessibility, trilingual content review, manual extension QA, and the full
automated delivery checks.

**Blocked by:** T02, T03, T04, T05, and T06.

- [ ] Due or weak `gaan` skills enter the existing Daily Five review pool without a second queue, scheduler, mastery model, or grammar destination.
- [ ] Daily Five caps, vocabulary protection, idempotency, stale-revision protection, and Today summary refresh remain intact.
- [ ] Compatible updates preserve `werken`, `zijn`, `hebben`, lesson, Saved, rhythm, contrast, and unrelated learning records; incompatible migration failure remains atomic.
- [ ] Form progress derives target-form slots from canonical pack forms, keeps repeated target forms independent, and remains separate from journey completion.
- [ ] Export/import and clear-data behavior preserve the additive multi-pack learning-record contract.
- [ ] The authoring matrix and qualification record are complete, including fluent-Dutch provenance and English/Telugu meaning and clarity review.
- [ ] Map/comparison DOM, keyboard/focus behavior, narrow-popup containment, and manual incorrect/retry/reference/completion scenarios pass.
- [ ] Focused tests, popup suite, typecheck, full tests, build/package checks, documentation checks, and whitespace checks pass.

## Delivery rules

- Implement each ticket in a fresh context against the Feature 020
  specification and its blockers.
- Do not modify or close parent issue #159 while publishing or implementing
  child tickets.
- Each child issue is labeled `ready-for-agent`; blocking edges are recorded in
  issue text because no native blocking-edge contract is assumed.
- Preserve human linguistic review and manual browser/extension QA as real
  acceptance gates; do not infer them from automated output.
- Commit every intentional change with the repository’s ticket/codename
  subject convention and leave the branch clean at each handoff.
