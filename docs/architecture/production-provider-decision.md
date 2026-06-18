# Production Provider Decision

Reviewed: 2026-06-15

This note chooses the first translation provider to put behind the Render backend. It intentionally excludes Google/Bing/DeepL web/internal endpoints as the default production path; that decision is captured in [reference-mousetooltiptranslator.md](../references/reference-mousetooltiptranslator.md).

## Decision Status

Status: **Done**

Decision: **MyMemory** for early MVP experiments only.

Scale-up provider path: **Azure AI Translator / Microsoft Translator** remains technically preferred, but Azure activation is paused because the project account was not eligible for Azure Free. Do not use Azure pay-as-you-go until budget/alert controls are explicitly approved.

Activated provider for MVP production testing: **Google Cloud Translation**.

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

## Billing Gate

On 2026-06-15, `dutchmate.project@gmail.com` was not eligible for an Azure Free account after signup. Azure then offered pay-as-you-go pricing.

Decision:

- Do not proceed with Azure pay-as-you-go for MVP production until a budget and alert plan is explicitly approved.
- Keep the Azure backend adapter in the repo because it is implemented and tested.
- Keep the Google Cloud Translation adapter in the repo because it is implemented and tested.
- Evaluate Google Cloud Translation activation next as the safer official-provider candidate before accepting uncapped Azure pay-as-you-go risk.
- Do not use unofficial Google/Bing/DeepL web endpoints as the default public provider.

## Google Cloud Translation Activation

On 2026-06-16, Google Cloud Translation was activated for the Render backend.

Setup:

- Google Cloud account: `dutchmate.project@gmail.com`
- Project: `dutchmate-production`
- Free trial credit active at setup time
- Budget alert created
- Cloud Translation API enabled
- API key restricted to Cloud Translation API
- Render provider: `TRANSLATION_PROVIDER=google-translate`

Verified result:

```text
Backend health check passed: https://dutchmate-backend.onrender.com
Backend translation smoke test passed: https://dutchmate-backend.onrender.com
```

Setup details are recorded in [google-cloud-translation-setup.md](../operations/google-cloud-translation-setup.md).

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
| Azure AI Translator / Microsoft Translator | Strong. Official docs list Dutch, English, and Telugu for cloud text translation. | Strong free tier, but the project account was not eligible for Azure Free; pay-as-you-go should wait for budget/alert approval. | Strong. Uses server-side key/region env vars. | Strong. Translation-specific service with official docs, quotas, and production posture. | Keep adapter ready; pause activation. |
| Google Cloud Translation | Strong. Official docs list Dutch, English, and Telugu. | Good but smaller. Official pricing lists first 500,000 characters/month free, then paid per million characters. Free trial was active at MVP setup. | Strong. Adapter supports API-key based Basic v2 requests behind the backend. | Strong. Broad language coverage and stable API. | Active for MVP production testing. |
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

## Official Provider Activation Trigger

Move from MyMemory to an official provider when one of these happens:

- early users complain about quality,
- MyMemory hosted limits block real usage,
- Render logs show meaningful traction,
- we are ready to add billing/card details,
- paid/free plan economics need stable provider quotas and pricing.

Azure remains a strong technical scale-up candidate because it supports Dutch, English, and Telugu officially and offers a much larger free tier than MyMemory when Azure Free is available. Because Azure Free was unavailable for the project account, Google Cloud Translation should be evaluated next before using Azure pay-as-you-go.

## Not Recommended For Default MVP

Do not use web/internal Google, Bing, or DeepL endpoints as the default public provider. They may be reachable without an API key, but they are not the same as official public APIs and can create reliability, terms, privacy, and paid-plan risk.

Do not treat MyMemory as the final public-scale provider. Its low free daily limits, hosted `429` behavior, and public translation-memory behavior are acceptable for early MVP learning, but not strong enough for a dependable public launch.

Do not use OpenAI or Azure OpenAI for basic translation yet. LLM translation can become a premium feature later for explanations, nuance, examples, or learning support.

## Implementation Implication If Approved

Next implementation step:

1. Keep MyMemory documented as a temporary no-credit-card experiment.
2. Do not depend on MyMemory for a polished public launch.
3. Keep the Azure adapter available behind `TRANSLATION_PROVIDER=azure-translator`.
4. Do not activate Azure pay-as-you-go on Render until budget and alert controls are explicitly approved.
5. Keep Google Cloud Translation active for MVP production testing while free-trial/budget status is monitored.
6. Re-test MyMemory occasionally only as a fallback/reference provider.

## Sources Checked

- Azure language support: https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
- Azure pricing: https://azure.microsoft.com/en-us/pricing/details/translator/
- Google Cloud Translation language support: https://cloud.google.com/translate/docs/languages
- Google Cloud Translation pricing: https://cloud.google.com/translate/pricing
- DeepL supported languages: https://developers.deepl.com/docs/getting-started/supported-languages
- DeepL usage and limits: https://developers.deepl.com/docs/resources/usage-limits
- MyMemory API specs: https://mymemory.translated.net/doc/spec.php
- MyMemory usage limits: https://mymemory.translated.net/doc/usagelimits.php
