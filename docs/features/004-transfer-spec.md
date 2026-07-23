# 004-transfer: Context Missions

GitHub issue: [#56](https://github.com/mgurramaiproject/dutchmate/issues/56)

Source plan: [004-transfer-plan.md](./004-transfer-plan.md)

Research and rationale: [004-transfer-research.md](./004-transfer-research.md)

Approved design: [Direction A · Context Slip](./004-transfer-design-mockups.html)

Deferred ideas: [004-transfer-parking-lot.md](./004-transfer-parking-lot.md)

## Problem Statement

DutchMate helps learners understand deliberately selected Dutch on real webpages, save useful words and meaningful chunks, and review those learning items later. The translation result solves the immediate reading problem, but it usually leaves the learner in a passive recognition state. Seeing a meaning once does not show that the learner can retrieve it later or reconstruct the Dutch when the same language appears in another context.

The extension's strongest advantage is the learner's authentic webpage context. Moving practice into a new content feed or popup tab would separate learning from that advantage, add another destination to maintain, and risk optimizing engagement rather than real-world transfer. The learner instead needs a very short, optional step at the moment of deliberate lookup: enough retrieval or reconstruction to make the encounter more useful without interrupting normal reading.

This step must remain learner-controlled, local, inexpensive, accessible, and honest about what it proves. It must not issue hidden translation requests, automatically save arbitrary selections, create a second mastery model, store browsing history, or award mastery for first exposure. It must also preserve the existing Today, Lessons, and Saved popup experience.

## Solution

Add **Context Missions** to DutchMate's existing webpage tooltip. A Context Mission is one learner-triggered, 20–45 second exercise anchored in Dutch deliberately selected on a real webpage. It is additive webpage behavior, not a new popup tab.

After a successful first translation of an eligible Dutch phrase or short sentence, the tooltip offers `Practise this`. Choosing it starts `Rebuild in context`: the selected Dutch is blanked from its context and its words or short fragments are shuffled for tap, click, or keyboard reconstruction. This first-encounter mission is exposure only and never changes mastery.

When a deliberate selection matches an existing saved word or meaningful chunk and the required helper data is available locally, DutchMate first shows `Seen before` with `Try from memory` and `Translate now`. `Try from memory` starts either `Recall meaning` or `Rebuild in context`, chosen from the weaker or earlier-due mastery dimension, without contacting the translation provider. `Translate now` preserves the normal translation flow. Completing an eligible repeat mission can update at most one recognition or recall dimension once.

The compact mission card remains non-modal, keeps the original page scrollable, supports keyboard operation and assistive status announcements, closes visibly or with Escape, and returns focus predictably. Mission construction is deterministic and local. It reuses the selected Dutch, page context, existing translation response, stored helper meanings, and canonical learning record.

## User Stories

### Entry and eligibility

1. As a Dutch learner, I want practice attached to Dutch I deliberately selected on a real webpage, so that learning remains relevant to what I was reading.
2. As a Dutch learner, I want `Practise this` offered after a successful eligible translation, so that I can choose whether to deepen the encounter.
3. As a Dutch learner, I want the normal translation result before first-encounter practice, so that the mission does not obstruct my immediate reading need.
4. As a Dutch learner, I want `Practise this` limited to selections containing 2–12 Dutch words, so that missions remain short and coherent.
5. As a Dutch learner, I want paragraph-sized or otherwise unsupported selections excluded, so that reconstruction does not become tedious.
6. As a Dutch learner, I want non-Dutch selections excluded, so that DutchMate does not create irrelevant missions.
7. As a Dutch learner, I want failed translations to omit `Practise this`, so that a mission is never built from incomplete data.
8. As a Dutch learner, I want ordinary hover translation to remain unchanged, so that passive reading stays lightweight.
9. As a Dutch learner, I want deliberate selection to remain the only Context Mission trigger, so that practice never starts unexpectedly.
10. As a learner who disabled the extension, I want Context Missions disabled too, so that the existing master control remains authoritative.
11. As a learner who disabled selection translation, I want Context Missions unavailable, so that the feature respects my existing settings.
12. As a learner, I want Context Missions available by default when selection translation is enabled, so that I do not need to discover another setting.
13. As a learner, I want no new Context Mission toggle in V1, so that settings remain understandable.

### First encounters

14. As a Dutch learner, I want a first eligible encounter to offer `Rebuild in context`, so that I actively process the Dutch I just translated.
15. As a Dutch learner, I want the selected Dutch blanked from its original sentence or short context, so that reconstruction preserves the real reading situation.
16. As a Dutch learner, I want the exact selected Dutch words or short fragments shuffled, so that the task tests order without inventing content.
17. As a Dutch learner, I want to place fragments by tapping or clicking them, so that reconstruction works in a compact browser surface.
18. As a keyboard user, I want to place fragments with Enter or Space, so that pointer input is optional.
19. As a Dutch learner, I want to return a placed fragment by activating it again, so that I can correct my answer without restarting.
20. As a Dutch learner, I want a `Reset` action, so that I can clear the reconstruction and try again.
21. As a Dutch learner, I want a `Check` action, so that I decide when my first answer is ready to score.
22. As a Dutch learner, I want the first checked order to determine the result, so that the evidence is consistent rather than improved through retries.
23. As a Dutch learner, I want capitalization, surrounding whitespace, and terminal punctuation ignored during comparison, so that formatting noise does not create a false error.
24. As a Dutch learner, I want an exact normalized order acknowledged as `Correct` with a plain explanation, so that I know my word order matches the original sentence.
25. As a Dutch learner, I want an incorrect order marked `Try again` and followed by the correct Dutch, so that the attempt produces immediate corrective feedback.
26. As a Dutch learner, I want optional replay after feedback, so that I can reinforce the correct order.
27. As a Dutch learner, I want replay prevented from changing the recorded result, so that one encounter cannot generate duplicate or upgraded evidence.
28. As a Dutch learner, I want first-encounter practice treated as exposure only, so that seeing and rebuilding new language is not mislabeled as durable mastery.
29. As a Dutch learner, I want first-encounter practice to leave Saved unchanged unless I explicitly save, so that practice never becomes automatic capture.
30. As a Dutch learner, I want a complete sentence to remain ephemeral even after practice, so that arbitrary sentence cards do not enter my learning record.
31. As a Dutch learner, I want an eligible word or candidate meaningful chunk to retain the existing `Save` or `Review & save` path, so that capture remains familiar and explicit.
32. As a Dutch learner who saves after a mission, I want a normal New learning item with no retroactive mastery, so that the record reflects what has actually been demonstrated.

### Saved repeat encounters

33. As a Dutch learner, I want a deliberate selection matching a saved word or meaningful chunk recognized locally, so that DutchMate can offer retrieval before revealing meaning.
34. As a Dutch learner, I want a saved repeat to show `Seen before`, so that prior learning is acknowledged without overstating mastery.
35. As a Dutch learner, I want `Try from memory` offered before a provider translation when local identity and helper data are sufficient, so that I can retrieve before seeing the answer.
36. As a Dutch learner, I want `Translate now` beside `Try from memory`, so that practice remains optional when I only need the meaning.
37. As a Dutch learner, I want `Translate now` to use the existing normal translation flow, so that the familiar lookup behavior remains available.
38. As a Dutch learner, I want a missing or stale saved-item identity to fall back to normal translation, so that I never receive a broken recall task.
39. As a Dutch learner, I want missing required helper data to fall back to normal translation, so that DutchMate does not present an answer it cannot reveal.
40. As a Dutch learner, I want `Try from memory` to use stored helper meanings, so that it creates no provider cost or delay.
41. As a Dutch learner, I want recognition practice when recognition is weaker or earlier due, so that the mission targets the most useful gap.
42. As a Dutch learner, I want reconstruction practice when recall is weaker or earlier due, so that Dutch production receives separate attention.
43. As a Dutch learner, I want deterministic tie-breaking when both dimensions need work, so that the choice remains predictable and testable.
44. As a Dutch learner, I want one saved repeat mission to update at most one mastery dimension, so that a short encounter cannot inflate progress.
45. As a Dutch learner, I want the mastery update recorded at most once even if I replay or repeat an action, so that duplicate UI events cannot create duplicate evidence.
46. As a Dutch learner, I want recognition and recall to continue using the canonical learning item, so that webpage practice and Daily Five do not diverge.
47. As a Dutch learner, I want Context Mission results to use the existing scheduling policy, so that the feature does not create a competing review algorithm.
48. As a Dutch learner, I want Today to reflect any resulting due-state change through its existing learning record, so that no separate mission summary is required.

### Recall meaning

49. As a Dutch learner, I want `Recall meaning` to show the saved Dutch in its webpage context, so that I retrieve the relevant sense rather than an isolated gloss.
50. As a Dutch learner, I want helper meanings hidden initially, so that I attempt retrieval before feedback.
51. As a Dutch learner, I want the prompt `What does this mean here?`, so that the task is concise and context-specific.
52. As a Dutch learner, I want to commit mentally rather than type, so that the exercise remains fast and accessible in a webpage tooltip.
53. As a Dutch learner, I want `Show meaning` to reveal the stored answer, so that I control the feedback moment.
54. As a Dutch learner, I want both English and Telugu revealed when both already exist, so that the existing helper-language triangle is preserved.
55. As a Dutch learner, I want only the configured available helper revealed when there is one, so that missing data is not fabricated.
56. As a Dutch learner, I want no extra request for a missing helper translation, so that reveal has no hidden cost.
57. As a Dutch learner, I want `Again` and `Got it` after reveal, so that the result matches Daily Five's simple interaction model.
58. As a Dutch learner, I want result controls unavailable before reveal, so that recognition evidence follows an actual retrieval attempt.
59. As a Dutch learner, I want `Again` or `Got it` to update only recognition mastery, so that meaning recognition remains distinct from Dutch recall.

### Mission-card interaction and accessibility

60. As a Dutch learner, I want the translation tooltip to expand into a compact mission card, so that practice stays attached to the selected webpage context.
61. As a Dutch learner, I want the mission card to remain non-modal, so that the page does not feel captured by the extension.
62. As a Dutch learner, I want the webpage to remain scrollable while the card is open, so that I can retain surrounding context.
63. As a Dutch learner, I want a visible close action, so that leaving the mission is always obvious.
64. As a keyboard user, I want Escape to close the mission card, so that exiting is fast and conventional.
65. As a keyboard user, I want focus to move predictably into an opened mission, so that I know where interaction begins.
66. As a keyboard user, I want focus returned predictably when the mission closes, so that I do not lose my place on the webpage.
67. As a keyboard user, I want every interactive fragment and action in a logical tab order, so that the whole mission is operable without a pointer.
68. As a low-vision keyboard user, I want visible focus on all controls, so that the active element remains clear.
69. As a screen-reader user, I want exercise changes, answer placement, check results, and corrections announced accessibly, so that visual state is not the only feedback.
70. As a touch user, I want usable tap targets without drag-and-drop, so that reconstruction works reliably in a compact surface.
71. As a Dutch learner, I want the mission to end with `Back to page`, so that the return to reading is explicit.
72. As a Dutch learner, I want closing an unfinished mission to discard it, so that I do not accumulate hidden queues or resume obligations.
73. As a Dutch learner, I want a mission to contain one exercise and no progress wizard, so that it normally takes only 20–45 seconds.
74. As a Dutch learner, I want no points, percentages, lives, or failure animation, so that playful feedback does not distract from learning evidence.

### Cost, privacy, resilience, and validation

75. As a Dutch learner, I want `Practise this` to reuse the completed translation response, so that starting a mission does not make another translation request.
76. As a Dutch learner, I want `Try from memory` to remain fully local, so that retrieval is immediate and free of provider usage.
77. As a Dutch learner, I want mission construction to use deterministic local logic, so that it does not depend on an LLM or generative service.
78. As a Dutch learner, I want the existing multi-target translation behavior left intact, so that any calls already required for English and Telugu are not confused with mission-specific calls.
79. As a privacy-conscious learner, I want unfinished answers and mission state kept only in memory, so that practice does not create a behavioral history.
80. As a privacy-conscious learner, I want no visited URLs or raw browsing history stored by Context Missions, so that webpage learning remains local and minimal.
81. As a Dutch learner, I want only an explicitly saved learning item, capped context, and one eligible mastery result persisted, so that durable state has a clear learning purpose.
82. As a Dutch learner, I want stale asynchronous responses ignored after closing or starting another lookup, so that an old mission cannot overwrite the current one.
83. As a Dutch learner, I want translation failure to preserve the existing error behavior, so that Context Missions do not make lookup less reliable.
84. As a Dutch learner, I want a mastery-storage failure reported without losing the webpage or falsely showing success, so that I can recover safely.
85. As a Dutch learner, I want unsupported selections to continue through the appropriate existing lookup behavior without mission controls, so that feature eligibility never becomes a translation regression.
86. As a Chrome or Firefox user, I want the same mission behavior and keyboard support, so that the feature is portable across DutchMate's supported browsers.
87. As a learner in a voluntary study, I want delayed checks in a different sentence, so that DutchMate evaluates transfer rather than immediate task completion.
88. As a privacy-conscious study participant, I want participation voluntary and separate from background extension telemetry, so that evaluation remains consent-based.
89. As a product stakeholder, I want translation-only encounters compared with translation-plus-mission encounters after 2–7 days, so that the reconstruction hypothesis can be tested.
90. As a product stakeholder, I want reading disruption observed alongside learning results, so that a beneficial exercise is not shipped at the expense of normal browsing.

## Implementation Decisions

- `004-transfer` adds Context Missions to the existing webpage selection-translation experience. It does not add, remove, or reorder popup navigation.
- The domain terms **Context mission**, **Mission evidence**, **Learning item**, **Meaningful chunk**, and **Real-world transfer** retain the meanings defined in the repository glossary.
- A mission session is an ephemeral state machine owned by the current deliberate selection. Starting another lookup, closing the card, disabling the extension, or navigating away invalidates the session and any late asynchronous result.
- The mission state distinguishes at least eligibility, pre-reveal repeat choice, first-encounter reconstruction, saved-repeat recognition, saved-repeat reconstruction, checked/revealed feedback, completion, and discarded states. A terminal state cannot record another result.
- `Practise this` appears only for a successful deliberate Dutch selection containing 2–12 word tokens and representing one phrase or short sentence. It remains hidden for hover, failed or non-Dutch lookups, and unsupported selections.
- The initial 2–12-token guardrail is a product constraint, not a claim that DutchMate can linguistically classify every phrase. Complete sentences may be practised ephemerally but never become learning items merely because they were eligible for a mission.
- A first encounter follows the normal translation path and can then enter `Rebuild in context`. Its translation response, selected Dutch, and captured page context are retained only for the current mission session.
- A saved repeat is resolved from the canonical local learning-item identity before provider reveal when possible. The pre-reveal state presents `Seen before`, `Try from memory`, and `Translate now` only when the item and locally required helpers are available.
- `Translate now` delegates to the existing translation path. If repeat identity, context, or helper data is unavailable, DutchMate falls back to that path rather than constructing a partial recall task.
- Mission selection targets the weaker mastery dimension first and the earlier-due dimension second, using the same stable tie rule as the canonical learning record. Recognition selects `Recall meaning`; recall selects `Rebuild in context`.
- `Recall meaning` shows Dutch and page context, hides available helper meanings, uses `What does this mean here?`, and requires `Show meaning` before `Again` or `Got it` becomes available.
- Helper reveal reuses exactly what is already stored: both English and Telugu when both exist, otherwise the one available configured helper. It never requests a missing helper for the mission.
- `Rebuild in context` blanks the exact selected Dutch from the displayed context and shuffles the selected words or deterministic short fragments. No generated distractors, paraphrases, hints, or alternative answers are introduced.
- Fragment generation and shuffling are deterministic for a mission session so rendering or focus changes cannot silently change the task. The implementation may seed the ordering locally but must not persist the seed or task.
- Available fragments and placed fragments are button-like controls. Activating an available fragment appends it; activating a placed fragment returns it. `Reset` restores the original shuffled set, and `Check` evaluates the current order.
- Reconstruction comparison normalizes capitalization, surrounding whitespace, and terminal punctuation only. It does not accept reordered words, synonym substitutions, or approximate generative scoring.
- Only the first `Check` determines mission evidence. Exact normalized order produces `Correct` with a plain confirmation that the word order matches the original sentence; any other order produces `Try again` and reveals the correct Dutch. Replay may change in-memory exercise state but cannot change or add evidence.
- A first-encounter mission is exposure only. It records no Mission evidence and never alters recognition, recall, or review scheduling.
- Saving remains a separate explicit action. Eligible words retain `Save`; candidate meaningful chunks retain `Review & save`; arbitrary phrases and complete sentences cannot be saved as learning items through Context Missions.
- Saving after a mission creates or merges a normal learning item under existing rules. It begins New when newly created and receives no retroactive mastery credit.
- An eligible saved-repeat completion submits one binary result for one mastery dimension through the canonical learning contract. Idempotency at the mission-session boundary prevents replay, double activation, retries, or duplicated messages from applying a second update.
- Context Mission results use the existing recognition/recall transition and scheduling policy. No mission-specific mastery, due queue, score, badge, streak, progress bar, history, or popup summary is introduced.
- Existing Today behavior may change only as a consequence of the canonical learning item and its due state changing. No mission-specific card or resume action is rendered in the popup.
- The tooltip becomes a compact non-modal mission card when practice starts. It never blocks page scrolling, traps focus as a modal, highlights the page automatically, or opens a side panel.
- Opening a mission moves focus to a predictable first heading or action. Closing through the visible action, Escape, completion, or safe failure returns focus to the initiating control when it still exists; otherwise focus falls back without throwing.
- Exercise controls support keyboard navigation and Enter or Space activation, maintain visible focus, and expose state changes and results through appropriate labels and live status. Drag-and-drop is not required or used.
- The approved learner-facing copy is `Practise this`, `Seen before`, `Try from memory`, `Translate now`, `What does this mean here?`, `Show meaning`, `Put the Dutch back`, `Reset`, `Check`, `Correct`, `Try again`, `Again`, `Got it`, and `Back to page`.
- Starting or completing `Practise this` must not call the translation provider again. `Try from memory` must not call it at all. Existing translation calls already made by the configured single- or multi-target lookup remain unchanged and are not mission-specific costs.
- Mission construction calls no LLM, generative model, text-to-speech service, or other new remote service.
- Mission selection, fragment construction, answer state, replay state, and unfinished work remain in memory. Context Missions persist no URL, browsing history, raw answer, mission history, completion queue, or resume state.
- Durable mutation is limited to existing explicit saved-item behavior, its capped page context and encounter metadata, and at most one eligible mastery update for a saved repeat.
- Storage or runtime failure must not fabricate success. The mission remains safely dismissible, and failure messaging identifies whether the learner can retry or return to the page.
- Existing architectural decisions remain authoritative: recognition and recall stay separate, learning records stay language-keyed, and the popup's approved learning surfaces remain unchanged. This feature introduces no conflicting architectural decision and therefore requires no new ADR at specification time.

## Testing Decisions

- Tests assert observable learner behavior, emitted public states, provider calls, typed learning operations, and rendered accessibility contracts. They avoid assertions about private helper names, internal collection choices, or exact DOM nesting that has no user-visible consequence.
- The primary behavioral seam is the webpage lookup module. It covers deliberate-selection eligibility, hover exclusion, first versus saved-repeat routing, pre-reveal choice, exercise selection, deterministic reconstruction outcomes, single-result idempotency, safe invalidation, translation fallback, provider call counts, and canonical mastery-result requests.
- Tests at the primary seam use a controllable translation and learning transport. They assert that a normal configured lookup may make its existing calls, while `Practise this`, `Try from memory`, fragment interactions, reveal, checking, replay, and completion add zero translation calls.
- Primary-seam tests cover selections below, within, and above the 2–12-word guardrail; non-Dutch and failed results; saved words and meaningful chunks; arbitrary sentences; absent identities; missing helpers; weaker and earlier-due mastery; stable ties; stale responses; closing; double activation; storage failure; and settings changes.
- The narrow rendered-UI seam is the tooltip view adapter. It covers the compact mission states and approved copy, context blanking, fragment movement, Reset and Check, helper reveal, Again and Got it, visible close, Back to page, and safe error presentation.
- Rendered-UI tests assert semantic controls, accessible names, logical keyboard order, Enter and Space activation, visible focus hooks, live status announcements, Escape behavior, predictable focus entry and return, and continued page scroll. They do not snapshot decorative markup.
- Existing webpage lookup tests provide prior art for event ordering, translation failure, stale lookups, saving, and transport call assertions. Existing tooltip DOM tests or equivalent DOM-level adapter tests provide prior art for rendering; Context Missions add this narrow test surface where the current tooltip lacks sufficient coverage.
- Existing canonical learning-contract regressions continue to prove recognition and recall transitions, scheduling, persistence, and idempotent message handling. Context Mission tests prove that only the eligible one-dimensional result is submitted; they do not duplicate every scheduling transition at the webpage seam.
- Existing popup regression tests prove that Today, Lessons, and Saved remain the only primary areas and that canonical mastery changes continue to appear through normal popup data. No mission-specific popup suite or navigation state is added.
- Focused accessibility review includes keyboard-only completion of both exercises, screen-reader announcement checks, zoom and narrow viewport behavior, visible focus, touch-target usability, Escape, focus return, and confirmation that the card is non-modal.
- Manual Chrome and Firefox checks cover real selection behavior, card positioning near viewport edges, page scrolling while open, selection replacement, page navigation, provider failure, extension disablement, and browser-specific focus behavior that a DOM environment cannot represent reliably.
- Full engineering verification includes focused tests, type checking, the complete relevant regression suite, Chrome and Firefox builds, generated manifest and packaged-output checks where affected, and privacy/release documentation review.
- A release is shippable only when automated tests prove zero incremental translation requests for mission actions and all safe-failure cases preserve normal webpage use.
- Learning validation is a separate post-release gate. A small voluntary study compares translation-only items with translation-plus-mission items, checks recognition or reconstruction after 2–7 days in a different sentence, and observes reading disruption.
- Completion count, clicks, time spent, repeat usage, or immediate reconstruction accuracy do not establish real-world transfer. Context Missions remain described as experimental until delayed learner evidence supports the learning hypothesis.

## Out of Scope

- A fourth popup tab, popup mission card, popup resume control, side panel, or changes to the Today, Lessons, and Saved information architecture.
- Automatic mission launch, passive page scanning, automatic highlighting, or missions triggered by ordinary hover.
- Required typing, free-form written answers, spelling assessment, or drag-and-drop interaction.
- Voice, audio, recording, pronunciation, speech recognition, listening exercises, or text-to-speech.
- LLM-generated questions, distractors, explanations, examples, paraphrases, or approximate answer scoring.
- Additional translation calls for mission creation, a missing helper language, or replay.
- Automatic saving of mission selections, arbitrary phrase cards, complete sentence learning items, or retroactive mastery after saving.
- A second mastery algorithm, mission progress model, mission history, unfinished queue, resume state, score, percentage, points, badges, lives, streaks, or separate popup reporting.
- News headlines, quotations, sayings, poems, songs, daily content feeds, narrow-reading trails, culture decoding, Pattern Lab, sentence coaching, Can-do Passport, or personalized remix lessons.
- Background learning telemetry, stored URLs, browsing history, raw answer logs, or engagement-only learning claims.
- Changes to provider selection, translation cache policy, Google Cloud Translation pricing, or the existing configured single- and multi-target lookup behavior.
- A full experiment platform or automatic cohort assignment. The initial learning study remains small, voluntary, and separately operated.

## Further Notes

### Approved design

Direction A, **Context Slip**, in the interactive design mockups is the implementation source of truth. Implementation must preserve its webpage-first structure, orange context tether, white non-modal card, visual hierarchy, learner-facing copy, controls, responsive behavior, and accessible interaction states. Directions B and C remain exploration history and must not be substituted during implementation without a new explicit design decision.

### Approved test seams

1. The webpage lookup module is the primary behavioral seam for Context Mission orchestration and provider-cost assertions.
2. The tooltip view adapter is the narrow rendered-UI seam for mission interaction and accessibility.
3. Existing canonical learning and popup suites remain regression evidence; no third mission-specific seam or popup feature surface is introduced.

### Validation status

The pedagogical case supports contextual attempt, retrieval, corrective feedback, and separate recognition/recall practice. It does not directly validate DutchMate's exact shuffled reconstruction mechanic, 20–45 second target, or tooltip placement. Those are explicit product hypotheses. Engineering readiness and learning validation must therefore remain separate claims.

### Delivery guidance

Break implementation into independently verifiable tracer-bullet tickets after this specification is approved. The first slice should prove the full local path for one eligible first-encounter reconstruction at the two approved test seams, including zero incremental provider requests and safe dismissal. Saved-repeat routing and canonical mastery evidence should build on that path rather than introducing a parallel mission system.

### Artifact family

All feature-specific artifacts use the `004-transfer` filename prefix and remain on `feature/004-transfer` unless a later approved ticket plan changes branch strategy. This specification records behavior and testing boundaries only; it does not authorize implementation before ticketing and approval.
