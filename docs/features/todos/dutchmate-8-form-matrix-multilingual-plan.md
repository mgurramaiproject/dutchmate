# DutchMate 8-Form Matrix — Multilingual Card & Detail Panel Implementation Plan

## Goal

Improve the existing 8-Dutch-forms matrix so that each tense card remains useful at a glance while showing:

- the Dutch tense abbreviation,
- the Dutch example sentence,
- the full English translation,
- the full Telugu translation,
- a compact mastery/status indicator,
- and a tap-to-open detail panel below the matrix.

The implementation must preserve the current popup layout and design system. It should simplify the matrix by removing repeated or unclear metadata rather than shrinking all text excessively.

---

## Product decisions

### Keep

- The existing 4 × 2 matrix structure.
- The four viewpoint rows:
  - Present
  - Past
  - Future from present
  - Future from past
- The two completion columns:
  - Onvoltooid
  - Voltooid
- The selected-card border.
- The detail panel rendered below the matrix.
- The current bottom navigation.
- Existing mastery/progression logic.

### Remove

- Full Dutch tense names from each matrix card.
- Visible status words such as:
  - Mastered
  - Next
  - Later
- The repeated `2 forms` text in every row header.
- The detail-panel sections or labels:
  - `REFERENCE FORM`
  - `CORE FORM`
  - `LEARNING PRIORITY`
- Any duplicate wording that is already represented by the matrix row and column headers.

### Add

- Full English translation inside every matrix card.
- Full Telugu translation inside every matrix card.
- Compact status symbols in the top-right corner.
- Full EN and TE translations in the detail panel.
- Learner-friendly English tense labels in the detail panel.
- A compact reusable content model for Dutch, English, Telugu, meaning, pattern, and usage examples.

---

# 1. Matrix card design

## Required content order

Each card must contain exactly:

1. Tense abbreviation
2. Status icon
3. Dutch example sentence
4. Full English translation
5. Full Telugu translation

Do not include the full Dutch tense name inside the card.

## Concrete card mockup

### Default card

```text
┌────────────────────────────┐
│ VVTT                    ✓  │
│                            │
│ Ik zou thuis gewerkt       │
│ hebben.                    │
│ EN · I would have worked   │
│      at home.              │
│ TE · నేను ఇంటి నుంచి పని    │
│      చేసి ఉండేవాడిని.        │
└────────────────────────────┘
```

### Selected card

```text
╔════════════════════════════╗
║ VVTT                    ✓  ║
║                            ║
║ Ik zou thuis gewerkt       ║
║ hebben.                    ║
║ EN · I would have worked   ║
║      at home.              ║
║ TE · నేను ఇంటి నుంచి పని    ║
║      చేసి ఉండేవాడిని.        ║
╚════════════════════════════╝
```

## Visual hierarchy

| Element | Recommended treatment |
|---|---|
| Tense code | 12–13 px, bold |
| Status icon | 11–12 px, top-right |
| Dutch sentence | 11.5–12.5 px, medium weight |
| EN translation | 8.5–9.5 px, regular, muted |
| TE translation | 8.5–9.5 px, regular, muted |
| Card padding | 7–8 px |
| Gap after tense header | 4 px |
| Gap before translations | 3–4 px |
| EN/TE line spacing | tight, approximately 1.15 |
| Selected border | existing strong dark border |
| Selected background | existing warm highlight |
| Unselected border | existing neutral border |

## Text wrapping rules

Because both EN and TE are full translations:

- Dutch sentence: maximum 2 lines.
- English translation: maximum 2 lines.
- Telugu translation: maximum 2 lines.
- No ellipsis unless the browser width or font rendering causes an exceptional overflow.
- Prefer authoring shorter example sentences rather than truncating translations.
- Card height must be equal within each row.
- If one translation needs more lines than the paired card, both cards in that row should use the taller shared height.

## Status symbols

Use compact symbols only:

| State | Symbol |
|---|---|
| Mastered | `✓` |
| Next/current | `›` |
| Later/locked | `○` |

Requirements:

- Do not rely only on colour.
- Add accessible text through `aria-label` or equivalent.
- Example: `aria-label="Mastered"`.

---

# 2. Matrix row and column headers

## Column headers

Keep:

```text
Onvoltooid
Not completed
```

```text
Voltooid
Completed
```

Alternative copy may be considered later, but do not change it as part of this implementation unless already covered by the design system.

## Row headers

Use:

```text
Present
tegenwoordige tijd
```

```text
Past
verleden tijd
```

```text
Future from present
tegenwoordige toekomende tijd
```

```text
Future from past
verleden toekomende tijd
```

Remove `2 forms` from all row headers.

The row header provides the viewpoint.  
The column header provides the completion state.  
The card therefore only needs the abbreviation and example content.

---

# 3. Detail panel design

The detail panel appears below the matrix when a card is selected.

## Required content order

1. Header
2. Learner-friendly English tense label
3. Full Dutch tense name
4. Canonical Dutch example
5. Full English translation
6. Full Telugu translation
7. Meaning
8. Pattern
9. Common usage example
10. Full EN and TE translations for the common usage example

Do not include:

- `REFERENCE FORM`
- `CORE FORM`
- `LEARNING PRIORITY`
- duplicated status explanations

## Concrete detail panel mockup

```text
╭────────────────────────────────────────╮
│ VVTT                         ✓ MASTERED │
│ Completed future viewed from the past  │
│ voltooid verleden toekomende tijd      │
│                                        │
│ NL  Ik zou thuis gewerkt hebben.       │
│ EN  I would have worked at home.       │
│ TE  నేను ఇంటి నుంచి పని చేసి            │
│     ఉండేవాడిని.                         │
│────────────────────────────────────────│
│ MEANING                                │
│ A completed result viewed from the     │
│ past, often hypothetical or unrealised.│
│────────────────────────────────────────│
│ PATTERN                                │
│ zou/zouden + voltooid deelwoord +      │
│ hebben/zijn                            │
│ werken → gewerkt                       │
│────────────────────────────────────────│
│ COMMON USE                             │
│ NL  Ik zou thuis gewerkt hebben als    │
│     dat mogelijk was.                  │
│ EN  I would have worked at home if     │
│     that had been possible.            │
│ TE  అది సాధ్యమై ఉంటే, నేను ఇంటి నుంచి   │
│     పని చేసి ఉండేవాడిని.                │
╰────────────────────────────────────────╯
```

## Header hierarchy

Recommended:

```text
VVTT                                      ✓ Mastered
Completed future viewed from the past
voltooid verleden toekomende tijd
```

Rules:

- Tense abbreviation: bold.
- Learner-friendly English label: prominent.
- Full Dutch name: smaller and muted.
- Status may remain visible as a compact badge.
- Do not give status its own section.

## Section naming

Use:

- `MEANING`
- `PATTERN`
- `COMMON USE`

Replace `FORMULA` with `PATTERN`.

---

# 4. Content specification for each form

The following table defines the learner-facing English labels, meanings, and patterns.

| Form | Learner-friendly English label | Meaning | Pattern |
|---|---|---|---|
| OTT | Present | A current, habitual, or generally true situation. | present finite verb |
| VTT | Completed present / perfect | A completed event presented as relevant now or as a completed conversational fact. | hebben/zijn in OTT + past participle |
| OVT | Past | A past event, state, habit, or narrative background. | past finite verb |
| VVT | Completed past | An event completed before another past reference point. | hebben/zijn in OVT + past participle |
| OTTT | Future viewed from the present | An uncompleted future action viewed from now. | zal/zullen + infinitive |
| VTTT | Completed future viewed from the present | An action expected to be completed by a future point. | zal/zullen + past participle + hebben/zijn |
| OVTT | Future viewed from the past / conditional | A future action viewed from a past point, or a hypothetical action. | zou/zouden + infinitive |
| VVTT | Completed future viewed from the past / conditional perfect | A completed result viewed from the past, often hypothetical or unrealised. | zou/zouden + past participle + hebben/zijn |

