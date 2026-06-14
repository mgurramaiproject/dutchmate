# Translation Provider Strategy

Last reviewed: 2026-06-14

This extension does not require OpenAI, Azure, Google Translate, or any one specific provider. The browser extension should stay provider-agnostic: it sends translation requests to a backend endpoint, and that backend decides which translation engine to use.

## Recommended Production Shape

```text
browser extension
-> HTTPS backend endpoint
-> translation provider
-> { "translatedText": "..." }
```

For production, do not put paid provider API keys directly in the extension. Extension code can be inspected by users, so secrets stored there are not secret. Keep provider keys on a backend service instead.

The extension can safely fetch translation data from an external HTTPS endpoint. It should not load or execute remote JavaScript, because Chrome Manifest V3 does not allow remote hosted executable code.

Production backend requirements and rollout sequencing are tracked in [production-backend-plan.md](production-backend-plan.md).

Free browser-extension provider strategies are tracked separately in [reference-mousetooltiptranslator.md](reference-mousetooltiptranslator.md). MouseTooltipTranslator appears to rely heavily on browser-side calls to Google/Bing web translation flows, which is useful inspiration but riskier than an official backend provider for DutchMate's public production path.

The first official production provider recommendation is tracked in [production-provider-decision.md](production-provider-decision.md). Current status: proposed Azure AI Translator / Microsoft Translator, pending approval.

## What External Services Are Needed?

For local development:

- The built extension loaded temporarily in Chrome or Firefox.
- The local mock endpoint from `corepack pnpm mock:translate`.
- No paid translation provider is needed yet.

For MVP production:

- A small HTTPS backend endpoint.
- One translation provider account.
- Secret storage for the provider API key.
- Basic rate limiting and abuse protection.
- A privacy policy and store listing disclosure explaining what text is sent for translation.
- Chrome Web Store and Firefox Add-ons developer accounts.

For a later paid or serious production version:

- Monitoring for backend errors, latency, and provider cost.
- Usage quotas per user or per install.
- Caching for repeated translations.
- Provider fallback if quality or availability becomes a problem.

## Provider Notes

Azure AI Translator:

- Good fit if the project is already using Azure.
- Usually a strong MVP choice because it is built specifically for translation.
- Official pricing page showed a free tier around 2 million characters per month when reviewed.
- Source: https://azure.microsoft.com/en-us/pricing/details/translator/

Google Cloud Translation:

- Good fit for a simple, predictable MVP.
- Official pricing page showed Basic/NMT pricing at about `$20` per million characters after the free monthly credit when reviewed.
- Source: https://cloud.google.com/translate/pricing

DeepL:

- Often strong translation quality for supported languages.
- Official docs showed DeepL API Free at 500,000 characters per month when reviewed.
- Good MVP option if its supported languages match the product goal.
- Source: https://developers.deepl.com/docs/resources/usage-limits

OpenAI:

- Not required for basic word or sentence translation.
- Better suited later for premium behavior: context-aware translation, tone, explanations, phrase alternatives, or domain-specific rewriting.
- Usually more expensive and less predictable for simple character-based translation because billing is token-based.
- Source: https://openai.com/api/pricing/

Azure OpenAI:

- Similar use case to OpenAI, but hosted through Azure.
- Useful if enterprise deployment, Azure governance, or regional controls matter.
- Not the first choice for a lightweight MVP translation extension unless the product needs LLM-style translation features.

## MVP Recommendation

Start with a dedicated translation API behind our own backend endpoint.

Best first choice:

- Azure AI Translator / Microsoft Translator, pending approval in `production-provider-decision.md`.

Good fallback candidates:

- Google Cloud Translation Basic/NMT if Azure setup, quality, or latency is not acceptable.
- DeepL API Free only if Telugu support and quality fit the product goal.

Avoid starting with OpenAI or Azure OpenAI for plain translation. Add an LLM provider later only when the product needs features that traditional translation APIs do not handle well.

## When To Switch Providers

Stay with the MVP provider while:

- Translation quality is acceptable.
- Cost per user is low.
- Latency feels fast enough in hover and selection workflows.
- The provider supports the needed languages.

Consider switching or adding a premium provider when:

- Users complain about translation quality for important languages.
- The extension needs tone, context, glossary, or domain-aware translation.
- Enterprise customers require a specific cloud provider.
- Usage data shows that better quality will justify the higher cost.

Before choosing a production provider, recheck current pricing, quotas, supported languages, data retention terms, and browser store policy requirements.
