# DutchMate 12 English Forms — Compact Comparison & Dual-Dutch Detail Implementation Plan

## 1. Goal

Improve the existing **12 English forms → Dutch** screen for verb journeys so that it works clearly inside the constrained DutchMate browser-popup viewport.

The screen should teach this central pattern:

> English often expresses time and aspect through a larger verb construction. Dutch often uses a simpler Dutch form plus a cue such as `nu`, `al`, `gisteren`, `toen`, `morgen`, or `tegen vrijdag`.

This is a focused feature change. Preserve the existing DutchMate UI, design system, navigation, lesson architecture, mastery logic, content architecture, and verb-journey flow.

---

## 2. Confirmed product decisions

### 2.1 Collapsed comparison cards

Every collapsed card shows:

1. Form number
2. English form name
3. English example sentence
4. **Everyday Dutch** sentence
5. Dutch form badge for the displayed Everyday Dutch sentence
6. A visible **Cue** line
7. Disclosure chevron

Collapsed cards must show **English + Dutch only**.

Do not show Telugu in collapsed cards.

Do not show both Dutch variants in collapsed cards. The compact list uses only **Everyday Dutch** because its purpose is fast comparison.

### 2.2 Detail mode

Tapping a collapsed card opens a focused detail view inside the same popup.

Every detail view must always display two separately labelled Dutch blocks:

1. **Meaning-preserving Dutch**
2. **Everyday Dutch**

This rule applies to all 12 English forms.

Even when both Dutch sentences are identical:

- render both labels,
- render the Dutch sentence twice,
- render its EN and TE translations under each block,
- and do not replace the second block with `Same`.

Do not de-duplicate matching strings in data preparation or rendering.

### 2.3 Translation hierarchy in Detail mode

Each Dutch block contains:

1. Dutch sentence as the primary sentence
2. Full English translation beneath it
3. Full Telugu translation beneath it

EN and TE must use a smaller font than the Dutch sentence.

The order is always:

```text
NL
EN
TE
```

The Detail view therefore uses this structure:

```text
MEANING-PRESERVING DUTCH
Dutch sentence
EN · Full English translation
TE · Full Telugu translation

EVERYDAY DUTCH
Dutch sentence
EN · Full English translation
TE · Full Telugu translation
```

### 2.4 Cues

Every one of the 12 English forms must have a visible authored cue.

A cue may be:

- a frequency marker,
- a current-time marker,
- a current-period marker,
- a duration marker,
- a past-time marker,
- a past reference point,
- a sequence marker,
- a future-time marker,
- a deadline,
- or a compact combination of these.

The cue is not another translation. It tells the learner what carries the intended timeline in the Dutch example.

### 2.5 Navigation boundaries

Detail mode remains inside the popup.

Do not open:

- a new browser tab,
- a separate browser page,
- a floating overlay outside the popup,
- or a system modal.

---

## 3. Recommended screen structure

## 3.1 Comparison-list state

```text
┌────────────────────────────────────────────┐
│ ← werken                                   │
│ 12 English forms → Dutch               ⓘ  │
│ English lens · 1–12                        │
│                                            │
│ [ Present 1–4 ][ Past 5–8 ][ Future 9–12 ]│
├────────────────────────────────────────────┤
│ 1  Present simple                    OTT  › │
│    I work at home every Monday.             │
│    Ik werk elke maandag thuis.              │
│    Cue · elke maandag                       │
├────────────────────────────────────────────┤
│ 2  Present continuous                OTT  › │
│    I am working at home right now.          │
│    Ik werk nu thuis.                        │
│    Cue · nu                                 │
├────────────────────────────────────────────┤
│ 3  Present perfect                   VTT  › │
│    I have worked at home three times…       │
│    Ik heb deze week drie keer thuis gewerkt.│
│    Cue · deze week                          │
└────────────────────────────────────────────┘
```

The Dutch sentence shown here is always the authored **Everyday Dutch** sentence.

## 3.2 Detail state

```text
┌────────────────────────────────────────────┐
│ ← Present forms                     2 of 12│
│                                            │
│ PRESENT CONTINUOUS                         │
│                                            │
│ MEANING-PRESERVING DUTCH              OTT  │
│ Ik ben nu thuis aan het werken.            │
│ EN · I am working at home right now.       │
│ TE · నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను. │
│                                            │
│ EVERYDAY DUTCH                        OTT  │
│ Ik werk nu thuis.                          │
│ EN · I am working at home right now.       │
│ TE · నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను. │
│                                            │
│ CUE                                        │
│ nu · happening now                         │
│                                            │
│ HOW DUTCH EXPRESSES IT                     │
│ Meaning-preserving: OTT progressive        │
│ Everyday: OTT + nu                         │
│                                            │
│ WHY THEY DIFFER                            │
│ Dutch can express an action in progress    │
│ with ordinary OTT when “nu” makes the      │
│ current meaning clear.                     │
│                                            │
│ ‹ Previous                         Next ›   │
└────────────────────────────────────────────┘
```

The Detail view replaces the comparison list temporarily rather than expanding a long article inside one list card.

On Back:

- restore the selected period,
- restore the previous list scroll position,
- restore keyboard focus to the originating card,
- preserve the selected card state.

---

## 4. Introductory content and navigation

### 4.1 Compact introduction

Use this compact default header:

```text
12 English forms → Dutch
English often uses a larger verb construction;
Dutch often uses a simpler form plus a time cue.  ⓘ
```

