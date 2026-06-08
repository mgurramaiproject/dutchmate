# Manual Testing

Use this checklist after each extension behavior change.

## Build

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm typecheck
corepack pnpm build
```

Expected outputs:

- Chrome extension: `dist/chrome`
- Firefox extension: `dist/firefox`

## Firefox

1. Run `corepack pnpm build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click "Load Temporary Add-on...".
4. Select `dist/firefox/manifest.json`.
5. Open a normal webpage.
6. Hover over a word and wait briefly.
7. Select a short phrase or sentence.

Expected result:

- Hovering shows a tooltip with placeholder translation.
- Selecting text shows the same tooltip near the selection.
- Changing the target language in Options changes the language code shown in the tooltip.

Notes:

- Temporary Firefox add-ons are removed when Firefox restarts.
- The content script does not run on `about:*` pages, browser settings pages, or protected extension store pages.

## Chrome

1. Run `corepack pnpm build:chrome`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select `dist/chrome`.
6. Open a normal webpage.
7. Hover over a word and wait briefly.
8. Select a short phrase or sentence.

Expected result:

- Hovering shows a tooltip with placeholder translation.
- Selecting text shows the same tooltip near the selection.
- Changing the target language in Options changes the language code shown in the tooltip.

Notes:

- Reload the unpacked extension after rebuilding.
- The content script does not run on `chrome:*` pages, browser settings pages, or protected extension store pages.

## Options Page

Firefox:

1. Open `about:addons`.
2. Select "Hover Translate".
3. Open Preferences or Options.

Chrome:

1. Open `chrome://extensions`.
2. Find "Hover Translate".
3. Click "Details".
4. Click "Extension options".

Test:

1. Change the target language.
2. Click "Save".
3. Return to a webpage where the extension is active.
4. Hover or select text again.

Expected result:

- The placeholder tooltip shows the selected language code.

## Current MVP Limits

- Translation is still placeholder text.
- Provider endpoint and API key are saved for future use but not called yet.
- Hover translation only detects one word at a time.
- Selection text is capped to keep the MVP lightweight.
