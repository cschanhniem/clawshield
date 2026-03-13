# Competitor Lab

## Purpose

ClawSeatbelt cannot earn the phrase "best OpenClaw plugin" from internal tests alone. The competitor lab exists to install real rival packages into disposable OpenClaw homes, inspect the live plugin surface they register, and compare their install trust story against ClawSeatbelt under the same loader.

Current runtime surfaces:

- `npm run benchmark:competitors`
- `npm run benchmark:competitors:docs`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Packing: benchmark started
  Packing --> InstallingCandidate: next package prepared
  InstallingCandidate --> PinningAllowlist: plugin installed in disposable home
  PinningAllowlist --> InspectingSurface: allowlist pinned
  InspectingSurface --> RecordingSignals: plugin info and package metadata parsed
  RecordingSignals --> InstallingCandidate: remaining candidates
  RecordingSignals --> RenderingArtifacts: all candidates processed
  RenderingArtifacts --> Complete
  Complete --> Idle
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Lab as Competitor Lab
  participant npm
  participant OpenClaw
  participant Home as Disposable OPENCLAW_HOME

  Operator->>Lab: npm run benchmark:competitors
  loop each candidate package
    Lab->>npm: npm view + npm pack
    npm-->>Lab: package metadata and tarball facts
    Lab->>OpenClaw: plugins install <spec>
    OpenClaw->>Home: extract plugin and enable entry
    OpenClaw-->>Lab: install output and warnings
    Lab->>OpenClaw: config set plugins.allow ["<pluginId>"]
    OpenClaw->>Home: pin allowlist
    Lab->>OpenClaw: plugins info <pluginId> --json
    OpenClaw-->>Lab: live plugin surface
    Lab->>Lab: classify local-first, server-backed, dangerous-pattern, and packaging signals
  end
  Lab-->>Operator: markdown and json benchmark artifact
```

## Data Flow

```mermaid
flowchart LR
  A[npm metadata] --> E[Competitor lab]
  B[npm pack artifacts] --> E
  C[OpenClaw install output] --> E
  D[Plugin info JSON] --> E
  E --> F[Comparison rows]
  F --> G[docs/benchmarks/openclaw-competitor-lab.md]
  F --> H[docs/benchmarks/artifacts/openclaw-competitor-lab.json]
```

## Design Guardrails

- Compare what the real OpenClaw loader sees, not what README copy promises.
- Keep verdicts narrow. Install trust and plugin surface are not the same as detection quality.
- Treat server reachability, auto-registration, quotas, and dangerous-pattern warnings as first-class operator signals.
- Use the lab to sharpen ClawSeatbelt before making category claims.
