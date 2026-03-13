# Release Notes Template

## Summary

ClawSeatbelt `<version>` makes the first OpenClaw trust decision easier. This release improves the local-first baseline, sharpens first proof, and gives operators clearer evidence they can forward.

## Why This Release Matters

Use one tight paragraph that answers a user’s real question:

- what got safer
- what got easier to prove
- what got easier to recommend
- what changed in install, policy, or runtime behavior

## Highlights

- inbound risk scoring before agent execution
- enforce-mode blocking for dangerous tool calls in risky sessions
- outbound and persisted secret redaction
- local skill scanning
- posture reporting and operator commands
- any change that improves the five-minute proof loop

## Install

```bash
openclaw plugins install clawseatbelt@<version>
```

## Recommended Setup

- Start in `observe` mode, then move to `enforce` after a low-noise soak.
- Pin `plugins.allow` explicitly.
- Pair ClawSeatbelt with native OpenClaw security audit, tool policy, and approval controls.

## First Proof

Point people to one fast check:

```bash
/clawseatbelt-status
```

If the release matters to Telegram users, call out the Telegram-safe alias too:

```bash
/csb_status
```

If the release improved proof or recommendation surfaces, also call out:

```bash
/clawseatbelt-challenge --target markdown --audience public
```

## Notes

- ClawSeatbelt reduces risk. It does not solve prompt injection.
- ClawSeatbelt is not a sandbox or kernel boundary.
- Call out any new hook usage, blocking behavior, or config changes explicitly.
