# Architecture Notes

DutchMate is kept small on purpose:

- Content scripts own webpage interaction: word hover, text selection, tooltip placement.
- The Options page owns user settings: target language and future provider credentials.
- Translation logic lives behind `TranslationProvider`, so future API providers do not need to change DOM interaction code.
- Browser-specific differences are handled at build output time by generating separate `manifest.json` files for Chrome and Firefox.

## Code Boundaries

This project uses a lightweight extension-shaped version of controller-service-adapter layering:

- `src/background/index.ts`: message controller for extension runtime messages.
- `src/translation/translation-service.ts`: chooses the configured endpoint provider, with placeholder fallback only when the endpoint is intentionally blank.
- `src/translation/*-provider.ts`: provider adapters for translation backends.
- `src/translation/translation-cache.ts`: small in-memory cache for successful translations.
- `src/background/settings-adapter.ts`: reads provider settings from extension storage for the background layer.

A full repository layer is not needed yet because the extension does not own a durable translation domain model. Browser storage and provider endpoints are treated as adapters instead.

## Translation Flow

```text
webpage hover/selection
-> content script
-> background worker
-> configured JSON endpoint or placeholder fallback
-> tooltip
```

The background worker reads provider settings from extension storage. Fresh installs use the DutchMate Render backend by default. If the provider endpoint is intentionally blank, the worker returns the placeholder translation so the extension remains testable.

When an endpoint is configured, the worker sends:

```http
POST <providerEndpoint>
Content-Type: application/json
Authorization: Bearer <apiKey>
```

The `Authorization` header is omitted when the API key is blank.

Request body:

```json
{
  "text": "bonjour",
  "sourceLanguage": "auto",
  "targetLanguage": "en",
  "context": "hover"
}
```

Expected response:

```json
{
  "translatedText": "hello"
}
```

The worker keeps a small in-memory cache of successful translations keyed by target language, context, and text. Persistent cache policy is tracked in [cache-strategy.md](cache-strategy.md), with a word-only local storage cache planned for token savings across sessions.

Configured endpoint requests time out after 20000ms, which allows a hosted backend to cold-start after the browser or extension restarts. Slow or unavailable providers still return a clear timeout error instead of leaving the tooltip in a loading state indefinitely.

Local backend details are documented in [local-backend.md](local-backend.md).

## Real Provider Timing

The first real translation provider should be tested after the endpoint reliability layer is in place:

- request timeout
- clear HTTP status errors
- missing-response-field validation
- local mock endpoint verification
- unit tests for provider behavior

At that point, replacing the mock endpoint with a real backend is a configuration/backend task, not a browser-extension architecture change.

Provider adapters are kept behind the backend so provider selection can change without changing content-script behavior.

## Manifest Strategy

Both builds use Manifest V3. The background worker owns provider calls so the content script can stay focused on webpage interaction and tooltip rendering.

Chrome uses `background.service_worker`. Firefox currently uses `background.scripts`, so the manifest generator emits browser-specific background declarations.

## Performance Notes

- Hover translation waits before doing work to avoid reacting to every mouse movement.
- Hover detection anchors on one word, then translates either that word or compact nearby sentence context based on the user preference.
- Selection translation caps text length for the MVP.
- No UI framework is used in the content script or Options page.