---

# 5. Example content for `werken`

Use these as the initial implementation examples.

| Form | Dutch | English | Telugu |
|---|---|---|---|
| OTT | Ik werk vandaag thuis. | I am working at home today. | నేను ఈరోజు ఇంటి నుంచి పని చేస్తున్నాను. |
| VTT | Ik heb vandaag thuis gewerkt. | I have worked at home today. | నేను ఈరోజు ఇంటి నుంచి పని చేశాను. |
| OVT | Ik werkte gisteren thuis. | I worked at home yesterday. | నేను నిన్న ఇంటి నుంచి పని చేశాను. |
| VVT | Ik had al thuis gewerkt. | I had already worked at home. | నేను అప్పటికే ఇంటి నుంచి పని చేసి ఉన్నాను. |
| OTTT | Ik zal morgen thuis werken. | I will work at home tomorrow. | నేను రేపు ఇంటి నుంచి పని చేస్తాను. |
| VTTT | Ik zal tegen die tijd thuis gewerkt hebben. | I will have worked at home by then. | అప్పటికి నేను ఇంటి నుంచి పని చేసి ఉంటాను. |
| OVTT | Ik zou thuis werken. | I would work at home. | నేను ఇంటి నుంచి పని చేసేవాడిని. |
| VVTT | Ik zou thuis gewerkt hebben. | I would have worked at home. | నేను ఇంటి నుంచి పని చేసి ఉండేవాడిని. |

## Telugu wording note

Some Telugu first-person conditional constructions vary by speaker gender.

For deterministic content, choose one of these strategies:

### Recommended MVP strategy

Store a neutral/default Telugu translation authored for the product’s current audience and keep it consistent.

### Future option

Support variants:

```json
{
  "te": {
    "default": "...",
    "masculine": "...",
    "feminine": "..."
  }
}
```

Do not block the current implementation on gender-variant support.

---

# 6. Recommended content schema

Extend or adapt the existing tense-form data model.

```ts
type LocalizedSentence = {
  nl: string;
  en: string;
  te: string;
};

type TenseFormContent = {
  id:
    | "OTT"
    | "VTT"
    | "OVT"
    | "VVT"
    | "OTTT"
    | "VTTT"
    | "OVTT"
    | "VVTT";

  viewpoint:
    | "present"
    | "past"
    | "future-from-present"
    | "future-from-past";

  completion: "onvoltooid" | "voltooid";

  dutchName: string;
  learnerLabelEn: string;

  canonicalExample: LocalizedSentence;

  meaningEn: string;
  patternNl: string;
  transformationHint?: string;

  commonUsage: LocalizedSentence;

  status: "mastered" | "next" | "later";
};
```

If the existing schema already contains equivalent fields, reuse them rather than introducing duplicate structures.

---

# 7. Component behaviour

## Matrix card

Suggested component API:

```ts
type TenseMatrixCardProps = {
  form: TenseFormContent;
  selected: boolean;
  onSelect: (id: TenseFormContent["id"]) => void;
};
```

Behaviour:

- Entire card is clickable.
- Keyboard activation works with Enter and Space.
- Selected state is visibly distinct.
- Status icon has an accessible label.
- Clicking the selected card again may collapse the detail panel if this matches current behaviour.

## Detail panel

Suggested component API:

```ts
type TenseDetailPanelProps = {
  form: TenseFormContent;
  onClose?: () => void;
};
```

Behaviour:

- Render below the matrix.
- After selection, scroll the detail panel into view.
- Preserve enough of the matrix above to retain context.
- Avoid a full-page jump.
- Support a close/collapse action if the current UI pattern allows it.

---

# 8. Responsive and popup constraints

The browser popup width is fixed and narrow.

Requirements:

