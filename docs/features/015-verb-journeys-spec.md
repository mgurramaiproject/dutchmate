# Feature 015: Verb Journeys

## Problem Statement

DutchMate learners encounter Dutch verbs in real pages and lessons, but an
isolated conjugation or a single saved form does not give them a reliable route
from recognition to controlled use. Learners who think through English may
assume that Dutch has a one-to-one equivalent for every English tense pattern,
confuse VTT and OVT, or recognise a participle without being able to construct
the complete phrase that uses it.

The existing DutchMate learning loop already provides curated lessons,
deterministic click-only grammar practice, local learning history, Today, and
Daily Five. It does not yet provide one stable verb-centered path that combines
a natural context, pattern noticing, a complete Dutch Verb Map, an English
comparison lens, finite practice, targeted remediation, and skill-granular
review.

The feature must improve useful recognition and controlled application without
claiming independent written production, formal CEFR attainment, or completion
of an entire verb paradigm. It must also preserve the existing Lessons, Today,
Saved, Options, heatmaps, navigation, visual language, local learning history,
offline behavior, and shared exercise contracts.

## Solution

Add Verb Journeys inside the existing Lessons library as an additive authored
verb pack, beginning with the regular weak verb `werken`. A learner can open a
`werken` overview, choose a staged journey, read a short first-person context,
notice the target meaning and form, inspect the canonical eight-form Verb Map,
compare all twelve English tense patterns with natural Dutch equivalents, and
complete a bounded set of click-, tap-, or keyboard-operated exercises.

The first slice contains six authored journeys: three core journeys and three
later/reference journeys:

- What I normally do — OTT, present situations and routines.
- What I completed — VTT, completed conversational events and results.
- How I worked before — OVT, past habits, story background, and connected
  past sequences.
- What had already happened — VVT, an earlier completed event before another
  past reference point.
- Plans and possibilities — OTTT and OVTT, explicit future plans and
  conditional possibilities.
- Completed future and unreal past — VTTT and VVTT, advanced completed
  results viewed from a future or hypothetical point.

The same `werken` destination displays all eight Dutch forms and all twelve
English comparison patterns. VVT, OTTT, OVTT, VTTT, and VVTT remain labeled as
later or reference material according to their teaching priority and do not
become beginner mastery gates, but each now has the same guided story, notice,
map, five-question practice, and completion flow as the core journeys.

Verb Journey progress is additive within DutchMate's existing local learning
record and is keyed by verb, form or skill, and exercise family. It does not
replace lesson completion or existing Pattern progress. Due and weak skills
feed the existing Daily Five grammar-task pool, preserving its vocabulary
protection and single-queue contract. Existing lesson-specific Continue
behavior remains unchanged in the first slice; Today receives a compact entry
through its current card pattern, while cross-activity universal Continue is
deferred until a safe shared resume descriptor exists.

All runtime content and correctness decisions are authored, validated,
deterministic, bundled, and provider-free. The revised clickable `werken`
mockup informs behavior and information architecture only. DutchMate's current
UI and design system remain the visual source of truth.

The approved prototype also establishes the interaction contract for the
popup: use the existing standard popup proportions, keep the content compact
at the top of each screen, retain Today, Lessons, and Saved as persistent
icon-labeled bottom tabs, and make every primary journey surface directly
clickable. The prototype contains no audio or listening control anywhere.

## User Stories

