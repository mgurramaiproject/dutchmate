# Microsoft Edge Add-ons Publishing Guide: DutchMate

**Work code:** `008-edge-publish`
**Last reviewed:** 2026-08-05
**Status:** DutchMate 0.5.1 is approved and publicly available

**Published listing:** https://microsoftedge.microsoft.com/addons/detail/dutchmate/plobaccfjjbpfekjomnmmidlmjjdecme

This guide records the repository-specific and Microsoft-specific work needed to publish DutchMate on the Microsoft Edge Add-ons store. It is intended to be reused for the first Edge listing and future Edge updates.

Microsoft's current publication reference is [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension). Partner Center field names and policy wording can change, so recheck the live form before every submission.

## Decision for the first Edge release

DutchMate uses Manifest V3 and the Chromium extension architecture. For the first Edge submission, use the current Chrome Chromium package rather than creating a separate Edge implementation:

```text
release/dutchmate-chrome-0.5.1.zip
```

The repository does not currently have a separate `build:edge` or `package:edge` script. The old `release/dutchmate-edge-0.1.0.zip` is not the current release and must not be uploaded.

The source-of-truth release instructions are in [browser-release-playbook.md](browser-release-playbook.md). That playbook defines the release order as Firefox first, Edge second, and Chrome last.

## Current repository readiness

### Already available

- Manifest V3 Chromium build.
- Package version `0.5.1`.
- Current Chromium artifact at `release/dutchmate-chrome-0.5.1.zip`.
- Public privacy policy at `https://dutchmate-frontend.onrender.com/privacy-policy.html`.
- Support email: `dutchmate.project@gmail.com`.
- Existing listing copy in [chrome-web-store-listing-draft.md](chrome-web-store-listing-draft.md).
- Submission packet in [edge-addon-0.5.1-submission.md](edge-addon-0.5.1-submission.md).
- Existing privacy and disclosure material in [store-disclosure-draft.md](store-disclosure-draft.md) and [privacy-policy.md](privacy-policy.md).
- GitHub release procedure in [github-release-pipeline.md](github-release-pipeline.md).

### Completed for 0.5.1

- A manual smoke test in Microsoft Edge.
- Edge-specific store copy, without Chrome or Firefox references.
- A square store logo and up to six screenshots in Edge's accepted dimensions.
- A GitHub release record with the final package attached.
- Microsoft Partner Center registration and, where applicable, company verification.
- Final manual submission and certification follow-up.

## Build and package verification

Run these commands from the repository root:

```bash
cd /home/mgurram/MGurramAI/projects/dutchmate-proj/dutchmate
corepack pnpm verify:release
```

This regenerates and verifies the Chrome and Firefox release packages. Confirm that the Edge upload candidate is the Chromium package:

```bash
unzip -p release/dutchmate-chrome-0.5.1.zip manifest.json
unzip -l release/dutchmate-chrome-0.5.1.zip
```

The ZIP must contain `manifest.json` at its root. Upload the ZIP itself, not the `dist/chrome` directory and not the source repository.

The 0.5.1 manifest contains:

```text
manifest_version: 3
name: DutchMate
version: 0.5.1
permissions: storage, downloads
host_permissions: https://*/* plus localhost development hosts
background: assets/background.js as a service worker
```

The broad website access must be explained accurately in Partner Center: DutchMate needs webpage access to translate text that the user deliberately selects. Do not reduce or expand permissions during submission without auditing the extension behavior and regenerating the package.

## Manual Microsoft Edge test

Build the unpacked Chromium target:

```bash
corepack pnpm build:chrome
```

Open `edge://extensions`, enable **Developer mode**, choose **Load unpacked**, and select:

```text
dist/chrome
```

Test at least the following:

- Selected-word, selected-phrase, and selected-sentence translation.
- English and Telugu translation directions.
- Saving a selected single-word translation.
- Popup Today, Lessons, Saved, Daily Five, and review flows.
- Context Missions where included in the 0.5.1 release.
- Options settings and language changes.
- Local learning data after closing and reopening Edge.
- Learning-record export through the download action.
- Translation behavior after the extension is reloaded.
- Backend failure or network-disabled behavior.
- Toolbar icon, popup, Options page, and service-worker startup.
- A fresh installation and an update over an earlier DutchMate installation, if an earlier Edge build exists.