The information action may reveal:

> This is a comparison lens, not a one-to-one tense conversion. Compare the Dutch construction that closely preserves the English distinction with the form Dutch speakers commonly use in everyday speech.

Do not permanently occupy the top of the popup with a large `CORE INSIGHT` panel after the learner has already seen it.

### 4.2 Period selector

Use a sticky segmented control below the compact header:

```text
Present 1–4 | Past 5–8 | Future 9–12
```

Requirements:

- Sticky below the app header while the list scrolls.
- Full-width tap targets.
- Active state must not rely on colour alone.
- Preserve the current group when returning from Detail mode.

### 4.3 Link to the Dutch eight-form map

Keep a clear switch to the eight-form map.

Recommended copy:

```text
View 8-form Dutch map
```

Recommended placement:

- near the comparison-screen header, or
- immediately below the period selector.

Do not require scrolling through all 12 forms to reach it.

---

## 5. Collapsed-card component specification

### 5.1 Required content order

Every collapsed card contains exactly:

1. Number badge
2. English form name
3. Everyday Dutch form badge
4. Disclosure chevron
5. English example
6. Everyday Dutch example
7. Cue line

### 5.2 Example

```text
┌────────────────────────────────────────────┐
│ 4  Present perfect continuous       OTT  › │
│    I have been working for two hours.      │
│    Ik werk al twee uur.                    │
│    Cue · al twee uur                       │
└────────────────────────────────────────────┘
```

### 5.3 Visual hierarchy

| Element | Recommended treatment |
|---|---|
| Number badge | Existing compact numbered circle/badge |
| English form name | 12–13 px, bold |
| Dutch form badge | 9–10 px, compact outlined pill |
| English sentence | 10.5–11.5 px, regular, muted |
| Everyday Dutch sentence | 12.5–14 px, semibold, strongest sentence in the card |
| Cue line | 9.5–10.5 px, medium weight, muted accent |
| Card padding | 10–12 px |
| Vertical line spacing | Approximately 1.25–1.35 |
| Card border | One neutral outer border only |
| Selected/focused state | Existing DutchMate focus/selection treatment |

Use existing design tokens where available. Do not create a parallel colour or spacing system.

### 5.4 Remove the nested Dutch sentence box

Do not place the Dutch sentence inside a second large beige rounded rectangle.

Use one surface per collapsed card. The Dutch sentence may use:

- stronger type weight,
- a subtle background strip,
- or a small left accent,

but it must not create another large nested card.

### 5.5 Text wrapping

- English form name: one line where possible.
- English sentence: maximum two lines.
- Everyday Dutch sentence: maximum two lines.
- Cue: one line where possible; two lines only when necessary at the narrowest supported width.
- Avoid ellipsis for Dutch unless the viewport is exceptionally narrow.
- Equal card heights are not required, but cards within one group should feel consistent.

### 5.6 Collapsed-card exclusions

Do not show:

- Telugu,
- Meaning-preserving Dutch,
- full Dutch tense names,
- long grammar explanations,
- `Situation`,
- `Mismatch / usage`,
- both Dutch variants,
- duplicate Dutch sentences,
- large nested sentence cards,
- or inline expanded content.

---

## 6. Cue specification

### 6.1 Store cues as authored data

Do not infer cues at runtime.

Recommended model:

```ts
interface EnglishFormCue {
  display: string;
  shortMeaning: string;
  kind:
    | 'frequency'
    | 'current-time'
    | 'current-period'
    | 'duration'
    | 'past-time'
    | 'past-reference'
    | 'sequence'
    | 'future-time'
    | 'deadline'
    | 'compound';
  tokens: string[];
}
```

Example:

```ts
cue: {
  display: 'al twee uur',
  shortMeaning: 'duration continuing now',
  kind: 'duration',
  tokens: ['al', 'twee uur']
}
```

### 6.2 Rendering

Collapsed card:

```text
Cue · al twee uur
```

Detail view:

```text
CUE
al twee uur · duration continuing now
```

### 6.3 Cue highlighting

Where practical, lightly emphasize authored cue tokens inside both Dutch sentences.

Example:

```text
Ik werk [al twee uur].
```

Do not parse arbitrary HTML strings to highlight cues. Render safe text plus authored token ranges or structured fragments.

If a token does not occur in one of the two Dutch variants, do not force-highlight unrelated text.

---

## 7. Exact 12-form summary content for `werken`

This table is the implementation source of truth for the initial `werken` journey.

The collapsed list uses the **Everyday Dutch** column and its Dutch form badge.