1. As a DutchMate learner, I want to find Verb Journeys inside Lessons, so that I can learn a verb without navigating to a new top-level product area.
2. As a learner, I want the existing Today, Lessons, Saved, and Options navigation to remain recognizable, so that the new feature does not make DutchMate feel like a different application.
3. As a learner, I want to open `werken` from the existing Lessons library, so that I can begin with a practical high-utility verb.
4. As a learner, I want to see whether a `werken` journey is not started, current, later, or reference, so that I can choose a meaningful next action.
5. As a learner, I want the `werken` destination to summarize my form or skill progress, so that I can understand where to continue without treating the verb as one completed item.
6. As a learner, I want to see the three core `werken` journeys in a useful order, so that the route moves from present routines to completed events and then past routines or stories.
7. As a learner, I want to choose a journey deliberately, so that progress does not silently branch or force an adaptive lesson path.
8. As a learner, I want the current journey to show a short goal, so that I know what practical meaning I am learning.
9. As a learner, I want the story to use first-person Dutch, so that one coherent subject makes the initial verb map easier to understand.
10. As a learner, I want the story to use ordinary A1/A2 vocabulary and a clear situation, so that the target verb form is not hidden behind unrelated difficulty.
11. As a learner, I want Dutch story text to remain primary, so that Dutch is still the learning language.
12. As a learner who benefits from English help, I want reviewed English support for story content, so that I can understand the situation without replacing the Dutch task.
13. As a Telugu-speaking learner, I want Telugu support where the existing lesson contract provides it, so that the new story flow remains accessible to DutchMate's first audience.
14. As a learner, I want highlighted target forms to be visually and programmatically identifiable, so that I can notice what changes without relying on color alone.
15. As a learner, I want one short noticing interaction after the story, so that I actively connect the situation to the target form.
16. As a learner, I want the noticing interaction to contrast the target meaning with a plausible alternative, so that the choice teaches a useful distinction.
17. As a learner, I want immediate authored feedback after a noticing decision, so that I understand why the selected form fits or does not fit.
18. As a learner, I want to place the noticed form on the canonical Verb Map, so that the form becomes part of a stable mental model.
19. As a learner, I want every `werken` journey to reuse one Verb Map, so that the map does not change meaning from journey to journey.
20. As a learner, I want the current journey's form highlighted in the Verb Map, so that I can connect the current activity to the complete reference.
21. As a learner, I want all eight Dutch forms visible, so that I can see how the system is complete even when only some forms are core practice.
22. As an A1 learner, I want advanced or uncommon forms labeled later or reference, so that I am not told I must master them now.
23. As a learner, I want each Dutch form to show its abbreviation and full Dutch name, so that the labels are learnable rather than opaque codes.
24. As a learner, I want each Dutch form to show a canonical Dutch sentence, so that a form is connected to use rather than only a table label.
25. As a learner, I want each Dutch form to show a natural English meaning and practical usage note, so that I do not infer meaning from the abbreviation alone.
26. As a learner, I want the map to explain that Dutch onvoltooid and voltooid do not map mechanically to English continuous and perfect, so that the reference does not teach a false equivalence.
27. As a learner, I want the map to preserve onvoltooid and voltooid pairing at narrow popup widths, so that responsive layout does not destroy the core comparison.
28. As a learner, I want to inspect one form's detail at a time when the map is dense, so that the reference remains readable in the popup.
29. As a learner, I want to open an English comparison view from the `werken` destination, so that I can use English tense knowledge as a comparison lens.
30. As a learner, I want all twelve English tense patterns represented, so that the comparison corrects incomplete one-to-one assumptions.
31. As a learner, I want the English patterns grouped into Present, Past, and Future sections, so that the comparison is navigable rather than one dense list.
32. As a learner, I want each English pattern to show an English example and situation, so that the comparison starts from meaning.
33. As a learner, I want each English pattern to show meaning-preserving Dutch, so that I learn what Dutch would communicate in that situation.
34. As a learner, I want each English pattern to show common everyday Dutch, so that I learn natural usage rather than only a formal analytical equivalent.
35. As a learner, I want the Dutch form or construction identified, so that I can connect the comparison to the Verb Map without forcing inaccurate labels.
36. As a learner, I want a concise mismatch or usage note, so that I understand why the English pattern and Dutch construction differ.
37. As a learner, I want several English patterns to be allowed to map to one Dutch form plus context or a time marker, so that the comparison reflects real Dutch usage.
38. As a learner, I want to return from the comparison without losing my journey position, so that reference browsing does not discard practice progress.
39. As a learner, I want every required exercise to use click, tap, or keyboard controls, so that I can practice without typing free-form Dutch.
40. As a keyboard-only learner, I want every choice, token, slot, map cell, reset, check, and next action to be keyboard-operable, so that the journey is complete without a pointer.
41. As a learner, I want the five core practice decisions to cover meaning, form construction, natural translation, map placement, and word order, so that a practice run tests more than recognition of a label.
42. As a learner, I want to choose the meaning that fits a Dutch sentence, so that I practice recognizing usage in context.
43. As a learner, I want to build a phrase such as `ik heb gewerkt` by tapping authored tokens into slots, so that I practice controlled construction without typing.
44. As a learner, I want to remove and revise a selected token before checking, so that correction remains an active learner action.
45. As a learner, I want to choose the most natural Dutch sentence for a stated English situation, so that the exercise teaches usage instead of claiming exact tense conversion.
46. As a learner, I want to place a sentence in the correct Verb Map cell, so that form recognition is tied to the canonical reference.
47. As a learner, I want to order tokens after a fronted time phrase, so that I practice Dutch verb-second word order in a controlled sentence.
48. As a learner, I want a checked answer to produce the same result every time, so that my progress does not depend on a probabilistic or network service.
49. As a learner, I want incorrect feedback to name one relevant rule or misconception, so that a mistake teaches a next step.
50. As a learner, I want correct feedback to confirm the meaning and form briefly, so that feedback does not become a second grammar lecture.
51. As a learner, I want only authored accepted alternatives to be accepted, so that valid variation is respected without fuzzy grading.
52. As a learner, I want an incorrect answer to offer at most one or two targeted repair questions, so that remediation is useful without becoming an unbounded loop.
53. As a learner, I want repair questions to target the skill associated with my supported error, so that remediation does not become unrelated extra practice.
54. As a learner, I want a practice run capped at five core questions plus at most two repairs, so that the session stays within the intended time budget.
55. As a learner, I want the completion view to report demonstrated skills and weak skills separately, so that one finished session does not overclaim mastery.
56. As a learner, I want journey completion to remain separate from Verb skill evidence, so that completing the flow does not imply I can independently produce every form.
57. As a learner, I want a skill to become demonstrated only after success across at least two relevant exercise families and a later delayed or recombined attempt, so that the progress claim reflects varied evidence.
58. As a learner, I want a later scored error to make a skill need practice again, so that progress can reflect new evidence honestly.
59. As a learner, I want `werken` progress keyed by form or skill and exercise family, so that recognizing `gewerkt` is not confused with constructing `heb gewerkt`.
60. As a learner, I want progress to survive popup or extension restart, so that a short session is not lost.
61. As a learner, I want compatible extension updates to preserve existing saved items, lesson progress, Pattern progress, rhythm, contrast evidence, and Verb Journey progress, so that releases do not reset learning history.
62. As a learner, I want a failed migration to leave my prior local record readable, so that new feature data cannot destroy existing learning history.
63. As a learner, I want a due or weak Verb Journey skill to appear through the existing Today/Daily Five path, so that I do not have to manage another review queue.
64. As a learner, I want Daily Five's existing vocabulary protection and grammar cap to remain in force, so that Verb Journeys do not crowd out saved-item review.
65. As a learner, I want the Today entry to show the verb, skill or form, and a compact action without previewing an unfinished exercise sentence, so that Today remains calm and scannable.
66. As a learner, I want existing lesson-specific Continue behavior to remain stable in the first slice, so that Verb Journeys do not force a risky cross-feature navigation refactor.
67. As a learner, I want Saved entries to connect to a verb only when DutchMate can reliably resolve their lemma and form, so that I do not receive an incorrect verb destination.
68. As a learner, I want the first slice to remain useful even when Saved-to-verb resolution is unavailable, so that external discovery is not required to finish a journey.
69. As a learner, I want the feature to work without a runtime LLM or network request, so that practice is private, fast, predictable, and offline-compatible.
70. As a learner, I want no new permission or remote code requirement, so that a grammar feature does not expand DutchMate's trust boundary unnecessarily.
71. As a learner, I want the existing Today heatmaps and activity semantics to remain intact, so that Verb Journey activity does not rewrite the meaning of the learning rhythm.
72. As a learner, I want existing Practical Stories, Grammar Packs, Saved review, Options, and ordinary review to keep working, so that the new feature is additive.
73. As a lesson author, I want one versioned `werken` pack with stable identifiers, so that content edits do not silently re-key progress.
74. As a lesson author, I want every journey, form, English comparison, exercise, skill, repair rule, and target span to be structurally validated, so that incomplete content cannot enter the runtime bundle.
75. As a lesson author, I want the content model to distinguish schema version from authored content version, so that structural migrations and content changes have different compatibility meanings.
76. As a lesson author, I want the first slice to support regular weak `werken` without prematurely forcing a generic conjugation engine, so that the implementation proves a real vertical slice before abstraction.
77. As a content reviewer, I want every accepted answer, alternative, distractor, feedback message, explanation, helper, and repair link enumerated, so that the complete learner experience can be reviewed.
78. As a content reviewer, I want distractors to represent plausible errors such as wrong auxiliary, missing participle, VTT/OVT confusion, and English-influenced word order, so that practice decisions are meaningful.
79. As a fluent Dutch reviewer, I want English tense mappings to distinguish common everyday Dutch from meaning-preserving analytical Dutch, so that the comparison is linguistically honest.
80. As a fluent Dutch reviewer, I want advanced forms clearly labeled as later or reference, so that the content does not impose an inappropriate beginner requirement.
81. As a maintainer, I want the existing Lessons catalog and lesson completion contract to remain stable, so that Verb Journeys do not corrupt or reinterpret existing lessons.
82. As a maintainer, I want Verb Journey data to use the existing local learning-record and background boundary, so that stale or malformed actions cannot mutate state directly.
83. As a maintainer, I want duplicate or stale submissions to be idempotent, so that retries and concurrent popup actions cannot award evidence twice.
84. As a maintainer, I want invalid content to fail before runtime use, so that a missing form, dangling reference, unsafe answer, or unbounded repair rule is caught during validation.
85. As a maintainer, I want the first implementation to use existing design tokens, buttons, cards, focus patterns, feedback announcements, and responsive conventions, so that unrelated screens do not change.
86. As a maintainer, I want tests to prove external behavior at high existing seams, so that the feature remains understandable and does not acquire a forest of implementation-coupled tests.
87. As a product owner, I want `werken` to prove the complete first slice before additional verbs are added, so that the product learns from one real content and runtime path.
88. As a product owner, I want expansion to `zijn`, `hebben`, `gaan`, `doen`, `wonen`, `komen`, and `willen` to wait until the `werken` slice is accepted, so that irregular and auxiliary verbs receive tailored treatment rather than cloned assumptions.
89. As a product owner, I want the feature to stay within the A0/Pre-A1 through A2 foundation progression, so that Verb Journeys do not expand DutchMate's current product promise.
90. As a product owner, I want the feature to improve real-world transfer rather than reward completion alone, so that the new surface supports DutchMate's browsing-to-fluency loop.
91. As a learner, I want Today, Lessons, and Saved to remain persistent bottom tabs, so that the popup retains a familiar mobile-app navigation model while I move through a Verb Journey.
92. As a learner, I want the popup to use the standard compact extension dimensions and reduced top spacing, so that the complete journey remains reviewable at popup width without unnecessary empty space.
93. As a learner, I want the Lessons, Verb Journeys, and `werken` overview screens to expose obvious card actions, so that I can understand what is clickable without guessing.
94. As a learner, I want every verb in the Verb Journeys list to have a stable visible number, so that I can refer to a verb consistently while reviewing the list.
95. As a learner, I want the journey to remain useful without audio, so that every task can be completed through text, icons, and click, tap, or keyboard controls.
96. As a learner, I want a rendering failure to leave a visible recovery entry point rather than an empty popup, so that I can still inspect the approved prototype and report feedback.

