# Hover Translate Extension

A lightweight cross-browser extension that will translate hovered words or selected webpage text.

This first scaffold intentionally uses placeholder translation only. The goal is to learn and build the extension architecture step by step before wiring a real translation provider.

## Current Scope

- Vanilla TypeScript
- Vite build pipeline
- Manifest V3
- Separate Chrome and Firefox build outputs
- `webextension-polyfill` for cross-browser extension APIs
- Content script tooltip for hover and selection
- Options page shell for target language and future provider settings
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

See [docs/manual-testing.md](docs/manual-testing.md) for the full local testing checklist.

## Custom Endpoint

The extension can call a custom JSON translation endpoint configured from Options. If the endpoint is blank, it uses placeholder translation.

Endpoint requirements:

- `https://...`
- `http://localhost...`
- `http://127.0.0.1...`

See [docs/architecture.md](docs/architecture.md) for the request and response contract.
See [docs/provider-strategy.md](docs/provider-strategy.md) for provider choice, pricing, and production backend notes.

For local testing, run:

```bash
corepack pnpm mock:translate
```

Then configure this endpoint in Options:

```text
http://localhost:8787/translate
```

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
