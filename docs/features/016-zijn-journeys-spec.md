# Feature 016: `zijn` Verb Journeys

## Problem Statement

DutchMate learners need a reliable way to understand and use the irregular,
high-utility verb `zijn` (“to be”) across everyday identity, state, location,
questions, past experience, and future or conditional situations. A single
conjugation table does not show why `ben`, `bent`, `is`, `zijn`, `was`, and
`waren` differ, nor does it give learners a controlled route from noticing a
form to using it in a supported sentence.

The existing Verb Journey implementation proves the flow with `werken`, but
its content and runtime contracts are still specialized to one verb. Adding
`zijn` must therefore solve two problems together: teach a verb whose
high-value meaning requires bounded person contrasts, and generalize the
existing Verb Journey seams without changing `werken` identifiers, evidence,
export/import data, or learner history.

The feature must improve recognition and controlled application within
DutchMate's Foundation progression from A0/Pre-A1 through A2. It must not
claim uncued written production, formal CEFR certification, complete mastery
of the full conjugation paradigm, or safe classification of ambiguous Saved
text.

## Solution

Improve the reusable `author-verb-journeys` skill with verb-agnostic authoring
gates, a per-journey authoring matrix, explicit Dutch/English/Telugu
qualification, configurable person scope, and additive multi-pack/history
checks. Validate, commit, and install the revised skill across the machine's
built-in agent targets before authoring the package.

Add `zijn` as a second versioned Verb Journey pack inside the existing Lessons
surface. The runtime selects packs by stable verb identity and reuses the
existing deterministic practice, Verb Journey evidence, Daily Five, popup,
accessibility, and migration contracts. Existing `werken` identifiers and
records remain valid.

The `zijn` pack contains the canonical eight-form Dutch Verb Map and twelve
English comparison records. It provides six complete, playable journeys:

1. `ben / bent / is / zijn` for identity, state, and description (A0/A1
   core).
2. Present-tense questions and inversion such as `ben je?`, `is het?`, and
   `zijn we?` (A1 core).
3. `was / waren` for past states and locations (A1/A2 core).
4. `ben geweest / is geweest` for past experience or being somewhere (A2
   core).
5. `zal zijn / zou zijn` for future plans and conditional possibilities (A2
   later).
6. `was geweest / zal geweest zijn / zou geweest zijn` as an advanced
   reference journey.

Every journey has a coherent primarily first-person story, a bounded
mixed-person notice or practice contrast where needed, five authored core
decisions, at most two targeted repairs, evidence-bearing results, completion,
and a usable return path. Later and reference labels affect progression
priority only; they never create placeholder content or a dead end.

The package teaches `zijn` as the main/copular verb, including forms meaning
“have been” and “had been.” Teaching `zijn` as an auxiliary for other verbs,
creating a new prototype, and resolving ambiguous one-word Saved entries are
deferred to the canonical parking lot.

## User Stories

