# DutchMate WhatsApp MVP Tester Instructions

Last updated: 2026-06-16

Use this page when inviting a moderate WhatsApp group of Dutch learners to try the DutchMate MVP.

DutchMate is an early browser extension that helps English and Telugu speakers read Dutch websites. It translates hovered words and selected text into the other supported languages.

## Short Invite Message

```text
Hi! I am testing an early version of DutchMate, a browser extension for Dutch learners.

It helps you translate words or short text while reading websites. It currently supports Dutch, English, and Telugu.

This is an MVP, so it may still have bugs. Please try it on normal webpages, tell me what worked, what confused you, and where the translation felt wrong.
```

## Who This Is For

Good early testers:

- are learning Dutch;
- read Dutch websites in Chrome or Firefox;
- are comfortable trying an early tool;
- can send simple feedback by WhatsApp or email.

This test is not ready for users who expect a polished store-installed product with automatic updates and support.

## What To Tell Testers Before They Install

DutchMate sends the text they ask to translate to the DutchMate backend, which uses Google Cloud Translation.

For the MVP:

- no account is needed;
- hovered words or nearby sentence context may be sent for translation;
- selected words, phrases, or short sentences may be sent for translation;
- selected single-word translations may be cached locally in the browser;
- hovered text and selected phrases are not stored in the local cache;
- users can disable hover translation, selected-text translation, or the whole extension from Options.

Share the privacy policy draft before inviting broader testers:

[privacy-policy-draft.md](privacy-policy-draft.md)

## Recommended Release Path

For a WhatsApp group with many non-technical learners, prefer a browser-store or signed distribution path before sharing widely.

Manual developer-mode installation can work for a few technical testers, but it is confusing for normal learners and does not give them automatic updates.

Recommended order:

1. Finish privacy/store disclosure review.
2. Confirm Google Cloud budget alerts and cost dashboard.
3. Run the Chrome and Firefox manual regression checklist.
4. Package the browser extension for store or signed distribution.
5. Share one simple install link and this tester guidance.

Manual install instructions are still available in [README.md](../README.md) for internal testing.

## What Testers Should Try

Ask testers to try these simple workflows:

1. Open a normal Dutch webpage.
2. Hover over a Dutch word and wait briefly.
3. Select a short Dutch phrase or sentence.
4. Open Options and try changing the language settings.
5. Turn hover translation off, save, and confirm hovering stops.
6. Turn hover translation back on.
7. Use the extension for one real reading session.

Good test websites include news, school, government, shopping, recipe, or housing pages. Avoid testing on browser settings pages, extension store pages, banking pages, or pages with private personal information.

## Feedback Questions

Ask testers to answer as many of these as they can:

```text
1. Browser: Chrome or Firefox?
2. Device: laptop, desktop, Chromebook, or something else?
3. Did the extension install without confusion?
4. Did hover translation work?
5. Did selected-text translation work?
6. Was the tooltip easy to read and placed in a useful spot?
7. Were any translations wrong, weird, or missing?
8. Did anything feel slow?
9. Did anything break or get in the way?
10. Would you keep using this while learning Dutch? Why or why not?
```

For translation quality feedback, ask testers to include:

- the original word or sentence;
- the translation they saw;
- what they expected instead;
- the page language, if they know it.

## Known MVP Limits

Set expectations clearly:

- This is an early MVP, not a finished product.
- It supports Dutch, English, and Telugu only.
- Some translations may be imperfect.
- Some webpages block or interfere with browser extensions.
- Protected browser pages and extension store pages cannot run the content script.
- If the backend or translation provider has a temporary problem, translations may fail.

## Support Contact

Use this contact for MVP tester feedback:

```text
dutchmate.project@gmail.com
```
