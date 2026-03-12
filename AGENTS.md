# AGENTS.md

## Mission

Build ClawShield into the local-first trust layer that serious OpenClaw operators install before they add anything else. The product should feel like seatbelts: quiet, decisive, intelligible, and hard to outgrow.

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
6. [docs/product/quickstart.md](docs/product/quickstart.md)
7. [docs/benchmarks/competitor-artifact-benchmark.md](docs/benchmarks/competitor-artifact-benchmark.md)
8. Latest task log in [tasks](tasks)

## Non-Negotiables

- Keep the core local-first. Network use must be optional, explicit, and off the hot path.
- Do not claim prompt injection is solved. Frame the product as risk reduction, visibility, and safer defaults.
- Prefer composition with OpenClaw primitives over reinvention.
- Optimize for operator trust: minimal dependencies, transparent behavior, deterministic modes, and explainable output.
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
- When you add a subsystem, add or update:
  - a state machine diagram
  - a sequence diagram if requests cross component boundaries
  - a data-flow view if data movement or trust boundaries matter

## Product North Star

ClawShield wins if a cautious OpenClaw operator can install it in minutes and immediately gain:

- a shareable posture report
- message risk scoring before the agent sees risky content
- transcript hygiene for persisted tool output
- local skill inspection with concrete remediation
- a coherent explanation of how built-in OpenClaw controls should be configured

## Current Strategy

Differentiate on:

- local-first operation
- no-account baseline
- strong operator UX
- skill supply-chain inspection
- unified posture reporting that composes with OpenClaw security audit, pairing, exec approvals, and tool policy

Do not drift into a vague “AI firewall.” Stay specific, composable, and useful.