| # | English form | English example | Meaning-preserving Dutch | Form | Everyday Dutch | Form | Cue | Cue meaning |
|---:|---|---|---|---|---|---|---|---|
| 1 | Present simple | I work at home every Monday. | Ik werk elke maandag thuis. | OTT | Ik werk elke maandag thuis. | OTT | `elke maandag` | repeated routine |
| 2 | Present continuous | I am working at home right now. | Ik ben nu thuis aan het werken. | OTT | Ik werk nu thuis. | OTT | `nu` | happening now |
| 3 | Present perfect | I have worked at home three times this week. | Ik heb deze week drie keer thuis gewerkt. | VTT | Ik heb deze week drie keer thuis gewerkt. | VTT | `deze week` | completed events in the current period |
| 4 | Present perfect continuous | I have been working for two hours. | Ik ben al twee uur aan het werken. | OTT | Ik werk al twee uur. | OTT | `al twee uur` | duration continuing now |
| 5 | Past simple | I worked at home yesterday. | Gisteren werkte ik thuis. | OVT | Ik heb gisteren thuis gewerkt. | VTT | `gisteren` | completed past fact |
| 6 | Past continuous | I was working when she called. | Ik was aan het werken toen ze belde. | OVT | Ik zat te werken toen ze belde. | OVT | `toen ze belde` | ongoing action around a past event |
| 7 | Past perfect | I had already worked at home before the meeting began. | Ik had al thuis gewerkt voordat de vergadering begon. | VVT | Ik had al thuis gewerkt voordat de vergadering begon. | VVT | `al … voordat` | completed before another past event |
| 8 | Past perfect continuous | I had been working for two hours when she called. | Ik was al twee uur aan het werken toen ze belde. | OVT | Ik zat al twee uur te werken toen ze belde. | OVT | `al twee uur … toen` | duration continuing up to a past point |
| 9 | Future simple | I will work at home tomorrow. | Ik zal morgen thuis werken. | OTTT | Morgen werk ik thuis. | OTT | `morgen` | future supplied by context |
| 10 | Future continuous | Tomorrow at eight, I will be working. | Morgen om acht uur zal ik aan het werken zijn. | OTTT | Morgen om acht uur ben ik aan het werken. | OTT | `morgen om acht uur` | action in progress at a future point |
| 11 | Future perfect | By Friday, I will have worked at home three times. | Tegen vrijdag zal ik drie keer thuis gewerkt hebben. | VTTT | Uiterlijk vrijdag heb ik drie keer thuis gewerkt. | VTT | `tegen/uiterlijk vrijdag` | completed by a future deadline |
| 12 | Future perfect continuous | Tomorrow at eight, I will have been working for two hours. | Morgen om acht uur zal ik al twee uur aan het werken zijn. | OTTT | Morgen om acht uur ben ik al twee uur aan het werken. | OTT | `morgen om acht uur + al twee uur` | duration continuing at a future point |

### 7.1 Badge rule

Each Dutch block displays the form of the sentence in that block.

The collapsed card displays only the **Everyday Dutch form**.

Examples:

- Form 5:
  - Meaning-preserving Dutch badge: `OVT`
  - Everyday Dutch badge: `VTT`
  - Collapsed card badge: `VTT`

- Form 9:
  - Meaning-preserving Dutch badge: `OTTT`
  - Everyday Dutch badge: `OTT`
  - Collapsed card badge: `OTT`

Do not derive either badge from the English tense name.

---

## 8. Exact Detail-mode content for `werken`

### Content rule

Every form below has two complete blocks.

Even when the blocks contain identical text, keep both.

All EN and TE lines are full translations and use smaller text than the Dutch sentence.

> Product note: the Telugu below is implementation-ready default copy, but it should receive a final native-speaker review before release.

---

### 8.1 Present simple

#### Meaning-preserving Dutch

```text
NL · Ik werk elke maandag thuis.
EN · I work at home every Monday.
TE · నేను ప్రతి సోమవారం ఇంటి నుంచి పని చేస్తాను.
Form · OTT
```

#### Everyday Dutch

```text
NL · Ik werk elke maandag thuis.
EN · I work at home every Monday.
TE · నేను ప్రతి సోమవారం ఇంటి నుంచి పని చేస్తాను.
Form · OTT
```

Cue:

```text
elke maandag · repeated routine
```

Construction:

```text
Meaning-preserving · OTT + frequency cue
Everyday · OTT + frequency cue
```

Explanation:

> This is a direct mapping for a repeated routine or habit.

---

### 8.2 Present continuous

#### Meaning-preserving Dutch

```text
NL · Ik ben nu thuis aan het werken.
EN · I am working at home right now.
TE · నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను.
Form · OTT
```

#### Everyday Dutch

```text
NL · Ik werk nu thuis.
EN · I am working at home right now.
TE · నేను ఇప్పుడు ఇంటి నుంచి పని చేస్తున్నాను.
Form · OTT
```

Cue:

```text
nu · happening now
```

Construction:

```text
Meaning-preserving · OTT progressive: zijn + aan het + infinitive
Everyday · OTT + nu
```

Explanation:

> Dutch can use an explicit progressive construction, but ordinary OTT plus `nu` is often sufficient in everyday speech.

---

### 8.3 Present perfect

#### Meaning-preserving Dutch

```text
NL · Ik heb deze week drie keer thuis gewerkt.
EN · I have worked at home three times this week.
TE · నేను ఈ వారం మూడు సార్లు ఇంటి నుంచి పని చేశాను.
Form · VTT
```

#### Everyday Dutch

```text
NL · Ik heb deze week drie keer thuis gewerkt.
EN · I have worked at home three times this week.
TE · నేను ఈ వారం మూడు సార్లు ఇంటి నుంచి పని చేశాను.
Form · VTT
```

Cue:

```text
deze week · completed events in the current period
```

Construction:

```text
Meaning-preserving · VTT + current-period cue
Everyday · VTT + current-period cue
```

Explanation:

> VTT presents completed events within a current period such as `deze week`.

---

### 8.4 Present perfect continuous

#### Meaning-preserving Dutch

```text
NL · Ik ben al twee uur aan het werken.
EN · I have been working for two hours.
TE · నేను రెండు గంటలుగా పని చేస్తున్నాను.
Form · OTT
```

