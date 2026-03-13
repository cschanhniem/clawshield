# Task Log: Publish Workflow Hardening

## Goal

Make the release path fit current open source publishing practice and capture the real npm blocker from the first failed publish run.

## Changes

- Upgraded GitHub Actions usage to `actions/checkout@v6` and `actions/setup-node@v6`.
- Added `id-token: write` to the publish workflow.
- Switched release publishing to `npm publish --provenance`.
- Added `workflow_dispatch` so a failed tag publish can be retried cleanly after fixing npm credentials.
- Updated publish docs to require an npm automation token or trusted publishing for accounts that enforce write-time 2FA.

## Failure Captured

The first `v0.1.0` publish run reached npm successfully but failed with `EOTP`, which means the configured `NPM_TOKEN` is not sufficient for non-interactive publish on the current npm account settings.

## Next Step

Replace `NPM_TOKEN` with an npm automation token, then rerun the failed `Publish` workflow for tag `v0.1.0`.
