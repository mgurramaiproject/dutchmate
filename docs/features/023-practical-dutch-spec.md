# Feature 023 — Practical Dutch Specification

**Codename:** `practical-dutch`
**User-facing area:** `Practical Dutch`
**Pilot topic:** `Supermarket and shopping`
**Parent pathway:** `shopping-and-cafes`
**Status:** Spec approved and published
**Prepared:** 2026-08-05

## Problem Statement

DutchMate's existing Practical Stories experience gives learners short,
useful situations, but it does not yet provide a scalable topic-level format
that joins contextual input, reusable sentences, phrase and vocabulary support,
focused deterministic practice, and optional review.

The current Lessons surface also has no way to present a bounded A1/A2 pair as
one practical topic. Adding another lesson ad hoc would make the experience
harder to extend and would risk duplicating the existing content catalog,
lesson-progress model, Saved-item model, or learning rhythm.

This matters especially for learners who need Dutch for everyday life in the
Netherlands. They should be able to learn a supermarket interaction as a
coherent practical task, then return to the same language in a controlled way.

Existing learners must not lose progress when the extension updates from a
browser store. Existing curated mini-lessons, Saved items, mastery, rhythm,
grammar, contrast, Verb Journey evidence, and backup files must remain readable
and retain their existing meaning.

## Solution

Add an additive Practical Dutch lesson format to the existing Lessons surface.
The first Practical Dutch topic is Supermarket and shopping inside the existing
`shopping-and-cafes` Practical life pathway. It contains two separately
playable lessons:

- A1 — Find products and pay
- A2 — Product information and problem resolution

The Lessons hub renames Practical Stories to Practical Dutch without adding a
new navigation destination. Existing curated mini-lessons remain available
through a compatibility adapter. The topic card shows A1 and A2 together,
recommends A1 first without locking A2, and promotes A2 after A1 completion.

Published content is one atomic, versioned `practical-dutch` package in the
existing bundled content catalog. The package contains shared topic metadata
and two stable lesson payloads. Both levels must validate and pass human review
before the topic enters the production manifest.

Each Practical Dutch lesson provides a short five-to-seven-minute first path
through context, useful sentences, selected phrases and vocabulary, one
language focus, six deterministic core exercises, an intentional keep stage,
and optional extra practice. It reuses the existing LearningRecordStore,
typed background learning boundary, Saved-item merge, rhythm, Today/resume,
and evidence seams. It does not create a second mastery model, scheduler,
queue, Daily Five system, content backend, or runtime AI path.

The existing `dutchmate.learningRecord.v2` storage key remains unchanged.
Practical Dutch progress is an optional additive section. Existing records are
read as having empty Practical Dutch progress when that section is absent.
Existing backup versions remain importable, new exports preserve all existing
sections, and failed parsing or migration leaves the previous record intact.

## User Stories