## Implementation Decisions

- The feature is an additive `VerbJourneyPack` content model exposed through
  the current Lessons library/category pattern. Existing `Lesson` identities,
  lesson stages, lesson completion, and practical-story content remain intact.
- The learner-facing `werken` destination contains a journey list, mastery or
  status summary, entry to one canonical eight-form Verb Map, and entry to the
  twelve-pattern English comparison. It is not a new top-level popup tab.
- The first content pack contains one verb, `werken`, with regular weak verb
  metadata, auxiliary `hebben`, all eight Dutch form records, all twelve
  English comparison records, and six authored journeys covering OTT, VTT,
  OVT, VVT, OTTT/OVTT, and VTTT/VVTT.
- All eight Dutch forms are represented as present, past, future, and
  future-from-past onvoltooid/voltooid pairs. Each record includes a canonical
  example, natural English meaning, practical usage meaning, time markers when
  useful, level, and teaching priority. Everyday alternatives are authored
  where the formal form is uncommon or misleading in ordinary Dutch.
- Each English comparison record includes English tense name and example,
  situation, meaning-preserving Dutch, common everyday Dutch, actual Dutch
  form or construction, mismatch note, level, and teaching priority. A Dutch
  construction may be used instead of an inaccurate eight-form label.
- Every guided journey contains a goal, short first-person story, noticing
  decision, highlighted target, canonical map reference, five core practice
  questions, bounded repair mapping, completion summary, and review eligibility.
