# PVR-001: Popup Vocabulary Review MVP

Parent issue: #20

## Problem Statement

DutchMate can already save single-word translation pairs locally, but learners have no focused way to practice those words. The existing Options page is a configuration and maintenance surface, not a lightweight daily review loop. The learner needs a popup that turns saved vocabulary into local, three-language review cards with a small, predictable review schedule.

## Solution

Add a browser-extension popup with two tabs:

- **Learn**, selected by default, for due-word review, new-word practice, all-word practice, and in-popup flashcards.
- **Settings**, for the review-specific preferences and vocabulary file management.

Review cards are canonical learning items centered on a Dutch learning word. Dutch, English, and Telugu meanings are assembled from the existing saved translation pairs. All vocabulary, page context, and review metadata remain in local extension storage.

## User Stories

1. As a Dutch learner, I want the popup to open on Learn, so that I can start studying without navigating through settings.
2. As a Dutch learner, I want to see how many words are due, so that I can decide whether to review now.
3. As a Dutch learner, I want to see my total saved words, so that I understand the size of my learning list.
4. As a Dutch learner, I want to see how many words are new, so that I can practice words I have not rated yet.
5. As a Dutch learner, I want a preview of recently saved words, so that I can recognize the latest additions.
6. As a Dutch learner, I want to start a due-word review, so that I can work through scheduled cards.
7. As a Dutch learner, I want to practice new words separately, so that first exposure is distinct from scheduled review.
8. As a Dutch learner, I want to review all cards, so that I can study outside the due schedule.
9. As a Dutch learner, I want the flashcard front to show progress, so that I know where I am in the session.
10. As a Dutch learner, I want the front to show the Dutch word and a Show Answer action, so that recall happens before the meanings are revealed.
11. As a Dutch learner, I want the back to show the Dutch word, English meaning, and Telugu meaning, so that I can connect the learning triangle.
12. As a Dutch learner, I want optional page context on the back, so that I can remember how I encountered the word.
13. As a Dutch learner, I want Again, Hard, Good, and Easy ratings, so that I can schedule the next review based on recall difficulty.
14. As a Dutch learner, I want rating a card to advance to the next card, so that review is continuous.
15. As a Dutch learner, I want the review schedule to be simple and predictable, so that Again and Hard schedule 24 hours later, Good schedules 3 days later, and Easy schedules 7 days later.
16. As a Dutch learner, I want new words kept separate from due words, so that the due count represents scheduled reviews rather than every saved word.
17. As a Dutch learner, I want to choose Dutch-to-helper or helper-to-Dutch practice, so that I can train recognition and recall in both directions.
18. As a Dutch learner, I want Dutch, English, and Telugu shown as the fixed MVP language roles, so that the review experience stays aligned with the learning triangle.
19. As a Dutch learner, I want to turn automatic saving of selected words on or off, so that I control whether reading actions add cards automatically.
20. As a Dutch learner, I want automatic saving to apply only to eligible single words, so that accidental phrases do not enter the vocabulary.
21. As a Dutch learner, I want to choose whether page context is shown, so that I can reduce visual clutter during review.
22. As a Dutch learner, I want the page-context setting to control display without silently deleting stored context, so that preferences do not destroy vocabulary data.
23. As a Dutch learner, I want the review badge enabled by default, so that the toolbar provides a visible reminder when scheduled reviews are waiting.
24. As a Dutch learner, I want the badge hidden when no reviewed cards are due, so that a zero does not create unnecessary noise.
25. As a Dutch learner, I want to disable the review badge, so that I can remove the reminder entirely.
26. As a Dutch learner, I want to export my vocabulary, meanings, page context, and review metadata, so that I can keep a portable backup.
27. As a Dutch learner, I want to import a versioned vocabulary file, so that I can restore or merge local study data.
28. As a Dutch learner, I want import conflicts to preserve my existing review state, so that importing a backup does not unexpectedly reschedule cards.
29. As a Dutch learner, I want to clear vocabulary only after confirmation, so that an accidental click cannot erase my learning list.
30. As a Dutch learner, I want clearing vocabulary to remove review data and hide the badge, so that the extension reflects the empty state immediately.
31. As a Dutch learner, I want existing saved translation pairs preserved during migration, so that this MVP does not discard words I already saved.
32. As a Dutch learner, I want cards with one missing helper meaning to remain reviewable, so that partial existing data is still useful.
33. As a Dutch learner, I want missing meanings to be shown clearly, so that DutchMate does not imply that an unavailable translation is complete.
34. As a Dutch learner, I want all review data to remain local, so that using the study feature does not require an account, cloud sync, or login.

## Implementation Decisions

