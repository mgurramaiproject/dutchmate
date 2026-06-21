# Browser Release Playbook

Last updated: 2026-06-19

This is the canonical, browser-neutral release path for DutchMate.

## Safe Setup Rules

Keep these rules true for every public browser release:

- keep secrets and private operations notes out of the public source repo;
- publish only packaged extension files;
- keep API keys and secrets on the backend, not inside the extension;
- let the extension call your backend proxy, and let the backend call the translation provider;
- share store links, not unpacked folders or source archives, with the public WhatsApp group.

## Recommended Release Order

1. Firefox first.
2. Edge second.
3. Chrome last.

That order gives us the cheapest public rollout first, while Chrome stays the final step because it requires the extra developer registration payment.

## What I Can Do

- prepare the extension packages;
- keep the store copy and privacy copy in the repo;
- help you fill in each store form;
- help you answer reviewer questions;
- help you keep secrets out of the shipped build.

## What You Need To Do

You need to do the account and payment steps yourself:

- sign in to Mozilla, Microsoft, and Google with the publishing account you want to use;
- complete any account registration steps each store asks for;
- pay the Chrome Web Store registration fee when you are ready to publish there;
- click the final submit buttons in the store dashboards.

## File Set To Use

- Firefox package: `release/dutchmate-firefox-0.1.1.zip`
- Chromium package for Chrome: `release/dutchmate-chrome-0.1.1.zip`
- Chromium package for Edge: `release/dutchmate-edge-0.1.1.zip` when present, or the Chrome package if you are uploading the same build to Edge
- Privacy policy: `https://dutchmate-frontend.onrender.com/privacy-policy.html`
- Chrome listing draft: `docs/release/chrome-web-store-listing-draft.md`
- Shared disclosure draft: `docs/release/store-disclosure-draft.md`

## Firefox

Use Firefox Add-ons / AMO for the first public release if you want a low-friction rollout.

### Your action

1. Sign in to your Mozilla account.
2. Open the Firefox Add-ons developer page.
3. For the first submission, create a new add-on listing. For updates, open the existing DutchMate add-on page.
4. Upload `release/dutchmate-firefox-0.1.1.zip`.
5. Paste the listing copy and privacy answers from the repo.
6. Submit the add-on for review or signing.

### Notes

- Firefox add-ons can be listed on AMO or self-distributed.
- For broad public use, AMO listing is the easier path.
- If Firefox asks for source code submission, we can prepare that together.

## Edge

Use Microsoft Edge Add-ons / Partner Center after Firefox.

### Your action

1. Sign in to your Microsoft account in Partner Center.
2. Create a new extension.
3. Upload the Chromium zip package.
4. Fill in the store listing and privacy fields.
5. Submit for certification.

### Notes

- Edge uses the same Chromium extension architecture as Chrome.
- In practice, the Edge upload usually reuses the Chrome build package.

## Chrome

Use the Chrome Web Store last.

### Your action

1. Open the Chrome Web Store developer registration page.
2. Pay the one-time developer registration fee if prompted.
3. Create or finish the developer account registration.
4. Create a new item.
5. Upload `release/dutchmate-chrome-0.1.1.zip`.
6. Fill the store listing, privacy, distribution, and review fields.
7. Submit for review.

### Notes

- Chrome is the strictest public release path, so it is best to use it after Firefox and Edge are already ready.
- For WhatsApp sharing, the published store URL is the safe install path.

## Suggested Publish Message

Use a gentle, non-marketing share note like this:

```text
Hi, I built this browser extension for myself while learning Dutch online. If it looks useful to you, feel free to try it and tell me whether it helps.
```
