# Manual Testing

Use this checklist after each extension behavior change.

## Public Release Gate

Use this short gate before the Firefox-first soft launch and before copying final store answers.

- Verify Firefox and Chrome against the real hosted backend at `https://dutchmate-backend.onrender.com/translate`, not only a local mock endpoint.
- Verify hover and selection both work on normal readable webpages, and selection still wins when the pointer is resting over a hovered word.
- Save action appears only for successful selected single-word translations.
- Saved vocabulary stays local, duplicate saves stay deduplicated, and hover lookups plus selected phrases or sentences do not create saved vocabulary entries.
- Clear user-facing errors appear for busy and unreachable backend states.
- After a timeout, unreachable backend, or busy response, the next hover or selection still works normally.
- Store-ready builds keep provider override controls hidden, while the privacy section and saved-vocabulary section still reflect the real local-only behavior.

## Build

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm verify
```

Expected outputs:

- Chrome extension: `dist/chrome`
- Firefox extension: `dist/firefox`

## Popup Review Release Checks

Run the artifact gate after the popup review MVP changes:

```bash
corepack pnpm verify:release
```

After loading each generated build, confirm that the popup opens on Learn, stays at the fixed 390x600 size while moving between Learn, flashcards, and Settings, and scrolls content inside that frame. Confirm the Learn and Settings tabs can be reached by keyboard, arrow/Home/End keys move focus between tabs, focus is visible, and the layout remains usable at a narrower popup width. Confirm the generated ZIP contains the popup, Options page, background, content script, icons, and browser-specific background declaration.

## LearnLoop Release Checks

Run the complete automated gate from a clean checkout before a browser pass:

```bash
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build:chrome
corepack pnpm build:firefox
corepack pnpm verify:release
git diff --check
```

The automated suite covers representative legacy migration, version-two backup round trips, version-one backup import, twelve-lesson structural validation, and rendered popup contracts. Inspect each generated `manifest.json` and package result as part of `verify:release`; each browser must include the background worker, content script, popup, Options page, icons, bundled lesson catalog, and its browser-specific background declaration and popup entry point.

The human lesson-content gate is recorded in the completed T05, T07, T08, and T09 ticket acceptance criteria. Together they record Dutch accuracy, English and Telugu meaning, CEFR fit, cultural suitability, and practical usefulness for the twelve shipped lessons; `src/lessons/catalog.test.ts` independently verifies that the published catalog contains exactly those twelve reviewed entries.

For each browser, load the store-ready artifact and record the result in the Verification Log. Check all of the following:

- the popup remains usable at its narrow `390x600` frame; Today is the default, Daily Five starts and completes, Settings is available from its labelled header control, Lessons opens and resumes, and a focused review or lesson flow has a clear exit;
- keyboard tab order is logical; visible focus, roles and labels, pending and disabled controls, reduced motion, and no horizontal scrolling hold throughout Today, Lessons, Settings, and focused flows;
- export then import restores learning items, English and Telugu meanings, capped contexts, recognition and recall mastery, lesson progress, and learning rhythm; importing a version-one vocabulary backup also succeeds;
- representative webpage capture requires confirmation for a chunk, cancellation persists nothing, and a deliberate lookup of an existing item records an encounter without changing mastery.

Use a normal readable Dutch webpage and the local mock endpoint when a deterministic translation response is needed. Do not use a private page for this check.

## Voluntary Learner Validation Protocol

This is a small post-release learning check, not product telemetry or a research claim. Invite a small voluntary cohort of Telugu-speaking adult Dutch learners. Obtain informed agreement, let participants stop without explanation, and collect only the notes they choose to share outside the extension.

1. Ask each participant to use two or more bundled lessons and keep only the words or chunks they want for review.
2. After an item has reached Familiar or Strong, ask a delayed check at least seven days later: show the Dutch item in a new short context and ask for its meaning or appropriate use without opening DutchMate first.
3. At a later delayed check, use a short reduced-support version of a practised story: remove most English and Telugu help and ask practical comprehension questions about the situation and the central pattern.
4. Record voluntary qualitative feedback and the observed delayed-recall/comprehension result per participant. Treat results as directional product evidence, not a statistically generalizable study.

Do not treat review count, lesson completion, time in product, or background analytics as evidence of learning. DutchMate must not add background telemetry, remote identifiers, or automatic study reporting for this protocol.

## Verification Log

Use this small log after a real browser pass. Keep entries newest first.

```text
Date:
Build or commit:
Browser:
Tester:
Result:
Notes:
```

Recent entries:

- 2026-07-20 | `9e4886f` | Firefox 152.0.6 on Linux | MGurram | Pass | Reloaded the LearnLoop popup after the focused-layout fix. The lesson-stage actions, including `Notice the pattern` and `Practise`, are visible and reachable; no bottom clipping remains. Broader cross-browser interaction and accessibility checks remain pending.
- 2026-07-20 | `4d6359e` + T12 release-documentation worktree | Chrome 149.0.7827.114 and Firefox 152.0.6 on Linux | Codex | Automated pass; interactive browser pass deferred | 460 tests, typecheck, Chrome/Firefox builds, package verification, manifest inspection, ZIP inspection, and whitespace check passed. The remaining interactive popup, keyboard/focus, import/export, and webpage-capture checks need a human browser tester and are listed in LearnLoop Release Checks.
- 2026-06-21 | `91f518b` | Chrome 0.1.1 production-backed build | MGurram | Pass with notes | Hover and selection translations worked with the default Render backend. Chrome console showed `Extension context invalidated` and `IndexSizeError: Failed to execute 'setEnd' on 'Range'`; behavior still worked, but the range error needs a focused follow-up fix.
- 2026-06-21 | `91f518b` | Firefox 0.1.1 production-backed build | MGurram | Pass | Hover and selection translations worked as intended.
- 2026-06-17 | `096aff1` | Chrome production-backed build | MGurram | Pass | After reloading Chrome and reopening the test page, hover/selection translations worked. This verifies the defensive tooltip render fallback fixed the Chrome `Translating...` stall.
- 2026-06-17 | `096aff1` | Firefox production-backed build | MGurram | Pass | Firefox continued to work as intended after the hover hit-detection and tooltip render fallback fixes.
- 2026-06-17 | `aa3432d` | Chrome production-backed build | MGurram | Fail | Chrome loaded the current build, but hover/selection stayed on `Translating...` and did not display the translation. Needs focused Chrome investigation before broader sharing.
- 2026-06-17 | `aa3432d` | Firefox production-backed build | MGurram | Pass | Firefox worked as intended with the current production-backed build.
- 2026-06-16 | `6d7ea6c` | Chrome full translation path | MGurram | Pass | Chrome behaved as intended, similar to Firefox. Real hover/selection translations worked through the default Render endpoint and Google Cloud Translation.
- 2026-06-16 | `6d7ea6c` | Firefox full translation path | MGurram | Pass | After Google Cloud Translation activation, the Firefox extension used the default Render endpoint and real hover/selection translations worked through `extension -> Render backend -> Google Cloud Translation -> tooltip`.
- 2026-06-16 | `61ee87b` | Render backend / Google Cloud Translation | MGurram + Codex | Pass | Render was configured with `TRANSLATION_PROVIDER=google-translate` and a restricted Cloud Translation API key. Live smoke test passed for `https://dutchmate-backend.onrender.com`.
- 2026-06-15 | `91477d9` | Firefox friendly rate-limit message | MGurram | Pass | After reloading the Firefox build, hovering with the default Render endpoint showed `Translation is temporarily busy. Try again soon.` while MyMemory returned `429`.
- 2026-06-15 | `eff6002` | Firefox hover tooltip error display | MGurram | Pass | After reloading `dist/firefox/manifest.json`, hover tooltip appeared and showed `Translation failed: Provider returned 429`. This confirmed the content/background script loading fix restored hover error visibility; remaining blocker is MyMemory provider reliability.
- 2026-06-15 | `86006dc` | Firefox default Render endpoint | MGurram | Partial | Provider endpoint was prefilled with `https://dutchmate-backend.onrender.com/translate`. "Test endpoint" reached the backend and failed with `Provider returned 429`, matching the known MyMemory hosted limit. Hover tooltip did not appear and needs a focused follow-up investigation.
- 2026-06-15 | `6e25b62` | Render backend / MyMemory | MGurram + Codex | Partial | Render backend health passed at `https://dutchmate-backend.onrender.com`; `/translate` reached backend but returned `429` from MyMemory. Render logs confirmed `configuredProvider: "mymemory"`, `myMemoryEmailConfigured: true`, `providerStatus: 429`, and `providerRateLimited: true`.
- 2026-06-15 | `d92f70a` | Backend / MyMemory | MGurram | Pass | Local backend smoke test passed at `http://localhost:8787` with `Backend smoke test passed: http://localhost:8787`.
- 2026-06-14 | `1847d3c` | Firefox | MGurram | Pass | Cache count is visible. Previously stored cached word count persists after loading the compiled extension.

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
- Successful selected single-word translations show a Save action.
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
- Successful selected single-word translations show a Save action.
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
6. Return to Options and check the Behavior and Privacy sections.

