# Local Translation Backend

The local backend is the first production-shaped boundary for real translation. The extension still sends the same request as before, but now there is a small backend service with controller, service, and provider layers.

## Run It

```bash
corepack pnpm backend:dev
```

Local environment defaults are documented in `.env.example`. To use an env file locally, copy it to `.env`:

```bash
cp .env.example .env
corepack pnpm backend:dev:env
```

The real `.env` file is ignored by Git because it can eventually contain provider secrets.

The backend uses the `local-dev` provider by default. You can make that explicit:

```bash
TRANSLATION_PROVIDER=local-dev corepack pnpm backend:dev
```

Default endpoint:

```text
http://localhost:8787/translate
```

Health check:

```text
http://localhost:8787/health
```

For local endpoint testing, build a local-testing extension:

```bash
corepack pnpm build:firefox:local-testing
corepack pnpm build:chrome:local-testing
```

Then set the provider endpoint in the extension Options page to:

```text
http://localhost:8787/translate
```

Store-ready builds hide this override from normal users.

Run only one local translation server at a time. The older mock server and this backend both use port `8787` by default.

## Provider Selection

The current provider is `local-dev`. It is intentionally small and dependency-free:

- Known sample words return a simple real translation, such as `bonjour` to `hello`.
- Unknown text returns an obvious local-development response, such as `[local-dev en] ...`.

This lets us verify the backend shape before signing up for a paid provider or adding provider SDKs.

Provider selection is environment-driven:

```text
TRANSLATION_PROVIDER=local-dev
```

Supported providers:

- `local-dev`: local, free, dependency-free development provider.
- `azure-translator`: Azure AI Translator / Microsoft Translator provider. Requires `AZURE_TRANSLATOR_KEY`; `AZURE_TRANSLATOR_REGION` is optional for global resources and required for regional or multi-service resources.
- `deepl`: DeepL API provider. Requires `DEEPL_API_KEY`.
- `google-translate`: Google Cloud Translation Basic provider. Requires `GOOGLE_TRANSLATE_API_KEY`.
- `mymemory`: hosted no-credit-card provider. Useful for experiments, but verified fragile on Render.

Later provider adapters should be added behind the same factory, so the extension can keep calling the same `/translate` endpoint.

## Configuration Validation

The backend reads and validates environment values at startup:

```text
TRANSLATION_PROVIDER=local-dev
HOST=127.0.0.1
PORT=8787
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000
AZURE_TRANSLATOR_API_URL=https://api.cognitive.microsofttranslator.com/translate
# AZURE_TRANSLATOR_KEY=replace-me
# AZURE_TRANSLATOR_REGION=westeurope
DEEPL_API_URL=https://api-free.deepl.com/v2/translate
# DEEPL_API_KEY=replace-me
GOOGLE_TRANSLATE_API_URL=https://translation.googleapis.com/language/translate/v2
# GOOGLE_TRANSLATE_API_KEY=replace-me
MYMEMORY_API_URL=https://api.mymemory.translated.net/get
MYMEMORY_SOURCE_LANGUAGE=nl
# MYMEMORY_EMAIL=learner@example.com
```

Invalid values stop the backend immediately with a clear error. This is intentional: provider problems should be visible at startup, not only after a user hovers over text.

The rate-limit values are optional. If they are missing from `.env`, the backend uses the defaults shown above. `RATE_LIMIT_MAX_REQUESTS=60` and `RATE_LIMIT_WINDOW_MS=60000` means each client can make up to 60 translate requests per 60,000 milliseconds, or one minute. These values protect provider cost and translation quota during local testing and early production use.

To try Azure AI Translator / Microsoft Translator later:

1. Create an Azure Translator resource when you are ready to use Azure.
2. Add `AZURE_TRANSLATOR_KEY` to your local `.env`.
3. Add `AZURE_TRANSLATOR_REGION` if the resource is regional or multi-service.
4. Change `TRANSLATION_PROVIDER` to `azure-translator`.
5. Restart the backend with `corepack pnpm backend:dev:env`.

