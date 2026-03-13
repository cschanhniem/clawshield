# Proof Pack System

## Purpose

ClawSeatbelt should turn one operator's local proof into a compact packet another operator can act on. The proof pack is the highest-leverage distribution surface because it solves a trust decision in the exact places where OpenClaw users ask for help.

Current runtime surface: `/clawseatbelt-proofpack`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Gathering: user requests proof pack
  Gathering --> Selecting: choose trust receipt, posture, diff, skill memo, or benchmark artifacts
  Selecting --> Redacting: apply export mode
  Redacting --> Rendering: create packet sections and footer
  Rendering --> Reviewing: run taste and safety checks
  Reviewing --> Ready: packet approved
  Reviewing --> Rework: too noisy, unsafe, or weak
  Rework --> Selecting: adjust scope or mode
  Ready --> Shared: user posts packet in PR, issue, chat, or listing demo
  Shared --> Idle
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Runtime as ClawSeatbelt Runtime
  participant Findings as Findings Pipeline
  participant Export as Share Export Layer
  participant ProofPack as Proof Pack Composer

  Operator->>Runtime: request proof pack
  Runtime->>Findings: fetch posture, diff, scan, or challenge findings
  Findings-->>Runtime: typed findings and metadata
  Runtime->>Export: sanitize findings for selected export mode
  Export-->>Runtime: sanitized artifacts
  Runtime->>ProofPack: compose packet structure and footer
  ProofPack-->>Operator: proof pack ready for PR, issue, or chat
```

## Data Flow

```mermaid
flowchart LR
  A[Trust receipt] --> F[Proof pack composer]
  B[Posture card and diff] --> F
  C[Skill memo] --> F
  D[Benchmark challenge result] --> F
  E[Release metadata] --> F
  F --> G[Taste review]
  G --> H[PR proof pack]
  G --> I[Issue proof pack]
  G --> J[Chat proof pack]
  G --> K[Launch proof pack]
```

## Design Rules

- A proof pack should help a recipient decide, not merely admire.
- First-proof surfaces should point toward the proof pack with one explicit share-safe command.
- One weak section should be removable without breaking the packet.
- Clean results deserve space, not just alarming ones.
- Install guidance must be exact, pinned, and quiet.
- The packet should feel like a field report from a careful operator.
