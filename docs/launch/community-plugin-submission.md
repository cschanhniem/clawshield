# Community Plugin Submission Draft

## Proposed Listing

**Name:** ClawSeatbelt
**Package:** `clawseatbelt`
**Repository:** `clawshield`
**Category:** Security, Trust, Supply Chain

## Short Description

Local-first OpenClaw security plugin for prompt-injection risk scoring, tool-call guardrails, skill scanning, transcript redaction, and posture reporting.

## Medium Description

ClawSeatbelt helps OpenClaw users run agents with fewer blind spots. It scores risky inbound content, blocks dangerous tool flows in enforce mode, scans skill bundles before trust expands, redacts sensitive transcript material, and turns native OpenClaw security controls into one readable posture report.

## Why It Belongs

- Uses the official OpenClaw plugin contract and ships as a standard extension.
- Adds immediate value without requiring accounts, hosted control planes, or cloud inference.
- Covers both runtime guardrails and skill supply-chain trust.
- Composes with native OpenClaw controls instead of replacing them.
- Produces operator-readable output that helps users make safer configuration decisions quickly.

## Search Tags

- OpenClaw security
- OpenClaw plugin
- prompt injection protection
- skill scanner
- transcript redaction
- tool policy
- posture report
- supply chain security

## Install

```bash
openclaw plugins install clawseatbelt@0.1.2
```

## Maintenance Signals

- Active task log and architecture docs in repo
- Deterministic regression corpus and performance tests
- Explicit packaging and provenance notes
- Benchmark-driven roadmap against live ecosystem competitors

## Submission Notes

Before sending the PR:

1. Publish the package to npm.
2. Replace the placeholder repository link with the public repo URL.
3. Add screenshots or a short terminal capture of `clawseatbelt-status` and `clawseatbelt-scan`.
4. Include the exact OpenClaw version tested against.
5. Keep the listing language calm and precise. Promise local-first trust, not impossible safety.
