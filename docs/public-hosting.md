# Public Hosting

Last updated: 2026-06-17

DutchMate's public documentation pages are intended to be served from the repository's `docs/` directory through GitHub Pages.

## Current Status

GitHub Pages is not enabled yet for this repository.

On 2026-06-17, enabling GitHub Pages through the GitHub API returned:

```text
Your current plan does not support GitHub Pages for this repository.
```

Before browser-store submission, either make GitHub Pages available for this repo or publish `privacy-policy.html` through another stable public host.

## Intended Public URLs

If GitHub Pages is enabled for this repository with source `main` and folder `/docs`, these URLs should be available:

```text
https://mgurramaiproject.github.io/dutchmate-extension/
https://mgurramaiproject.github.io/dutchmate-extension/privacy-policy.html
```

Use the privacy policy URL in browser-store submission fields only after confirming the page opens publicly.

## Files

- [index.html](index.html) is the small public entry page.
- [privacy-policy.html](privacy-policy.html) is the browser-store privacy policy page.
- [.nojekyll](.nojekyll) tells GitHub Pages to serve the files directly without Jekyll processing.

## GitHub Pages Setting

In GitHub, configure:

```text
Settings > Pages > Build and deployment > Deploy from a branch
Branch: main
Folder: /docs
```
