# 004-transfer: Research and Decision Rationale

Status: Consolidated research note for the approved Context Missions exploration

Related artifacts:

- [004-transfer plan](./004-transfer-plan.md)
- [004-transfer parking lot](./004-transfer-parking-lot.md)
- [DutchMate domain language](../../CONTEXT.md)

## Purpose

This document keeps the research, source annotations, product reasoning, and known limitations behind `004-transfer` in one place. It separates three kinds of claim:

1. **Research evidence**: what a cited study or official framework directly supports.
2. **Product inference**: how that evidence may inform DutchMate.
3. **Product decision**: a deliberate scope or interaction choice that still needs validation.

The distinction matters. Research supports retrieval, corrective feedback, and contextual encounters as learning mechanisms. It does not directly prove that DutchMate's exact tooltip, shuffled-fragment exercise, 20–45-second duration, or mastery integration will improve Dutch learning.

## Executive synthesis

| Finding | Confidence | Consequence for `004-transfer` |
| --- | --- | --- |
| Retrieving an L2 meaning can strengthen learning more than restudying alone. | Strong general mechanism; effects vary with timing, frequency, and time on task. | Saved repeat encounters may offer `Try from memory` before revealing meaning. |
| Attempting a meaning before corrective feedback can improve contextual word learning. | Supported in controlled adult L1/L2 experiments, not specifically Dutch or Telugu-speaking learners. | Preserve corrective reveal; do not pretend that a post-translation first encounter is inference. |
| Prompted output can make learners notice missing vocabulary. | Supported for the studied output and spoken-input task; transfer to silent self-commitment is uncertain. | Require a commitment before reveal, but describe this as a product hypothesis rather than proven pushed output. |
| Repeated encounters across contexts can enrich word knowledge. | Promising, with modest and proficiency-dependent contextual-diversity effects. | Use later real webpage encounters, while keeping early tasks highly scaffolded. |
| Multiword expressions matter, but not every selected phrase is a meaningful chunk. | Strong conceptual warning; instructional evidence is more limited. | Keep explicit learner confirmation and never auto-save arbitrary sentences. |
| Authentic, action-oriented language use is consistent with CEFR principles. | Strong framework alignment, not proof of learning effectiveness for this feature. | Optimize for real-world transfer and validate outside the original sentence. |
| The exact shuffled-fragment reconstruction exercise improves later transfer. | Unproven for this implementation. | Treat `Rebuild in context` as the central V1 learning hypothesis and test it directly. |
| Passive reading, news, video, and audio can support learning. | Supported, but outcomes are variable and require suitable input and attention. | Park these directions because of product fit and scope, not because they lack pedagogical value. |

## 1. Contextual attempt followed by corrective feedback

### Evidence

Elgort, Beliaeva, and Boers compared adult learners who received definitions before reading with learners who inferred meanings from context and then received definitions. In their experiments, the trial-and-error condition followed by definitions produced stronger declarative and nondeclarative word knowledge than definitions supplied before reading. The L2 experiment involved Chinese-speaking learners of English, and the target items appeared repeatedly in controlled texts.

Source: [Contextual word learning in the first and second language](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/contextual-word-learning-in-the-first-and-second-language/D3C1B4649450133D59D3334356BCF20C)

### Product inference

A genuine attempt before feedback is preferable to disguising restudy as inference. This supports the saved-repeat path in which DutchMate can offer `Try from memory` before a new translation is revealed.

It does not support asking a learner to infer a meaning immediately after the tooltip has already shown it. For a first encounter, `Practise this` therefore uses reconstruction after the normal translation rather than claiming an inference benefit.

### Limits

- The study did not test Dutch, Telugu-speaking learners, browser extensions, or shuffled fragments.
- Participants encountered controlled target vocabulary several times; one ordinary webpage selection is not equivalent.
- Incorrect inferences affected some knowledge measures, so corrective feedback remains essential.

## 2. Retrieval, repetition, and spacing

