# Store Package Preparation Checklist

Last updated: 2026-06-17

Use this checklist before uploading DutchMate to the Chrome Web Store or Firefox Add-ons. This document is about preparing and inspecting release artifacts; it does not submit anything to a store by itself.

## Inputs

- Current release commit.
- Passing `corepack pnpm verify`.
- Latest Chrome and Firefox manual pass in [manual-testing.md](manual-testing.md).
- Privacy and store disclosure copy from [privacy-policy-draft.md](privacy-policy-draft.md) and [store-disclosure-draft.md](store-disclosure-draft.md).
- Google Cloud cost monitoring evidence from [google-cloud-cost-monitoring-checklist.md](google-cloud-cost-monitoring-checklist.md).

## Build Commands

Run from the repo root:

```bash
corepack pnpm verify
```

Expected build outputs:

```text
dist/chrome
dist/firefox
```

Store-ready builds should use the normal commands, not local-testing builds:

```bash
corepack pnpm build:chrome
corepack pnpm build:firefox
```

Do not use these for store upload:

```bash
corepack pnpm build:chrome:local-testing
corepack pnpm build:firefox:local-testing
```

The local-testing builds may expose developer endpoint controls that normal users should not see.

## Pre-Zip Inspection

Inspect both manifests:

```text
dist/chrome/manifest.json
dist/firefox/manifest.json
```

Confirm:

- extension name is `DutchMate`;
- version is correct for the submission;
- Manifest V3 is used;
- permissions are limited to `storage`;
- host permissions match the MVP translation behavior;
- Chrome uses `background.service_worker`;
- Firefox uses `background.scripts` and has `browser_specific_settings.gecko`;
- options page points to `src/options/index.html`;
- content script points to `assets/content.js`;
- provider endpoint/API-key controls are hidden in the normal Options page.

Inspect the built Options page in both builds:

```text
dist/chrome/src/options/index.html
dist/firefox/src/options/index.html
```

Confirm normal users can change language and behavior settings, but do not see Provider endpoint or Provider API key controls.

## Chrome Package

Chrome Web Store expects a zip file containing the extension files at the zip root.

Suggested artifact path:

```text
release/dutchmate-chrome-0.1.0.zip
```

Suggested command from repo root:

```bash
mkdir -p release
cd dist/chrome
zip -r ../../release/dutchmate-chrome-0.1.0.zip .
```

Before upload:

- unzip the artifact into a temporary folder;
- confirm `manifest.json` is at the zip root;
- load the unzipped folder through `chrome://extensions`;
- run a quick hover and selection smoke test.

## Firefox Package

Firefox Add-ons can accept a zipped web extension package. For temporary local loading, Firefox uses `dist/firefox/manifest.json`.

Suggested artifact path:

```text
release/dutchmate-firefox-0.1.0.zip
```

Suggested command from repo root:

```bash
mkdir -p release
cd dist/firefox
zip -r ../../release/dutchmate-firefox-0.1.0.zip .
```

Before upload:

- unzip the artifact into a temporary folder;
- confirm `manifest.json` is at the zip root;
- load the unzipped manifest through `about:debugging#/runtime/this-firefox`;
- run a quick hover and selection smoke test.

## Store Listing Inputs

Prepare these before submission:

- short description;
- longer description;
- privacy policy public URL;
- support/contact email;
- screenshots;
- category;
- language;
- reviewer notes;
- test instructions.

Use [store-disclosure-draft.md](store-disclosure-draft.md) as the starting point.

## Reviewer Notes Draft

```text
DutchMate is a Manifest V3 browser extension for Dutch reading support.

The extension translates hovered words and selected text through the DutchMate backend at https://dutchmate-backend.onrender.com/translate, which uses Google Cloud Translation.

No account, login, payment, or reviewer credentials are required.

To test:
1. Install the extension.
2. Open a normal Dutch webpage.
3. Hover over a Dutch word.
4. Select a short Dutch phrase or sentence.
5. Open Options and confirm language and behavior settings can be changed.
```

## Final Release Gate

Do not upload until:

- `corepack pnpm verify` passes;
- Chrome package smoke test passes;
- Firefox package smoke test passes;
- privacy policy is available at a public URL;
- Google Cloud budget and spend checks are current;
- support/contact email is ready;
- release artifact names include the intended version.