Azure Translator's v3 translate endpoint expects `POST /translate?api-version=3.0&to=<language>`, a JSON array body like `[{ "Text": "huis" }]`, and `Ocp-Apim-Subscription-Key` in the request headers. `Ocp-Apim-Subscription-Region` is sent only when `AZURE_TRANSLATOR_REGION` is configured.

To try DeepL later:

1. Create a DeepL API key from the official DeepL API page: https://www.deepl.com/pro-api
2. Add the key to your local `.env`.
3. Change `TRANSLATION_PROVIDER` to `deepl`.
4. Restart the backend with `corepack pnpm backend:dev:env`.

DeepL's translate endpoint expects `Authorization: DeepL-Auth-Key ...`, JSON `text` as an array, and `target_lang` as the target language code. API Free users should use `https://api-free.deepl.com/v2/translate`.

To try Google Cloud Translation later:

1. Create or choose a Google Cloud project when you are ready to evaluate Google billing/setup.
2. Enable the Cloud Translation API.
3. Create an API key with suitable API restrictions.
4. Add `GOOGLE_TRANSLATE_API_KEY` to your local `.env`.
5. Change `TRANSLATION_PROVIDER` to `google-translate`.
6. Restart the backend with `corepack pnpm backend:dev:env`.

Google Cloud Translation Basic's v2 translate endpoint expects `POST /language/translate/v2`, `key`, `q`, `target`, optional `source`, and `format=text`. DutchMate keeps this provider behind the backend so the API key is never shipped in the extension.

To try MyMemory:

1. Keep `MYMEMORY_SOURCE_LANGUAGE=nl` as the fallback for Auto source-language requests.
2. Optionally add `MYMEMORY_EMAIL` to raise the daily free limit.
3. Change `TRANSLATION_PROVIDER` to `mymemory`.
4. Restart the backend with `corepack pnpm backend:dev:env`.
5. In extension Options, set Source language and Target language explicitly for best results.

MyMemory uses a `langpair` such as `nl|te`. When the extension sends `sourceLanguage: "auto"`, the backend uses `MYMEMORY_SOURCE_LANGUAGE` as the source fallback. For this MVP, supported language codes are:

- `nl`: Dutch
- `en`: English
- `te`: Telugu

## Backend Boundaries

```text
backend/dev-server.mjs
-> backend/config.mjs
-> backend/providers/provider-factory.mjs
-> backend/server.mjs
-> backend/translation-service.mjs
-> backend/providers/local-dev-provider.mjs
```

The browser extension should not know which provider is behind the backend. Later, we can add providers such as Azure Translator, Google Cloud Translation, or DeepL by implementing the same provider shape used by `local-dev`.

## Render Deployment

The repo includes `render.yaml` for the first Render Web Service deployment. It uses the same backend entry point as local development:

```text
corepack pnpm backend:start
```

Render web services must listen on `0.0.0.0` and the configured `PORT`, so the blueprint sets:

```text
HOST=0.0.0.0
PORT=10000
```

The blueprint starts with `TRANSLATION_PROVIDER=mymemory` for the early MVP no-credit-card translation path. Use local `TRANSLATION_PROVIDER=local-dev` when you want fully dependency-free smoke tests. If the higher MyMemory free daily limit is needed, add `MYMEMORY_EMAIL` in Render environment variables, not in the repo.

## Endpoint Contract

Request:

```json
{
  "text": "bonjour",
  "sourceLanguage": "auto",
  "targetLanguage": "en",
  "context": "hover"
}
```

Response:

```json
{
  "translatedText": "hello"
}
```

The extension already expects this response shape.

## Smoke Test

With the backend running locally:

```bash
corepack pnpm backend:smoke
```

This checks:

- `GET /health`
- `POST /translate`

To test a deployed Render backend later, pass the service base URL:

```bash
corepack pnpm backend:smoke https://dutchmate-backend.onrender.com
```

You can also use an environment variable:

```bash
BACKEND_BASE_URL=https://dutchmate-backend.onrender.com corepack pnpm backend:smoke
```

## Why This Step Matters

This is not the final production backend yet. It is the local scaffold that lets us learn and test the right boundary:

- Extension code stays light.
- Provider secrets stay out of the browser extension.
- Real providers can be added behind the backend without changing content-script behavior.
- Local testing remains fast and free.
