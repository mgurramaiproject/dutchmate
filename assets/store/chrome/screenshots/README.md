# Chrome Screenshot Capture

Last updated: 2026-06-17

Capture real product screenshots for Chrome Web Store upload. Do not use placeholder/mock screenshots in the store submission.

## First Screenshot To Capture

File name:

```text
01-hover-translation-1280x800.png
```

Goal:

Show DutchMate translating a hovered Dutch word on a normal public Dutch webpage.

## Capture Setup

1. Build the Chrome extension with `corepack pnpm build:chrome`.
2. Load `dist/chrome` from `chrome://extensions`.
3. Open a clean Chrome window with a 1280x800 viewport.
4. Visit a public Dutch webpage with no personal or private information visible.
5. Hover over a readable Dutch word until the DutchMate tooltip appears.
6. Capture the full browser viewport.

## Review Before Upload

- The screenshot is exactly 1280x800 or 640x400.
- The tooltip is visible and readable.
- No personal data, account details, private messages, browser extension error pages, or local file paths are visible.
- The screenshot shows the real extension experience, not a mockup.
