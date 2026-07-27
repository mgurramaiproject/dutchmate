# 009-proficiency-path: Research and Source Rationale

**Status:** Supporting research for the approved A0 grammar specification
**Checked:** 27 July 2026

Related artifacts:

- [009 proficiency-path plan](./009-proficiency-path-plan.md)
- [009 proficiency-path specification](./009-proficiency-path-spec.md)
- [DutchMate domain language](../../CONTEXT.md)
- [consolidated feature parking lot](./feature-parking-lot.md)

## Purpose

This note preserves the language-framework, Dutch-grammar, browser-platform, learning-science, and repository evidence behind `009-proficiency-path`. It separates three kinds of statement:

1. **Source fact**: what an official source, research paper, or current repository artifact directly establishes.
2. **Product inference**: how that evidence informs DutchMate without pretending the source tested DutchMate.
3. **Product decision**: an approved constraint recorded in the plan or specification.

The distinction matters. CEFR descriptors do not prescribe a Dutch verb syllabus. Memory research does not prove that DutchMate's click-only grammar exercises improve Dutch. Browser APIs permitting DOM access do not make automatic page analysis necessary or privacy-preserving.

## Executive synthesis

| Finding | Confidence and limit | Consequence for `009-proficiency-path` |
| --- | --- | --- |
| The official ERK scale presented by Taalunie runs from A1 to C2; the Council of Europe Companion Volume adds Pre-A1 descriptors below A1. | Strong framework fact. Neither framework calls this level A0 or prescribes the four DutchMate patterns. | Treat `A0` as DutchMate's learner-friendly label for its Pre-A1 foundation, never as formal CEFR certification. |
| Pre-A1 relies heavily on isolated words, basic expressions, and formulaic repertoire; A1 begins to use very basic one-clause structures for concrete needs. | Strong framework alignment, not a content-placement validation. | Keep the first grammar release small, practical, scaffolded, and capability-based. |
| Standard Dutch present tense uses the stem, stem + `t`, and the infinitive according to person and number. `jij/je` after the finite verb loses the `t`; `u` retains it. | Strong official spelling and grammar guidance. | Deterministic answer sets and misconception-coded distractors can represent these contrasts exactly. |
| Both `u hebt` and `u heeft` are correct. | Strong authoritative usage guidance. Some organizations choose one by house style. | Accept both in neutral exercises unless a reviewed context deliberately teaches a narrower style. |
| Content scripts can read and modify matched webpage DOM. Isolated execution worlds protect JavaScript environments, not the confidentiality of DOM text from the extension. | Strong browser-platform fact. Store policy and applicable law add requirements beyond API capability. | Keep Encounter Coaching inside the ordinary learner-triggered lookup, perform no page scan, and persist no matched page text. |
| Retrieval and distributed practice often improve delayed retention compared with restudy or massed practice. | Strong general memory evidence, but results depend on material, timing, task, and comparison condition. | Use scored retrieval across sessions and delayed checks; do not claim that the exact schedule is research-proven. |
| Transfer from retrieval practice is possible but conditional and sometimes weak or absent after bias adjustment. | Strong meta-analytic caution. The evidence is not specific to Dutch grammar or constrained click tasks. | Require unseen or reviewed recombined evidence for `Applied`, while describing it as bounded product evidence rather than independent production. |
| The current code already has stable lesson identities, a versioned local learning record, one Daily Five, and learner-triggered webpage lookup seams. | Strong repository fact at the checked commit state. Future implementation may change exact code shapes. | Extend existing seams and preserve all twelve published lessons and their progress. |

## 1. CEFR, ERK, and the A0/Pre-A1 boundary

### Source facts

The Taalunie ERK overview presents six official levels, A1 through C2, across reading, listening, writing, speaking, and spoken interaction. It also warns that language development is continuous: two learners at the same broad level may have different strengths, fluency, sentence-building ability, or grammatical accuracy.

