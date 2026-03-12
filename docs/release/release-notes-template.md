# Release Notes Template

## Summary

ClawShield Local `<version>` strengthens OpenClaw baseline trust with local-first guardrails and no hosted dependency in the hot path.

## Highlights

- inbound risk scoring before agent execution
- enforce-mode blocking for dangerous tool calls in risky sessions
- outbound and persisted secret redaction
- local skill scanning
- posture reporting and operator commands

## Install

```bash
openclaw plugins install @clawshield/local@<version>
```

## Notes

- Start in `observe` mode, then move to `enforce` after a low-noise soak.
- Pin `plugins.allow` explicitly.
- ClawShield reduces risk. It does not solve prompt injection and it is not a sandbox.
