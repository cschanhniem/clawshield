# 2026-03-13 Activation Brief

## Goal

Close the gap between "plugin installed" and "operator knows it is alive" without turning ClawSeatbelt into nagware.

## Changes

- added [src/reporting/activationBrief.ts](src/reporting/activationBrief.ts) to centralize first-session activation copy and follow-up commands
- updated [src/core/clawSeatbeltRuntime.ts](src/core/clawSeatbeltRuntime.ts) and [src/core/runtimeState.ts](src/core/runtimeState.ts) so the next eligible assistant reply carries a one-time activation brief, and direct ClawSeatbelt command use suppresses the brief
- added `activationBriefEnabled` to [src/core/config.ts](src/core/config.ts) and [openclaw.plugin.json](openclaw.plugin.json)
- made [src/reporting/postureReport.ts](src/reporting/postureReport.ts) and [src/reporting/challengeReport.ts](src/reporting/challengeReport.ts) point operators toward proof and share-safe follow-up paths
- aligned pinned install footers in [src/core/productMetadata.ts](src/core/productMetadata.ts), [src/reporting/proofPack.ts](src/reporting/proofPack.ts), and [src/reporting/defaultAnswer.ts](src/reporting/defaultAnswer.ts)
- expanded [test/plugin.test.ts](test/plugin.test.ts) and [test/share-export.test.ts](test/share-export.test.ts)
- documented the activation flow in [docs/architecture/activation-brief.md](docs/architecture/activation-brief.md) and updated the related install, trust-loop, and quickstart docs

## Notes

- kept the activation brief local, one-time, and suppressible so the product stays quiet after the first cue
- used `/clawseatbelt-status` as the primary next step when local config already has findings, otherwise `/clawseatbelt-challenge`
- preserved the pinned install footer in share artifacts so forwarded proof still doubles as an exact install path

## Verification

- `npm test`
