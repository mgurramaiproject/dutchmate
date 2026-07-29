# DutchMate Design System

Last updated: 2026-07-29

This file defines the visual direction for DutchMate's public site, browser extension UI, store assets, and future marketing pages. It is custom to DutchMate and should be treated as the design source of truth for future UI work.

The adapted implementation contract is checked in under
[`docs/design-system-v1.1/`](docs/design-system-v1.1/). Runtime surfaces import
[`src/design-system/dutchmate-tokens.css`](src/design-system/dutchmate-tokens.css)
and the shared primitives. Existing product information architecture and data
contracts remain authoritative; the v1.1 work is a visual retrofit.

## 1. Visual Theme And Atmosphere

DutchMate should feel like a calm reading companion: clear, warm, and useful without looking like a loud SaaS funnel.

The visual language is editorial and text-first. It should borrow the confidence of a well-designed reading product: generous whitespace, strong typography, restrained UI chrome, and one memorable accent color.

The product promise is:

```text
Learn Dutch in your own language.
```

Design should support that promise by making pages feel:

- focused;
- trustworthy;
- low-pressure;
- helpful for learners;
- public-launch ready without feeling corporate.

## 2. Color System

DutchMate uses a warm paper, strong ink, and orange brand language. v1.1
expresses that language through semantic tokens so surfaces, borders, helper
text, success, warning, information, and errors remain readable and
consistent. Do not add gradients, glows, or decorative colour families.

| Token | Hex | Role |
| --- | --- | --- |
| `--dm-brand-orange` | `#ff6b00` | Brand tile, primary action, progress, emphasis |
| `--dm-brand-orange-deep` | `#9c3900` | Accessible orange text accent |
| `--dm-ink-strong` | `#1b1714` | Main text, dark surfaces, strong borders |
| `--dm-ink-muted` | `#675c54` | Secondary text and quiet metadata |
| `--dm-paper` | `#fff9f2` | Page and popup background |
| `--dm-paper-raised` | `#ffffff` | Cards and form surfaces |
| `--dm-paper-soft` | `#f8eee4` | Quiet grouped surfaces |
| `--dm-line` | `#d8cabe` | Borders and dividers |
| `--dm-success` / `--dm-warning` / `--dm-danger` / `--dm-info` | semantic | Feedback states paired with text, not colour alone |

### Color Rules

- Strong ink on paper is the default.
- Brand Orange is for action, focus, emphasis, and DutchMate identity.
- Deep Orange is for orange text on paper; never use bright Brand Orange as small text.
- White on strong ink is allowed for high-contrast sections and selected controls.
- Semantic success, warning, danger, and info colours are reserved for clearly labelled feedback.
- Do not add gradients, glows, colour-cast shadows, or decorative colour families.
- Use paper layers and the line token for subdued structure rather than inventing one-off neutrals.

Recommended CSS tokens:

```css
:root {
  --dm-brand-orange: #ff6b00;
  --dm-brand-orange-deep: #9c3900;
  --dm-ink-strong: #1b1714;
  --dm-ink-muted: #675c54;
  --dm-paper: #fff9f2;
  --dm-paper-raised: #ffffff;
  --dm-paper-soft: #f8eee4;
  --dm-line: #d8cabe;
}
```

## 3. Typography

DutchMate v1.1 uses a humanist sans for compact UI and readable Noto Sans
stacks for learning copy. Public pages retain the editorial reading role while
sharing the same semantic token foundation.

Public-facing preferred stacks:

```css
--dm-serif: Iowan Old Style, Palatino Linotype, Book Antiqua, Georgia, Times New Roman, serif;
--dm-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--dm-font-ui: "Nunito Sans", ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif;
--dm-font-reading: "Noto Sans", Inter, system-ui, sans-serif;
--dm-font-telugu: "Noto Sans Telugu", "Nirmala UI", sans-serif;
```

