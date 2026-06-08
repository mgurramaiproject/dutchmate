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
pnpm install
pnpm typecheck
pnpm build
pnpm build:chrome
pnpm build:firefox
```

Build outputs:

- Chrome: `dist/chrome`
- Firefox: `dist/firefox`

## Load In Chrome

1. Run `pnpm build:chrome`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose "Load unpacked".
5. Select `dist/chrome`.

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

The next development step should wire content script settings reads so the tooltip uses the saved target language. A later step can add a real provider implementation behind the existing `TranslationProvider` interface.