#### Everyday Dutch

```text
NL · Ik werk al twee uur.
EN · I have been working for two hours.
TE · నేను రెండు గంటలుగా పని చేస్తున్నాను.
Form · OTT
```

Cue:

```text
al twee uur · duration continuing now
```

Construction:

```text
Meaning-preserving · OTT progressive + al + duration
Everyday · OTT + al + duration
```

Explanation:

> Because the activity is still continuing, Dutch treats it as a present situation rather than a completed one.

---

### 8.5 Past simple

#### Meaning-preserving Dutch

```text
NL · Gisteren werkte ik thuis.
EN · I worked at home yesterday.
TE · నేను నిన్న ఇంటి నుంచి పని చేశాను.
Form · OVT
```

#### Everyday Dutch

```text
NL · Ik heb gisteren thuis gewerkt.
EN · I worked at home yesterday.
TE · నేను నిన్న ఇంటి నుంచి పని చేశాను.
Form · VTT
```

Cue:

```text
gisteren · completed past fact
```

Construction:

```text
Meaning-preserving · OVT + finished past-time cue
Everyday · VTT + finished past-time cue
```

Explanation:

> OVT is the structural match, while everyday Dutch conversation often uses VTT for one completed past fact.

---

### 8.6 Past continuous

#### Meaning-preserving Dutch

```text
NL · Ik was aan het werken toen ze belde.
EN · I was working when she called.
TE · ఆమె ఫోన్ చేసినప్పుడు నేను పని చేస్తూ ఉన్నాను.
Form · OVT
```

#### Everyday Dutch

```text
NL · Ik zat te werken toen ze belde.
EN · I was working when she called.
TE · ఆమె ఫోన్ చేసినప్పుడు నేను పని చేస్తూ ఉన్నాను.
Form · OVT
```

Cue:

```text
toen ze belde · ongoing action around a past event
```

Construction:

```text
Meaning-preserving · OVT progressive: was + aan het + infinitive
Everyday · OVT position-verb construction: zat + te + infinitive
```

Explanation:

> Both forms describe an ongoing past action. `Zat te werken` is a natural everyday choice when the person was sitting.

---

### 8.7 Past perfect

#### Meaning-preserving Dutch

```text
NL · Ik had al thuis gewerkt voordat de vergadering begon.
EN · I had already worked at home before the meeting began.
TE · సమావేశం ప్రారంభమయ్యే ముందే నేను ఇంటి నుంచి పని చేశాను.
Form · VVT
```

#### Everyday Dutch

```text
NL · Ik had al thuis gewerkt voordat de vergadering begon.
EN · I had already worked at home before the meeting began.
TE · సమావేశం ప్రారంభమయ్యే ముందే నేను ఇంటి నుంచి పని చేశాను.
Form · VVT
```

Cue:

```text
al … voordat · completed before another past event
```

Construction:

```text
Meaning-preserving · VVT + al + voordat
Everyday · VVT + al + voordat
```

Explanation:

> VVT marks the earlier of two past events.

---

### 8.8 Past perfect continuous

#### Meaning-preserving Dutch

```text
NL · Ik was al twee uur aan het werken toen ze belde.
EN · I had been working for two hours when she called.
TE · ఆమె ఫోన్ చేసినప్పుడు నేను అప్పటికే రెండు గంటలుగా పని చేస్తూ ఉన్నాను.
Form · OVT
```

#### Everyday Dutch

```text
NL · Ik zat al twee uur te werken toen ze belde.
EN · I had been working for two hours when she called.
TE · ఆమె ఫోన్ చేసినప్పుడు నేను అప్పటికే రెండు గంటలుగా పని చేస్తూ ఉన్నాను.
Form · OVT
```

Cue:

```text
al twee uur … toen · duration continuing up to a past point
```

Construction:

```text
Meaning-preserving · OVT progressive + al + duration + past reference point
Everyday · OVT position-verb construction + al + duration + past reference point
```

Explanation:

> Dutch normally uses a past ongoing construction plus duration rather than a separate perfect-continuous tense.

---

### 8.9 Future simple

#### Meaning-preserving Dutch

```text
NL · Ik zal morgen thuis werken.
EN · I will work at home tomorrow.
TE · నేను రేపు ఇంటి నుంచి పని చేస్తాను.
Form · OTTT
```

#### Everyday Dutch

```text
NL · Morgen werk ik thuis.
EN · I will work at home tomorrow.
TE · నేను రేపు ఇంటి నుంచి పని చేస్తాను.
Form · OTT
```

Cue:

```text
morgen · future supplied by context
```

Construction:

```text
Meaning-preserving · OTTT: zullen + infinitive
Everyday · OTT + future-time cue
```

Explanation:

> `Morgen` already establishes the future, so everyday Dutch does not automatically require `zal`.

---

### 8.10 Future continuous

#### Meaning-preserving Dutch

```text
NL · Morgen om acht uur zal ik aan het werken zijn.
EN · Tomorrow at eight, I will be working.
TE · రేపు ఎనిమిది గంటలకు నేను పని చేస్తూ ఉంటాను.
Form · OTTT
```

#### Everyday Dutch

```text
NL · Morgen om acht uur ben ik aan het werken.
EN · Tomorrow at eight, I will be working.
TE · రేపు ఎనిమిది గంటలకు నేను పని చేస్తూ ఉంటాను.
Form · OTT
```