1. As a DutchMate learner, I want to find Verb Journeys inside Lessons, so that I can learn `zijn` without entering a new top-level product area.
2. As a learner, I want Today, Lessons, Saved, and Options to remain recognizable, so that adding `zijn` does not make DutchMate feel like a different product.
3. As a learner, I want to see both `werken` and `zijn` in the Verb Journeys directory, so that I can choose the verb I want to study.
4. As a learner, I want `zijn` to appear as a numbered verb entry after `werken`, so that the directory has stable navigation without implying a locked curriculum.
5. As a learner, I want the `zijn` entry to explain that it means “to be,” so that I know what the package teaches.
6. As a learner, I want the `zijn` overview to show its irregular character, so that I do not apply a regular weak-verb rule.
7. As a learner, I want to see which `zijn` journey is next, current, later, or reference, so that I can choose an honest next action.
8. As a learner, I want later and reference journeys to remain selectable, so that I can inspect or practise them without a misleading lock.
9. As a learner, I want the overview to summarize demonstrated `zijn` skills separately from journey completion, so that I do not mistake finishing a screen flow for mastering the verb.
10. As a learner, I want each journey to show a practical goal, so that I understand the meaning before studying the form.
11. As a learner, I want the first journey to teach `ben`, `bent`, `is`, and `zijn` through identity, state, and description, so that I can handle common present-tense statements.
12. As a learner, I want the second journey to teach present-tense questions and inversion, so that I can recognize and form questions such as `ben je?`.
13. As a learner, I want the third journey to teach `was` and `waren`, so that I can describe past states and locations.
14. As a learner, I want the fourth journey to teach `ben geweest` and related forms, so that I can talk about having been somewhere or having had an experience.
15. As a learner, I want the fifth journey to contrast `zal zijn` and `zou zijn`, so that I can distinguish a future plan from a conditional possibility.
16. As a learner, I want the sixth journey to expose advanced completed and hypothetical forms, so that I can recognize them when reading without being told they are beginner requirements.
17. As a learner, I want every `zijn` journey to have complete content, so that a later or reference label never leads to placeholder copy.
18. As a learner, I want each story to use a coherent everyday situation, so that the target form has a meaningful context.
19. As a learner, I want stories to remain primarily first-person, so that the journey has a stable learner viewpoint.
20. As a learner, I want a bounded comparison with other high-value persons when the verb requires it, so that `ben`, `bent`, `is`, and `zijn` do not appear arbitrary.
21. As a learner, I want the package to avoid silently teaching every person in every story, so that the learning target remains manageable.
22. As an English-speaking learner, I want reviewed English story support, so that I can understand the situation without replacing the Dutch task.
23. As a Telugu-speaking learner, I want reviewed Telugu story support, so that the learning triangle remains available in the new package.
24. As a learner, I want Dutch story text to remain primary, so that I am learning Dutch rather than reading a translated lesson.
25. As a learner, I want every highlighted target span to occur literally in the Dutch story line, so that highlighting never points to an absent form.
26. As a learner, I want target highlights to be identifiable without relying on color alone, so that the noticing task remains accessible.
27. As a learner, I want a notice screen after each story, so that I actively connect the situation to the form.
28. As a learner, I want the notice to compare a correct form with a plausible alternative, so that it teaches a specific contrast.
29. As a learner, I want the notice to explain why `ben`, `bent`, `is`, or `zijn` fits the subject, so that I can reuse the decision.
30. As a learner, I want the notice to explain inversion after a question prompt, so that `ben je?` is not presented as an unexplained exception.
31. As a learner, I want immediate reviewed feedback after a notice choice, so that a mistake teaches one useful next step.
32. As a learner, I want to place the noticed form on the shared Verb Map, so that I connect a context to the complete reference.
33. As a learner, I want the same eight-form Verb Map for `zijn` across all journeys, so that the reference has stable meaning.
34. As a learner, I want all eight Dutch viewpoints represented, so that I can inspect present, past, future, and future-from-past forms.
35. As a learner, I want each map form to show its Dutch full name, example, natural English meaning, practical meaning, formula, common use, A0-A2 or reference level, and teaching priority, so that the map is useful beyond an abbreviation table.
36. As a learner, I want the map to highlight the current journey form, so that reference browsing remains connected to the activity.
37. As a learner, I want the map to remain readable at popup width, so that pairing onvoltooid and voltooid forms does not create horizontal overflow.
38. As a learner, I want a dense form to have a focused detail view, so that I can inspect it without losing the journey.
39. As a learner, I want to compare twelve English tense patterns with natural Dutch, so that I do not assume one-to-one English/Dutch tense conversion.
40. As a learner, I want English comparisons grouped into Present, Past, and Future, so that the reference is navigable.
41. As a learner, I want each English comparison to show the situation first, so that meaning guides the comparison.
42. As a learner, I want each comparison to show meaning-preserving Dutch, so that I learn what Dutch would communicate in that situation.
43. As a learner, I want each comparison to show common everyday Dutch, so that I learn natural usage rather than only an analytical equivalent.
44. As a learner, I want each comparison to identify the Dutch form or construction, so that I can connect it to the Verb Map.
45. As a learner, I want a mismatch note for each comparison, so that I understand where English and Dutch organize meaning differently.
46. As a learner, I want multiple English patterns to be allowed to map to one Dutch form plus context, so that the comparison does not teach false tense equivalence.
47. As a learner, I want to return from the map or comparison to the active journey, so that reference browsing does not lose my position.
48. As a learner, I want each journey to offer a meaning-recognition decision, so that I practise understanding `zijn` in context.
49. As a learner, I want each journey to offer controlled construction, so that I practise assembling a supported phrase without typing.
50. As a learner, I want each journey to offer a natural translation or conversational choice, so that I practise everyday Dutch usage.
51. As a learner, I want each journey to offer Verb Map placement, so that form recognition is tied to the shared reference.
52. As a learner, I want each journey to offer delayed or recombined word order, so that I practise applying the form after support is reduced.
53. As a keyboard-only learner, I want every choice, token, slot, map cell, reset, check, retry, and next action to be keyboard-operable, so that the journey is complete without a pointer.
54. As a learner, I want selected tokens to preserve their occurrence identity, so that duplicate words such as `ik` or `zijn` can be used correctly.
55. As a learner, I want to remove a selected token by its occurrence, so that correcting a duplicate-token sentence does not remove the wrong copy.
56. As a learner, I want the five core questions to remain bounded, so that a journey fits the intended short-session time budget.
57. As a learner, I want an incorrect answer to produce one relevant rule or misconception, so that feedback is actionable.
58. As a learner, I want at most two targeted repair questions after an incorrect path, so that remediation does not become an unbounded quiz.
59. As a learner, I want retry and reset controls to work after an incorrect answer, so that I can make a deliberate second attempt.
60. As a learner, I want only authored accepted alternatives to be accepted, so that valid variation is respected without fuzzy grading.
61. As a learner, I want completion to report demonstrated skills and remaining practice needs separately, so that it does not overclaim mastery.
62. As a learner, I want later and reference journey results to use the same evidence meaning as core results, so that the package does not create a second progress model.
63. As a learner, I want evidence to record the form or skill and exercise family, so that recognizing `is` is not confused with constructing `ben geweest`.
64. As a learner, I want evidence from `zijn` to survive popup and extension restarts, so that a short session is not lost.
65. As a learner, I want compatible extension updates to preserve existing `werken` evidence and my other learning records, so that adding `zijn` does not reset history.
66. As a learner, I want an incompatible content update to migrate explicitly and atomically, so that a failed migration leaves my prior record readable.
67. As a learner, I want due or weak `zijn` skills to enter the existing Today/Daily Five path, so that I do not manage another review queue.
68. As a learner, I want the existing Daily Five vocabulary protection and grammar cap to remain in force, so that `zijn` does not crowd out other review.
69. As a learner, I want a Today task to identify the `zijn` verb and skill without showing an unfinished answer, so that Today remains calm and scannable.
70. As a learner, I want existing `werken` journeys and Saved behavior to keep working, so that the new pack is additive.
71. As a learner, I want ambiguous Saved entries such as `is`, `was`, or `zijn` to remain unchanged, so that DutchMate does not send me to an incorrect verb journey.
72. As a learner, I want the feature to work without a runtime LLM, network-dependent grading, or runtime translation, so that it remains private, predictable, and offline-compatible.
73. As a lesson author, I want stable `zijn` pack, form, journey, skill, exercise, and target identifiers, so that content edits do not silently re-key progress.
74. As a lesson author, I want the validator to prove both packs can coexist, so that adding a verb does not rely on a hidden singleton assumption.
75. As a lesson author, I want the validator to reject missing forms, dangling targets, invalid highlights, missing translations, incomplete notices, and incomplete journeys, so that incomplete content cannot ship.
76. As a lesson author, I want a per-journey matrix connecting meaning, forms, person scope, practice decisions, evidence, and review status, so that future authors do not clone `werken` assumptions.
77. As a lesson author, I want Dutch learner-facing content independently reviewed, so that structural tests are not mistaken for linguistic approval.
78. As a lesson author, I want English and Telugu support checked for meaning and clarity, so that non-empty translations are not treated as sufficient.
79. As a lesson author, I want deferred ideas recorded in the feature parking lot, so that auxiliary teaching, prototypes, and ambiguous Saved resolution do not leak into this package.
80. As a maintainer, I want the shared practice, persistence, Daily Five, popup, and accessibility contracts reused, so that adding a verb does not create parallel infrastructure.
81. As a maintainer, I want `werken` identifiers and history to remain valid after the registry generalization, so that existing learners receive an additive update.
82. As a maintainer, I want the updated authoring skill installed across all supported local agent targets, so that future verb packages use the same qualification and compatibility gates.
83. As a maintainer, I want the skill to distinguish reusable rules from `werken`-specific examples, so that a second verb receives tailored pedagogy.
84. As a maintainer, I want a fresh agent session to be enough to discover the updated skill after installation, so that skill metadata changes do not require hidden manual copying.
85. As a product owner, I want all six `zijn` journeys to be complete and playable, so that the package delivers a real second verb rather than a directory placeholder.
86. As a product owner, I want the package to remain within A0/Pre-A1 through A2, so that it does not expand DutchMate's product promise.
87. As a product owner, I want `zijn` as an auxiliary for other verbs explicitly deferred, so that its grammar boundary remains teachable and owned by the relevant verb package.
88. As a product owner, I want a new prototype explicitly deferred, so that implementation and QA focus on the proven popup interaction contract.

