# 2026-03-12 Elegant Recommendation Plan Upgrade

## Goal

Push the ClawSeatbelt strategy past generic growth language and into a recommendation system that feels useful, restrained, and safe to share.

## Changes

- expanded [plan.md](plan.md) with elegant distribution principles, a backfire risk table, a stronger definition of tasteful recommendation surfaces, and a dedicated workstream for the recommendation engine
- added [docs/architecture/share-export-system.md](docs/architecture/share-export-system.md) with state, sequence, and data-flow diagrams for the share export path
- updated [docs/architecture/trust-loop.md](docs/architecture/trust-loop.md) and [docs/architecture/system-overview.md](docs/architecture/system-overview.md) so the growth loop and export subsystem are visible in the main architecture story
- updated [AGENTS.md](AGENTS.md) and [SKILL.md](SKILL.md) so future contributors treat share outputs as product surfaces with their own safety review

## Notes

- translated "viral hack" into an earned recommendation engine built on proof artifacts, pinned install paths, and quiet attribution
- kept the strategy explicitly hostile to auto-posting, nag prompts, and any referral mechanic that would make the plugin feel cheap

## Verification

- `git diff --check`
