# Feature 016: `zijn` Verb Journeys tickets

**Parent:** [GitHub issue #133](https://github.com/mgurramaiproject/dutchmate/issues/133)

**Specification:** [016-zijn-journeys-spec.md](./016-zijn-journeys-spec.md)

**Branch:** `016-zijn-journeys`

**Status:** Breakdown approved and published as GitHub issues #134–#138.

**Child issues:** [#134](https://github.com/mgurramaiproject/dutchmate/issues/134),
[#135](https://github.com/mgurramaiproject/dutchmate/issues/135),
[#136](https://github.com/mgurramaiproject/dutchmate/issues/136),
[#137](https://github.com/mgurramaiproject/dutchmate/issues/137), and
[#138](https://github.com/mgurramaiproject/dutchmate/issues/138). All are
open and labeled `ready-for-agent`.

**Delivery Project:** Reconciled in Project 1 `Delivery`. Child issues #134–#138
are `Execution=Agent` and custom `Delivery Status=Ready`; frontier #134 is now
`In Progress` on branch `016-zijn-journeys`.

## Dependency map

```text
T01 Add additive zijn pack and first journey end to end
 └── T02 Add question and past-state journeys
      └── T03 Add past-experience journey
           └── T04 Add future, conditional, and advanced journeys
                └── T05 Connect review and qualify the complete package
```

The first ticket deliberately combines the multi-pack expansion with one real
learner path. This keeps the refactor verifiable and prevents a standalone
horizontal architecture ticket from landing without a working second verb.

## T01 — Add the additive `zijn` pack and first journey end to end

**GitHub:** [#134](https://github.com/mgurramaiproject/dutchmate/issues/134)

**What to build:** Add `zijn` beside `werken` through the existing Lessons
Verb Journey flow. The first identity/state journey must work from story,
notice, shared eight-form map, and comparison entry through five-question
practice, evidence, completion, and return navigation. Existing `werken`
identifiers, behavior, and learner history must remain valid.

**Blocked by:** None — can start immediately.

**Status:** implemented; feature-level review and PR pending

- [x] The shared content and practice seams select a pack by stable verb identity while preserving the existing `werken` pack and identifiers.
- [x] The initial `zijn` pack has stable identity, content version, validated form/comparison records, and the first complete identity/state journey.
- [x] The first journey teaches the bounded `ben`/`bent`/`is`/`zijn` contrast without silently claiming the full paradigm.
- [x] The first journey exposes story, notice, map/comparison, five authored question families, bounded repair, evidence, completion, and return behavior.
- [x] Existing `werken` content, practice, popup behavior, and learning records remain green.
- [x] Focused content, practice, learning, popup, typecheck, and build checks pass for this slice.

## T02 — Add `zijn` question and past-state journeys

**GitHub:** [#135](https://github.com/mgurramaiproject/dutchmate/issues/135)

**What to build:** Extend the `zijn` package with the present-tense question /
inversion journey and the `was`/`waren` past-state journey. Each journey is a
complete learner path with its own story, notice, questions, repairs,
evidence, completion, and return behavior.

**Blocked by:** T01 — Add the additive `zijn` pack and first journey end to end.

**Status:** implemented; feature-level review and PR pending

- [x] The question journey teaches a bounded set of `ben je?`, `is het?`, and `zijn we?` decisions through authored context.
- [x] The past-state journey teaches `was` and `waren` for past states or locations at the approved A1/A2 boundary.
- [x] Both journeys have five authored questions covering meaning, construction, natural usage, map placement, and delayed/recombined order.
- [x] Both journeys have targeted repairs capped at two and do not fall through to another journey's question bank.
- [x] Mixed-person practice remains explicitly bounded and evidence is keyed to the relevant `zijn` skills.
- [x] Focused content, practice, popup, learning, typecheck, and build checks pass without regressions to T01 or `werken`.

## T03 — Add the `zijn` past-experience journey

**GitHub:** [#136](https://github.com/mgurramaiproject/dutchmate/issues/136)

**What to build:** Add the complete `ben geweest` / `is geweest` journey for
past experience or being somewhere. The learner can distinguish the meaning,
construct the supported phrase, choose natural Dutch, place it on the map,
recombine it after delayed support, repair a bounded error, and finish with
honest evidence.

**Blocked by:** T02 — Add `zijn` question and past-state journeys.

**Status:** implemented; feature-level review and PR pending

- [x] The story and notice explain `zijn` as the main/copular verb and do not introduce auxiliary constructions for other verbs.
- [ ] The journey includes independently reviewed English and Telugu support and target spans that occur literally in the Dutch story lines.
- [x] Its five authored questions and repairs are deterministic, accepted-answer bounded, and keyed to its own stable journey and skill IDs.
- [x] Duplicate-token selection, selected-token order, removal by occurrence, retry, and reset remain usable through the shared practice controls.
- [x] Completion and evidence distinguish the journey result from independent production or full-verb mastery.
- [x] Focused content, practice, popup, typecheck, and build checks pass.

Implementation evidence for #134–#136 is recorded in the corresponding GitHub
issue comments. Independent fluent-Dutch and English/Telugu review remains a
deliberate final qualification gate for #138.

## T04 — Add future, conditional, and advanced `zijn` journeys

**GitHub:** [#137](https://github.com/mgurramaiproject/dutchmate/issues/137)

**What to build:** Complete the `zal zijn` / `zou zijn` later journey and the
advanced `was geweest` / `zal geweest zijn` / `zou geweest zijn` reference
journey. Both remain fully playable; later/reference status changes
progression priority only and never produces a placeholder or beginner lock.

**Blocked by:** T03 — Add the `zijn` past-experience journey.

**Status:** implemented; feature-level review and PR pending

- [x] The future/conditional journey distinguishes an explicit future plan from a conditional possibility using authored, structurally validated situations.
- [x] The advanced journey provides complete authored content for its advanced completed and hypothetical forms and clearly labels its reference priority.
- [x] Both journeys have five authored questions, bounded repairs, evidence, completion, and return behavior.
- [x] The complete `zijn` pack now contains six journeys, eight Dutch map forms, twelve English comparisons, stable references, and no incomplete journey content.
- [x] All six journeys route to their own practice sets and share deterministic map/comparison behavior.
- [x] Focused qualification, content, practice, popup, typecheck, and build checks pass.

## T05 — Connect `zijn` review and qualify the complete package

**GitHub:** [#138](https://github.com/mgurramaiproject/dutchmate/issues/138)

**What to build:** Make the completed `zijn` pack part of the existing Today /
Daily Five review loop and release qualification. Verify additive persistence,
migration, export/import, `werken` preservation, accessibility, learner-language
review, narrow-popup behavior, and the complete automated/manual delivery gate.

**Blocked by:** T04 — Add future, conditional, and advanced `zijn` journeys.

**Status:** ready-for-agent

- [ ] Due or weak `zijn` skills enter the existing Daily Five grammar pool without a second queue, scheduler, or grammar destination.
- [ ] Daily Five vocabulary protection, grammar cap, idempotency, stale-revision protection, and Today semantics remain intact.
- [ ] Compatible updates preserve `werken`, `zijn`, lesson, Saved, rhythm, contrast, and unrelated learning records; migration failure is atomic.
- [ ] Export/import and clear-data behavior preserve the additive multi-pack record contract.
- [ ] All learner-visible Dutch content has independent fluent-Dutch review with reviewer/date/source provenance; English and Telugu support has clarity review.
- [ ] Accessibility, keyboard/focus behavior, feedback announcements, narrow-popup containment, and manual incorrect/retry/reference/completion scenarios pass.
- [ ] Full tests, typecheck, builds/packages, whitespace checks, documentation checks, and issue checklist evidence are complete.

## Delivery rules

- Each ticket is implemented in a fresh context against this specification and
  its blockers.
- Do not modify or close parent issue #133 while publishing child tickets.
- Apply `ready-for-agent` to each child issue; use GitHub issue text for
  blocking edges because the configured tracker has no confirmed native edge
  contract for this workflow.
- Preserve human linguistic review and manual browser/extension QA as real
  acceptance gates; do not blanket-check them from automated output.
- Commit every intentional change with the repository's ticket/codename
  subject convention and leave the branch clean at each handoff.
