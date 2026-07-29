# DutchMate Design System v1.1

## 1. Purpose and north star

DutchMate is a calm learning companion that helps a person learn Dutch while
reading real webpages. It should be quick when the learner needs only a meaning
and structured when they choose to practise.

The core learning loop is:

**Read → Notice → Practise → Keep**

Translation starts the loop. A short contextual task turns selected language
into active learning. Useful words and chunks return later through review.

The experience should be:

- Friendly, not childish.
- Editorial, not academic.
- Playful, not gamified.
- Confident, not loud.
- Educational by construction, not by decoration.

## 2. Product architecture

### 2.1 Primary destinations

The toolbar popup has exactly three primary tabs:

1. **Today** — a focused daily summary, Daily Five, items ready for review, and
   a contextual next lesson.
2. **Lessons** — curated, progressive learning organised around useful
   situations and grammar patterns.
3. **Saved** — intentionally saved words and meaningful chunks, with review
   entry points.

Quick Settings is a secondary header action. Full settings and data management
belong in Options.

### 2.1.1 Preservation contract

This design system is a visual and interaction-language retrofit, not a
replacement UI. The current DutchMate repository is authoritative for existing
buttons, sections, heatmaps, controls, flows, state, storage, and behavior.

Before implementation, inventory every visible element and interaction and
create a preservation matrix. Preserve each item by default. Removing, merging,
relocating, renaming, or behaviorally changing an existing item requires an
explicitly approved product change. An element omitted from a reference
clickthrough is still in scope for visual adaptation and must not disappear.

Conversely, an element shown only in a reference clickthrough is a product
proposal, not permission to add a new feature during the visual retrofit. The
first implementation pass applies the system to the product that exists
one-to-one. New flows require separate product approval.

Do not create separate top-level tabs for Grammar, Verb Gym, Sentence Forge,
Review, or Settings. Grammar Minute, Verb Gym, and Sentence Forge are exercise
mechanics inside lessons, Daily Five, or contextual practice.

### 2.2 Surface roles

| Surface | Primary job | Interaction rule |
| --- | --- | --- |
| Toolbar popup | Daily learning and saved vocabulary | Fixed 390 × 600 px; one main action per state |
| Webpage tooltip | Translate selected/hovered content | Fast meaning first; optional save or practice |
| Context Mission | Rebuild or retrieve Dutch in page context | Translate → Practise → Return |
| Options page | Preferences, languages, privacy, import/export | Calm full-page form; autosave where safe |
| Public website | Explain DutchMate and build trust | Use the same brand and tokens, not a separate visual identity |

### 2.3 Focused work

Starting Daily Five, a lesson, or a Context Mission creates a focused state:

- Hide normal popup tabs when they would distract.
- Keep a visible **Exit** or **Back to page** action.
- Preserve progress if the learner exits accidentally where feasible.
- Restore keyboard focus to the triggering control when closing overlays.
- Return the learner to reading quickly after completion.

## 3. Learning model

### 3.1 Lesson rail

Every lesson follows:

1. **Read** — encounter a short useful story, dialogue, or sentence.
2. **Notice** — highlight one pattern and explain only what is needed.
3. **Practise** — retrieve, reorder, transform, or select in controlled tasks.
4. **Keep** — save a reusable word, chunk, or pattern and schedule later review.

Grammar should be embedded in meaningful language. A lesson can contain a
“Grammar Minute,” Verb Gym transformation, or Sentence Forge rebuild, but the
learner should always understand what communicative task the form serves.

### 3.2 Deterministic content

Production v1 uses curated content, templates, explicit answer sets, and
deterministic validation. It does not require a runtime LLM.

Correct answers, accepted variants, feedback, hints, and helper translations
must be authored or reviewed. Do not present machine confidence as correctness.

### 3.3 Evidence language

Use:

- **New** — encountered but not tested.
- **Learning** — needs supported retrieval.
- **Familiar** — recognised in recent encounters.
- **Secure** — repeated recall evidence over time.