Source: [Taalunie, Over het ERK](https://erk-nederlands.taalunie.org/over-het-erk/)

The Council of Europe describes six levels from A1 through C2. Its descriptors are language-independent; language-specific Reference Level Descriptions are needed for detailed content specifications.

Sources:

- [Council of Europe, The framework](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context)
- [Council of Europe, Reference Level Descriptions](https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions)

The 2020 CEFR Companion Volume introduced **Pre-A1** below A1. It describes Pre-A1 as a milestone on the way to A1 where the learner does not yet have generative capacity and relies on a repertoire of words and formulaic expressions.

Source: [Council of Europe, CEFR Companion Volume](https://book.coe.int/en/education-and-modern-languages/8152-common-european-framework-of-reference-for-languages-learning-teaching-assessment-companion-volume.html)

In the Council of Europe's searchable descriptors:

- Pre-A1 general linguistic range includes using isolated words and basic expressions to give simple personal information.
- A1 includes a very basic range of expressions about personal details and concrete needs, plus some basic structures in one-clause sentences, potentially with omissions or reductions.

Source: [Council of Europe, CEFR descriptors search](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search)

Taalunie's worked assessment pages explicitly caution that a single performance is insufficient to determine a learner's language level.

Source: [Taalunie ERK-Nederlands, example assessment](https://erk-nederlands.taalunie.org/beoordelingen/b20220209032853/)

### Product inference

- DutchMate's `A0` label is an internal, learner-friendly label for its Pre-A1 foundation. It is not a seventh official ERK level.
- `zijn`, `hebben`, regular present agreement, and simple yes/no inversion are plausible foundation content because they support personal information and concrete everyday needs. The CEFR sources do **not** validate that exact sequence.
- One correct click task, one completed lesson, or one successfully practised pattern cannot establish an A1 or A2 level. CEFR proficiency spans multiple communicative activities and competences.
- The learner-facing states **Introduced**, **Practising**, and **Applied** should remain statements about DutchMate evidence, not CEFR attainment.

### Approved product boundary

The first public grammar delivery remains A0/Pre-A1 only. A1 and A2 grammar expansion is deferred until the A0 loop passes its release gates; B1 is outside DutchMate's target scope. The existing A1 and A2 lesson labels remain catalog organization, not certification.

## 2. Authoritative Dutch present-tense guidance

The Nederlandse Taalunie is responsible for the official Woordenlijst spelling rules. The electronic Algemene Nederlandse Spraakkunst (ANS) is maintained by the Instituut voor de Nederlandse Taal. Taaladvies.net is produced by the Instituut voor de Nederlandse Taal, Taalunie, Onze Taal, and the Vlaamse Taaltelefoon. Together these are appropriate first-line references for released grammar content.

### Regular present tense

The official Woordenlijst rule gives this present-tense pattern:

| Subject position | Form | Example |
| --- | --- | --- |
| first-person singular | stem | `ik werk` |
| `jij/je`, `u`, or third-person singular before the verb | stem + `t` | `jij werkt`, `u werkt`, `hij werkt` |
| `jij/je` after the finite verb | stem, without added `t` | `werk jij`, `werk je` |
| `u` after the finite verb | stem + `t` | `werkt u` |
| plural | infinitive form | `wij/jullie/zij werken` |

The rule also covers spelling effects: a stem already ending in `t` does not receive a written double `t`, while a stem ending in `d` can produce `-dt`.

Sources:

- [Woordenlijst, 11.1 zoek de stam](https://woordenlijst.org/zoeken/leidraad/11/1.html)
- [Woordenlijst, 11.2 tegenwoordige tijd](https://woordenlijst.org/zoeken/leidraad/11/2.html)
- [ANS, formation of the present tense](https://e-ans.ivdnt.org/topics/pid/ans0203020802lingtopic)
- [ANS, overview of regular verb conjugation](https://e-ans.ivdnt.org/topics/pid/ans020303lingtopic)

### `zijn`

ANS records the ordinary present forms:

| Subject | Form |
| --- | --- |
| `ik` | `ben` |
| `jij/je` | `bent` |
| inversion with `jij/je` | `ben jij/je` |
| `u` | `bent` |
| `hij/zij/het` | `is` |
| `wij/we`, `jullie`, `zij/ze` | `zijn` |

ANS lists `u is` as little used, while Taaladvies.net calls it outdated and recommends `u bent`.

Sources:

- [ANS, Zijn (wezen)](https://e-ans.ivdnt.org/topics/pid/ans02030605lingtopic)
- [Taaladvies.net, U is / bent](https://taaladvies.net/u-is-of-bent/)

### `hebben` and the accepted `u` alternatives

ANS records `ik heb`, `jij/je hebt`, inverted `heb jij/je`, `hij/zij/het heeft`, and the plural forms with `hebben`. For `u`, both `u hebt` and `u heeft` occur.

Taaladvies.net states directly that both `u hebt` and `u heeft` are correct. The choice may follow personal preference or an organization's house style.

Sources:

- [ANS, Hebben](https://e-ans.ivdnt.org/topics/pid/ans02030601lingtopic)
- [Taaladvies.net, U heeft / hebt](https://taaladvies.net/u-heeft-of-hebt/)

### Inversion and the `t` contrast

Taaladvies.net defines inversion as word order in which the subject follows the finite verb. One of its two named cases is a yes/no question with the finite verb first.

Source: [Taaladvies.net, Inversie](https://taaladvies.net/termen-inversie/)

The Woordenlijst makes the spelling contrast explicit:

- `jij werkt` / `je werkt` become `werk jij` / `werk je`;
- `u werkt` remains `werkt u`;
- the same distinction applies to stems ending in `d`, as in `jij wordt` / `word jij`, but `u wordt` / `wordt u`.

Source: [Woordenlijst, 11.2 tegenwoordige tijd](https://woordenlijst.org/zoeken/leidraad/11/2.html)

### Product implications

- The approved misconception categories—wrong person agreement, omitted `t`, retained `t` after `jij/je` inversion, dropped `t` with `u`, wrong irregular form, and invalid word order—map to documented contrasts rather than invented distractors.
- A neutral `hebben` exercise involving `u` must enumerate both correct alternatives when both fit. If a task cannot enumerate all accepted forms, it should be omitted or rewritten.
- Content review should verify the complete sentence, not only the verb table. Meaning, register, pronoun choice, and word order can make a mechanically possible form unsuitable.
- The archived Valley Trail verb list may inspire prioritization, but these official grammar sources should control forms and explanations. The list should not be copied without an established reuse license.

### Limits

- These sources establish standard forms and accepted variation; they do not determine which examples are comprehensible or motivating for an A0 learner.
- A correct form selected from visible alternatives demonstrates constrained recognition or application, not spontaneous speaking or writing.
- Regional and stylistic variation exists. The first release deliberately teaches a reviewed, bounded subset rather than claiming to represent every variety of Dutch.

## 3. Browser-extension capability and privacy boundaries

### Official platform facts

Chrome documents that content scripts can use the DOM to read and modify details of visited webpages and can message the rest of the extension. Chrome's **isolated world** prevents a page, an extension content script, and other extensions from seeing one another's JavaScript variables. That isolation does not prevent an authorized content script from reading the shared page DOM.

Source: [Chrome Extensions, Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)

Chrome advises extensions to request only permissions required for current functionality and notes that the less data an extension can access, the less it can accidentally leak. It presents `activeTab` as a temporary, user-invoked alternative for extensions that do not need persistent host access.

Sources:

- [Chrome Extensions, Protect user privacy](https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy)
- [Chrome Extensions, The activeTab permission](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)

Mozilla likewise documents that content scripts can read and modify page content when the extension has the necessary host access, can use messaging to reach background extension code, and cannot run on certain privileged pages.

Source: [MDN, Content scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)

Mozilla's add-on policy requires requested permissions to be necessary. It requires data transmission to be limited to what the stated function needs, prohibits ancillary transmission, and treats browsing activity as transmissible only as part of the add-on's primary function. Its self-evident single-use exception is purpose-bounded and user-initiated, and limits transmission to the content element on which the learner acted.

Source: [Firefox Extension Workshop, Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)

### Current DutchMate facts

- The generated Manifest V3 content script is registered on `http://*/*` and `https://*/*`. Encounter Coaching therefore does not require a broader content-script match pattern than the current hover and selection feature already uses: [manifest generator](../../scripts/write-manifest.mjs).
- The production network host permission is limited to the configured DutchMate backend, while local test builds add localhost and HTTPS hosts: [manifest generator](../../scripts/write-manifest.mjs).
- Content scripts already own webpage hover, selection, and tooltip interaction, while the background worker owns provider calls: [architecture notes](../architecture/architecture.md).
- The learner-triggered lookup module already receives bounded lookup text and optional page context through its public input rather than requiring a new page-scanning subsystem: [webpage lookup module](../../src/content/webpage-lookup-module.ts).

### Product inference

Encounter Coaching is not inherently forbidden by browser privacy or security rules. The browser grants the existing content script technical access to matched pages. The privacy question is what DutchMate chooses to inspect, transmit, and retain within that capability.

The approved design deliberately sets a narrower boundary than the technical permission:

- matching occurs only while DutchMate handles an ordinary learner-triggered hover or selection lookup;
- there is no page-load scan, background grammar crawl, automatic highlighting, or unrelated-text inspection;
- matching uses a finite local inventory and adds no provider or generative request;
- the matched page sentence, URL, raw answer, and encounter history are not persisted for grammar progress; and
- an uncertain or unstudied match produces no grammar UI.

Changing the entire extension to `activeTab` is not part of `009`. DutchMate's existing passive hover interaction depends on a registered content script being present before a toolbar click. Permission minimization should still be reviewed separately if that interaction model changes.

### Limits and release checks

- Browser permission is not user comprehension. Store disclosures and in-product copy must accurately describe website-content access and any transmission.
- Isolated-world execution is a security boundary between JavaScript environments, not a promise that page text stays unread by the extension.
- Mozilla policy can change, and privacy law depends on distribution and jurisdiction. Store policy and disclosures should be rechecked at release time.
- Tests can prove that the implementation makes zero additional requests and writes no raw page text. They cannot alone prove that users understand or trust the interaction; the pilot must examine disruption and expectations.

## 4. Learning evidence: retrieval, spacing, variation, and delay

### Retrieval versus restudy

Roediger and Karpicke compared repeated study with immediate free-recall testing on prose passages. Repeated study helped more on a five-minute test, but prior testing produced better retention on tests after two days or one week. The tests in these experiments did not include corrective feedback.

Source: [Roediger and Karpicke (2006), Test-Enhanced Learning](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/)

**Product inference:** DutchMate should not equate smooth immediate repetition with durable learning. First-Check evidence on a later session is more credible than a corrected retry immediately after feedback.

**Limit:** The experiments tested university students recalling prose, not A0 learners choosing Dutch verb forms. They do not validate click-only exercise primitives or DutchMate's progress thresholds.

### Distributed practice

Cepeda and colleagues synthesized 839 assessments from 317 experiments in 184 articles. They found a broad distributed-practice effect and, importantly, that the most effective spacing interval depended on the intended retention interval.

Source: [Cepeda et al. (2006), Distributed practice in verbal recall tasks](https://pubmed.ncbi.nlm.nih.gov/16719566/)

**Product inference:** Revisiting patterns on later days is better justified than completing all evidence in one session. The scheduling interval and the learner-facing progress state should remain separate.

**Limit:** The review does not prescribe DutchMate's `1, 3, 7, 14, 30, 60`-day schedule. Optimal timing depends on the desired retention period, material, learner, and retrieval success.

### Transfer and varied evidence

Pan and Rickard's meta-analysis included 192 effect sizes from 122 experiments and 10,382 participants. Relative to non-testing re-exposure, the overall transfer effect was `d = 0.40`, but transfer varied substantially by task. Response congruency, elaborated retrieval, and initial test performance moderated results. Bias-adjusted intercept estimates were often greatly reduced and sometimes indicated no positive transfer without those favorable conditions.

Source: [Pan and Rickard (2018), Transfer of Test-Enhanced Learning](https://doi.org/10.1037/bul0000151)

**Product inference:** Evidence across different reviewed primitives, lexical contexts, and unseen or recombined exercises is more honest than repeatedly serving one sentence. It tests a modest degree of controlled application.

**Limit:** “Varied” does not guarantee far transfer. DutchMate's `Applied` state cannot imply independent conversation, uncued writing, permanent retention, or broad grammatical competence.

### Second-language evidence

Rice and Tokowicz's review of adult laboratory studies concludes that L2 vocabulary training based only on massed L1–L2 repetition is generally weak, while spacing combined with retrieval or semantic elaboration can strengthen learning. The review also identifies important gaps and task-specific limitations.

Source: [Rice and Tokowicz (2020), Review of adult second-language vocabulary training](https://doi.org/10.1017/S0272263119000500)

**Product inference:** It is reasonable to combine spaced retrieval with meaning-bearing lexical contexts instead of teaching a bare conjugation table alone.

**Limit:** This is primarily adult vocabulary evidence, not evidence for Dutch morphosyntax, A0 learners, Telugu-supported instruction, or browser-extension exercises.

### What the evidence does and does not justify

The research supports the **mechanisms** behind the approved loop:

- retrieve rather than only reread;
- correct a known misconception with exact feedback;
- revisit after time has passed;
- vary reviewed examples and task demands; and
- measure delayed performance separately from immediate correction.

It does not establish:

- the exact scheduling intervals;
- the exact number of exercises, contexts, or days required for `Applied`;
- superiority of click-only practice over typing, speaking, or instruction with a teacher;
- that an Encounter Coaching tooltip improves learning;
- that completing DutchMate content produces a CEFR level; or
- a marketable claim that DutchMate is scientifically proven to teach Dutch.

The approved 6–10-person pilot is therefore a product-learning gate, not an efficacy trial. A baseline and a delayed unseen or reviewed-recombined check can expose whether the content moves in the intended direction; they cannot estimate a reliable population effect.

## 5. Repository evidence and architectural fit

This section records the checked repository state as primary implementation evidence. It is not external research.

| Existing seam or constraint | Repository evidence | `009` implication |
| --- | --- | --- |
| Bundled lesson catalog | The catalog defines stable lesson IDs, content versions, A0/A1/A2 labels, teaching lines, candidate items, practice prompts, and review flags. Its exported list contains twelve lessons: [lesson catalog](../../src/lessons/catalog.ts). | Add grammar companions and three gap-filling A0 lessons without re-keying or replacing the twelve published lessons. |
| Versioned lesson progress | Lesson progress is keyed by lesson ID plus content version in the local learning record: [learning record](../../src/vocabulary/learning-record.ts). | Preserving existing IDs and versions protects visible completion; new grammar evidence needs separate pattern identities. |
| Local, language-keyed learning record | The record is local, versioned, exportable, and explicitly keyed to Dutch. The accepted ADR preserves a Dutch learning key without adding language switching: [learning record ADR](../adr/0004-002-learnloop-language-keyed-learning-record.md). | Add only compact grammar scheduling and evidence summaries; do not create a cloud learner profile. |
| Separate vocabulary evidence | Recognition and recall are separate, and the accepted interaction avoids typing while acknowledging that tap evidence is weaker: [contextual mastery ADR](../adr/0003-002-learnloop-contextual-mastery-separates-recognition-and-recall.md). | Pattern progress must stay separate from vocabulary mastery and must not be called free production. |
| One daily practice habit | Daily Five currently creates a stable five-task local snapshot and applies calm interval changes: [Daily Five](../../src/vocabulary/daily-five.ts). The accepted popup ADR keeps one dominant Today action: [Daily Edition ADR](../adr/0005-002-learnloop-daily-edition-uses-lesson-stage-rail.md). | Mix at most two grammar tasks into Daily Five instead of adding Grammar Minute or a second scheduler. |
| Focused lesson posture | The current lesson state uses Read, Notice, Practise, Replay, and Keep stages: [lesson session](../../src/popup/lesson-session.ts). | A grammar companion belongs inside the existing lesson flow, with no new top-level grammar destination. |
| Typed background boundary | Learning operations and validation enter through typed runtime messages: [background messages](../../src/background/messages.ts). | Extend the existing learning contract for pattern results, migration, import/export, and idempotency. |
| Learner-triggered webpage lookup | The lookup module owns the active hover/selection result, page context, provider transport, and tooltip events: [webpage lookup module](../../src/content/webpage-lookup-module.ts). | Add deterministic studied-pattern matching at this seam, not a page scanner. |
| Browser-specific packaging | The architecture uses Manifest V3 builds for Chrome and Firefox with separate background declarations: [architecture notes](../architecture/architecture.md) and [manifest generator](../../scripts/write-manifest.mjs). | Keep privacy and zero-request tests cross-browser and verify generated manifests at release time. |

No new ADR is warranted by this research. The approved specification preserves the existing architectural decisions: local language-keyed learning data, separate recognition and recall mastery, one Daily Five, the accepted lesson rail, and content-script ownership of learner-triggered page interaction.

## 6. Content-authoring and review guidance

The evidence above leads to a deliberately conservative release process:

1. Use Woordenlijst, ANS, and Taaladvies.net to establish forms, word order, accepted alternatives, and explanations.
2. Author linguistically sensitive exercises completely. Use bounded templates only when every generated sentence, accepted answer, distractor, misconception category, and feedback message can be expanded and inspected before release.
3. Make the generated review report readable without opening source code.
4. Record author, content version, source links, reviewer, review date, and reuse provenance.
5. Permit self-review for the internal tracer, but require a second fluent Dutch reviewer with grammar-teaching competence for public A0 content.
6. Treat AI output and unaudited verb tables as drafting aids, never as linguistic approval.
7. Recheck source guidance and browser-store policy when content or permissions change.

The second reviewer does not need formal NT2 certification. Independence matters: if the owner authored the content, another qualified person reviews it; if someone else authored it, the owner may be the reviewer if sufficiently fluent and competent to evaluate the teaching choices.

## Source register

| Area | Source | Authority and use | Important limitation |
| --- | --- | --- | --- |
| ERK | [Taalunie ERK overview](https://erk-nederlands.taalunie.org/over-het-erk/) | Official Dutch-language ERK overview; levels, skills, and continuous development caution. | Does not include an official A0 level or prescribe DutchMate content. |
| CEFR | [Council of Europe framework](https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context) and [Reference Level Descriptions](https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions) | Framework owner; six-level model and the distinction between language-independent descriptors and language-specific content. | Broad reference framework, not a Dutch syllabus. |
| CEFR | [CEFR Companion Volume](https://book.coe.int/en/education-and-modern-languages/8152-common-european-framework-of-reference-for-languages-learning-teaching-assessment-companion-volume.html) | Framework owner; introduction and framing of Pre-A1. | Pre-A1 is not named A0. |
| CEFR | [CEFR descriptors search](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search) | Framework owner; specific Pre-A1 and A1 descriptors. | Individual descriptors do not establish a whole level. |
| CEFR assessment | [Taalunie example assessment](https://erk-nederlands.taalunie.org/beoordelingen/b20220209032853/) | Taalunie example; explicit warning against inferring level from one performance. | One illustrative assessment page. |
| Dutch spelling | [Woordenlijst present tense](https://woordenlijst.org/zoeken/leidraad/11/2.html) | Official Taalunie spelling rule; stem, `t`, plural, `jij/je` inversion, and `u`. | Does not provide A0 pedagogy. |
| Dutch spelling | [Woordenlijst stem formation](https://woordenlijst.org/zoeken/leidraad/11/1.html) | Official spelling rule; stem derivation and spelling changes. | Released examples still need sentence-level review. |
| Dutch grammar | [ANS present tense](https://e-ans.ivdnt.org/topics/pid/ans0203020802lingtopic) | Authoritative descriptive grammar; person and number pattern. | Descriptive grammar, not a learner curriculum. |
| Dutch grammar | [ANS regular verbs](https://e-ans.ivdnt.org/topics/pid/ans020303lingtopic) | Authoritative conjugation overview with inversion examples. | Includes forms beyond the approved A0 subset. |
| Dutch grammar | [ANS Zijn](https://e-ans.ivdnt.org/topics/pid/ans02030605lingtopic) | Authoritative conjugation table for `zijn`. | Notes variation that DutchMate may intentionally exclude. |
| Dutch grammar | [ANS Hebben](https://e-ans.ivdnt.org/topics/pid/ans02030601lingtopic) | Authoritative conjugation table for `hebben`. | Style and context still matter. |
| Dutch usage | [Taaladvies.net, U heeft / hebt](https://taaladvies.net/u-heeft-of-hebt/) | Authoritative joint language-advice source; both alternatives accepted. | Organizations may choose one house style. |
| Dutch usage | [Taaladvies.net, U is / bent](https://taaladvies.net/u-is-of-bent/) | Authoritative joint language-advice source; `u bent` current standard recommendation. | Does not enumerate the full `zijn` paradigm. |
| Dutch syntax | [Taaladvies.net, Inversie](https://taaladvies.net/termen-inversie/) | Authoritative definition and yes/no question examples. | Broad definition; spelling contrast comes from Woordenlijst/ANS. |
| Chrome | [Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) | Browser owner documentation; DOM capability, messaging, isolated worlds. | API capability is not privacy consent. |
| Chrome | [Protect user privacy](https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy) | Browser owner guidance; data and permission minimization. | Guidance does not replace store policy or law. |
| Chrome | [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) | Browser owner documentation; temporary user-invoked tab access. | Does not fit the current persistent hover model without redesign. |
| Firefox | [MDN content scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts) | Browser owner documentation; host access, messaging, and restricted pages. | Cross-browser details differ. |
| Firefox policy | [Mozilla Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/) | Store and distribution policy; necessary permissions, disclosure, consent, and purpose limitation. | Policy may change and is not legal advice. |
| Retrieval | [Roediger and Karpicke 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x) | Original controlled studies; delayed retrieval benefit over restudy. | Prose recall by university students, not L2 grammar. |
| Spacing | [Cepeda et al. 2006](https://doi.org/10.1037/0033-2909.132.3.354) | Large quantitative review; spacing and retention-interval interaction. | Does not validate DutchMate's schedule. |
| Transfer | [Pan and Rickard 2018](https://doi.org/10.1037/bul0000151) | Comprehensive meta-analysis; conditional transfer and publication-bias cautions. | Not specific to L2 grammar or click-only practice. |
| L2 learning | [Rice and Tokowicz 2020](https://doi.org/10.1017/S0272263119000500) | High-trust review of adult L2 vocabulary training. | Vocabulary laboratory evidence does not directly generalize to grammar. |
| Repository | [architecture notes](../architecture/architecture.md), [ADRs](../adr/), and linked source modules above | Current first-party implementation and accepted decisions. | Code references describe the checked state and can change during implementation. |
