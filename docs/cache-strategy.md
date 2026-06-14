# Cache Strategy

DutchMate should use caching to make repeat word lookups feel instant and to reduce translation provider cost. The cache must stay privacy-conscious: it should help with repeated words, not build a long-term record of what users read.

## Current Behavior

The current cache is `TranslationCache` in `src/translation/translation-cache.ts`.

- It is in memory only.
- It stores successful translation results.
- It is keyed by source language, target language, context, and text.
- It is lost when the browser restarts.
- It may be lost when the Manifest V3 background worker goes idle.

This is useful for repeated requests during active browsing, but it is not enough for token savings across sessions or days.

## Target Behavior

Use two cache layers:

1. In-memory cache
   - Keep the current fast cache.
   - Use it first for immediate repeat requests.
   - Keep it small and dependency-free.

2. Local persistent cache
   - Use extension `storage.local`.
   - Support Chrome and Firefox first.
   - Persist successful single-word selections only.
   - Do not persist hover translations, even when the hovered text is one word.
   - Use a 7-day TTL to start.
   - Cap stored entries at 1000 to start.
   - Keep this local to the browser profile.

Do not use `storage.sync` for raw translation cache entries. Sync is better for settings and small preferences. Raw translation history can feel invasive, may exceed browser storage limits, and should not move across devices by default.

## What To Cache

Persist only successful single-word selection results. Selection is intentional, while hover is passive. This keeps the persistent cache easier to explain and less likely to store words the user merely moved across.

Allowed:

- Selection translations where the selected text is exactly one word.
- Double-click word selections.
- Text that is exactly one word after normalization.
- Successful provider responses only.

Do not persist:

- Hover translations, including word-mode hover translations.
- Sentence-mode hover translations.
- Selected phrases or sentences longer than one word.
- Failed translation responses.
- Timeout errors.
- Empty text.
- Text above the normal hover word length limit.

The in-memory cache may still protect active-session repeat calls for other successful request shapes, but the persistent cache should be stricter.

## Cache Key

The persistent cache key should include:

- normalized text
- source language
- target language
- context

The first implementation can keep `context` in the key even though only single-word selection entries are persisted. This prevents accidental reuse if future contexts are allowed.

Keep cache entries separated by translation direction. For example, `nl -> en`, `nl -> te`, and `en -> nl` should be separate entries. This is safer because translation is not always reversible, providers may return different phrasing by direction, and partial misses stay simple to reason about.

The Options UI may count unique source words for user clarity, but the storage model should still count and store translation records by direction. A grouped shape such as one source word with multiple translations belongs in a future saved-vocabulary or learning feature, not in the low-level provider cache yet.

Normalize text before keying:

- trim surrounding whitespace
- collapse internal whitespace
- lowercase when safe for the current MVP languages

Do not normalize so aggressively that different words become ambiguous.

## Suggested Stored Shape

```ts
type PersistentTranslationCacheEntry = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: "selection";
  translatedText: string;
  providerName: string;
  createdAt: number;
};
```

Storage can use one object under a namespaced key, such as:

```text
dutchmate.translationCache.v1
```

Use a versioned key so future cache migrations can be handled cleanly.

## Eviction Policy

Start simple:

- TTL: 7 days.
- Max entries: 1000.
- Remove expired entries during reads and writes.
- When over capacity, remove the oldest entries first.

This is intentionally conservative. If users repeatedly look up common words, it saves provider calls. If they read sensitive pages, the cache remains local, temporary, bounded, and word-only.

## Browser Requirements

DutchMate currently targets Chrome and Firefox.

- Implement through the extension storage API abstraction used by the project.
- Verify behavior in both Chrome and Firefox.
- Do not add Chrome-only assumptions to the cache layer.
- Future browsers should be considered only after Chrome and Firefox behavior is reliable.

## User Trust

Before public launch, add an Options control:

```text
Clear translation cache
```

Later, consider a plain-language note:

```text
DutchMate stores recent single-word selections locally to make repeat lookups faster. Hovered words, sentences, and selected passages are not saved in the translation cache.
```

Avoid making users create an account for local cache. Accounts should wait until paid plans, saved vocabulary, cross-device sync, or abuse prevention require them.

Developer inspection and clearing steps are documented in [manual-testing.md](manual-testing.md#translation-cache-inspection).

## Incremental Implementation Plan

1. Add a persistent cache adapter that can read, write, expire, and evict entries in `storage.local`.
2. Add unit tests for TTL, max entries, and single-word selection persistence rules.
3. Wire the adapter behind the translation provider so it checks memory first, then local storage, then the provider endpoint.
4. Keep hover translations, sentences, and selected phrases out of persistent storage.
5. Update manual testing docs for Chrome and Firefox.
6. Add the future clear-cache Options control in a separate step.

Each step should stay small and committed separately.
