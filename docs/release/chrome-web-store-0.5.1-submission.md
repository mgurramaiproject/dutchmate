# Chrome Web Store Submission: DutchMate 0.5.1

Last updated: 2026-08-05

Use this document for the Chrome Web Store submission of DutchMate 0.5.1.

## Dashboard

Chrome Web Store Developer Dashboard:

https://chrome.google.com/webstore/devconsole

If DutchMate already has a Chrome Web Store item, open that item for an
update. Otherwise choose **Add new item**.

## Upload artifact

Upload this file as the Chrome extension package:

`release/dutchmate-chrome-0.5.1.zip`

Do not upload the Firefox package, Edge package, or Firefox source package.

Local upload SHA-256:

`e679c86e47ee6d6be652966ae1eee43f233efbeca259a7716d7eba61f0608421`

GitHub release:

https://github.com/mgurramaiproject/dutchmate/releases/tag/v0.5.1

GitHub Chrome asset SHA-256:

`9df2aefcc08c91091f0e8a6e732c41a701ea99eb53592a53eb8d139af82b2971`

The local and GitHub hashes differ because the local upload ZIP and the
GitHub Actions ZIP have different ZIP timestamps. Use the local hash when
uploading the local file; use the GitHub hash when downloading the published
release asset.

## Package facts

- Name: `DutchMate`
- Version: `0.5.1`
- Manifest version: 3
- Manifest description: `Learn Dutch while reading, with quick English and Telugu translations in context.`
- Permissions: `storage`, `downloads`
- Backend host permission: `https://dutchmate-backend.onrender.com/*`
- Content-script matches: normal `http://*/*` and `https://*/*` webpages
- Hover translation: disabled
- Selected-text translation: available
- No account, subscription, payment, or reviewer credentials required

## Store Listing

### Basic details

Name:

```text
DutchMate
```

Short description:

```text
Learn Dutch from webpages with selected-text translation, grammar practice, verb conjugations, and sentence exercises.
```

Category:

```text
Productivity
```

Language:

```text
English
```

Homepage:

```text
https://dutchmate-frontend.onrender.com/
```

Support URL:

```text
https://dutchmate-frontend.onrender.com/feedback.html
```

Support email:

```text
dutchmate.project@gmail.com
```

Privacy policy:

```text
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

### Full description

```text
DutchMate is a focused browser extension for learning Dutch while reading online in three languages.

It helps you use Dutch, English, and your mother tongue together on normal webpages. The current release supports Dutch, English, and Telugu.

Select a word, short phrase, or sentence to see a translation in context without switching tabs. Use English as a bridge language and keep Telugu close when you need it.

- Translate selected Dutch, English, or Telugu text on any webpage
- Practise Dutch grammar and verb conjugations with English comparisons
- Build a personal Dutch vocabulary list from real websites
- Practise sentences that turn new words into usable vocabulary
- Review saved words with Daily Five, short lessons, and flashcards
- Keep settings, saved vocabulary, and learning progress local in your browser
- No account, subscription, or payment required

DutchMate sends only the text you choose to translate to the DutchMate backend, which uses Google Cloud Translation. Hover translation is currently disabled; selected-text translation remains available. Avoid using DutchMate on private pages if you do not want that text sent for translation.
```

## Privacy

### Single purpose

```text
DutchMate helps users learn Dutch online by translating user-selected webpage text between Dutch, English, and supported native languages.
```

### Does DutchMate collect or transmit user data?

```text
Yes.
```

### Data handled

Disclose these categories:

- **Website content:** selected words, phrases, sentences, and limited translation context sent for translation.
- **User activity:** the translation action and selection context.
- **Local settings and learning data:** settings, selected-word cache entries, saved vocabulary, lesson progress, Daily Five progress, and Verb Journey progress stored in browser storage.

Do not select personal, financial, health, authentication, or payment data.

### Purpose of data use

```text
App functionality. DutchMate uses this data only to provide translations and local learning features, maintain reliability, prevent abuse, and control translation-provider cost.
```

### Data sharing

```text
DutchMate sends requested translation text to its backend, which uses Google Cloud Translation. DutchMate does not sell user data, use it for advertising, or share it for unrelated purposes. Learning data remains local to the browser and is not synced to an account.
```

### Limited Use statement

```text
DutchMate uses user data only to provide or improve its single purpose: helping users learn Dutch through user-requested webpage translation and local practice. Data is not sold or used for advertising.
```

### Remote code

```text
No. The extension ships its JavaScript in the package. Requests to the HTTPS translation backend return translation data and do not download or execute extension code.
```

## Permission justifications

```text
storage: Stores settings, translation-cache entries, saved vocabulary, and local learning data.