- Do not introduce horizontal scrolling.
- Do not reduce Dutch text below readable size.
- EN and TE may use a smaller font, but must remain legible.
- Telugu font must render correctly in Firefox and Chromium.
- Test cards with the longest VTTT and VVTT sentences.
- Ensure bottom navigation remains fixed and does not cover detail content.
- Allow vertical scrolling through the matrix and detail panel.
- Keep card heights visually aligned per row.

---

# 9. Accessibility

- Cards must be keyboard focusable.
- Selected card should expose `aria-selected="true"` where appropriate.
- Status icons need accessible labels.
- Language prefixes `NL`, `EN`, and `TE` must be visible text.
- Do not communicate mastery solely through colour.
- Maintain adequate contrast for smaller EN and TE text.
- Telugu text must not be clipped vertically.
- Respect browser zoom up to at least 125%.

---

# 10. Implementation steps

## Step 1 — Inspect current implementation

Identify:

- matrix screen component,
- card component,
- detail-panel component,
- tense content source,
- mastery/status source,
- popup sizing and scroll containers,
- existing typography tokens.

Do not replace the current design system.

## Step 2 — Update content model

Add or confirm fields for:

- full EN translation,
- full TE translation,
- learner-friendly English label,
- Dutch full tense name,
- meaning,
- pattern,
- common usage in NL/EN/TE.

## Step 3 — Simplify matrix cards

Remove:

- full Dutch tense name,
- visible status words,
- redundant metadata.

Add:

- EN full translation,
- TE full translation,
- compact status icon.

## Step 4 — Update row headers

Remove `2 forms`.

Keep the English viewpoint label and smaller Dutch classification.

## Step 5 — Refactor detail panel

Remove:

- learning-priority section,
- reference/core labels.

Keep:

- title,
- learner-friendly label,
- Dutch full name,
- full translations,
- meaning,
- pattern,
- common usage.

## Step 6 — Add selection and scroll behaviour

- Keep selected border.
- Scroll detail panel into view after card selection.
- Avoid obscuring content behind bottom navigation.
- Support collapse behaviour if already present.

## Step 7 — Add tests

Cover:

- all 8 cards render NL/EN/TE,
- no full Dutch tense name appears inside cards,
- no `Mastered`, `Next`, or `Later` text appears inside cards,
- no `2 forms` labels remain,
- no `REFERENCE FORM`, `CORE FORM`, or `LEARNING PRIORITY` appears,
- selected card opens the correct detail content,
- translations match the selected form,
- keyboard selection works,
- status icons have accessible labels,
- long Telugu text does not overflow.

## Step 8 — Visual verification

Test at:

- default popup size,
- 110% zoom,
- 125% zoom,
- Firefox,
- Chromium-based browser if supported.

Capture screenshots for:

- full matrix,
- OTT selected,
- VTTT selected,
- VVTT selected,
- longest Telugu wrapping case.

---

# 11. Acceptance criteria

The change is complete when:

- All 8 cards show Dutch, full English, and full Telugu sentences.
- EN and TE use a smaller but readable font.
- Cards no longer show full Dutch tense names.
- Cards no longer show visible status words.
- Row headers no longer show `2 forms`.
- The detail panel contains no reference/core/priority classification.
- Selecting a card displays the correct full detail below the matrix.
- The matrix remains readable without horizontal scrolling.
- No card content overlaps or clips.
- Telugu renders correctly.
- The current DutchMate visual design remains intact.
- Existing mastery/progression behaviour still works.
- Existing navigation and lesson flow remain unchanged.

---

# 12. Non-goals

Do not implement as part of this task:

- a new top-level tab,
- a redesign of the entire Lessons page,
- AI-generated translations,
- runtime translation APIs,
- user-selectable support-language modes,
- grammar scoring changes,
- new mastery algorithms,
- speech or pronunciation features,
- changes to the overall DutchMate design system.

All multilingual tense content should remain deterministic and locally authored.
