# Task Log: Trusted Publishing Migration

## Goal

Move the release path from token-based npm publishing to npm trusted publishing through GitHub Actions.

## Why

- npm recommends trusted publishing for CI/CD package publishing.
- It removes long-lived publish tokens from GitHub secrets.
- It avoids `EOTP` failures on accounts that enforce write-time 2FA.
- It gives provenance by default for public packages from public repositories.

## Repo Changes

- Removed `NODE_AUTH_TOKEN` from the publish workflow.
- Kept `id-token: write` in the workflow so GitHub OIDC remains available to npm.
- Added `publishConfig.access` and `publishConfig.provenance` in `package.json`.
- Rewrote publish docs so trusted publishing is the default path.

## npm-Side Setup Still Required

- Configure npm trusted publishing for repository `cschanhniem/ClawSeatbelt`.
- Use workflow file `.github/workflows/release.yml`.
- After configuration, rerun the `Publish` workflow manually from `main` or publish with a new tag.
