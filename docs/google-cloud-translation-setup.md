# Google Cloud Translation Setup

This note records how DutchMate configured Google Cloud Translation for the Render backend.

## Current Status

Status: **Verified**

Date: 2026-06-16

Google account:

```text
dutchmate.project@gmail.com
```

Google Cloud project:

```text
dutchmate-production
```

Render backend:

```text
https://dutchmate-backend.onrender.com
```

Verified result:

```text
Backend health check passed: https://dutchmate-backend.onrender.com
Backend translation smoke test passed: https://dutchmate-backend.onrender.com
```

## Billing Position

The project account had a Google Cloud free trial:

```text
Free trial credit active
90 days remaining at setup time
```

Do not click "Activate" / "Activate full account" until we explicitly approve normal paid usage. The free trial is enough for MVP provider testing.

A Google Cloud budget alert was created for the project. Budget alerts help visibility, but they are alerts, not hard spending caps.

## What Was Configured

1. Signed in to Google Cloud with `dutchmate.project@gmail.com`.
2. Created or selected project `dutchmate-production`.
3. Confirmed the free trial was active.
4. Created a budget alert for the project.
5. Enabled **Cloud Translation API**.
6. Created an API key.
7. Restricted the API key to **Cloud Translation API**.
8. Left application restrictions as **None** because Render is a server-side backend and does not have a browser referrer. Do not use website restrictions for this backend key.
9. Added the key only to Render environment variables.
10. Switched Render to `TRANSLATION_PROVIDER=google-translate`.

## Render Environment Variables

Set these in Render, not in the repo:

```text
TRANSLATION_PROVIDER=google-translate
GOOGLE_TRANSLATE_API_KEY=<restricted Google API key>
GOOGLE_TRANSLATE_API_URL=https://translation.googleapis.com/language/translate/v2
```

Keep:

```text
HOST=0.0.0.0
PORT=10000
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000
```

MyMemory and Azure environment variables may remain in Render, but they are not used while `TRANSLATION_PROVIDER=google-translate`.

## Safety Rules

- Never commit the Google API key.
- Never paste the API key into chat.
- Keep API restrictions set to **Cloud Translation API** only.
- Do not call Google Cloud Translation directly from the browser extension.
- Keep Google behind the DutchMate backend so users never see provider credentials.
- Do not activate the full Google Cloud account until paid usage is explicitly approved.

## Smoke Test

After Render deploys:

```bash
corepack pnpm backend:smoke https://dutchmate-backend.onrender.com
```

Expected successful output:

```text
Backend health check passed: https://dutchmate-backend.onrender.com
Backend translation smoke test passed: https://dutchmate-backend.onrender.com
```