Expected result:

- The placeholder tooltip shows the selected language code.
- The target-language dropdown only shows English, Dutch, and Telugu.
- The source-language dropdown shows Auto, English, Dutch, and Telugu.
- "Translate into both other languages" is on by default and remains saved after toggling.
- Store-ready builds do not show Provider endpoint or Provider API key.
- The Privacy section shows `Cached words: 0` when no words have been persisted.
- The Privacy section explains that selected single words are cached locally by default, hovered single words are cached only when enabled, and selected phrases or sentences are not cached.
- Clicking "Clear translation cache" clears the local cache and keeps the cached word count at `0`.
- The Saved vocabulary section shows a count, empty state, saved words, delete controls, and a clear-all control.
- A long saved vocabulary list scrolls inside the section instead of expanding the Options page indefinitely.

Dual-language mode:

1. Set Source language to Auto.
2. Keep "Translate into both other languages" on.
3. Save.
4. Hover or select English, Dutch, or Telugu text.

Expected result:

- The tooltip shows translations in the other two supported languages.
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

## Saved Vocabulary

The saved vocabulary list is stored locally under:

```text
dutchmate.savedVocabulary.v1
```

Feature behavior check:

1. Build and load `dist/chrome` or `dist/firefox`.
2. Open a normal webpage.
3. Select a single word and wait for a successful translation.
4. Click "Save" in the tooltip.
5. Open Options.
6. Confirm the Saved vocabulary section shows the saved word, translation, target language, and saved count.
7. Return to the webpage and save the same word with the same language direction again.
8. Confirm the tooltip reports that it is already saved and Options does not show a duplicate entry.
9. Select a phrase or sentence.
10. Confirm the tooltip does not show a Save action.
11. Hover over a word.
12. Confirm the hover tooltip does not show a Save action.
13. Delete one saved vocabulary entry from Options.
14. Save a word again, then click "Clear saved vocabulary".

