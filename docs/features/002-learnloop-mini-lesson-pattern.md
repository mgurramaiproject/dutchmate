# Curated Mini-Lesson Pattern

This document is the content and interaction pattern for DutchMate's bundled mini-lessons. It keeps lessons substantial enough to teach language in context while preserving a predictable three-to-five-minute, no-typing experience inside the browser popup.

## Lesson contract

Every published mini-lesson must:

- belong to one practical life pathway;
- prefix its title with its CEFR level, such as `A1 · Een afspraak maken`;
- teach one practical Dutch pattern through one coherent micro-story;
- use four to six short Dutch sentences or dialogue turns, normally about thirty-five to sixty Dutch words;
- introduce three to five words or meaningful chunks as lesson candidates;
- provide human-reviewed Dutch, English, and Telugu content;
- introduce grammar only where it explains the practical pattern;
- use tap-to-reveal flashcards with `Again` and `Got it` and require no typing;
- finish by letting the learner confirm which candidates to keep for review; and
- remain bundled and versioned with the extension.

## Learner flow

### 1. Read the situation

Present the complete micro-story as a compact real-life scene. English and Telugu help is available line by line rather than permanently competing with the Dutch text.

The learner's first task is understanding the situation, not memorizing isolated vocabulary.

### 2. Notice the pattern

Return to the central Dutch pattern in the story. Highlight only that pattern in orange and explain briefly:

- what it communicates;
- when a learner would use it; and
- the minimum grammar needed to understand it.

Identify the lesson's three to five candidates in the same context. Do not introduce unrelated example sentences to inflate the lesson.

### 3. Practise with flashcards

Use the same flashcard-first interaction as the unified review queue:

- Dutch to meaning or context for recognition;
- meaning or context to Dutch for recall;
- tap `Show answer`; then
- tap `Again` or `Got it`.

Card direction and spacing may adapt behind the scenes, but the learner never types or chooses an interval.

### 4. Replay and keep

Show the micro-story again with less helper-language support so the learner can notice what now feels familiar.

Then show the three to five lesson candidates preselected. The learner may remove any item and confirms the remainder with one `Keep N for review` action. Kept candidates enter saved vocabulary and the unified review queue; unchosen candidates do not create due work or long-term mastery records.

If a candidate already exists in saved vocabulary, label it `Already saved` and strengthen the same canonical learning item rather than creating a lesson-specific duplicate.

## Authoring rules

- Use one believable interaction or event with a clear beginning and outcome.
- Prefer language a learner could reuse in the Netherlands within days.
- Keep non-target vocabulary controlled enough for the stated CEFR level.
- Reuse the central pattern naturally across the story, explanation, and practice; do not force repetitive dialogue.
- Make speakers and roles immediately understandable without decorative exposition.
- Use helper translations to clarify meaning, not to replace engagement with Dutch.
- Avoid tourist stereotypes, cultural trivia without a practical purpose, and situations that assume one family, work, or immigration background.
- Avoid long prose, disconnected example lists, typing exercises, trick questions, and grammar terminology that is not needed for the task.

## Visual pattern

The popup keeps DutchMate's existing black, white, and orange system:

- Dutch story text is the visual anchor;
- orange marks only the pattern or learning item currently under attention;
- English and Telugu help is visually secondary and revealed on demand;
- progress communicates the four lesson stages;
- reviews and lesson practice use the same controls; and
- focused lesson and practice screens temporarily hide top-level navigation.

The story is the memorable device. Decorative illustrations, confetti, gradients, and unrelated rewards must not compete with it.

## Example: `A1 · Een afspraak maken`

```text
Receptionist: Goedemorgen. Waarmee kan ik u helpen?

Learner: Ik wil graag een afspraak maken met de huisarts.

Receptionist: Natuurlijk. Wanneer kunt u langskomen?

Learner: Dinsdagmiddag, als het kan.

Receptionist: Dinsdag om drie uur is nog vrij.

Learner: Dat is goed. Bedankt en tot dinsdag.
```

Central pattern: `Ik wil graag...`

Candidate learning items may include:

- `ik wil graag...`;
- `de afspraak`;
- `een afspraak maken`; and
- `als het kan`.

## Starter lesson library

The first library contains twelve lessons in this priority order:

1. `A0 · Hallo, ik ben…`
2. `A1 · Kunt u dat herhalen?`
3. `A1 · Ik wil graag bestellen`
4. `A1 · Kan ik met pin betalen?`
5. `A1 · Waar moet ik overstappen?`
6. `A1 · Mijn trein is vertraagd`
7. `A1 · Een afspraak maken`
8. `A1 · Ik heb last van…`
9. `A1 · Er is iets kapot`
10. `A1 · Ik ben beschikbaar op…`
11. `A1 · Wat moet ik meenemen?`
12. `A2 · Wat staat er in deze brief?`

Together they cover first conversations, shopping and cafes, transport and directions, appointments and healthcare, home and neighbours, work and study, and municipality or official-letter tasks.

## Content review checklist

Before publication, confirm that:

- the CEFR label matches the language actually used;
- the story is coherent, practical, and within the length target;
- the central pattern appears naturally and has one clear use;
- every candidate is a reusable word or meaningful chunk;
- Dutch, English, and Telugu content has been reviewed;
- the lesson can be completed without typing or leaving the popup;
- existing saved items merge rather than duplicate; and
- the final replay is understandable with less support than the first reading.
