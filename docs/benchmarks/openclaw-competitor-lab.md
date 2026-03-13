# OpenClaw Competitor Lab

Generated at: 2026-03-13T06:15:32.391Z
OpenClaw version: 2026.3.11

## Method

- Each package was installed into a disposable `OPENCLAW_HOME` with the current OpenClaw CLI.
- After install, the lab pinned `plugins.allow`, read the live plugin info surface, and recorded install output.
- The lab also packed each artifact to record tarball size and unpacked size.
- This is a live install and plugin-surface benchmark. It is not yet a shared-corpus runtime efficacy shootout.

## Snapshot

| Package | Version | Packed Size | Hooks | Commands | Local-First Baseline | Install Warning | Notable Signal |
|---|---:|---:|---:|---:|---|---|---|
| ClawSeatbelt | 0.1.3 | 34727 B | 5 | 7 | yes | no | Clean local baseline |
| MoltGuard | 6.8.21 | 1697329 B | 24 | 9 | no | no | Hosted service or account signal |
| SecureClaw | 2.2.0 | 102921 B | 1 | 1 | yes | yes | Installer flagged dangerous patterns |
| PolicyShield | 0.14.0 | 6999 B | 3 | 0 | no | no | Server dependency signal |
| Berry Shield | 2026.3.3-2 | 111332 B | 13 | 1 | yes | yes | Installer flagged dangerous patterns |

## Findings

- Smallest packaged artifact in this run: PolicyShield (6999 bytes).
- ClawSeatbelt local baseline verdict: ClawSeatbelt currently leads the local-first baseline on install-path evidence.
- ClawSeatbelt clean local install verdict: ClawSeatbelt currently leads the clean local install story in this run.
- Smallest clean install across all packages: PolicyShield currently leads the clean-install artifact story in this run.
- Publication gap: ClawSeatbelt is published on npm. Publication is no longer the main credibility gap.

## Package Notes

### ClawSeatbelt
- Local tarball install stayed warning-free under the OpenClaw installer.
- Plugin id: `clawseatbelt`
- Services: 1
- CLI commands: 0
- Tool count: 0
- Config schema present: yes

### MoltGuard
- Package shows hosted-service or account-linked behavior in default install signals.
- Plugin id: `moltguard`
- Services: 0
- CLI commands: 0
- Tool count: 0
- Config schema present: yes

### SecureClaw
- OpenClaw installer flagged dangerous code patterns in the shipped plugin artifact.
- Plugin id: `secureclaw`
- Services: 3
- CLI commands: 1
- Tool count: 0
- Config schema present: yes

### PolicyShield
- Package expects a reachable policy or control-plane server for full behavior.
- Plugin id: `policyshield`
- Services: 0
- CLI commands: 0
- Tool count: 0
- Config schema present: yes

### Berry Shield
- OpenClaw installer flagged dangerous code patterns in the shipped plugin artifact.
- Plugin id: `berry-shield`
- Services: 0
- CLI commands: 1
- Tool count: 1
- Config schema present: yes

## Caveats

- This proves install-path and plugin-surface behavior under the real OpenClaw loader.
- This still does not prove detection quality against the same live malicious corpus inside each competitor runtime.

