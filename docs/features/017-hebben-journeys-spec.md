# Feature 017: `hebben` Verb Journeys

## Problem Statement

DutchMate learners need to use `hebben` in ordinary Dutch, but a conjugation
table alone does not explain the learner decisions the verb carries. A learner
must distinguish possession, availability, common `hebben` expressions, past
states, completed experiences, and the auxiliary role in perfect phrases.

English also encourages misleading one-to-one tense assumptions. A learner may
translate every English “have” or past construction into the same Dutch form,
miss the subject-dependent forms `heb`, `hebt`, `heeft`, and `hebben`, or treat
`hebben` and `zijn` as interchangeable auxiliaries. The existing Verb Journey
surface needs a third verb package that teaches these decisions without
resetting `werken` or `zijn` history and without creating a new grammar system.

## Solution

Add an authored, versioned `hebben` Verb Journey pack to the existing additive
multi-pack registry. The pack uses six complete, playable journeys organized
around learner meanings rather than one lesson per grammatical form:

1. What I have and what is available.
2. What I feel, need, and have time for.
3. What I had.
4. What I have had.
5. What I have done.
6. What I will or would have.

The package teaches the main verb and a bounded auxiliary role. Auxiliary
teaching includes authored examples and a practical selection boundary against
selected `zijn` constructions, but does not become a general perfect-tense or
participle course.

Every journey follows the existing complete path: first-person story, noticing
and choice, shared eight-form Dutch Verb Map or English comparison, five
deterministic practice decisions, at most two targeted repairs, evidence,
completion, and return to the journey list. Lower-priority A2 material remains
fully playable rather than becoming placeholder or locked content.

The canonical eight-form map and twelve-pattern English comparison remain
available for `hebben`. They teach meaning-preserving everyday Dutch and
explicit mismatches, not one-to-one English/Dutch tense equivalence. Form
progress remains separate from journey completion and is derived from the
pack's canonical form records.

## User Stories

