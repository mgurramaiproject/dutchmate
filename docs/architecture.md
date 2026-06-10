# Architecture Notes

Hover Translate is kept small on purpose:

- Content scripts own webpage interaction: word hover, text selection, tooltip placement.
- The Options page owns user settings: target language and future provider credentials.
- Translation logic lives behind `TranslationProvider`, so future API providers do not need to change DOM interaction code.
- Browser-specific differences are handled at build output time by generating separate `manifest.json` files for Chrome and Firefox.

## Code Boundaries

This project uses a lightweight extension-shaped version of controller-service-adapter layering:

- `src/background/index.ts`: message controller for extension runtime messages.
- `src/translation/translation-service.ts`: chooses placeholder versus configured endpoint provider.
- `src/translation/*-provider.ts`: provider adapters for translation backends.
- `src/translation/translation-cache.ts`: small in-memory cache for successful translations.
- `src/background/settings-adapter.ts`: reads provider settings from extension storage for the background layer.

A full repository layer is not needed yet because the extension does not own a durable translation domain model. Browser storage and provider endpoints are treated as adapters instead.

## Translation Flow

```text
webpage hover/selection
-> content script
-> background worker
-> placeholder provider or configured JSON endpoint
-> tooltip
```

The background worker reads provider settings from extension storage. If no provider endpoint is configured, it returns the placeholder translation so the extension remains testable.

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

The worker keeps a small in-memory cache of successful translations keyed by target language, context, and text.

## Manifest Strategy

Both builds use Manifest V3. The background worker owns provider calls so the content script can stay focused on webpage interaction and tooltip rendering.

Chrome uses `background.service_worker`. Firefox currently uses `background.scripts`, so the manifest generator emits browser-specific background declarations.

## Performance Notes

- Hover translation waits before doing work to avoid reacting to every mouse movement.
- Hover detection only translates one word at a time.
- Selection translation caps text length for the MVP.
- No UI framework is used in the content script or Options page.