Expected result:

- Saved vocabulary appears only after the user saves a successful selected single-word translation.
- Hover translations and selected phrases or sentences do not create saved vocabulary entries.
- Duplicate saves for the same word and language direction do not create duplicate entries.
- In dual-language mode, saving one translated word stores one saved entry per target language.
- Delete removes one entry.
- Clear saved vocabulary removes all saved entries.
- Saved entries remain after reloading the extension until the user deletes them.

Cache reuse check:

1. In Options, turn on cached hovered single words.
2. Hover a single word and wait for a successful translation.
3. Select that same single word immediately afterward.

Expected result:

- The selected-word translation should be able to reuse the persisted single-word cache from the earlier hover.
- The second result should feel noticeably faster than a fresh uncached request on the same page and language direction.

Developer inspection:

Chrome:

```js
chrome.storage.local.get("dutchmate.savedVocabulary.v1", console.log);
```

Firefox:

```js
browser.storage.local.get("dutchmate.savedVocabulary.v1").then(console.log);
```

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
- Long selections above the configured limit do not translate and show `Selection is too long. Try 150 characters or fewer.` near the selection.

## Custom Endpoint

Custom endpoint controls are available only in local-testing builds:

```bash
corepack pnpm build:firefox:local-testing
corepack pnpm build:chrome:local-testing
```

