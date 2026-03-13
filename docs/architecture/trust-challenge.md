# Trust Challenge Architecture

## Purpose

ClawSeatbelt needs a first-proof surface that works on a clean install and does not depend on a live incident. The trust challenge gives operators a safe, synthetic way to verify that message scoring, transcript hygiene, and skill inspection are active.

Current runtime surface: `/clawseatbelt-challenge`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Running: operator requests trust challenge
  Running --> ScoringMessage: synthetic injection sample evaluated
  ScoringMessage --> RedactingTranscript: synthetic secret output sanitized
  RedactingTranscript --> InspectingSkill: synthetic skill setup text checked
  InspectingSkill --> Rendering: checks summarized into challenge artifact
  Rendering --> Ready: report returned to operator
  Ready --> Idle
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Runtime as ClawSeatbelt Runtime
  participant Risk as Risk Engine
  participant Redaction as Redaction Engine
  participant Skill as Skill Rules
  participant Report as Challenge Renderer

  Operator->>Runtime: /clawseatbelt-challenge
  Runtime->>Risk: evaluate synthetic message sample
  Risk-->>Runtime: inbound findings
  Runtime->>Redaction: sanitize synthetic secret output
  Redaction-->>Runtime: redaction findings
  Runtime->>Skill: evaluate synthetic skill setup sample
  Skill-->>Runtime: supply-chain findings
  Runtime->>Report: compose first-proof artifact
  Report-->>Operator: challenge report with next-step commands and pinned install footer
```

## Data Flow

```mermaid
flowchart LR
  A[Synthetic message sample] --> D[Challenge runner]
  B[Synthetic transcript sample] --> D
  C[Synthetic skill sample] --> D
  D --> E[Risk and redaction engines]
  D --> F[Skill rule engine]
  E --> G[Challenge checks]
  F --> G
  G --> H[Challenge report]
  H --> I[Status follow-up path]
  H --> J[Proof-pack share path]
  H --> K[Chat export]
  H --> L[Markdown export]
  H --> M[PR comment export]
```

## Design Guardrails

- The challenge must stay synthetic and safe to share.
- It proves the local defensive surfaces are wired, not that the whole environment is secure.
- It should work without files, accounts, or remote services.
- The artifact should tell the operator what was exercised, what still requires a live benchmark, and which share-safe path to use next.
