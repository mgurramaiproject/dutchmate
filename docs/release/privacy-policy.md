# DutchMate Privacy Policy

Last updated: 2026-06-24

DutchMate is a browser extension that helps people learn Dutch online by translating hovered words and selected text between Dutch, English, and a supported mother tongue such as Telugu.

DutchMate does not require an account for the current release.

When you ask DutchMate to translate something, the extension sends the selected or hovered website text to `https://dutchmate-backend.onrender.com/translate` for translation. The backend uses Google Cloud Translation to return the translation.

DutchMate sends selected or hovered website text only to provide translations. DutchMate does not sell user data and does not use translated text for ads or tracking.

## Data Sent For Translation

When translation is enabled, DutchMate may send these details to `https://dutchmate-backend.onrender.com/translate`:

- hovered word or nearby sentence context, depending on the selected hover mode;
- selected word, phrase, or short sentence;
- source language setting;
- target language setting;
- translation context, such as `hover` or `selection`.

DutchMate sends this selected or hovered website text only for translation. The DutchMate backend then sends the text needed for translation to Google Cloud Translation.

Avoid using DutchMate on pages that contain private personal information if you do not want that text sent for translation.

## Data Stored Locally

DutchMate stores settings in your browser, including:

- whether the extension is enabled;
- hover and selection translation settings;
- source and target language settings;
- provider endpoint setting;
- cache and privacy preferences.

DutchMate also stores a local translation cache for successful selected single-word lookups. This cache stays on your device. It is intended to make repeated intentional lookups faster and reduce translation-provider calls. If you turn on "Cache hovered single-word translations locally" in Options, successful hovered single-word lookups can also be stored in this local cache.

DutchMate can also store saved vocabulary locally when you choose to save a successful selected single-word translation. Saved vocabulary includes the saved word, translation, source and target language direction, translation provider name, and saved/updated timestamps. DutchMate does not store the page URL or page title with saved vocabulary in the current release.

If a provider API key is configured in a development or custom setup, DutchMate stores it in browser local/sync storage and uses it only for the selected translation provider. Store-ready builds use the DutchMate backend and do not require users to enter a provider API key.

DutchMate does not persistently cache:

- selected phrases;
- selected sentences;
- failed translations.

Users can clear the local translation cache from the Options page. Users can also delete individual saved vocabulary entries or clear all saved vocabulary from the Options page.

## Backend Logging

The DutchMate backend logs operational metadata for reliability, debugging, abuse prevention, and cost control, such as:

- request status;
- duration;
- source and target language codes;
- translation context;
- text length;
- provider status;
- rate-limit state.

The backend is designed not to log the raw text you ask to translate or the translated result.

## Accounts And Payments

The current release does not require DutchMate user accounts. It does not include paid plans, subscriptions, or user billing.

## Third-Party Provider

DutchMate currently uses Google Cloud Translation behind the DutchMate backend.

Google Cloud Translation receives the text needed to complete the translation request. This means text you ask DutchMate to translate is processed by Google Cloud Translation as part of providing the translation result.

## Data Sharing

DutchMate does not sell user data. DutchMate does not use translated text for advertising or tracking. DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider.

Saved vocabulary remains in local browser storage. DutchMate does not send saved vocabulary to an account, sync it across devices, or use it for ads or tracking.

## User Control

Users can:

- disable the extension;
- disable hover translation;
- disable selected-text translation;
- clear the local selected-word translation cache;
- delete individual saved vocabulary entries;
- clear all saved vocabulary;
- change source and target language settings.

If you do not want text from a page sent for translation, do not hover or select text with DutchMate enabled on that page. You can also disable the extension from Options.

## Contact

For questions or feedback, use this single feedback intake:

```text
dutchmate.project@gmail.com
```
