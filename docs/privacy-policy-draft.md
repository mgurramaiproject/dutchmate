# DutchMate Privacy Policy Draft

Last updated: 2026-06-16

This is a draft privacy policy for DutchMate MVP release preparation. It should be reviewed before public store submission.

## Summary

DutchMate helps users read Dutch by translating hovered or selected text into English, Dutch, and Telugu.

DutchMate sends the text you ask to translate to the DutchMate backend, which uses Google Cloud Translation to return translations. DutchMate does not require an account for the MVP.

## Data Sent For Translation

When translation is enabled, DutchMate may send the following to the DutchMate backend:

- hovered word or nearby sentence context, depending on the selected hover mode;
- selected word, phrase, or short sentence;
- source language setting;
- target language setting;
- translation context, such as `hover` or `selection`.

The DutchMate backend then sends the translation request to Google Cloud Translation.

## Data Stored Locally

DutchMate stores some settings in browser storage, including:

- whether the extension is enabled;
- hover and selection translation settings;
- source and target language settings;
- provider endpoint setting;
- cache and privacy preferences.

DutchMate also stores a local translation cache for successful selected single-word lookups. This cache is stored on the user’s device. It is intended to make repeat intentional lookups faster and reduce translation-provider calls.

DutchMate does not persistently cache:

- hovered words;
- selected phrases;
- selected sentences;
- failed translations.

Users can clear the local translation cache from the Options page.

## Backend Logging

The DutchMate backend logs operational metadata for reliability and cost control, such as:

- request status;
- duration;
- source and target language codes;
- translation context;
- text length;
- provider status;
- rate-limit state.

The backend is designed not to log the raw text being translated or the translated result.

## Accounts And Payments

The MVP does not require DutchMate user accounts.

The MVP does not include paid plans, subscriptions, or user billing.

## Third-Party Provider

DutchMate currently uses Google Cloud Translation behind the DutchMate backend.

Google Cloud Translation receives the text needed to complete the translation request. Users should understand that translated text is processed by Google Cloud Translation as part of providing the translation result.

## Data Sharing

DutchMate does not sell user data.

DutchMate does not use translated text for advertising.

DutchMate does not share translated text with third parties except as needed to provide translations through the configured translation provider.

## User Control

Users can:

- disable the extension;
- disable hover translation;
- disable selected-text translation;
- clear the local selected-word translation cache;
- change source and target language settings.

## Contact

For MVP testing, contact:

```text
dutchmate.project@gmail.com
```

## Store Disclosure Notes

Use this draft as the basis for browser-store privacy fields.

Important disclosure points:

- DutchMate transmits user-selected or hovered text for translation.
- DutchMate uses a backend service at `https://dutchmate-backend.onrender.com`.
- DutchMate uses Google Cloud Translation as the current translation provider.
- DutchMate stores settings and selected single-word translation cache locally.
- DutchMate does not require accounts in the MVP.
- DutchMate does not sell user data.
