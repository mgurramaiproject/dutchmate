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

## Commands

```bash
corepack pnpm install
corepack pnpm typecheck
corepack pnpm build
corepack pnpm build:chrome
corepack pnpm build:firefox
```

Build outputs:

- Chrome: `dist/chrome`
- Firefox: `dist/firefox`

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

The next development step should add a real configurable translation provider behind the existing `TranslationProvider` interface.
