# Architecture Notes

Hover Translate is kept small on purpose:

- Content scripts own webpage interaction: word hover, text selection, tooltip placement.
- The Options page owns user settings: target language and future provider credentials.
- Translation logic lives behind `TranslationProvider`, so future API providers do not need to change DOM interaction code.
- Browser-specific differences are handled at build output time by generating separate `manifest.json` files for Chrome and Firefox.

## Manifest Strategy

Both builds use Manifest V3. The current MVP does not need a background worker because placeholder translation runs directly inside the content script and settings are handled by the Options page.

If a future provider requires background-only work, add it as a small service worker for Chrome and verify the Firefox MV3 background behavior separately.

## Performance Notes

- Hover translation waits before doing work to avoid reacting to every mouse movement.
- Hover detection only translates one word at a time.
- Selection translation caps text length for the MVP.
- No UI framework is used in the content script or Options page.