- The five pedagogical exercise families are meaning recognition, controlled
  form construction, contextual English-to-Dutch choice, sentence ordering or
  repair, and form contrast or Verb Map placement. The smallest necessary
  controls are single choice, tap-to-slots, token ordering, and map placement.
  Multi-select and match-pairs are not required unless the authored `werken`
  content proves that an existing family cannot express a necessary behavior.
- All answer evaluation is finite and authored. No text input, drag-only
  interaction, arbitrary parser, runtime generation, runtime translation, or
  runtime LLM grading is allowed.
- Each exercise declares stable identity, journey and verb ownership, skill
  identifiers, difficulty, authored prompt/context, finite options or tokens,
  accepted answer(s), misconception-coded distractors where applicable,
  correct and incorrect feedback, and review provenance.
- Repair selection follows authored skill mappings, stable content order, and a
  hard cap of two repairs in one run. It never loops adaptively without a
  finite authored boundary.
- Verb skill evidence is additive within the existing local learning record.
  Its conceptual identity is verb plus form or skill plus exercise family.
  It is not forced into the narrower existing per-pattern GrammarRecord and it
  does not create a verb-completed boolean, lesson mastery record, second
  scheduler, or second progress visualization.
- Skill status is derived from bounded evidence. Demonstrated requires success
  in at least two relevant exercise families plus a later delayed or
  recombined attempt; a later scored error can return the skill to
  needs-practice. The exact thresholds and transitions must be explicit and
  testable.
