# 2026-03-13 Local Benchmark Harness

## Goal

Close the biggest remaining proof gap that can be solved entirely inside this repository: a repeatable local runtime benchmark with current competitor package visibility.

## Changes

- added [src/benchmark/runtimeBenchmark.ts](src/benchmark/runtimeBenchmark.ts)
- added [src/benchmark/runLocalBenchmark.ts](src/benchmark/runLocalBenchmark.ts)
- added [test/benchmark.test.ts](test/benchmark.test.ts)
- added a richer skill corpus fixture under [test/fixtures/skills/unpinned](test/fixtures/skills/unpinned)
- added `npm run benchmark:local` in [package.json](package.json)
- added [docs/architecture/benchmark-harness.md](docs/architecture/benchmark-harness.md)
- updated [README.md](README.md), [AGENTS.md](AGENTS.md), [SKILL.md](SKILL.md), and [plan.md](plan.md)

## Notes

- the harness proves current local ClawSeatbelt behavior and snapshots live npm competitor availability
- it does not yet replace the still-missing disposable OpenClaw lab benchmark

## Verification

- `npm test`
- `npm run benchmark:local`
- `git diff --check`
