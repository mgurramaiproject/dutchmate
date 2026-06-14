# Production Provider Decision

Reviewed: 2026-06-14

This note chooses the first official translation provider to put behind the Render backend. It intentionally excludes Google/Bing/DeepL web/internal endpoints as the default production path; that decision is captured in [reference-mousetooltiptranslator.md](reference-mousetooltiptranslator.md).

## Decision Status

Status: **Proposed**

Recommendation: **Azure AI Translator / Microsoft Translator** for the first public MVP provider.

Do not implement this until explicitly approved.

## MVP Requirements

The provider must support:

- Dutch (`nl`)
- English (`en`)
- Telugu (`te`)
- server-side secrets on Render
- predictable low-cost/free usage for early users
- simple REST integration
- production-friendly terms and quotas

## Comparison

| Provider | Language Fit | Free / Low-Cost Fit | Render Secret Fit | Production Fit | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Azure AI Translator / Microsoft Translator | Strong. Official docs list Dutch, English, and Telugu for cloud text translation. | Strong. Official pricing lists F0 Free with 2 million characters per month. | Strong. Uses server-side key/region env vars. | Strong. Translation-specific service with official docs, quotas, and production posture. | Best first choice. |
| Google Cloud Translation | Strong. Official docs list Dutch, English, and Telugu. | Good but smaller. Official pricing lists first 500,000 characters/month free, then paid per million characters. | Strong. Needs Google Cloud auth setup; likely service account or API key strategy. | Strong. Broad language coverage and stable API. | Good second choice. |
| DeepL API | Good for many European languages, but less ideal for this MVP because Telugu is critical. | Good. DeepL API Free lists 500,000 characters/month. | Strong. Uses server-side API key. | Strong for supported languages. | Not first choice for DutchMate while Telugu is central. |
| MyMemory | Useful for experiments and no-credit-card local tests. | Free anonymous limits are low: 5,000 chars/day, or 50,000 chars/day with email. | Easy. No required secret for basic use. | Weaker. Public-memory/search style API and daily limits are less suitable for a public extension. | Keep as dev/test provider, not default production provider. |

## Why Azure First

Azure AI Translator is the best first production provider because it gives DutchMate the strongest combination of:

- official Telugu, Dutch, and English support,
- generous free tier for early traction,
- simple server-side secret handling,
- official production API behavior,
- predictable cost controls.

This fits our current product strategy:

```text
DutchMate extension
-> Render backend
-> official translation provider
```

The backend should keep provider-specific details hidden from the extension. If Azure quality, latency, or setup becomes a problem, Google Cloud Translation is the best fallback candidate.

## Not Recommended For Default MVP

Do not use web/internal Google, Bing, or DeepL endpoints as the default public provider. They may be reachable without an API key, but they are not the same as official public APIs and can create reliability, terms, privacy, and paid-plan risk.

Do not use MyMemory as the default public provider. Its low free daily limits and public translation-memory behavior are useful for experiments, but not strong enough for the first public MVP.

Do not use OpenAI or Azure OpenAI for basic translation yet. LLM translation can become a premium feature later for explanations, nuance, examples, or learning support.

## Implementation Implication If Approved

If approved, the next implementation step should be:

1. Add an Azure Translator provider adapter behind the existing backend provider factory.
2. Add environment variables such as `AZURE_TRANSLATOR_KEY`, `AZURE_TRANSLATOR_REGION`, and `AZURE_TRANSLATOR_ENDPOINT`.
3. Keep provider keys out of extension code and out of the repo.
4. Update Render env vars to use Azure only after local/backend tests pass.

## Sources Checked

- Azure language support: https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
- Azure pricing: https://azure.microsoft.com/en-us/pricing/details/translator/
- Google Cloud Translation language support: https://cloud.google.com/translate/docs/languages
- Google Cloud Translation pricing: https://cloud.google.com/translate/pricing
- DeepL supported languages: https://developers.deepl.com/docs/getting-started/supported-languages
- DeepL usage and limits: https://developers.deepl.com/docs/resources/usage-limits
- MyMemory API specs: https://mymemory.translated.net/doc/spec.php
- MyMemory usage limits: https://mymemory.translated.net/doc/usagelimits.php
