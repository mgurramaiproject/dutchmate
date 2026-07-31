# Ready-to-paste prompt for VS Code / Codex CLI

```text
Implement the DutchMate Verb Journeys feature described in:
<path> = /home/mgurram/MGurramAI/projects/dutchmate-proj/dutchmate/docs/features/todos/verb-journeys-codex-handoff

- <path>/README.md
- <path>/product-spec.md
- <path>/implementation-plan.md
- <path>/content-and-data-model.md
- <path>/learning-and-authoring-guide.md
- <path>/acceptance-and-test-plan.md
- <path>/architecture-decisions.md
- <path>/dutchmate-werken-verb-journey-mockup-v2.html

Also use the revised clickable Werken mockup as a behavioural and information-architecture reference if it is available in the repo.

Critical constraint: preserve DutchMate’s current UI and design system. Do not replace or redesign the existing Today, Lessons, Saved, Options, heatmaps, components, navigation, colours, typography, spacing or icons. Reuse the repo’s existing primitives and adapt the feature to them. The existing app is the visual source of truth; the mockup is not a replacement UI.

Start with repository discovery only:

1. Read all repo instructions and relevant feature/docs conventions.
2. Inspect the current architecture, navigation, lesson/content models, design tokens/components, persistence/migrations, tests and build/package commands.
3. Identify exactly which existing components and modules can be reused.
4. Propose the smallest safe vertical slice for werken and list the files you expect to change.
5. Identify material uncertainties, migration risks and conflicts between the docs/mockup and the repo.
6. Recommend a feature branch name and the repo’s next appropriate feature/doc code only after inspecting its conventions.

Do not start implementation until you have presented the discovery findings and plan. Ask me questions only when my decision would materially change product behaviour, data migration or scope.

After approval, implement in small verified commits:

- schema and content validation;
- release-ready werken content structure;
- deterministic click-only exercise engine;
- skill-level progress persistence;
- Lessons/Werken integration using existing UI;
- complete 8-Dutch-form Verb Map;
- complete 12-English-form comparison;
- OTT, VTT and OVT journeys;
- compact Today review/resume integration;
- tests, accessibility and regression checks.

Constraints:

- no runtime LLM or network-dependent grading;
- no text-input exercises;
- no new top-level popup tab;
- no broad refactor unless separately justified and approved;
- no assumption that tense examples already exist in the backend;
- no loss or reset of existing user data;
- do not mark advanced/reference forms as beginner mastery requirements;
- keep Saved-to-verb integration out of the first slice if reliable lemma resolution does not already exist;
- always run relevant tests/build checks after each implementation phase;
- show me any unrelated existing failures rather than hiding or rewriting them;
- preserve unrelated working-tree changes;
- commit after each coherent, verified change if that matches the repo workflow;
- end each phase with what changed, evidence/tests, remaining risks and the recommended next step.
```

## Before pasting

Replace `<path>` with the directory where these files are placed in the DutchMate repository. Suggested location, subject to existing repo conventions:

```text
docs/features/<next-feature-code>-verb-journeys/
```

Place the revised HTML mockup beside the documents or reference its actual path. Do not ask Codex to copy the mockup’s CSS into production.

