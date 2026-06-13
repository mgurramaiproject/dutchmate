# MVP Language Focus

The first audience is Telugu-speaking people living in the Netherlands who primarily use English and Telugu, and want to learn Dutch.

For the MVP, support only:

- `nl`: Dutch
- `en`: English
- `te`: Telugu

The Options page target-language dropdown should show only these three languages. The source-language dropdown should show Auto plus these three languages.

This focus affects provider choice. A provider is not useful for the MVP unless it can handle Telugu, English, and Dutch well enough for real learning workflows.

## Current Provider Direction

Do not prioritize LibreTranslate for this MVP if Telugu coverage is missing.

Recommended order:

1. `local-dev`: fast local development without external calls.
2. `mymemory`: no-credit-card hosted testing for the `nl`, `en`, `te` language triangle.
3. Experimental `google-web` or `bing-web`: possible later, inspired by MouseTooltipTranslator, but should be feature-flagged because unofficial web endpoints can break.

## Source Language

The extension can send `sourceLanguage: "auto"`, `nl`, `en`, or `te` to the backend. MyMemory requires a source-target language pair, so the backend uses `MYMEMORY_SOURCE_LANGUAGE` as a fallback only when the request source is `auto`.

For Dutch-learning pages, keep:

```env
MYMEMORY_SOURCE_LANGUAGE=nl
```

For more accurate MyMemory testing, set the source language explicitly in Options, such as Dutch to Telugu. For low-friction learning, Auto source language uses lightweight MVP detection.

## Dual-Language Output

The user preference is on by default. When enabled, the extension requests the other two MVP languages:

- Source Dutch: English and Telugu
- Source English: Dutch and Telugu
- Source Telugu: Dutch and English

When source language is Auto, the extension detects Telugu by script and uses simple Dutch/English hints for Latin text. Unknown Latin text falls back to English, while common Dutch words and patterns still route to Dutch.