Store-ready builds hide these controls from normal users.

Provider endpoint rules:

- The default endpoint is `https://dutchmate-backend.onrender.com/translate`.
- Empty endpoint is still allowed for developer testing and uses placeholder translation.
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

1. Load a local-testing build of the extension.
2. Set Provider endpoint to `http://localhost:8787/translate`.
3. Leave Provider API key blank.
4. Click "Test endpoint".
5. Confirm the page shows `Endpoint OK: [mock en] bonjour`.
6. Click "Save".
7. Return to a normal webpage.
8. Hover a word or select text.

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
- The tooltip briefly shows a loading state, then `Translation failed: Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.`

Rate-limit test:

1. Use the default Render endpoint while MyMemory is returning `429`.
2. Hover a word or select short text.

Expected result:

- The tooltip shows `Translation is temporarily busy. Try again soon.`

You can stop the mock server with `Ctrl+C`.

## Translation Cache Inspection

The persistent cache is stored locally under:

```text
dutchmate.translationCache.v1
```

It should contain successful selected single-word translations. Hovered single-word translations should appear only when "Cache hovered single-word translations locally" is enabled. Selected phrases, selected sentences, failed translations, and timeout errors should not appear there.

Chrome developer check:

1. Build and load `dist/chrome`.
2. Open `chrome://extensions`.
3. Find DutchMate and click "service worker" or "Inspect views".
4. In the DevTools Console, run:

```js
chrome.storage.local.get("dutchmate.translationCache.v1", console.log);
```

5. To clear it during testing, run:

```js
chrome.storage.local.remove("dutchmate.translationCache.v1");
```

Firefox developer check:

1. Build and load `dist/firefox/manifest.json`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Find DutchMate and click "Inspect".
4. In the Console, run:

```js
browser.storage.local.get("dutchmate.translationCache.v1").then(console.log);
```

5. To clear it during testing, run:

```js
browser.storage.local.remove("dutchmate.translationCache.v1");
```

Cache behavior check:

1. Load a local-testing build of the extension.
2. Start a local provider endpoint with `corepack pnpm backend:dev` or `corepack pnpm mock:translate`.
3. In Options, set Provider endpoint to `http://localhost:8787/translate`.
4. Click "Test endpoint" and confirm it succeeds before testing hover, selection, or cache behavior.
5. Keep "Translate into both other languages" on.
6. Select a single word, ideally by double-clicking it.
7. Inspect `dutchmate.translationCache.v1` and confirm cache entries appear for each target language.
8. Open Options and confirm the Privacy section still shows `Cached words: 1`.
9. This count is unique source words, not raw translation records.
9. Hover over a word while "Cache hovered single-word translations locally" is off.
10. Inspect the cache again and confirm the hover did not add an entry.
11. Turn "Cache hovered single-word translations locally" on in Options.
12. Hover over a single word.
13. Inspect the cache again and confirm the hover added an entry.
14. Select a phrase or sentence.
15. Inspect the cache again and confirm the phrase or sentence did not add an entry.
16. Click "Clear translation cache" in Options.
17. Inspect the cache again and confirm `dutchmate.translationCache.v1` is removed.

## Current MVP Limits

- Fresh installs use the Render backend endpoint by default.
- Translation uses placeholder text only when the provider endpoint is intentionally cleared.
- Hover translation can run in Word mode for compact lookup or Sentence mode for nearby context. Word mode is the default.
- Selection text is capped to keep the MVP lightweight.
- Target languages are intentionally limited to English (`en`), Dutch (`nl`), and Telugu (`te`).
- Source languages are limited to Auto, English (`en`), Dutch (`nl`), and Telugu (`te`).
- Dual-language output is on by default and uses lightweight source detection when Source language is Auto.
