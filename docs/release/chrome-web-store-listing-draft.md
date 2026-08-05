# Chrome Web Store Listing Draft

Last updated: 2026-08-05

Use this as working copy for DutchMate's first Chrome Web Store submission. Recheck the Chrome Developer Dashboard fields during submission because field names and limits can change.

## Basic Details

Extension name:

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

Support email:

```text
dutchmate.project@gmail.com
```

Privacy policy URL:

```text
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

## Full Description

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

## Single Purpose

```text
DutchMate helps users learn Dutch online by translating user-selected webpage text between Dutch, English, and a supported mother tongue.
```

## User Data Disclosure

Does DutchMate collect or transmit user data?

```text
Yes.
```

Explanation:

```text
DutchMate transmits text the user asks to translate, along with language settings and translation context, to the DutchMate backend so the extension can return translations.
```

Likely data types to disclose:

- Website content: selected words, nearby sentence context, selected phrases, or selected short sentences from webpages.
- User activity / interaction data: the user's selected-text translation action.
- User settings and local learning data: source language, target language, hover/selection settings, cache/privacy preferences, learning items, capped contexts, mastery, lesson progress, rhythm, and saved vocabulary entries stored locally in the browser.

Do not claim DutchMate collects personally identifiable information, financial information, health information, authentication information, or payment information unless the product behavior changes.

## Purpose Of Data Use

```text
DutchMate uses the text and language settings only to provide the user-facing translation feature, improve reliability, prevent abuse, and control translation-provider cost.
```

## Data Sharing

```text
DutchMate sends translation requests to the DutchMate backend at https://dutchmate-backend.onrender.com. The backend sends the text needed for translation to Google Cloud Translation.

Selected single-word translations can be saved locally as vocabulary when the user chooses. Learning items, capped contexts, mastery, lesson progress, rhythm, and saved vocabulary are not sent to an account or synced across devices. Context Missions are local and ephemeral: they add no translation-provider or generative-service request, persist no mission history, and send no background learning telemetry; an eligible saved item can receive at most one normal local mastery update. LearnLoop backups exclude provider credentials, translation cache entries, and unrelated extension settings.

DutchMate does not sell user data. DutchMate does not use translated text for advertising. DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider, comply with law, or protect the service from abuse.
```

## Limited Use Statement

```text
DutchMate uses user data only to provide or improve its single purpose: translating user-selected webpage text for the user. DutchMate does not sell user data, does not use user data for advertising, and does not transfer user data except as needed to provide translations, comply with law, or protect the service.
```

## Security Statement

```text
DutchMate sends translation requests over HTTPS to the DutchMate backend. Provider API keys are kept server-side and are not included in the browser extension.
```

## Reviewer Notes

```text
DutchMate is a Manifest V3 browser extension for Dutch learning support. Hover translation is disabled in the 0.5.1 release.

The extension translates user-selected words, phrases, and sentences through the DutchMate backend at https://dutchmate-backend.onrender.com/translate, which uses Google Cloud Translation.

No account, login, payment, or reviewer credentials are required.

To test:
1. Install the extension.
2. Open a normal Dutch webpage.
3. Select a short Dutch word, phrase, or sentence.
4. Select a single Dutch word and save it from the tooltip.
5. Open Options and confirm language, behavior, and saved vocabulary settings can be changed.

Store-ready builds hide provider endpoint and API-key override controls from normal users. Local-testing builds can expose those controls for development only.
```

## Gentle Share Text

Use this outside the store when sharing with the Dutch learner WhatsApp group:

```text
Hi everyone! I built a small browser extension for myself while learning Dutch online, and I thought it might be useful to a few people here too.

It lets you select short text on a webpage to see translations between Dutch, English, and Telugu. The idea is to learn Dutch with English as a bridge and your own language close by.

No pressure at all, but feel free to try it if it sounds useful. If anyone finds it helpful, confusing, broken, or not useful, I would be happy to hear.
```

## Assets Still Needed

- Additional Chrome Web Store screenshots from [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md).
- Confirmed public privacy policy URL.
- Final zipped Chrome artifact.
- Store icon and promotional image assets in [../../assets/store/chrome/](../../assets/store/chrome/).

## Submission Inputs Already Prepared

- Chrome image capture plan: [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md)
- Store disclosure draft: [store-disclosure-draft.md](store-disclosure-draft.md)
- Public privacy policy source: [privacy-policy.md](privacy-policy.md)
- Public privacy policy page source: [../../frontend/privacy-policy.html](../../frontend/privacy-policy.html)
- Manual browser evidence: [manual-testing.md](manual-testing.md)