Cue:

```text
morgen om acht uur · action in progress at a future point
```

Construction:

```text
Meaning-preserving · OTTT progressive
Everyday · OTT progressive + future-time cue
```

Explanation:

> The future time establishes when the action occurs, and `aan het werken` establishes that it is in progress.

---

### 8.11 Future perfect

#### Meaning-preserving Dutch

```text
NL · Tegen vrijdag zal ik drie keer thuis gewerkt hebben.
EN · By Friday, I will have worked at home three times.
TE · శుక్రవారం నాటికి నేను మూడు సార్లు ఇంటి నుంచి పని చేసి ఉంటాను.
Form · VTTT
```

#### Everyday Dutch

```text
NL · Uiterlijk vrijdag heb ik drie keer thuis gewerkt.
EN · By Friday, I will have worked at home three times.
TE · శుక్రవారం నాటికి నేను మూడు సార్లు ఇంటి నుంచి పని చేసి ఉంటాను.
Form · VTT
```

Cue:

```text
tegen/uiterlijk vrijdag · completed by a future deadline
```

Construction:

```text
Meaning-preserving · VTTT + deadline cue
Everyday · VTT + future deadline supplied by context
```

Explanation:

> VTTT explicitly marks completion before a future point. Everyday Dutch can use a simpler completed form when the deadline makes the future interpretation clear.

---

### 8.12 Future perfect continuous

#### Meaning-preserving Dutch

```text
NL · Morgen om acht uur zal ik al twee uur aan het werken zijn.
EN · Tomorrow at eight, I will have been working for two hours.
TE · రేపు ఎనిమిది గంటలకు నేను రెండు గంటలుగా పని చేస్తూ ఉంటాను.
Form · OTTT
```

#### Everyday Dutch

```text
NL · Morgen om acht uur ben ik al twee uur aan het werken.
EN · Tomorrow at eight, I will have been working for two hours.
TE · రేపు ఎనిమిది గంటలకు నేను రెండు గంటలుగా పని చేస్తూ ఉంటాను.
Form · OTT
```

Cue:

```text
morgen om acht uur + al twee uur · duration continuing at a future point
```

Construction:

```text
Meaning-preserving · OTTT progressive + al + duration
Everyday · OTT progressive + future point + al + duration
```

Explanation:

> Dutch combines a future reference point with an ongoing duration. It does not need to force this meaning into a completed Dutch form.

---

## 9. Detail-view component specification

### 9.1 Required content order

1. Back control
2. `n of 12`
3. English form name
4. Meaning-preserving Dutch block
5. Everyday Dutch block
6. Cue
7. Construction comparison
8. Short English–Dutch explanation
9. Previous and Next controls

Do not conditionally omit either Dutch block.

### 9.2 Dutch block anatomy

Each block contains:

1. Block label
2. Dutch form badge
3. Dutch sentence
4. Full EN translation
5. Full TE translation

Example:

```text
MEANING-PRESERVING DUTCH              OTTT
Ik zal morgen thuis werken.
EN · I will work at home tomorrow.
TE · నేను రేపు ఇంటి నుంచి పని చేస్తాను.
```

### 9.3 Translation hierarchy

| Element | Recommended treatment |
|---|---|
| Block label | 9–10 px, bold, uppercase or existing metadata style |
| Dutch form badge | 9–10 px, compact outlined pill |
| Dutch sentence | 16–18 px, semibold/bold, highest sentence emphasis |
| `EN ·` label | 9–10 px, bold language marker |
| English translation | 11–12 px, regular, muted but readable |
| `TE ·` label | 9–10 px, bold language marker |
| Telugu translation | 11–12 px, regular, muted but readable |
| Cue value | 11–12 px, semibold |
| Construction rows | 10.5–11.5 px |
| Explanation | 11–12 px, normal line height |

EN and TE must be visibly smaller than the Dutch sentence, but not below a comfortably readable popup size.

### 9.4 Duplicate rendering rule

The component must not contain logic such as:

```ts
if (meaningPreserving.nl === everyday.nl) {
  return <SameAsAbove />;
}
```

It must always render:

```tsx
<DutchComparisonBlock kind="meaning-preserving" ... />
<DutchComparisonBlock kind="everyday" ... />
```

This applies even when all NL, EN, TE, and form-code values are identical.

### 9.5 Visual separation

Use compact visual separation between the two blocks:

- a thin divider,
- spacing,
- or a subtle background change.

Avoid two large nested cards that recreate the current crowded appearance.

Recommended:

- one Detail surface,
- two labelled sections,
- one thin divider.

### 9.6 Scrolling

Because both Dutch blocks are always shown, Detail mode may scroll vertically.

Requirements:

- no horizontal scrolling,
- Previous/Next controls remain reachable,
- bottom navigation must not cover content,
- back control remains visible according to the existing screen pattern,
- preserve the Detail scroll position only if current DutchMate navigation already does so.

### 9.7 Language rendering

- Use UTF-8.
- Use a font stack that supports Telugu glyphs.
- Do not assume the Latin UI font supports Telugu.
- Allow TE to wrap naturally.
- Do not truncate Telugu in Detail mode.
- Use `lang="nl"`, `lang="en"`, and `lang="te"` where supported.

---

## 10. Proposed content model

Adapt property names to the repository's conventions rather than introducing a parallel architecture.

