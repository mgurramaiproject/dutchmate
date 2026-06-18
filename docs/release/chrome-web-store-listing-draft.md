# Chrome Web Store Listing Draft

Last updated: 2026-06-17

Use this as working copy for DutchMate's first Chrome Web Store submission. Recheck the Chrome Developer Dashboard fields during submission because field names and limits can change.

## Basic Details

Extension name:

```text
DutchMate
```

Short description:

```text
Learn Dutch online with hover and selection translations in Dutch, English, and your language.
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
DutchMate is a focused browser extension for learning Dutch while reading online.

It helps you use Dutch, English, and your mother tongue together while reading normal webpages. The current release supports Dutch, English, and Telugu.

Hover over a word or select a short phrase or sentence to see translations in context. You can choose your learning language, use English as a bridge language, and keep your mother tongue close for meaning.

Selected single-word lookups can be stored locally in your browser to make repeat learning faster. Hovered words, selected phrases, selected sentences, and failed translations are not stored in the local translation cache.

The product direction is local word collection and spaced-repetition flashcards, using words you choose while browsing.

DutchMate does not require an account, subscription, or payment.

Privacy note: DutchMate sends the text you ask to translate to the DutchMate backend, which uses Google Cloud Translation. DutchMate does not sell user data and does not use translated text for advertising. Avoid using it on private pages if you do not want that text sent for translation.
```

## Single Purpose

```text
DutchMate helps users learn Dutch online by translating user-hovered or user-selected webpage text between Dutch, English, and a supported mother tongue.
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

- Website content: hovered words, nearby sentence context, selected words, selected phrases, or selected short sentences from webpages.
- User activity / interaction data: translation context such as `hover` or `selection`.
- User settings: source language, target language, hover/selection settings, cache/privacy preferences.

Do not claim DutchMate collects personally identifiable information, financial information, health information, authentication information, or payment information unless the product behavior changes.

## Purpose Of Data Use

```text
DutchMate uses the text and language settings only to provide the user-facing translation feature, improve reliability, prevent abuse, and control translation-provider cost.
```

## Data Sharing

```text
DutchMate sends translation requests to the DutchMate backend at https://dutchmate-backend.onrender.com. The backend sends the text needed for translation to Google Cloud Translation.

DutchMate does not sell user data. DutchMate does not use translated text for advertising. DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider, comply with law, or protect the service from abuse.
```

## Limited Use Statement

```text
DutchMate uses user data only to provide or improve its single purpose: translating hovered or selected webpage text for the user. DutchMate does not sell user data, does not use user data for advertising, and does not transfer user data except as needed to provide translations, comply with law, or protect the service.
```

## Security Statement

```text
DutchMate sends translation requests over HTTPS to the DutchMate backend. Provider API keys are kept server-side and are not included in the browser extension.
```

## Reviewer Notes

```text
DutchMate is a Manifest V3 browser extension for Dutch learning support.

The extension translates hovered words and selected text through the DutchMate backend at https://dutchmate-backend.onrender.com/translate, which uses Google Cloud Translation.

No account, login, payment, or reviewer credentials are required.

To test:
1. Install the extension.
2. Open a normal Dutch webpage.
3. Hover over a Dutch word.
4. Select a short Dutch phrase or sentence.
5. Open Options and confirm language and behavior settings can be changed.

Store-ready builds hide provider endpoint and API-key override controls from normal users. Local-testing builds can expose those controls for development only.
```

## Gentle Share Text

Use this outside the store when sharing with the Dutch learner WhatsApp group:

```text
Hi everyone! I built a small browser extension for myself while learning Dutch online, and I thought it might be useful to a few people here too.

It lets you hover over words or select short text on a webpage to see translations between Dutch, English, and Telugu. The idea is to learn Dutch with English as a bridge and your own language close by.

No pressure at all, but feel free to try it if it sounds useful. If anyone finds it helpful, confusing, broken, or not useful, I would be happy to hear.
```

## Assets Still Needed

- Additional Chrome Web Store screenshots from [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md).
- Confirmed public privacy policy URL.
- Final zipped Chrome artifact.
- Store icon and promotional image assets in [../assets/store/chrome/](../assets/store/chrome/).

## Submission Inputs Already Prepared

- Package checklist: [store-package-preparation-checklist.md](store-package-preparation-checklist.md)
- Chrome image capture plan: [chrome-web-store-screenshot-plan.md](chrome-web-store-screenshot-plan.md)
- Store disclosure draft: [store-disclosure-draft.md](store-disclosure-draft.md)
- Public privacy policy source: [privacy-policy.md](privacy-policy.md)
- Public privacy policy page source: [../frontend/privacy-policy.html](../frontend/privacy-policy.html)
- Manual browser evidence: [manual-testing.md](manual-testing.md)
- Cost monitoring evidence: [google-cloud-cost-monitoring-checklist.md](../operations/google-cloud-cost-monitoring-checklist.md)
