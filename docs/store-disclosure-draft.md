# DutchMate Store Disclosure Draft

Last updated: 2026-06-16

Use this as working copy for Chrome Web Store and Firefox Add-ons submission fields. Recheck the store forms during submission, because field names and policy wording can change.

This draft is based on [privacy-policy.md](privacy-policy.md) and the current MVP behavior.

## Product Summary

```text
DutchMate helps Dutch learners read websites by translating hovered words and selected text into English, Dutch, and Telugu.
```

## Short Description

```text
Translate hovered words and selected text while reading Dutch websites.
```

## Longer Description

```text
DutchMate is a small browser extension for Dutch learners.

It lets you hover over words or select short text on a webpage to see translations. The MVP supports Dutch, English, and Telugu.

DutchMate is intended for reading support while learning Dutch. It does not require an account, subscription, or payment for the MVP.
```

## Single Purpose

```text
DutchMate provides quick reading support for Dutch learners by translating user-hovered or user-selected webpage text.
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
DutchMate transmits text the user asks to translate, along with language settings and translation context, to the DutchMate backend so the extension can return translations.
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
DutchMate sends translation requests to the DutchMate backend at https://dutchmate-backend.onrender.com. The backend sends the text needed for translation to Google Cloud Translation.

DutchMate does not sell user data. DutchMate does not use translated text for advertising. DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider, comply with law, or protect the service from abuse.
```

### Limited Use Statement

```text
DutchMate uses user data only to provide or improve its single purpose: translating hovered or selected webpage text for the user. DutchMate does not sell user data, does not use user data for advertising, and does not transfer user data except as needed to provide translations, comply with law, or protect the service.
```

### Security Statement

```text
DutchMate sends translation requests over HTTPS to the DutchMate backend. Provider API keys are kept server-side and are not included in the browser extension.
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
DutchMate sends the text you ask to translate to the DutchMate backend, which uses Google Cloud Translation to return translations. This may include hovered words, nearby sentence context, selected words, selected phrases, or selected short sentences, depending on your settings and actions.

DutchMate stores settings and selected single-word translation cache locally in your browser. Hovered text, selected phrases, selected sentences, and failed translations are not persistently cached locally.

DutchMate does not require an account, does not sell user data, and does not use translated text for advertising.
```

### Notes For Reviewers

```text
DutchMate is a Manifest V3 browser extension for Dutch reading support.

The extension uses https://dutchmate-backend.onrender.com/translate by default for translation requests. The backend uses Google Cloud Translation.

Store-ready builds hide provider endpoint and API-key override controls from normal users. Local-testing builds can expose those controls for development only.

No account, login, payment, or special reviewer credentials are required for the MVP.
```

## User-Facing Disclosure Snippet

Use this near install/share instructions:

```text
Privacy note: DutchMate sends the text you ask to translate to the DutchMate backend, which uses Google Cloud Translation. It does not require an account and does not sell user data. Avoid using it on private pages if you do not want that text sent for translation.
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
