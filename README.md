# DutchMate

Learn Dutch online with English and your mother tongue close by.

DutchMate helps Dutch learners use Dutch, English, and a supported mother tongue such as Telugu together while reading websites, with quick hover and selection translations in context.

## Current Scope

- Vanilla TypeScript
- Vite build pipeline
- Manifest V3
- Separate Chrome and Firefox build outputs
- `webextension-polyfill` for cross-browser extension APIs
- Content script tooltip for hover and selection
- Options page shell for target language and future provider settings
- Current target languages: English, Dutch, and Telugu
- Optional custom JSON translation endpoint

## Commands

```bash
corepack pnpm install
corepack pnpm verify
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm build:chrome
corepack pnpm build:firefox
corepack pnpm backend:dev
corepack pnpm backend:dev:env
corepack pnpm mock:translate
```

Build outputs:

- Chrome: `dist/chrome`
- Firefox: `dist/firefox`

Run `corepack pnpm verify` before committing changes.

## Load In Chrome

1. Run `corepack pnpm build:chrome`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose "Load unpacked".
5. Select `dist/chrome`.

## Load In Firefox

1. Run `corepack pnpm build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Choose "Load Temporary Add-on...".
4. Select `dist/firefox/manifest.json`.

See [docs/release/manual-testing.md](docs/release/manual-testing.md) for the full local testing checklist.

## Custom Endpoint

The extension uses the DutchMate Render backend by default:

```text
https://dutchmate-backend.onrender.com/translate
```

Options still allow a custom JSON translation endpoint for development. If the endpoint is intentionally blank, the extension uses placeholder translation.

Endpoint requirements:

- `https://...`
- `http://localhost...`
- `http://127.0.0.1...`

See [docs/architecture/architecture.md](docs/architecture/architecture.md) for the request and response contract.
See [docs/architecture/provider-strategy.md](docs/architecture/provider-strategy.md) for provider choice, pricing, and production backend notes.
See [docs/architecture/local-backend.md](docs/architecture/local-backend.md) for the local real-translation backend scaffold.
See [docs/product/mvp-language-focus.md](docs/product/mvp-language-focus.md) for the Dutch, English, and Telugu current language scope.
See [docs/architecture/cache-strategy.md](docs/architecture/cache-strategy.md) for the word-only local persistent cache plan.
See [docs/product/viral-adoption-roadmap.md](docs/product/viral-adoption-roadmap.md) for the free/paid, caching, auth, and adoption roadmap.

For local testing, run:

```bash
corepack pnpm backend:dev
```

To run with a local `.env` file, copy `.env.example` to `.env`, edit values if needed, then run:

```bash
corepack pnpm backend:dev:env
```

For local endpoint testing, build a local-testing extension and override the endpoint in Options:

```bash
corepack pnpm build:firefox:local-testing
corepack pnpm build:chrome:local-testing
```

```text
http://localhost:8787/translate
```

Store-ready builds hide the endpoint override from normal users.

## Project Structure

```text
src/content/       Injected webpage behavior and tooltip UI
src/options/       Extension options page
src/shared/        Shared settings and constants
src/translation/   Translation provider interface and placeholder provider
scripts/           Build helper scripts
prompts/           Reusable project prompts
```

## Next Steps

The next development step should improve the tooltip state handling for loading, errors, and repeated hover requests.