Record the result in the browser release evidence before submission. The existing [manual-testing.md](manual-testing.md) is the starting point for the cross-browser smoke-test record.

## Microsoft developer account

Register through Microsoft Edge Add-ons / Partner Center with the Microsoft account that should own the listing:

- [Register as a Microsoft Edge extension developer](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account)
- [Verify your company account information](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/verify-microsoft-edge-program)

An individual account is appropriate when publishing personally. A company account is appropriate when the listing should represent a legal organization. Company verification can take several business days, so start it before the package is ready for certification.

Microsoft's registration guidance currently says there is no registration fee for an Edge extension developer account. This is separate from any fees or requirements imposed by other browser stores.

## Store assets

Prepare the following assets before opening the final submission form:

| Asset | Requirement | DutchMate action |
| --- | --- | --- |
| Store logo | Square image; Microsoft recommends 300x300 and accepts at least 128x128 | Prepare or confirm a polished square DutchMate logo |
| Screenshots | Up to six; use 640x480 or 1280x800 | Capture wide Edge screenshots showing the real extension workflow |
| Small promotional tile | Optional, 440x280 | [public/brand/png/dutchmate-promo-440x280.png](../../public/brand/png/dutchmate-promo-440x280.png) |
| Large promotional tile | Optional, 1400x560 PNG | [public/brand/png/dutchmate-promo-1400x560.png](../../public/brand/png/dutchmate-promo-1400x560.png) |

The existing 007 showcase images are portrait UI captures and are not suitable as-is for the Edge store screenshot slots. Do not stretch them. Capture or compose wide images with readable browser context, translation results, and learning actions.

Suggested six screenshots:

1. Selecting a Dutch word and seeing the translation tooltip.
2. Selecting a short phrase and seeing Dutch, English, and Telugu context.
3. Saving a word to local vocabulary.
4. Popup Today or Daily Five progress.
5. Lessons or review flow.
6. Saved vocabulary and Options controls.

Microsoft's current upload, screenshot, and listing requirements are documented in [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).

## Edge store listing

Create Edge-specific copy from the existing drafts. Do not paste Chrome-specific or Firefox-specific labels into the Edge listing. Microsoft requires accurate listing metadata and policies discourage references to other browsers in Edge listing content.

The current Edge form may require a description between 250 and 10,000 characters, a short description in at least one language, a logo for each published language, and no more than six screenshots. Recheck these limits in Partner Center when submitting.

### Suggested short description

```text
Learn Dutch while reading with selected-text translations in English and Telugu.
```

### Suggested full description

```text
DutchMate helps you learn Dutch while reading online.

Select a Dutch word, phrase, or sentence to see translations in Dutch, English, and Telugu. Keep English as a bridge language, bring your own language close to the page, and build vocabulary from the text you already read.

Save useful single-word translations locally, practise with Daily Five and lessons, and review your learning progress from the extension popup. DutchMate does not require an account, subscription, or payment.

Privacy note: DutchMate sends the text you ask it to translate to the DutchMate backend, which uses Google Cloud Translation to return the result. Saved vocabulary and learning progress remain in local browser storage. Avoid using DutchMate on private pages if you do not want that text sent for translation.
```

### Suggested single-purpose statement

```text
DutchMate helps users learn Dutch online by translating webpage text that users deliberately select between Dutch, English, and Telugu.
```

### Suggested search terms

Use no more than seven terms, no more than 21 words in total, and keep each term within the live Partner Center character limit:

```text
learn Dutch
Dutch translation
English Telugu
language learning
vocabulary
reading practice
```

Choose the most accurate category offered by the current Partner Center form. The existing Chrome draft uses `Productivity`, but the final Edge category should follow Microsoft's current taxonomy and the actual product purpose.

Recommended listing values:

```text
Language: English
Support email: dutchmate.project@gmail.com
Privacy policy: https://dutchmate-frontend.onrender.com/privacy-policy.html
Website: https://dutchmate-frontend.onrender.com/
```

