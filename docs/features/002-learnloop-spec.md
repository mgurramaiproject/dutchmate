# 002-learnloop: Contextual Mastery and Curated Mini-Lessons

GitHub issue: [#31](https://github.com/mgurramaiproject/dutchmate/issues/31)

Source roadmap: [002-learnloop-priority-roadmap.md](./002-learnloop-priority-roadmap.md)

Lesson contract: [002-learnloop-mini-lesson-pattern.md](./002-learnloop-mini-lesson-pattern.md)

Deferred ideas: [002-learnloop-feature-parking-lot.md](./002-learnloop-feature-parking-lot.md)

## Problem Statement

DutchMate helps learners understand Dutch on real webpages and can save and review single words, but it does not yet form a complete browsing-to-fluency loop. Saved vocabulary cannot represent meaningful chunks reliably, repeated encounters do not enrich a learner's context, and the fixed four-rating schedule treats recognition and recall as if they were the same ability. The current popup presents several review choices rather than one calm daily practice path.

Incidental web reading also leaves systematic gaps. A learner may repeatedly translate useful language without meeting essential A0-A2 patterns for appointments, transport, work, healthcare, neighbours, or official life. DutchMate has no dedicated, reviewed teaching surface to close those gaps, and adding disconnected lessons would risk creating a second vocabulary and progress system.

The learner needs one local learning record that joins learner-controlled webpage captures, meaningful chunks, adaptive flashcard practice, and short curated mini-lessons. The experience must remain dead simple, require no typing or account, respect the Dutch-English-Telugu learning triangle, and use playful feedback only when it represents meaningful learning.

## Solution

Turn DutchMate into a browsing-to-fluency learning companion through one shared `002-learnloop` system.

Saved vocabulary becomes a collection of language-keyed learning items: Dutch words or meaningful chunks with English and Telugu helper meanings, sources, a small set of recent local contexts, and separate recognition and recall mastery. Learners explicitly confirm meaningful chunks before saving them. Deliberate interactions with saved items create local learning encounters without scanning or highlighting complete webpages.

The popup uses two primary areas: **Today** and **Lessons**, with Settings behind a header control. Today offers a single Daily Five action. Practice remains tap-to-reveal flashcards and asks only `Again` or `Got it`; card direction and spacing adapt behind the scenes. Lessons provide bundled, human-reviewed A0-A2 micro-stories in Dutch, English, and Telugu. Lesson candidates enter the same saved vocabulary and review system only after the learner confirms `Keep N for review`.

All learning data remains local, survives versioned export and import, and is evaluated through learner-visible retention evidence and small voluntary learner studies rather than background telemetry.

## User Stories

### Browsing and capture

1. As a Dutch learner, I want to save a useful Dutch word, so that I can practise language I encountered naturally.
2. As a Dutch learner, I want to save a meaningful Dutch chunk, so that expressions such as `een afspraak maken` are not broken into misleading isolated words.
3. As a Dutch learner, I want DutchMate to distinguish a meaningful chunk from an arbitrary sentence selection, so that my saved vocabulary remains useful.
4. As a Dutch learner, I want to review a candidate chunk before it is saved, so that I remain in control of my learning list.
5. As a Dutch learner, I want to see the normalized Dutch form, English meaning, Telugu meaning, and page context before confirming capture, so that I know what will be practised.
6. As a Dutch learner, I want an unavailable helper meaning identified clearly, so that partial data is not presented as complete.
7. As a Dutch learner, I want saving the same word or chunk again to enrich the existing item, so that I do not receive duplicate cards.
8. As a Dutch learner, I want a saved item to remember whether it came from a webpage or lesson, so that its origin remains understandable without splitting my progress.
9. As a Dutch learner, I want deliberate interactions with a saved item to count as encounters, so that DutchMate can show that I have met it in real reading.
10. As a Dutch learner, I want passive page views to remain unrecorded, so that DutchMate does not construct a browsing history.
11. As a Dutch learner, I want recent contexts stored locally with a strict cap, so that real examples remain useful without accumulating indefinitely.
12. As a Dutch learner, I want repeated identical contexts deduplicated, so that one page does not crowd out more useful examples.
13. As a Dutch learner, I want hovering or selecting a saved item to show a subtle `Seen before` cue, so that I can recognize prior exposure without interrupting reading.
14. As a Dutch learner, I want encountering an item to remain separate from recalling it correctly, so that exposure does not inflate mastery.
15. As a learner who explicitly enabled existing single-word auto-save, I want it to remain restricted to eligible single words, so that multiword selections never enter my vocabulary without item-level confirmation.

### Local learning record and compatibility

16. As an existing DutchMate learner, I want my current saved words and review history migrated, so that upgrading does not discard my work.
17. As an existing DutchMate learner, I want existing English and Telugu meanings preserved, so that migration does not reduce card quality.
18. As an existing DutchMate learner, I want imported and legacy cards to receive an explicit Dutch learning-language key, so that their identities remain stable.
19. As a learner, I want each learning item identified by learning language and normalized Dutch form, so that future internal changes do not create collisions.
20. As a learner, I want words and meaningful chunks represented by the same learning-item model, so that they share capture, mastery, review, and backup behavior.
21. As a learner, I want all learning data stored on my device, so that I can use DutchMate without creating an account.
22. As a learner, I want export to include learning items, meanings, sources, capped contexts, mastery, lesson progress, and learning rhythm, so that my complete learning record is portable.
23. As a learner, I want import to validate its version before changing local data, so that an incompatible document cannot corrupt my progress.
24. As a learner, I want import conflicts to preserve my newer local mastery while filling missing meanings or contexts safely, so that restoration does not reschedule known items unexpectedly.
25. As a learner, I want older DutchMate vocabulary backups to remain importable, so that the new schema does not strand previous exports.
26. As a learner, I want clearing saved vocabulary to remove associated mastery and contexts only after confirmation, so that destructive actions remain explicit.

### Today, mastery, and Daily Five

27. As a Dutch learner, I want the popup to open on Today, so that the next useful action is immediately visible.
28. As a Dutch learner, I want one primary Daily Five action, so that I do not have to choose among due, new, and all-card modes each day.
29. As a Dutch learner, I want Daily Five to select due learning items before new ones, so that scheduled practice is not displaced by novelty.
30. As a Dutch learner, I want Daily Five to contain at most one task per learning item, so that one item cannot dominate a short session.
31. As a Dutch learner, I want the Daily Five queue to remain a stable snapshot after I start, so that ratings do not reorder the current session.
32. As a Dutch learner, I want completing five items to finish today's goal, so that practice feels achievable.
33. As a Dutch learner with fewer than five available items, I want completing all available items to finish today's goal, so that I am not penalized for a small vocabulary.
34. As a Dutch learner with no available review items, I want a mini-lesson suggested but never started automatically, so that I retain control of my learning activity.
35. As a Dutch learner, I want the option to continue after Daily Five, so that motivation is not capped by the default goal.
36. As a Dutch learner, I want to reveal every answer before reporting a result, so that recall happens before feedback.
37. As a Dutch learner, I want only `Again` and `Got it` after revealing an answer, so that review remains dead simple.
38. As a Dutch learner, I want no typing in review, so that spelling input does not add friction to a browser-popup habit.
39. As a Dutch learner, I want Dutch-to-helper cards to strengthen recognition mastery, so that understanding written Dutch is measured honestly.
40. As a Dutch learner, I want helper-or-context-to-Dutch cards to strengthen recall mastery, so that producing Dutch mentally is measured separately.
41. As a Dutch learner, I want new items to begin with recognition before recall, so that initial practice is supportive rather than frustrating.
42. As a Dutch learner, I want card direction chosen from my weaker or earlier-due mastery dimension, so that practice targets the most useful gap.
43. As a Dutch learner, I want a failed result to weaken only the tested dimension, so that one mistake does not erase unrelated evidence.
44. As a Dutch learner, I want successful spaced results to move a dimension from New through Learning and Familiar to Strong, so that progress reflects durable practice.
45. As a Dutch learner, I want Strong items to return at increasing intervals, so that known language consumes less daily attention.
46. As a Dutch learner, I want overall mastery limited by the weaker of recognition and recall, so that passive recognition is not mislabeled as complete knowledge.
47. As a Dutch learner, I want Today to show understandable mastery and daily progress rather than algorithm details, so that the interface remains calm.
48. As a Dutch learner, I want settings accessible from a header control rather than a primary learning tab, so that configuration does not compete with practice.
49. As a keyboard user, I want Today, Lessons, Settings, review, and completion actions reachable with visible focus, so that the popup is fully operable without a pointer.
50. As a narrow-popup user, I want Today and focused review to fit without horizontal scrolling or unstable dimensions, so that the learning flow remains usable in Firefox and Chrome.

### Curated mini-lessons

51. As a Dutch learner, I want a dedicated Lessons area, so that I can deliberately close gaps that browsing may not cover.
52. As a Dutch learner, I want lessons organized by practical life pathway, so that I can choose what I need to accomplish in the Netherlands.
53. As a Dutch learner, I want every lesson title to begin with its CEFR level, so that difficulty is visible before I start.
54. As a Dutch learner, I want every mini-lesson to take roughly three to five minutes, so that the commitment is predictable.
55. As a Dutch learner, I want one coherent micro-story in each lesson, so that words and chunks appear in a believable situation.
56. As a Dutch learner, I want each micro-story to contain four to six short Dutch sentences or dialogue turns, so that it is substantial without becoming a reading assignment.
57. As a Dutch learner, I want English and Telugu help available line by line, so that I can clarify meaning without losing the Dutch story as the visual focus.
58. As a Dutch learner, I want one practical pattern highlighted in the story, so that I understand what the lesson is teaching.
59. As a Dutch learner, I want only the grammar needed for that practical pattern, so that explanations remain useful and brief.
60. As a Dutch learner, I want each lesson to introduce three to five reusable words or meaningful chunks, so that the lesson produces manageable review material.
61. As a Dutch learner, I want lesson practice to use the same tap-to-reveal cards as Daily Five, so that I do not have to learn a second interaction model.
62. As a Dutch learner, I want to replay the micro-story with less helper support after practice, so that I can notice improved comprehension immediately.
63. As a Dutch learner, I want lesson candidates preselected at completion, so that keeping useful material requires only one simple decision.
64. As a Dutch learner, I want to remove any candidate before confirming `Keep N for review`, so that saved vocabulary remains learner-controlled.
65. As a Dutch learner, I want unchosen lesson candidates to create no due work or long-term mastery, so that lessons do not silently fill my queue.
66. As a Dutch learner, I want `Already saved` shown for a lesson candidate I captured earlier, so that I understand why no duplicate will be created.
67. As a Dutch learner, I want lesson practice for a kept or already-saved item applied to the same mastery record, so that lesson and browsing progress converge.
68. As a Dutch learner, I want to continue an unfinished lesson from the point where I left it, so that closing the popup does not waste progress.
69. As a Dutch learner, I want to replay a completed lesson without duplicating its items, so that review remains safe.
70. As a Dutch learner, I want the first library to cover twelve accepted A0-A2 situations across all seven practical pathways, so that Lessons is useful at launch rather than a demo.
71. As a Dutch learner, I want lessons bundled with the extension, so that the library does not depend on a separate content service.
72. As a Dutch learner, I want published Dutch, English, and Telugu lesson content human-reviewed, so that I can trust the teaching material.
73. As a learner from a different family, work, or immigration background, I want lesson scenarios written inclusively, so that practical Dutch does not assume one life story.

### Calm engagement and validation

74. As a Dutch learner, I want a small acknowledgement when I finish Daily Five, so that meaningful consistency feels worthwhile.
75. As a Dutch learner, I want weekly active learning days shown without an endless streak, so that a missed day does not erase my history.
76. As a Dutch learner, I want the first missed day in a week treated as a grace day, so that the learning rhythm remains forgiving.
77. As a Dutch learner, I want a restrained acknowledgement when an item becomes Familiar or Strong, so that celebrations correspond to actual progress.
78. As a Dutch learner, I want practical milestones such as twenty-five meaningful chunks learned, so that progress is concrete rather than expressed as arbitrary experience points.
79. As a Dutch learner, I want mastery and rhythm indicators calculated locally, so that progress feedback does not require telemetry.
80. As a learner in a voluntary study, I want reduced-support story checks and delayed item checks, so that DutchMate is evaluated on learning rather than activity alone.
81. As a privacy-conscious learner, I want no background learning analytics, so that my review and lesson behavior stays on my device.
82. As a learner encountering a storage, import, or lesson error, I want a specific recovery message that preserves existing data, so that I know what happened and what to do next.

## Implementation Decisions

- `002-learnloop` teaches Dutch only. Dutch is the learning language and English and Telugu are helper languages. No learning-language switch is exposed.
- The new local learning record is explicitly language-keyed even though Dutch is the only supported learning language. Existing Dutch records migrate to the Dutch key.
- A learning item is identified by learning-language key plus normalized learning form. Its kind is `word` or `chunk`; an arbitrary phrase or complete sentence is not automatically a chunk.
- The initial chunk-candidate guardrail accepts a resolved Dutch form containing two to eight Unicode word tokens, no more than 80 characters, one line, and no sentence-ending punctuation. These rules prevent obvious sentences and fragments but do not claim linguistic certainty; item-level learner confirmation remains required.
- A learning item owns its Dutch form, optional English and Telugu meanings, timestamps, learning-item sources, capped contexts, encounter metadata, recognition mastery, recall mastery, and lesson associations.
- The local learning record is the canonical store for mastery and lesson progress. Existing saved translation-pair data remains readable during migration and may be retained as compatibility input until its callers move to the new model.
- Migration is idempotent. Re-reading legacy data must not duplicate learning items, sources, contexts, mastery, or lesson associations.
- Existing review history is migrated conservatively into recognition mastery. Recall mastery starts New because the old four-rating model did not prove which direction was practised. No old due time is moved later during migration.
- Learning-item sources distinguish confirmed webpage capture and chosen lesson candidate. Multiple sources merge into one canonical item without creating source-specific mastery.
- Meaningful chunks always require item-level confirmation. Existing opt-in automatic saving remains compatible only for eligible single words and must never auto-save multiword selections.
- Explicit capture presents the normalized Dutch form, helper meanings, and proposed page context before persistence. The learner can cancel without leaving a learning or encounter record.
- Learning encounters are recorded only when the learner deliberately invokes DutchMate on text that matches a saved item. Page loading, background scanning, and passive visibility do not create encounters.
- Each learning item retains at most three recent page contexts. Each context remains capped at 240 characters, must contain the item, and is deduplicated by normalized context text. Adding a fourth distinct context removes the oldest.
- Encounter count and recent contexts are exposure evidence only. They do not change recognition or recall mastery and do not satisfy a due task.
- The background learning contract owns storage mutation, migration, canonical merge, queue construction, mastery results, lesson keeping, backup, clear/delete behavior, and badge refresh. Content and popup surfaces use typed runtime messages rather than direct storage access.
- Recognition and recall are stored as independent mastery dimensions with state, due time, interval, attempt count, successful-result streak, and last-practised time.
- Both mastery dimensions begin New and unattempted. A completely new item is offered in the recognition direction first; recall becomes eligible in a later session after the first recognition attempt.
- A `Got it` result updates only the tested dimension using the initial policy: New to Learning after 1 day, Learning to Familiar after 3 days, Familiar to Strong after 7 days, and Strong remains Strong while its prior interval doubles to a maximum of 60 days, beginning at 14 days.
- An `Again` result updates only the tested dimension, resets its successful-result streak, schedules it after 1 day, and weakens Strong to Familiar or Familiar to Learning. New and Learning become or remain Learning.
- Overall mastery is the weaker of recognition and recall. State ordering is New, Learning, Familiar, Strong.
- When choosing card direction, select the eligible due dimension with the weaker state, then the earlier due time. Stable ties alternate from the last tested direction. An untouched item uses recognition first.
- Daily Five creates a snapshot of at most five distinct learning items. It takes previously attempted due tasks by earliest due time, then unattempted tasks by oldest item creation time. Only one mastery dimension per item appears in a snapshot.
- Completing every task in the snapshot completes the daily goal. Therefore a snapshot of one to four tasks is a valid Daily Five completion. An empty queue shows a lesson suggestion but does not auto-start or fabricate review work.
- After completion, the learner may start another fresh optional queue. Optional continuation does not alter the recorded completion of the first Daily Five.
- `Again` and `Got it` replace the current four learner-facing rating choices for the new mastery flow. Stored legacy ratings remain migration input but are not shown as new scheduling choices.
- The popup has two primary areas, Today and Lessons. Today is the default. Settings is opened from a labelled, keyboard-accessible header control.
- Focused review and lesson flows temporarily hide top-level navigation and provide a clear back or exit action. Closing the popup persists completed mutations and resumable lesson position but not an unfinished review-card reveal.
- Today shows the current Daily Five target and progress, a primary start/continue action, a quiet recognition/recall summary, an optional continue-lesson card, and access to the complete saved-vocabulary manager.
- The toolbar badge continues to represent reviewed work due now, respects the existing badge preference, and hides at zero. It must not count untouched new tasks or lesson candidates.
- The bundled lesson catalog has one versioned public data contract and validator. Each lesson includes a stable ID, version, pathway, pathway order, CEFR level, title, estimated duration, micro-story lines with Dutch/English/Telugu text and speaker roles, central pattern, concise helper-language explanation, three to five candidates, and practice prompts.
- Lesson titles are prefixed with their CEFR level. The catalog is grouped by practical life pathway rather than by a standalone grammar or CEFR tree.
- A micro-story contains four to six short sentences or dialogue turns and normally 35 to 60 Dutch words. Line-level English and Telugu help is revealed on demand.
- Every lesson follows four stages: Read the situation, Notice the pattern, Practise with flashcards, and Replay and keep.
- Lesson practice uses an in-memory session until the keep step. Results for kept or already-saved candidates are applied to the canonical mastery record at confirmation; results for unchosen candidates are discarded.
- The keep summary preselects three to five candidates, permits deselection, labels canonical matches `Already saved`, and performs one atomic `Keep N for review` mutation.
- Lesson progress records not-started, in-progress, or completed status, current stage, content version, and relevant timestamps locally. A content-version change must not duplicate kept items or erase completion without an explicit migration rule.
- Replaying a completed lesson is allowed. It may produce new practice evidence for already-saved items but never adds duplicate learning items.
- The initial bundled catalog contains the twelve accepted lessons in the order recorded by the lesson contract. Additional lesson content is outside this spec.
- Dutch, English, Telugu, CEFR, and cultural review are publication gates for lesson content and cannot be replaced by structural validation.
- Weekly consistency uses the learner's local calendar week and displays active learning days rather than an endless streak. Completing Daily Five or a mini-lesson makes the day active; the first inactive day is shown neutrally as a grace day and never deletes prior progress.
- Mastery celebrations occur only on upward transitions into Familiar or Strong and remain visually restrained. Practical milestones use real learning counts, not experience points, coins, leagues, or unlock economies.
- All new data is included in a new versioned backup document. Import must remain able to read the current vocabulary backup version and merge it into the language-keyed learning record.
- No provider credentials, translation cache entries, raw page content beyond capped contexts, or unrelated extension settings are included in the learning backup.
- No account, remote lesson catalog, cloud synchronization, or background learning telemetry is introduced.

## Testing Decisions

- Tests assert observable learning behavior and persisted contracts rather than private helper structure. Deterministic clocks and in-memory browser storage are preferred over mocking internal functions.
- The primary integration seam is the typed background learning contract exercised through the background message handler. It covers migration, word/chunk capture, canonical merging, encounters, context capping, mastery transitions, Daily Five snapshots, lesson keeping, badge updates, delete/clear behavior, and backup round-trips.
- Focused domain tests may supplement the primary seam for exhaustive scheduling state transitions, stable tie-breaking, normalization, legacy migration, and malformed import cases where covering every edge through one integration test would obscure the contract.
- Content-side tests exercise observable capture inputs and runtime requests. They cover single words, meaningful candidate chunks, arbitrary or overlong selections, confirmation and cancellation, context extraction, existing opt-in single-word auto-save, and interaction-based encounters.
- Popup tests extend the existing pure state and view-model prior art. They cover Today and Lessons navigation, Daily Five start/continue/completion, stable queue progress, front/reveal/result transitions, recognition/recall direction, no-typing controls, lesson resume, all four lesson stages, helper reveal, keep selection, `Already saved`, errors, and empty states.
- Rendered popup checks cover roles, labels, keyboard order, visible focus, header Settings access, focused-flow exit, disabled and pending states, narrow popup sizing, and absence of horizontal scrolling. Real Chrome and Firefox checks remain required for browser popup behavior that pure tests cannot represent reliably.
- A single lesson-catalog validator is the public structural seam for bundled content. Every one of the twelve lessons must pass it for stable identifiers, catalog version, pathway and order, CEFR-prefixed title, duration, four-to-six-line story, word-count range, complete trilingual lines, one pattern, three-to-five candidates, practice prompts, and unique candidate identities.
- Human lesson review verifies Dutch accuracy, English and Telugu meaning, CEFR fit, cultural suitability, practical usefulness, and reduced-support story comprehension. Automated structural validation does not claim to prove these qualities.
- Backup tests cover current-version migration, new-version round-trip, malformed and unsupported documents, context cap preservation, language-key identity, mastery conflict preservation, lesson progress, rhythm data, and exclusion of credentials and translation cache entries.
- Release tests extend the current generated-build and package validation prior art for both Chrome and Firefox. Expected outputs include popup, bundled lesson catalog, background, content script, Options, icons, browser-specific background declarations, and correct popup entry points.
- Full verification includes focused tests, typecheck, the complete regression suite, both browser builds, generated manifest inspection, packaged-output verification when release artifacts change, and manual keyboard and popup-size checks.
- Learning validation uses local delayed checks of Familiar and Strong items, reduced-support micro-story comprehension, a small observed cohort of Telugu-speaking Dutch learners, and voluntary feedback. Review count, lesson completion, or time-in-product alone does not demonstrate learning.

## Out of Scope

- Teaching Telugu or exposing a learning-language switch; that is parked as a separate future exploration.
- Accounts, cloud profiles, browser-managed synchronization, or cross-device conflict resolution.
- Remote lesson downloads, lesson marketplaces, or downloadable lesson packs.
- Live AI-generated lessons, personalized lesson templates, or community-authored lessons.
- Automatic chunk suggestions, passive webpage scanning, or automatic webpage highlighting.
- Saving arbitrary phrases, full sentences, or complete browsing history as learning items.
- Typed answers, spelling tests, drag-and-drop exercises, or learner-selected review intervals.
- Audio, speech capture, pronunciation feedback, or listening exercises.
- A full A0-B1/B2 curriculum, standalone grammar course, or lessons beyond the accepted twelve-item starter library.
- Sentence coaching, free-form AI explanations, or automatic example generation.
- Experience points, coins, avatars, leagues, public leaderboards, social challenges, or decorative collectibles.
- Background or default anonymous learning analytics.
- Provider credential, extension-setting, or translation-cache synchronization through the learning backup.
- Automatic promotion of exposure-only encounters into recognition or recall mastery.
- Replacing small voluntary learner studies with activity metrics.

## Further Notes

### Approved behavior and test seams

1. The typed background learning contract is the primary integration seam.
2. The content capture boundary covers webpage-specific selection and context behavior.
3. Public popup state and view models cover Today, review, Lessons, and focused lesson behavior.
4. One bundled lesson-catalog validator covers all twelve content objects structurally.
5. Existing generated-build and package verification covers Chrome and Firefox delivery.

### Ordered delivery slices

The implementation should follow the roadmap dependency order without combining the entire initiative into one change:

1. language-keyed learning-item schema, legacy migration, contexts, backup, and background contract;
2. explicit meaningful-chunk capture and interaction-based encounters;
3. recognition/recall mastery, binary results, Daily Five, badge, and Today state;
4. popup `Today | Lessons` information architecture and focused review flow;
5. bundled lesson contract, catalog validator, lesson progress, and keep mutation;
6. micro-story lesson UI and shared flashcard practice;
7. twelve reviewed starter lessons;
8. calm engagement and learner-visible progress; and
9. cross-browser, migration, accessibility, content, and learner validation.

Each slice must be independently verified and committed before the next meaningful slice. Ticketing may split these further where a tracer-bullet can remain independently useful.

### Design source

The extension continues to use DutchMate's black, white, and orange design system. Dutch micro-story text is the lesson's visual anchor; orange marks only the current pattern or learning item. English and Telugu help remains secondary and revealed on demand. Focused screens avoid decorative illustrations, gradients, confetti, and unrelated rewards.

The accepted popup direction is [Daily Edition with an explicit lesson stage rail](./002-learnloop-approved-popup-design.html), recorded in [ADR 0005](../adr/0005-002-learnloop-daily-edition-uses-lesson-stage-rail.md). Today uses the approved editorial direction A; focused lessons use direction B's equal-width `Read | Notice | Practise | Keep` rail. Top-level `Today | Lessons` navigation disappears during focused review and lesson work, which keeps an explicit Exit action.

### Artifact family

All feature-specific follow-on artifacts use `002-learnloop` in their filename. The ticket plan and popup design are approved. Implementation still begins one frontier ticket at a time only after the user approves that ticket.
