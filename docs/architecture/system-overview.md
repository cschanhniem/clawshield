# System Overview

ClawShield is split into a small, fast hot path and a slower analysis path. The hot path uses the current OpenClaw hook surface to score inbound prompts, redact outbound and persisted text, and block dangerous tool calls in enforce mode. The slower path scans skill bundles and assembles posture reports.

## Components

- `Risk Engine`: deterministic inbound scoring.
- `Runtime State`: memoization, throttling, recent incidents, and mode overrides.
- `Redaction Engine`: transcript hygiene for persisted tool output.
- `Skill Scanner`: local bundle inspection.
- `Posture Reporter`: unified findings and remediation summary.
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
  participant Report as Posture Reporter

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
  Channel->>Adapter: /clawshield-status
  Adapter->>Report: buildPosture(inputs)
  Report-->>Adapter: posture summary
  Adapter-->>Channel: shareable status message
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
  E --> K[Operator-facing summary]
```

## Trust Boundaries

- Untrusted: inbound messages, remote links, imported skill bundles, tool outputs.
- Trusted with care: local config, local rule packs, plugin code.
- Optional and off-path: future threat-intel feeds or third-party policy providers.
