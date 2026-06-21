# AMO Source Package Build Instructions

This repository contains the source code used to build the DutchMate Firefox add-on submission.

## Build Environment

- Operating systems: Linux, macOS, or Windows with a Unix-like shell
- Node.js: `v22.22.3`
- Corepack: enabled
- pnpm: `9.15.9`
- Required system utility: `zip`

## Install Requirements

1. Install Node.js `v22.22.3`.
2. Enable Corepack:

```bash
corepack enable
```

3. Activate pnpm `9.15.9`:

```bash
corepack prepare pnpm@9.15.9 --activate
```

4. Ensure the `zip` command is available in your shell.

## Build Steps

Run these commands from the repository root:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm package:firefox
```

## Expected Output

The build creates this Firefox upload artifact:

```text
release/dutchmate-firefox-0.1.2.zip
```

## How The Build Works

- TypeScript source files in `src/` are compiled and bundled with Vite.
- `scripts/write-manifest.mjs` writes the Firefox-specific `manifest.json`.
- `scripts/package-extension.mjs firefox` zips the contents of `dist/firefox` into the final upload artifact.

## Notes For Reviewers

- This source package intentionally excludes `node_modules`, `dist`, and `release` outputs.
- Store-ready Firefox builds are created with `corepack pnpm package:firefox`.
- Local-testing builds that expose developer endpoint controls are created with `corepack pnpm build:firefox:local-testing`, but those are not the submitted store build.