### Evidence

A review of adult L2 vocabulary-training studies concludes that retrieval practice has broad support for learning novel L2 vocabulary. It also shows that outcomes depend on task design, repetition, feedback, timing, and the knowledge measure used.

Source: [A review of laboratory studies of adult second-language vocabulary training](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/review-of-laboratory-studies-of-adult-second-language-vocabulary-training/18F0A5D1FFC829CE05931B2EEE83124A/share/9612bae4e131a6e3d9d0b0aacac044f5587eb6e0)

Nakata found that five or seven within-session retrievals produced higher delayed scores than one or three when practice exposure was not time-matched. When time on task was controlled, however, one retrieval produced the largest gain per unit of time. More retrieval is therefore not automatically more efficient.

Source: [Does repeated practice make perfect?](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/does-repeated-practice-make-perfect-the-effects-of-withinsession-repeated-retrieval-on-second-language-vocabulary-learning/F14BA8A576CD2563D14CEA46E35D842E)

### Product inference

- A repeat saved encounter is a defensible place for retrieval before reveal.
- One brief exercise is preferable to an obligatory chain of repetitions during reading.
- A replay may support learning, but DutchMate should not award repeated mastery updates from the same encounter.
- Delayed checks matter more than immediate completion when evaluating retention.

### Limits

- Paired-associate vocabulary tasks are simpler than understanding language in a real webpage.
- Retrieval success can reflect short-term memory if the answer was just seen.
- The evidence does not establish DutchMate's chosen 20–45-second interaction budget; that is a reading-flow decision.

## 3. Output and noticing vocabulary gaps

### Evidence

An experimental study found that noticing a gap in one's vocabulary aided later incidental L2 word learning from spoken input. Pushed output reliably induced that noticing across participants, while learner-generated noticing was less consistent.

