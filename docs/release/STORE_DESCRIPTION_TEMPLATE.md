# DutchMate Browser-Store Description Template

Use this file when preparing a DutchMate release for Chrome Web Store, Firefox Add-ons, and Microsoft Edge Add-ons.

## Files to maintain

```text
/CHANGELOG.md                                  # Private, cumulative source of truth
/docs/store-listing/summary.txt               # Current one-line summary
/docs/store-listing/description.md             # Current full store description
/docs/store-listing/release-notes.md           # Current release only
```

## Store summary

Maximum: **132 characters**, so one summary can be reused across all three stores.

```text
Translate, save, review, and practise Dutch while browsing the web.
```

## Full store-description template

```text
Learn Dutch naturally from the websites you already use. DutchMate helps you translate selected Dutch text, save useful vocabulary, review what you learned, and practise practical Dutch through lessons, Verb Journeys, and Dutch tense practice.

WHAT'S NEW IN v{{VERSION}}

- {{MOST_IMPORTANT_USER_VISIBLE_CHANGE}}
- {{SECOND_USER_VISIBLE_CHANGE}}
- {{OPTIONAL_THIRD_USER_VISIBLE_CHANGE}}

HOW IT WORKS

1. Understand Dutch
1.1 Select a Dutch word, phrase, or sentence on a webpage.
1.2 Use DutchMate to view English and Telugu translations.

2. Save useful vocabulary
2.1 Save words and phrases you want to remember.
2.2 Find them later in the Saved section.

3. Review what you learned
3.1 Open Today to complete your daily review.
3.2 Follow your progress and revisit vocabulary that needs practice.

4. Learn practical Dutch
4.1 Open Lessons and choose a practical everyday topic.
4.2 Work through its examples and exercises at the available level.

5. Practise verbs and Dutch tenses
5.1 Open a Verb Journey or Dutch tense practice activity.
5.2 Compare forms, learn them in context, and complete the exercises.

FEATURES

- Selected-text translation with English and Telugu support
- Save words and phrases encountered while browsing
- Daily vocabulary review and progress tracking
- Practical Dutch lessons for everyday situations
- Verb Journeys with contextual learning and exercises
- Dutch tense practice
- Learning data and settings stored locally in the browser
- No account required
- Free to use

PRIVACY & DATA

Your saved vocabulary, learning progress, and settings are stored locally in your browser. Selected text may be sent to the configured translation service to generate translations. Some translation features require an internet connection.
```

## Release-update instructions for Codex

For every release:

1. Read the released version from the applicable browser manifest.
2. Compare the release with the previous Git tag and inspect the actual released code.
3. Update `/CHANGELOG.md` cumulatively, with the newest version first.
4. Put only the current version's one to three most important user-visible changes in `release-notes.md` and the `WHAT'S NEW` section.
5. Preserve the evergreen positioning, workflows, and feature list unless released functionality changed.
6. Keep `summary.txt` at 132 characters or fewer.
7. Keep the full description compact—normally about 300–400 words—and above Edge's 250-character minimum.
8. Mention only functionality present in the released build. Never include planned features such as YouTube subtitle translation.
9. Never describe DutchMate as open source.
10. Include privacy, storage, pricing, browser support, and external-service claims only after verifying them in the repository.
11. Exclude refactors, tests, dependency updates, build work, and internal implementation details unless users are directly affected.
12. Produce a proposed diff for review. Do not commit, tag, publish, or update browser stores automatically.

## Changelog publication policy

- Keep `/CHANGELOG.md` in the private repository as the canonical cumulative record.
- Publish the current release notes in each browser store when submitting that version.
- Do not publish the private repository or rely on private GitHub Releases as a public changelog.
- A public cumulative changelog is optional. Create a curated `/changelog` page on the DutchMate website or support site only when such a public site exists.
- Do not copy the complete cumulative changelog into the store description.