## Implementation Decisions

- Keep the existing `VerbJourneyPack` data concepts and content/schema
  versioning, but allow an additive registry of packs selected by stable verb
  identity. Preserve the existing `werken` pack's identifiers, content
  version, evidence keys, export/import representation, and behavior.
- Add a versioned irregular `zijn` pack with stable lowercase identifiers,
  separate `zijn` skill and exercise identifiers, and content version `016-1`.
- Keep the canonical eight Dutch form codes: OTT, VTT, OVT, VVT, OTTT, VTTT,
  OVTT, and VVTT. Each record includes Dutch full name, viewpoint,
  onvoltooid/voltooid completion, example, natural English, practical meaning,
  formula, common usage, level, and teaching priority.
- Add twelve English comparison records in four present, four past, and four
  future groups. Each record explains the English situation, meaning-preserving
  Dutch, common everyday Dutch, Dutch form or construction, and mismatch or
  usage note. The data must not assert one-to-one English/Dutch tense mapping.
- Author six journeys in a stable order: four core journeys, one later
  journey, and one reference journey. Every journey has a five-line story,
  English and Telugu support, target spans, notice, learning goal, map or
  comparison destination, five core questions, bounded repairs, evidence path,
  completion, and return navigation.
- Keep stories primarily first-person but record a bounded allowed-person
  scope for the explicit `ben`/`bent`/`is`/`zijn` and inversion comparisons.
  Do not infer or claim full paradigm production.
