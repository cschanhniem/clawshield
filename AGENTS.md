# AGENTS.md

## Mission

Build ClawSeatbelt into the local-first trust layer that serious OpenClaw operators install before they add anything else. The product should feel like seatbelts: quiet, decisive, intelligible, and hard to outgrow.

This repository exists to produce three things in lockstep:

1. A world-class OpenClaw plugin.
2. A rigorous operating corpus: plans, task logs, diagrams, threat framing, and launch intelligence.
3. A handoff surface so any new agent can enter cold and still move with precision.

## First Read

Start here, in order:

1. [clawshield-research.md](clawshield-research.md)
2. [competitive.md](competitive.md)
3. [plan.md](plan.md)
4. [docs/product/positioning.md](docs/product/positioning.md)
5. [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
6. [docs/architecture/trust-loop.md](docs/architecture/trust-loop.md)
7. [docs/architecture/share-export-system.md](docs/architecture/share-export-system.md)
8. [docs/architecture/proof-pack-system.md](docs/architecture/proof-pack-system.md)
9. [docs/architecture/compounding-moat.md](docs/architecture/compounding-moat.md)
10. [docs/architecture/default-answer-engine.md](docs/architecture/default-answer-engine.md)
11. [docs/architecture/trust-challenge.md](docs/architecture/trust-challenge.md)
12. [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md)
13. [docs/architecture/openclaw-lab-verifier.md](docs/architecture/openclaw-lab-verifier.md)
14. [docs/architecture/competitor-lab.md](docs/architecture/competitor-lab.md)
15. [docs/product/quickstart.md](docs/product/quickstart.md)
16. [docs/benchmarks/competitor-artifact-benchmark.md](docs/benchmarks/competitor-artifact-benchmark.md)
17. Latest task log in [tasks](tasks)
18. [docs/architecture/local-deploy.md](docs/architecture/local-deploy.md)

## Non-Negotiables

- Keep the core local-first. Network use must be optional, explicit, and off the hot path.
- Do not claim prompt injection is solved. Frame the product as risk reduction, visibility, and safer defaults.
- Prefer composition with OpenClaw primitives over reinvention.
- Optimize for operator trust: minimal dependencies, transparent behavior, deterministic modes, and explainable output.
- Growth must come from useful, share-safe artifacts. Never use dark patterns, nagware, or hidden distribution mechanics.
- Write docs and code together. If architecture changes, update diagrams and operating docs in the same pass.
- Break large files before they become a liability.

## Repo Shape

- `src/core`: orchestration, policy evaluation, plugin-facing services.
- `src/rules`: risk heuristics and redaction rules.
- `src/scanner`: skill and bundle inspection.
- `src/reporting`: posture summaries and operator-facing output.
- `src/types`: shared contracts.
- `src/openclaw.ts`: OpenClaw-facing plugin entry that matches the official `api.on(...)` and `registerCommand(...)` surface.
- `docs/architecture`: state machines, sequence diagrams, data flow, and system decisions.
- `docs/product`: positioning, differentiation, and launch logic.
- `docs/benchmarks`: competitor artifact and integration benchmarks.
- `tasks`: dated work logs.
- `test`: focused fixtures and regression coverage.

## Working Rules

- Before substantial edits, read the latest task log and `plan.md`.
- Add a new task log for each meaningful work session using `tasks/YYYY-MM-DD-short-topic.md`.
- Update `plan.md` when status, sequencing, or scope changes.
- Update `SKILL.md` when workflow, guardrails, or repo conventions evolve.
- If a change affects adoption, recommendation, or operator sharing, update [docs/architecture/trust-loop.md](docs/architecture/trust-loop.md).
- If a change affects export rendering, copy structure, or share safety, update [docs/architecture/share-export-system.md](docs/architecture/share-export-system.md).
- If a change affects multi-artifact exports, support-thread flows, or recommendation packets, update [docs/architecture/proof-pack-system.md](docs/architecture/proof-pack-system.md).
- If a change affects corpus growth, public proof loops, or trust-safe measurement, update [docs/architecture/compounding-moat.md](docs/architecture/compounding-moat.md).
- If a change affects support-thread answers, recommendation copy, or maintainer handoff flows, update [docs/architecture/default-answer-engine.md](docs/architecture/default-answer-engine.md).
- If a change affects first-proof installs or challenge flows, update [docs/architecture/trust-challenge.md](docs/architecture/trust-challenge.md).
- If a change affects corpus benchmarking or package-comparison evidence, update [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md).
- If a change affects tarball trust, disposable install verification, or allowlist pinning flows, update [docs/architecture/openclaw-lab-verifier.md](docs/architecture/openclaw-lab-verifier.md).
- If a change affects live competitor comparisons or category-proof evidence, update [docs/architecture/competitor-lab.md](docs/architecture/competitor-lab.md).
- If a change affects local OpenClaw install loops, repo linking, or tarball rehearsal flows, update [docs/architecture/local-deploy.md](docs/architecture/local-deploy.md).
- When you add a subsystem, add or update:
  - a state machine diagram
  - a sequence diagram if requests cross component boundaries
  - a data-flow view if data movement or trust boundaries matter

## Product North Star

ClawSeatbelt wins if a cautious OpenClaw operator can install it in minutes and immediately gain:

- a shareable posture report
- message risk scoring before the agent sees risky content
- transcript hygiene for persisted tool output
- local skill inspection with concrete remediation
- a coherent explanation of how built-in OpenClaw controls should be configured
- a share-safe artifact worth forwarding to the next operator

## Current Strategy

Differentiate on:

- local-first operation
- no-account baseline
- strong operator UX
- skill supply-chain inspection
- unified posture reporting that composes with OpenClaw security audit, pairing, exec approvals, and tool policy
- benchmark proof before marketing claims
- packaging and provenance that make the trust story visible
- an ethical built-in growth loop through trust receipts, skill memos, and benchmark artifacts
- optional interop with heavier policy systems without pulling them into the baseline

Win the choice architecture, not raw feature count. Do not drift into a vague "AI firewall." Stay specific, composable, and useful.
