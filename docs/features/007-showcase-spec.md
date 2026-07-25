# 007-showcase: DutchMate 0.4.0 homepage showcase

**Feature code:** `007-showcase`

**Branch:** `feature-007-showcase`

**GitHub issue:** [#79](https://github.com/mgurramaiproject/dutchmate/issues/79)

**Pull request:** [#80](https://github.com/mgurramaiproject/dutchmate/pull/80)

**Artifact convention:** feature-specific artifacts use the `007-showcase-` prefix. Release screenshots use the same prefix followed by the release number, for example `007-showcase-040-01-today.png`.

**Copy source:** [007-showcase-firefox-0.4.0-addon-description.md](../release/007-showcase-firefox-0.4.0-addon-description.md)

## Problem

The homepage's “See DutchMate in real reading flow” section still shows an older six-image set and describes an earlier, lookup-first product. DutchMate 0.4.0 now has a broader learning loop: real-page translation, saved vocabulary, lessons, Daily Five practice, and local progress without an account. The homepage should show that product honestly and make the Firefox extension easier to understand and install.

## Goal

Refresh `frontend/index.html` and its styles so the homepage presents the 0.4.0 learning loop through the supplied release screenshots and converts interested readers into Firefox installs.

## Product message

Primary message:

> Read Dutch in context. Understand more. Keep the words that matter.

The page should make the concrete loop visible: translate Dutch, English, or Telugu on real websites; save useful vocabulary; practise it with Daily Five and short lessons; keep learning data local. It must not claim instant fluency, a complete course, cloud sync, or an account-based product.

Authoritative factual copy comes from the Firefox release note. The homepage may edit it for hierarchy and readability, but must preserve these facts:

- Dutch, English, and Telugu translation on websites without switching tabs.
- A personal Dutch vocabulary list built from real websites.
- English and Telugu translations with context support.
- Daily Five practice and short lessons with flashcards.
- Data stored locally in the browser.
- No account, subscription, or payment required.

## Homepage changes

- Show `Release 0.4.0 · Now available for Firefox` as a visible release eyebrow.
- Refresh the title, description, Open Graph, Twitter, hero, feature, availability, and footer copy for 0.4.0.
- Use a direct Firefox install CTA such as `Install DutchMate free` while retaining the official Add-ons destination.
- Keep the existing OG image unless implementation review finds it materially misleading.
- Replace the existing six screenshot cards beneath the real-reading-flow heading with all 14 supplied 0.4.0 screenshots.

## Gallery experience

The gallery is a responsive, no-JavaScript showcase with three story groups:

1. **Start a daily learning rhythm** — Today, Lessons, Saved, activity, and review surfaces.
2. **Translate and save from any language** — Dutch, English, and Telugu capture flows plus Saved results.
3. **See it on a real webpage** — the browser-level screenshot as the featured visual.

Each group has a clear lead image, compact supporting thumbnails/cards, concise captions, and a keyboard-focusable link to the full-size image. Images use `object-fit: contain`, retain their full content, and remain readable on narrow screens. There is no auto-rotating carousel, modal dependency, or JavaScript gallery state.

## Asset contract

The source folder `/home/mgurram/MGurramAI/projects/dutchmate-proj/v0.4.0-screenshots` is not referenced at runtime. Copy its 14 PNGs into `frontend/assets/screenshots/` with normalized feature-prefixed names:

| Source | Shipped asset |
| --- | --- |
| `DutchMate-040-1-popup-today.png` | `007-showcase-040-01-today.png` |
| `DutchMate-040-2-Lessons.png` | `007-showcase-040-02-lessons.png` |
| `DutchMate-040-3-Saved.png` | `007-showcase-040-03-saved.png` |
| `DutchMate-040-4-Today-Month.png` | `007-showcase-040-04-today-month.png` |
| `DutchMate-040-5-Today-year.png` | `007-showcase-040-05-today-year.png` |
| `DutchMate-040-6-Lessons-inside.png` | `007-showcase-040-06-lessons-inside.png` |
| `DutchMate-040-7-Saved-item.png` | `007-showcase-040-07-saved-item.png` |
| `DutchMate-040-8-NL-to-EN-TE.png` | `007-showcase-040-08-nl-to-en-te.png` |
| `DutchMate-040-9-NL-item-in-Saved-list.png` | `007-showcase-040-09-nl-item-saved.png` |
| `DutchMate-040-10-EN-to-NL-TE.png` | `007-showcase-040-10-en-to-nl-te.png` |
| `DutchMate-040-11-EN-item-in-Saved-list.png` | `007-showcase-040-11-en-item-saved.png` |
| `DutchMate-040-12-TE-to-NL-EN.png` | `007-showcase-040-12-te-to-nl-en.png` |
| `DutchMate-040-13-TE-item-in-Saved-list.png` | `007-showcase-040-13-te-item-saved.png` |
| `DutchMate-040-14-Broswer-with-DutchMate-popup.png` | `007-showcase-040-14-browser-popup.png` |

The source images range from approximately 320–661px wide and 514–758px tall. The implementation must not crop away popup content to force equal card heights.

## Out of scope

- Extension behavior, popup functionality, translation logic, or release version changes outside the public frontend.
- A new OG/social image.
- A JavaScript carousel, lightbox, analytics, or tracking layer.
- Claims that DutchMate replaces a full Dutch course or guarantees fluency.

## Acceptance criteria

- `frontend/index.html` contains no references to the old screenshot filenames.
- All 14 normalized `007-showcase-040-*.png` assets exist under `frontend/assets/screenshots/` and render from the frontend.
- The gallery groups the screenshots into the three approved stories and provides meaningful alt text/captions.
- Full-size image links are keyboard reachable and do not depend on JavaScript.
- Portrait screenshots remain fully visible without destructive cropping or horizontal overflow at mobile widths.
- Homepage copy and metadata consistently identify the 0.4.0 Firefox release and match the authoritative release note.
- The Firefox CTA points to the official Add-ons listing and states that no account/subscription/payment is required.
- Existing homepage sections and feedback/privacy links remain functional.
- Frontend tests, `git diff --check`, and the relevant build/check commands pass.
