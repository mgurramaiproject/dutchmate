# Public Hosting

Last updated: 2026-06-19

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

- [../../frontend/index.html](../../frontend/index.html) is the public marketing homepage.
- [../../frontend/privacy-policy.html](../../frontend/privacy-policy.html) is the browser-store privacy policy page.
- [../../frontend/styles.css](../../frontend/styles.css) contains the static site styling.

## Local Preview

Run this before pushing homepage or privacy-policy changes to GitHub/Render:

```bash
corepack pnpm frontend:dev
```

Then open:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/privacy-policy.html
```

This serves the same `frontend/` folder that Render publishes. Use it to check page copy, images, links, Open Graph metadata, and privacy-policy content before production deploys.
If port `4173` is already in use, Vite will print the next available local URL, such as `http://127.0.0.1:4174/`.

If you do not want to use Vite, a simple static server also works:

```bash
cd frontend
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/
```

## Render Static Site Setting

The `render.yaml` blueprint includes:

```text
Service type: Static Site
Name: dutchmate-frontend
Publish path: frontend
```
