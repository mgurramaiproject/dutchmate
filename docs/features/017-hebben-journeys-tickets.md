# Feature 017: `hebben` Verb Journeys tickets

**Parent:** [GitHub issue #140](https://github.com/mgurramaiproject/dutchmate/issues/140)

**Specification:** [017-hebben-journeys-spec.md](./017-hebben-journeys-spec.md)

**Branch:** `017-hebben-journeys`

**Status:** Breakdown approved and published as GitHub issues #141–#146. All
are open and labeled `ready-for-agent`.

**Child issues:** [#141](https://github.com/mgurramaiproject/dutchmate/issues/141),
[#142](https://github.com/mgurramaiproject/dutchmate/issues/142),
[#143](https://github.com/mgurramaiproject/dutchmate/issues/143),
[#144](https://github.com/mgurramaiproject/dutchmate/issues/144),
[#145](https://github.com/mgurramaiproject/dutchmate/issues/145), and
[#146](https://github.com/mgurramaiproject/dutchmate/issues/146).

## Dependency map

```text
T01 Add additive hebben pack and first possession journey
 └── T02 Add present-expression and past-possession journeys
      └── T03 Add lexical completed-experience journey
           └── T04 Add bounded auxiliary-perfect journey
                └── T05 Add future, conditional, and advanced perfect variants
                     └── T06 Connect review and qualify the complete package
```

The chain follows the established additive multi-pack delivery shape. Each
ticket leaves the package in a demoable, verifiable state and establishes the
content or learner path required by the next integrated slice. The auxiliary
journey is intentionally separate because it introduces a distinct
`hebben`/`zijn` selection boundary.

## T01 — Add additive `hebben` pack and first possession journey

**GitHub:** [#141](https://github.com/mgurramaiproject/dutchmate/issues/141)

**What to build:** Add the irregular `hebben` pack beside `werken` and `zijn`
through the existing Lessons Verb Journey flow. The first journey, “What I
have and what is available,” must work end to end from story and notice through
the shared eight-form map or English comparison, five-question practice,
evidence, completion, and return navigation.

**Blocked by:** None — can start immediately.

- [x] The additive pack registry selects `hebben` by stable verb identity while preserving `werken` and `zijn` identifiers, evidence, exports/imports, and learner history.
- [x] The `hebben` pack has a versioned identity, complete eight-form Dutch map, twelve English comparison records, stable lowercase IDs, and structural validation.
- [x] The first journey teaches `heb`, `hebt`, `heeft`, and `hebben` for possession, relationships, and availability with bounded person scope.
- [x] The journey has five reviewed story lines in Dutch, English, and Telugu, literal target spans, a complete notice, five authored question families, capped repairs, evidence, completion, and return behavior.
- [x] Existing `werken` and `zijn` content, practice, popup behavior, and learning records remain green.
- [x] Focused content, practice, learning, popup, typecheck, and build checks pass for this vertical slice.

## T02 — Add present-expression and past-possession journeys

**GitHub:** [#142](https://github.com/mgurramaiproject/dutchmate/issues/142)

**What to build:** Extend the `hebben` package with the present-expression
journey and the past-possession journey. Learners practise high-value
expressions involving feelings, needs, and time, bounded question/inversion
contrasts, and `had/hadden` for past possession or background states. Each
journey is complete with its own authored practice and evidence.

**Blocked by:** T01 — Add additive `hebben` pack and first possession journey.

- [x] The present-expression journey teaches high-value `hebben` expressions and bounded forms such as `heb je?` and `heeft hij?` through authored situations.
- [x] The past-possession journey teaches `had` and `hadden` at the approved A1/A2 boundary.
- [x] Both journeys have five story lines, Dutch/English/Telugu support, valid target highlights, complete notices, five authored questions, and repairs capped at two.
- [x] Each journey routes to its own question set and records evidence against its own stable skills and exercise families.
- [x] Shared person-scope, token, retry/reset, map/comparison, completion, and return behavior remains deterministic and accessible.
- [x] Focused content, practice, popup, learning, typecheck, and build checks pass without regressions to T01, `werken`, or `zijn`.

## T03 — Add lexical completed-experience journey

**GitHub:** [#143](https://github.com/mgurramaiproject/dutchmate/issues/143)

**What to build:** Add the lexical completed-experience journey for `hebben gehad`.
Learners distinguish a completed experience or state from present
possession and past background, construct the supported phrase, choose natural
Dutch, place it on the map, recombine it after delayed support, repair a bounded
error, and finish with honest evidence.

**Blocked by:** T02 — Add present-expression and past-possession journeys.

- [x] The journey teaches lexical `heb/heeft gehad` for completed experiences or states without becoming a general perfect-tense course.
- [x] Story, notice, and feedback distinguish lexical `hebben gehad` from nearby present and past contrasts.
- [x] The journey has five authored questions covering meaning, construction, natural usage, map placement, and delayed/recombined order, plus no more than two targeted repairs.
- [x] Accepted alternatives, duplicate-token identity, selected-token order, removal by occurrence, retry, and reset remain deterministic.
- [x] Completion and evidence distinguish demonstrated form/skill evidence from journey completion and uncued production.
- [x] Focused content, practice, popup, learning, typecheck, and build checks pass without regressions to T02 or earlier verb packs.

## T04 — Add bounded auxiliary-perfect journey

**GitHub:** [#144](https://github.com/mgurramaiproject/dutchmate/issues/144)

**What to build:** Add the complete auxiliary-perfect journey for common
phrases such as `ik heb gewerkt`. Learners recognise and construct the bounded
auxiliary role of `hebben`, choose natural Dutch in context, and make the
selected practical contrast with `zijn` without entering a broad auxiliary or
participle-formation course.

**Blocked by:** T03 — Add lexical completed-experience journey.

- [ ] The journey teaches common auxiliary `hebben` perfect constructions through a small authored set of high-frequency cross-verb examples.
- [ ] The notice and practice explain the practical boundary between selected `hebben` and `zijn` perfect constructions without claiming a full auxiliary system.
- [ ] Cross-verb examples remain authored content owned by the `hebben` package and do not create new journeys for `werken`, `zien`, or `gaan`.
- [ ] The journey has five authored questions covering meaning, construction, natural usage, map placement, and delayed/recombined order, plus no more than two targeted repairs.
- [ ] Evidence is keyed to the auxiliary skill and exercise family, remains additive and content-versioned, and preserves existing learner history.
- [ ] Focused content, practice, popup, learning, typecheck, and build checks pass without regressions to T03 or earlier verb packs.

## T05 — Add future, conditional, and advanced perfect variants

**GitHub:** [#145](https://github.com/mgurramaiproject/dutchmate/issues/145)

**What to build:** Complete the sixth `hebben` journey for future and
conditional possession, including clearly labelled advanced perfect variants.
The journey remains fully playable; later priority changes progression order
but never creates a placeholder, lock, or misleading beginner-gate message.

**Blocked by:** T04 — Add bounded auxiliary-perfect journey.

- [ ] The journey distinguishes future plans or predictions from conditional possibilities using authored situations for `zal hebben` and `zou hebben`.
- [ ] Advanced VTTT and VVTT variants are complete, clearly labelled, and connected to the eight-form map and twelve-pattern comparison.
- [ ] The journey has five authored questions, bounded repairs, evidence, completion, and return behavior.
- [ ] The complete `hebben` pack contains six complete journeys, eight Dutch map forms, twelve English comparisons, stable references, and no placeholder content.
- [ ] All six journeys route to their own question sets and share deterministic map/comparison, accessibility, and progress behavior.
- [ ] Focused qualification, content, practice, popup, typecheck, and build checks pass without regressions to T04 or earlier verb packs.

## T06 — Connect review and qualify the complete package

**GitHub:** [#146](https://github.com/mgurramaiproject/dutchmate/issues/146)

**What to build:** Make the completed `hebben` pack part of the existing
Today/Daily Five review loop and complete the release qualification gate.
Verify additive persistence, migration, export/import, progress semantics,
accessibility, trilingual content review, manual extension QA, and the full
automated delivery checks.

**Blocked by:** T05 — Add future, conditional, and advanced perfect variants.

- [ ] Due or weak `hebben` skills enter the existing Daily Five review pool without a second queue, scheduler, mastery model, or grammar destination.
- [ ] Daily Five vocabulary protection, grammar caps, idempotency, stale-revision protection, and Today summary refresh remain intact.
- [ ] Compatible updates preserve `werken`, `zijn`, lesson, Saved, rhythm, contrast, and unrelated learning records; incompatible migration failure remains atomic.
- [ ] Form progress counts target-form slots from canonical pack forms, keeps repeated target forms independent, and remains separate from journey completion.
- [ ] Export/import and clear-data behavior preserve the additive multi-pack learning-record contract.
- [ ] The authoring matrix and qualification record are complete, with fluent-Dutch review provenance and English/Telugu meaning and clarity review.
- [ ] Accessibility, keyboard/focus behavior, narrow-popup containment, and manual incorrect/retry/reference/completion scenarios pass.
- [ ] Focused tests, popup suite, typecheck, full tests, build/package checks, documentation checks, and whitespace checks pass.

## Delivery rules

- Implement each ticket in a fresh context against the Feature 017
  specification and its blockers.
- Do not modify or close parent issue #140 while publishing or implementing
  child tickets.
- Each child issue is labeled `ready-for-agent`; blocking edges are recorded in
  issue text because this workflow has no confirmed native edge contract.
- Preserve human linguistic review and manual browser/extension QA as real
  acceptance gates; do not blanket-check them from automated output.
- Commit every intentional change with the repository's ticket/codename
  subject convention and leave the branch clean at each handoff.