Source: [Noticing vocabulary holes aids incidental second-language word learning](https://www.cambridge.org/core/journals/bilingualism-language-and-cognition/article/noticing-vocabulary-holes-aids-incidental-second-language-word-learning-an-experimental-study/42AF3995A8FF9D94399289040188CC2F)

### Product inference

`What does this mean here?` should require a learner to commit before `Show meaning`. `Put the Dutch back` should require an ordered response before correction. Both interactions make a knowledge gap visible rather than offering another passive exposure.

### Limits

- Silent mental commitment plus self-rating is weaker evidence than observable pushed language production.
- A word-bank reconstruction supplies every required form and is less demanding than free recall or spontaneous use.
- The no-typing, no-recording boundary is a low-friction product decision, not a conclusion of the output study.

## 4. Repeated encounters and contextual diversity

### Evidence

Recent research with Japanese learners of English compared repeated target-word encounters in texts with higher versus lower contextual diversity. Higher diversity improved delayed meaning recognition in some analyses, but the absolute effects were modest and benefits depended on prior vocabulary knowledge. Learners with lower lexical proficiency could benefit as much or more from thematically coherent, lower-diversity input before broader variation.

Source: [The effects of contextual diversity on incidental vocabulary learning](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-contextual-diversity-on-incidental-vocabulary-learning/F83A1EB55404E2E07FDC1695B0BC2BAE)

Another study of native- and foreign-language vocabulary learning found that repeated exposures and contextual variation affected learning differently across L1 and L2 conditions, reinforcing that foreign-language integration can require several encounters.

Source: [The effects of contextual diversity on incidental vocabulary learning in the native and a foreign language](https://pmc.ncbi.nlm.nih.gov/articles/PMC7435265/)

### Product inference

- A saved word or chunk reappearing on a different real webpage is a promising transfer opportunity.
- The stored page context should support the task without being counted as mastery by itself.
- Early learners may need a familiar helper meaning and exact original context before a later varied-context check.

### Limits

- Contextual diversity is not uniformly beneficial, especially for learners with smaller vocabularies.
- DutchMate does not control how often, where, or in what difficulty range an item reappears.
- A `Seen before` event is exposure evidence, not proof of recognition or recall.

## 5. Meaningful chunks and formulaic language

### Evidence

Myles and Cordier warn that “formulaic sequence” covers distinct linguistic and psycholinguistic concepts. A sequence conventional in the language is not automatically stored or processed as a unit by a particular learner. Research claims must therefore specify what kind of formulaicity is being discussed.

Source: [Formulaic sequence cannot be an umbrella term in SLA](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/formulaic-sequencefs-cannot-be-an-umbrella-term-in-sla/AFCD7233ACEC89C2A4314392127C5967)

Research on pedagogical approaches to formulaic sequences also notes that direct instructional evidence is comparatively limited and method-dependent.

Source: [Replication research in pedagogical approaches to formulaic sequences](https://www.cambridge.org/core/journals/language-teaching/article/replication-research-in-pedagogical-approaches-to-formulaic-sequences-jones-haywood-2004-and-alali-schmitt-2012/978A5CD1944A21297442E38B4BB151C1)

### Product inference

- Context Missions may practise any eligible short selection ephemerally.
- Only learner-confirmed words or candidate meaningful chunks enter Saved.
- A complete sentence remains context, not a card.
- DutchMate must not label every 2–12-word selection a meaningful chunk merely because it can be reconstructed.

## 6. CEFR action orientation and mediation

### Evidence

The CEFR Companion Volume expands language education beyond isolated linguistic knowledge to reception, production, interaction, online interaction, mediation, and plurilingual or pluricultural competence. Its action-oriented approach frames learners as social agents accomplishing meaningful tasks.

Source: [CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)

The Council of Europe's mediation guide describes designing cross-linguistic mediation tasks from CEFR descriptors and using a learner's plurilingual resources to work with texts, concepts, and communication.

Source: [Mediation in Teaching, Learning and Assessment](https://book.coe.int/en/education-and-modern-languages/12501-pdf-mediation-in-teaching-learning-assessment-metla-a-teaching-guide-for-language-educators.html)

### Product inference

Real-world transfer is a stronger north star than time in the extension. DutchMate's Dutch–English–Telugu triangle can support understanding across languages, and later validation should check whether learners recognize or reconstruct language in a different meaningful sentence.

### Limits

- CEFR is a framework, not experimental proof that Context Missions work.
- `Rebuild in context` is form-focused practice, not by itself a complete CEFR action or mediation task.
- Mission completion must not be converted into a CEFR level or can-do claim without separate validated assessment evidence.

## 7. Incidental content, news, video, and audio

### Evidence

A meta-analysis of meaning-focused input found that incidental L2 vocabulary learning occurs but gains vary substantially with learner, input, activity, and test characteristics. Exposure is useful, but it is not a dependable substitute for deliberate retrieval and feedback.

Source: [How effective is second-language incidental vocabulary learning?](https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/S0261444822000507)

Captioned and textually enhanced video studies report benefits for vocabulary recognition and production, and repeated dual-subtitled viewing can improve vocabulary gains. Pronunciation research reviews likewise conclude that pronunciation instruction can work, particularly when attention, focused practice, feedback, and meaningful communication align.

Sources:

- [Investigating textual enhancement and captions in L2 grammar and vocabulary](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/investigating-textual-enhancement-and-captions-in-l2-grammar-and-vocabulary/EF080D9AC64C7E2BFFB90AC799C38C69)
- [Vocabulary learning through viewing dual-subtitled videos](https://www.cambridge.org/core/journals/recall/article/vocabulary-learning-through-viewing-dualsubtitled-videos-immediate-repetition-versus-spaced-repetition-as-an-enhancement-strategy/CD13EC929B3F7B7EEEFAC0E367325770)
- [Phonological acquisition in instructed SLA](https://www.cambridge.org/core/journals/language-teaching/article/phonological-acquisition-in-instructed-sla-l2-pronunciation-training-in-and-beyond-the-classroom-and-individual-differences/EDADBFA61E348C389BF7EE9EACCFE4E2)

### Product rationale for parking

News, sayings, quotations, poems, songs, captioned media, listening, and pronunciation are not parked because research says they are worthless. They are parked because they would add content selection, licensing, editorial review, audio sourcing, permissions, speech capture, feedback quality, and cross-browser work before DutchMate validates its unique webpage-anchored practice loop.

The parking decision is sequencing, not a claim of pedagogical inferiority.

## 8. Reconstruction is a product hypothesis

The research above supports retrieval, output attempts, feedback, and contextual practice as mechanisms. It does not directly validate DutchMate's exact `Put the Dutch back` design.

Shuffled fragments provide all required forms, constrain possible answers, and can be solved partly through syntax or elimination. Correct order therefore indicates successful constrained reconstruction, not free production. An incorrect first attempt is useful corrective evidence, but a correct attempt must not be overinterpreted as spontaneous recall or real-world communicative ability.

Consequences:

- Call the result mission evidence, not proof of mastery.
- Update at most one existing recall dimension once per eligible saved encounter.
- Keep first-encounter reconstruction as exposure only.
- Validate delayed reconstruction in a different sentence rather than relying on immediate success.
- Compare practised items with translated-only items before claiming a learning benefit.

## 9. Accessibility rationale

The W3C's WCAG 2.2 guidance requires a non-dragging single-pointer alternative for dragging interactions and requires keyboard-operable functionality. Its guidance also requires visible keyboard focus and programmatically available status messages, and it describes dismissible, hoverable, persistent behavior for additional content opened on hover or focus.

Sources:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)
- [Understanding focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)
- [Understanding status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [Understanding content on hover or focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)

Product consequences:

- use tap or click-to-build controls instead of requiring drag-and-drop;
- support keyboard activation and visible focus;
- announce check results accessibly;
- provide a visible close action and Escape support; and
- keep the mission card operable without unexpectedly disappearing.

These are accessibility requirements and risk controls, not evidence that the exercise teaches language.

## 10. Translation cost and quota rationale

### Official service facts

Google Cloud Translation Basic bills processed text by character, not by language-model tokens. As checked on 22 July 2026, the official pricing page lists a monthly credit covering the first 500,000 characters and a rate of USD 20 per million characters beyond that tier for Basic NMT translation. Prices can change, so the official page remains authoritative.

Google also documents character and request quotas. All characters sent, including whitespace, count toward content usage. A request sent to two target languages processes the source separately for each target.

Sources:

- [Google Cloud Translation pricing](https://cloud.google.com/translate/pricing)
- [Google Cloud Translation quotas and limits](https://docs.cloud.google.com/translate/quotas)

### Current DutchMate evidence

- The backend uses Google's Basic v2 endpoint and submits the selected text plus one target language per provider call: [google-translate-provider.mjs](../../backend/providers/google-translate-provider.mjs).
- The webpage lookup currently issues one translation request for each active target language and retains the combined responses in the active lookup flow: [webpage-lookup-module.ts](../../src/content/webpage-lookup-module.ts).
- DutchMate has an in-memory request cache: [translation-cache.ts](../../src/translation/translation-cache.ts).
- Persistent translation caching is intentionally restricted to single words of at most 30 characters: [persistent-cache-policy.ts](../../src/translation/persistent-cache-policy.ts).

### Product consequence

`Practise this` must reuse the translation result already in memory. `Try from memory` must use the saved local helper meaning before any new provider call; `Translate now` remains the explicit path into the normal lookup. Tests must assert request counts rather than assuming that local exercise construction is free.

The zero-incremental-request rule does not claim that the original dual-language lookup is free. It means the mission adds no second lookup of its own.

## 11. Why Context Missions fit the current codebase

This section is repo evidence and architectural inference, not external learning research.

| Existing seam | Repo evidence | Why it matters |
| --- | --- | --- |
| In-page interaction | [webpage-lookup-module.ts](../../src/content/webpage-lookup-module.ts) already owns lookup state, selection results, save eligibility, contexts, and `Seen before`. | A mission can extend the existing selection flow instead of adding a popup destination. |
| Tooltip rendering | [tooltip-view-adapter.ts](../../src/content/tooltip-view-adapter.ts) already renders an interactive in-page tooltip and save controls. | A compact non-modal mission card deepens an existing surface. |
| Canonical learning items | [learning-record.ts](../../src/vocabulary/learning-record.ts) stores word or chunk identity, English and Telugu meanings, sources, and capped contexts. | Repeat missions can reuse one item instead of creating mission-specific cards. |
| Separate mastery dimensions | [learning-record.ts](../../src/vocabulary/learning-record.ts) and [daily-five.ts](../../src/vocabulary/daily-five.ts) already separate recognition and recall. | Mission evidence can target one existing dimension without creating another progress model. |
| Encounters are not mastery | [learning-record.ts](../../src/vocabulary/learning-record.ts) records encounters and merges at most three distinct recent contexts without changing recognition or recall. | A first encounter can remain exposure, while an explicit repeat exercise may provide practice evidence. |
| Popup navigation | [popup index.html](../../src/popup/index.html) already exposes Today, Lessons, and Saved. | A fourth tab would duplicate navigation for a short webpage-local exercise. |
| Chunk guardrail | [chunk-candidate.ts](../../src/content/chunk-candidate.ts) currently limits candidate chunks to 2–8 tokens, 80 characters, and no sentence punctuation. | The future spec must distinguish ephemeral 2–12-word mission eligibility from durable chunk-saving eligibility. |

## 12. Decision-by-decision rationale

| Approved decision | Evidence or constraint | Rationale |
| --- | --- | --- |
| Real-world transfer is the north star. | CEFR action orientation plus DutchMate's real-page context. | Measure later understanding or reconstruction, not time in the extension. |
| No new popup tab. | Existing three-area popup and a 20–45-second webpage task. | Keep practice beside the original context and avoid another content destination. |
| Deliberate selection only. | Existing explicit-capture posture and reading-flow risk. | Learner initiation preserves control and avoids automatic page scanning or interruption. |
| First and repeat paths differ. | Inference must precede feedback to be genuine. | First encounters rebuild after translation; saved repeats can retrieve before reveal. |
| One exercise per mission. | Retrieval works, but more repetitions are not always more efficient. | Minimize interruption and avoid turning a webpage action into a lesson session. |
| No typing or recording in V1. | Popup-sized interaction, privacy, permission, and friction constraints. | Use constrained retrieval first; do not claim it equals free production. |
| Local deterministic construction. | Google cost, latency, privacy, and quality risks; required inputs already exist locally. | Prove the learning loop before adding a generative dependency. |
| No automatic saving. | Formulaic-sequence ambiguity and canonical Saved model. | Arbitrary phrases and complete sentences must not become cards without learner control. |
| Shared recognition and recall mastery. | Existing local learning record already owns both dimensions. | Avoid duplicate schedules, currencies, or progress claims. |
| Ephemeral mission state. | One short task needs no resume flow; existing capped contexts are sufficient. | Avoid storing URLs, answers, histories, or unfinished queues. |
| Engineering proof before shipping; delayed evidence before validation. | Immediate completion is weak evidence of retention or transfer. | Keep “shippable” separate from “learning-validated.” |

## 13. Why the other ranked ideas remain parked

| Parked direction | Rationale |
| --- | --- |
| Pattern Lab and sentence coaching | Needs dependable linguistic analysis and evidence that sentence structure is the next learner barrier; otherwise it becomes an unbounded explanation tool. |
| Can-do Passport | Mission completion cannot support credible real-world capability or CEFR claims without validated task and assessment rules. |
| Personalized remix lessons | Adds selection, sequencing, difficulty, fallback, and content-quality problems before webpage practice is validated. |
| Pronunciation and listening | Pedagogically promising, but introduces audio sources, permissions, capture, feedback quality, and browser behavior. |
| Narrow reading and headline trails | Could support repeated input, particularly for beginners, but adds source selection, freshness, licensing, and an editorial pipeline. |
| Daily Dutch brief | A feed needs deliberate learning mechanics and continuing news operations; novelty is not a learning measure. |
| Pragmatics and culture decoder | Requires expert contextual and cultural review; literal translation is insufficient for socially appropriate language advice. |
| Cultural media lab | May be memorable, but adds attribution, translation review, copyright, licensing, and possibly audio rights. |
| AI-generated missions | Breaks the deterministic cost boundary and adds latency, privacy, prompt, quality, and failure-mode obligations. |
| Mission history or popup destination | Optimizes activity and navigation before evidence shows that a short ephemeral exercise needs persistence. |

The full revisit signals remain in [004-transfer-parking-lot.md](./004-transfer-parking-lot.md).

## 14. Known evidence gaps and risks

1. **Population transfer**: most cited experiments involve learners of English, not Telugu-speaking adults learning Dutch in the Netherlands.
2. **Task transfer**: no cited study directly tests DutchMate's exact non-modal tooltip or tap-to-rebuild fragments.
3. **Constrained recall**: shuffled supplied words reduce retrieval difficulty and can permit elimination strategies.
4. **Self-rating validity**: `Again` and `Got it` depend on honest learner judgment and are not objective recognition tests.
5. **Translation quality**: a technically successful machine translation may still be contextually imperfect, especially for chunks, idioms, or short ambiguous selections.
6. **Selection bias**: learners choose what to practise, so practised and translated-only items may differ in difficulty or personal relevance.
7. **Encounter timing**: natural webpage repeats are uncontrolled; some learners may not see the same item again soon enough.
8. **Beginner load**: contextual variability and fragment reconstruction may be too difficult when surrounding vocabulary is unfamiliar.
9. **Novelty effects**: initial enjoyment or completion does not demonstrate retention.
10. **No passive telemetry**: voluntary studies provide stronger evidence but smaller samples and slower feedback.

## 15. Validation implications

The first study should test the feature's central hypothesis, not every possible benefit.

Recommended within-learner comparison:

1. Select several items each learner does not already know.
2. Give half the normal translation-only flow.
3. Give half translation plus the eligible Context Mission.
4. Recheck after 2–7 days.
5. Test meaning recognition and Dutch reconstruction separately.
6. Use a different sentence so verbatim short-term memory is insufficient.
7. Observe whether the mission interrupts reading or causes learners to avoid selection translation.
8. Record prior familiarity, item difficulty, and which helper language was shown.

Do not claim success solely from:

- mission starts or completions;
- immediate correct reconstruction;
- repeat usage;
- time spent;
- an increase in saved items; or
- positive novelty feedback without delayed performance evidence.

## Annotated source register

| Source | Type | Used for | Main caution |
| --- | --- | --- | --- |
| [Elgort, Beliaeva, and Boers](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/contextual-word-learning-in-the-first-and-second-language/D3C1B4649450133D59D3334356BCF20C) | Controlled L1/L2 experiments | Contextual attempt followed by feedback | English targets and controlled repeated texts, not DutchMate. |
| [Adult L2 vocabulary-training review](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/review-of-laboratory-studies-of-adult-second-language-vocabulary-training/18F0A5D1FFC829CE05931B2EEE83124A/share/9612bae4e131a6e3d9d0b0aacac044f5587eb6e0) | Research review | Retrieval-practice mechanism | Laboratory tasks do not equal authentic reading. |
| [Nakata](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/does-repeated-practice-make-perfect-the-effects-of-withinsession-repeated-retrieval-on-second-language-vocabulary-learning/F14BA8A576CD2563D14CEA46E35D842E) | Controlled vocabulary experiment | Repetition and time-efficiency trade-off | More repetitions were not best when time was controlled. |
| [Noticing vocabulary holes](https://www.cambridge.org/core/journals/bilingualism-language-and-cognition/article/noticing-vocabulary-holes-aids-incidental-second-language-word-learning-an-experimental-study/42AF3995A8FF9D94399289040188CC2F) | Experimental study | Pushed output and noticing | Mental commitment is not equivalent to observed output. |
| [Oikawa and Uchihara](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-contextual-diversity-on-incidental-vocabulary-learning/F83A1EB55404E2E07FDC1695B0BC2BAE) | Controlled reading experiment | Contextual diversity and proficiency moderation | Effects were modest and not uniformly positive. |
| [Frances et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7435265/) | L1/L2 experiment | Repeated exposure and contextual diversity | Foreign-language learning differed from native-language learning. |
| [Myles and Cordier](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/formulaic-sequencefs-cannot-be-an-umbrella-term-in-sla/AFCD7233ACEC89C2A4314392127C5967) | Conceptual and methodological article | Meaningful-chunk guardrail | Does not validate DutchMate's chunk classifier. |
| [Boers et al. replication research](https://www.cambridge.org/core/journals/language-teaching/article/replication-research-in-pedagogical-approaches-to-formulaic-sequences-jones-haywood-2004-and-alali-schmitt-2012/978A5CD1944A21297442E38B4BB151C1) | Replication studies | Limits of formulaic-sequence instruction claims | Findings are method- and population-dependent. |
| [CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions) | Official framework | Action orientation, mediation, plurilingualism | Framework alignment is not causal evidence. |
| [Council of Europe mediation guide](https://book.coe.int/en/education-and-modern-languages/12501-pdf-mediation-in-teaching-learning-assessment-metla-a-teaching-guide-for-language-educators.html) | Official teaching guide | Cross-linguistic mediation task design | Context Missions V1 does not yet implement full mediation tasks. |
| [Incidental vocabulary meta-analysis](https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/S0261444822000507) | Meta-analysis | Limits and variability of passive input | Aggregated outcomes vary by input, learner, activity, and test. |
| [Captioned video study](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/investigating-textual-enhancement-and-captions-in-l2-grammar-and-vocabulary/EF080D9AC64C7E2BFFB90AC799C38C69) | Controlled experiment | Evidence that parked media can teach | Does not remove sourcing or product-scope costs. |
| [Dual-subtitle repetition study](https://www.cambridge.org/core/journals/recall/article/vocabulary-learning-through-viewing-dualsubtitled-videos-immediate-repetition-versus-spaced-repetition-as-an-enhancement-strategy/CD13EC929B3F7B7EEEFAC0E367325770) | Controlled experiment | Audiovisual vocabulary learning | English-learning population and specific video conditions. |
| [Pronunciation review](https://www.cambridge.org/core/journals/language-teaching/article/phonological-acquisition-in-instructed-sla-l2-pronunciation-training-in-and-beyond-the-classroom-and-individual-differences/EDADBFA61E348C389BF7EE9EACCFE4E2) | State-of-the-art review | Evidence that parked pronunciation work can help | Effective implementations require focused instruction and feedback. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | W3C Recommendation | Keyboard, focus, status, and non-drag requirements | Accessibility compliance does not establish pedagogy. |
| [Google pricing](https://cloud.google.com/translate/pricing) | Official service documentation | Character-based cost | Pricing is time-sensitive. |
| [Google quotas](https://docs.cloud.google.com/translate/quotas) | Official service documentation | Character and request limits | Quotas and defaults can change. |

## Maintenance rule

When a later spec, ticket, implementation, or learner study introduces a new research claim or reverses a rationale recorded here:

1. add the primary source and its limitation to this document;
2. distinguish the new evidence from DutchMate's inference;
3. update the related decision in the plan or parking lot; and
4. do not silently upgrade an experimental feature to “learning-validated” without delayed evidence.