1. As a DutchMate learner, I want to find Practical Dutch in the existing Lessons surface, so that I can learn everyday Dutch without learning a new navigation model.
2. As a DutchMate learner, I want existing Practical Stories lessons to remain available after the rename, so that I do not lose access to lessons I already know.
3. As a DutchMate learner, I want my existing curated mini-lesson progress to remain unchanged, so that a new content format does not reset my learning history.
4. As a DutchMate learner, I want to see Supermarket and shopping as one topic, so that the A1 and A2 lessons feel related rather than like unrelated cards.
5. As a DutchMate learner, I want to see both A1 and A2, so that I can choose the level that fits my immediate need.
6. As a DutchMate learner, I want A1 recommended without A2 being locked, so that I receive useful guidance without an artificial gate.
7. As a DutchMate learner, I want A2 promoted after I complete A1, so that I know what to do next in the same practical domain.
8. As a DutchMate learner, I want A1 and A2 to have separate progress, so that completing one level does not falsely complete the other.
9. As a DutchMate learner, I want to pause after any stage or exercise, so that a short lesson fits around real life.
10. As a DutchMate learner, I want to resume at the stage where I stopped, so that I do not need to repeat completed work unnecessarily.
11. As a DutchMate learner, I want to read a short supermarket context first, so that new language has a recognizable situation.
12. As a DutchMate learner, I want useful standalone sentences after the context, so that I can reuse language outside the lesson story.
13. As a DutchMate learner, I want reusable chunks highlighted as chunks, so that I learn expressions rather than isolated words only.
14. As a DutchMate learner, I want a deliberate vocabulary set, so that the words support the lesson outcome instead of appearing arbitrary.
15. As a DutchMate learner, I want Dutch examples with English and Telugu support, so that the Learning triangle remains available throughout the lesson.
16. As a DutchMate learner, I want A1 practice to help me find products, ask simple questions, and pay, so that I can handle a basic supermarket visit.
17. As a DutchMate learner, I want A1 to teach `Waar kan ik ... vinden?` through product substitutions, so that I can adapt the pattern to new products.
18. As a DutchMate learner, I want A2 practice to help me ask for product information and resolve a simple problem, so that I can handle a more demanding supermarket interaction.
19. As a DutchMate learner, I want A2 to teach `Kunt u controleren of ...?`, so that I can ask staff to check information politely.
20. As a DutchMate learner, I want core exercises to move from understanding to controlled use, so that practice supports the practical outcome.
21. As a DutchMate learner, I want deterministic answer choices and feedback, so that I understand why an answer is correct or incorrect.
22. As a DutchMate learner, I want retry support without first-attempt perfection being required, so that an error becomes useful practice rather than a failure state.
23. As a DutchMate learner, I want optional extra practice after the core path, so that I can review more without making the first session too long.
24. As a DutchMate learner, I want extra practice not to complete the lesson again, so that rhythm activity reflects actual lesson completion once.
25. As a DutchMate learner, I want to choose which useful words or chunks to save, so that Saved reflects my intentions rather than every authored vocabulary item.
26. As a DutchMate learner, I want a selected chunk to merge with an existing Saved item, so that the same Dutch item does not receive duplicate mastery records.
27. As a DutchMate learner, I want Saved-item mastery and existing contexts preserved when a lesson adds a source, so that new teaching context enriches rather than resets my learning.
28. As a DutchMate learner, I want completed lesson activity to appear in the existing rhythm, so that Practical Dutch participates in the same learning rhythm as other lessons.
29. As a DutchMate learner, I want Today to resume the most recently updated incomplete Practical Dutch activity, so that I can continue intentionally without a lesson starting automatically.
30. As a DutchMate learner, I want a completed A1 topic to suggest A2, so that the next action is clear without changing my learner level.
31. As an installed DutchMate user, I want an extension update from a browser store to preserve my existing local learning record, so that a release does not erase my progress.
32. As an installed DutchMate user, I want old lesson progress, Saved items, mastery, rhythm, grammar, contrast, and Verb Journey evidence to remain readable after the update, so that all prior learning remains trustworthy.
33. As an installed DutchMate user, I want old backup files to import after the feature ships, so that I can restore history created before Practical Dutch existed.
34. As an installed DutchMate user, I want a failed migration to leave my previous record intact, so that a malformed new field cannot destroy recoverable history.
35. As a content author, I want one typed Practical Dutch package to contain a complete A1/A2 topic, so that paired release and shared metadata are explicit.
36. As a content author, I want to add a future topic through validated authored data, so that normal content growth does not require editing popup logic.
37. As a content author, I want a clear contract for outcomes, context, sentences, chunks, vocabulary, language focus, exercises, provenance, and review, so that content quality is consistent.
38. As a content author, I want A1 and A2 separation checks, so that A2 is not merely a longer version of A1.
39. As a content author, I want structural validation to catch missing references, bad counts, duplicate IDs, and unsafe answers, so that review time is spent on language and pedagogy.
40. As a content reviewer, I want the entire topic excluded when either level is draft or invalid, so that learners never see a misleading half-topic.
41. As a content reviewer, I want original-content provenance and named review metadata, so that published material remains auditable.
42. As a content reviewer, I want English and Telugu support reviewed separately from structural validation, so that translation quality is not falsely inferred from schema validity.
43. As a maintainer, I want the new package to use the existing content catalog, so that there is one bundled authored-content boundary.
44. As a maintainer, I want the feature to use existing answer checking and evidence seams, so that Practical Dutch does not introduce a parallel learning system.
45. As a maintainer, I want stable lesson identities and content versions, so that meaning-changing content can evolve without silently reinterpreting old progress.
46. As a maintainer, I want the current storage key to remain unchanged, so that browser-store updates preserve local extension data.
47. As a maintainer, I want a full old-record fixture to survive a read/write/export/import round trip, so that compatibility is verified rather than assumed.
48. As a maintainer, I want invalid production content to fail closed, so that malformed data cannot render in a released extension.
49. As a maintainer, I want the same bundled content behavior in Chrome and Firefox, so that browser packaging does not create different lesson availability.
50. As a maintainer, I want keyboard, focus, narrow-popup, and multilingual wrapping checks, so that the richer lesson remains usable in the extension's real layout.

