# AMO Upload Playbook

Last updated: 2026-06-19

Use this when submitting DutchMate to Firefox Add-ons / AMO.

## Current 0.1.0 Pending Decision

Upload `0.1.1` now.

Do not delete the pending `0.1.0` submission unless AMO prevents you from uploading `0.1.1` or a reviewer explicitly asks you to remove it. `0.1.1` fixes a privacy/data-consent lint issue and has clearer listing/privacy text, so it is the better version to have reviewed.

If AMO shows both versions as pending after you upload `0.1.1`, leave them alone and wait for review. If AMO offers an obvious "cancel review" or "delete version" action for `0.1.0`, use it only if the dashboard makes clear that it cancels just that old version and does not delete the add-on listing.

## Files For This Release

- Firefox upload package: `release/dutchmate-firefox-0.1.1.zip`
- AMO source package: `release/dutchmate-firefox-source-0.1.1.zip`
- Privacy policy URL: `https://dutchmate-frontend.onrender.com/privacy-policy.html`
- Firefox privacy/listing copy: [store-disclosure-draft.md](store-disclosure-draft.md)
- Package checklist: [store-package-preparation-checklist.md](store-package-preparation-checklist.md)

## Before Every AMO Upload

1. Confirm the version in [package.json](../../package.json) is higher than the last AMO version.
2. Build the Firefox package:

```bash
corepack pnpm package:firefox
```

3. Run AMO lint:

```bash
npx --yes web-ext lint --source-dir dist/firefox
```

4. Confirm lint reports:

```text
errors          0
notices         0
warnings        0
```

5. Confirm `dist/firefox/manifest.json` includes the expected version and Firefox minimum.

For the `0.1.1` release, it should include:

```json
"version": "0.1.1",
"browser_specific_settings": {
  "gecko": {
    "strict_min_version": "140.0"
  },
  "gecko_android": {
    "strict_min_version": "142.0"
  }
}
```

6. Make sure the public privacy page says:

- DutchMate sends hovered or selected website text to `https://dutchmate-backend.onrender.com/translate`.
- It sends selected or hovered text only for translation.
- Single selected words may be cached locally in the browser.
- It does not sell data or use it for ads/tracking.
- API keys, if any, are stored in browser local/sync storage and used only for the selected provider.

## Upload A New Version On AMO

Use this path for `0.1.1` and all later updates.

1. Sign in to `https://addons.mozilla.org/`.
2. Open Developer Hub.
3. Open the existing DutchMate add-on page.
4. Choose the action to upload a new version. Do not create a separate new add-on.
5. Upload `release/dutchmate-firefox-0.1.1.zip`.
6. Wait for AMO validation.
7. If validation has errors, stop and fix them locally before continuing.
8. If validation has warnings, stop for privacy/security warnings; fix them locally unless you are certain they are harmless.
9. Select compatible platforms.
10. If AMO asks whether source code is required, answer according to the current review screen. If it asks for source because bundled code is present, upload the source package prepared for review.
11. Paste or update the privacy/listing text from [store-disclosure-draft.md](store-disclosure-draft.md).
12. Use this reviewer note:

```text
DutchMate is a Manifest V3 browser extension for Dutch learning support.

The extension sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate only for translation. The backend uses Google Cloud Translation.

Store-ready builds hide provider endpoint and API-key override controls from normal users. Local-testing builds can expose those controls for development only.

No account, login, payment, or special reviewer credentials are required.
```

13. Submit the version.
14. Save the confirmation email or screenshot in your release notes if useful.

## If AMO Blocks A New Version Because 0.1.0 Is Pending

Use the dashboard wording carefully.

1. Look for an action that cancels or deletes only version `0.1.0`.
2. Do not delete the whole DutchMate add-on listing.
3. After removing/canceling only `0.1.0`, upload `0.1.1` from the existing add-on page.
4. If the dashboard is unclear, do not click destructive actions. Ask for help and include a screenshot with secrets cropped out.

## AMO Source Package Scope

Keep the source package minimal. Include only files required to reproduce the submitted extension package:

- `AMO_SOURCE_PACKAGE_README.md`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `vite.config.ts`
- `scripts/write-manifest.mjs`
- `scripts/package-extension.mjs`
- `src/`
- `public/icons/`
- `frontend/assets/dutchmate-logo-gpt-image.png`

Do not include `docs/`, `backend/`, tests, store assets, release artifacts, `node_modules/`, `dist/`, `.env`, `.git`, `.agents`, or `.codex`.

## Why Upload From The Existing Add-On Page

Mozilla's submission docs say that new versions should be uploaded from the add-on's page so AMO recognizes the upload as an update to the existing add-on, not as a new listing.

Mozilla also says validation warnings can be continued past, but privacy or security warnings are worth fixing because they can cause review failure.

## Sources

- Mozilla Extension Workshop, Submitting an add-on: https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
- Mozilla Extension Workshop, Firefox built-in consent for data collection and transmission: https://extensionworkshop.com/documentation/develop/built-in-consent/