1. As a Dutch learner, I want `hebben` to appear as a distinct verb entry, so that I can study it without confusing it with `werken` or `zijn`.
2. As a Dutch learner, I want the entry to explain that `hebben` means “to have,” so that I understand the package's central meaning.
3. As a Dutch learner, I want the entry to identify `hebben` as irregular, so that I do not apply a regular weak-verb rule.
4. As a Dutch learner, I want the entry to show its A0/A1-to-A2 progression, so that I understand which material is foundational and which is advanced.
5. As a Dutch learner, I want six numbered journeys, so that I have a manageable route through the verb's most useful decisions.
6. As a Dutch learner, I want the journey numbers to remain visible after completion, so that completion does not erase the package structure.
7. As a Dutch learner, I want a separate completion marker, so that completion is not confused with the journey number or progress count.
8. As a Dutch learner, I want the first journey to teach present `heb`, `hebt`, `heeft`, and `hebben`, so that I can describe possession and availability.
9. As a Dutch learner, I want the first journey to include relationships and ordinary possessions, so that `hebben` is grounded in useful daily situations.
10. As a Dutch learner, I want the second journey to teach common expressions such as having a feeling, need, or amount of time, so that I can use `hebben` beyond literal possession.
11. As a Dutch learner, I want the second journey to include bounded present-tense question and inversion practice, so that I can understand forms such as `heb je?` and `heeft hij?`.
12. As a Dutch learner, I want the third journey to teach `had` and `hadden`, so that I can describe past possession and background states.
13. As a Dutch learner, I want the fourth journey to teach lexical `heb gehad` and related forms, so that I can describe a completed experience or state.
14. As a Dutch learner, I want the fifth journey to teach common perfect phrases with auxiliary `hebben`, so that I can recognise and construct phrases such as `ik heb gewerkt`.
15. As a Dutch learner, I want the fifth journey to contrast selected `hebben` and `zijn` auxiliaries, so that I can make a practical auxiliary choice without taking a full auxiliary course.
16. As a Dutch learner, I want the sixth journey to teach future and conditional possession, so that I can understand `zal hebben` and `zou hebben` in context.
17. As a Dutch learner, I want advanced perfect variants in the sixth journey to be labelled clearly, so that I can inspect them without mistaking them for beginner requirements.
18. As a Dutch learner, I want all six journeys to be playable, so that a later label changes priority rather than hiding functionality.
19. As a Dutch learner, I want every journey to state a practical learning goal, so that I know which decision I am practising.
20. As a Dutch learner, I want each journey to begin with a short coherent first-person story, so that the target form has a meaningful situation.
21. As a Dutch learner, I want the stories to remain primarily first-person, so that the learner viewpoint stays consistent.
22. As a Dutch learner, I want bounded person contrasts for `heb`, `hebt`, `heeft`, and `hebben`, so that the forms are understandable without requiring uncued full-paradigm production.
23. As an English-speaking learner, I want natural English story support, so that I can understand the situation without replacing the Dutch task.
24. As a Telugu-speaking learner, I want clear Telugu story support, so that the learning triangle remains available for the new verb.
25. As a Dutch learner, I want Dutch story text to remain primary, so that translations support rather than replace Dutch learning.
26. As a Dutch learner, I want every story to contain exactly the authored number of lines, so that stories stay short and predictable.
27. As a Dutch learner, I want every highlighted target span to occur literally in its Dutch line, so that noticing feedback is trustworthy.
28. As a Dutch learner, I want target highlights to be understandable without relying on color alone, so that the noticing task remains accessible.
29. As a Dutch learner, I want a notice step after each story, so that I actively connect meaning and form.
30. As a Dutch learner, I want each notice to compare the current form with a nearby meaningful contrast, so that feedback teaches a decision rather than a label.
31. As a Dutch learner, I want each notice to explain the formula and formula note, so that I can reuse the pattern in another sentence.
32. As a Dutch learner, I want each notice to identify the valuable contrast explicitly, so that I understand when a different form or construction would be more natural.
33. As a Dutch learner, I want a choice and immediate reviewed feedback in the notice, so that a mistake remains instructive.
34. As a Dutch learner, I want to place the noticed form on the shared Verb Map, so that a story connects to the complete reference.
35. As a Dutch learner, I want the same eight-form map for `hebben`, so that reference navigation remains stable across verb packages.
36. As a Dutch learner, I want the map to show all present, past, future, and future-from-past viewpoints, so that I can inspect advanced forms without a separate destination.
37. As a Dutch learner, I want each map form to show its Dutch name, example, natural English, practical meaning, formula, common usage, level, and teaching priority, so that the map is useful beyond abbreviations.
38. As a Dutch learner, I want the current journey form highlighted on the map, so that reference browsing remains connected to the activity.
39. As a Dutch learner, I want the map to fit the popup width, so that the two viewpoint columns remain usable on a narrow extension surface.
40. As a Dutch learner, I want a focused detail view for a dense form, so that I can inspect it without losing my journey.
41. As an English-speaking learner, I want twelve English tense-pattern comparisons, so that I can see how English meanings map to natural Dutch.
42. As a Dutch learner, I want comparisons grouped into Present, Past, and Future, so that the reference is easy to scan.
43. As a Dutch learner, I want each comparison to show the situation, so that meaning comes before terminology.
44. As a Dutch learner, I want each comparison to show meaning-preserving Dutch, so that I learn what Dutch communicates in that situation.
45. As a Dutch learner, I want each comparison to show common everyday Dutch, so that I learn natural usage rather than only an analytical equivalent.
46. As a Dutch learner, I want each comparison to identify the Dutch form or construction, so that I can connect it to the map.
47. As a Dutch learner, I want a mismatch note for every comparison, so that I understand where English and Dutch organize meaning differently.
48. As a Dutch learner, I want multiple English patterns to be able to map to one Dutch form plus context, so that the comparison does not teach false tense equivalence.
49. As a Dutch learner, I want to return from the map or comparison to the active journey, so that reference browsing does not lose my place.
50. As a Dutch learner, I want each journey to test meaning or situation recognition, so that I practise understanding `hebben` in context.
51. As a Dutch learner, I want each journey to test controlled construction, so that I practise assembling a supported phrase without typing.
52. As a Dutch learner, I want each journey to test the most natural translation or conversational choice, so that I practise everyday Dutch usage.
53. As a Dutch learner, I want each journey to test placement on the Dutch form map, so that form recognition is tied to the shared reference.
54. As a Dutch learner, I want each journey to test delayed or recombined word order, so that I practise after some support is removed.
55. As a keyboard-only learner, I want every choice, token, slot, map cell, retry, reset, and completion action to be keyboard-operable, so that the full journey works without a pointer.
56. As a Dutch learner, I want duplicate token occurrences to remain distinct, so that sentences containing repeated words can be built correctly.
57. As a Dutch learner, I want token removal to remove the selected occurrence by identity, so that correcting a sentence with duplicate tokens does not remove the wrong copy.
58. As a Dutch learner, I want five bounded core questions per journey, so that a practice run remains a short session.
59. As a Dutch learner, I want incorrect answers to produce one relevant explanation, so that feedback is actionable rather than overwhelming.
60. As a Dutch learner, I want no more than two targeted repair questions after an incorrect path, so that remediation remains bounded.
61. As a Dutch learner, I want retry and reset controls to work after an incorrect answer, so that I can make a deliberate second attempt.
62. As a Dutch learner, I want only authored accepted alternatives to be accepted, so that valid variation is respected without fuzzy grading.
63. As a Dutch learner, I want completion to report demonstrated skills separately from lesson completion, so that DutchMate does not overclaim mastery.
64. As a Dutch learner, I want `hebben` evidence to record the form or usage skill and exercise family, so that possession recognition is not confused with auxiliary construction.
65. As a Dutch learner, I want evidence to survive popup and extension restarts, so that a short practice session is not lost.
66. As a Dutch learner, I want a compatible extension update to preserve my existing `werken` and `zijn` evidence, so that adding `hebben` is additive.
67. As a Dutch learner, I want an incompatible content update to migrate explicitly and atomically, so that a failed migration leaves my previous record readable.
68. As a Dutch learner, I want due or weak `hebben` skills to use the existing Today/Daily Five path, so that I do not manage another review queue.
69. As a Dutch learner, I want the existing Daily Five vocabulary protection and grammar cap to remain in force, so that `hebben` does not crowd out other review.
70. As a Dutch learner, I want a Today item to identify the `hebben` verb and skill without showing an unfinished answer, so that Today remains calm and scannable.
71. As a Dutch learner, I want existing `werken` and `zijn` journeys to continue working, so that the third pack does not regress earlier packages.
72. As a Dutch learner, I want ambiguous Saved entries to remain unchanged, so that DutchMate does not guess the wrong `hebben` destination.
73. As a Dutch learner, I want the feature to work without runtime network calls, so that the authored learning loop remains private and predictable.
74. As a lesson author, I want stable `hebben` pack, form, journey, skill, exercise, and target identifiers, so that content edits do not silently re-key progress.
75. As a lesson author, I want the validator to prove that three packs coexist, so that adding a verb does not rely on a hidden singleton.
76. As a lesson author, I want validation to reject missing forms, dangling targets, invalid highlights, missing translations, incomplete notices, and incomplete journeys, so that unfinished content cannot ship.
77. As a lesson author, I want a per-journey authoring matrix connecting meaning, forms, person scope, practice, evidence, and review status, so that future packages are authored deliberately.
78. As a lesson author, I want independent fluent-Dutch review recorded for every learner-visible Dutch string, so that structural tests are not mistaken for language approval.
79. As a lesson author, I want English and Telugu support checked for meaning and clarity, so that non-empty translations are not treated as sufficient.
80. As a lesson author, I want deferred ideas recorded in the feature parking lot, so that the cross-verb auxiliary course does not leak into this package.
81. As a maintainer, I want the existing practice, learning, Daily Five, popup, and accessibility contracts reused, so that the new pack does not create parallel infrastructure.
82. As a maintainer, I want compatible `hebben` content updates to preserve evidence, so that content versioning remains safe for learners.
83. As a product owner, I want the package to remain within the A0/Pre-A1 through A2 foundation progression, so that Feature 017 does not expand DutchMate's product promise.

