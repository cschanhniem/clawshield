# 2026-03-13 Supply-Chain Scanner Upgrade

## Goal

Strengthen the skill scanner so ClawSeatbelt can compete credibly on the supply-chain dimension, not just on prompt and tool guardrails.

## Changes

- expanded [src/rules/skillRules.ts](src/rules/skillRules.ts) to detect:
  - unpinned package installs
  - moving refs such as `latest`, `main`, and `master`
  - install hooks such as `preinstall`, `postinstall`, and `prepare`
  - hidden execution flows like `bash -c`, `node -e`, and `python -c`
  - permission-widening setup steps for OpenClaw and local files
  - remote fetch patterns including raw-content URLs and IP-address downloads
- improved `/clawseatbelt-scan` output in [src/core/clawSeatbeltRuntime.ts](src/core/clawSeatbeltRuntime.ts) so it now reports top findings and the first remediation step
- added regression coverage in [test/core.test.ts](test/core.test.ts) and [test/plugin.test.ts](test/plugin.test.ts)
- updated [docs/architecture/skill-scanner.md](docs/architecture/skill-scanner.md), [README.md](README.md), [docs/product/quickstart.md](docs/product/quickstart.md), and [plan.md](plan.md)

## Notes

- the scanner is still deterministic and static. It is meant to improve operator judgment, not pretend to be a full malware sandbox
- provenance scoring is still only partial. Exact publisher and checksum trust logic remains a next-step gap

## Verification

- `npm test`
