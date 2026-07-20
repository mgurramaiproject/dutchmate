# Delivery Workflow

This repo uses GitHub Issues as the source of truth for work definition and a single GitHub Project as the source of truth for execution state.

## Why

The mattpocock/skills workflow already assumes a small, stable set of triage labels. Those labels are good for deciding whether work is specified and who should do it, but they are not enough to show whether an issue is pending, active, blocked, or waiting on review.

Use:

- GitHub Issues for work definition
- GitHub Project for execution state
- Pull requests for implementation evidence

## Labels Mean Triage, Not Progress

This repo keeps the canonical triage labels:

- `needs-triage`
- `needs-info`
- `ready-for-agent`
- `ready-for-human`
- `wontfix`

Do not use labels like `in-progress`, `review`, or `done` for normal execution tracking. Track that in the Project instead.

## Project

Create one GitHub Project named `Delivery`.

Recommended fields:

- `Delivery Status`: `Backlog`, `Ready`, `In Progress`, `In Review`, `Blocked`, `Done`
- `Execution`: `Agent`, `Human`
- `PR`: text or URL
- `Target`: optional milestone, release, or theme

Recommended interpretation:

- `Delivery Status=Backlog`: issue exists but is not yet ready to pull
- `Delivery Status=Ready`: work is approved and can be started
- `Delivery Status=In Progress`: someone is actively implementing it
- `Delivery Status=In Review`: PR is open or merge is pending
- `Delivery Status=Blocked`: waiting on external input, dependency, or decision
- `Delivery Status=Done`: merged and complete

Important:

- GitHub Projects already provides a default field named `Status` with options like `Todo`, `In Progress`, and `Done`.
- In this repo, that default GitHub field is not the source of truth for the workflow.
- Use the custom `Delivery Status` field for the real execution state.
- If both fields are visible in the UI, `Delivery Status` wins.

## Standard Flow

1. Create the issue.
2. Triage it with one canonical label.
3. Add it to the `Delivery` Project.
4. Set `Execution` to `Agent` or `Human`.
5. Move `Delivery Status` to match the real execution state.
6. Open a PR that links the issue with `Closes #N`.
7. Move to `In Review` when the PR is open.
8. Move to `Done` when the PR is merged and the issue is closed.

### Bundled PRs

A pull request automatically closes only the issues it explicitly links with
`Closes #N`. When one PR includes completed work for other tickets, reconcile
each additional ticket after merge: confirm its checklist and verification
evidence, synchronize the GitHub issue, close it, and update its Delivery
Status.

## Implementation Checklist

When implementing an issue:

- Confirm the current branch, worktree, issue, and source specification before editing.
- Keep the change within one coherent, independently verifiable slice.
- Test behavior at stable public seams, and update the issue or ticket acceptance checklist as each requirement is completed.
- Before committing, run the focused checks, typecheck, full relevant suite, and build or packaging checks required by the change.
- Review the diff against the pre-work baseline, run the repository's whitespace checks, and commit the implementation together with its documentation updates.
- Use commit subjects in the form `<type>: <ticket-id> <branch-codename>: <summary>`; for example, `feat: T03 learnloop: record deliberate encounters`.
- Finish with a clean worktree and report any checks or external actions that could not be completed.

## Status Rules

Use this mapping consistently:

- `needs-triage`: `Delivery Status=Backlog`
- `needs-info`: `Delivery Status=Blocked`
- `ready-for-agent`: usually `Delivery Status=Ready`
- `ready-for-human`: usually `Delivery Status=Ready`
- `wontfix`: close the issue or remove it from active planning

Important:

- `ready-for-agent` does not mean "currently in progress"
- an open issue with `ready-for-agent` and no Project state is ambiguous
- the Project must answer "what is happening right now?"
- if the board is created after work has already started or finished, closed issues may need to be added manually so the Project reflects actual completed work

## Agent Conventions

When an agent starts work on an issue:

- confirm the issue is labeled `ready-for-agent`
- set `Execution=Agent`
- move `Delivery Status` to `In Progress`
- comment with the planned branch name if useful

When an agent opens a PR:

- link the issue with `Closes #N`
- add the PR URL to the `PR` field
- move `Delivery Status` to `In Review`

When an agent finishes:

- own normal delivery through PR merge, issue closure, and Delivery-board
  reconciliation; stop only for a failed check, missing authority, or a user
  decision
- after merge, move `Delivery Status` to `Done`
- verify the issue is closed
- verify the custom `Delivery Status` field, rather than inferring status from
  a board column or GitHub's default `Status` field; the custom field remains
  authoritative even when both fields show `Done`

If an agent cannot continue:

- move `Delivery Status` to `Blocked`
- leave a comment explaining the blocker and the next required action

## Human Conventions

When a human starts work:

- set `Execution=Human`
- move `Delivery Status` to `In Progress`

When work pauses:

- use `Blocked` only for a real blocker
- otherwise move `Delivery Status` back to `Ready`

## Parent Issues And PRDs

For larger efforts, use one parent issue or PRD and several child execution issues.

Recommended pattern:

- parent issue tracks the initiative
- child issues track independently shippable slices
- only child issues should usually move through active implementation states

This avoids one large issue looking permanently "in progress" while the real work happens elsewhere.

## GitHub-Specific Notes

### Shared Numbering

GitHub uses one shared number sequence for issues and pull requests.

That means:

- issue numbers and PR numbers come from the same counter
- a visible jump in PR numbers does not mean missing PRs
- the missing numbers may be ordinary issues

Example:

- PRs `#2`, `#3`, `#4`, then PRs `#13`, `#14`, `#15` usually means `#5` through `#12` were issues, not pull requests

### Project Setup Timing

Create the Project as soon as open `ready-for-agent` issues become hard to distinguish from active work. If the Project is introduced late:

- seed the currently open issues first
- then reconcile recently completed issues that should appear as historical `Done` work
- do not assume closed issues are already present in the board

### Authentication For Project Automation

`gh project` commands require the `project` OAuth scope.

If an agent needs to create or manage the Project through `gh`, first verify:

- `gh auth status`

If the `project` scope is missing, refresh auth before continuing:

- `gh auth refresh -h github.com -s project`

This may require a browser-based device-code confirmation.

## Minimum Viable Discipline

If the Project is not yet available, use this temporary fallback:

- keep triage labels accurate
- assign the issue when work starts
- leave a comment with the branch name
- link the PR

This is weaker than the Project workflow and should be treated as a temporary gap, not the long-term system.
