# Production Provider Decision

Reviewed: 2026-06-15

This note chooses the first translation provider to put behind the Render backend. It intentionally excludes Google/Bing/DeepL web/internal endpoints as the default production path; that decision is captured in [reference-mousetooltiptranslator.md](reference-mousetooltiptranslator.md).

## Decision Status

Status: **Done**

Decision: **MyMemory** for early MVP experiments only.

Scale-up provider: **Azure AI Translator / Microsoft Translator** when traction, quality complaints, quota pressure, hosted-provider reliability, or paid-plan readiness justify adding billing/card details.

## Hosted Render Finding

On 2026-06-15, the Render backend was deployed successfully at:

```text
https://dutchmate-backend.onrender.com
```

Observed behavior:

- `GET /health` returns `200`.
- `POST /translate` reaches the backend, but MyMemory returns `429`.
- Render logs confirm `configuredProvider: "mymemory"`.
- Render logs confirm `myMemoryEmailConfigured: true`.
- Render logs confirm `providerStatus: 429` and `providerRateLimited: true`.

Conclusion: the backend and Render configuration are healthy, including `MYMEMORY_EMAIL`. The blocker is MyMemory hosted reliability/quota. Treat MyMemory as a temporary no-credit-card experiment, not as the dependable public MVP provider.

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
| MyMemory | Useful for local and no-credit-card experiments. | Free anonymous limits are low: 5,000 chars/day, or 50,000 chars/day with email. Hosted Render testing still returned `429` with email configured. | Easy. No required secret for basic use; optional email can be an env var. | Weak. Public-memory/search style API and daily limits are not reliable enough for scale. | Keep as temporary fallback/experiment only. |
| Azure AI Translator / Microsoft Translator | Strong. Official docs list Dutch, English, and Telugu for cloud text translation. | Strong free tier, but Azure account setup may require card verification. Official pricing lists F0 Free with 2 million characters per month. | Strong. Uses server-side key/region env vars. | Strong. Translation-specific service with official docs, quotas, and production posture. | Scale-up provider after traction or quota pressure. |
| Google Cloud Translation | Strong. Official docs list Dutch, English, and Telugu. | Good but smaller. Official pricing lists first 500,000 characters/month free, then paid per million characters. Cloud setup may also require billing setup. | Strong. Needs Google Cloud auth setup; likely service account or API key strategy. | Strong. Broad language coverage and stable API. | Backup scale-up candidate. |
| DeepL API | Good for many European languages, but less ideal for this MVP because Telugu is critical. | Good. DeepL API Free lists 500,000 characters/month. | Strong. Uses server-side API key. | Strong for supported languages. | Not first choice for DutchMate while Telugu is central. |

## Why MyMemory First

MyMemory was the best first early-MVP provider to test because it gave DutchMate:

- no-credit-card setup,
- a real hosted translation provider adapter behind the Render backend,
- enough capability to validate the product loop with early users,
- a low-friction path while we test whether users love the core experience.

This fits our current product strategy:

```text
DutchMate extension
-> Render backend
-> temporary early-MVP provider
```

MyMemory hosted limits have now become a problem on Render. The backend architecture still did its job: provider-specific details stayed hidden from the extension, and we can switch the backend provider without changing the extension UX.

## Azure Scale-Up Trigger

Move from MyMemory to Azure AI Translator when one of these happens:

- early users complain about quality,
- MyMemory hosted limits block real usage,
- Render logs show meaningful traction,
- we are ready to add billing/card details,
- paid/free plan economics need stable provider quotas and pricing.

Azure remains the best technical scale-up candidate because it supports Dutch, English, and Telugu officially and offers a much larger free tier than MyMemory.

## Not Recommended For Default MVP

Do not use web/internal Google, Bing, or DeepL endpoints as the default public provider. They may be reachable without an API key, but they are not the same as official public APIs and can create reliability, terms, privacy, and paid-plan risk.

Do not treat MyMemory as the final public-scale provider. Its low free daily limits, hosted `429` behavior, and public translation-memory behavior are acceptable for early MVP learning, but not strong enough for a dependable public launch.

Do not use OpenAI or Azure OpenAI for basic translation yet. LLM translation can become a premium feature later for explanations, nuance, examples, or learning support.

## Implementation Implication If Approved

Next implementation step:

1. Keep MyMemory documented as a temporary no-credit-card experiment.
2. Do not depend on MyMemory for a polished public launch.
3. Keep Azure adapter work planned as the next reliable provider path.
4. Re-test MyMemory occasionally only as a fallback/reference provider.

## Sources Checked

- Azure language support: https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
- Azure pricing: https://azure.microsoft.com/en-us/pricing/details/translator/
- Google Cloud Translation language support: https://cloud.google.com/translate/docs/languages
- Google Cloud Translation pricing: https://cloud.google.com/translate/pricing
- DeepL supported languages: https://developers.deepl.com/docs/getting-started/supported-languages
- DeepL usage and limits: https://developers.deepl.com/docs/resources/usage-limits
- MyMemory API specs: https://mymemory.translated.net/doc/spec.php
- MyMemory usage limits: https://mymemory.translated.net/doc/usagelimits.php
