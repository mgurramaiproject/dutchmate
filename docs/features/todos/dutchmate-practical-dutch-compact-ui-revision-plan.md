# DutchMate Practical Dutch — Compact UI/UX Revision Plan

**Working name:** Practical Dutch Compact Pass  
**Target:** DutchMate browser-extension popup  
**Purpose:** Make Practical Dutch packs and lessons substantially denser, easier to scan, and less scroll-heavy while preserving DutchMate’s existing visual language and lesson architecture.

---

## 1. Problem statement

The current implementation is visually consistent with DutchMate, but it spends too much vertical space on repeated labels, oversized headings, explanatory copy, generous card padding, and repeated translation controls.

Two screens need revision:

1. **Practical Dutch pack list**
   - A single pack occupies most of the visible page.
   - Pack metadata and lesson metadata repeat information.
   - The required three-line structure is lost inside nested cards.

2. **Lesson player**
   - The shell consumes too much height before lesson content begins.
   - The lesson title is oversized for a 390 × 600-ish popup.
   - Every sentence gets its own “Show English and Telugu” link and large separator spacing.
   - The screen has multiple stacked navigation layers: app header, exit action, stage tabs, content card, and bottom navigation.
   - The content area is narrower and taller than necessary because of nested card padding.

---

## 2. Goals

### Primary goals

- Render each Practical Dutch pack as **exactly three visible rows**:
  1. Pack heading
  2. A1 lesson
  3. A2 lesson
- Remove nonessential text from the pack list.
- Fit the initial **Read** step inside one popup viewport whenever the authored content is short enough.
- Reduce scrolling across all lesson stages.
- Keep only one intentional vertical scrolling region.
- Preserve the current DutchMate design system, bottom navigation, content model, progress state, and four-stage lesson flow.

### Non-goals

- Do not redesign the entire Lessons tab.
- Do not introduce a new visual language, font, colour palette, or navigation pattern.
- Do not change lesson content or pedagogy unless needed to remove duplicated UI copy.
- Do not merge A1 and A2 into one lesson.
- Do not remove the `Read → Notice → Practise → Keep` progression.
- Do not add animations, gamification, or new data services.
- Do not create desktop-width layouts; optimise for the current popup first.

---

## 3. Design-system constraints

Codex must inspect and reuse the repository’s existing:

- colour tokens, especially DutchMate orange, near-black, cream/off-white, border colours, and muted text;
- typography scale and font families;
- border radii;
- button, card, segmented-control, badge, header, and bottom-navigation components;
- focus, hover, selected, completed, and disabled states;
- spacing tokens.

Implementation rules:

- Prefer existing components with a compact variant over one-off CSS.
- Do not hard-code new colours when a token exists.
- Do not add drop shadows unless an existing equivalent component already uses them.
- Preserve the current strong black outline, orange accent, cream background, and uppercase eyebrow treatment.
- Keep touch targets at least **44 × 44 CSS px**, even where the visible row is visually compact.
- Use semantic HTML and existing accessibility utilities.
- Treat the sizes below as target ranges; map them to the closest existing design tokens.

---

## 4. Revised information hierarchy

### Pack-list hierarchy

Keep only information needed to choose a lesson:

1. Pack name
2. A1 lesson title and state
3. A2 lesson title and state

Remove from the pack card:

- category eyebrow such as `SHOPPING AND CAFES`;
- pack description such as `Find products and ask politely for information.`;
- `Choose a level`;
- lesson duration;
- duplicated `Completed · restart` text;
- separate nested rounded cards around each level, if a simple divided row can carry the interaction;
- oversized page introduction when only one or a few packs are present.

The page can retain:

- `Practical Dutch` as the page title;
- one short supporting sentence only when it adds value across all packs;
- back navigation;
- bottom navigation.

### Lesson-player hierarchy

The visible priority should be:

1. Current stage
2. Lesson title
3. Learning content
4. Optional support translations
5. Exit and secondary metadata

Do not give equal visual weight to the app shell, exit action, stage navigation, lesson title, and content card.

---

## 5. Screen A — Compact Practical Dutch pack list

### 5.1 Required three-row pack component

Each pack must use this structure:

```text
┌─────────────────────────────────────────┐
│ Supermarket and shopping                │  ← row 1
├─────────────────────────────────────────┤
│ A1  Find products and pay          ✓  › │  ← row 2
├─────────────────────────────────────────┤
│ A2  Ask for product information    ✓  › │  ← row 3
└─────────────────────────────────────────┘
```

### 5.2 Row specification

#### Row 1 — pack heading

Contents:

- pack title only;
- optional pack completion indicator at the far right only when useful, for example `2/2`;
- no category, description, or instruction.

Target visual treatment:

- height: approximately 40–44 px;
- horizontal padding: 12–14 px;
- title: 15–16 px, bold;
- orange left accent may remain if it is part of the existing pack-card pattern;
- bottom border separates the heading from lessons.

#### Rows 2 and 3 — lesson rows

Contents:

- compact A1/A2 badge;
- lesson title;
- one status affordance;
- chevron.

Status rules:

- Not started: no text; chevron only.
- In progress: small `Continue` status or progress marker.
- Completed: check icon; tapping opens the completed lesson or restart flow.
- Do not show duration in the list.
- Do not show `Completed · restart` as persistent body text.

Target visual treatment:

- height: 48–52 px;
- badge: approximately 30–34 px square;
- title: 14–15 px, semibold, one line;
- truncate only if the title cannot fit after reducing nonessential metadata;
- divider between rows;
- entire row is clickable.

### 5.3 Page-header reduction

Current:

```text
LESSONS · PRACTICAL DUTCH
Practical Dutch
Choose a situation pack, then start at A1 or A2.
```

Recommended:

```text
← Lessons
Practical Dutch
```

Optional supporting sentence:

```text
Choose an A1 or A2 lesson.
```

Use it only if usability testing shows the level badges are not self-explanatory. It should not be repeated inside every pack.

### 5.4 Multiple-pack behaviour

- Stack three-row pack components with an 8–12 px gap.
- Do not wrap all packs in another outer card.
- Keep the page itself scrollable when the number of packs exceeds the viewport.
- Do not create independent scrolling inside a pack.

---

## 6. Screen B — Compact lesson shell

### 6.1 Remove the dedicated “Exit lesson” row

Replace the standalone centred `Exit lesson` link with one of these existing-system-compatible patterns, in this preference order:

1. A compact back/close action in the lesson header:
   ```text
   ×  Supermarket and shopping       A1
   ```
2. Reuse the existing back-navigation pattern:
   ```text
   ← Practical Dutch                 A1
   ```
3. Keep `Exit` as a small text action at the right side of the lesson header.

Do not allocate a full vertical row solely to `Exit lesson`.

### 6.2 Compact stage navigation

Preserve the four stages, but reduce the segmented control height.

Recommended:

```text
READ      NOTICE      PRACTISE      KEEP
```

Rules:

- control height: 36–40 px;
- no extra outer margin above and below beyond the existing spacing token;
- selected state uses the existing near-black fill and white text;
- inactive states use the existing background and border;
- labels remain text, not icons;
- stage navigation may be sticky below the app/lesson header;
- do not show both a separate progress stepper and these tabs.

### 6.3 One scroll container

Use this structure:

```text
App header or compact lesson header       fixed/sticky
Stage navigation                          sticky
Main stage content                        only scroll region
Bottom navigation                         fixed
```

Avoid:

- a scrollable card inside a scrollable page;
- hidden overflow that cuts off keyboard focus;
- separate scrolling columns;
- the bottom navigation covering the final content.

Reserve bottom padding in the main content equal to the bottom-navigation height plus one spacing token.

### 6.4 Reduce outer content framing

The current large rounded card adds top border, outer margin, and internal padding before the first sentence.

Recommended:

- use the page background as the primary surface;
- retain one compact bordered content panel only if this is a strong existing DutchMate pattern;
- reduce panel padding to approximately 12–14 px;
- reduce top radius or heavy top border only through an existing compact card variant;
- do not nest sentence cards inside the main content card.

---

## 7. Read-stage redesign

### 7.1 Compact title block

Current:

```text
READ THE SITUATION

A1 · Waar vind ik
dit?
```

