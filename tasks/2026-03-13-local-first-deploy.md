# Task Log: Local-First Deploy

## Goal

Make local development deployment a first-class path instead of forcing users to think about npm publication before they can test the plugin inside OpenClaw.

## Changes

- Added `scripts/deploy-local-openclaw.mjs`.
- Added `npm run deploy:local` for linked repository installs.
- Added `npm run deploy:local:pack` for tarball-based local installs.
- Updated README and quickstart docs to explain why local `npm publish` fails with `provider: null` when provenance is enabled.
- Added a local deploy architecture doc with state machine, sequence, and data-flow diagrams.

## Verified Behavior

- `npm run deploy:local` links the repository root into OpenClaw and loads the plugin successfully.
- `npm run deploy:local:pack` installs the packed `.tgz` successfully.
- Both paths preserve explicit allowlisting and plugin enablement.
