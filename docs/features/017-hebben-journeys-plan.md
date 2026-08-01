# Plan 017: `hebben` Verb Journeys

**Codename:** `hebben-journeys`

**Feature code:** `017-hebben-journeys`

**Branch:** `017-hebben-journeys`, created from the clean `main` branch.

**Status:** Grill and shared understanding complete; `$to-spec` and
`$to-tickets` remain approval-gated.

## Goal

Author a complete DutchMate Verb Journey package for the high-utility,
irregular verb `hebben` (“to have”). The package adds a third verb through the
existing additive multi-pack registry while preserving `werken` and `zijn`
identifiers, evidence, exports/imports, review semantics, and learner history.
It keeps the existing Lessons, Today/Daily Five, popup, deterministic practice,
and local learning-record contracts.

## Shared understanding

- Teach both main-verb `hebben` and a deliberately bounded auxiliary role in
  common perfect-tense phrases. This is not a general Dutch perfect-tense
  course.
- Use six complete, playable journeys. The eight-form Verb Map is a reference
  surface, not a requirement to create eight lessons per verb.
- Model journeys around learner decisions and meanings. A journey may target
  multiple forms, and one form may appear in multiple journeys when its
  meanings or decisions differ.
- Keep stories primarily first-person. Explicitly teach the bounded forms
  `ik heb`, `jij hebt`, `hij/zij/het heeft`, and `wij/jullie/zij hebben` in
  notices and controlled practice without demanding uncued full-paradigm
  production.
- Use form progress as the primary learner-facing metric: one target-form slot
  per declared target form when that journey has evidence. Derive the
  denominator from the pack's canonical form records. Show journey completion
  separately and never conflate the two metrics.
- Compare common `hebben` and selected `zijn` perfect constructions only at the
  practical auxiliary-selection boundary. Do not build a broad auxiliary
  course.
- Use a small authored set of high-frequency cross-verb examples, including
  existing `werken` material and selected `zien`/`gaan` contrasts, without
  creating journeys for those verbs or teaching general participle formation.
- Include the complete eight-form Dutch map and twelve-pattern English
  comparison. Explain meaning-preserving everyday Dutch and mismatches rather
  than asserting one-to-one English/Dutch tense equivalence.
- Keep the A0/Pre-A1 through A2 foundation progression. Journeys 5 and 6 are
  lower-priority A2 material but remain fully playable and must not become
  placeholder or dead-end content.
- Reuse the established Feature 015/016 interaction contract. No new
  clickable prototype is needed unless later discovery identifies a materially
  different interaction.
- Do not add audio, runtime AI grading or generation, a second scheduler,
  mastery model, evidence store, verb-specific UI framework, or speculative
  Saved-to-`hebben` resolver. Existing ambiguous Saved items remain unchanged.

## Journey matrix

| Journey | Learner decision | Target scope | Priority |
| --- | --- | --- | --- |
| What I have and what is available | Recognise and construct present `heb`/`hebt`/`heeft`/`hebben` for possession, relationships, and availability. | OTT | Core A0/A1 |
| What I feel, need, and have time for | Choose high-value present `hebben` expressions and question/inversion forms in everyday situations. | OTT plus bounded person/inversion contrasts | Core A1 |
| What I had | Distinguish past possession and background states with `had`/`hadden`. | OVT | Core A1/A2 |
| What I have had | Use lexical `heb/heeft gehad` for completed experiences or states. | VTT | Core A2 |
| What I have done | Construct and recognise common perfect phrases using auxiliary `hebben`, with selected `hebben`/`zijn` contrasts. | VTT auxiliary construction | Core A2 |
| What I will or would have | Interpret and control future/conditional possession and clearly labelled perfect variants. | OTTT, OVTT, VTTT, VVTT | Later A2 |

Every journey must receive a five-line story, notice, map or comparison
destination, five authored practice decisions, bounded repair, evidence, and a
completion return path. The matrix is a planning boundary; stable IDs,
highlight spans, skill IDs, story titles, and exact learner-facing content are
to be authored and qualified after the specification and ticket gates.

## Domain and architecture boundary

- Select the pack by stable verb identity through the additive multi-pack
  registry established by Feature 016.
- Preserve all existing `werken` and `zijn` pack IDs, evidence keys,
  migration/export/import records, and review behavior.
- Extend the existing content validator, deterministic practice evaluator,
  learning-record seam, typed background messages, Lessons/Today/Daily Five,
  popup navigation, map/comparison views, and accessibility patterns.
- Treat auxiliary examples as authored content owned by the `hebben` package;
  do not infer or generate cross-verb grammar at runtime.
- Use the existing Dutch/English/Telugu learning-triangle contract. Every
  learner-visible Dutch, English, and Telugu string requires separate language
  qualification before release.

## Deferred parking-lot item

Park **cross-verb auxiliary mini-course**: a broader course teaching auxiliary
`hebben` through many verbs and general participle formation. It is explicitly
out of scope for Feature 017 and is recorded in the canonical feature parking
lot with `017` provenance.

## Qualification gate

Before implementation, complete the Feature 017 authoring matrix and
qualification record for every journey, including:

- stable form, journey, story-line, target-span, skill, question, accepted
  answer, repair, feedback, and translation IDs;
- target-form progress contribution and denominator;
- allowed person scope and bounded inversion contrasts;
- Dutch review with fluent reviewer, date, and source provenance;
- independent English and Telugu meaning/clarity review;
- additive multi-pack and learner-history compatibility checks;
- deferred ideas that must not leak into the shipped package.

## Verification seams to take to `$to-spec`

1. The authored multi-pack validator and availability report: complete
   `hebben` eight-form/twelve-pattern coverage, stable IDs, target integrity,
   six complete journeys, person-scope rules, translations, and review metadata.
2. Pure journey and evaluator logic: one authored five-question set per
   journey, all five exercise families, deterministic accepted answers,
   bounded repairs, retry/reset behavior, and duplicate-token identity.
3. The existing learning-record and typed background boundary: additive
   `hebben` evidence, idempotency, stale-submission protection, migration
   atomicity, export/import compatibility, Daily Five eligibility, and
   preservation of `werken`, `zijn`, and unrelated records.
4. Existing popup and Lessons integration: three-verb directory, `hebben`
   overview, all journey routes, map/comparison focus, completion return,
   Today activity, accessibility, and narrow-popup containment.

Extend existing tests at these seams; do not create parallel infrastructure.

## Approval gates and delivery order

1. Commit this plan and the `017` parking-lot update.
2. Ask for explicit approval to invoke `$to-spec`. Only after approval create
   and publish `docs/features/017-hebben-journeys-spec.md`.
3. Review the specification and its proposed seams with the user.
4. Ask for explicit approval to invoke `$to-tickets`. Only after approval
   create and publish `docs/features/017-hebben-journeys-tickets.md` and the
   approved GitHub issue tree.
5. Implement tickets strictly against the checked-in specification, using the
   `author-verb-journeys` contract and the existing additive multi-pack seam.
6. Run content qualification, Dutch review, focused tests, typecheck, the full
   suite, build, manual popup QA, diff review, and the complete delivery
   handoff.

No specification, ticket document, issue tree, prototype, or implementation
work is authorized by this plan alone.
