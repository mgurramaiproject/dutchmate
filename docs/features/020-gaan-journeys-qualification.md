# Feature 020: `gaan` Verb Journeys qualification

**Feature:** `020-gaan-journeys`

**Branch:** `020-gaan-journeys`

**Content version:** `020-2` (additive multilingual and English-comparison package version)

**Status:** Authored package and automated qualification complete; independent
linguistic review and manual extension QA remain pending.

## Package identity

| Field | Decision | Review status |
| --- | --- | --- |
| Lemma | `gaan` | Authoring decision recorded |
| Meaning | to go | Authoring decision recorded |
| Verb class | irregular | Authoring decision recorded |
| Auxiliary | `zijn` for the approved movement-perfect examples | Authoring decision recorded; Dutch review pending |
| Learning languages | Dutch learning content with English and Telugu support | Product boundary recorded; translation review pending |
| CEFR ceiling | A0/Pre-A1 through A2 | Product boundary recorded |
| Progress unit | One target-form slot per declared target form when a journey has evidence | Product boundary recorded; implementation verification pending |
| Dutch map | Eight canonical forms: OTT, OVT, VTT, VVT, OTTT, OVTT, VTTT, VVTT | Structural and language review pending |
| English comparison | Twelve records with separate meaning-preserving and Everyday Dutch roles plus authored cues | Structural and language review pending |

## Journey authoring matrix

| Journey | Learner meaning/decision | Target forms | Progress contribution | Allowed person scope | Kind | Five practice decisions | Evidence skills | Review status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `journey.gaan.ott-movement` | Recognise and construct ordinary movement and departure. | OTT | 1 target-form slot | Primarily `ik`; bounded `jij gaat`, `hij/zij gaat`, and `wij/jullie/zij gaan` contrasts. | Core A0/A1 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.ott-movement` | Dutch/English/Telugu review pending |
| `journey.gaan.ott-plans` | Distinguish present plans and near-future `gaan` + infinitive, including inversion. | OTT | 1 target-form slot | Primarily `ik`; bounded `ga je?`, `gaat hij?`, and plural question/answer contrasts. | Core A1 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.ott-plans` | Dutch/English/Telugu review pending |
| `journey.gaan.ovt-movement` | Use `ging`/`gingen` for past movement, routine, and background. | OVT | 1 target-form slot | Primarily `ik`; bounded `gingen` and third-person recognition. | Core A1/A2 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.ovt-movement` | Dutch/English/Telugu review pending |
| `journey.gaan.vtt-completed-movement` | Recognise and construct completed movement with `zijn`. | VTT | 1 target-form slot | Primarily `ik`; bounded `is gegaan` and `zijn gegaan` recognition. | Core A2 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.vtt-completed-movement` | Dutch/English/Telugu review pending |
| `journey.gaan.future-conditional` | Distinguish explicit future `zal gaan` from conditional `zou gaan`. | OTTT, OVTT | 2 target-form slots | Primarily `ik`; bounded `zij/hij zal gaan` and conditional person contrasts. | Core A2 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.future-conditional` | Dutch/English/Telugu review pending |
| `journey.gaan.reference-completed` | Inspect and control earlier and completed-future movement constructions. | VVT, VTTT, VVTT | 3 target-form slots | Primarily `ik`; bounded recognition of plural/third-person reference forms. | Later/reference A2 | Meaning, construction, natural choice, map placement, delayed order | `skill.gaan.reference-completed` | Dutch/English/Telugu review pending |

## Journey detail records

Every row must receive exactly five stable story-line IDs, one notice with a
comparison, formula, formula note, valuable contrast, learner choice, and
feedback, one map/comparison destination, five core question IDs, zero to two
repair IDs, and a content-versioned evidence path.

| Journey | Story-line IDs | Notice comparison | Destination | Repair cap |
| --- | --- | --- | --- | ---: |
| `journey.gaan.ott-movement` | `story.gaan.ott-movement.01`–`.05` | present movement vs planned/explicit future | OTT map detail | 2 |
| `journey.gaan.ott-plans` | `story.gaan.ott-plans.01`–`.05` | ordinary present plan vs `gaan` + infinitive and inversion | OTT map detail and comparison | 2 |
| `journey.gaan.ovt-movement` | `story.gaan.ovt-movement.01`–`.05` | past movement/background vs present-linked completed event | OVT map detail | 2 |
| `journey.gaan.vtt-completed-movement` | `story.gaan.vtt-completed-movement.01`–`.05` | `ben/is/zijn gegaan` vs `ging` and selected `hebben` contrast | VTT map detail and comparison | 2 |
| `journey.gaan.future-conditional` | `story.gaan.future-conditional.01`–`.05` | `zal gaan` vs `zou gaan` | OTTT/OVTT map detail | 2 |
| `journey.gaan.reference-completed` | `story.gaan.reference-completed.01`–`.05` | earlier past vs completed future vs unrealised result | VVT/VTTT/VVTT map detail | 2 |

## Learner-language qualification

For every learner-visible Dutch, English, and Telugu string, record:

- reviewer identity and role;
- review date;
- source or rationale for Dutch usage and translations;
- status: `pending`, `reviewed`, or `release-ready`;
- any accepted alternative or ambiguity decision.

The qualification pass covers map canonical examples, map common-use examples,
stories, target spans, notices, formulas, formula notes, choices, feedback,
practice prompts, distractors, repairs, comparison cards, both comparison
detail roles, cues, mismatch notes, completion summaries, and accessibility
labels. English and Telugu checks separately confirm meaning and learner-facing
clarity; non-empty fields are insufficient.

## Compatibility checklist

- [x] Stable `werken`, `zijn`, and `hebben` verb IDs remain unchanged.
- [x] Existing evidence keys and learning-record revisions remain compatible.
- [x] Existing export/import records remain readable.
- [x] Compatible content changes are additive; incompatible migration is explicit and atomic on failure.
- [x] `gaan` does not create a second scheduler, mastery model, or evidence store.
- [x] Existing packs pass the shared multilingual map and English comparison contracts.
- [x] Empty, repeated-target, multi-form, and future-pack progress cases are tested.
- [x] Deferred auxiliary-course, broad-idiom, prototype, audio, runtime-AI, and Saved-resolution ideas remain parked.

## Release qualification status

- Structural validation: complete (`validateVerbJourneyRegistry`, 111 test files / 784 tests).
- Practice ownership and evaluator coverage: complete (six five-family banks, capped repairs).
- Learning-record and migration compatibility: complete (additive `020-1`/`020-2` handling).
- Popup/map/comparison DOM contract: complete through automated popup coverage and build.
- Dutch review: pending independent fluent-Dutch review.
- English/Telugu review: pending independent meaning/clarity review.
- Manual extension QA: pending automated checks and build.