- Verb Journey review candidates enter the existing Daily Five grammar pool,
  retaining due-first selection, vocabulary protection, recent-task safety,
  and the current grammar cap. The Today surface uses its existing compact
  card pattern and does not preview an unfinished exercise sentence.
- Existing lesson-specific Continue remains unchanged in the first slice.
  Cross-activity universal Continue is a separate future boundary requiring a
  safe shared resume descriptor.
- The popup layout keeps the existing standard width and height tokens and uses
  a compact mobile-style composition: brand header, scrollable screen content,
  and persistent Today/Lessons/Saved bottom navigation with icons. This is a
  behavioral and information-architecture decision from the approved
  prototype, not a replacement design system.
- Lessons, Verb Journeys, and the `werken` overview use explicit, keyboard-
  operable controls for primary cards and actions. Visible prototype controls
  must either navigate, update the visible state, or explain their boundary;
  they must not be silent no-ops.
- Verb Journey list entries use stable display ordering and fixed visible
  numbers. The first slice lists `werken` as `01` and keeps future verb
  placeholders numbered without implying that those verbs are implemented.
- Audio, speech, listening, and audio-curriculum controls are excluded from
  this feature and must not appear in the extension or popup journey.
- The renderer must build a screen before replacing the current popup content.
  If a browser-only rendering error occurs, it must show a visible clickable
  recovery menu rather than leaving the popup empty. This recovery behavior
  was proven in the approved throwaway prototype and should be represented by
  a renderer-level regression check where the production seam permits it.
- Content availability is determined by the existing validation/reporting
  convention. Invalid or incomplete `werken` content is unavailable to the
  learner; no user-facing feature toggle, new permission, or remote rollout
  system is introduced.
- Story/help content follows DutchMate's existing Dutch-English-Telugu
  support contract. Dense form-map and English-comparison details use Dutch
  and English unless an existing UI contract requires more.
- Saved-to-verb integration is conditional. It is omitted from the first slice
  when reliable lemma/form resolution is not already available; no speculative
  NLP or external service is added.
- Local migration is additive, idempotent, and safe to ignore when the feature
  is unavailable. Existing saved items, lesson progress, Pattern progress,
  rhythm, contrast evidence, export/import, and ordinary review remain
  readable. Unknown or removed Verb Journey content cannot crash history
  reads.
- The existing design system and popup responsive conventions are the visual
  source of truth. The clickable `werken` mockup is used for behavioral flow,
  information architecture, and content density questions, not copied CSS or
  replacement styling.
- Release content requires automated structural validation and independent
  fluent-Dutch review with recorded provenance. AI may assist offline with
  drafts but has no runtime authority.

## Testing Decisions

Good tests exercise observable contracts and external behavior: a valid or
invalid authored pack, a deterministic learner answer, a bounded repair path,
an additive migration, a Today/Daily Five selection, a keyboard interaction,
or a learner-visible responsive state. Tests should not assert incidental
helper names, private data structures, or copied mockup markup.

The primary seams are:

1. The Verb Journey content validator and availability report. It verifies
   complete eight-form and twelve-pattern coverage, globally unique IDs,
   resolved references, valid answer enumerations, target spans, bounded
   repairs, known skills, review metadata, and reference-only constraints.