- The vocabulary domain will expose canonical review cards while preserving compatibility with the existing saved translation-pair data.
- A canonical card is identified by the normalized learning-language word and its learning-language identity. Existing entries are grouped into that card; duplicate English/Telugu pair entries must not create duplicate review cards.
- A card may contain Dutch, English, Telugu, optional page context, creation/update timestamps, review state, due time, last-reviewed time, last rating, and review count.
- Existing saved entries are migrated locally when read or written. Existing pair data is retained; no automatic provider request is made to fill missing meanings.
- Partial cards remain reviewable. A missing helper meaning is rendered as unavailable rather than fabricated or silently omitted.
- Page context is captured from a reliable sentence containing the selected word at save time. It is capped at 240 characters. If no reliable sentence is found, no context is stored.
- The page-context setting controls whether stored context is displayed in the popup. It does not control whether available context is captured or delete existing context.
- New words are cards with no recorded rating. Due words are previously reviewed cards whose due time is less than or equal to the current time. New words are not included in the due count.
- Again and Hard schedule the card 24 hours after the rating. Good schedules 3 days after the rating. Easy schedules 7 days after the rating. Rating a new card makes it reviewed; Again does not return it to the new queue.
- Due, new, and all review sessions use a queue snapshot created when the session starts. Cards are ordered oldest due time first for due reviews and oldest creation time first for new/all reviews.
- The default card direction is Dutch to helpers. Reverse mode presents English as the helper-language prompt and reveals Dutch plus Telugu. If the prompt meaning is unavailable, the card remains visible with an unavailable marker.
- The popup displays Dutch, English, and Telugu as fixed read-only MVP language roles. General translation-language configuration remains outside this review MVP.
- Automatic saving is off by default and saves only eligible single-word selections after a successful translation. Manual saving remains available when automatic saving is disabled.
- The example/page-context display setting is on by default and hides the context section when a card has no stored context.
- The daily review badge is on by default. It shows the number of reviewed due cards, hides when that number is zero, and remains hidden when the setting is disabled.
- Badge calculation and updates belong to the background layer. The background updates it at extension initialization and after save, review, import, and clear mutations.
- Import/export uses a versioned JSON document containing review cards and their metadata, but not provider credentials or unrelated extension settings.
- Import merges by canonical card ID. Existing card review metadata wins on conflicts; missing meanings or page context may be filled from the imported card without rescheduling the existing card.
- Clear vocabulary requires confirmation and removes canonical cards, review metadata, and associated page context.
- The popup is a new extension entry point. The build configuration and generated browser manifests must include it for both Chrome and Firefox while preserving the existing background, content, and Options entries.
- Direction A is the selected visual direction. The popup uses a mobile-shaped composition with a 390x844 baseline content viewport, so the same Learn, flashcard, and Settings structure can later become a mobile app screen without redesigning the information architecture.
- The mobile-shaped composition keeps primary actions at least 44px tall, allows Settings to scroll vertically, and treats the phone frame as a design-preview device rather than a production UI dependency.
- Popup-to-background communication uses typed runtime messages. The popup does not access storage through an ad hoc second storage model.
- The existing Options page remains available for broader extension settings and existing vocabulary maintenance; the popup owns the review MVP interaction.

## Testing Decisions

- Tests must verify observable domain behavior, storage migration, message contracts, queue contents, schedule calculations, badge state, and popup state transitions rather than private implementation details.
- The vocabulary domain tests will cover canonical grouping, preservation of existing pair data, partial cards, new/due classification, rating schedules, queue ordering, and clear behavior.
- Import/export tests will cover the versioned format, malformed input rejection, merge behavior, conflict preservation, and exclusion of unrelated settings or credentials.
- Background controller tests will cover list/summary, review mutation, import, clear, initialization badge updates, and mutation-triggered badge updates.
- Shared settings tests will cover default values, normalization of the new boolean and direction settings, and preservation of existing settings behavior.
- Content-side tests will cover page-context extraction, the 240-character cap, missing-context behavior, and automatic-save gating.
- Popup tests will cover default Learn selection, summary rendering, queue start actions, front/back transitions, rating advancement, completion state, Settings toggles, import/export actions, and clear confirmation.
- Manifest/build verification will confirm that Chrome and Firefox outputs include the popup, background, content, Options page, icons, and correct browser-specific background declarations.
- Existing Vitest patterns, `tsc --noEmit`, and both browser build commands are the prior art for verification in this repository.

## Out of Scope

- Login, accounts, cloud sync, or server-side vocabulary storage.
- A full vocabulary dashboard with search, filtering, editing, tagging, or analytics.
- Automatic example-sentence generation.
- Automatic translation backfill for missing English or Telugu meanings.
- Adaptive or mathematically complete spaced repetition. The four fixed intervals are the entire MVP schedule.
- Notifications beyond the toolbar badge.
- Changing the learning triangle through the popup.
- Provider credential export.
- Cross-device merge conflict resolution beyond preserving existing local review state.

## Further Notes

### Ordered implementation slices

1. **Review-card domain and migration**: introduce canonical-card behavior, metadata defaults, SRS scheduling, queue classification, and focused tests.
2. **Background review controller and badge**: add typed list/summary/review/import/export/clear messages, local persistence, initialization, and mutation-driven badge updates.
3. **Settings and save behavior**: add normalized review settings, page-context capture, automatic-save gating, and focused content/settings tests.
4. **Popup shell and build integration**: add the popup entry, manifest/build wiring, Learn/Settings navigation, and static summary states.
5. **Learn session**: implement due/new/all queue starts, flashcard front/back state, progress, ratings, and completion behavior.
6. **Settings interactions and hardening**: implement import/export, clear confirmation, badge toggle, context visibility, responsive popup styling, and accessibility checks.
7. **Full verification and review**: run focused tests, typecheck, Chrome/Firefox builds, inspect generated manifests, run the full suite, and perform a standards/spec review.

Each slice should be independently verified and committed before the next slice begins.

### Seam check

The planned seams are intentionally narrow: canonical review-card behavior is centralized in the vocabulary domain; browser storage, runtime messages, and badge effects are centralized in the background controller; popup rendering owns only presentation/session state; and existing shared settings/build seams are extended rather than duplicated. This keeps the popup from becoming a second vocabulary implementation.