These labels describe evidence in DutchMate. They are not CEFR levels or claims
of fluency. Recognition and recall evidence should remain distinguishable in
the data model.

### 3.4 Honest engagement

Allowed:

- Warm copy and small moments of delight.
- Useful daily scope such as “3 words ready.”
- Visible completion within a short session.
- Re-entry based on items that genuinely need practice.

Avoid:

- Points, lives, confetti, or badges without learning meaning.
- Guilt-driven streaks.
- “You are fluent” or CEFR claims based on app activity.
- Artificial urgency or infinite review loops.

## 4. Brand

### 4.1 Brand idea

The mark is a DutchMate “D” shaped as a speech card. It combines language,
reading, and a helpful companion in one compact tile.

The speech-card tail must remain clearly recognizable at toolbar sizes. Version
1.1 enlarges the tail while keeping the D silhouette and counter intact.

Assets:

- `brand/dutchmate-mark.svg` — browser toolbar, favicon, compact product use.
- `brand/dutchmate-wordmark.svg` — text-only brand use.
- `brand/dutchmate-lockup.svg` — preferred documentation, Options header,
  website, and store use.
- `brand/png/` — raster mark exports from 16 to 128 px.

### 4.2 Mark rules

- Minimum digital size: 16 × 16 px.
- Clear space: at least one quarter of the mark width.
- Keep the orange tile, dark D, and paper counter together.
- Do not recolour, outline, rotate, stretch, or add a drop shadow.
- Use the mark, not the full wordmark, in the browser toolbar.
- Verify icon legibility in both light and dark browser chrome.

The wordmark SVG uses Nunito Sans when available and a rounded/system fallback
otherwise. For fixed store artwork, render with the approved font installed or
convert the text to outlines during export.

### 4.3 Iconography

- 24 px default canvas.
- 1.8 px rounded stroke.
- Simple outline icons for actions and navigation.
- Use filled shapes only for state emphasis, selected controls, or the brand.
- Icons supplement labels; do not replace unfamiliar action labels.
- Keep decorative icon sets out of focused learning screens.

### 4.4 Voice

Write like a patient, capable learning companion:

| Use | Avoid |
| --- | --- |
| “Try once more.” | “Incorrect!” |
| “3 words ready.” | “You’re fluent!” |
| “Show meaning.” | “Reveal answer immediately!” |
| “Back to page.” | “Quit mission.” |
| “That order works.” | “Perfect mastery!” |

Feedback must explain the next useful action. Do not shame, exaggerate, or add
cheerfulness where the learner needs clarity.

## 5. Colour

The primary visual language is warm paper, strong ink, and one unmistakable
orange.

| Token | Value | Role |
| --- | --- | --- |
| `brand-orange` | `#FF6B00` | Brand tile, primary fill, progress, emphasis |
| `brand-orange-deep` | `#9C3900` | Accessible orange text accent |
| `ink-strong` | `#1B1714` | Main text, dark surfaces, strong borders |
| `ink-muted` | `#675C54` | Secondary text |
| `paper` | `#FFF9F2` | Main background |
| `paper-raised` | `#FFFFFF` | Cards and form surfaces |
| `paper-soft` | `#F8EEE4` | Quiet grouped surfaces |
| `line` | `#D8CABE` | Borders and dividers |
| `success` | `#2F6B4F` | Confirmed result |
| `warning` | `#7A5100` | Supported retry or attention |
| `danger` | `#9D2A2A` | Destructive or blocking error |
| `info` | `#275C7D` | Neutral informational state |

Rules:

- Do not use bright Brand Orange for small text on paper.
- Use Deep Orange for orange text or Ink Strong on an orange-filled control.
- Feedback cannot rely on colour alone; pair it with text and/or an icon.
- Use borders and paper layers for most structure. Shadows are secondary.
- Re-test contrast after changing any token.

Verified reference contrast ratios:

