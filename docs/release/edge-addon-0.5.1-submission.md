# Microsoft Edge Add-on 0.5.1 Submission

Last updated: 2026-08-05

Use this document for the Microsoft Edge Add-ons submission and listing
details for DutchMate 0.5.1.

## Important version gate

The existing DutchMate Edge listing is public at:

https://microsoftedge.microsoft.com/addons/detail/dutchmate/plobaccfjjbpfekjomnmmidlmjjdecme

Before uploading, check the version currently shown in Partner Center. If the
listing already reports `0.5.1`, do not upload this same package as a new
update. Microsoft requires an update package with a higher version number.
Use this document as the 0.5.1 release record and prepare the next patch or
minor release for a package update.

Open the existing product in [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview).

## Upload artifact

Upload this Chromium-compatible Edge package:

`release/dutchmate-edge-0.5.1.zip`

The Edge artifact is a verified copy of the Chrome Chromium package. The
repository does not maintain a separate Edge build implementation.

Local upload SHA-256:

`8bfaba49e5e1b57c44c82370ee0337eda92b6b70d6808f00fb9f42ec060a70cd`

GitHub release download:

https://github.com/mgurramaiproject/dutchmate/releases/download/v0.5.1/dutchmate-edge-0.5.1.zip

Do not upload `release/dutchmate-firefox-0.5.1.zip` or the Firefox source
package to Edge. The package must contain `manifest.json` at the ZIP root.

The existing GitHub v0.5.1 asset predates the unused `downloads` permission
correction. Use the rebuilt local package above for a store submission until a
corrected GitHub release asset is published.

## Version and package facts

- Name: `DutchMate`
- Manifest version: `3`
- Package version: `0.5.1`
- Manifest description: `Learn Dutch while reading, with quick English and Telugu translations in context.`
- Permission: `storage`
- Backend host permission: `https://dutchmate-backend.onrender.com/*`
- Webpage matches: `http://*/*`, `https://*/*`
- Remote code: No
- Hover translation: disabled; deliberate text selection remains available
- Account, subscription, payment, or reviewer credentials: not required

## Store listing

### Name

```text
DutchMate
```

### Short description

The package manifest supplies the short listing description:

```text
Learn Dutch while reading, with quick English and Telugu translations in context.
```

If Partner Center requires changing this field, update the manifest source and
upload a package with a higher version. Do not edit the 0.5.1 package metadata
only in the dashboard.

### Full description

```text
DutchMate is a focused browser extension for learning Dutch while reading online.

Select a Dutch, English, or Telugu word, phrase, or short sentence to see translations in context. Keep English as a bridge language, bring Telugu close to the page, and build vocabulary from the text you already read.

Practise Dutch grammar, verb conjugations with English comparisons, and sentence exercises that help you gain vocabulary. Save useful single-word translations locally, then return to them with Daily Five, Lessons, and Verb Journeys.

Your learning data stays in your browser. DutchMate does not require an account, subscription, or payment.

Privacy note: DutchMate sends the text you select for translation to the DutchMate backend, which uses Google Cloud Translation to return the result. Avoid using DutchMate on private pages if you do not want that text sent for translation.
```

### Search terms

```text
learn Dutch
Dutch translation
English Telugu
language learning
vocabulary
reading practice
```

Use the live Partner Center character limits if they differ from this packet.

### Properties

```text
Category: Productivity
Language: English (en-US)
Website: https://dutchmate-frontend.onrender.com/
Support contact: dutchmate.project@gmail.com
Privacy policy: https://dutchmate-frontend.onrender.com/privacy-policy.html
Mature content: No
Visibility: Public
Markets: All available markets
```

### Required visual assets

Upload or confirm the current Edge listing assets in the English store
listing:

- Square DutchMate logo, 1:1 aspect ratio; Microsoft recommends 300 x 300
  pixels and accepts a minimum of 128 x 128.
- Small promotional tile: [dutchmate-promo-440x280.png](../../public/brand/png/dutchmate-promo-440x280.png)
  at exactly 440 x 280 pixels.
- Large promotional tile: [dutchmate-promo-1400x560.png](../../public/brand/png/dutchmate-promo-1400x560.png)
  at exactly 1400 x 560 pixels.
- Up to six readable screenshots at an accepted Edge size, preferably 1280 x
  800.
- Optional promotional tiles only if they improve the listing.

Do not use screenshots or copy that claim hover translation is available in
0.5.1. The current product flow uses deliberate text selection.

## Privacy page answers

### Single purpose

```text
DutchMate helps users learn Dutch online by translating deliberately selected webpage text between Dutch, English, and Telugu.
```

### Does the extension transmit user data?

```text
Yes. DutchMate sends text that the user selects, together with language settings and translation context, to the DutchMate backend so it can return a translation.
```

### Data types

Select the data categories that match the live Partner Center form:

- Website content: selected words, phrases, and short sentences from
  webpages.