## Implementation Decisions

- Add a versioned irregular `hebben` pack to the additive multi-pack registry,
  selected by stable verb identity. Preserve the existing `werken` and `zijn`
  pack identifiers, content versions, evidence keys, export/import records,
  and review semantics.
- Use the existing `VerbJourneyPack` concepts and content/schema versioning.
  The `hebben` pack must have stable lowercase identifiers for its verb, eight
  forms, twelve comparisons, six journeys, story lines, target spans, notices,
  skills, questions, repairs, and accepted alternatives.
- Supply the canonical eight Dutch forms: OTT, VTT, OVT, VVT, OTTT, VTTT,
  OVTT, and VVTT. Each record includes Dutch full name, viewpoint,
  onvoltooid/voltooid completion, example, natural English, practical meaning,
  formula, common usage, CEFR level, teaching priority, and display status.
- Supply twelve English comparison records grouped as four Present, four Past,
  and four Future patterns. Each record includes the situation,
  meaning-preserving Dutch, common everyday Dutch, the Dutch form or
  construction, and a mismatch or usage note. The records must not assert
  one-to-one English/Dutch tense conversion.
- Author six journeys in stable order. Journeys one through five cover present
  possession/availability, present expressions and inversion, past
  possession/background, lexical completed experience, and bounded auxiliary
  perfect construction. Journey six covers future/conditional possession and
  clearly labelled perfect variants. All six are complete and playable;
  journey six has later priority.
