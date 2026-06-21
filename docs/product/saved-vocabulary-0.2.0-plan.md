# Saved Vocabulary 0.2.0 Plan

Last updated: 2026-06-21

This is the planning record for DutchMate `0.2.0`. The goal is to turn DutchMate from a lookup-only extension into the start of a learning loop, while keeping the first version local, private, and easy to explain.

## Product Goal

`0.2.0` should let users intentionally save useful single-word translations while reading, then view and manage those saved words locally in the extension.

This is the first step toward:

```text
Saved Word List -> Flashcards -> Spaced Repetition
```

## Non-Goals For 0.2.0

- No accounts.
- No sync.
- No cloud vocabulary storage.
- No flashcards yet.
- No spaced repetition yet.
- No phrase or sentence saving.
- No automatic hover-word saving.
- No backend schema or database.
- No new third-party API calls.
- No new browser permissions unless implementation proves one is required.

## Product Boundary

Saved vocabulary is separate from the translation cache.

```text
Translation cache = automatic, temporary, local, performance/cost feature
Saved vocabulary = intentional, visible, local, learning feature
```

The user should understand and control saved vocabulary directly. The low-level translation cache can stay bounded, boring, and mostly invisible.

## 0.2.0 User Story

As a Dutch learner, I want to save a selected word after translating it, so I can return to the words I personally noticed while reading.

## User-Facing Behavior

### Save

- A save control appears only after a successful selected single-word translation.
- Hover translations do not show a save control.
- Selected phrases and sentences do not show a save control in `0.2.0`.
- If the word is already saved for the same language direction, the UI should show that it is saved instead of creating a duplicate.

### View

- The Options page gets a saved-vocabulary section.
- The section shows saved words in a compact list.
- Each row should show:
  - source word;
  - source language;
  - translated text;
  - target language;
  - saved date or relative saved time.

### Manage

- Users can delete one saved word.
- Users can clear all saved words.
- Empty state says there are no saved words yet.

### Feedback

- Saving should give a small status update, such as `Saved`.
- Duplicate save should give a small status update, such as `Already saved`.
- Delete and clear should give clear status updates.

## Storage Model

Use `browser.storage.local`, not `storage.sync`.

Reason:

- raw vocabulary can reveal reading interests;
- browser sync storage is small and cross-device by default;
- local-only behavior is easier to explain for the MVP.

Suggested key:

```text
dutchmate.savedVocabulary.v1
```

Suggested entry shape:

```ts
type SavedVocabularyEntry = {
  id: string;
  text: string;
  normalizedText: string;
  sourceLanguage: "nl" | "en" | "te" | "auto";
  detectedSourceLanguage?: "nl" | "en" | "te";
  targetLanguage: "nl" | "en" | "te";
  translatedText: string;
  providerName: string;
  createdAt: number;
  updatedAt: number;
};
```

Do not store page URL or page title in `0.2.0`.

Reason:

- it keeps the privacy story simple;
- it avoids turning saved vocabulary into browsing history;
- context snippets can be considered later in `0.5.0`.

## Identity And Duplicates

Use a stable ID based on:

```text
normalizedText + sourceLanguage/detectedSourceLanguage + targetLanguage
```

For example:

```text
nl:hond->en
```

If dual-language output creates two translations for one selected word, save one entry per target language.

Example:

```text
nl:hond->en
nl:hond->te
```

This keeps later flashcard directions simple.

## Normalization

Start with the same conservative normalization style used by cache planning:

- trim surrounding whitespace;
- collapse internal whitespace;
- lowercase for the current MVP languages when safe;
- reject empty text;
- reject anything that is not exactly one word after normalization.

The saved display text should preserve a clean readable version, but the duplicate key should use normalized text.

## Limits

Initial limits:

- max entries: 1000;
- single-word selections only;
- no TTL for saved vocabulary.

Saved vocabulary should persist until the user deletes it. This is different from the translation cache, which can expire.

If max entries is reached, the app should refuse the new save with a friendly message instead of silently deleting older saved words.

## Data Flow

Save flow:

```text
webpage selection
-> content script translates selected word
-> user chooses Save
-> content script sends save request to background
-> background writes entry to storage.local
-> tooltip shows saved status
```

