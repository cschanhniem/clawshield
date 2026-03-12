# Community Plugin Submission Draft

## Proposed Listing

**Name:** ClawShield Local  
**Package:** `@clawshield/local`  
**Repository:** `clawshield`  
**Category:** Security, Trust, Supply Chain

## Short Description

Local-first trust layer for OpenClaw with inbound risk scoring, dangerous tool-call blocking in enforce mode, transcript hygiene, and local skill inspection.

## Why It Belongs

- Uses the official OpenClaw plugin contract and ships as a standard extension.
- Adds value without requiring accounts, hosted control planes, or cloud inference.
- Composes with native OpenClaw controls instead of replacing them.
- Produces operator-readable posture output that helps serious users configure trust intentionally.

## Install

```bash
openclaw plugins install @clawshield/local@0.1.0
```

## Maintenance Signals

- Active task log and architecture docs in-repo
- Deterministic regression corpus and performance tests
- Explicit packaging and provenance notes

## Submission Notes

Before sending the PR:

1. Publish the package to npm.
2. Replace placeholder repository link with the public repo URL.
3. Add screenshots or a short terminal capture of `clawshield-status`.
4. Include the exact OpenClaw version tested against.