```ts
type EnglishPeriod = 'present' | 'past' | 'future';

type DutchFormCode =
  | 'OTT'
  | 'OVT'
  | 'VTT'
  | 'VVT'
  | 'OTTT'
  | 'OVTT'
  | 'VTTT'
  | 'VVTT';

interface LocalizedDutchVariant {
  nl: string;
  en: string;
  te: string;
  dutchFormCode: DutchFormCode;
  construction: string;
}

interface EnglishFormComparison {
  id: string;
  order: number;
  period: EnglishPeriod;
  englishFormName: string;
  englishSentence: string;

  cue: EnglishFormCue;

  meaningPreservingDutch: LocalizedDutchVariant;
  everydayDutch: LocalizedDutchVariant;

  explanation: string;
}
```

### 10.1 Collapsed-card projection

The collapsed card reads only:

```ts
{
  englishSentence,
  everydayDutch.nl,
  everydayDutch.dutchFormCode,
  cue
}
```

### 10.2 Detail projection

The Detail view always reads and renders both:

```ts
meaningPreservingDutch
everydayDutch
```

Do not make either optional.

### 10.3 Validation

At build time or in tests, verify:

- both Dutch variants exist for all 12 forms,
- each variant has NL, EN, TE, form code, and construction,
- cue exists for all 12 forms,
- duplicate variant strings are allowed,
- duplicate IDs are not allowed.

Do not add a validation rule that rejects identical Meaning-preserving and Everyday Dutch content.

### 10.4 Deterministic content

- Store all content locally.
- Do not call an LLM or translation API at runtime.
- Do not generate cues dynamically.
- Do not infer form badges from the English tense name.
- Do not translate Telugu in render code.
- Do not auto-rewrite matching blocks to `Same`.

### 10.5 Reuse for other verbs

Separate conceptual form metadata from verb-specific sentence content when it fits the current architecture.

Possible split:

```ts
englishFormDefinitions[formId]
verbJourneyEnglishForms[verbId][formId]
```

`englishFormDefinitions` may own:

- order,
- period,
- English form name,
- default explanation structure.

`verbJourneyEnglishForms` may own:

- English sentence,
- Meaning-preserving Dutch block,
- Everyday Dutch block,
- EN/TE translations,
- cue,
- verb-specific constructions.

Do not over-generalize during the first implementation if the repository currently uses simpler authored lesson objects.

---

## 11. Interaction and state behaviour

### 11.1 Opening Detail

On card activation:

- record selected form ID,
- record active period,
- record comparison-list scroll position,
- switch to focused Detail mode,
- focus the Detail heading for keyboard and screen-reader users.

### 11.2 Returning to the list

On Back:

- return to the same period,
- restore list scroll position,
- restore focus to the originating card.

### 11.3 Previous and Next

- Move through all 12 forms in numeric order.
- Crossing a boundary updates the period context:
  - 4 → 5 changes Present to Past.
  - 8 → 9 changes Past to Future.
- Disable Previous on form 1.
- Disable Next on form 12.
- Do not loop unless DutchMate already uses looping navigation elsewhere.

### 11.4 Keyboard behaviour

- Card is reachable by Tab.
- Enter and Space open Detail.
- Escape or the existing Back shortcut returns to the list when consistent with current popup behaviour.
- Previous and Next buttons have explicit accessible labels.

---

## 12. Component changes

Names are illustrative. Use existing repository names when available.

### 12.1 Create or refactor

- `EnglishFormsComparisonScreen`
- `EnglishFormPeriodTabs`
- `EnglishFormCompactCard`
- `EnglishFormDetailView`
- `DutchComparisonBlock`
- `EnglishFormCue`
- local `werken` comparison data

### 12.2 `DutchComparisonBlock`

Recommended responsibility:

```ts
interface DutchComparisonBlockProps {
  label: 'Meaning-preserving Dutch' | 'Everyday Dutch';
  variant: LocalizedDutchVariant;
}
```

The component must:

- render NL first,
- render EN and TE beneath it,
- use the correct form badge,
- use language attributes,
- never suppress duplicate content.

### 12.3 Avoid

- one unique component per tense,
- raw HTML strings for highlighted cues,
- duplicated list and Detail datasets,
- translation in render code,
- text-equality-based de-duplication,
- CSS selectors tied to sentence content,
- a new global state library for this feature.

### 12.4 Preferred state ownership

Keep local navigation state in the comparison feature unless the current route/screen architecture already provides a better fit.

Suggested state:

```ts
{
  activePeriod: 'present' | 'past' | 'future';
  selectedFormId: string | null;
  listScrollTop: number;
  introExpanded: boolean;
}
```

---

## 13. CSS and layout implementation notes

### 13.1 Popup width

Test against the actual DutchMate popup width.

Recommended rules:

- Avoid fixed card widths.
- Use `min-width: 0` on flex/grid text columns.
- Use normal word wrapping for NL and EN.
- Use `overflow-wrap: anywhere` only as a fallback for Telugu or unusually long tokens.
- Reserve bottom padding so fixed bottom navigation does not cover Detail content.

### 13.2 Reduced visual nesting

Use:

- one outer Detail surface,
- two labelled Dutch sections,
- thin separators,
- typography hierarchy,
- compact form badges,
- restrained cue treatment.

Do not use:

- one large card around each Dutch block,
- a nested beige sentence box inside each block,
- heavy borders around every section.

