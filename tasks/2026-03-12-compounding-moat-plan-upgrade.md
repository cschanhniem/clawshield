# 2026-03-12 Compounding Moat Plan Upgrade

## Goal

Extend the strategy so ClawSeatbelt does not merely spread once, but compounds into the default OpenClaw trust plugin without hidden telemetry or growth gimmicks.

## Changes

- expanded [plan.md](plan.md) with compounding moats, trust-safe measurement, a new workstream for moat-building, and a final phase for becoming the default over time
- added [docs/architecture/compounding-moat.md](docs/architecture/compounding-moat.md) with state, sequence, and data-flow diagrams for the public-proof and corpus loop
- updated [docs/architecture/system-overview.md](docs/architecture/system-overview.md) so the moat loop appears in the main system map
- updated [AGENTS.md](AGENTS.md) and [SKILL.md](SKILL.md) so contributors keep corpus growth and measurement aligned with the local-first trust model

## Notes

- treated the "viral" requirement as compounding public evidence, not as user tracking
- made measurement explicit and trust-safe by restricting success signals to public or deliberate inputs

## Verification

- `git diff --check`
