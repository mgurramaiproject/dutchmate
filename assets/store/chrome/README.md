# Chrome Store Assets

Last updated: 2026-06-17

Use this folder for Chrome Web Store listing assets. These files are not bundled into the extension package unless a future build step explicitly includes them.

## Folder Layout

```text
assets/store/chrome/icon/
assets/store/chrome/promo/
assets/store/chrome/screenshots/
```

## Expected Files

Suggested first-pass asset names:

```text
icon/icon-128.png
promo/small-promo-440x280.png
screenshots/01-hover-translation-1280x800.png
screenshots/02-selection-translation-1280x800.png
screenshots/03-options-language-behavior-1280x800.png
screenshots/04-options-privacy-cache-1280x800.png
screenshots/05-multilingual-result-1280x800.png
```

Regenerate the small promotional image with:

```bash
corepack pnpm store:assets
```

The production icon is derived from `frontend/assets/dutchmate-logo-gpt-image.png`. Resized extension icon files live in `public/icons/`, are copied into Chrome and Firefox builds, and are referenced from the extension manifest.

The Chrome Web Store icon lives at `assets/store/chrome/icon/icon-128.png` and should match the same GPT-generated Book Bubble mark.

Follow [docs/chrome-web-store-screenshot-plan.md](../../../docs/chrome-web-store-screenshot-plan.md) before capturing or designing these images.
