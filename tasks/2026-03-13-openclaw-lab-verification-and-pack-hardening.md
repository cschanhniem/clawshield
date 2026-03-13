# 2026-03-13 OpenClaw Lab Verification And Pack Hardening

## Objective

Tighten the product where real OpenClaw install behavior exposed trust debt, then add a repeatable verifier so the same regression cannot slip back into the release artifact.

## What Changed

- narrowed the published package surface in [package.json](package.json) so the tarball ships runtime code only, not benchmark-only build output
- removed the benchmark harness from the public package exports in [src/index.ts](src/index.ts)
- added the disposable install verifier at [scripts/verify-openclaw-lab.mjs](scripts/verify-openclaw-lab.mjs)
- added package-surface regression coverage in [test/package-metadata.test.ts](test/package-metadata.test.ts)
- documented the verifier and install flow in [docs/architecture/openclaw-lab-verifier.md](docs/architecture/openclaw-lab-verifier.md), [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md), [README.md](README.md), [docs/product/quickstart.md](docs/product/quickstart.md), and [docs/product/packaging-and-provenance.md](docs/product/packaging-and-provenance.md)
- updated [plan.md](plan.md), [AGENTS.md](AGENTS.md), and [SKILL.md](SKILL.md) so the repo now treats install warnings as first-class failures

## Why This Mattered

The disposable install lab surfaced a real trust flaw: the published tarball included benchmark code that imported `child_process`, and OpenClaw flagged that during plugin install as a dangerous pattern. That warning would have undercut the local-first trust story on the exact path where users decide whether to keep the plugin installed.

The fix was to make the package boundary honest. Benchmark and verification code still exists in the repository, but it is no longer part of the shipped plugin artifact.

## Verification

- `npm test`
- `npm run verify:openclaw-lab`
- `npm run verify:openclaw-lab:docs`
- `npm pack --json --pack-destination .tmp/pack`
- `git diff --check`

## Outcome

ClawSeatbelt now proves one more thing it previously only claimed: the production install surface is smaller, cleaner, and verified through the real OpenClaw plugin installer in an isolated home.