- User interaction data: the selected-text translation action.
- Local settings and learning data: language settings, cache preferences,
  saved vocabulary, learning items, mastery, lesson progress, Daily Five
  progress, rhythm, and Verb Journey progress stored locally in the browser.

Do not claim that DutchMate collects personal identifiers, financial data,
health data, authentication data, or payment data.

### Purpose of data use

```text
DutchMate uses the text and language settings to provide the translation feature, improve reliability, prevent abuse, and control translation-provider cost.
```

### Third-party sharing

```text
DutchMate sends the text required for translation to the DutchMate backend. The backend sends the text needed to complete the translation to Google Cloud Translation. DutchMate does not sell user data or use translated text for advertising or tracking.
```

### Permission justifications

```text
storage: Stores extension settings, selected-word translation cache, saved vocabulary, learning progress, and review state locally in the browser.

website access: Allows DutchMate's content script to detect deliberate text selections and show translation results on webpages.
```

### Remote code

```text
No. The extension ships its executable JavaScript in the uploaded package. It does not load or execute remotely hosted code. Requests to the DutchMate translation backend transmit user-requested text and receive translation data; they are not remote code execution.
```

### Privacy policy URL

```text
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

## Notes for certification

Paste this into the Edge submission's certification notes field:

```text
This is a Manifest V3 update to the existing DutchMate Microsoft Edge add-on.

DutchMate helps users learn Dutch while reading normal webpages. Users deliberately select a word, phrase, or short sentence to request a translation. Hover translation is disabled in this build. The add-on sends the requested text, language settings, and translation context to:

https://dutchmate-backend.onrender.com/translate

The backend uses Google Cloud Translation. The add-on does not collect text in the background, sell user data, use translated text for advertising, or require an account, login, payment, or reviewer credentials.

DutchMate 0.5.1 automatically migrates existing local learning data when the add-on updates. A failed migration does not replace the previous record or mark the migration complete. The translation tooltip remains available while the user moves to Save.

To test:

1. Install DutchMate in Microsoft Edge.
2. Open a public Dutch webpage that contains no private information.
3. Select a short Dutch phrase and confirm the translation appears.
4. Select a single Dutch word and save it from the translation UI.
5. Open the add-on popup and check Today, Lessons, Daily Five, Verb Journeys, and Saved.
6. Open Options and check language, selection, privacy, cache, saved-vocabulary, and export controls.
7. If an earlier DutchMate version is installed, update it and confirm that local learning data remains available without user migration steps.

Translation requires network access to the DutchMate backend. Store-ready builds do not require users to enter an API key.
```

## Build and verification instructions

Run from the repository root with Node.js 22.x, Corepack, and pnpm 9.15.9:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build:chrome
node scripts/package-extension.mjs chrome
cp release/dutchmate-chrome-0.5.1.zip release/dutchmate-edge-0.5.1.zip
node scripts/verify-extension-release.mjs
```

The `cp` command only gives the verified Chromium package the Edge-specific
release filename. It does not alter the package contents. The resulting Edge
package must have `manifest.json` at its ZIP root and must report version
`0.5.1`.

For a full repository check, run:

```bash
corepack pnpm typecheck
corepack pnpm exec vitest run frontend/public-site.test.ts
corepack pnpm exec vite build frontend --outDir /tmp/dutchmate-edge-frontend
```

## Submission flow

1. Open the existing DutchMate product in Partner Center.
2. Check the currently published version before uploading.
3. If the current version is lower than `0.5.1`, upload
   `release/dutchmate-edge-0.5.1.zip` under **Packages**.
4. Review **Extension overview**, **Packages**, **Availability**, and
   **Properties**.
5. Complete **Privacy**, **Store listings**, and **Certification notes**.
6. Confirm the website, support contact, privacy policy, listing copy, logo,
   and screenshots.
7. Save the draft and submit it for certification.
8. If the current listing already reports `0.5.1`, stop before upload and
   prepare a higher-version package for the next Edge update.

Microsoft states that submitting an extension update begins a new review
process. Certification can take up to seven business days; monitor Partner
Center for reviewer questions or certification results.

## Submission checks

- Upload the Edge/Chromium extension ZIP, not a source archive.
- Confirm the uploaded package version is greater than the currently published
  Edge version.
- Confirm `manifest.json` is at the ZIP root.
- Confirm the package contains no development-only provider endpoint or API-key
  controls.
- Confirm the public privacy policy URL is reachable.
- Confirm the listing copy does not claim hover translation in 0.5.1.
- Retain the submitted package hash and screenshot filenames in the release
  evidence.
- Do not claim the update is live until Partner Center reports certification
  success and the public listing reflects the intended version.

## Official references

- [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)
- [Update a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/update/update-extension)
- [Use the REST API to update an extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/update/api/using-addons-api)
- [Microsoft Edge Add-ons developer policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)

## Final package hash

- Edge extension ZIP: `e679c86e47ee6d6be652966ae1eee43f233efbeca259a7716d7eba61f0608421`
