# Browser Release Playbook

Last updated: 2026-07-19

This is the canonical, browser-neutral release path for DutchMate.

For a release containing Context Missions, complete and retain the separate [Context Missions validation record](../features/004-transfer-validation.md). It distinguishes automated package evidence from the required Chrome and Firefox interactive pass, and keeps the feature described as experimental until delayed-transfer evidence exists.

GitHub Releases should be created through the manual workflow documented in `docs/release/github-release-pipeline.md` before store submission, so the repo has a tagged release record and attached browser artifacts.
Use it for both new browser listings and updates to existing store listings.

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

## Soft-Launch Support

Keep one single feedback intake for the soft Firefox launch:

- support mailbox: `dutchmate.project@gmail.com`
- website contact links and privacy policy should point to the same mailbox
- if additional website feedback UI is added later, it should still feed this same single feedback intake

## File Set To Use

- Firefox package: `release/dutchmate-firefox-0.3.0.zip`
- Chromium package for Chrome: `release/dutchmate-chrome-0.3.0.zip`
- Chromium package for Edge: use `release/dutchmate-chrome-0.3.0.zip` unless a separate Edge-specific package is created
- GitHub release notes source: `docs/release/notes/v0.3.0.md`
- Privacy policy: `https://dutchmate-frontend.onrender.com/privacy-policy.html`
- Chrome listing draft: `docs/release/chrome-web-store-listing-draft.md`
- Shared disclosure draft: `docs/release/store-disclosure-draft.md`

## Current 0.3.0 Artifact Status

Generated locally from the current source:

- `release/dutchmate-firefox-0.3.0.zip`
- `release/dutchmate-chrome-0.3.0.zip`

Older `0.1.x` and `0.2.0` artifacts may still exist locally in `release/` for reference. Use the `0.3.0` artifacts for the current flashcard-review release baseline.

The Firefox source package still needs to be regenerated separately if AMO requests source code for the `0.3.0` submission.

There is no separate Edge-specific package script yet. For the first Edge submission, use the Chrome Chromium package unless an Edge-specific packaging step is added later.

## Firefox

Use Firefox Add-ons / AMO for the public release and subsequent updates.

### Your action

1. Sign in to your Mozilla account.
2. Open the Firefox Add-ons developer page.
3. Open the existing DutchMate add-on page for an update. Create a new listing only if the add-on is not yet listed.
4. Upload `release/dutchmate-firefox-0.3.0.zip`.
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
2. Open the existing DutchMate extension listing for an update. Create a new extension only if the listing does not exist.
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
4. Open the existing DutchMate item for an update. Create a new item only if the listing does not exist.
5. Upload `release/dutchmate-chrome-0.3.0.zip`.
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
