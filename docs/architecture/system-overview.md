# System Overview

ClawSeatbelt is split into a small, fast hot path and a slower analysis path. The hot path uses the current OpenClaw hook surface to score inbound prompts, redact outbound and persisted text, and block dangerous tool calls in enforce mode. The slower path scans skill bundles, normalizes OpenClaw security audit JSON, and assembles posture reports.

## Components

- `Risk Engine`: deterministic inbound scoring.
- `Runtime State`: memoization, throttling, recent incidents, and mode overrides.
- `Redaction Engine`: transcript hygiene for persisted tool output.
- `Skill Scanner`: local bundle inspection.
- `OpenClaw Audit Ingestor`: normalizes first-party audit JSON into ClawSeatbelt findings.
- `Posture Reporter`: unified findings, posture facets, snapshots, and remediation summary.
- `Share Export Layer`: renders typed findings into share-safe markdown, JSON, and comment-ready artifacts.
- `Proof Pack Composer`: bundles trust artifacts into recommendation-ready operator packets.
- `Compounding Moat Loop`: turns proof artifacts, public references, and corpus contributions into stronger future releases.
- `Default Answer Engine`: packages proof into short recommendation-ready answers for threads, reviews, and team handoffs.
- `Trust Challenge Runner`: exercises core defenses with safe synthetic samples for first-proof installs.
- `Benchmark Harness`: runs a shared local corpus and records current package-level comparison context.
- `Plugin Adapter`: OpenClaw-facing hooks and commands via `api.on(...)`, `registerCommand(...)`, and `registerService(...)`.

## System State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> ReceivingMessage: message_received
  ReceivingMessage --> EvaluatingPrompt: before_prompt_build
  EvaluatingPrompt --> GuardingToolCall: before_tool_call
  GuardingToolCall --> RedactingOutbound: message_sending
  RedactingOutbound --> RedactingToolResult: tool_result_persist
  Idle --> ScanningSkills: scan requested
  Idle --> BuildingPosture: status or audit requested
  BuildingPosture --> LoadingAudit: audit file supplied
  LoadingAudit --> BuildingPosture: audit normalized
  ReceivingMessage --> Idle: cached risk snapshot
  RedactingOutbound --> Idle: sanitized outbound text
  RedactingToolResult --> Idle: sanitized output returned
  ScanningSkills --> Idle: scan report completed
  BuildingPosture --> Idle: report emitted
```

## Request Sequence

```mermaid
sequenceDiagram
  participant Channel as Chat Channel
  participant Adapter as Plugin Adapter
  participant Risk as Risk Engine
  participant State as Runtime State
  participant Audit as Audit Ingestor
  participant Report as Posture Reporter
  participant Export as Share Export Layer
  participant ProofPack as Proof Pack Composer
  participant Moat as Compounding Moat Loop
  participant Answer as Default Answer Engine
  participant Challenge as Trust Challenge Runner
  participant Benchmark as Benchmark Harness

  Channel->>Adapter: message_received
  Adapter->>Risk: evaluate(content)
  Risk-->>Adapter: findings
  Adapter->>State: cache + throttle + remember session risk
  Channel->>Adapter: before_prompt_build
  Adapter->>Risk: evaluate(prompt)
  Adapter-->>Channel: prepend guard context when needed
  Channel->>Adapter: before_tool_call
  Adapter->>State: resolve session risk
  Adapter-->>Channel: allow or block dangerous tools
  Channel->>Adapter: /clawseatbelt-status --audit-file --diff-file
  Adapter->>Audit: normalize audit json (optional)
  Audit-->>Adapter: audit findings
  Adapter->>Report: build posture snapshot + diff
  Report-->>Adapter: posture card, snapshot, diff
  Adapter->>Export: render requested export form
  Export-->>Adapter: share-safe status artifact
  Adapter->>ProofPack: compose artifacts for /clawseatbelt-proofpack
  ProofPack-->>Adapter: proof pack output
  Adapter->>Moat: publish reusable artifact inputs when explicitly requested
  Moat-->>Adapter: benchmark, archive, or contribution-ready material
  Adapter->>Answer: build thread-ready recommendation for /clawseatbelt-answer
  Answer-->>Adapter: concise answer with proof reference
  Adapter->>Challenge: run /clawseatbelt-challenge synthetic checks
  Challenge-->>Adapter: first-proof report
  Benchmark-->>Channel: benchmark markdown and json artifacts when requested offline
  Adapter-->>Channel: shareable status message, proof pack, challenge report, or json export
```

## Data Flow

```mermaid
flowchart LR
  A[Inbound content] --> B[Risk Engine]
  B --> C[Runtime State]
  C --> D[Tool Call Gate]
  D --> E[Posture Reporter]
  F[Outbound content] --> G[Redaction Engine]
  H[Persisted tool message] --> G
  G --> E
  I[Skill bundle] --> J[Skill Scanner]
  J --> E
  L[OpenClaw audit JSON] --> M[Audit Ingestor]
  M --> E
  N[Previous snapshot] --> E
  E --> O[Share Export Layer]
  O --> P[Proof Pack Composer]
  P --> Q[Compounding Moat Loop]
  Q --> R[Default Answer Engine]
  R --> S[Trust Challenge Runner]
  S --> T[Benchmark Harness]
  O --> K[Operator-facing summary]
  P --> K
  Q --> K
  R --> K
  S --> K
  T --> K
```

## Trust Boundaries

- Untrusted: inbound messages, remote links, imported skill bundles, tool outputs.
- Untrusted until parsed: imported audit JSON and prior posture snapshots.
- Trusted with care: local config, local rule packs, plugin code.
- Optional and off-path: future threat-intel feeds or third-party policy providers.
