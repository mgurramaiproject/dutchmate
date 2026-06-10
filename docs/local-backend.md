# Local Translation Backend

The local backend is the first production-shaped boundary for real translation. The extension still sends the same request as before, but now there is a small backend service with controller, service, and provider layers.

## Run It

```bash
corepack pnpm backend:dev
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

## Current Provider

The current provider is `local-dev`. It is intentionally small and dependency-free:

- Known sample words return a simple real translation, such as `bonjour` to `hello`.
- Unknown text returns an obvious local-development response, such as `[local-dev en] ...`.

This lets us verify the backend shape before signing up for a paid provider or adding provider SDKs.

## Backend Boundaries

```text
backend/dev-server.mjs
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