Recommended:

```text
READ · A1
Waar vind ik dit?
```

Target treatment:

- eyebrow/meta line: 11–12 px, uppercase, orange;
- title: 20–22 px, bold, maximum two lines;
- title bottom margin: 10–12 px;
- do not use a 30+ px heading inside the popup.

The title should remain meaningful, but should not dominate half the screen.

### 7.2 Translation control

Replace the repeated per-sentence link:

```text
Show English and Telugu
```

with one stage-level compact control:

```text
Translations: Off        [EN] [TE]
```

or, using current button patterns:

```text
Show translations
```

When activated, display the user’s enabled support languages beneath every Dutch sentence.

Recommended behaviour:

- Default to the user’s existing translation-display preference.
- One control affects all sentences in the current Read stage.
- Remember the preference across Practical Dutch lessons if this matches existing DutchMate settings behaviour.
- Keep an accessible label such as `Show English and Telugu translations`.
- Avoid repeating the same link after every sentence.

### 7.3 Sentence-list structure

Collapsed translations:

```text
Ik ben in de supermarkt en zoek rijst.

Ik zie een medewerker bij de ingang.

Ik vraag waar ik de rijst kan vinden.
```

Expanded translations:

```text
Ik ben in de supermarkt en zoek rijst.
EN  I am in the supermarket and I am looking for rice.
TE  …

Ik zie een medewerker bij de ingang.
EN  I see an employee near the entrance.
TE  …

Ik vraag waar ik de rijst kan vinden.
EN  I ask where I can find the rice.
TE  …
```

Rules:

- Dutch sentence: 16–17 px, regular/medium;
- sentence block vertical padding: 8–10 px;
- use a subtle divider or spacing, not both a large gap and a divider;
- translation text: 12–13 px, muted but readable;
- `EN` and `TE` are compact language labels;
- do not wrap each sentence in a card;
- do not repeat a translation button per sentence;
- sentence blocks should remain tappable only when there is a defined interaction.

### 7.4 Fit target for Read

For a lesson with:

- title of one or two lines;
- three Dutch sentences;
- translations collapsed;

the complete Read stage should fit without scrolling in the standard popup viewport.

Translations may require scrolling when expanded. This is acceptable because it is user-requested secondary content.

### 7.5 Long-content fallback

Do not shrink text below the design system’s readable minimum just to avoid scrolling.

When authored content is longer:

- keep the same compact hierarchy;
- allow the single main content region to scroll;
- preserve stage tabs and bottom navigation;
- never clip content;
- never use horizontal scrolling.

---

## 8. Notice, Practise, and Keep compactness rules

The screenshots show Read, but the compact pass must cover the complete lesson so the stages do not feel inconsistent.

### 8.1 Notice

- One compact learning-point heading.
- One or two example rows visible at a time.
- Put explanations below the example, not in separate large cards.
- Collapse optional EN/TE support using the same shared translation control.
- Remove repeated instructions when the interaction itself is obvious.
- Prefer inline highlights for target words over additional legend boxes.

Example:

```text
NOTICE · Asking where something is

Waar vind ik de rijst?
Where can I find the rice?

Pattern
Waar vind ik + noun?
```

### 8.2 Practise

- Put the prompt and answer area in the first viewport.
- Use compact answer rows/buttons with 44 px touch height.
- Show progress in the stage label or one compact line, for example `2 of 4`.
- Do not use a large exercise title plus a second instruction paragraph.
- Keep feedback close to the selected answer.
- After answering, replace or expand the answer area instead of pushing a large feedback card below it.
- Avoid auto-scrolling unless the next actionable control would otherwise be hidden.

### 8.3 Keep

- Summarise no more than three takeaways.
- Use one compact completion state.
- Primary action: `Done` or `Back to Practical Dutch`.
- Secondary action: `Practise again`.
- Do not repeat the full lesson title, pack description, level, duration, and completion message.
- Show earned/progress information only if it already exists in the product model.

---

## 9. Recommended component changes

Names below are illustrative. Codex must map them to the repository’s actual architecture.

### 9.1 Add or extend compact variants

- `PracticalPackCard`
  - new three-row layout;
  - pack heading plus two lesson rows;
  - no nested cards.