Use the reading stack for public page body copy and learning content. Use the
UI stack for headings, navigation, buttons, labels, badges, and browser
extension settings where quick scanning matters more than editorial tone.

If a hosted font is introduced later, preserve the humanist UI and readable
learning roles. Do not use handwriting fonts or monospace as the main brand
voice.

### Type Scale

| Use | Desktop | Mobile | Weight | Notes |
| --- | ---: | ---: | ---: | --- |
| Hero heading | 72-88px | 42-48px | 750-850 | Short, confident, no negative letter spacing |
| Page heading | 48-64px | 36-42px | 750-850 | Used for privacy/support pages |
| Section heading | 34-44px | 28-34px | 700-800 | Clear editorial section titles |
| Card heading | 18-22px | 18-20px | 700-800 | Compact and scannable |
| Body | 17-19px | 16-18px | 400-500 | Reading comfort matters |
| Small/meta | 13-15px | 13-15px | 650-800 | Eyebrows, labels, nav |

Typography rules:

- Do not scale font size with viewport width.
- Letter spacing should be `0`.
- Avoid all-caps except for tiny labels or status text.
- Use short paragraphs, not dense blocks.
- Keep the hero headline literal and benefit-led.
- Write in plain language for Dutch learners and non-technical users.
- The extension Options page uses the UI stack for controls and reading copy for explanations.
- Dutch remains visually primary; English and Telugu are helper content.

## 4. Layout Principles

The layout should be quiet and editorial, not decorative.

Use:

- large white space;
- strong black typography;
- a simple vertical page rhythm;
- full-width sections with constrained inner content;
- clear calls to action;
- real product screenshots when available.

Avoid:

- nested cards;
- gradient backgrounds;
- decorative blobs/orbs;
- beige/tan editorial palettes;
- stock-like illustrations;
- excessive rounded pill shapes;
- busy dashboards;
- marketing sections that explain the interface instead of showing it.

### Spacing

Recommended spacing scale:

```text
4, 8, 12, 16, 24, 32, 48, 72, 96, 128
```

Page max width:

```css
max-width: 1120px;
```

Reading page max width:

```css
max-width: 780px;
```

## 5. Components

### Buttons

Primary buttons:

- black background, white text by default;
- orange background only for the highest-priority action on the page;
- 8px radius maximum;
- minimum height 44px;
- bold label;
- no icons unless the icon adds meaning.

Secondary buttons:

- white background;
- black border;
- black text;
- orange background with black text on hover/focus.

Button labels should be concrete:

- `Get DutchMate`
- `Read Privacy Policy`
- `Contact`

Avoid vague labels:

- `Learn More`
- `Explore`
- `Discover`

### Navigation

Navigation should be minimal:

- brand mark and wordmark on the left;
- no more than 4 links on desktop;
- primary CTA on the right;
- collapse links on mobile until a real mobile menu is implemented.

The nav should not become a large marketing header.

### Cards

Cards may be used for repeated items only:

- feature list;
- privacy facts;
- steps;
- screenshots.

Card rules:

- 1px black border at low opacity;
- white background;
- 8px radius maximum;
- no card inside another card;
- no heavy shadows;
- orange may mark one detail, number, or accent line.

### Hero

The homepage hero must immediately communicate:

- DutchMate name or product category;
- Dutch learning while reading real websites;
- the user benefit: learn with Dutch, English, and a mother tongue close by.

Hero structure:

- left side: headline, short supporting copy, primary CTA;
- right side or full-width below: real product screenshot or product-like demo;
- no abstract gradient hero;
- no generic stock imagery.

When real screenshots are ready, prefer them over custom illustrations.

### Extension Tooltip UI

The browser tooltip should be functional before decorative:

- black text on white or white text on black;
- orange accent only for selected/highlighted source word or active state;
- stable dimensions so loading/error/success states do not jump;
- no translucent color layering that hurts readability.

### Privacy Page

Privacy content should be:

- plain and specific;
- readable in long-form;
- honest about text sent to the backend and Google Cloud Translation;
- easy to skim with clear headings.

