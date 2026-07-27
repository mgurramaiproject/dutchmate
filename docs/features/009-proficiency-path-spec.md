# 009-proficiency-path: A0 grammar progression specification

**Feature code:** `009-proficiency-path`

**Branch:** `feature-009-proficiency-path`

**Status:** Specification ready for ticketing; implementation not started

**GitHub issue:** [#81](https://github.com/mgurramaiproject/dutchmate/issues/81)

**Source plan:** [009-proficiency-path-plan.md](./009-proficiency-path-plan.md)

## Problem Statement

DutchMate helps learners understand Dutch on webpages, save useful language, review vocabulary, and complete practical mini-lessons. It does not yet teach a coherent foundation of Dutch verb agreement and sentence structure, revisit those patterns through objective practice, or help learners notice a studied pattern during ordinary browsing.

For A0/Pre-A1 through A2 learners, useful phrases alone leave systematic gaps. A learner may recognize `ik ben` without understanding why another subject needs `bent`, `is`, or `zijn`; may know an infinitive without being able to choose its present-tense form; or may understand a statement without being able to recognize the corresponding question order.

Adding a separate grammar course, daily queue, placement flow, or large verb catalog would duplicate DutchMate's existing Lessons and Daily Five systems. Replacing the twelve published lessons would also risk invalidating trusted content and local progress. Runtime-generated exercises would make accepted answers, feedback, privacy, cost, and linguistic quality difficult to guarantee.

DutchMate needs one additive, deterministic learning loop that teaches a small reviewed grammar foundation inside Lessons, retrieves it through the existing Daily Five, and recognizes it opportunistically in text DutchMate already handles. Progress must reflect bounded evidence of supported recognition and controlled application, not clicks, time spent, formal CEFR attainment, or independent writing ability.

## Solution

DutchMate will add a pattern-first **Verb Path** inside the existing Lessons library. The first delivery proves one end-to-end `zijn` tracer, then publishes a coherent A0/Pre-A1 foundation covering present-tense `zijn`, present-tense `hebben`, common regular present-tense agreement, and simple yes/no question inversion.

The twelve published starter lessons, their identifiers, content versions, completion records, and saved learning items remain intact. Compatible lessons gain separately versioned **grammar companions**. Three new A0 mini-lessons fill capability gaps that the current single A0 lesson cannot cover. Existing A1 and A2 lessons remain available; their grammar expansion is parked until the A0 loop passes its release gates.

Grammar practice remains click-only and keyboard-operable. Learners choose, contrast, transform, order, or repair reviewed language without typing. Every scored item has deterministic accepted answers, misconception-based distractors, stable error categories, and exact feedback. Content is manually authored unless a bounded template can expand every learner-visible combination at build time for automated validation and human review.

The existing **Daily Five** remains the single daily habit. It mixes vocabulary with at most two due grammar tasks, preserves at least three vocabulary positions when enough vocabulary work exists, and prevents overdue grammar from starving. Learner-facing pattern progress is limited to **Introduced**, **Practising**, and **Applied**.

**Encounter Coaching** may recognize a studied pattern only in text already handled by an ordinary hover or selection lookup. A confident deterministic match can offer one short reviewed practice action. It performs no page scan, adds no provider request, stores no encounter text or raw answer, and stays silent when uncertain.

All grammar progress stays in the local learning record and participates in versioned export, import, and clear-data behavior. DutchMate stores only the compact evidence needed to schedule practice, prevent immediate repetition, and justify a progress state.

## User Stories

1. As an A0 learner, I want DutchMate to teach why `ik ben`, `jij bent`, and `zij is` differ, so that I can understand basic Dutch subject-verb agreement.
2. As an A0 learner, I want to practise `zijn` in a practical introduction lesson, so that grammar is connected to language I can use immediately.
3. As an A0 learner, I want to learn `hebben` after `zijn`, so that I can describe what I have or need.
4. As an A0 learner, I want to practise common regular present-tense verbs, so that I can talk about where I live, work, and learn.
5. As an A0 learner, I want to see how a statement becomes a yes/no question, so that I can understand and form simple questions.
6. As an A0 learner, I want DutchMate to explain why `werk je` loses the `t` while `werkt u` keeps it, so that feedback resolves a real misconception.
7. As an A0 learner, I want short conjugation references beside practical examples, so that tables support rather than replace learning.
8. As a learner, I want each pattern taught inside the existing Lessons library, so that I do not have to learn another navigation system.
9. As a learner, I want the existing A0, A1, and A2 filters to continue working, so that I can browse content at a useful level.
10. As a learner, I want every lesson to remain selectable, so that DutchMate does not lock me into a prescribed starting point.
11. As a learner, I want DutchMate to recommend the earliest incomplete foundation pattern, so that I have a clear next action without a placement test.
12. As a learner, I do not want a `Find my starting point` control, so that starting remains effortless.
13. As a returning learner, I want all twelve existing lessons to remain available, so that an update does not remove content I already value.
14. As a returning learner, I want completed lessons to remain completed, so that new grammar features do not erase or misrepresent my history.
15. As a returning learner, I want saved lesson vocabulary to remain unchanged, so that enrichment does not duplicate or lose learning items.
16. As a returning learner, I want new pattern practice offered inside a completed lesson without marking the lesson incomplete, so that additions feel valuable rather than punitive.
17. As a returning learner, I do not want old lesson completion to grant new grammar credit, so that my pattern progress remains honest.
18. As a learner, I want Read to introduce grammar naturally in a micro-story, so that the rule begins with meaning.
19. As a learner, I want Notice to highlight only the relevant forms and minimum useful rule, so that explanations remain manageable.
20. As a learner, I want Practise to use objective click-only tasks, so that I receive real corrective evidence without typing.
21. As a learner, I want Replay to show the pattern again with less support, so that I can notice it in context.
22. As a learner, I want Keep to preserve my choice over lesson candidates, so that grammar does not automatically add vocabulary.
23. As a learner, I want to choose the correct conjugated form, so that I can practise subject agreement quickly.
24. As a learner, I want to change a subject and choose the resulting verb form, so that I learn transformations rather than memorize one sentence.
25. As a learner, I want to rebuild a sentence by clicking tokens, so that I can practise word order without typing.
26. As a learner, I want to compare two forms or sentences, so that subtle grammar contrasts become visible.
27. As a learner, I want to repair one known error, so that common misconceptions become memorable.
28. As a keyboard user, I want every grammar task completable without a pointer, so that click-only does not mean mouse-only.
29. As a learner, I want controls large enough to activate reliably in the popup, so that playful movement does not become fiddly.
30. As a learner, I want to change my selection before pressing Check, so that accidental clicks do not become evidence.
31. As a learner, I want only my first Check to create scored evidence, so that retries teach me without inflating progress.
32. As a learner, I want a wrong answer to explain the exact rule and corrected contrast, so that feedback improves my Dutch.
33. As a learner, I want all genuinely correct alternatives accepted, so that DutchMate never teaches me that valid Dutch is wrong.
34. As a learner, I want an ambiguous exercise omitted rather than graded approximately, so that I can trust every correction.
35. As a learner, I want Reveal or Skip to remain safe, so that I can continue without false success.
36. As a learner, I want varied sentences and lexical contexts, so that I learn a pattern rather than one memorized prompt.
37. As a learner, I want delayed unseen or recombined practice, so that Applied reflects more than an immediate repeat.
38. As a learner, I want progress described as Introduced, Practising, or Applied, so that it is clear without pretending to certify proficiency.
39. As a learner, I want Applied to require successful work across different task types, contexts, and days, so that the milestone represents meaningful evidence.
40. As a learner, I want due practice to continue after Applied, so that a historical milestone does not imply permanent retention.
41. As a learner, I want Daily Five to remain the single obvious daily action, so that grammar does not create another queue.
42. As a vocabulary learner, I want at least three Daily Five positions protected for vocabulary when enough vocabulary is available, so that grammar does not crowd out saved words.
43. As a grammar learner, I want at most two grammar tasks in a Daily Five, so that practice remains short and balanced.
44. As a grammar learner, I want seriously overdue grammar guaranteed a place, so that vocabulary volume does not starve a studied pattern forever.
45. As a learner, I want due work considered before new work, so that Daily Five supports retention.
46. As a learner, I want reopening the popup to resume the same Daily Five queue, so that closing the popup does not reshuffle my work.
47. As a learner, I accept that an unfinished token arrangement restarts, so that DutchMate need not store raw in-progress answers.
48. As a learner, I want a completed grammar task reflected immediately in pattern progress and scheduling, so that feedback and progress agree.
49. As a learner, I want normal translation to remain unchanged when no studied pattern matches, so that coaching never obstructs browsing.
50. As a learner, I want DutchMate to identify a studied pattern during an ordinary lookup, so that I do not have to recognize and select a suitable sentence deliberately.
51. As a learner, I want Encounter Coaching offered only for confident matches, so that DutchMate does not invent grammar explanations.
52. As a learner, I want Encounter Coaching to use a reviewed exercise rather than generate one from arbitrary page text, so that grading remains trustworthy.
53. As a learner, I want the authentic encounter itself treated as exposure, so that seeing a form is not misreported as successful application.
54. As a learner, I want scored Encounter practice to count through the same pattern evidence contract, so that progress is consistent across surfaces.
55. As a learner, I want to dismiss coaching and return to the page easily, so that reading remains primary.
56. As a learner, I want coaching to add no translation-provider call, so that practice is fast and does not increase service cost.
57. As a privacy-conscious learner, I do not want DutchMate scanning the page for grammar, so that it handles only text from my ordinary lookup.
58. As a privacy-conscious learner, I do not want selected sentences or raw webpage text stored for grammar progress, so that practice does not become browsing history.
59. As a privacy-conscious learner, I do not want response times or full attempt histories stored, so that DutchMate keeps only necessary learning evidence.
60. As a learner, I want grammar progress included in export and import, so that my local learning record remains portable.
61. As a learner, I want Clear data to remove grammar progress and the current mixed queue, so that I retain control over local data.
62. As a learner importing an older backup, I want my existing vocabulary and lessons preserved, so that the grammar update remains backward compatible.
63. As a learner, I want progress conflicts merged without postponing due practice or inventing evidence, so that import remains conservative.
64. As a learner, I want playful movement, immediate correction, and restrained celebration, so that practice feels satisfying without coins or lives.
65. As a learner, I do not want streak punishment, leaderboards, experience points, or failure animation, so that motivation remains tied to learning.
66. As a learner, I want Dutch, English, and Telugu support retained in grammar-powered lessons, so that new teaching fits DutchMate's learning triangle.
67. As a learner, I want every released sentence and answer human-reviewed, so that I can rely on DutchMate's Dutch.
68. As a content reviewer, I want a readable report of every expanded sentence, answer, distractor, and feedback item, so that I can review content without reading code.
69. As a content reviewer, I want authorship, version, sources, review date, and reuse provenance recorded, so that released material is accountable.
70. As a developer, I want invalid grammar content to fail deterministic validation, so that unreviewable material cannot silently ship.
71. As a developer, I want stable pattern, exercise, misconception, and companion identifiers, so that scheduling and migration survive content releases.
72. As a developer, I want one shared exercise contract across Lessons, Daily Five, and Encounter Coaching, so that scoring cannot diverge between surfaces.
73. As a developer, I want one local pattern-evidence contract, so that a learner-facing state has one meaning everywhere.
74. As a developer, I want the twelve published lessons covered by preservation regressions, so that grammar work cannot reset old progress accidentally.
75. As a product owner, I want the tracer proven before broad A0 content is authored, so that the interaction and data model are validated cheaply.
76. As a product owner, I want a second qualified human review before public A0 release, so that self-review is not the only linguistic gate.
77. As a product owner, I want a small delayed learner pilot before public release, so that learning claims rest on more than engagement.
78. As a product owner, I want usability and learning thresholds recorded before the pilot, so that release decisions are not made retrospectively.
79. As a product owner, I want A1 and A2 expansion deferred until the A0 loop succeeds, so that content breadth does not outrun quality.
80. As a product owner, I want B1 excluded, so that DutchMate's promise remains credible and achievable.

## Implementation Decisions

### Scope and delivery sequence

- The engineering tracer is `a0-zijn-present`. It runs end to end through the existing `A0 · Hallo, ik ben…` lesson, one scored lesson task, one mixed Daily Five task, and one confident Encounter Coaching match.
- The first public grammar release contains exactly four A0/Pre-A1 patterns:

| Sequence | Stable pattern identity | Practical capability | Core language | Lesson treatment |
| --- | --- | --- | --- | --- |
| 1 | `a0-zijn-present` | Introduce and identify people or simple states | subject pronouns with present `zijn`: `ben`, `bent`, `is`, `zijn` | Grammar companion on the existing `A0 · Hallo, ik ben…` lesson |
| 2 | `a0-hebben-present` | Say what someone has or needs | subject pronouns with present `hebben`; both reviewed `u hebt` and `u heeft` alternatives are accepted where either fits | New `a0-ik-heb-dit-nodig` lesson titled `A0 · Ik heb dit nodig` |
| 3 | `a0-regular-present` | Describe common everyday actions | present agreement for reviewed regular verbs such as `wonen`, `werken`, `leren`, and `maken`, in subject-first main clauses | New `a0-ik-woon-en-werk-hier` lesson titled `A0 · Ik woon en werk hier` |
| 4 | `a0-yes-no-inversion` | Ask simple yes/no questions | finite verb before the subject; `jij/je` after the verb drops `-t`, while `u` retains the reviewed `-t` form | New `a0-woon-je-hier` lesson titled `A0 · Woon je hier?` |

- The three new lessons use new stable lesson identifiers and content version 1. Existing lesson identifiers, content versions, catalog identities, completion records, and saved candidates are not changed or re-keyed.
- New A0 lessons are additive. Their display placement may make the A0 filter coherent, but no existing lesson order value or identity is reused.
- Pattern prerequisites define recommendation order only. They never lock a lesson or prevent direct selection.
- A1 verb-pattern expansion, A2 verb and word-order expansion, a Saved-verb practice entry point, and a larger inventory remain parked.

### Bundled content contract

- The bundled learning-content contract encompasses lessons, grammar companions, patterns, exercises, misconception categories, deterministic encounter forms, and review metadata.
- A grammar companion has a stable identity, positive content version, compatible lesson identity, pattern identity, compact teaching content, exercise-set identities, and review metadata. Adding a companion to a published lesson does not require changing that lesson's content version when the published lesson content itself is unchanged.
- A pattern has a stable identity, level label, practical capability, recommendation prerequisites, reviewed forms, compact reference table, context tags, exercise-set identities, encounter-form identities, and content version.
- An exercise has a stable identity, pattern identity, primitive, prompt, reviewed Dutch context, helper text where required, context tag, one accepted answer or a finite list of accepted alternatives, misconception-coded distractors, exact feedback, and evidence eligibility.
- Stable misconception categories identify one known rule error, such as wrong person agreement, omitted `-t`, retained `-t` after `jij/je` inversion, dropped `-t` before `u`, wrong irregular form, or invalid word order.
- Each distractor maps to exactly one stable misconception category. Generic random distractors are invalid.
- Feedback names the relevant rule and shows one reviewed correction or contrast. `Incorrect` without an explanation is invalid.
- Every content pack records its version, author, review state, reviewer and date, authoritative sources, and license or provenance for reused material.
- The archived Valley Trail list is inspiration only. No text or table is copied unless a later provenance review establishes reusable rights.

### Manual-first authoring and validation

- The tracer and all linguistically sensitive exercises are complete authored instances.
- Bounded templates are permitted only for safe repetitive cases whose verbs, subjects, contexts, answers, alternatives, distractors, feedback, and resulting combinations are finite and explicit.
- Templates expand at build time. No learner-visible sentence, answer, distractor, explanation, or score is generated at runtime.
- The bundled-content validator expands every template and fails on unknown references, duplicate identities, missing forms, empty accepted-answer sets, accepted answers duplicated as distractors, distractors without misconception codes, codes without feedback, unsupported primitives, unreviewed combinations, incompatible lesson links, missing provenance, or incomplete review metadata.
- Validation produces a deterministic human-readable report containing every released Dutch sentence, helper, prompt, accepted answer, alternative, distractor, error category, feedback item, source reference, and review record.
- The internal tracer may be self-reviewed. Public A0 content requires the exact report to be checked by a second fluent Dutch reviewer with grammar-teaching competence. Formal NT2 certification is not mandatory. AI output is never treated as review approval.

### Click-only grammar exercise contract

- The initial primitive set is:
  - **choose form:** choose one reviewed form for a sentence;
  - **contrast form:** choose the valid sentence or form from reviewed contrasts;
  - **change subject:** apply a displayed subject change and choose the resulting form;
  - **order tokens:** build one accepted sentence by activating token controls;
  - **repair choice:** identify or replace one known invalid form or ordering.
- Verb Gym and Sentence Forge may name internal authoring groups for these primitives. They are not learner-facing modes, destinations, queues, or progress systems.
- Exercises require no text entry and no drag-and-drop. Token placement uses button-like controls: activating an available token appends it; activating a placed token returns it. Reset restores the deterministic starting order.
- Learners may revise an answer before activating Check. Only the first Check creates scored evidence.
- A correct first Check creates one successful evidence marker. An incorrect first Check records the stable misconception category and schedules review. Later retries may teach and celebrate correction but cannot add or replace scored evidence for that attempt.
- Reveal or Skip completes the current presentation without successful evidence and schedules the pattern for the next local day.
- A scored exercise differs from its teaching example. Evidence-eligible delayed items must use an exercise not previously seen by that learner or a reviewed recombination with a distinct exercise identity.
- Sentence comparison is exact over reviewed token identities, with only declared normalization for capitalization, surrounding whitespace, and terminal punctuation. There is no fuzzy, semantic, or generative grading.
- When multiple Dutch forms are valid, every accepted alternative is declared. For `hebben` with `u`, content accepts both `u hebt` and `u heeft` where the sentence does not impose a narrower reviewed style.
- If accepted alternatives cannot be exhaustively enumerated, the exercise is omitted or redesigned.

### Pattern progress and scheduling

- A pattern with no record is not started and has no learner-facing progress label.
- **Introduced** begins when the learner completes the grammar companion's teaching encounter. Completion of a pre-existing lesson before the companion shipped does not create this state.
- **Practising** begins after the first eligible scored Check, whether correct or incorrect. It means practice evidence exists, not that the answer was successful.
- **Applied** requires all of the following successful first-Check evidence:
  - at least four distinct evidence-eligible exercises;
  - at least two grammar exercise primitives;
  - at least three reviewed lexical context tags;
  - practice on at least two local calendar days;
  - at least one attempt performed 24 hours or more after introduction; and
  - that delayed attempt uses unseen or reviewed recombined material.
- Applied is a historical evidence milestone, not a claim of permanent retention. It does not regress solely because time passes, and due practice continues after it is earned.
- An incompatible content change cannot silently preserve or reset pattern progress. It requires an explicit migration that declares which evidence remains compatible. Without a migration, the old version remains preserved and the new version begins separately.
- Grammar scheduling uses the existing calm spaced-practice posture: a first scored attempt or Reveal/Skip is due the next local day; successful first Checks advance through 1, 3, 7, 14, 30, and at most 60 days; an incorrect first Check returns the interval to one day.
- The due timestamp and scheduling state are separate from Introduced, Practising, and Applied.

### Minimum grammar learning record

- Grammar data remains inside the versioned local learning record and is scoped to the Dutch learning-language key.
- The learning backup advances to version 3. Import continues to accept versions 1 and 2.
- Per-pattern persistence contains:
  - pattern identity and content version;
  - Introduced, Practising, or Applied state;
  - introduced, last-practised, next-due, and updated timestamps;
  - interval days;
  - a capped successful-evidence count;
  - the distinct primitive and lexical-context markers needed for Applied;
  - a capped set of recent successful local days;
  - whether delayed unseen/recombined evidence exists;
  - up to eight recent exercise identities for repetition prevention; and
  - misconception counters capped at nine per stable category.
- A successful related exercise may decrement its bounded misconception counter; a wrong first Check increments the matching counter. Counters guide exercise selection and feedback review but are not exposed as a learner score.
- The current mixed Daily Five snapshot stores ordered task identities, content versions, and completed task identities. It does not store raw answers or token placement. Reopening resumes the queue; an unfinished individual task restarts.
- DutchMate does not persist raw webpage text for grammar, selected sentences, response times, raw answers, full attempt sequences, session timelines, or behavioral analytics.
- Export includes the grammar learning record and current mixed snapshot. Clear data removes both. Import validates all identifiers and versions before mutation.
- Import merges per-pattern summaries conservatively: it unions compatible bounded evidence, keeps the earliest due time, keeps the latest real timestamps, caps counters and recent identities, and awards Applied only if the merged summary independently satisfies every Applied condition.
- Existing twelve-lesson progress and saved learning items survive version-3 migration and round trips unchanged.

### Mixed Daily Five

- Daily Five remains the only daily goal. There is no Grammar Minute or second scheduler.
- A Daily Five task explicitly identifies whether it is vocabulary or grammar. Vocabulary tasks continue using the existing recognition/recall result contract. Grammar tasks use the objective first-Check outcome and stable exercise identity.
- Selection builds stable due vocabulary and due grammar queues, ordered by due time and stable identity.
- A batch contains at most five tasks and at most two grammar tasks.
- When at least three eligible vocabulary tasks exist, at least three positions remain vocabulary.
- Due tasks precede new tasks within each kind. An introduced grammar pattern may supply new practice only after due work for that pattern is handled.
- If a grammar pattern is at least two local days overdue, one grammar position is guaranteed in the next batch when any grammar position is available. A second grammar position remains governed by global due order. This prevents grammar starvation without displacing the three protected vocabulary positions.
- If fewer than five eligible tasks exist under these rules, completing all available tasks completes the day's available goal without fabricating filler.
- Completing five is enough. Continuing after completion remains optional and uses the same composition limits.
- Reveal, Skip, or an incorrect grammar Check may complete that queue position but cannot be counted as successful pattern application.
- Grammar completion does not alter vocabulary recognition or recall mastery. Vocabulary results do not alter pattern progress.

### Lesson and popup experience

- Verb Path remains inside the existing Lessons library and uses existing A0, A1, and A2 labels, filters, practical life pathways, helper languages, and focused lesson flow.
- No grammar tab, `Stories | Grammar` switch, placement test, learner-level setting, locked level, or starting-point button is introduced.
- Compatible lessons surface their grammar companion within the existing Read, Notice, Practise, Replay/Keep flow. No additional top-level lesson rail is created.
- A previously completed lesson remains visibly complete. Its row or detail may show `Pattern practice available`; it is not reset to in progress.
- New grammar progress is shown separately with Introduced, Practising, or Applied. Lesson completion and pattern progress are never substituted for each other.
- The popup may recommend the earliest incomplete A0 pattern through the existing next-action or continue-lesson area, while every lesson remains directly selectable.
- Grammar interactions follow a compact `Spot → Change → Build` rhythm where the content supports it. These are interaction verbs, not navigation modes.
- Correct feedback is immediate and restrained. Applied may receive a brief capability celebration. Coins, lives, experience points, leaderboards, punitive streaks, and failure animations are absent.
- Production preserves the accepted mobile-shaped popup posture: approximately 390 pixels wide, content scrolling inside the popup, at least 44-pixel targets, black-white-orange hierarchy, no horizontal overflow, and reduced-motion support.
- Focused grammar flows keep the originating surface as orientation, prevent accidental navigation loss, and provide an explicit Exit action.
- Controls have semantic roles and accessible names, visible focus, logical keyboard order, Enter and Space activation, and live status for Check results. Color is not the only state signal.

### Encounter Coaching

- Encounter Coaching is available only for a pattern with at least Introduced progress and a deterministic reviewed encounter-form inventory.
- Matching runs only during the current ordinary hover or selection lookup and uses only the lookup text and bounded nearby context already handled by that interaction.
- Matching starts with exact normalized reviewed sequences. For the tracer, eligible sequences pair a reviewed subject with its `zijn` form, such as `ik ben`, `jij/je bent`, `u bent`, `hij/zij/het is`, or `wij/we/jullie/zij/ze zijn`. A bare ambiguous form is insufficient.
- A confident match may add `Pattern you know` and one short `Practise` action to the existing tooltip result. An uncertain, first-seen, unstudied, unsupported, or conflicting match adds nothing.
- The authentic page text is used only to explain the match. Practice selects a compatible reviewed exercise from the bundled content; it does not generate or score an exercise from the page sentence.
- Seeing the match or opening its explanation creates no durable progress. A completed reviewed first Check may submit normal pattern evidence with an Encounter context tag.
- Matching, opening, practising, retrying, and dismissal add zero translation-provider or generative-service requests.
- Encounter Coaching does not scan pages, run on page load, highlight page content automatically, inspect unrelated text, persist the matched sentence, store a URL, or create encounter history.
- The tooltip remains non-modal and the page remains scrollable. Visible close, Escape, lookup replacement, page navigation, and extension disablement dismiss safely and return focus when possible.
- Daily Five remains the guaranteed practice route. Encounter availability is never a prerequisite for Applied.

### Errors, migration, and safe failure

- Invalid bundled grammar content disables grammar companions, grammar Daily Five tasks, and Encounter Coaching with a clear safe error; normal translation, saved vocabulary, and the twelve existing lessons remain available.
- Unknown pattern, exercise, content-version, misconception, or companion references are rejected at the typed background boundary.
- A stale or duplicated grammar-result message cannot add a second evidence marker. Result submission includes the current exercise identity, pattern version, and expected evidence revision for idempotency.
- Storage failure does not fabricate progress or completion. The learner can retry or exit without losing existing lesson or vocabulary data.
- A version-3 migration is atomic. Failure leaves the prior readable record unchanged.
- No new ADR is required at specification time: the design preserves separate recognition/recall mastery, the Dutch language-keyed local record, the canonical local review-card model, and the accepted popup shell and lesson-stage posture.

### Public release gates

- The tracer may merge after automated verification, self-review, and manual Chrome and Firefox checks. It is internal evidence and does not make the public A0 foundation complete.
- Public A0 content cannot ship until a second fluent Dutch reviewer with grammar-teaching competence signs the generated content report.
- A voluntary product-learning pilot includes 6–10 target learners, with at least three genuine A0/Pre-A1 learners.
- The pilot records a short pre-teaching baseline, supported lesson practice, and a delayed check 2–7 days later using reviewed unseen or recombined exercises.
- Usability passes when at least 80% of participants complete the core lesson and mixed Daily Five flow without moderator intervention, understand the correction, and retain all visible prior lesson progress.
- The directional learning gate passes when the cohort's median delayed first-Check score exceeds its median pre-teaching baseline and the targeted misconception rate is lower. Missing either condition requires content or interaction revision and another check before a broad learning-effect claim.
- The pilot is not a statistically powered efficacy study. Completion count, time spent, streaks, immediate retries, and return frequency are not proof of learning.
- Encounter Coaching is reviewed separately for reading disruption, false-positive matches, dismissal, and zero incremental provider requests. If it misses its quality boundary, the approved public `009` release does not proceed unless a new product decision explicitly narrows that release to Lessons and Daily Five.

## Testing Decisions

- Good tests assert observable learner behavior, typed public messages, persisted records, emitted surface states, provider-call counts, and accessibility contracts. They do not assert private helper names, internal collection choices, or decorative DOM nesting.
- The primary integration seam is the existing typed background learning contract exercised through the background message handler with deterministic clocks and in-memory browser storage.
- Primary-seam tests cover pattern introduction, scored evidence, idempotency, Applied thresholds, scheduling transitions, mixed Daily Five composition and starvation, snapshot resume, version-3 migration, version-1/2 import, compatible merge, malformed data, export round trips, clear data, and preservation of all twelve lesson-progress records and learning items.
- Focused domain tests supplement the primary seam only where exhaustive scheduling, evidence-summary caps, deterministic selection, or migration matrices would obscure the public contract.
- The existing bundled lesson-catalog validator is extended into the bundled learning-content validation seam rather than adding an unrelated validation framework.
- Validator tests cover the four A0 patterns, the existing grammar companion, three new A0 lessons, every expanded exercise, stable identities, compatible links, accepted alternatives, misconception-coded distractors, exact feedback, review metadata, provenance, and deterministic report output.
- Negative validator tests cover template combinations that are unreviewed, accepted answers duplicated as distractors, missing alternatives, unknown forms, unknown error codes, generic feedback, unsupported primitives, duplicate identities, missing sources, and accidental mutation or removal of the twelve published lessons.
- The existing popup state and rendered-DOM seams cover lesson preservation, A0 filtering, recommendation without locking, grammar-companion entry, click-only primitives, first-Check scoring, retry, Reveal/Skip, progress labels, mixed Daily Five resume, errors, focused-flow exit, and restrained celebration.
- Popup accessibility tests cover semantic controls, accessible names, logical keyboard order, Enter and Space activation, visible focus, live result announcements, 44-pixel target hooks, reduced motion, narrow-popup containment, and absence of horizontal scrolling.
- The existing webpage lookup module remains the primary Encounter Coaching orchestration seam. A controlled translation and learning transport covers studied versus unstudied patterns, exact matches, ambiguity, stale lookups, hover and selection behavior, reviewed-exercise selection, idempotent evidence submission, dismissal, storage failure, and settings changes.
- Encounter tests assert that matching, explanation, practice, retry, and completion add zero translation-provider calls and persist no raw page text.
- The existing tooltip adapter is the narrow rendered Encounter seam. It covers `Pattern you know`, Practise, reviewed exercise controls, exact feedback, visible close, Escape, focus entry and return, live status, and continued page scrolling.
- Existing lesson-catalog, learning-record, Daily Five, background-message, popup, webpage-lookup, tooltip, backup, release-consistency, and Chrome/Firefox packaging tests are prior art and remain regression evidence.
- Manual Chrome and Firefox checks cover real popup sizing, keyboard-only completion, focus return, tooltip placement near viewport edges, page scrolling, lookup replacement, provider failure, storage failure, extension disablement, import/export, and confirmation that the twelve published lessons keep their progress.
- Full engineering verification includes focused tests, type checking, the complete relevant suite, Chrome and Firefox builds, manifest and package verification where affected, documentation-link and whitespace checks, generated content-report review, privacy disclosure review, and the manual browser checklist.
- Engineering verification and learning validation remain separate. Passing automated tests proves the contract and privacy boundaries, not Dutch proficiency improvement.

## Out of Scope

- B1 or higher teaching, progression, assessment, or content.
- A1 or A2 grammar implementation in the first public delivery.
- Formal CEFR placement, certification, or a claim that the learner is A1 or A2.
- A placement test, learner-level profile, locked level, mandatory A0 completion, or `Find my starting point`.
- Replacing, deleting, re-keying, renumbering, or resetting the twelve published lessons.
- Retroactive pattern progress from old lesson completion.
- A separate grammar tab, Verb Path library, `Stories | Grammar` switch, learner-facing Verb Gym, Sentence Forge, or Grammar Minute.
- A second daily queue or grammar-only streak.
- Typed or free-form popup answers, spelling assessment, handwriting, drag-and-drop requirement, or fuzzy grading.
- Independent writing, speaking, listening, pronunciation, or conversational-production claims.
- Runtime-generated lessons, sentences, examples, distractors, explanations, feedback, accepted answers, or scoring.
- Copying the archived Valley Trail verb tables or another source without established reuse rights.
- Fixed targets for verb count, lesson count beyond the approved gap-filling set, skill count, or exercise count.
- Retained, Secure, mastery percentages, CEFR percentages, or other pseudo-precise grammar claims.
- Automatic page scanning, grammar highlighting, passive page-load analysis, unrelated-content inspection, or a broader browser permission.
- Practice generated from an arbitrary saved word or arbitrary webpage sentence.
- Extra translation-provider requests, LLM requests, or a new remote service for grammar.
- Raw encounter-text persistence, selected-sentence storage, response-time tracking, raw answer logs, full attempt history, behavioral timelines, or background learning telemetry.
- A cloud learner profile, account, synchronization, or remote grammar catalog.
- Coins, lives, experience points, leaderboards, leagues, punitive streaks, failure animation, or a reward economy.
- Saved-verb practice entry points, personalized lesson remixes, pronunciation, audio, culture decoding, collectibles, social practice, or other items retained in the feature parking lot.
- A statistically powered efficacy trial, automatic cohort assignment, or marketing claim of proven language-learning effectiveness.

## Further Notes

### Approved test seams

1. The typed background learning contract is the primary integration seam.
2. The bundled learning-content validator is the deterministic content seam.
3. Existing popup state and rendered-DOM tests are the learner-facing lesson and Daily Five seam.
4. The webpage lookup module and tooltip adapter are the Encounter Coaching behavior and rendering seams.

No new end-to-end test framework is introduced.

### Delivery guidance

Ticketing should use tracer-bullet vertical slices rather than horizontal infrastructure phases:

1. prove `a0-zijn-present` through one existing lesson companion, one scored primitive, one mixed Daily Five task, one Encounter match, and the shared local evidence record;
2. complete deterministic content validation, report generation, backup migration, and preservation regressions needed to make that tracer trustworthy;
3. add the remaining reviewed A0 patterns and three gap-filling lessons through the same seams;
4. complete accessibility, cross-browser, content-review, privacy, and learner-pilot release gates.

Implementation must not begin as one broad feature branch change directly from this specification. Use independently deliverable child issues produced from this parent specification.

### Approved prototype direction

The design review selected **A · Paper Rail** as the primary learner-facing direction. It keeps the approved DutchMate popup shell and makes the existing `Read → Notice → Practise → Keep` lesson rail the main grammar orientation cue. The implementation should borrow two constrained details from the other prototype directions without creating new learner-facing modes:

- From **C · Today Queue**: expose grammar as one clearly labelled item inside the existing Daily Five queue, never as a second daily queue, grammar-only streak, or new top-level tab.
- From **B · Pattern Spine**: use token ordering only for exercises whose declared primitive is `order-tokens`; it is an exercise control, not a new “Sentence Forge” destination.

The review prototype is [009 proficiency-path prototype](../../frontend/009-proficiency-path-prototype.html). It is throwaway visual reference only and must not be shipped as an extension entrypoint. This decision authorizes the next specification-to-ticketing step; it does not authorize implementation before child execution issues exist.

### Source and authority

- [DutchMate domain glossary](../../CONTEXT.md)
- [Approved discovery plan](./009-proficiency-path-plan.md)
- [Primary-source research and decision rationale](./009-proficiency-path-research.md)
- [Reviewed ChatGPT source plan](./009-proficiency-path-chatgpt-plan.md)
- [Single feature parking lot](./feature-parking-lot.md)
- [LearnLoop specification](./002-learnloop-spec.md)
- [Context Missions specification](./004-transfer-spec.md)
- [Council of Europe CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search)
- [Taalunie ERK overview](https://erk-nederlands.taalunie.org/over-het-erk/)
- [Woordenlijst.org](https://woordenlijst.org/)
- [Taaladvies: `u heeft` or `u hebt`](https://taaladvies.net/u-heeft-of-hebt/)
- [Onze Taal: `vind je` and `vindt u`](https://onzetaal.nl/taalloket/vindt-u)

### Tracker posture

This specification is the parent work definition. Apply `ready-for-agent` when published, add it to the Delivery Project with `Execution=Agent` and `Delivery Status=Ready`, and create child execution issues only after this specification is checked in. Parent progress summarizes the initiative; child issues carry implementation status.
