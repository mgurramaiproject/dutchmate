# DutchMate Chrome Web Store Publish Guide

Last updated: 2026-07-26

This is the first-public-release guide for publishing DutchMate on the Chrome
Web Store. It covers the repository work and the manual steps in the Chrome
Developer Dashboard. The final upload and submit actions must be performed by
the account owner.

## Current status

- The Chrome Web Store developer account has been created and the one-time registration fee has been paid.
- DutchMate has a store-ready Chromium build path: `corepack pnpm package:chrome`.
- The current package name is `release/dutchmate-chrome-0.4.0.zip`.
- The Chrome listing copy, privacy answers, screenshots plan, and public privacy policy already exist in this repository.
- This guide does not publish the extension or change the developer account.

## Read these existing files first

| Need | File |
| --- | --- |
| Browser-neutral release order and artifact names | [browser-release-playbook.md](browser-release-playbook.md) |
| Store listing copy and reviewer notes | [chrome-web-store-listing-draft.md](chrome-web-store-listing-draft.md) |
| Chrome privacy, data-use, and limited-use answers | [store-disclosure-draft.md](store-disclosure-draft.md) |
| Screenshot requirements and capture rules | [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md) |
| Manual Chrome smoke test | [manual-testing.md](manual-testing.md) |
| Release-specific changes and verification | [v0.4.0.md](notes/v0.4.0.md) |

## Important pre-submit gate

Before submitting, re-check the current Chrome data-disclosure policy against
the actual extension UI. Chrome announced in July 2026 that all extension data
collection must be prominently disclosed, including collection related to the
extension's single purpose. See the [2026 policy update](https://developer.chrome.com/blog/cws-policy-updates-2026).

DutchMate's current Options page explains local storage and translation
behavior, but the current code does not show a first-use disclosure and
acknowledgment before sending webpage text for translation. Treat this as a
review risk and resolve or confirm it before clicking **Submit for Review**.
This guide does not claim that the existing Options copy alone satisfies the
new requirement.

## 1. Build and verify the Chrome upload package

Run these commands from the repository root:

```bash
corepack pnpm package:chrome
node scripts/verify-extension-build.mjs chrome release/dutchmate-chrome-0.4.0.zip
```

The package must contain `manifest.json` at the ZIP root. Do not upload
`dist/chrome` as a folder, a source archive, or a ZIP containing an extra
parent directory. Chrome's preparation guide also requires the manifest to be
at the root and says that a new uploaded version must have a larger version
number than the previous one: [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare).

Optional inspection:

```bash
unzip -l release/dutchmate-chrome-0.4.0.zip
unzip -p release/dutchmate-chrome-0.4.0.zip manifest.json
```

If the uploaded manifest has a wrong name, version, description, or icon,
correct the source, increase the version, rebuild, and upload a new ZIP. The
manifest metadata cannot be edited in the dashboard after upload.

## 2. Complete the manual Chrome smoke test

Use the store-ready build, not a local-testing build:

```bash
corepack pnpm build:chrome
```

Then:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select `dist/chrome`.
4. Open a normal public webpage with Dutch text.
5. Test a hovered word.
6. Disable **Hovered text → Translate** in Options and test a selected word or phrase.
7. Select a single word, wait for the translation, and click **Save**.
8. Open **Details → Extension options** and verify language, behavior, cache, saved vocabulary, export, and clear controls.
9. Reload the extension and repeat one hover and one selection test.

Expected results:

- Hover and selection translation work independently.
- The selection popup remains available long enough to click **Save**.
- No `Cannot read properties of undefined (reading 'get')` error appears.
- The service worker starts after reload and no persistent error appears in its inspection console.
- Store-ready Options do not expose provider endpoint or provider API-key controls.
- Translation requests use `https://dutchmate-backend.onrender.com/translate`.

Record the browser version, commit, and result in [manual-testing.md](manual-testing.md).

## 3. Prepare the listing inputs

### Manifest/package values

Confirm these values on the Package tab after upload:

```text
Name: DutchMate
Version: 0.4.0
Manifest description: Learn Dutch while reading, with quick English and Telugu translations in context.
```

The manifest description is limited to 132 characters. Do not change it only
in the dashboard; change the generated manifest source and repackage instead.

### Store Listing tab

Use [chrome-web-store-listing-draft.md](chrome-web-store-listing-draft.md) as
the source for the long description and reviewer notes.

Recommended values:

```text
Category: Productivity
Language: English
Homepage URL: https://dutchmate-frontend.onrender.com/
Support URL: https://dutchmate-frontend.onrender.com/feedback.html
Privacy policy URL: https://dutchmate-frontend.onrender.com/privacy-policy.html
```

Use the long description from the draft verbatim unless the dashboard shows a
current character limit that requires a small edit. Keep the opening sentence
clear and factual. Do not add keyword lists, unsupported claims, testimonials,
or claims that DutchMate works offline or stores no data.

### Images

The repository currently contains:

```text
assets/store/chrome/icon/icon-128.png
assets/store/chrome/promo/small-promo-440x280.png
assets/store/chrome/screenshots/01-hover-translation-1280x800.png
```