- Ink Strong on Paper: **17.03:1**.
- Ink Muted on Paper: **6.21:1**.
- Deep Orange on Paper: **6.70:1**.
- Ink Strong on Brand Orange: **6.24:1**.

## 6. Typography

| Role | Family | Reference style |
| --- | --- | --- |
| UI and brand | Nunito Sans, rounded/system sans fallback | Friendly, compact, high-weight headings |
| Dutch/English learning text | Noto Sans, system sans fallback | Clear reading and diacritics |
| Telugu helper | Noto Sans Telugu, Nirmala UI fallback | Correct Telugu shaping |

Reference ramp:

| Style | Size / line height | Weight | Use |
| --- | --- | --- | --- |
| Display | 48 / 50 px | 900 | Large design-system or website statement |
| Popup H1 | 32 / 36 px | 900 | Primary popup screen title |
| Learning H2 | 22 / 28 px | 700–800 | Dutch pattern or prompt |
| Body | 16 / 24 px | 400–600 | Reading and explanations |
| Telugu helper | 16 / 26 px | 400–600 | Telugu translation/helper |
| Label | 12 / 16 px | 800–900 | Kicker, state, compact metadata |
| Small | 11 / 15 px minimum | 600–800 | Secondary metadata only |

Dutch must be visually primary. English and Telugu helpers are quieter but
remain legible. Do not shrink helper languages below readable sizes.

## 7. Layout, spacing, radius, depth, and motion

Spacing follows a 4 px base:

`4, 8, 12, 16, 24, 32, 48`

Radii:

- Controls: 10 px.
- Cards: 16 px.
- Panels and large feature surfaces: 24 px.
- Pills: 999 px.

Depth:

- Low shadow: floating cards and tooltip only.
- High shadow: modal-like reference surfaces only.
- Prefer a 1 px border and paper-layer contrast over extra shadows.

Motion:

- 120 ms: hover, press, and colour changes.
- 180 ms: reveal, expand, and tab change.
- 260 ms: focused card entrance.
- Motion explains a state change; it is not a reward.
- Respect `prefers-reduced-motion: reduce`.
- Never animate failure or cause layout movement that interrupts reading.

## 8. Components

### 8.1 Controls

- Minimum interactive target: 44 × 44 px.
- One primary action per card or focused step.
- Primary button: Brand Orange fill, Ink Strong text/border.
- Secondary button: raised paper, Ink Strong text/border.
- Quiet button: transparent, clear text underline or equivalent affordance.
- Danger button: raised paper, Danger text/border; require confirmation for
  destructive data actions.
- Disabled states remain readable and are not the only indication of loading.

### 8.2 Navigation

- Popup tabs: Today, Lessons, Saved.
- Selected tab needs text, visual emphasis, and an accessible current/selected
  state.
- Focused headers replace tabs during lessons/review and keep Exit visible.
- Options uses a responsive section navigation; on narrow screens it can become
  a select/disclosure.

### 8.3 Learning components

- Learning card: state label, Dutch prompt, concise instruction, optional helper.
- Meaning reveal: learner-initiated and visually secondary to Dutch.
- Feedback: “works” or “try again,” followed by one specific reason or hint.
- Progress: current scope such as “3 of 5,” never an unsupported ability score.
- Skill evidence: counts or states tied to recorded recognition/recall.
- Sentence fragments must be keyboard-operable; do not require drag and drop.

### 8.4 System states

Every surface must cover:

- Empty.
- Loading.
- Ready.
- Offline/provider unavailable.
- Recoverable error.
- Destructive confirmation.
- Saved/success feedback.
- Keyboard focus.

Avoid dead ends. A failure state should retain the learner’s input when safe and
offer a clear retry or exit.

## 9. Reference flows

### 9.1 Today and Daily Five

1. Open popup on Today.
2. Show a small honest summary and one recommended action.
3. Preserve the existing learning-rhythm card with Week, Month, and Year views,
   previous/next period navigation, day descriptions, legend, and explanatory
   copy. Week/Month retain calendar dates and recorded activity totals per day;
   Year remains a compact activity heatmap.
