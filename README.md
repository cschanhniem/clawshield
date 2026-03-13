# ClawSeatbelt

ClawSeatbelt is the local-first trust plugin for OpenClaw. It gives operators posture, skill inspection, transcript hygiene, and risky-session guardrails in minutes, without asking them to stand up a hosted control plane.

ClawSeatbelt is the new product name for the work that started under the ClawShield label. The repository path still uses `clawshield` for continuity, but the package, plugin ID, and public install surface now use `clawseatbelt`.

If you only install one OpenClaw trust plugin first, start here.

ClawSeatbelt is built for the exact high-intent searches OpenClaw users already make: OpenClaw security plugin, OpenClaw trust plugin, OpenClaw prompt injection protection, OpenClaw skill scanner, OpenClaw transcript redaction, and OpenClaw posture report.

## Install In Two Minutes

```bash
openclaw plugins install clawseatbelt@0.1.3
openclaw config set --strict-json plugins.allow '["clawseatbelt"]'
openclaw config set --strict-json plugins.entries.clawseatbelt.enabled true
openclaw gateway restart
```

The plugin loads after the gateway restart. On a fresh OpenClaw home, the install step may briefly warn that `plugins.allow` is empty before the allowlist command runs. That is expected on first install. If OpenClaw also prints unrelated doctor warnings, such as Telegram policy warnings, those come from the existing OpenClaw config rather than ClawSeatbelt.

After the restart, the next normal assistant reply should carry one short activation brief so the install does not vanish into silence. If you prefer zero install-time copy, switch to `quiet` mode or set `activationBriefEnabled` to `false`.

Suggested starting config:

```json
{
  "plugins": {
    "entries": {
      "clawseatbelt": {
        "enabled": true,
        "config": {
          "mode": "observe",
          "warnThreshold": 30,
          "holdThreshold": 60
        }
      }
    }
  }
}
```

Start in `observe`. Let it collect signal first. Move to `enforce` once the findings are calm and predictable.

## Prove Value In Five Minutes

After the gateway comes back, ask the assistant one normal question once. ClawSeatbelt should introduce itself with a brief trust note, current mode, and the right next command.

Run these inside OpenClaw:

```bash
/clawseatbelt-status
/clawseatbelt-scan /path/to/skill
/clawseatbelt-challenge --target markdown --audience public
```

If you want something ready to forward to a teammate, support thread, issue, or PR:

```bash
/clawseatbelt-proofpack --target pr-comment --audience public
```

If you want the lightest share-safe receipt right after install, use:

```bash
/clawseatbelt-proofpack --target chat --audience public
```

Telegram note:

- Telegram bot commands allow only lowercase letters, digits, and underscores.
- ClawSeatbelt maps short Telegram-safe aliases automatically:
  - `/csb_status`
  - `/csb_mode`
  - `/csb_scan`
  - `/csb_explain`
  - `/csb_proof`
  - `/csb_answer`
  - `/csb_check`
- Use the `csb_*` form on Telegram. Keep the canonical `clawseatbelt-*` names for other OpenClaw surfaces.

## Why OpenClaw Users Choose ClawSeatbelt

- Local-first by default. No account, no quota, no server, no cloud service in the hot path.
- Useful on day one. Install the plugin, allow it explicitly, and get a readable posture report within minutes.
- Built for the real OpenClaw threat model. It covers inbound message risk, dangerous tool calls, skill supply chain risk, transcript hygiene, and operator configuration gaps.
- Composes with OpenClaw instead of pretending first-party controls do not exist. ClawSeatbelt works with `openclaw security audit`, tool policy, exec approvals, pairing, and plugin allowlists.
- Turns proof into recommendation. The built-in challenge, answer, and proof-pack surfaces give users something clean to forward instead of generic security copy.
- Small enough to inspect. The package is intentionally lean because trust starts with what users can verify.

## What You Get In The First Five Minutes

- a posture report you can act on
- local proof that the trust layer is wired correctly
- skill supply-chain findings before enablement
- share-safe output for public or internal handoff

## What ClawSeatbelt Covers

- OpenClaw prompt injection risk scoring before the model sees risky content
- prompt-time guard context for safer agent behavior
- dangerous tool-call blocking in `enforce` mode
- transcript redaction for persisted tool results
- outbound secret scrubbing
- OpenClaw skill scanning for suspicious install and execution patterns
- Detection of unpinned installs, moving refs, install hooks, remote fetches, and permission-widening setup steps inside skill bundles
- unified posture reporting with remediation guidance
- OpenClaw security audit JSON ingestion, snapshot export, and posture diffing

## Pin Trust Explicitly

```json
{
  "plugins": {
    "allow": ["clawseatbelt"]
  }
}
```

The published tarball is intentionally tighter than the local development tree and excludes the benchmark harness from the install artifact, so OpenClaw does not flag benchmark-only `child_process` code during plugin install.

## Local-First Deploy

