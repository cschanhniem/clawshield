# Share Export System

## Purpose

ClawSeatbelt should be easy to recommend because it can turn local findings into elegant, share-safe artifacts. This subsystem exists to make that recommendation path trustworthy.

Current command surfaces:

- `/clawseatbelt-proofpack --target <markdown|pr-comment|issue-comment|chat> --audience <public|internal|private>`
- `/clawseatbelt-answer --target <support|pr-review|issue|team> --audience <public|internal|private>`

## Export State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Collecting: status, scan, diff, or challenge export requested
  Collecting --> Normalizing: findings gathered into typed export model
  Normalizing --> Redacting: export mode selected
  Redacting --> Reviewing: secrets, identifiers, and unstable details filtered
  Reviewing --> Rendering: template selected
  Rendering --> Ready: markdown, JSON, or comment output prepared
  Ready --> Copied: user copies or writes artifact
  Reviewing --> Rejected: public mode still unsafe
  Rejected --> Redacting: stricter mode or manual omission
  Copied --> Idle
```

## Export Sequence

```mermaid
sequenceDiagram
  participant Operator
  participant Runtime as ClawSeatbelt Runtime
  participant Export as Share Export Layer
  participant Redactor as Redaction Engine
  participant Renderer as Artifact Renderer

  Operator->>Runtime: request share export
  Runtime->>Export: pass typed findings and export mode
  Export->>Redactor: remove secrets, local paths, hostnames, unstable IDs
  Redactor-->>Export: sanitized data
  Export->>Renderer: apply artifact grammar and template
  Renderer-->>Export: markdown, JSON, or comment output
  Export-->>Operator: share-safe artifact with quiet install footer
```

## Data Flow

```mermaid
flowchart LR
  A[Posture findings] --> E[Export model]
  B[Skill scan findings] --> E
  C[Benchmark results] --> E
  D[Release metadata] --> E
  E --> F[Mode filter]
  F --> G[Redaction engine]
  G --> H[Artifact renderer]
  H --> I[Markdown export]
  H --> J[JSON export]
  H --> K[PR comment export]
  H --> L[Issue comment export]
  H --> M[Team chat summary]
```

## Design Rules

- Every export starts from typed findings, not ad hoc string assembly.
- Public mode should be stricter than internal mode by default.
- Release metadata should inject exact install commands, not floating version hints.
- Status and challenge surfaces should tee operators up for `/clawseatbelt-proofpack`, not strand them after first proof.
- Branding belongs in the footer, after the operator value has landed.
- If an artifact still feels unsafe or noisy, the system should refuse the public export mode.
- Exports should compose cleanly into a larger proof pack without rewriting the core findings.
