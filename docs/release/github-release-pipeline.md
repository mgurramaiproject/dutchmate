# GitHub Release Pipeline

Use this flow when you want a real GitHub Release with packaged browser artifacts and human-written release notes.

## What The Workflow Does

The `Publish Release` GitHub Actions workflow:

- checks that the requested release version matches `package.json`;
- checks that a matching notes file exists under `docs/release/notes/`;
- runs verification;
- packages the Firefox and Chrome zip artifacts;
- creates the git tag;
- creates the GitHub Release;
- uploads the packaged zip files to the release.

This workflow does not submit the extension to Firefox, Chrome, or Edge stores. Store submission stays manual.

## Release Inputs

When you run the workflow, provide:

- `version`: the package version without a leading `v`, for example `0.2.1`;
- `draft`: whether the GitHub Release should be created as a draft first.

The workflow expects a notes file named like:

```text
docs/release/notes/v0.2.1.md
```

## Release Checklist

1. Update `package.json` to the intended release version.
2. Create `docs/release/notes/vx.y.z.md` from `docs/release/notes/TEMPLATE.md`.
3. Commit and merge the release-ready code to `main`.
4. Open the `Publish Release` workflow in GitHub Actions.
5. Run it with the matching version input.
6. Review the GitHub Release page and attached zip files.
7. Use those artifacts for manual browser-store submission.

## Safety Rules

- Do not run the workflow until the merged `main` branch is the exact code you want to release.
- Keep release notes human-written and specific to the version.
- Treat the GitHub Release as a packaging and distribution record, not as a substitute for browser-store review.
