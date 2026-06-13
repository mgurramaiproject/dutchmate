# MVP Language Focus

The first audience is Telugu-speaking people living in the Netherlands who primarily use English and Telugu, and want to learn Dutch.

For the MVP, support only:

- `nl`: Dutch
- `en`: English
- `te`: Telugu

The Options page target-language dropdown should show only these three languages.

This focus affects provider choice. A provider is not useful for the MVP unless it can handle Telugu, English, and Dutch well enough for real learning workflows.

## Current Provider Direction

Do not prioritize LibreTranslate for this MVP if Telugu coverage is missing.

Recommended order:

1. `local-dev`: fast local development without external calls.
2. `mymemory`: no-credit-card hosted testing for the `nl`, `en`, `te` language triangle.
3. Experimental `google-web` or `bing-web`: possible later, inspired by MouseTooltipTranslator, but should be feature-flagged because unofficial web endpoints can break.

## Current Limitation

The extension currently sends `sourceLanguage: "auto"` to the backend. MyMemory requires a source-target language pair, so the backend uses `MYMEMORY_SOURCE_LANGUAGE` as a fallback when the request source is `auto`.

For Dutch-learning pages, keep:

```env
MYMEMORY_SOURCE_LANGUAGE=nl
```

Later, we can add a source-language control or smarter webpage-language detection if users need English-to-Dutch or Telugu-to-Dutch workflows.
