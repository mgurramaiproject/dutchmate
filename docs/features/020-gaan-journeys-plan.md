# Plan 020: `gaan` Verb Journeys

**Codename:** `gaan-journeys`

**Feature code:** `020-gaan-journeys`

**Branch:** `020-gaan-journeys`, created from the clean local `main` branch on
2026-08-02.

**Status:** Specification created and published; awaiting approval before
invoking `$to-tickets`.

**Specification:** [020-gaan-journeys-spec.md](./020-gaan-journeys-spec.md);
published as [GitHub issue #159](https://github.com/mgurramaiproject/dutchmate/issues/159)
with `ready-for-agent`.

## Goal

Author a complete DutchMate Verb Journey package for the irregular, high-utility
verb `gaan` (“to go”). The package will extend the existing additive multi-pack
registry while preserving all existing verb IDs, evidence, exports/imports,
review semantics, and upgrade-safe learner history.

It will reuse the current Lessons, Verb Journey, Verb Map, English comparison,
deterministic practice, Today/Daily Five, popup, and local learning-record
contracts. It will not create a parallel scheduler, mastery model, evidence
store, or verb-specific UI framework.

## Shared understanding

- Teach movement and departure, destinations, plans, near-future `gaan` plus an
  infinitive, and a bounded perfect construction using `zijn` such as `ik ben
  gegaan`.
- Keep auxiliary teaching bounded to authored `gaan` examples and a small
  practical contrast. Do not create a general auxiliary course.
- Use six complete, playable journeys:
  1. Going somewhere and leaving.
  2. Plans and near-future `gaan` plus an infinitive.
  3. Past movement with `ging` and `gingen`.
  4. Completed movement with `ben gegaan`.
  5. Future and conditional movement with `zal gaan` and `zou gaan`.
  6. Earlier or completed-future movement as clearly labelled A2 reference
     material.
- Keep stories primarily first-person. Teach bounded person and inversion
  contrasts where they carry real value, including `jij gaat`/`ga jij?`,
  third-person forms, and plural forms, without implying uncued full-paradigm
  production.
- Keep the learning triangle: Dutch learning content with English and Telugu
  support, bounded to DutchMate’s A0/Pre-A1 through A2 foundation progression.
- Use form progress as the primary learner-facing metric: one target-form slot
  per declared target form when the journey has evidence, with the denominator
  derived from the pack’s eight canonical Dutch form records. Show journey
  completion separately.
- Include the complete eight-form Dutch Verb Map and all twelve English
  comparison records. Each comparison has separate meaning-preserving and
  Everyday Dutch roles, authored cues, explicit mismatch notes, and reviewed
  Dutch/English/Telugu support.
- Reuse the existing popup interaction contract. No new clickable prototype is
  needed unless implementation discovery reveals a materially different flow.
- Exclude audio, runtime AI grading or generation, typed-answer requirements,
  a new top-level popup destination, speculative Saved-to-`gaan` resolution,
  a broad `gaan` idiom course, and a broad cross-verb auxiliary course.

## Authoring matrix boundary

The exact stable journey IDs, story-line IDs, target spans, skill IDs,
questions, repairs, and reviewed translations will be completed in the
qualification record before implementation. The initial matrix is:

| Journey | Learner decision | Target scope | Priority |
| --- | --- | --- | --- |
| Going somewhere and leaving | Recognise and construct present movement/departure sentences and bounded person forms. | OTT | Core A0/A1 |
| Plans and near future | Distinguish ordinary present plans from explicit `ga` + infinitive near-future phrasing. | OTT construction and bounded inversion | Core A1 |
| Past movement | Use `ging`/`gingen` for past movement, routine, and background. | OVT | Core A1/A2 |
| Completed movement | Recognise and construct `ben/is/zijn gegaan` in a present-linked completed event. | VTT and `zijn` auxiliary | Core A2 |
| Future and conditional movement | Distinguish explicit future `zal gaan` from conditional `zou gaan`. | OTTT and OVTT | Core A2 |
| Earlier/completed-future movement | Inspect and control clearly labelled `was gegaan`, `zal gegaan zijn`, and `zou gegaan zijn` reference constructions. | VVT, VTTT, VVTT | Later/reference A2 |

Every journey is expected to have five story lines, an authored notice, a map
or comparison destination, five journey-owned practice questions, at most two
targeted repairs, evidence, completion, and a return path. Later/reference
priority never excuses placeholder content or a dead end.

## Architecture and compatibility boundary

- Register `gaan` by stable verb identity through the existing additive
  multi-pack seam.
- Preserve the existing packs’ stable IDs, evidence keys, export/import data,
  review semantics, and migration behavior.
- Extend existing validators, deterministic practice, learning records,
  typed background messages, Lessons/Today/Daily Five, popup navigation,
  map/comparison views, and accessibility tests only where `gaan` requires it.
- Keep all correctness authored and deterministic. Do not infer tense, person,
  auxiliary, or acceptable answers at runtime.
- Derive progress from canonical target-form records rather than journey count
  or a hardcoded denominator.
- Qualify every learner-visible Dutch, English, and Telugu string separately;
  structural validation is not linguistic review.

## Verification seams proposed for `$to-spec`

1. The multi-pack content validator and availability report: complete
   `gaan` eight-form/twelve-comparison coverage, stable IDs, target integrity,
   six complete journeys, person-scope rules, translations, and review metadata.
2. Pure journey and evaluator logic: one authored five-question set per
   journey, all five exercise families, deterministic accepted answers,
   bounded repairs, retry/reset behavior, and duplicate-token identity.
3. The existing learning-record and typed background boundary: additive
   `gaan` evidence, idempotency, stale-submission protection, migration
   atomicity, export/import compatibility, Daily Five eligibility, and
   preservation of the existing packs.
4. Existing popup and Lessons integration: the four-verb directory,
   `gaan` overview, all journey routes, map/comparison focus, completion return,
   Today activity, accessibility, and narrow-popup containment.

## Qualification gate

Before implementation, complete the `author-verb-journeys` authoring matrix
and qualification record for every journey, including:

- stable form, journey, story-line, target-span, skill, question, accepted
  answer, repair, feedback, and translation IDs;
- target-form progress contribution and the eight-form denominator;
- allowed person scope and bounded inversion contrasts;
- independent fluent-Dutch review with reviewer, date, and sources;
- English and Telugu meaning/clarity review;
- additive multi-pack and learner-history compatibility checks;
- explicit deferred ideas that must not leak into the package.

## Approval gates and next delivery order

1. Commit this plan, glossary decision, and parking-lot updates. **Completed:**
   commit `cfcfde7`.
2. Ask for explicit approval to invoke `$to-spec` and create the canonical
   specification. **Completed:** the seams were reviewed and the
   specification was published as GitHub issue #159 with `ready-for-agent`.
3. Review the specification and its proposed seams with the user. **Completed:**
   the four approved seams are recorded in the specification.
4. Ask for explicit approval to invoke `$to-tickets` and create
   `docs/features/020-gaan-journeys-tickets.md` plus the dependency-ordered
   GitHub issue tree.
5. Implement tickets strictly against the approved specification, using
   `$author-verb-journeys` and the existing additive multi-pack seam.
6. Run qualification, Dutch review, focused tests, typecheck, full suite,
   build/package checks, manual popup QA, diff review, and the complete
   GitHub/Delivery handoff.

No specification, ticket document, issue tree, prototype, or implementation
work is authorized by this plan alone.