### 13.3 Sticky content

If the existing popup scroll container permits it:

- app header stays fixed,
- period selector is sticky in list mode,
- Detail back/header may remain sticky,
- bottom navigation remains fixed.

Verify stacking contexts so sticky content does not overlap the app header or sentence text.

### 13.4 Typography

Use existing tokens where possible.

Required hierarchy:

```text
Dutch sentence > EN/TE translation > explanation/metadata
```

Do not make Telugu smaller than English.

---

## 14. Accessibility requirements

- Collapsed cards use button semantics or equivalent correct interaction semantics.
- Every card's accessible name includes:
  - form number,
  - English form name,
  - Everyday Dutch form badge,
  - cue.
- Dutch form badges are not communicated by colour alone.
- Focus rings remain visible.
- Detail mode exposes both Dutch section headings to assistive technology.
- Each NL/EN/TE line uses the correct language attribute.
- Duplicate content remains present in the accessibility tree because it belongs to two differently labelled pedagogical sections.
- Back, Previous, and Next have explicit labels.
- Focus returns to the originating card after Back.
- Honour reduced-motion preferences.

Example collapsed-card accessible label:

```text
Form 4 of 12, Present perfect continuous. Everyday Dutch uses OTT. Cue: al twee uur. Open details.
```

Example Detail section heading:

```text
Meaning-preserving Dutch, OTT.
```

---

## 15. Implementation sequence

### Step 1 — Inspect the current feature

Before editing:

- locate the 12-English-forms screen,
- locate existing form data,
- locate current accordion/card styles,
- identify screen-navigation conventions,
- identify design tokens,
- identify tests and screenshot tooling,
- determine how the eight-form map links to this screen.

Do not redesign unrelated screens.

### Step 2 — Normalize the 12-form data

- Add required Meaning-preserving Dutch and Everyday Dutch objects.
- Add NL, EN, TE, form code, and construction to both objects.
- Add all 12 cues.
- Preserve existing IDs used by progress, analytics, or routing.
- Allow identical content across the two Dutch objects.

### Step 3 — Build the compact collapsed card

- Render English and Everyday Dutch only.
- Add Everyday Dutch form badge.
- Add cue.
- Remove nested Dutch sentence boxes.
- Remove inline expanded Detail content.
- Verify long forms 4, 8, 11, and 12.

### Step 4 — Build the dual-Dutch Detail mode

- Always render Meaning-preserving Dutch first.
- Always render Everyday Dutch second.
- Render NL first within each block.
- Render smaller full EN and TE translations under each NL sentence.
- Render each block's own form badge and construction.
- Do not suppress matching blocks.
- Add Cue and Explanation.
- Add Back, Previous, and Next behaviour.

### Step 5 — Compact the screen header

- Replace the permanently large intro/Core Insight area with compact copy plus disclosure.
- Make the period selector sticky where technically safe.
- Keep the eight-form map switch easy to reach.

### Step 6 — Add cue highlighting

- Use authored token metadata.
- Apply highlighting safely to either or both Dutch variants when tokens occur.
- Do not use unsafe HTML.

### Step 7 — Add tests

Add unit, component, integration, and visual tests appropriate to the current stack.

### Step 8 — Perform popup visual verification

Capture and inspect the states listed in the visual verification matrix.

### Step 9 — Commit in logical units

Suggested commits:

1. `feat(verb-journey): add dual-dutch 12-form comparison data`
2. `feat(verb-journey): compact English-form comparison cards`
3. `feat(verb-journey): add multilingual dual-dutch detail view`
4. `test(verb-journey): cover cues duplicate blocks and popup layout`

Follow repository conventions if they differ.

---

## 16. Test plan

### 16.1 Data tests

Verify:

- exactly 12 forms exist,
- orders 1–12 are unique,
- four Present, four Past, and four Future entries exist,
- every form has a non-empty cue,
- every form has a Meaning-preserving Dutch object,
- every form has an Everyday Dutch object,
- both objects contain NL, EN, TE, form code, and construction,
- identical Dutch blocks are accepted,
- no duplicate IDs exist.

Explicit duplicate-content test cases:

- form 1 has identical Meaning-preserving and Everyday blocks,
- form 3 has identical blocks,
- form 7 has identical blocks,
- both blocks remain present after serialization, transformation, and rendering.

### 16.2 Collapsed-card tests

Verify:

- English sentence renders,
- Everyday Dutch sentence renders,
- Everyday Dutch badge renders,
- cue renders,
- Telugu does not render,
- Meaning-preserving Dutch does not render,
- long grammar details do not render,
- nested sentence-card markup is gone,
- Enter and Space open Detail.

### 16.3 Detail-view tests

For every form, verify:

- Meaning-preserving Dutch heading renders,
- Everyday Dutch heading renders,
- both Dutch sentences render,
- both form badges render,
- EN and TE render under both Dutch sentences,
- EN and TE use the smaller translation style,
- Telugu wraps without clipping,
- cue renders,
- both construction descriptions render,
- explanation renders.

For forms with identical variants, verify:

- Dutch sentence appears twice,
- EN translation appears twice,
- TE translation appears twice,
- no `Same`, `Same as above`, or de-duplication placeholder appears.

### 16.4 Navigation tests

Verify:

- Back restores originating card and scroll position,
- active period persists after Back,
- form 4 Next opens form 5,
- form 5 Previous opens form 4,
- form 8 Next opens form 9,
- form 1 Previous is disabled,
- form 12 Next is disabled,
- eight-form map link still works,
- bottom navigation still works.

