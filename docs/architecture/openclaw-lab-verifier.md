# OpenClaw Lab Verifier

## Purpose

ClawSeatbelt cannot claim install trust if the real OpenClaw installer complains about the tarball. The OpenClaw lab verifier exists to package the current worktree, install it into a disposable `OPENCLAW_HOME`, pin `plugins.allow`, and confirm that the loaded plugin surface matches the trust story in the docs.

Current runtime surfaces:

- `npm run verify:openclaw-lab`
- `npm run verify:openclaw-lab:docs`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Packing: verifier started
  Packing --> Installing: tarball built
  Installing --> PinningAllowlist: plugin installed in disposable home
  PinningAllowlist --> Inspecting: allowlist pinned
  Inspecting --> RenderingArtifacts: plugin info and config parsed
  RenderingArtifacts --> CleaningUp: reports written
  CleaningUp --> Complete: disposable home removed
  Complete --> Idle
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Verifier as Lab Verifier
  participant npm
  participant OpenClaw
  participant Lab as Disposable OPENCLAW_HOME

  Operator->>Verifier: npm run verify:openclaw-lab
  Verifier->>npm: npm pack --json
  npm-->>Verifier: tarball metadata
  Verifier->>OpenClaw: plugins install <tarball>
  OpenClaw->>Lab: extract plugin and enable entry
  OpenClaw-->>Verifier: install output
  Verifier->>OpenClaw: config set plugins.allow ["clawseatbelt"]
  OpenClaw->>Lab: write pinned allowlist
  Verifier->>OpenClaw: plugins info clawseatbelt --json
  OpenClaw-->>Verifier: loaded plugin surface
  Verifier-->>Operator: markdown and json verification report
```

## Data Flow

```mermaid
flowchart LR
  A["package.json files whitelist"] --> E[Lab verifier]
  B[npm pack output] --> E
  C[OpenClaw install output] --> E
  D[Disposable openclaw.json] --> E
  E --> F[Install verification report]
  F --> G[docs/benchmarks/openclaw-install-verification.md]
  F --> H[docs/benchmarks/artifacts/openclaw-install-verification.json]
```

## Design Guardrails

- Treat install warnings as product bugs until proven otherwise.
- Keep benchmark-only or release-only tooling out of the published plugin tarball.
- Verify the allowlist flow with the real OpenClaw config command, not only with static JSON snippets.
- Make the verifier safe to rerun locally and easy to read in CI logs.
