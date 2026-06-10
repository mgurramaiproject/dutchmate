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

In the extension Options page, set the provider endpoint to:

```text
http://localhost:8787/translate
```

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
- `deepl`: DeepL API provider. Requires `DEEPL_API_KEY`.

Later provider adapters should be added behind the same factory, so the extension can keep calling the same `/translate` endpoint.

## Configuration Validation

The backend reads and validates environment values at startup:

```text
TRANSLATION_PROVIDER=local-dev
HOST=127.0.0.1
PORT=8787
DEEPL_API_URL=https://api-free.deepl.com/v2/translate
# DEEPL_API_KEY=replace-me
```

Invalid values stop the backend immediately with a clear error. This is intentional: provider problems should be visible at startup, not only after a user hovers over text.

To try DeepL later:

1. Create a DeepL API key from the official DeepL API page: https://www.deepl.com/pro-api
2. Add the key to your local `.env`.
3. Change `TRANSLATION_PROVIDER` to `deepl`.
4. Restart the backend with `corepack pnpm backend:dev:env`.

DeepL's translate endpoint expects `Authorization: DeepL-Auth-Key ...`, JSON `text` as an array, and `target_lang` as the target language code. API Free users should use `https://api-free.deepl.com/v2/translate`.

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

## Why This Step Matters

This is not the final production backend yet. It is the local scaffold that lets us learn and test the right boundary:

- Extension code stays light.
- Provider secrets stay out of the browser extension.
- Real providers can be added behind the backend without changing content-script behavior.
- Local testing remains fast and free.
