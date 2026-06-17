# Public Hosting

Last updated: 2026-06-17

DutchMate's public marketing and privacy pages are intended to be served from the repository's `frontend/` directory through Render Static Sites.

## Current Status

Render Static Site hosting is live.

Confirmed on 2026-06-17:

```text
https://dutchmate-frontend.onrender.com/
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

GitHub Pages is not enabled for this repository and is no longer the intended host.

On 2026-06-17, enabling GitHub Pages through the GitHub API returned:

```text
Your current plan does not support GitHub Pages for this repository.
```

Use the Render privacy policy URL in browser-store submission fields.

## Public URLs

The Render Static Site is available at:

```text
https://dutchmate-frontend.onrender.com/
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

Use the privacy policy URL in browser-store submission fields.

## Files

- [../frontend/index.html](../frontend/index.html) is the public marketing homepage.
- [../frontend/privacy-policy.html](../frontend/privacy-policy.html) is the browser-store privacy policy page.
- [../frontend/styles.css](../frontend/styles.css) contains the static site styling.

## Render Static Site Setting

The `render.yaml` blueprint includes:

```text
Service type: Static Site
Name: dutchmate-frontend
Publish path: frontend
```
