# DutchMate Gentle WhatsApp Sharing Guide

Last updated: 2026-06-16

Use this page when gently sharing DutchMate with a moderate WhatsApp group of Dutch learners.

DutchMate is a browser extension originally built for personal Dutch learning. It helps you use Dutch, English, and your mother tongue together while reading online.

## Gentle Share Message

```text
Hi everyone! I built a small browser extension for myself while learning Dutch online, and I thought it might be useful to a few people here too.

It lets you hover over words or select short text on a webpage to see translations between Dutch, English, and Telugu. The idea is to learn Dutch with English as a bridge and your own language close by.

No pressure at all, but feel free to try it if it sounds useful. If anyone finds it helpful, confusing, broken, or not useful, I would be happy to hear.
```

## Who Might Find It Useful

This may be useful for people who:

- are learning Dutch;
- learn Dutch from normal websites in Chrome or Firefox;
- sometimes want quick English or Telugu help while reading;
- are comfortable trying a new, focused tool.

It is probably not a good fit yet for people who want formal support and automatic updates.

## What To Mention Before Sharing

DutchMate sends the text they ask to translate to the DutchMate backend, which uses Google Cloud Translation.

For the current release:

- no account is needed;
- hovered words or nearby sentence context may be sent for translation;
- selected words, phrases, or short sentences may be sent for translation;
- selected single-word translations may be cached locally in the browser;
- hovered text and selected phrases are not stored in the local cache;
- users can disable hover translation, selected-text translation, or the whole extension from Options.

Share the privacy policy draft before inviting a broader group:

[privacy-policy-draft.md](privacy-policy-draft.md)

## Recommended Release Path

For a WhatsApp group with many non-technical learners, prefer a browser-store or signed distribution path before sharing widely.

Manual developer-mode installation can work for a few technical testers, but it is confusing for normal learners and does not give them automatic updates.

Recommended order:

1. Finish privacy/store disclosure review.
2. Confirm Google Cloud budget alerts and cost dashboard.
3. Run the Chrome and Firefox manual regression checklist.
4. Package the browser extension for store or signed distribution.
5. Share one simple install link and a gentle note.

Manual install instructions are still available in [README.md](../../README.md) for internal testing.

## What People May Try

People can use it naturally, but these are useful first things to try:

1. Open a normal Dutch webpage.
2. Hover over a Dutch word and wait briefly.
3. Select a short Dutch phrase or sentence.
4. Open Options and try changing the language settings.
5. Turn hover translation off, save, and confirm hovering stops.
6. Turn hover translation back on.
7. Use the extension for one real reading session.

Good pages to try include news, school, government, shopping, recipe, or housing pages. Avoid browser settings pages, extension store pages, banking pages, or pages with private personal information.

## If Someone Wants To Reply

Keep the ask light. Useful replies include:

```text
I tried it in Chrome/Firefox.
It helped with...
It was confusing when...
This translation looked wrong...
It felt slow when...
I would/would not keep using it because...
```

If someone notices a bad translation, ask for:

- the original word or sentence;
- the translation they saw;
- what they expected instead;
- the page language, if they know it.

## Current Limits

Set expectations without making the message feel heavy:

- It supports Dutch, English, and Telugu only.
- Some learning features, such as saved highlights and spaced-repetition flashcards, are still in development.
- Some translations may be imperfect.
- Some webpages block or interfere with browser extensions.
- Protected browser pages and extension store pages cannot run the content script.
- If the backend or translation provider has a temporary problem, translations may fail.

## Support Contact

Use this contact if someone prefers email:

```text
dutchmate.project@gmail.com
```