- Keep stories primarily first-person and record the allowed bounded
  person-scope contrasts for `heb`, `hebt`, `heeft`, and `hebben`. Notices and
  controlled practice may compare those forms, but the package must not claim
  uncued full-paradigm production.
- Teach `hebben` as both the main verb and a bounded auxiliary. The auxiliary
  journey may use a small authored set of high-frequency examples, including
  existing `werken` material and selected `zien`/`gaan` contrasts. It does not
  create journeys for those verbs or teach general participle formation.
- Compare selected `hebben` and `zijn` perfect constructions only at the
  practical auxiliary-selection boundary. Do not make this a broad auxiliary
  course.
- Require five story lines per journey, with Dutch, English, Telugu, stable
  line IDs, and literal target spans tied to journey skill IDs. Every journey
  requires a notice containing comparison, formula, formula note, valuable
  contrast, an explicit choice, and reviewed feedback.
- Route every journey to its own five-question authored set. The five core
  exercise families are meaning recognition, controlled construction, natural
  translation or conversational choice, form-map placement, and
  delayed/recombined word order. Repairs are authored and capped at two per
  incorrect path.
- Preserve deterministic answer evaluation, accepted alternatives, token
  occurrence identity, selected-token order, retry/reset behavior, and
  keyboard accessibility. Do not add typed answers, fuzzy grading, runtime
  generation, or runtime translation.
- Route demonstrated `hebben` results through the existing typed background and
  local learning-record boundary. Evidence remains additive when compatible,
  content-versioned, idempotent, stale-submission protected, and atomic on
  incompatible migration failure.
- Keep the learner-facing primary metric as form progress. A journey with
  evidence contributes one slot per declared target form; repeated journeys
  sharing a form count independently, and multi-form journeys contribute each
  target form. The denominator comes from canonical pack form records. Journey
  completion remains a separate displayed concept.
- Refresh the canonical persisted record after queued evidence writes, stale
  reconciliation, and completion before rendering overview, directory, Today,
  or Daily Five summaries.
- Add `hebben` to the existing Lessons Verb Journeys directory, verb overview,
  map/comparison views, completion return path, Today activity, and Daily Five
  review pool. Preserve bottom navigation, focus behavior, design tokens,
  narrow-popup containment, and all existing packs.
- Do not resolve ambiguous Saved entries to `hebben`. The existing Saved link
  behavior remains unchanged unless a future authored context contract makes
  lemma resolution safe.
