# Production Provider Decision

Reviewed: 2026-06-14

This note chooses the first translation provider to put behind the Render backend. It intentionally excludes Google/Bing/DeepL web/internal endpoints as the default production path; that decision is captured in [reference-mousetooltiptranslator.md](reference-mousetooltiptranslator.md).

## Decision Status

Status: **Done**

Decision: **MyMemory** for early MVP users.

Scale-up provider: **Azure AI Translator / Microsoft Translator** when traction, quality complaints, quota pressure, or paid-plan readiness justify adding billing/card details.

## MVP Requirements

The provider must support:

- Dutch (`nl`)
- English (`en`)
- Telugu (`te`)
- server-side secrets on Render
- no-credit-card path for early testing when possible
- simple REST integration
- clear upgrade path to a stronger production provider

## Comparison

| Provider | Language Fit | Free / Low-Cost Fit | Render Secret Fit | Production Fit | Recommendation |
| --- | --- | --- | --- | --- | --- |
| MyMemory | Useful for early MVP and no-credit-card tests. | Free anonymous limits are low: 5,000 chars/day, or 50,000 chars/day with email. | Easy. No required secret for basic use; optional email can be an env var. | Weaker. Public-memory/search style API and daily limits are not ideal for scale. | Use for early MVP only. |
| Azure AI Translator / Microsoft Translator | Strong. Official docs list Dutch, English, and Telugu for cloud text translation. | Strong free tier, but Azure account setup may require card verification. Official pricing lists F0 Free with 2 million characters per month. | Strong. Uses server-side key/region env vars. | Strong. Translation-specific service with official docs, quotas, and production posture. | Scale-up provider after traction or quota pressure. |
| Google Cloud Translation | Strong. Official docs list Dutch, English, and Telugu. | Good but smaller. Official pricing lists first 500,000 characters/month free, then paid per million characters. Cloud setup may also require billing setup. | Strong. Needs Google Cloud auth setup; likely service account or API key strategy. | Strong. Broad language coverage and stable API. | Backup scale-up candidate. |
| DeepL API | Good for many European languages, but less ideal for this MVP because Telugu is critical. | Good. DeepL API Free lists 500,000 characters/month. | Strong. Uses server-side API key. | Strong for supported languages. | Not first choice for DutchMate while Telugu is central. |

## Why MyMemory First

MyMemory is the best first early-MVP provider because it gives DutchMate:

- no-credit-card setup,
- a real hosted translation provider behind the Render backend,
- enough capability to validate the product loop with early users,
- a low-friction path while we test whether users love the core experience.

This fits our current product strategy:

```text
DutchMate extension
-> Render backend
-> temporary early-MVP provider
```

The backend should keep provider-specific details hidden from the extension. If MyMemory quality, latency, or limits become a problem, we can switch the backend provider without changing the extension UX.

## Azure Scale-Up Trigger

Move from MyMemory to Azure AI Translator when one of these happens:

- early users complain about quality,
- MyMemory daily limits block real usage,
- Render logs show meaningful traction,
- we are ready to add billing/card details,
- paid/free plan economics need stable provider quotas and pricing.

Azure remains the best technical scale-up candidate because it supports Dutch, English, and Telugu officially and offers a much larger free tier than MyMemory.

## Not Recommended For Default MVP

Do not use web/internal Google, Bing, or DeepL endpoints as the default public provider. They may be reachable without an API key, but they are not the same as official public APIs and can create reliability, terms, privacy, and paid-plan risk.

Do not treat MyMemory as the final public-scale provider. Its low free daily limits and public translation-memory behavior are acceptable for early MVP learning, but not strong enough for scale.

Do not use OpenAI or Azure OpenAI for basic translation yet. LLM translation can become a premium feature later for explanations, nuance, examples, or learning support.

## Implementation Implication If Approved

Next implementation step:

1. Keep MyMemory as the first Render MVP provider.
2. Make sure MyMemory setup is documented clearly for Render.
3. Add optional `MYMEMORY_EMAIL` in Render if needed for the higher free daily limit.
4. Keep Azure adapter work planned for the scale-up trigger.

## Sources Checked

- Azure language support: https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
- Azure pricing: https://azure.microsoft.com/en-us/pricing/details/translator/
- Google Cloud Translation language support: https://cloud.google.com/translate/docs/languages
- Google Cloud Translation pricing: https://cloud.google.com/translate/pricing
- DeepL supported languages: https://developers.deepl.com/docs/getting-started/supported-languages
- DeepL usage and limits: https://developers.deepl.com/docs/resources/usage-limits
- MyMemory API specs: https://mymemory.translated.net/doc/spec.php
- MyMemory usage limits: https://mymemory.translated.net/doc/usagelimits.php
