# MVP Release Checklist

Last updated: 2026-06-17

DutchMate is not ready for broad public launch yet, but it is close to a gentle MVP share with a Dutch-learner WhatsApp group.

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

### 2. WhatsApp Group MVP Share

Status: **Next**

Before sharing with WhatsApp group MVP users:

- finish privacy policy/store disclosure drafts;
- keep provider override controls hidden from the normal user path;
- Google Cloud cost dashboard and budget alerts verified on 2026-06-17;
- manual Firefox and Chrome regression checklist passed on 2026-06-17;
- prepare a short gentle sharing note.

For Chrome, a store listing is usually the cleanest way for non-technical users to install. For Firefox, Add-ons for Mozilla (AMO) can list the add-on or sign it for self-distribution. For Edge, Partner Center uses the same Chromium-style package flow.

Use [whatsapp-mvp-tester-instructions.md](whatsapp-mvp-tester-instructions.md) as the working gentle sharing guide.
Use [browser-release-playbook.md](browser-release-playbook.md) as the canonical browser-neutral release path.
Use [chrome-web-store-listing-draft.md](chrome-web-store-listing-draft.md) as the working Chrome Web Store listing draft.
Use [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md) before capturing Chrome listing screenshots and promotional images.
Use [store-disclosure-draft.md](store-disclosure-draft.md) as the working browser-store disclosure draft.
Use [store-package-preparation-checklist.md](store-package-preparation-checklist.md) before creating Chrome and Firefox upload artifacts.
Use [google-cloud-cost-monitoring-checklist.md](../operations/google-cloud-cost-monitoring-checklist.md) for Google Cloud budget alert and cost visibility evidence.
Use [manual-testing.md](manual-testing.md) for the latest Chrome and Firefox regression evidence.

### 3. Store Submission

Status: **After WhatsApp group MVP share checklist**

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
- Edge public installs also benefit from store review and signed publishing flow.

Do not submit to stores until:

- privacy policy draft is reviewed;
- provider override controls are hidden from store-ready builds;
- Google Cloud cost monitoring is checked;
- Chrome and Firefox packaged builds pass manual smoke tests;
- support/contact email is ready.

If you want the broadest public rollout with the least friction, prioritize Firefox and Edge first, then Chrome after the developer registration step is done.

## Sources

- Chrome Web Store publish docs: https://developer.chrome.com/docs/webstore/publish
- Firefox add-on submission docs: https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