- `LessonRow`
  - `level`;
  - `title`;
  - `status`;
  - `onOpen`;
  - compact variant.

- `LessonShell`
  - compact header;
  - sticky stage navigation;
  - one main scroll container;
  - safe bottom padding.

- `LessonStageTabs`
  - compact height variant;
  - accessible tab semantics;
  - keyboard navigation.

- `StageHeader`
  - `stage`;
  - `level`;
  - `title`;
  - compact typography.

- `TranslationToggle`
  - stage-level toggle;
  - enabled language list;
  - persistence hook.

- `SentenceList` / `SentenceRow`
  - Dutch-first hierarchy;
  - conditional EN/TE rendering;
  - compact dividers and spacing.

### 9.2 Avoid duplicate components

Before adding a component, search for equivalents used in:

- Today cards;
- Verb Journey matrices and detail panels;
- Lessons hub;
- Saved list rows;
- existing segmented controls;
- settings toggles.

Prefer extracting a shared compact row/card variant when two or more features already need it.

---

## 10. Data and state changes

The visual redesign should not require a lesson-content migration.

Expected UI state:

```ts
type PracticalLessonUiState = {
  activeStage: "read" | "notice" | "practise" | "keep";
  translationsVisible: boolean;
  enabledSupportLanguages: Array<"en" | "te">;
};
```

Guidance:

- Reuse the user’s existing support-language settings.
- Store only the display preference if an existing preference system is available.
- Do not duplicate lesson-completion state.
- Keep A1/A2 status derived from the existing progress model.
- If restarting a completed lesson currently requires confirmation, trigger that confirmation after opening the row; do not show `restart` permanently in the pack list.

---

## 11. Detailed implementation sequence

### Phase 1 — Repository audit

1. Locate the current Practical Dutch route/view and its pack and lesson components.
2. Identify design tokens and reusable primitives.
3. Identify the popup’s effective content height at supported browser zoom levels.
4. Record current states:
   - not started;
   - in progress;
   - completed;
   - restart;
   - translations hidden/shown;
   - each lesson stage.
5. Capture baseline screenshots for visual comparison.
6. Confirm whether the app shell and bottom navigation are fixed or sticky.
7. Confirm there is no existing nested-scroll dependency.

Deliverable: short implementation note in the PR description; no design-system replacement.

### Phase 2 — Compact pack list

1. Replace nested level cards with two divided lesson rows.
2. Remove category, description, `Choose a level`, duration, and persistent restart copy.
3. Reduce page intro to back link plus title.
4. Preserve keyboard and pointer interactions across the full lesson row.
5. Add visual states for in-progress and completed lessons.
6. Verify three visible rows per pack at all supported popup widths.

### Phase 3 — Compact lesson shell

1. Move exit/back into the compact lesson header.
2. Reduce stage-tab height and spacing.
3. Establish one main scroll container.
4. Ensure fixed/sticky elements do not overlap content.
5. Reduce outer card padding and margins using existing tokens.
6. Add safe-area/bottom-navigation padding.

### Phase 4 — Read stage

1. Merge stage, level, and title into one compact header block.
2. Replace per-sentence translation links with one shared toggle.
3. Render sentences as a compact divided list.
4. Use conditional EN/TE rows.
5. Persist translation visibility through the existing settings/storage layer where appropriate.
6. Confirm a standard three-sentence lesson fits without scrolling with translations collapsed.

### Phase 5 — Remaining stages

1. Apply the same compact shell and heading to Notice, Practise, and Keep.
2. Remove duplicated instructions and large metadata blocks.
3. Keep exercise controls at accessible touch sizes.
4. Keep feedback local to the exercise.
5. Make the completion screen concise.

### Phase 6 — Polish and regression testing

1. Run unit, integration, accessibility, and visual checks.
2. Test browser zoom at 80%, 100%, 125%, and 150%.
3. Test long lesson names and translated text expansion.
4. Test keyboard-only flow.
5. Test screen-reader tab semantics and translation toggle announcements.
6. Test completed/restart and interrupted/continue flows.
7. Compare before/after viewport usage.

---

## 12. Acceptance criteria

