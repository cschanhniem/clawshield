# 2026-03-12 Choice Architecture Plan Upgrade

## Goal

Make the strategy precise about how ClawSeatbelt wins the actual selection path from search to installation to recommendation.

## Changes

- expanded [plan.md](plan.md) with choice-architecture stages, a proof-pack strategy, release gates for taste, and a new workstream focused on proof-pack dominance
- added [docs/architecture/proof-pack-system.md](docs/architecture/proof-pack-system.md) with state, sequence, and data-flow diagrams for bundled recommendation artifacts
- updated [docs/architecture/system-overview.md](docs/architecture/system-overview.md), [docs/architecture/share-export-system.md](docs/architecture/share-export-system.md), and [docs/architecture/trust-loop.md](docs/architecture/trust-loop.md) so the proof-pack path is visible in the broader system
- updated [AGENTS.md](AGENTS.md) and [SKILL.md](SKILL.md) so future contributors treat proof packs and recommendation surfaces as first-class product components

## Notes

- translated "built-in viral hack" into a disciplined proof-pack system that helps in real PRs, issues, and support threads
- added an explicit rule that clean systems must also create recommendation value, so growth does not depend on fear

## Verification

- `git diff --check`
