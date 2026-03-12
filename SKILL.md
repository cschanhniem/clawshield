# ClawShield Builder Skill

## Purpose

Use this skill when working inside the ClawShield repository. It defines the standard of thinking, the repo workflow, and the product constraints that keep the project coherent.

## What You Are Building

ClawShield is a local-first trust layer for OpenClaw. The core shape is:

- inbound message risk scoring
- prompt-time guard context via `before_prompt_build`
- risky tool-call blocking in enforce mode
- transcript hygiene for persisted tool results
- outbound secret scrubbing on `message_sending`
- local skill inspection
- unified posture reporting
- transparent guidance that composes with OpenClaw’s built-in controls

## Workflow

1. Read [plan.md](plan.md) and the latest file in [tasks](tasks).
2. Read the architecture doc that touches the subsystem you will edit.
3. Make the smallest coherent set of changes that improves the product materially.
4. Update docs, diagrams, and task log in the same turn.
5. Run verification for the surfaces you touched.

## Decision Filter

Choose the path that is:

- local before hosted
- deterministic before magical
- explainable before clever
- composable before sprawling
- fast on the hot path

## Required Deliverables For Substantial Changes

- code
- tests or explicit test gap
- diagram updates when flow or state changes
- plan update when roadmap or sequencing changes
- task log entry

## Design Standards

- Keep hot-path hooks cheap.
- Separate pure scoring logic from OpenClaw integration glue.
- Match the current OpenClaw plugin contract: `openclaw.extensions` in `package.json`, `api.on(...)`, `api.registerCommand(...)`, and `api.registerService(...)`.
- Model findings as typed data, not freeform strings.
- Every finding should carry severity, evidence, rationale, and remediation.
- Operator-facing text must be concise and trustworthy.

## Writing Standard

Write with pressure and clarity. Use clean sentences, strong verbs, and precise claims. Avoid padded prose, slogans, and synthetic enthusiasm.
