# Firefox Add-on 0.5.0 Submission

Last updated: 2026-08-05

Use this document for the AMO version submission of DutchMate 0.5.0.

Existing listing:

https://addons.mozilla.org/en-US/firefox/addon/dutchmate/

Developer editor:

https://addons.mozilla.org/en-US/developers/addon/dutchmate/edit

## Upload artifact

Upload this file as the new add-on version:

`release/dutchmate-firefox-0.5.0.zip`

SHA-256:

`4e000ff9a211cc9ab6dcae4240b9cf529431c02bf724eb38e11a81d8b22c271b`

GitHub download:

https://github.com/mgurramaiproject/dutchmate/releases/download/v0.5.0/dutchmate-firefox-0.5.0.zip

The existing GitHub v0.5.0 asset predates this correction. Upload the local
artifact above until the GitHub release asset is deliberately refreshed or a
new patch release is published.

Do not upload the source package as the add-on version. AMO requests it in a
separate source-code field when source submission is required.

## Describe Version

### Release Notes

```text
DutchMate 0.5.0 adds a focused practice loop for learning Dutch while reading online.

- Practise Dutch grammar with short exercises.
- Follow verb conjugations with English comparisons, including werken, zijn, hebben, and gaan.
- Build sentences with exercises that turn new words into usable vocabulary.
- Use Lessons and Daily Five to review saved vocabulary locally.
- Keep saved words and learning progress in your browser. No account or subscription.
```

### Notes to Reviewer

```text
This is a Manifest V3 update to the existing DutchMate Firefox add-on.

DutchMate helps users learn Dutch while reading normal webpages. Users can deliberately select short text to request a translation. Hover translation is disabled in this build. The add-on sends the requested text, language settings, and translation context to:

https://dutchmate-backend.onrender.com/translate

The backend uses Google Cloud Translation. The add-on does not collect text in the background, sell user data, use translated text for advertising, or require an account, login, payment, or reviewer credentials.

Settings, selected-word translation cache, saved vocabulary, lesson progress, Daily Five progress, and Verb Journey progress remain in local browser storage. Users can disable translation and clear local data from Options.

On extension install or update, DutchMate automatically completes its local
storage migration before learning messages are handled. A failed migration does
not replace the previous record or mark the migration complete.

To test the add-on:

1. Install the submitted add-on in Firefox.
2. Open a public Dutch webpage that contains no private information.
3. Select a short Dutch phrase.
4. Confirm that the translation tooltip remains visible while the selection is active.
5. Open the add-on popup and check Today, Lessons, and Saved.
6. Open Options and check language, behavior, privacy, and saved-vocabulary controls.

The submitted build was created with Node.js 22.x, Corepack, and pnpm 9.15.9. The source package includes the exact build inputs and instructions. From the source-package root, run:

1. ./build-firefox.sh

That script runs `corepack pnpm install --frozen-lockfile`, `corepack pnpm build:firefox`, and `node scripts/package-extension.mjs firefox`. It creates the matching Firefox artifact at `release/dutchmate-firefox-0.5.0.zip` inside the source package.
```

## Source package

If AMO asks whether source code is required, select **Yes** and upload:

`release/dutchmate-firefox-source-0.5.0.zip`

SHA-256:

`88872d2d19de79a3f128f78618413b5f4763fc78f4ccaaab726b905f4fc66372`

The source package was clean-room built successfully. Its build instructions
are also included in `README.md` and `build-firefox.sh` inside the archive.

## Listing details

Name:

`DutchMate`

Summary:

```text
Read Dutch online, translate in context, save useful words, and practise grammar, verb conjugations, and sentences with English and Telugu support.
```

Privacy policy:

https://dutchmate-frontend.onrender.com/privacy-policy.html

Support email:

`dutchmate.project@gmail.com`

Homepage:

https://dutchmate-frontend.onrender.com/

## Submission checks

- Upload the extension ZIP, not the source ZIP, as the new version.
- Confirm AMO reports version `0.5.0`.
- Provide the source ZIP if AMO requests source code.
- Keep the existing add-on URL: `/addon/dutchmate/`.
- Keep the add-on marked as non-experimental; Context Missions are an optional experimental learning feature, not the status of the whole add-on.
- Review the generated permissions and privacy disclosures before submitting.
- Submit for review and wait for the AMO validation/review result before claiming that the Firefox listing has been updated.

## Package facts

- Manifest version: 3
- Firefox minimum version: 140.0
- Firefox Android minimum version: 142.0
- Hover translation: disabled; selected-text translation remains available
- Permissions: `storage`, `downloads`
- Backend host permission: `https://dutchmate-backend.onrender.com/*`
- Firefox data declaration: required `websiteContent`
- No account, subscription, payment, or reviewer credentials required
