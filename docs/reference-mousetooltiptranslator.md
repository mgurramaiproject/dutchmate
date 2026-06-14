# Reference Deep Dive: MouseTooltipTranslator

Source: https://github.com/ttop32/MouseTooltipTranslator

Reviewed: 2026-06-14

This document captures what DutchMate can learn from `ttop32/MouseTooltipTranslator`, especially how a free extension appears to provide translation without asking every user for a paid provider API key.

## Why This Reference Matters

MouseTooltipTranslator is a mature open-source browser extension with hover/select translation, PDF support, OCR, TTS, subtitles, and many translation engines. It is useful as a reference product, but it is not a backend provider.

DutchMate should learn from its provider strategy and UX breadth without copying its full product surface too early.

## Provider Strategy Observed

The README says:

- hover or selected text can be translated,
- Google translator and Bing translator are used for translation,
- Chrome, Edge, and Firefox builds are available.

Source files inspected in a temporary clone:

- `src/translator/google.js`
- `src/translator/bing.js`
- `src/translator/googleGTX.js`
- `src/translator/googleV2.js`
- `src/translator/deepl.js`
- `src/translator/index.js`
- `src/translator/translateCaller.js`
- `src/util/setting_default.js`
- `src/translator/browserAPI.js`

Key findings:

| Engine | What It Appears To Use | Notes |
| --- | --- | --- |
| `google` | `https://translate.googleapis.com/translate_a/single` with `client=gtx` | Browser-callable Google Translate endpoint, not the paid Google Cloud Translation API. |
| `bing` | `https://www.bing.com/translator` token scrape, then `https://www.bing.com/ttranslatev3` | Uses Bing web translator flow with token/key extracted from the translator page. |
| `googleGTX` | `https://translate.googleapis.com/translate_a/t` with generated token | Experimental Google web/internal endpoint approach. |
| `googleV2` | `https://translate.google.com/_/TranslateWebserverUi/data/batchexecute` | Experimental Google web app backend endpoint. |
| `deepl` | `https://www2.deepl.com/jsonrpc` | Appears to use a free web/internal DeepL JSON-RPC flow, not the official DeepL API key endpoint. |
| `browserAPI` | Chrome `Translator` and `LanguageDetector` APIs | Experimental browser-native translation path, dependent on browser support. |
| fallback | Google, Bing, Baidu fallback rotation | It caches translation calls and can temporarily swap engines when one breaks. |

The default `translatorVendor` is `google`, with `bing` also exposed as a first-class option.

## Critical Interpretation

MouseTooltipTranslator seems free because it relies heavily on browser-side calls to public web/internal translation endpoints instead of paying a server-side translation API for every request.

That has real advantages:

- No per-user API key setup.
- No backend cost for the extension author.
- Very broad language coverage.
- Fast path to a free extension.

But it also has serious risks:

- Web/internal endpoints can change or break without notice.
- Scraped web-token flows can be fragile.
- Terms-of-service and store-review risk may be higher than official APIs.
- Reliability may be hard to guarantee for a product with paid plans.
- Provider-side rate limits or abuse defenses can appear unpredictably.
- Requests go directly from the browser to third-party translation services, which changes the privacy story.

## Recommendation For DutchMate

Do not blindly copy the free web-endpoint strategy for the production backend.

Recommended path:

1. Keep DutchMate's backend provider abstraction.
2. Choose one official production provider for the first public Render backend.
3. Treat free web endpoints as research/backlog, not the first production default.
4. Consider browser-native translation APIs later if Chrome/Firefox support becomes reliable enough.
5. Use MouseTooltipTranslator as UX inspiration, especially for fallbacks, caching, and feature discovery.

Why this is stricter than MouseTooltipTranslator:

- DutchMate may eventually offer free and paid plans.
- A paid roadmap needs stable cost, reliability, terms, and privacy posture.
- Our "magically lightweight" product should feel trustworthy, not clever-but-fragile.

## Ideas Worth Borrowing Later

| Idea | DutchMate Fit | Timing |
| --- | --- | --- |
| Provider fallback | Strong fit for uptime and quality. | After one production provider is proven. |
| Cached translation calls | Already partly implemented. | Continue tuning. |
| Dual target languages | Already part of MVP. | Keep simple. |
| Browser-native translation API | Interesting cost-saving path. | Future, after browser support is clearer. |
| PDF/OCR/subtitles | Useful but broadens product surface. | Backlog, after core reading loop is loved. |
| Dictionary/Wiktionary support | Strong learning feature. | Future learning phase. |

## Next Provider Decision

When choosing DutchMate's first production provider, compare official APIs first:

- Azure AI Translator / Microsoft Translator
- Google Cloud Translation
- DeepL API
- MyMemory

Then separately record whether any free web-endpoint strategy is acceptable for:

- local development,
- optional user-selected advanced mode,
- fallback only,
- or never in production.

Current recommendation: official provider first for public production; free web endpoints only as a carefully documented research path.