- Teach `zijn` as the main/copular verb. `ben geweest`, `was geweest`, and
  related forms refer to being or having been; auxiliary constructions for
  other lexical verbs are not part of this pack.
- Reuse the five existing exercise families: meaning recognition, controlled
  construction, natural translation or conversational choice, Verb Map
  placement, and delayed/recombined word order. Each journey owns its own
  question bank and cannot fall through to another journey.
- Keep retry/reset, duplicate-token identity, selected-token order, accepted
  alternatives, and repair caps deterministic and compatible with the current
  practice controls.
- Route demonstrated `zijn` results through the existing typed background and
  local learning-record boundary. Evidence remains content-versioned,
  additive when compatible, idempotent, stale-submission protected, and
  separate from lesson completion and ordinary Pattern progress.
- Add `zijn` review tasks to the existing Daily Five grammar pool without a
  second scheduler, queue, mastery model, or learner-facing destination.
- Extend the Lessons Verb Journeys directory and existing popup screens to
  select and render both packs. Preserve current bottom navigation, keyboard
  behavior, focus announcements, design tokens, narrow-layout containment,
  Today entry, and `werken` behavior.
- Do not add direct Saved-to-`zijn` resolution. Ambiguous one-word Saved
  entries remain unchanged and do not open a guessed map or practice route.
