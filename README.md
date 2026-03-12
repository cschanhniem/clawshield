# ClawShield

ClawShield is a local-first trust layer for OpenClaw. The repository now contains a working plugin module aligned to the current OpenClaw extension contract, plus the architecture, launch, and benchmark docs needed to ship it responsibly.

## Current Surface

- inbound message risk scoring
- prompt-time guard context injection
- enforce-mode blocking for dangerous tool calls
- persisted tool result redaction
- outbound secret scrubbing
- local skill scanning
- unified posture reporting

## Install

After publish:

```bash
openclaw plugins install @clawshield/local@0.1.0
```

Pin trust explicitly in OpenClaw:

```json
{
  "plugins": {
    "allow": ["clawshield-local"]
  }
}
```

## Release

Manual release flow:

```bash
npm test
npm pack --json --pack-destination .tmp/pack
npm publish --access public
```

Automated publish is prepared through GitHub Actions once `NPM_TOKEN` is configured.

## Development

```bash
npm install
npm test
```

## Docs

- [AGENTS.md](AGENTS.md)
- [plan.md](plan.md)
- [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
- [docs/product/quickstart.md](docs/product/quickstart.md)
- [docs/product/packaging-and-provenance.md](docs/product/packaging-and-provenance.md)
- [docs/release/publish-playbook.md](docs/release/publish-playbook.md)
- [docs/benchmarks/competitor-artifact-benchmark.md](docs/benchmarks/competitor-artifact-benchmark.md)
