# Community Plugin Submission Draft

## Proposed Listing

**Name:** ClawSeatbelt
**Package:** `clawseatbelt`
**Repository:** `https://github.com/cschanhniem/ClawSeatbelt`
**Category:** Security, Trust, Supply Chain

## Short Description

Local-first OpenClaw trust plugin for prompt-injection risk scoring, skill scanning, transcript hygiene, and posture reporting.

## Medium Description

ClawSeatbelt is the trust plugin OpenClaw users can install first without adding a hosted control plane. It scores risky inbound content, blocks dangerous tool flows in enforce mode, scans skill bundles before trust expands, redacts sensitive transcript material, and turns native OpenClaw security controls into one readable posture report with proof surfaces worth forwarding.

## Why It Belongs

- Uses the official OpenClaw plugin contract and ships as a standard extension.
- Adds immediate value without requiring accounts, hosted control planes, or cloud inference.
- Covers both runtime guardrails and skill supply-chain trust.
- Composes with native OpenClaw controls instead of replacing them.
- Produces operator-readable output that helps users make safer configuration decisions quickly.
- Gives new users first proof in minutes through status, challenge, scan, and proof-pack flows.

## Search Tags

- OpenClaw security
- OpenClaw trust plugin
- OpenClaw plugin
- prompt injection protection
- skill scanner
- transcript redaction
- tool policy
- posture report
- supply chain security

## Install

```bash
openclaw plugins install clawseatbelt@0.1.3
```

After install, pin `plugins.allow`, enable the plugin entry, and restart the OpenClaw gateway before first use.

## Maintenance Signals

- Active task log and architecture docs in repo
- Deterministic regression corpus and performance tests
- Explicit packaging and provenance notes
- Benchmark-driven roadmap against live ecosystem competitors

## Submission Notes

Before sending the PR:

1. Add screenshots or a short terminal capture of `clawseatbelt-status` and `clawseatbelt-scan`.
2. Include the exact OpenClaw version tested against.
3. Keep the listing language calm and precise. Promise local-first trust, not impossible safety.
4. Lead the listing with first-install clarity and first-proof speed, not architectural detail.