- Update the external authoring skill with the reusable authoring matrix,
  qualification gate, person-scope rule, complete later/reference rule, and
  multi-pack/history compatibility rule. Install the committed skill source
  across the supported local agent targets and require fresh sessions for
  metadata re-indexing.
- Use existing content, practice, learning, popup, migration, Daily Five,
  accessibility, and build seams. Do not add a clickable prototype in this
  feature.

## Testing Decisions

- Test externally observable behavior at the highest existing seam. Prefer
  pack validation, pure practice evaluation, the existing learning-record and
  typed background boundary, and popup integration over implementation-detail
  tests.
- Extend the Feature 015 content and qualification test patterns to validate
  two packs, exact eight-form/twelve-comparison coverage, stable IDs, six
  complete `zijn` journeys, five story lines per journey, bounded person
  scope, target spans, English/Telugu support, notices, and no incomplete
  later/reference content.
- Extend pure practice tests to prove every `zijn` journey returns its own
  five-question set, all five exercise families are covered, accepted answers
  are deterministic, repairs stay capped, retry/reset works, and duplicate
  token occurrences remain distinct.
- Extend learning and background tests to prove additive `zijn` evidence,
  idempotent results, stale revision rejection, migration atomicity,
  export/import compatibility, preservation of existing `werken` records, and
  Daily Five due/weak selection under the existing grammar cap.
- Extend popup integration tests to prove the two-verb directory, `zijn`
  overview, all six journey routes, story-to-notice-to-map/practice flow,
  map/comparison return behavior, completion return, Today activity,
  keyboard/focus behavior, announcements, no Saved guessing, and narrow
  containment.
- Use prior Feature 015 content, practice, qualification, learning, popup,
  migration, accessibility, and build checks as regression coverage rather
  than creating a parallel test framework.
- Treat automated structural validation as necessary but insufficient for
  public language content. Record independent fluent-Dutch review with
  reviewer, date, and sources, plus English/Telugu clarity checks.
- Run focused tests first, then the existing popup suite, typecheck, full test
  suite, build/package checks, and whitespace/documentation checks. Perform
  manual extension QA for an incorrect answer, retry/reset, a non-default
  journey, the later/reference journeys, mixed-person `zijn` choices,
  duplicate tokens, map/comparison return, completion return, Today, and
  narrow popup layout.

## Out of Scope

- Teaching `zijn` as an auxiliary for other verbs, including constructions
  such as `is gegaan`.
- Direct Saved-to-`zijn` resolution for ambiguous one-word entries.
- A new clickable prototype or a replacement popup design.
- Audio, listening, speech, pronunciation feedback, or media curriculum.
- Typed answers, free-form production, arbitrary parsing, runtime translation,
  runtime LLM calls, network-dependent grading, or fuzzy acceptance.
- A new scheduler, queue, mastery model, evidence store, Verb Journey tab, or
  verb-specific UI framework.
- Resetting, re-keying, silently regrading, or replacing existing `werken`
  content and learner history.
- A full conjugation-paradigm course, formal CEFR certification, or product
  scope beyond the A0/Pre-A1 through A2 Foundation progression.
- Cross-activity universal Continue, unless the existing safe resume contract
  is independently changed and approved in a later feature.

## Further Notes

- Feature code is `016-zijn-journeys`; codename and branch are
  `zijn-journeys` and `016-zijn-journeys`.
- The approved plan is `docs/features/016-zijn-journeys-plan.md` and the
  accepted architecture boundary is ADR 0009.
- Deferred auxiliary teaching, a new prototype, and ambiguous Saved
  resolution are recorded in the canonical feature parking lot.
- `$to-tickets` remains a separate approval gate after this specification is
  reviewed. No implementation ticket is implied by this document alone.
