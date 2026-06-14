# Viral Adoption Roadmap

DutchMate should feel almost magically lightweight:

```text
Install extension
-> hover a Dutch word
-> instantly understand it
-> keep reading without breaking flow
```

The product should delay account creation, billing, and heavy setup until after users have already felt that value.

## Product Principles

- The first-use path should not require an account.
- The hover tooltip is the core "aha" moment.
- Free users should get real value, not a crippled demo.
- Paid features should deepen learning, not block basic usefulness too early.
- Privacy and trust are product features, not only legal requirements.
- Cache aggressively enough to feel fast and save provider cost, but not so aggressively that DutchMate feels like it is storing everything users read forever.
- Chrome and Firefox are the first supported browsers. Keep browser-specific behavior isolated so other browsers can be considered later.

## Free And Paid Plan Shape

Free plan, no account required:

- Hover translation.
- Selection translation with modest length limits.
- Dutch, English, and Telugu MVP language support.
- Local recent translation cache.
- Basic provider-backed translations when production backend costs are controlled.
- Clear limits before the user hits paid-only behavior.

Paid plan, account required:

- Higher daily or monthly translation limits.
- Better translation quality or premium provider routing.
- Phrase explanations and examples.
- Saved vocabulary.
- Review mode or spaced repetition.
- Cross-device sync for saved learning data.
- More languages after the MVP proves demand.
- Priority access if backend capacity becomes constrained.

Avoid requiring an account for:

- Basic extension settings.
- Local cache.
- First successful hover translation.
- Early MVP testing.

Introduce accounts only when one of these is true:

- Provider costs need quota enforcement.
- Paid subscriptions are ready.
- Saved vocabulary or learning history needs cross-device sync.
- Abuse prevention becomes necessary.
- Users are asking for durable personal learning features.

## Cache Strategy

Current cache:

- `TranslationCache` is in memory only.
- It is lost when the browser restarts.
- It may be lost when the Manifest V3 background worker goes idle.
- It is useful for immediate repeat requests, but not enough for long-term token savings.

Recommended cache layers:

1. In-memory cache
   - Keep this for instant repeated lookups during active browsing.
   - It should stay small and fast.

2. Local persistent cache
   - Use extension `storage.local`.
   - Cache successful single-word selections only.
   - Do not persist hover translations, even when the hovered text is one word.
   - Do not persist sentence-mode hover translations.
   - Do not persist selected phrases or sentences longer than one word.
   - Key by normalized text, source language, target language, and context.
   - Store a timestamp.
   - Start with a 7-day TTL.
   - Cap total entries, starting around 1000.
   - Add a "Clear translation cache" control before public launch.

3. Sync cache
   - Do not sync raw translation cache by default.
   - `storage.sync` is better for settings and small preferences.
   - Syncing every phrase a user reads can feel invasive and may hit browser storage limits.
   - Save cross-device sync for paid learning data such as saved words, not passive reading history.

Privacy stance:

- Local cache should be explained plainly.
- Users should be able to clear it.
- Hovered words, selected phrases, and sentences should not be persisted in the translation cache.
- Paid account data should have export and delete paths before a serious launch.

## Browser Support

Chrome and Firefox are the launch targets.

- Continue producing separate Chrome and Firefox build outputs.
- Keep using `webextension-polyfill` where it reduces browser-specific branching.
- Treat persistent cache behavior as a shared extension capability, not a Chrome-only feature.
- Test storage behavior in both Chrome and Firefox before relying on it for token savings.
- Consider other browsers only after the Chrome and Firefox experience is reliable.

## Incremental Implementation Roadmap

Phase 1: Make the free "aha" moment excellent.

- Keep install-to-hover friction near zero.
- Improve tooltip loading, error, and repeated-hover behavior.
- Avoid duplicate API calls for repeated hover text.
- Add local persistent cache for successful single-word selections only.
- Add a clear-cache option.
- Keep manual testing docs accurate after each behavior change.

Phase 2: Control cost without hurting adoption.

- Add backend rate limiting.
- Add anonymous usage limits if provider cost becomes real.
- Prefer generous free limits while user volume is low.
- Track aggregate backend usage and errors without storing unnecessary reading content.
- Tune cache TTL and max entries based on real usage.

Phase 3: Add learning features that justify accounts.

- Saved vocabulary.
- Review queue.
- Simple spaced repetition.
- Example sentences.
- Optional learning history.
- Account sign-in only when the user chooses to save or sync learning data.

Phase 4: Add paid plans.

- Keep the basic hover experience free.
- Put premium value behind paid accounts:
  - higher quotas
  - richer explanations
  - saved vocabulary sync
  - review mode
  - premium provider quality
- Backend owns entitlement, quota, billing status, and provider routing.
- The extension stores only the auth token and sends it to the backend.

## Critical Recommendation

Do not make DutchMate feel like a SaaS dashboard too early. The winning experience is not "manage translations"; it is "read naturally and understand more Dutch than before."

The best near-term sequence is:

1. Polish the free hover and selection experience.
2. Add local persistent caching with clear privacy boundaries.
3. Add lightweight learning features only after translation feels fast and reliable.
4. Add accounts when users want saved progress or when provider cost makes quotas necessary.
5. Add paid plans after users already have a habit.

The account wall should come after value, not before it.
