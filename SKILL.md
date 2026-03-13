# ClawSeatbelt Builder Skill

## Purpose

Use this skill when working inside the ClawSeatbelt repository. It defines the standard of thinking, the repo workflow, and the product constraints that keep the project coherent.

## What You Are Building

ClawSeatbelt is a local-first trust layer for OpenClaw. The core shape is:

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
3. If the work affects adoption, status output, scanning output, or share flows, read [docs/architecture/trust-loop.md](docs/architecture/trust-loop.md).
4. If the work affects install silence, first-session activation, or the first proof path, read [docs/architecture/activation-brief.md](docs/architecture/activation-brief.md).
5. If the work affects export rendering or share modes, read [docs/architecture/share-export-system.md](docs/architecture/share-export-system.md).
6. If the work affects bundles of shared artifacts or support-thread recommendation flows, read [docs/architecture/proof-pack-system.md](docs/architecture/proof-pack-system.md).
7. If the work affects public proof, corpus growth, or measurement strategy, read [docs/architecture/compounding-moat.md](docs/architecture/compounding-moat.md).
8. If the work affects recommendation copy, public answers, or maintainer-facing guidance, read [docs/architecture/default-answer-engine.md](docs/architecture/default-answer-engine.md).
9. If the work affects first-proof challenge flows, read [docs/architecture/trust-challenge.md](docs/architecture/trust-challenge.md).
10. If the work affects corpus benchmarking or comparison evidence, read [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md).
11. If the work affects package trust, disposable install checks, or allowlist pinning, read [docs/architecture/openclaw-lab-verifier.md](docs/architecture/openclaw-lab-verifier.md).
12. If the work affects live competitor installs or category-proof claims, read [docs/architecture/competitor-lab.md](docs/architecture/competitor-lab.md).
13. If the work affects local OpenClaw install loops or tarball rehearsal, read [docs/architecture/local-deploy.md](docs/architecture/local-deploy.md).
14. If the work affects messaging, launch sequencing, or recommendation surfaces, read [marketing/no1-choice-plan.md](marketing/no1-choice-plan.md) and [marketing/message-map.md](marketing/message-map.md).
15. Check which rubric in `plan.md` the work is meant to improve and which competitor it is meant to beat.
16. Make the smallest coherent set of changes that improves the product materially.
17. Update docs, diagrams, and task log in the same turn.
18. Run verification for the surfaces you touched.

## Decision Filter

Choose the path that is:

- local before hosted
- deterministic before magical
- explainable before clever
- composable before sprawling
- fast on the hot path
- useful before viral
- benchmarked before loudly claimed

## Required Deliverables For Substantial Changes

- code
- tests or explicit test gap
- diagram updates when flow or state changes
- plan update when roadmap or sequencing changes
- task log entry
- export safety review when the change affects shareable artifacts

## Design Standards

- Keep hot-path hooks cheap.
- Separate pure scoring logic from OpenClaw integration glue.
- Match the current OpenClaw plugin contract: `openclaw.extensions` in `package.json`, `api.on(...)`, `api.registerCommand(...)`, and `api.registerService(...)`.
- Model findings as typed data, not freeform strings.
- Every finding should carry severity, evidence, rationale, and remediation.
- Operator-facing text must be concise and trustworthy.
- When adding product surface, prefer the work that improves default-install trust, posture clarity, or skill supply-chain safety.
- Do not let successful install flows end in silence. One calm activation cue is enough. Repeated nudges are not.
- Growth mechanics must be opt-in, redacted, and evidence-led.
- Major operator outputs should have a share-safe export path or a clear reason they do not.
- Treat install warnings as first-class product failures, not as release footnotes.

## Writing Standard

Write with pressure and clarity. Use clean sentences, strong verbs, and precise claims. Avoid padded prose, slogans, and synthetic enthusiasm.