2. Pure journey and exercise-domain logic. It verifies deterministic
   evaluation for every supported exercise family, stable repair selection,
   the five-question plus two-repair cap, journey ordering, and skill-status
   derivation.
3. The existing local learning-record store and typed background boundary. It
   verifies additive writes, stale-submission protection, idempotency,
   migration, export/import compatibility, review scheduling, Daily Five
   selection, and preservation of unrelated records.
4. Existing popup and Lessons integration. It verifies entry and return paths,
   story and notice progression, Verb Map and English comparison access,
   feedback announcement, keyboard operation, focus order, narrow-popup
   containment, persistent bottom-tab navigation, visible card affordances,
   completion summary, Today entry, and non-empty renderer recovery.

Prior art includes the existing grammar content validator/report, deterministic
grammar evaluator and progress tests, Contrast Repair content and learning
tests, lesson catalog and lesson-session tests, Daily Five selection and
learning-record tests, popup tab/navigation and renderer tests, and existing
backup/migration tests. Existing Daily Five, lesson, heatmap, Saved, Options,
build, and packaging checks should be extended or reused for regression
coverage.

Human content QA remains required for Dutch idiomaticity, VTT/OVT nuance,
everyday alternatives, English comparison accuracy, distractor plausibility,
feedback scope, vocabulary level, and Telugu support where authored.

Accessibility QA must cover keyboard-only completion, visible and programmatic
focus, non-color status cues, feedback announcements, expandable English
groups, map-cell headings, token removal/reordering alternatives, reduced
motion, persistent bottom-tab navigation, semantic controls for clickable
cards, and actual supported popup widths.

## Out of Scope

- A new top-level popup tab, separate Verb Gym, Sentence Forge, Grammar Minute
  destination, grammar library, or second learner-facing practice mode.
- A second queue, scheduler, verb-specific due system, lesson mastery score,
  verb-completion badge, or separate progress visualization.
- Cross-activity universal Continue in the first slice.
- Saved-to-verb lemma resolution when the current data does not already make
  it reliable.
- Expansion beyond the `werken` vertical slice before acceptance, including
  automatic cloning to `zijn`, `hebben`, `gaan`, `doen`, `wonen`, `komen`, or
  `willen`.
- A general Dutch conjugation engine, arbitrary language parser, arbitrary
  webpage diagnosis, free-form grading, typed answers, typed cloze, speech
  grading, or independent-production assessment.
- Runtime LLM calls, network-dependent correctness, generated content,
  generated distractors, runtime translation, remote content delivery, or new
  extension permissions without a separately approved decision.
- Audio playback, speech controls, listening exercises, speech grading, or an
  audio curriculum anywhere in the feature or extension journey.
- Replacing the current Today, Lessons, Saved, Options, heatmaps, navigation,
  design tokens, typography, spacing, colors, icons, or component family.
- Treating the mockup's CSS or visual styling as production UI.
- Requiring mastery of VVT, OTTT, OVTT, VTTT, or VVTT for beginner progress.
- A full-conjugation or multi-person mastery claim; first-person controlled
  production is the initial scope.
- Automatic saving, raw answer storage, response-time storage, full attempt
  histories, behavioral timelines, social practice, audio curriculum, or a
  Telugu learning mode.
- Formal CEFR certification, permanent-retention claims, or learning success
  measured only by completion, time, or engagement.

## Further Notes

- The approved plan is Feature 015, codename `verb-journeys`, on branch
  `015-verb-journeys`.
- The revised clickable `werken` mockup was considered as a behavioral and
  information-architecture reference. Its notable constraints include a
  Lessons category entry, compact Today action without unfinished sentence
  preview, story → notice → map → comparison → practice → completion flow,
  collapsible English groups, map detail inspection, five click-only questions,
  bounded repair, persistent mobile-style bottom tabs, numbered verb entries,
  no-audio interaction, and return to Today.
- The existing DutchMate UI is authoritative wherever the mockup and shipped
  behavior differ. No mockup CSS or replacement visual system is part of this
  spec.
- The work proceeds through one complete `werken` slice before broader verb
  expansion. Each implementation phase must report changed behavior, evidence,
  checks, remaining risks, and one recommended next action.
- This specification is the parent work definition. The vertical ticket
  breakdown is approved and checked in; parent issue #130 and child issues
  #123–#129 are published. Implementation remains gated on the published
  ticket state and normal delivery workflow.
