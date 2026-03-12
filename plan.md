# ClawShield Plan

## Objective

Create the best local-first trust plugin for OpenClaw: the default install for serious operators, with a product surface that is genuinely safer, easier to understand, and easier to share than competing guardrails.

## Product Thesis

We do not win by being louder than existing security plugins. We win by being the most trustworthy baseline:

- fully useful without accounts or cloud services
- aligned with OpenClaw’s native security model
- strong on supply-chain hygiene, not only runtime blocking
- able to summarize posture in one operator-readable message

## Phases

### Phase 0. Foundation

Status: `completed`

- [x] Read research and competitive landscape.
- [x] Create operating docs: `AGENTS.md`, `SKILL.md`.
- [x] Create repo structure, architecture docs, and task logging discipline.
- [x] Finalize package naming and draft plugin manifest details for the local-first package scaffold.

### Phase 1. MVP Core

Status: `completed`

- [x] Define domain types for risk findings, findings bundles, posture summaries, and scan reports.
- [x] Implement deterministic inbound message risk scoring.
- [x] Implement transcript redaction for persisted tool results.
- [x] Implement local skill scanning for `SKILL.md`-style bundles.
- [x] Implement unified posture report generation.
- [x] Add initial OpenClaw-ready plugin adapter layer and status command scaffold.
- [x] Add configurable runtime modes to the adapter surface.

### Phase 2. Hardening

Status: `completed`

- [x] Add regression corpus for malicious message and skill samples.
- [x] Add performance budget tests for hot-path scoring.
- [x] Add throttling, caching, and digest behavior.
- [x] Add config validation and richer remediation mappings.

### Phase 3. Launch Readiness

Status: `completed`

- [x] Publish install docs and operator quickstart.
- [x] Prepare npm package, version pin guidance, and provenance notes.
- [x] Draft OpenClaw community plugin listing submission.
- [x] Build comparison matrix against MoltGuard, SecureClaw, and PolicyShield from verified hands-on artifact benchmarks.

## Immediate Sprint

1. Publish the package to npm.
2. Validate the plugin end to end inside a disposable OpenClaw instance.
3. Tune rules against a larger adversarial sample set.
4. Prepare the community-plugin listing PR and release notes.

## Definition Of Done For MVP

- A plugin package can evaluate inbound messages and return deterministic findings.
- Persisted tool output can be sanitized locally.
- A skill directory can be scanned with a clear risk report.
- An operator can produce a compact posture summary with remediation guidance.
- The repo documents the system well enough that a new agent can continue without guesswork.

## Stretch Backlog

- Runtime benchmark ClawShield against live competitor installs in the same disposable OpenClaw instance.
- Add optional export paths for PolicyShield-style rule packs.
- Add signed release and provenance automation.
