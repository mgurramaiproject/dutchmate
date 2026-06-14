# Manual Testing

Use this checklist after each extension behavior change.

## Build

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm verify
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
- Moving quickly between words should not show an older translation after a newer hover starts.
- With hover mode set to Sentence, hovering a word inside a sentence may translate the nearby phrase while the tooltip still appears near the hovered word.
- Selecting text while the pointer rests over a word should show the selected-text translation, not the hovered word.
- Pressing `Esc`, clicking the page, or scrolling hides the tooltip.
- A selection tooltip stays visible when the mouse leaves the page area.

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
- Moving quickly between words should not show an older translation after a newer hover starts.
- Selecting text while the pointer rests over a word should show the selected-text translation, not the hovered word.
- Pressing `Esc`, clicking the page, or scrolling hides the tooltip.
- A selection tooltip stays visible when the mouse leaves the page area.

Notes:

- Reload the unpacked extension after rebuilding.
- The content script does not run on `chrome:*` pages, browser settings pages, or protected extension store pages.

## Options Page

Firefox:

1. Open `about:addons`.
2. Select "DutchMate".
3. Open Preferences or Options.

Chrome:

1. Open `chrome://extensions`.
2. Find "DutchMate".
3. Click "Details".
4. Click "Extension options".

Test:

1. Change the source language.
2. Change the target language.
3. Click "Save".
4. Return to a webpage where the extension is active.
5. Hover or select text again.

Expected result:

- The placeholder tooltip shows the selected language code.
- The target-language dropdown only shows English, Dutch, and Telugu.
- The source-language dropdown shows Auto, English, Dutch, and Telugu.
- "Show the other two MVP languages" is on by default and remains saved after toggling.

Dual-language mode:

1. Set Source language to Auto.
2. Keep "Show the other two MVP languages" on.
3. Save.
4. Hover or select English, Dutch, or Telugu text.

Expected result:

- The tooltip shows translations in the other two MVP languages.
- Telugu source text is detected by script.
- Dutch and English source text use nearby page language hints and lightweight MVP detection hints; unknown Latin words fall back to English.

Behavior toggles:

1. Turn off "Translate on hover", save, then hover a word.
2. Select text.
3. Turn "Translate on hover" back on, turn off "Translate selected text", save, then repeat both actions.
4. Turn off "Enable extension", save, then repeat both actions.

Expected result:

- Hover does nothing when hover translation is off.
- Selection does nothing when selected-text translation is off.
- Both hover and selection do nothing when the extension is disabled.

Tuning controls:

1. Drag "Hover delay" to `150 ms`, save, then hover a word.
2. Drag "Hover delay" to `1500 ms`, save, then hover a word.
3. Confirm "Hover translation mode" is `Word`, save, then hover a word inside a sentence.
4. Change "Hover translation mode" to `Sentence`, save, then hover the same word.
5. Drag "Max selected text length" to `50 chars`, save, then select a long sentence.

Expected result:

- A lower hover delay shows the tooltip sooner.
- A higher hover delay waits longer before showing the tooltip.
- Word mode translates only the hovered word.
- Sentence mode translates compact nearby context and remains anchored to the hovered word.
- Long selections above the configured limit do not translate and show `Selection is too long. Try 50 characters or fewer.` near the selection.

## Custom Endpoint

Provider endpoint rules:

- Empty endpoint is allowed and uses placeholder translation.
- `https://...` endpoints are allowed.
- `http://localhost...` and `http://127.0.0.1...` are allowed for local development.
- Other `http://...` endpoints are rejected.

Request contract:

```http
POST <providerEndpoint>
Content-Type: application/json
Authorization: Bearer <apiKey>
```

The `Authorization` header is sent only when the API key field is not blank.

Request body:

```json
{
  "text": "bonjour",
  "sourceLanguage": "auto",
  "targetLanguage": "en",
  "context": "hover"
}
```

Expected response:

```json
{
  "translatedText": "hello"
}
```

### Local Mock Endpoint

Run the mock server:

```bash
corepack pnpm mock:translate
```

It listens at:

```text
http://localhost:8787/translate
```

In extension Options:

1. Set Provider endpoint to `http://localhost:8787/translate`.
2. Leave Provider API key blank.
3. Click "Test endpoint".
4. Confirm the page shows `Endpoint OK: [mock en] bonjour`.
5. Click "Save".
6. Return to a normal webpage.
7. Hover a word or select text.

Expected result:

```text
[mock en] <hovered or selected text>
```

Error test:

1. Keep the endpoint configured.
2. Stop the mock server with `Ctrl+C`.
3. Click "Test endpoint" in Options, or hover/select text on a webpage.

Expected result:

- Options shows a clear test failure message.
- The tooltip briefly shows a loading state, then a clear translation failure message.

You can stop the mock server with `Ctrl+C`.

## Current MVP Limits

- Translation uses placeholder text until a provider endpoint is configured.
- Hover translation can run in Word mode for compact lookup or Sentence mode for nearby context. Word mode is the default.
- Selection text is capped to keep the MVP lightweight.
- Target languages are intentionally limited to English (`en`), Dutch (`nl`), and Telugu (`te`).
- Source languages are limited to Auto, English (`en`), Dutch (`nl`), and Telugu (`te`).
- Dual-language output is on by default and uses lightweight source detection when Source language is Auto.
