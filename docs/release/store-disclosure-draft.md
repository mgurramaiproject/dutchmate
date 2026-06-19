# DutchMate Store Disclosure Draft

Last updated: 2026-06-19

Use this as working copy for Chrome Web Store and Firefox Add-ons submission fields. Recheck the store forms during submission, because field names and policy wording can change.

This draft is based on [privacy-policy.md](privacy-policy.md) and the current release behavior.

## Product Summary

```text
DutchMate helps people learn Dutch online by translating hovered words and selected text between Dutch, English, and a supported mother tongue such as Telugu.
```

## Short Description

```text
Learn Dutch online with hover and selection translations in Dutch, English, and your language.
```

## Longer Description

```text
DutchMate is a focused browser extension for learning Dutch while reading online.

It lets you hover over words or select short text on a webpage to see translations between Dutch, English, and a supported mother tongue such as Telugu.

DutchMate is intended for language support while learning Dutch from real webpages. It does not require an account, subscription, or payment.
```

## Single Purpose

```text
DutchMate helps users learn Dutch online by translating user-hovered or user-selected webpage text between Dutch, English, and a supported mother tongue.
```

## Privacy Policy URL

Use the hosted URL for:

```text
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

The privacy policy public URL was confirmed on 2026-06-17.

## Chrome Privacy Practices Draft

Chrome requires data collection disclosures and limited-use certification for extensions published or updated in the Chrome Web Store.

### Does DutchMate collect or transmit user data?

Recommended answer:

```text
Yes.
```

Reason:

```text
DutchMate sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate, along with language settings and translation context, so the extension can return translations.
```

### Data Types To Disclose

Likely data types:

- **Website content**: hovered words, nearby sentence context, selected words, selected phrases, or selected short sentences from webpages.
- **User activity / interaction data**: translation context such as `hover` or `selection`.
- **User settings**: source language, target language, hover/selection settings, cache/privacy preferences.

Do not claim DutchMate collects personally identifiable information, financial information, health information, authentication information, or payment information unless the product behavior changes.

### Purpose Of Data Use

```text
DutchMate uses the text and language settings only to provide the user-facing translation feature, improve reliability, prevent abuse, and control translation-provider cost.
```

### Data Sharing

```text
DutchMate sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate only for translation. The backend sends the text needed for translation to Google Cloud Translation.

Single selected words may be cached locally in the browser. API keys, if any, are stored in browser local/sync storage and used only for the selected provider.

DutchMate does not sell user data. DutchMate does not use translated text for advertising or tracking. DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider, comply with law, or protect the service from abuse.
```

### Limited Use Statement

```text
DutchMate uses user data only to provide or improve its single purpose: translating hovered or selected webpage text for the user. DutchMate sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate only for translation. DutchMate does not sell user data, does not use user data for advertising or tracking, and does not transfer user data except as needed to provide translations, comply with law, or protect the service.
```

### Security Statement

```text
DutchMate sends translation requests over HTTPS to https://dutchmate-backend.onrender.com/translate. Production provider API keys are kept server-side and are not included in the browser extension. API keys, if any are configured in the extension for development or custom use, are stored in browser local/sync storage and used only for the selected provider.
```

## Firefox Add-ons Draft

Firefox Add-ons requires a privacy policy if any data is transmitted from the user's device.

### Privacy Policy Checkbox

Recommended answer:

```text
This add-on has a privacy policy.
```

Reason:

```text
DutchMate transmits user-requested translation text from the browser to the DutchMate backend.
```

### Firefox Privacy Summary

```text
DutchMate sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate only for translation. The backend uses Google Cloud Translation to return translations. This may include hovered words, nearby sentence context, selected words, selected phrases, or selected short sentences, depending on your settings and actions.

DutchMate stores settings and selected single-word translation cache locally in your browser. Single selected words may be cached locally in the browser. Hovered text, selected phrases, selected sentences, and failed translations are not persistently cached locally.

API keys, if any, are stored in browser local/sync storage and used only for the selected provider.

DutchMate does not require an account, does not sell user data, and does not use translated text for advertising or tracking.
```

### Notes For Reviewers

```text
DutchMate is a Manifest V3 browser extension for Dutch learning support.

The extension sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate by default for translation requests. The backend uses Google Cloud Translation.

Store-ready builds hide provider endpoint and API-key override controls from normal users. Local-testing builds can expose those controls for development only.

No account, login, payment, or special reviewer credentials are required.
```

## User-Facing Disclosure Snippet

Use this near install/share instructions:

```text
Privacy note: DutchMate sends hovered or selected website text to https://dutchmate-backend.onrender.com/translate only for translation. Single selected words may be cached locally in your browser. API keys, if any, are stored in browser local/sync storage and used only for the selected provider. DutchMate does not sell data or use it for ads/tracking.
```

## Pre-Submission Checks

- Publish the privacy policy at a stable public URL.
- Confirm store-ready builds hide provider override controls.
- Confirm extension permissions match the current feature set.
- Confirm Chrome and Firefox packaged builds pass manual smoke tests.
- Confirm Google Cloud budget alerts and cost dashboard are active.
- Recheck the current Chrome and Firefox submission forms before copying these answers.

## Sources

- Chrome Web Store user data and privacy requirements: https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
- Chrome Web Store privacy policy requirements: https://developer.chrome.com/docs/webstore/program-policies/privacy
- Firefox Add-ons submission docs: https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