### 16.5 Accessibility tests

Verify:

- cards have button semantics,
- accessible names contain form and cue,
- both Detail section labels are announced,
- focus is visible,
- focus returns after Back,
- language attributes exist,
- no critical information is colour-only,
- duplicate content remains distinguishable through section labels.

### 16.6 Regression tests

Verify no unintended changes to:

- eight-Dutch-forms content,
- mastery/progress calculation,
- lesson completion,
- Today screen,
- Saved screen,
- story lessons,
- exercise grading,
- bottom navigation.

---

## 17. Visual verification matrix

Test at minimum:

- Firefox default popup size
- Chromium-based browser if supported
- 100% zoom
- 110% zoom
- 125% zoom
- narrowest supported popup width
- Linux, macOS, and Windows font rendering where available

Capture screenshots for:

1. Present collapsed list
2. Past collapsed list
3. Future collapsed list
4. Present Simple Detail showing two identical blocks
5. Present Continuous Detail showing two different blocks
6. Past Simple Detail showing OVT versus VTT
7. Past Perfect Detail showing two identical blocks
8. Future Simple Detail showing OTTT versus OTT
9. Future Perfect Detail showing VTTT versus VTT
10. Future Perfect Continuous Detail
11. Long Telugu wrapping at 125% zoom
12. Back-to-list state with restored selection

Inspect for:

- clipped Telugu glyphs,
- cue overflow,
- form-badge collision,
- duplicate blocks visually blending together,
- content hidden behind bottom navigation,
- sticky-header overlap,
- excessive nested borders,
- horizontal scrolling,
- focus-ring clipping,
- EN/TE text becoming too small.

---

## 18. Acceptance criteria

The feature is complete when:

- All 12 collapsed cards show English and Everyday Dutch only.
- All 12 collapsed cards show a non-empty Cue line.
- Collapsed cards do not show Telugu.
- Collapsed cards do not show Meaning-preserving Dutch.
- Collapsed cards no longer contain large inline Detail sections.
- Collapsed cards no longer use a large nested Dutch sentence card.
- Tapping any card opens focused Detail mode inside the popup.
- Every Detail view shows **Meaning-preserving Dutch**.
- Every Detail view shows **Everyday Dutch**.
- Both blocks appear even when their content is identical.
- Matching Dutch sentences are rendered twice rather than replaced by `Same`.
- Each Dutch block shows full EN and TE translations beneath the Dutch sentence.
- Matching EN and TE translations are also rendered beneath both blocks.
- EN and TE are visibly smaller than Dutch but remain readable.
- Telugu wraps without truncation or horizontal scrolling.
- Each Dutch block displays its actual Dutch form badge.
- Every cue matches the intended time/aspect signal defined in this plan.
- Previous and Next work across all 12 forms.
- Back restores period, scroll position, and card focus.
- The Present/Past/Future selector remains easy to access.
- The eight-form Dutch map remains accessible.
- Existing DutchMate design tokens and navigation are preserved.
- No LLM or runtime translation dependency is introduced.
- Existing lesson, progress, and mastery behaviour remains unchanged.

---

## 19. Non-goals

Do not implement as part of this task:

- redesign of the entire Lessons area,
- changes to the eight-Dutch-forms matrix,
- a new top-level navigation tab,
- user-selectable translation languages,
- runtime translation,
- AI-generated examples or explanations,
- grammar scoring changes,
- new mastery algorithms,
- speech or pronunciation features,
- editing/authoring UI,
- analytics redesign,
- or replacement of the current DutchMate design system.

---

## 20. Definition of done for Codex CLI

Before reporting completion, Codex must:

1. Summarize the existing files/components it changed.
2. State any deviations from this plan and why they were necessary.
3. Run relevant lint, type-check, unit, component, and integration tests.
4. Run or document popup visual verification.
5. List the exact commands executed and their results.
6. Confirm all 12 cues are present.
7. Confirm all 12 Meaning-preserving Dutch blocks are present.
8. Confirm all 12 Everyday Dutch blocks are present.
9. Confirm each of the 24 Dutch blocks has EN and TE translations.
10. Confirm identical blocks are intentionally rendered twice.
11. Confirm no runtime AI or translation dependency was added.
12. Commit changes according to the repository's normal workflow.

### Suggested Codex CLI start prompt

```text
Implement the attached plan for DutchMate's existing 12 English Forms → Dutch screen.

Preserve the current DutchMate design system, popup navigation, verb-journey architecture, mastery/progress logic, and unrelated UI. First inspect the repository and identify the existing screen, data model, styles, tests, and navigation conventions.

Collapsed cards must show English plus Everyday Dutch only and must include an authored cue for all 12 forms.

Detail mode must always show two labelled blocks: Meaning-preserving Dutch and Everyday Dutch. Each block must contain Dutch first, followed by smaller full English and Telugu translations. Render both blocks even when all content is identical; do not display “Same” and do not de-duplicate matching strings.

Use deterministic locally authored NL/EN/TE content. Do not add an LLM, translation API, new top-level tab, or broad UI redesign. Add tests for all 12 cues, both Dutch blocks, intentional duplicate rendering, multilingual Detail content, navigation, scroll/focus restoration, accessibility, and popup overflow. Run all relevant checks and commit logical changes.
```