## Implementation Decisions

- The feature code and codename are `023` and `practical-dutch`.
- The user-facing category is `Practical Dutch`; no new bottom-navigation tab
  or separate course destination is introduced.
- The stable parent pathway is `shopping-and-cafes`. The pilot is a Practical
  Dutch topic within that pathway, not a duplicate pathway.
- Existing curated mini-lessons remain their current authored and runtime
  contract. They are exposed through a compatibility adapter and are not
  mass-converted for this feature.
- The published content boundary is the existing bundled content catalog. A
  typed `practical-dutch` family is added to that catalog rather than creating
  a second catalog or content database.
- One topic package contains shared metadata and both stable A1/A2 lesson
  payloads. The package is released atomically; each lesson retains its own
  content version for progress compatibility.
- A production topic requires both levels to pass structural validation and
  human review. Draft or invalid content may be visible to local authoring
  tools but is excluded from the production manifest.
- Each lesson contains four to eight context lines, eight to twelve useful
  sentences, four to eight chunks, eight to fifteen vocabulary items, one
  primary language focus, at most one supporting observation, six core
  exercises, and six to ten extra exercises.
- The first path is approximately five to seven minutes. Extra practice is
  optional and does not alter completion or rhythm counts.
- Exercises are click-, tap-, or keyboard-operated and deterministically
  gradable. Existing choice and token-order controls are reused; only the
  smallest feature-specific variants required by the content contract are
  added.
- Practical Dutch uses a feature-owned session and renderer with thin popup
  navigation integration. It does not create a new popup framework.
- The existing typed background learning boundary and LearningRecordStore own
  persistence. Practical Dutch progress is an additive optional section in the
  existing `dutchmate.learningRecord.v2` record; the storage key is unchanged.
- A missing Practical Dutch progress section reads as empty. Existing Saved
  items, lesson progress, mastery, rhythm, grammar, contrast, and Verb Journey
  evidence are preserved on all read/write paths.
- Progress is keyed by stable lesson identity and lesson content version. A
  meaning-changing content version starts safe new work while preserving old
  readable progress.
- Existing backup versions remain importable. New export and import behavior
  preserves all existing record sections and merges Practical Dutch progress
  without dropping unrelated local data.
- Migration and parsing failures are non-destructive: the previous stored
  record remains intact and the feature reports an unavailable/repairable
  state.
- Saved candidates use the existing canonical Dutch learning item. If a
  candidate already exists, its source and context are merged without
  resetting mastery or creating a duplicate.
- A1 recommends `Waar kan ik ... vinden?`. A2 recommends `Kunt u controleren
  of ...?`; `Ik zie dat ...; kunt u dit controleren?` remains supporting
  material.