downloads: Exports a user-requested local learning backup to a file.

Website access: DutchMate must read deliberately selected text on normal webpages so it can translate that text without requiring the user to open the extension first.

Backend host access: Sends requested translation text to https://dutchmate-backend.onrender.com/translate.
```

Chrome may show a broad-host-permissions warning because the content script
supports selected text on normal HTTP and HTTPS pages. This is expected. The
package grants backend host access only to `dutchmate-backend.onrender.com`.

If Chrome asks for more detail, use:

```text
DutchMate translates text on webpages when the user selects it. Access to normal HTTP and HTTPS pages is required because selection translation happens directly on the webpage without requiring the user to open the extension button first. DutchMate reads only the selected text and limited context needed for the requested translation; it does not scan or transmit unrelated page content.
```

## Reviewer notes and test instructions

```text
This is a Manifest V3 update to DutchMate, an extension for learning Dutch while reading normal webpages.

DutchMate translates user-selected words, phrases, and sentences through:

https://dutchmate-backend.onrender.com/translate

The backend uses Google Cloud Translation. Hover translation is disabled in this release. The add-on does not collect text in the background, sell user data, use translated text for advertising, or require an account, login, payment, or reviewer credentials.

Existing settings, saved vocabulary, lesson progress, Daily Five progress, and Verb Journey progress remain in local browser storage. On extension install or update, DutchMate automatically completes its local storage migration before learning messages are handled. A failed migration does not replace the previous record or mark the migration complete.

To test:

1. Install the submitted extension.
2. Open a public webpage containing Dutch text.
3. Select a short Dutch word, phrase, or sentence.
4. Confirm the translation tooltip appears.
5. Select a single word and click Save.
6. Open the popup and check Today, Lessons, and Saved.
7. Open Options and check language, behavior, privacy, and saved-vocabulary controls.
8. Reload the extension and repeat a selection translation.
```

## Images

Upload:

- `assets/store/chrome/icon/icon-128.png`
- `assets/store/chrome/promo/small-promo-440x280.png`

The existing screenshot at
`assets/store/chrome/screenshots/01-hover-translation-1280x800.png` shows a
hover interaction and is not aligned with the 0.5.1 behavior. Recapture a
real selected-text translation screenshot before submitting. Do not upload a
screenshot that claims or depicts an unavailable hover feature.

Chrome requires accurate listing metadata and screenshots. See the official
[listing guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
and [image guidance](https://developer.chrome.com/docs/webstore/images).

## Distribution

- Visibility: `Public`
- Regions: `All regions`
- Paid item: `No`
- In-app purchases: `No`

## Submission checklist

- Upload `release/dutchmate-chrome-0.5.1.zip`.
- Confirm the Package tab reports version `0.5.1` and name `DutchMate`.
- Confirm the manifest contains only `storage` and `downloads` permissions.
- Complete Store Listing, Privacy, Distribution, and Test instructions.
- Upload the icon, promotional image, and a current selected-text screenshot.
- Save the draft.
- Submit for review with **Defer publishing** selected.
- After approval, inspect the staged listing and publish it manually.

Chrome's official publishing guide documents the upload, listing, privacy,
distribution, test-instruction, submission, and deferred-publishing flow:

https://developer.chrome.com/docs/webstore/publish/

Chrome privacy and Limited Use guidance:

https://developer.chrome.com/docs/webstore/program-policies/user-data

https://developer.chrome.com/docs/webstore/program-policies/limited-use
