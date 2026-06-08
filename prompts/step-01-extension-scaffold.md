# Step 01: Extension Scaffold

Set up the initial scaffold for a lightweight cross-browser hover translation extension at:

`/home/mgurram/MGurramAI/projects/hover-translate-proj/hover-translate-extension`

Goal: create a minimal working Chrome/Firefox browser extension scaffold for translating hovered words or selected webpage text, but use placeholder translation only in this first step.

Project choices:

- Use Vanilla TypeScript.
- Use Vite.
- Use pnpm.
- Use `webextension-polyfill` for cross-browser extension APIs.
- Use Manifest V3.
- Generate separate Chrome and Firefox build outputs/manifests.
- Default translation behavior: auto-detect source language and translate to English.
- Translation architecture: define a pluggable provider interface, but do not wire a real API provider yet.
- UI surfaces for first scaffold: content tooltip and Options page only. No popup yet.

Git:

- The target folder currently contains an empty invalid `.git` directory.
- Replace it with a proper fresh Git repository for this project.
- Do not create the repo at the parent `hover-translate-proj` level.

First scaffold should include:

- `package.json` with pnpm scripts for dev/build/lint/typecheck if appropriate.
- TypeScript config.
- Vite config suitable for browser extension bundling.
- Source folders for content script, options page, background/service worker if needed, shared types, and translation providers.
- Manifest source/template files for Chrome and Firefox.
- A content script that detects:
  - hovering over a single word after a short delay
  - selected text after selection
- A lightweight tooltip injected into the page that shows placeholder text such as "Translation will appear here."
- An Options page shell for target language and future provider endpoint/API key settings.
- Basic `.gitignore`, README, and project notes explaining the initial architecture.

Constraints:

- Keep the extension fast and light.
- Avoid heavy frameworks.
- Do not add a real translation API call yet.
- Do not build a popup yet.
- Keep the setup small enough to teach the extension architecture step by step.

Success criteria:

- `pnpm install` works.
- TypeScript compiles.
- The extension can be built for Chrome and Firefox.
- The Chrome build can be loaded as an unpacked extension.
- The content script shows a placeholder tooltip on hover/selection.
- The repo is initialized cleanly with no broken `.git` state.

Reference docs checked on 2026-06-08:

- Chrome Manifest V3 docs: https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3
- MDN cross-browser extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension
- MDN background manifest notes: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background