4. Start Daily Five.
5. Enter a focused review state.
6. Reveal meaning only when requested.
7. Record the learner’s response using explicit recognition/recall semantics.
8. Finish with factual completion and a return to Today.

### 9.2 Lessons

1. Open Lessons.
2. Show curated progression and the next useful lesson.
3. Open the lesson in focused mode.
4. Move through Read, Notice, Practise, Keep.
5. Save the useful chunk/pattern.
6. Return to Lessons or Today.

### 9.3 Saved

- Show intentionally saved words and chunks.
- Include helper meaning and evidence state.
- Offer a bounded “Quiz 5 saved items” action.
- Put export/import and destructive data controls in Options.

### 9.4 Translation and Context Mission

1. Translate selected/hovered Dutch quickly.
2. Show Dutch first, then English and optional Telugu helpers.
3. Offer Save and **Practise this**.
4. Reuse the page sentence for a deterministic rebuild/retrieval task.
5. Give immediate, specific feedback.
6. Return to the page and restore focus/context.

Context practice should not make an extra provider call when the selected text
and curated/template logic are sufficient.

### 9.5 Options

Suggested sections:

- General.
- Languages.
- Translation.
- Learning & data.
- Privacy.

Changes may autosave when reversible. Import, export, reset, or delete actions
must make scope and consequences explicit. State that settings and learning
records remain in browser storage and that browsing history is not retained.

The popup does not duplicate the Options page. Popup Settings contains only the
existing frequent review preferences—**Show page context** and **Daily review
badge**—plus **Open Options page**. All language, translation behavior,
provider, privacy, cache, import/export, and destructive data controls remain
on the full browser Options page. Preserve every existing Options control and
its storage semantics; the section list above is an organizational design, not
permission to invent or delete settings.

## 10. Accessibility quality bar

Required:

- 44 × 44 px targets for primary controls and lesson choices.
- 3 px visible focus ring with 2 px offset.
- Logical DOM/tab order.
- Escape closes webpage coaching cards.
- Focus moves into overlays and returns to the trigger on close.
- No drag-only, colour-only, hover-only, or audio-only interactions.
- Results and important state changes use polite live announcements.
- Popup and learning flows remain usable at 200% zoom.
- Options remains usable at 400% zoom/reflow.
- Correct labels, roles, selected/current states, and error associations.
- Reduced motion removes transitions without hiding state.
- Touch interaction does not depend on hover.
- English/Telugu helpers retain correct language metadata where practical.

Target WCAG 2.2 AA. Contrast ratios in this file are references, not a
substitute for testing the final rendered combinations.

## 11. Implementation strategy

Implement in this order:

1. Semantic tokens, fonts, focus, and reduced-motion rules.
2. Shared primitives: buttons, tabs, cards, fields, feedback, progress, states.
3. Popup shell and Today/Lessons/Saved.
4. Focused Daily Five and lesson rail.
5. Tooltip and Context Mission.
6. Options and website.
7. Brand/icon replacement.
8. Regression, accessibility, browser packaging, and data-persistence QA.

Preserve current functionality, visible UI, and storage contracts. If a schema
must change, write a tested migration. Avoid a visually complete rewrite that
breaks or removes translation, activity heatmaps, review scheduling, provider
handling, import/export, or Firefox packaging.

## 12. Definition of done

The system is implemented only when:

- All major surfaces use the shared semantic tokens.
- Brand assets are correct at extension icon sizes.
- Popup navigation and focused flows match the specified architecture.
- Existing functional behavior and stored user data are preserved.
- Every pre-existing visible element and interaction is accounted for in a
  preservation matrix and regression-tested.
- Deterministic learning flows work without an LLM.
- Keyboard, zoom, reduced motion, screen-reader semantics, and touch targets
  pass.
- Empty/loading/error/offline/destructive states are covered.
- Tests, browser-extension build/package checks, and manual clickthroughs pass.
- Intentional deviations are documented with a concrete reason.
