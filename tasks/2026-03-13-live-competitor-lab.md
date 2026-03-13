# 2026-03-13 Live Competitor Lab

## Objective

Replace vague category claims with a repeatable live comparison against the real OpenClaw loader and current npm artifacts.

## What Changed

- added shared lab helpers in [scripts/lib/openclaw-lab.mjs](scripts/lib/openclaw-lab.mjs)
- added the live competitor benchmark runner in [scripts/run-competitor-lab.mjs](scripts/run-competitor-lab.mjs)
- added parser and signal regression coverage in [test/openclaw-lab.test.ts](test/openclaw-lab.test.ts)
- added the subsystem maps in [docs/architecture/competitor-lab.md](docs/architecture/competitor-lab.md)
- updated [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md), [AGENTS.md](AGENTS.md), [SKILL.md](SKILL.md), and [plan.md](plan.md) to reflect the new proof layer

## Why This Matters

The earlier benchmark work proved package shape and local corpus behavior. It did not yet prove what OpenClaw operators actually face when they install the top competitor packages today.

This lab closes that gap. It records live install warnings, auto-registration behavior, server dependency signals, hook and command counts, and packaged artifact size under the same OpenClaw CLI that loads ClawSeatbelt.

## Verification

- `npm test`
- `npm run benchmark:competitors`
- `npm run benchmark:competitors:docs`
- `git diff --check`

## Expected Outcome

ClawSeatbelt should no longer be judged only by its own narrative. The repo now has a live category-proof artifact that can show where ClawSeatbelt leads, where competitors are heavier or more externally dependent, and where the product still needs more proof.

## Observed Result

The first live lab run showed a clearer and more defensible picture than the earlier static artifact review:

- ClawSeatbelt led the clean local-first install comparison
- MoltGuard installed cleanly but surfaced hosted-service and quota signals
- PolicyShield stayed tiny but depended on a reachable server
- SecureClaw and Berry Shield both triggered OpenClaw dangerous-pattern warnings during install
- ClawSeatbelt still lacked a published npm package, which remains a real category-proof gap