Upload the icon, small promotional tile, and at least the real-product
screenshot. The [Chrome image guide](https://developer.chrome.com/docs/webstore/images)
and [listing guide](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
describe the current image fields. The repo screenshot plan recommends up to
five screenshots; additional screenshots are useful but do not delay the
first submission if the minimum set is valid. Manually recapture the existing
automated screenshot if its browser chrome or content is not clean enough for
the public listing.

### Privacy tab

Use [store-disclosure-draft.md](store-disclosure-draft.md) and verify every
answer against the uploaded build. The important answers are:

- **Single purpose:** DutchMate helps users learn Dutch online by translating user-hovered or user-selected webpage text between Dutch, English, and a supported mother tongue.
- **Data handled:** website content and user activity related to translation, plus local settings and learning data.
- **Remote code:** No. The extension ships its JavaScript in the package; calling the HTTPS translation backend is not remote code execution.
- **Privacy policy:** `https://dutchmate-frontend.onrender.com/privacy-policy.html`
- **Limited use:** data is used only to provide or improve translation, reliability, abuse prevention, and provider-cost control; it is not sold or used for advertising.

Permission justifications:

| Permission | Justification |
| --- | --- |
| `storage` | Stores settings, translation-cache entries, saved vocabulary, and local learning data in browser storage. |
| `downloads` | Exports a user-requested local learning backup to a file. |
| `https://*/*` / webpage access | Runs the user-facing hover and selection translation feature on normal HTTPS webpages and sends the text the user asks to translate to the DutchMate backend. |

The localhost permissions are development support from the generated manifest;
do not claim that the store build uses a local backend for normal users.

### Distribution tab

For the public launch, choose:

```text
Visibility: Public
Regions: All regions
Paid item: No
In-app purchases: No
```

Chrome's distribution documentation distinguishes **Public**, **Unlisted**,
and **Private** visibility. Public is the correct choice for WhatsApp sharing;
unlisted is only appropriate for a controlled link-only test: [Distribution settings](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution).

### Test instructions tab

Test instructions are not required because DutchMate has no login or paid
account. If the dashboard allows a note, paste the reviewer steps from the
[listing draft](chrome-web-store-listing-draft.md) so the reviewer can quickly
test hover, selection, Save, Options, and the public translation endpoint.

## 4. Upload in the Chrome Developer Dashboard

1. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) while signed into the developer account that paid the registration fee.
2. Click **Add new item**.
3. Choose `release/dutchmate-chrome-0.4.0.zip`.
4. Upload it.
5. On the Package tab, verify the version, name, description, icons, and permissions before filling the other tabs.
6. Complete **Store Listing**, **Privacy**, and **Distribution**.
7. Save the draft.

Chrome's first-publication flow uses those tabs before submission: [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish).

## 5. Submit with a controlled launch

After the pre-submit gate and manual smoke test are complete:

1. Click **Submit for Review**.
2. Choose **Defer publishing** so approval does not immediately make the listing public while you are still checking the final page.
3. Confirm the submission.
4. Watch the dashboard status and the developer-account email.
5. After approval, open the staged listing, inspect the public copy and images, then click **Publish**.

Chrome says a deferred approved submission can be published for up to 30 days
before it returns to draft: [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish).

Review is usually completed within a few days but can take a few weeks. Chrome
currently warns that submission volume is causing extended review times; a
submission pending for more than three weeks should be raised with developer
support: [Chrome Web Store review process](https://developer.chrome.com/docs/webstore/review-process).

## 6. After publication

1. Copy the public Chrome Web Store URL from the listing.
2. Test install from a clean Chrome profile.
3. Test hover, selection, Save, Options, and reload behavior again from the store-installed package.
4. Add the Chrome install link to the website alongside Firefox.
5. Share a short WhatsApp message with both store links; do not share a ZIP or unpacked folder.
6. Record the Chrome store URL, publication date, version, browser version, and manual result in the release notes and [manual-testing.md](manual-testing.md).

Suggested WhatsApp message:

```text
DutchMate is now available for Chrome as well as Firefox.

It lets you hover over Dutch words or select short text on a webpage to see translations with English and Telugu support, then save useful words locally for practice.

Chrome: <store link>
Firefox: https://addons.mozilla.org/en-US/firefox/addon/dutchmate/

If you try it, I would appreciate reports of anything confusing or broken.
```

## If Chrome rejects the submission

Do not repeatedly upload random ZIPs. Save the rejection email and dashboard
policy reason, map it to the relevant source code or listing field, make the
smallest corrective change, increase the extension version, regenerate the
Chrome package, and submit again. Chrome's review documentation says rejected
submissions leave the currently published listing unchanged and explain the
policy reason to the publisher: [Review outcomes](https://developer.chrome.com/docs/webstore/review-process).

## Sources

- [Chrome Web Store overview](https://developer.chrome.com/docs/webstore)
- [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare)
- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Complete your listing information](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Distribution settings](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution)
- [Supplying images](https://developer.chrome.com/docs/webstore/images)
- [Chrome Web Store review process](https://developer.chrome.com/docs/webstore/review-process)
- [Chrome Web Store program policies](https://developer.chrome.com/docs/webstore/program-policies/policies)
- [2026 Chrome Web Store policy update](https://developer.chrome.com/blog/cws-policy-updates-2026)
