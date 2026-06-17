# Public Hosting

Last updated: 2026-06-17

DutchMate's public marketing and privacy pages are intended to be served from the repository's `frontend/` directory through Render Static Sites.

## Current Status

GitHub Pages is not enabled for this repository.

On 2026-06-17, enabling GitHub Pages through the GitHub API returned:

```text
Your current plan does not support GitHub Pages for this repository.
```

Before browser-store submission, deploy the `dutchmate-frontend` Render Static Site and confirm `privacy-policy.html` opens publicly.

## Intended Public URLs

If the Render Static Site is created with the service name `dutchmate-frontend`, these URLs should be available:

```text
https://dutchmate-frontend.onrender.com/
https://dutchmate-frontend.onrender.com/privacy-policy.html
```

Use the privacy policy URL in browser-store submission fields only after confirming the page opens publicly.

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