- Do not create a clickable prototype. Feature 015/016 already establish the
  interaction contract, and Feature 017 has no approved materially different
  flow.
- Record the broad cross-verb auxiliary mini-course as deferred in the
  canonical feature parking lot. It is not an implementation requirement for
  this specification.

## Testing Decisions

- Test externally observable behavior at the highest stable existing seam.
  Prefer pack validation, pure practice evaluation, the learning-record and
  typed background boundary, Daily Five selection, and popup integration over
  implementation-detail tests.
- Extend content and qualification tests to prove the three-pack registry,
  exact eight-form and twelve-comparison coverage, stable IDs, six journey
  order, five story lines per journey, valid literal target spans, bounded
  person scope, complete English/Telugu support, complete notices, and no
  incomplete later material.
- Extend pure practice tests to prove every `hebben` journey returns its own
  five-question set, all five exercise families are covered, accepted answers
  are deterministic, repairs stay capped, retry/reset works, and duplicate
  token occurrences remain distinct.
- Extend progress tests to prove repeated target forms count independently,
  multi-form journeys contribute each declared target form, empty evidence
  contributes nothing, the denominator comes from canonical forms, and a
  future pack with a different journey shape does not use a hardcoded journey
  count.
- Extend learning and background tests to prove additive `hebben` evidence,
  idempotent results, stale revision rejection, migration atomicity,
  export/import compatibility, preservation of existing `werken` and `zijn`
  records, and Daily Five eligibility under the existing grammar cap.
- Extend popup integration tests to prove the three-verb directory, `hebben`
  overview, all six journey routes, story-to-notice-to-map/practice flow,
  map/comparison return behavior, completion return, Today activity,
  keyboard/focus behavior, no Saved guessing, no audio UI, and narrow
  containment.
- Test immediate post-completion refresh and independent progress for every
  pack. A successful local interaction must not be considered sufficient when
  a summary is still reading an older in-memory record.
- Treat structural validation as necessary but insufficient for public
  content. Record independent fluent-Dutch review with reviewer, date, and
  sources, plus separate English/Telugu meaning and clarity checks.
- Use the established Feature 015 and Feature 016 test patterns as prior art;
  do not create a parallel test framework.
- Run verification in this order: focused content/practice tests, the popup
  integration suite, typecheck, the full test suite, build, and whitespace
  checks. Manual extension QA must cover an incorrect answer, retry/reset, a
  non-default journey, the later journey, duplicate tokens, mixed-person
  `hebben` choices, auxiliary selection, map/comparison return, completion
  return, Today, and narrow popup layout.

## Out of Scope

- A broad cross-verb auxiliary or participle-formation course.
- New journeys for `werken`, `zien`, `gaan`, or any other example verb.
- Teaching `zijn` as a general auxiliary system beyond selected authored
  contrast examples.
- Direct Saved-to-`hebben` resolution for ambiguous one-word or context-poor
  entries.
- A new clickable prototype, popup redesign, or new top-level navigation tab.
- Audio, listening, speech, pronunciation feedback, or media curriculum.
- Typed answers, free-form production, arbitrary parsing, fuzzy grading,
  runtime translation, runtime LLM calls, or network-dependent grading.
- A second scheduler, queue, mastery model, evidence store, Verb Journey UI
  framework, or separate progress system.
- Resetting, re-keying, silently regrading, or replacing existing `werken` or
  `zijn` content and learner history.
- Formal CEFR certification, a full conjugation course, or product scope above
  the A0/Pre-A1 through A2 foundation progression.
- A universal cross-activity Continue change unless separately specified and
  approved.

## Further Notes

- Feature identity is `017-hebben-journeys`; codename and branch are
  `hebben-journeys` and `017-hebben-journeys`.
- The approved plan is the Feature 017 plan. This specification is the next
  canonical artifact and remains under `docs/features/`.
- The authoring matrix and learner-language qualification record must be
  completed before implementation and must not silently copy `werken` content.
- The additive multi-pack and history-preservation boundary from Feature 016
  remains authoritative.
- `$to-tickets` is a separate approval gate. This specification does not
  authorize ticket creation or implementation by itself.
