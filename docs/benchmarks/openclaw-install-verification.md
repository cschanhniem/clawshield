# OpenClaw Install Verification

Generated at: 2026-03-12T17:46:38.104Z
OpenClaw version: 2026.3.11

## Verdict

- Package artifact: pass
- Install path: pass
- Dangerous pattern warning during install: none
- Allowlist pinned in disposable lab: yes

## Package Surface

- Tarball: `clawseatbelt-0.1.0.tgz`
- Packed size: 31289 bytes
- Unpacked size: 127715 bytes
- Benchmark files shipped: no

## Loaded Plugin Surface

- Status: loaded
- Origin: global
- Commands: clawseatbelt-status, clawseatbelt-mode, clawseatbelt-scan, clawseatbelt-explain, clawseatbelt-proofpack, clawseatbelt-answer, clawseatbelt-challenge
- Services: clawseatbelt-maintenance
- Hook count: 5
- Config schema present: yes

## Install Notes

- Install completed without additional plugin loader warnings.

## Caveats

- This verifies packaging, install, discovery, config pinning, and plugin registration in a disposable OpenClaw home.
- This does not yet prove side-by-side superiority against live competitor plugins inside the same agent run loop.