- A1 and A2 remain visible and directly selectable. A1 is recommended, and A2
  is promoted after A1 completion without becoming a hard lock.
- Completion requires all six core exercises and the keep decision. Retry is
  supported, first-attempt perfection is not required, and extra practice does
  not complete the lesson again.
- Today/resume uses the existing continuation concept: the most recently
  updated incomplete activity is preferred, followed by the recommended next
  lesson, without automatic start.
- Learner-facing Dutch examples have reviewed English and Telugu support.
  Explanatory metadata may use the existing English-plus-Telugu support style;
  no runtime translation or fallback is introduced.
- Authoring guidance, the drafting prompt, the package template, and the pilot
  brief are feature-coded documentation artifacts. The prompt creates drafts
  only; human review is required before release.

## Testing Decisions

- Tests should verify observable behavior at stable seams, not private helper
  layout or incidental JSON ordering.
- The content-catalog seam will test package identity, schema/version support,
  atomic A1/A2 release filtering, duplicate IDs, references, quantity rules,
  deterministic lookup, review status, and bundled offline manifest behavior.
- The persistence seam will test Practical Dutch stage progress, completion,
  rhythm activity, Saved-item merge, backup import/export, content-version
  handling, and non-destructive failure.
- An upgrade-safety fixture will contain existing Saved items, mastery, lesson
  progress, rhythm, grammar, contrast, and Verb Journey evidence. Reading,
  updating, exporting, and importing it must preserve every existing section.
- Existing backup versions must remain importable, and the new backup round
  trip must retain Practical Dutch progress plus unrelated local history.
- The session seam will test stage transitions, resume at keep, retry, accepted
  answers, deterministic feedback, six-core completion, optional extra
  practice, and duplicate completion prevention.
- The popup integration seam will test the Lessons category rename, legacy
  lesson access, topic and A1/A2 navigation, A1-to-A2 recommendation, Today
  continuation, keyboard/focus behavior, narrow wrapping, Telugu support,
  error recovery, and completion flow.
- Browser build checks will verify that Chrome and Firefox include the same
  release-qualified bundled content and require no content network request.
- Structural tests cannot prove Dutch naturalness, English meaning, Telugu
  quality, pragmatic register, or pedagogical value. Those remain independent
  Dutch, English, Telugu, and exercise-review gates.
- Prior art includes content-catalog qualification tests, lesson catalog and
  lesson-session tests, typed background-message tests, LearningRecordStore
  migration/backup tests, popup integration tests, and Chrome/Firefox build
  checks.

## Out of Scope

- A remote content service, runtime content fetch, content CDN, or content
  database.
- Accounts, authentication, cloud learner-data synchronization, or
  cross-device progress.
- Bulk conversion or rewriting of the current 15 curated mini-lessons.
- Merging the new supermarket topic with completion state from existing
  shopping-and-cafes lessons.
- A second mastery model, practice queue, scheduler, Daily Five task family,
  or learner-facing course destination.
- Runtime AI, generated learner-facing content, automatic publishing, or
  external sentence databases.
- Free-text grading, speech recognition, audio, drag-and-drop matching, or
  required images.
- B1/B2 instruction, legal consumer-rights claims, or medical allergy advice.

## Further Notes

- The existing `Upgrade-safe learning history` glossary term is a release
  requirement, not a best-effort aspiration. Browser-store update behavior
  must be protected by fixtures and round-trip tests.
- Published content remains bundled/offline-first. Future remote public
  content, if justified later, should reuse the validated package shape without
  coupling it to private learner-data synchronization.
- This spec follows the accepted content-catalog and shared-practice ADRs. No
  new ADR is required unless implementation discovers a new hard-to-reverse
  trade-off.
- The implementation should be delivered as vertical slices. Ticket
  granularity and blocking edges are deliberately deferred to the separate
  `$to-tickets` approval gate.