Do not soften privacy language with vague marketing words.

## 6. Logo And Icon Direction

Approved direction: Book Bubble.

The mark should combine:

- an open book for reading and learning;
- a speech/translation bubble for quick help;
- a strong orange accent for Dutch identity.

Logo rules:

- must work at 16px, 32px, 48px, and 128px;
- must still read in one color if needed;
- no flags, windmills, or tourist stereotypes;
- no tiny letters inside the mark;
- default to black, white, and orange for all logo explorations and production assets.

The production Book Bubble icon must stay within black, white, and orange unless the design system is explicitly revised.

## 7. Imagery And Screenshots

Use real product screenshots for store and marketing whenever possible.

Screenshot rules:

- show real browser usage;
- avoid private pages and personal data;
- use clean Dutch reading examples;
- highlight the tooltip or selected text with orange;
- keep browser chrome tidy;
- avoid fake app mockups once real screenshots exist.

Illustrations should be rare. If used, they must follow the three-color system.

## 8. Motion And Interaction

Motion should be subtle and helpful:

- quick hover/focus transitions;
- no bouncing;
- no scroll-jacking;
- no animation required to understand the content.

Focus states:

- visible black outline or orange outline;
- must work with keyboard navigation.

Hover states:

- primary action can invert or deepen contrast;
- secondary action can add orange border/text.

## 9. Responsive Behavior

Mobile-first constraints:

- no horizontal scrolling;
- no tiny CTA labels;
- nav links may collapse;
- hero should stack with text first and screenshot/demo second;
- cards become a single column;
- touch targets must be at least 44px tall.

Desktop constraints:

- hero should use space confidently but leave a hint of the next section visible when possible;
- avoid oversized cards;
- keep text columns readable.

## 10. Accessibility

Accessibility is part of the visual style.

Requirements:

- high contrast by default;
- semantic HTML;
- visible focus states;
- useful alt text for meaningful images;
- decorative images should have empty alt text;
- no text embedded in images when HTML text can do the job;
- do not rely on orange alone to communicate status.

## 11. Voice And Copy

DutchMate copy should sound like a helpful maker, not a growth team.

Use:

- direct, calm sentences;
- concrete benefits;
- gentle public-release language;
- clear privacy warnings where needed.

Avoid:

- hype;
- fake urgency;
- enterprise jargon;
- manipulative conversion copy;
- claims that the product is perfect or complete.

Good examples:

```text
Learn Dutch in your own language.
Translate hovered words and selected text while you read.
No account is required for the current release.
Avoid using DutchMate on private pages if you do not want that text sent for translation.
```

## 12. Implementation Notes For Agents

When changing DutchMate UI:

1. Read this file first.
2. Use the semantic v1.1 token system from `src/design-system/`.
3. Prefer editing existing CSS/HTML over adding a new framework.
4. Use real product screenshots before decorative artwork.
5. Keep cards to repeated items only.
6. Keep border radius at 8px or less.
7. Do not add gradients, shadows, or extra colors without explicit approval.
8. Run relevant verification before committing.

## 13. Quick Agent Prompt

Use this prompt when asking an agent to update DutchMate UI:

```text
Use DESIGN.md and `docs/design-system-v1.1/` as the source of truth. Build a
clean, warm-paper DutchMate interface with strong ink and Dutch orange through
semantic tokens. Keep the layout text-first, readable, and trustworthy. Use
Nunito Sans for compact controls, Noto Sans for learning copy, and Noto Sans
Telugu for Telugu helpers. Preserve the existing extension features and
information architecture; avoid gradients, decorative blobs, unsupported
proficiency claims, and reference-only product concepts.
```

## 14. Source Inspiration

This design system was inspired by the DESIGN.md pattern and the publicly described Claude design analysis on getdesign.md, then adapted for DutchMate's v1.1 product contract, privacy needs, local-first learning model, and semantic accessibility tokens.