### Pack list

- [ ] Every pack has exactly three primary visible rows: one pack heading and two lesson rows.
- [ ] The pack card contains no category eyebrow, description, `Choose a level`, or duration.
- [ ] A1 and A2 rows remain understandable without explanatory copy.
- [ ] Each complete row is clickable and keyboard operable.
- [ ] Completed state is represented compactly, without persistent `Completed · restart`.
- [ ] At the reference popup width, lesson titles remain readable and do not collide with status or chevron.
- [ ] Existing colours, typography, borders, radii, and interaction states are reused.

### Lesson shell

- [ ] There is no standalone full-width `Exit lesson` row.
- [ ] Stage navigation remains visible and uses the existing selected-state styling.
- [ ] Only the main lesson-content region scrolls.
- [ ] Bottom navigation never covers content or controls.
- [ ] No nested vertical scrollbars are introduced.
- [ ] All interactive targets remain at least 44 × 44 CSS px.

### Read stage

- [ ] `READ`, level, and lesson title form one compact header block.
- [ ] The title uses a popup-appropriate size and does not dominate the viewport.
- [ ] There is one translation control for the entire stage.
- [ ] No sentence repeats `Show English and Telugu`.
- [ ] Three Dutch sentences fit in the initial viewport with translations collapsed, using the reference lesson and standard popup size.
- [ ] Expanded translations are clearly labelled EN/TE and remain readable.
- [ ] Long content scrolls in the main region without clipping or horizontal overflow.

### Other stages

- [ ] Notice, Practise, and Keep use the same compact shell and spacing rhythm.
- [ ] Exercise instructions are not duplicated.
- [ ] Feedback appears near the action that produced it.
- [ ] Keep contains a concise summary and clear primary/secondary actions.

### Regression

- [ ] Lesson progress and completion behaviour are unchanged.
- [ ] A1/A2 routing is unchanged.
- [ ] Translation content and support-language selection are unchanged.
- [ ] Today, Saved, Verb Journeys, and other Lessons screens are visually unaffected unless a shared component intentionally receives a compatible compact variant.
- [ ] Firefox and Chromium popup layouts pass smoke tests.

---

## 13. Test plan

### Unit tests

- Pack heading and exactly two lesson rows render from pack data.
- Correct status icon/label is selected for each progress state.
- Translation toggle shows/hides all support translations.
- Translation preference reads/writes through the expected storage adapter.
- Stage navigation sets the active stage.
- Completed lesson open/restart behaviour remains correct.

### Component tests

- Long titles truncate or wrap according to the specification.
- Lesson row remains fully clickable.
- Keyboard activation works with Enter and Space.
- Tabs expose correct `role`, selected state, and focus order.
- Hidden translations are not exposed as visible content.
- Expanded EN/TE content uses correct language labels.

### Integration tests

- Open Lessons → Practical Dutch → A1 → move through all four stages → complete.
- Resume an in-progress lesson.
- Open a completed lesson and restart through the existing confirmation flow.
- Toggle translations, leave the lesson, and verify the intended persistence.
- Switch between A1 and A2.
- Return to pack list and verify status update.

### Visual regression states

Capture at minimum:

1. Pack list — not started
2. Pack list — A1 complete, A2 in progress
3. Read — translations hidden
4. Read — EN and TE shown
5. Notice
6. Practise — unanswered
7. Practise — correct feedback
8. Practise — incorrect feedback
9. Keep/completed
10. Long-title and long-translation stress case

---

## 14. Viewport and density metrics

Use measurements rather than subjective “looks compact” review.

For the reference popup:

- Pack-card target height: approximately **140–155 px** for all three rows.
- Page content should show at least two pack headings/entries or one full pack plus meaningful space for the next item, depending on available packs.
- Lesson chrome above content should be reduced substantially from the current implementation.
- Read stage with three Dutch sentences and hidden translations should require **0 px user scroll** where viewport height permits.
- No text smaller than the current design system’s accessible small-text token.
- Do not reduce touch-target height to achieve density.

Record before/after screenshots and approximate vertical-pixel savings in the PR.

---

## 15. Copy specification

### Pack list

Use:

```text
Practical Dutch

Supermarket and shopping
A1  Find products and pay
A2  Ask for product information
```

Remove:

```text
LESSONS · PRACTICAL DUTCH
Choose a situation pack, then start at A1 or A2.
SHOPPING AND CAFES
Find products and ask politely for information.
Choose a level
6 min
Completed · restart
```

A single short page helper may remain only if validated as necessary:

```text
Choose an A1 or A2 lesson.
```

### Lesson Read stage

Use:

```text
READ · A1
Waar vind ik dit?

Show translations
```

Do not repeat:

```text
READ THE SITUATION
Show English and Telugu
```

after every sentence.

---

## 16. Compact reference wireframes

### Pack list

```text
┌─────────────────────────────────────────┐
│ ← Lessons                               │
│ Practical Dutch                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Supermarket and shopping            │ │
│ ├─────────────────────────────────────┤ │
│ │ A1  Find products and pay       ✓ › │ │
│ ├─────────────────────────────────────┤ │
│ │ A2  Ask for product information  ◐ ›│ │
│ └─────────────────────────────────────┘ │
│                                         │
│             bottom navigation           │
└─────────────────────────────────────────┘
```

### Read — translations hidden

```text
┌─────────────────────────────────────────┐
│ ← Practical Dutch                  A1   │
│ READ      NOTICE      PRACTISE     KEEP │
├─────────────────────────────────────────┤
│ READ · A1                               │
│ Waar vind ik dit?                       │
│                         Show translations│
│─────────────────────────────────────────│
│ Ik ben in de supermarkt en zoek rijst.  │
│─────────────────────────────────────────│
│ Ik zie een medewerker bij de ingang.    │
│─────────────────────────────────────────│
│ Ik vraag waar ik de rijst kan vinden.   │
│                                         │
│             bottom navigation           │
└─────────────────────────────────────────┘
```

### Read — translations shown

```text
┌─────────────────────────────────────────┐
│ ← Practical Dutch                  A1   │
│ READ      NOTICE      PRACTISE     KEEP │
├─────────────────────────────────────────┤
│ READ · A1                               │
│ Waar vind ik dit?       Hide translations│
│─────────────────────────────────────────│
│ Ik ben in de supermarkt en zoek rijst.  │
│ EN  I am in the supermarket and ...     │
│ TE  ...                                 │
│─────────────────────────────────────────│
│ Ik zie een medewerker bij de ingang.    │
│ EN  I see an employee near the entrance.│
│ TE  ...                                 │
│ ...                                     │
│             bottom navigation           │
└─────────────────────────────────────────┘
```

---

## 17. Codex execution instructions

1. Work in a dedicated feature branch from the current main branch.
2. Inspect the repository before deciding component/file names.
3. Preserve the existing design system and architecture.
4. Implement the smallest compatible component changes first.
5. Do not replace shared components globally unless all current usages are verified.
6. Keep each logical phase in a reviewable commit.
7. Add or update tests with each phase.
8. Capture before/after screenshots at the reference popup dimensions.
9. Run the repository’s formatter, linter, type checks, unit tests, integration tests, and browser-extension build.
10. Report:
    - files changed;
    - reused components/tokens;
    - new variants introduced;
    - tests added;
    - viewport-height savings;
    - any remaining content that still requires scrolling and why.

### Suggested commit sequence

1. `refactor(practical-dutch): add compact pack rows`
2. `refactor(practical-dutch): compact lesson shell`
3. `feat(practical-dutch): add stage-level translation toggle`
4. `refactor(practical-dutch): compact lesson stages`
5. `test(practical-dutch): cover compact layouts and flows`
6. `docs(practical-dutch): add before-after screenshots`

---

## 18. Definition of done

The revision is done when a user can:

- recognise a pack and open A1 or A2 from a three-row component;
- understand progress without reading extra metadata;
- enter a lesson without losing a large part of the viewport to navigation chrome;
- read a normal three-sentence scene without scrolling when translations are hidden;
- reveal all enabled translations with one action;
- move through Read, Notice, Practise, and Keep in a consistent compact layout;
- complete or restart a lesson with no regression in progress state;
- use the complete flow by mouse, keyboard, and assistive technology.
