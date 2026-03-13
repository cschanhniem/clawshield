# 2026-03-13 Trust Challenge Surface

## Goal

Add a first-proof surface that works on a clean install so ClawSeatbelt can demonstrate value before a user has live incidents, snapshots, or benchmark fixtures.

## Changes

- added [src/reporting/challengeReport.ts](src/reporting/challengeReport.ts) to run a synthetic local self-check over message scoring, transcript hygiene, and skill inspection
- added the `/clawseatbelt-challenge` runtime command in [src/core/clawSeatbeltRuntime.ts](src/core/clawSeatbeltRuntime.ts)
- expanded tests in [test/plugin.test.ts](test/plugin.test.ts) and [test/share-export.test.ts](test/share-export.test.ts)
- documented the subsystem in [docs/architecture/trust-challenge.md](docs/architecture/trust-challenge.md)
- updated [README.md](README.md), [docs/product/quickstart.md](docs/product/quickstart.md), [plan.md](plan.md), [AGENTS.md](AGENTS.md), and [SKILL.md](SKILL.md)

## Notes

- kept the challenge synthetic and local so it remains safe to share and does not overclaim benchmark coverage
- treated it as first proof, not final proof

## Verification

- `npm test`
- `npm pack --json --pack-destination .tmp/pack`
- `git diff --check`