## Privacy and data disclosure

The privacy policy is available at [frontend/privacy-policy.html](../../frontend/privacy-policy.html). It explains that DutchMate sends user-requested website text to the backend for translation, uses Google Cloud Translation behind that backend, and keeps learning records and saved vocabulary in local browser storage.

Answer the Partner Center privacy questions from the actual packaged behavior:

### Does the extension transmit user data?

```text
Yes. DutchMate sends text that the user selects, together with language settings and translation context, to the DutchMate backend so it can return a translation.
```

### Data types to disclose

- Website content: selected words, nearby sentence context, selected phrases, or short sentences.
- User interaction context: the selected-text translation action.
- User settings and local learning data: language settings, cache preferences, saved vocabulary, learning items, mastery, lesson progress, and rhythm stored locally in the browser.

Do not claim that DutchMate collects personally identifiable information, financial information, health information, authentication information, or payment information unless the product behavior changes.

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

downloads: Lets the user export their local learning record as a file when they choose the export action.

website access: Allows DutchMate's content script to detect deliberate text selections and show translation results on webpages.
```

### Remote code

Select **No** for remote code if the uploaded package contains all executable JavaScript locally and does not use runtime `eval`, `new Function`, injected remote scripts, or remotely hosted extension code. Network requests to the translation backend are data requests, not remote code, but the final package should still be checked before selecting the answer.

### Single purpose

Keep the listing, privacy policy, permissions, and certification notes aligned around one purpose: translating deliberately selected webpage text to help the user learn Dutch.

## Certification notes

Paste concise reviewer instructions similar to the following:

```text
DutchMate is a Manifest V3 extension for learning Dutch while reading online. No account, login, payment, or reviewer credentials are required.

To test:
1. Install DutchMate.
2. Open a normal Dutch webpage.
3. Select a Dutch word.
4. Select a short Dutch phrase or sentence.
5. Select a single Dutch word and save it from the translation UI.
6. Open the extension popup and Options page.
7. Confirm that language settings, local vocabulary, and learning progress work.

Translation requires network access to the DutchMate backend. Store-ready builds do not require users to enter an API key.
```

If the reviewer needs a test page, provide a stable public Dutch-language page that does not require login. Do not provide private credentials.

## Partner Center submission flow

The current Microsoft flow is:

1. Sign in to Microsoft Partner Center.
2. Register as an Edge extension developer if necessary.
3. Open the existing public DutchMate listing for an update.
4. For a future update, upload the newer Chromium package under Packages.
5. Continue through Extension overview, Packages, Availability, Properties, Privacy, Store listings, and Certification notes.
6. Select the desired markets and choose Public visibility for a normal public launch, or Hidden for a controlled test.
7. Add the logo, screenshots, description, support details, privacy URL, permissions, and data disclosures.
8. Submit for certification.
9. Monitor Partner Center for reviewer questions or certification failures.

Microsoft's official publication guide is the authority for the live form: [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).
Certification can take up to seven business days according to Microsoft's current publication guidance.

## Release evidence and follow-up

Before submitting:

- Run `corepack pnpm verify:release`.
- Confirm the uploaded ZIP has the intended newer version.
- Confirm `manifest.json` is at the ZIP root.
- Complete and retain the Microsoft Edge manual smoke-test evidence.
- Confirm the privacy policy URL is publicly reachable.
- Create the GitHub release and attach the final Chromium ZIP using [github-release-pipeline.md](github-release-pipeline.md).
- Keep the exact store copy and submitted asset filenames in the release notes or release evidence.

After certification:

- Record the public Edge Add-ons URL.
- Add the Edge URL to the project release notes and website links.
- Record the approved store version and publication date.
- Use the Edge listing's update flow for later releases; upload a package with a newer version than the currently published version.
- Retest Edge after each meaningful extension or manifest change.

## Official references

- [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)
- [Register as a Microsoft Edge extension developer](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account)
- [Verify your company account information](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/verify-microsoft-edge-program)
- [Microsoft Edge Add-ons developer policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)
- [Microsoft Edge extensions overview](https://learn.microsoft.com/en-us/microsoft-edge/extensions/)
