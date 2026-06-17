# Chrome Web Store Screenshot Plan

Last updated: 2026-06-17

Use this plan to capture DutchMate's first Chrome Web Store listing images. It does not create the images; it defines what to capture and how to review them.

## Official Requirements Summary

Chrome Web Store listing images must include:

- extension icon;
- small promotional image;
- at least one screenshot.

Chrome image requirements to prepare for:

- extension icon: 128x128 PNG in the extension zip, with the main artwork around 96x96 and transparent padding;
- small promotional image: 440x280 pixels;
- screenshots: at least 1 and preferably up to 5;
- screenshot size: 1280x800 preferred, or 640x400 accepted;
- screenshots should show the real user experience, with square corners and no padding.

## Recommended Screenshot Set

Capture up to five screenshots for the first listing:

1. Hover translation on a normal Dutch webpage.
2. Selection translation for a short Dutch phrase or sentence.
3. Options page showing normal language and behavior settings.
4. Options page showing privacy/cache controls, including cache clearing.
5. Optional: a second translation example that shows the Dutch, English, and Telugu learning flow clearly.

## Capture Rules

- Use a clean browser profile or window with no personal bookmarks, messages, account details, or private pages visible.
- Use a normal Dutch reading page with public, non-sensitive text.
- Prefer a 1280x800 browser viewport for every screenshot.
- Capture the actual extension UI, not the browser extension management page.
- Keep screenshots full bleed: no borders, padding, frames, or decorative mockup wrappers.
- Make sure the tooltip text is readable after downscaling.
- Avoid noisy tabs, visible local file paths, developer consoles, or extension error pages.
- If a screenshot includes Telugu text, confirm the font renders clearly.

## Suggested File Names

Store source assets can live outside the packaged extension. Suggested paths:

```text
assets/store/chrome/screenshots/01-hover-translation-1280x800.png
assets/store/chrome/screenshots/02-selection-translation-1280x800.png
assets/store/chrome/screenshots/03-options-language-behavior-1280x800.png
assets/store/chrome/screenshots/04-options-privacy-cache-1280x800.png
assets/store/chrome/screenshots/05-multilingual-result-1280x800.png
assets/store/chrome/promo/small-promo-440x280.png
assets/store/chrome/icon/icon-128.png
```

The folder structure is prepared in [assets/store/chrome/README.md](../assets/store/chrome/README.md).
The first real screenshot capture instructions are in [assets/store/chrome/screenshots/README.md](../assets/store/chrome/screenshots/README.md).

## Promotional Image Notes

The small promotional image should communicate DutchMate's purpose at a glance. Avoid turning it into a screenshot. Keep text minimal or avoid text entirely, because Chrome says promotional images are not locale-specific.

## Review Checklist

Before uploading images to the Chrome Developer Dashboard:

- screenshot dimensions are exactly 1280x800 or 640x400;
- small promotional image is exactly 440x280;
- extension icon is a 128x128 PNG;
- no private or personally identifying information is visible;
- each screenshot shows the real product experience;
- text remains readable when viewed smaller;
- filenames and final uploaded order match the intended story.

## Capture Log

Newest entries first.

```text
Date: 2026-06-17
File: assets/store/chrome/screenshots/01-hover-translation-1280x800.png
Result: Captured
Dimensions: 1280x800
Scenario: Hover translation on a clean Dutch learning page with the restored Book Bubble icon visible.
Notes: Automated Chrome loaded the built content script UI for capture. The automated browser did not inject the unpacked extension content script reliably, so this screenshot should be treated as the first store-asset candidate and can be manually recaptured before final upload if desired.
```

## Sources

- Chrome Web Store image requirements: https://developer.chrome.com/docs/webstore/images
