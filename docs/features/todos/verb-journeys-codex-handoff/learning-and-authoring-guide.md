# Learning Design and Content Authoring Guide

## 1. Learning objective

The feature must improve a learner’s ability to understand and use a verb, not merely expose them to conjugation labels.

Each journey should teach one primary distinction, such as:

- routine/present situation with OTT;
- completed conversational event with VTT;
- past routine/background with OVT;
- VTT versus OVT in context.

## 2. Value-per-minute rules

- Keep stories short and natural.
- Spend most interaction time on learner decisions.
- Explain one relevant rule at a time.
- Use immediate authored feedback that explains why.
- Contrast easily confused forms.
- Add repair only for demonstrated weakness.
- Do not force advanced forms into beginner practice.
- Avoid redundant exercises that test the same recognition skill.

Target for a core journey:

- 2–4 minutes;
- one short story;
- one noticing decision;
- five core exercises;
- zero to two repair exercises.

## 3. First-person scope

The first version intentionally focuses on **ik/I** forms to create a coherent mental map. Story text may contain other persons when natural, but required production exercises should remain within the explicitly supported scope.

Do not imply that the learner has mastered the full conjugation paradigm.

## 4. Story authoring

A good story:

- has a clear situation and time frame;
- uses high-frequency A1/A2 vocabulary;
- repeats the target naturally without sounding mechanical;
- includes useful time markers;
- avoids unrelated new grammar;
- supports one noticing question;
- can be understood without a long grammar lecture.

Example OTT context:

> Ik werk vier dagen per week. Op maandag werk ik thuis. Vandaag werk ik met Sara. Morgen werk ik weer thuis.

This supports routine, present situation and planned future with a time marker while keeping the form stable.

## 5. Eight-form map authoring

For every form, author:

- a canonical sentence that makes comparison easy;
- a natural English meaning;
- the form’s useful meaning, not only its formal name;
- a time marker if it clarifies the form;
- an everyday alternative when the formal form is uncommon;
- a priority/level.

Use structurally parallel sentences where natural, but never sacrifice idiomatic Dutch merely for symmetry.

## 6. Twelve-English-form mapping

For every English pattern:

1. State a concrete situation.
2. Write the English example.
3. Write meaning-preserving Dutch.
4. Write common everyday Dutch.
5. Identify the Dutch form or construction actually used.
6. Explain the mismatch in one concise note.

Avoid false one-to-one mappings. Examples:

- English continuous often maps to ordinary Dutch OTT plus context.
- English present perfect continuous may map to OTT with *al* plus duration.
- English future simple often maps to OTT with a future time word.
- English simple past may map to VTT in conversation or OVT in narrative/background use.

## 7. Exercise authoring matrix

Each core journey should cover distinct skills:

| Position | Exercise purpose | Typical interaction |
|---|---|---|
| 1 | Recognise situation/meaning | Single choice |
| 2 | Construct target phrase | Tap to slots |
| 3 | Choose natural contextual translation | Single choice |
| 4 | Apply word order | Token order/repair |
| 5 | Contrast or classify form | Choice/map placement |

## 8. Distractors

Distractors should represent plausible learner errors:

- wrong auxiliary;
- infinitive instead of ik-form;
- participle without auxiliary;
- English-influenced word order;
- VTT/OVT confusion;
- correct grammar but wrong situation.

Do not use absurd distractors that make the answer obvious.

Every important distractor should have an authored rationale so feedback can explain the misconception.

## 9. Contextual translation wording

Use:

> Choose the most natural Dutch sentence for this situation.

Avoid:

> Translate this English tense into the Dutch tense.

When two Dutch answers can be grammatical, make the situation discriminate the intended answer or explicitly teach the nuance. Do not mark a plausible alternative wrong without explanation.

## 10. Review scheduling

The MVP may use a simple deterministic schedule integrated with existing review logic:

- first review after initial completion;
- earlier review for weak skills;
- later review after successful retrieval.

Do not invent a second competing spaced-repetition system if DutchMate already has one. Map Verb Journey skills into the existing review mechanism.

## 11. AI-assisted authoring, deterministic product

AI may help draft offline content, but it is never the authority and is never part of runtime grading.

```text
Authoring brief
  → draft
  → human Dutch/grammar review
  → structured content
  → schema validation
  → automated consistency checks
  → versioned pack
  → deterministic runtime
```

For every AI-assisted draft:

- verify tense and word order manually;
- check idiomatic/everyday Dutch;
- check English meaning and nuance;
- check CEFR vocabulary;
- validate distractors and explanations;
- record reviewer/status metadata if the repository supports it.

Suggested states:

- `draft`
- `language-reviewed`
- `validated`
- `release-ready`

Only `release-ready` content ships.

## 12. Initial content scope

Build and review **werken** first. After the architecture proves sound, author:

- zijn;
- hebben;
- gaan;
- doen;
- wonen;
- komen;
- willen.

Irregular, modal and auxiliary verbs need tailored journeys. Do not mechanically clone the werken stories or exercise assumptions.

## 13. Content review checklist

- Is the Dutch idiomatic?
- Is the intended form actually present?
- Is the English translation natural?
- Is any alternative Dutch answer also plausible?
- Does the situation justify the expected answer?
- Does the feedback explain meaning and use?
- Are time markers accurate?
- Is the vocabulary suitable for the stated CEFR level?
- Does every question test a distinct useful skill?
- Are advanced forms clearly reference/later material?
- Are supported-language translations complete and reviewed?

