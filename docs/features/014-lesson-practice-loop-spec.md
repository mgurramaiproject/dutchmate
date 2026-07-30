# Feature 014: Lesson Practice Loop

**Code name:** `lesson-practice-loop`

**Feature code:** `014-lesson-practice-loop`

**Branch:** `014-lesson-practice-loop`

**Status:** Published as [GitHub issue #113](https://github.com/mgurramaiproject/dutchmate/issues/113) with `ready-for-agent`; implementation is not approved.

**Source plan:** [014-lesson-practice-loop-plan.md](./014-lesson-practice-loop-plan.md)

**Architecture decision:** [ADR 0007](../adr/0007-014-lesson-practice-uses-shared-envelope-and-evidence.md)

## Problem Statement

DutchMate's curated mini-lessons teach practical Dutch, but lesson-integrated
practice coverage is uneven. A learner may read a useful micro-story and keep
learning items without receiving enough guided action, reduced-support
retrieval, or safe application of the lesson's primary outcome. The missing
practice is especially important as the catalog grows from A0 through A1 and
A2: future lessons need a repeatable standard rather than bespoke practice
design.

Learners should get more durable value from the same few minutes. They should
not have to find a separate grammar product, enter free-form Dutch, discover a
webpage match, or navigate a second queue. DutchMate must also retain their
local learning history when the extension updates in the browser.

## Solution

Give every published and future curated mini-lesson a lesson practice
envelope: understand one practical outcome, act with support, retrieve it with
less support, and apply it in a safe Dutch context. Interleave these behaviors
inside the existing three-to-five-minute lesson flow. Select the smallest
reviewed set of deterministic click-, tap-, or keyboard-operated primitives
that covers the lesson outcome; do not impose a fixed exercise quota.

Use one shared lesson exercise contract across Lessons, Daily Five, Contrast
Repair, eligible Saved-context practice, and Encounter Coaching. Existing
grammar-pattern and learning-item evidence remain the only progress owners.
Lesson completion remains its own record. The core lesson sequence is stable;
evidence may influence optional follow-up practice but does not branch or
silently skip the teaching path.

Every lesson provides a guaranteed in-lesson transfer step. Saved-context,
Sentence Trainer, and Encounter Coaching connections can extend transfer only
when their existing safety contracts find an eligible item or encounter.

The standard applies a support gradient across the Foundation progression:
tightly guided recognition and ordering at A0, controlled transformations and
contrasts at A1, and more varied reduced-support recombination at A2. All
learner-visible content is deterministic, versioned, automatically validated,
and independently reviewed by a fluent Dutch reviewer with grammar-teaching
competence.

The current twelve published lessons are backfilled. Future lessons cannot
ship without an outcome map, behavior coverage, guaranteed transfer, review
metadata, and compatible content-version behavior. Verb Timeline remains
deferred as priority 2 in the canonical parking lot.

## User Stories

1. As a DutchMate learner, I want every lesson to include meaningful practice, so that reading a story leads to usable learning rather than passive exposure.
2. As an A0 learner, I want practice to begin with clear choices and strong support, so that I can act successfully while learning basic Dutch.
3. As an A1 learner, I want to transform and repair short Dutch forms, so that I can apply patterns beyond one memorized sentence.
4. As an A2 learner, I want reduced-support recombination across practical contexts, so that I can handle more varied everyday Dutch.
5. As a learner, I want the lesson to teach one primary practical outcome, so that I know what the practice is helping me do.
6. As a learner, I want supporting vocabulary and grammar to serve the lesson outcome, so that practice does not become an unrelated grammar dump.
7. As a learner, I want explanation and practice interleaved, so that I can use a new idea while it is still meaningful.
8. As a learner, I want the normal lesson to remain about three to five minutes, so that DutchMate gives me high learning value per minute.
9. As a learner, I want practice to replace passive explanation where appropriate, so that the lesson does not become a long lesson followed by a mandatory quiz.
10. As a learner, I want the core lesson sequence to be predictable, so that I can replay it without navigating an adaptive lesson tree.
11. As a learner, I want reduced-support retrieval before I finish, so that I revisit the lesson with less help than during the first explanation.
12. As a learner, I want a safe application step inside the lesson, so that every lesson ends with a meaningful transfer action.
13. As a learner, I want external webpage practice to be optional, so that I do not have to search for a suitable page or sentence to finish my lesson.
14. As a learner, I want eligible Saved-context practice to reuse the existing Dutch reconstruction contract, so that a useful saved item can connect to the lesson without generated content.
15. As a learner, I want eligible Encounter Coaching to remain silent when no safe match exists, so that DutchMate does not interrupt ordinary browsing.
16. As a learner, I want lesson practice to use click, tap, or keyboard controls, so that I can practise without typing free-form Dutch.
17. As a keyboard-only learner, I want every practice choice and action to be keyboard-operable, so that I can complete the lesson without a pointer.
18. As a learner using the extension popup, I want controls and feedback to remain contained and readable, so that practice does not make the narrow surface overwhelming.
19. As a learner, I want feedback to explain one supported misconception or correction, so that a wrong choice teaches me what to notice next.
20. As a learner, I want feedback to stay within the scope of the exercise, so that DutchMate does not imply that one controlled rule explains all Dutch.
21. As a learner, I want valid alternatives accepted when the authored prompt allows them, so that correct Dutch is not rejected by an unnecessarily narrow checker.
22. As a learner, I want intentionally incorrect examples clearly separated from positive examples, so that I do not learn a distractor as valid Dutch.
23. As a learner, I want English or Telugu helpers only when they support the Dutch task, so that Dutch remains the learning language.
24. As a learner, I want a completed lesson to remain completed, so that adding practice does not reset my history.
25. As a learner, I want grammar practice to update the existing Pattern progress, so that I see one consistent meaning for Introduced, Practising, and Applied.
26. As a learner, I want vocabulary and meaningful-chunk practice to update the existing Learning item, so that lesson and Saved practice strengthen one item rather than create duplicates.
27. As a learner, I do not want a separate lesson mastery score, so that DutchMate avoids conflicting progress claims.
28. As a learner, I do not want a second scheduler or practice queue, so that my daily routine remains calm and understandable.
29. As a learner, I want Daily Five to remain the single daily habit, so that lesson-integrated practice does not create another obligation.
30. As a learner, I want due vocabulary work to remain protected when grammar practice is available, so that one practice family does not crowd out another.
31. As a learner, I want Contrast Repair to remain an eligible contextual extension, so that a controlled misconception can lead to precise practice without becoming a new destination.
32. As a learner, I want follow-up practice to use my existing bounded evidence, so that optional practice responds to learning without creating a behavioral timeline.
33. As a learner, I want no runtime translation or AI request during practice, so that practice is fast, local, private, and predictable.
34. As a learner, I want extension updates to preserve saved items, so that I do not lose my Dutch learning record.
35. As a learner, I want extension updates to preserve lesson progress and completion, so that an update does not make me repeat completed lessons.
36. As a learner, I want extension updates to preserve Pattern progress and bounded contrast evidence, so that previous practice remains meaningful.
37. As a learner, I want a failed storage migration to leave my previous record readable, so that an update cannot destroy my history.
38. As a learner, I want compatible new exercises to be additive, so that content expansion does not silently reinterpret earlier evidence.
39. As a learner, I want incompatible content changes to declare their migration behavior, so that progress is never silently reset or regraded.
40. As a learner, I want export and import to preserve compatible history, so that my local record remains portable without an account.
41. As a lesson author, I want one outcome map format, so that I can design new practice without inventing a new runtime model.
42. As a lesson author, I want to choose only the primitives that serve the outcome, so that short lessons remain focused.
43. As a lesson author, I want behavior coverage criteria instead of fixed exercise quotas, so that content quality matters more than exercise count.
44. As a lesson author, I want the A0-A2 support gradient documented, so that future lessons can increase challenge without creating separate modes.
45. As a lesson author, I want guaranteed in-lesson transfer requirements, so that external webpage eligibility is never a reason to omit application.
46. As a lesson author, I want stable identifiers and content versions, so that future content releases preserve learner history.
47. As a content reviewer, I want every learner-visible prompt, choice, answer, distractor, feedback message, and helper text enumerated, so that I can review the complete teaching experience.
48. As a content reviewer, I want each distractor tied to one precise misconception when it is evidence-bearing, so that feedback is explainable.
49. As a content reviewer, I want ambiguous options rejected or rewritten, so that DutchMate never pretends to grade an unclear question.
50. As a content reviewer, I want author, reviewer, date, version, source, and reuse provenance recorded, so that released content is accountable.
51. As a fluent Dutch reviewer, I want explanations to state their limits, so that a lesson does not overclaim what one pattern teaches.
52. As a maintainer, I want one shared exercise-result contract across surfaces, so that scoring, feedback, evidence, and idempotency cannot diverge.
53. As a maintainer, I want one typed boundary to validate practice results, so that malformed or stale learner actions cannot mutate progress.
54. As a maintainer, I want old local records and backups to remain readable, so that content delivery does not require account migration or data loss.
55. As a maintainer, I want the twelve existing lesson identities preserved, so that content backfill remains additive.
56. As a maintainer, I want invalid lesson practice content rejected before runtime use, so that unsafe content fails during validation.
57. As a maintainer, I want provider-isolation tests, so that practice cannot accidentally add translation cost or latency.
58. As an accessibility-conscious maintainer, I want focus, keyboard, feedback announcement, and narrow-popup behavior tested at the learner-visible seam, so that practice remains usable.
59. As a product owner, I want all current lessons covered, so that the feature does not leave the existing catalog with visibly uneven practice quality.
60. As a product owner, I want future lessons held to the same contract, so that the catalog does not regress as it grows.
61. As a product owner, I want no formal CEFR, uncued-production, or permanent-retention claim, so that product language remains honest.
62. As a product owner, I want Verb Timeline deferred separately, so that this feature proves the practice loop before adding another progress surface.

## Implementation Decisions

- The shared lesson practice envelope is a content and interaction contract,
  not a learner-facing mode. It supplies understand, guided action,
  reduced-support retrieval, and guaranteed in-lesson transfer.
- Every lesson has one primary outcome and limited supporting outcomes. Each
  learner-visible practice item must trace to that outcome map.
- Behavior coverage is required, but fixed exercise counts, verb quotas, and
  daily grammar quotas are not.
- A0, A1, and A2 use the same deterministic click-only exercise contract.
  Support, context variation, and recombination increase across levels.
- Lesson content remains stable across learners. Existing evidence may select
  optional follow-up work but does not branch the core lesson or silently skip
  teaching.
- The current twelve lessons are backfilled without changing their stable
  identities, completion records, or existing lesson-stage meaning.
- Future lessons must provide an outcome map, behavior coverage, guaranteed
  transfer, review metadata, stable identifiers, content versions, and
  migration compatibility before release.
- Existing grammar-pattern and learning-item records remain the progress
  owners. No lesson mastery record, second queue, second scheduler, or Verb
  Timeline is introduced.
- The shared exercise-result contract is reused by Lessons, Daily Five,
  Contrast Repair, eligible Saved-context practice, and Encounter Coaching.
  It owns finite accepted-answer handling, scoped feedback, evidence
  eligibility, idempotency, and persistence semantics.
- The guaranteed transfer step uses reviewed lesson context. Saved-context,
  Sentence Trainer, and Encounter Coaching integrations are optional and
  follow their existing eligibility and privacy boundaries.
- All released practice content is bundled, deterministic, fully enumerated,
  automatically validated, and independently reviewed by a fluent Dutch
  reviewer with grammar-teaching competence.
- Practice remains provider-free and does not store raw answers, arbitrary
  webpage text, response times, full attempt histories, or behavioral
  timelines.
- Local learning history is upgrade-safe. Compatible additions preserve
  existing evidence; incompatible changes require explicit migration; failed
  migrations are atomic and leave the prior readable record unchanged.
- The existing lesson rail, focused popup flow, Daily Five, export/import,
  accessibility behavior, and offline posture remain the primary integration
  surfaces.
- Verb Timeline is not part of this feature and remains priority 2 in the
  canonical parking lot.

## Testing Decisions

- Tests assert observable learner behavior and stable public contracts, not
  private helper names, collection choices, or incidental DOM structure.
- The highest shared seam is the typed background learning boundary, backed by
  the existing content validator and local learning-record store. New seams
  require evidence that the current boundary cannot represent the behavior.
- Content tests cover outcome alignment, behavior coverage, stable identifiers,
  duplicate content, missing review metadata, invalid accepted alternatives,
  unsupported distractors, incorrect positive-example pooling, missing
  feedback, invalid versions, and review provenance.
- Learning-record tests cover one canonical result, duplicate and stale
  submission protection, pattern and learning-item evidence ownership,
  existing scheduling semantics, compatible content additions, explicit
  incompatible migration, atomic migration failure, export/import, clear data,
  and preservation of all current lesson records.
- Lesson-session and popup tests cover the interleaved flow, stage behavior,
  stable completion, guaranteed transfer fallback, optional external-context
  entry, reduced support, keyboard operation, visible focus, feedback
  announcement, and narrow-popup containment.
- Daily Five, Contrast Repair, Saved-context, and Encounter Coaching tests
  verify that the shared contract preserves their current due selection,
  vocabulary protection, privacy boundary, and provider-free behavior.
- Future-authoring validation tests prove a lesson missing its outcome map,
  behavior coverage, guaranteed transfer, review metadata, or migration
  declaration cannot enter a release bundle.
- Existing grammar, learning-record, Daily Five, background, popup,
  persistence, backup, release, and privacy tests are the prior art. New tests
  extend those public seams rather than adding a parallel harness.
- Release evidence includes focused tests, the full relevant suite,
  typecheck, Chrome and Firefox builds/package checks, documentation checks,
  `git diff --check`, keyboard and popup manual evidence, offline/provider
  isolation, and independent Dutch review.

## Out of Scope

- learner-facing Verb Gym, Sentence Forge, Grammar Minute, or grammar tab;
- Verb Timeline or another progress visualization;
- a second queue, scheduler, lesson-specific due state, lesson mastery score,
  or personalization record;
- runtime AI, practice-time provider requests, arbitrary grammar parsing,
  automatic page scanning, or generated practice content;
- typed answers, free-form writing, speech grading, formal CEFR claims,
  uncued-production claims, or permanent-retention claims;
- fixed exercise, verb, lesson, or daily grammar quotas;
- branching or silently personalized lesson scripts;
- automatic chunk discovery, social practice, audio/listening, or Telugu
  learning mode;
- deleting, re-keying, silently resetting, or silently regrading local
  learning history;
- a product-wide learning-efficacy study or analytics system. Release
  qualification may record direct learner-flow and review evidence but must not
  overstate efficacy.

## Further Notes

- “All existing lessons” means the twelve currently published lessons in the
  bundled catalog at the time of Feature 014 planning.
- “Future lessons” means the authoring and release contract, not an attempt to
  author an unlimited future curriculum in this feature branch.
- A lesson may use different primitive combinations when its outcome map
  justifies them. The guarantee is behavior coverage and safe transfer, not a
  uniform exercise bundle.
- External contextual practice is never required to complete the lesson. If
  no safe Saved-context or webpage match exists, the reviewed in-lesson
  transfer step remains the learner's route.
- The specification does not authorize implementation until a ticket graph is
  separately approved and the frontier ticket is selected.