For local development, do not `npm publish` from your shell. Provenance is enabled for release builds, and local shell publish will fail with `provider: null` because there is no GitHub OIDC provider in that environment.

Use one of these instead:

```bash
npm run deploy:local
```

That path builds the repo, links it into OpenClaw, merges `plugins.allow`, and enables the plugin entry.

If you want to test the exact artifact shape OpenClaw will consume from npm:

```bash
npm run deploy:local:pack
```

That path packs the tarball and installs the `.tgz` into OpenClaw locally.

## Core Commands

- `/clawseatbelt-status`
- `/clawseatbelt-status --json --audit-file ./audit.json --write-snapshot ./clawseatbelt-posture.json`
- `/clawseatbelt-proofpack --audit-file ./audit.json --target pr-comment --audience public`
- `/clawseatbelt-answer --target support --audience public`
- `/clawseatbelt-challenge --target markdown --audience public`
- `/clawseatbelt-mode <observe|enforce|quiet>`
- `/clawseatbelt-scan <path>`
- `/clawseatbelt-explain <finding-id>`

## Built-In Proof Surfaces

- `clawseatbelt-status` is the fastest posture card and JSON snapshot path.
- `clawseatbelt-proofpack` turns local posture, scan findings, and diffs into a share-safe packet for PRs, issues, and chat.
- `clawseatbelt-answer` renders a short recommendation-ready answer backed by the current local proof instead of generic copy.
- `clawseatbelt-challenge` gives a safe first-proof self-check on a clean install by exercising message scoring, transcript hygiene, and skill inspection with synthetic samples.

Public proof surfaces default to redaction-friendly output and pinned install footers so the recommendation path stays tasteful and reproducible.

## Why Trust It

- It is built as an OpenClaw-native trust layer, not a detached dashboard story.
- It makes OpenClaw safer before and after runtime, not only at the moment of tool execution.
- It treats skill supply-chain risk as a first-class problem.
- It explains what happened, why it matters, and what to do next in plain operator language.
- It keeps the baseline complete even if future interop with policy servers or hosted detectors is added.
- It ships with install verification, benchmark evidence, and a small package surface users can actually inspect.

## Common OpenClaw Questions

### How do I secure OpenClaw without a cloud service?

Install ClawSeatbelt, keep it in `observe` first, and use its posture report alongside OpenClaw’s native security audit, tool policy, exec approvals, and pairing controls.

### How do I scan OpenClaw skills before installation?

Use `/clawseatbelt-scan <path>` on the skill bundle before enabling it. ClawSeatbelt is built to make skill trust expansion visible, not implicit.

### How do I stop secrets from lingering in OpenClaw transcripts?

ClawSeatbelt redacts persisted tool results locally and adds outbound secret scrubbing for defense in depth.

### Does ClawSeatbelt replace OpenClaw security audit?

No. ClawSeatbelt amplifies it. The goal is one readable posture story, not duplicate knobs.

### Does ClawSeatbelt solve prompt injection?

No. It reduces risk, adds visibility, and blocks obvious unsafe flows in enforce mode. It is not a sandbox and it does not make prompt injection disappear.

## Development

```bash
npm install
npm test
npm run benchmark:local
npm run benchmark:competitors:docs
npm run verify:openclaw-lab
```

## Docs

- [plan.md](plan.md)
- [AGENTS.md](AGENTS.md)
- [marketing/README.md](marketing/README.md)
- [marketing/no1-choice-plan.md](marketing/no1-choice-plan.md)
- [marketing/message-map.md](marketing/message-map.md)
- [marketing/launch-sequence.md](marketing/launch-sequence.md)
- [docs/product/quickstart.md](docs/product/quickstart.md)
- [docs/product/why-clawseatbelt-first.md](docs/product/why-clawseatbelt-first.md)
- [docs/product/maintainer-answer-kit.md](docs/product/maintainer-answer-kit.md)
- [docs/product/positioning.md](docs/product/positioning.md)
- [docs/product/packaging-and-provenance.md](docs/product/packaging-and-provenance.md)
- [docs/benchmarks/competitor-artifact-benchmark.md](docs/benchmarks/competitor-artifact-benchmark.md)
- [docs/benchmarks/local-runtime-benchmark.md](docs/benchmarks/local-runtime-benchmark.md)
- [docs/benchmarks/openclaw-competitor-lab.md](docs/benchmarks/openclaw-competitor-lab.md)
- [docs/benchmarks/openclaw-install-verification.md](docs/benchmarks/openclaw-install-verification.md)
- [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
- [docs/architecture/activation-brief.md](docs/architecture/activation-brief.md)
- [docs/architecture/competitor-lab.md](docs/architecture/competitor-lab.md)
- [docs/architecture/openclaw-lab-verifier.md](docs/architecture/openclaw-lab-verifier.md)
- [docs/architecture/local-deploy.md](docs/architecture/local-deploy.md)
- [docs/release/publish-playbook.md](docs/release/publish-playbook.md)
