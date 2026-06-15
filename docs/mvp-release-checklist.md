# MVP Release Checklist

Last updated: 2026-06-16

DutchMate is not ready for broad public launch yet, but it is close to a small MVP user test.

## Current Verified Core

- Firefox full translation path works.
- Chrome full translation path works.
- Render backend is live at `https://dutchmate-backend.onrender.com`.
- Google Cloud Translation is active behind the backend.
- Browser extensions use the Render endpoint by default.
- Local selected-word cache works.
- No user account is required.

## Recommended Sharing Sequence

### 1. Internal Testing

Status: **Current stage**

Use temporary or unpacked extension installs:

- Firefox: load `dist/firefox/manifest.json` through `about:debugging`.
- Chrome: load `dist/chrome` through `chrome://extensions`.

Use this for the project owner and a very small trusted group.

### 2. Private MVP Testing

Status: **Next**

Before inviting external MVP users:

- finish privacy policy/store disclosure draft;
- keep provider override controls hidden from the normal user path;
- verify Google Cloud cost dashboard and budget alerts;
- run the manual Firefox and Chrome regression checklist;
- prepare a short tester instruction page.

For Chrome, a store listing is usually the cleanest way for non-technical users to install. For Firefox, Add-ons for Mozilla (AMO) can list the add-on or sign it for self-distribution.

### 3. Store Submission

Status: **After private MVP checklist**

Chrome Web Store publishing requires:

- Chrome Developer Dashboard account;
- zipped extension package;
- store listing;
- privacy fields;
- distribution settings;
- test instructions if needed;
- review submission.

Firefox AMO publishing requires:

- Mozilla account / Add-ons Developer Hub access;
- packaged extension;
- listing or self-distribution choice;
- privacy policy if data is transmitted from the user device;
- reviewer notes if needed.

## Store Decision

For real MVP users, yes, publishing/signing through browser stores is the recommended path.

Reasons:

- Users avoid manual developer-mode install steps.
- Updates can be managed through the browser store.
- Store review forces us to clarify privacy and permissions.
- Firefox production installs generally need signed add-ons.

Do not submit to stores until:

- privacy policy draft is reviewed;
- provider override controls are hidden behind Advanced local testing;
- Google Cloud cost monitoring is checked;
- Chrome and Firefox packaged builds pass manual smoke tests;
- support/contact email is ready.

## Sources

- Chrome Web Store publish docs: https://developer.chrome.com/docs/webstore/publish
- Firefox add-on submission docs: https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