View/manage flow:

```text
Options page
-> storage.local saved vocabulary adapter
-> render saved word list
-> user deletes one or clears all
-> storage.local updates
```

No saved-vocabulary data should be sent to the backend in `0.2.0`.

## UI Placement

### Content Tooltip

For `0.2.0`, keep the tooltip small:

- show translation result;
- show a compact `Save` action only for successful selected single-word translations;
- after save, change the action/status to `Saved`.

Avoid adding complex controls to hover mode.

### Options Page

Add a new saved-vocabulary section near the Privacy section.

Suggested section content:

- saved word count;
- compact saved word list;
- delete button per row;
- clear all button;
- short privacy note.

Do not build flashcard UI in `0.2.0`.

## Privacy And Store Impact

Privacy copy needs a small update before release:

```text
Selected single words you choose to save are stored locally in your browser as saved vocabulary. DutchMate does not send saved vocabulary to an account or sync it across devices.
```

Store disclosures should mention:

- saved vocabulary is local;
- no account is required;
- no sync is used;
- no saved vocabulary is sold or used for ads/tracking.

No new permissions are expected if the feature uses existing `storage`.

## Manual Testing Scope

Test in Chrome and Firefox:

- selecting a single word shows a save control after successful translation;
- saving creates one or more local entries, depending on target output mode;
- duplicate save does not create duplicate rows;
- selected phrases do not show save;
- hover translations do not show save;
- Options page shows saved words;
- deleting one word works;
- clearing all words works;
- browser reload keeps saved vocabulary;
- uninstall/reinstall behavior follows browser storage behavior.

## Branch And Commit Plan

Use one feature branch for the full saved-vocabulary feature:

```text
feature/saved-vocabulary-local
```

Make multiple focused commits on that branch, then open one PR for the complete feature.

Recommended commit sequence:

1. `Plan saved vocabulary 0.2.0`
   - this planning doc;
   - docs index link;
   - no product code.

2. `Add saved vocabulary storage`
   - storage adapter under `src/background` or `src/vocabulary`;
   - entry type and normalization helper;
   - unit tests for add, duplicate, delete, clear, max entries, and one-word eligibility.

3. `Add save action for selected words`
   - content-to-background message for saving;
   - save control in selection tooltip;
   - focused tests around save eligibility and message handling.

4. `Add saved vocabulary options view`
   - render saved vocabulary list in Options;
   - delete one entry;
   - clear all entries;
   - manual testing docs.

5. `Prepare 0.2.0 release`
   - bump version to `0.2.0`;
   - release notes;
   - privacy/store copy updates;
   - package Chrome and Firefox;
   - browser smoke-test log.

Pull request:

```text
Add local saved vocabulary
```

The PR should cover the complete `0.2.0` saved-vocabulary feature, with the focused commits preserving the incremental implementation trail.

### Final Release Branch

Branch:

```text
release/0.2.0-saved-vocabulary
```

Use this only if the final packaging/version bump becomes easier to review separately after the feature PR. Otherwise keep release prep as the final commit on `feature/saved-vocabulary-local`.

Scope, if split:

- bump version to `0.2.0`;
- release notes;
- privacy/store copy updates;
- package Chrome and Firefox;
- browser smoke-test log.

## Open Decisions Before Implementation

Resolve these before PR 2:

- Should a dual-language tooltip save both translations at once, or should the user choose which target language to save?
- Should `sourceLanguage: "auto"` entries store `auto`, the detected language, or both?
- Should saved vocabulary live under `src/vocabulary/` as a shared domain module, with browser storage adapters in `src/background/`?
- Should the save action appear as a text button (`Save`) or a small icon button with accessible label?

## Recommended Defaults

Recommended answers for the open decisions:

- Save both target translations when dual-language output is enabled.
- Store both the requested source language and detected source language when known.
- Put pure vocabulary logic in `src/vocabulary/`; keep browser storage access in `src/background/`.
- Use a small text button first for clarity, then consider an icon later if the tooltip gets crowded.

These defaults keep the first implementation simple and learnable.

Treat these defaults as the approved `0.2.0` starting direction unless a later planning discussion explicitly changes them.
