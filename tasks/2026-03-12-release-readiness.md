# Task Log: Release Readiness

## Date

2026-03-12

## Scope

- Finish publish-facing docs and metadata.
- Add release automation.
- Prepare the repository for commit, push, and npm publication.

## What Changed

- Normalized repo docs to use relative links suitable for GitHub and npm.
- Added release metadata to `package.json`: repository, homepage, bugs, `publishConfig.access`, `prepack`, and `prepublishOnly`.
- Added release docs:
  - `CHANGELOG.md`
  - `docs/release/publish-playbook.md`
  - `docs/release/release-notes-template.md`
- Added GitHub Actions workflows for CI and tagged publish.
- Unignored `tasks/` so work logs can actually be committed.

## Why

The plugin was technically ready, but the publication path still had avoidable failure points: missing release automation, missing public package metadata, and docs that only made sense on the local machine.

## Next Moves

1. Confirm npm scope ownership for `@clawshield`.
2. Push the release commit to GitHub.
3. Add `NPM_TOKEN` in repository secrets.
4. Publish manually once, or push tag `v0.1.0` to use the workflow.
