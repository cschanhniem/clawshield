# Compounding Moat Architecture

## Purpose

ClawSeatbelt should become easier to choose over time because its artifacts, corpus, and public proof reinforce each other. This map defines how that compounding loop works without relying on hidden telemetry or manipulative growth mechanics.

## State Machine

```mermaid
stateDiagram-v2
  [*] --> NewRelease
  NewRelease --> FreshProof: trust receipts, proof packs, and benchmark outputs published
  FreshProof --> PublicReference: artifacts used in PRs, issues, docs, or community threads
  PublicReference --> Discovery: new operators encounter ClawSeatbelt through useful evidence
  Discovery --> Trial: operator installs and runs first proof
  Trial --> Standardized: team or maintainer adopts ClawSeatbelt baseline
  Standardized --> Contribution: benchmark result, corpus sample, docs fix, or issue feedback contributed
  Contribution --> StrongerProduct: corpus, docs, and exports improve
  StrongerProduct --> NewRelease
  Trial --> Lost: first proof is weak, unclear, or awkward to share
  PublicReference --> Lost: artifacts feel too promotional or too noisy
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Maintainer
  participant Plugin as ClawSeatbelt
  participant Export as Proof Pack and Export Layers
  participant Community
  participant Repo as Corpus and Benchmark Archive

  Maintainer->>Plugin: run status, scan, diff, or challenge
  Plugin-->>Maintainer: typed findings and proof artifacts
  Maintainer->>Export: prepare public-share proof pack
  Export-->>Maintainer: redacted packet with pinned install footer
  Maintainer-->>Community: post packet in PR, issue, thread, or docs
  Community->>Plugin: new operator installs and runs same flow
  Plugin-->>Community: fresh local proof
  Community->>Repo: contribute benchmark result, sample, or friction report
  Repo-->>Plugin: improved corpus, docs, and benchmark material for next release
```

## Data Flow

```mermaid
flowchart LR
  A[Typed findings] --> E[Share export layer]
  B[Benchmark outputs] --> E
  C[Release metadata] --> E
  E --> F[Proof packs and trust artifacts]
  F --> G[Public references: PRs, issues, docs, community threads]
  G --> H[Discovery and trial]
  H --> I[Public feedback, corpus contributions, friction reports]
  I --> J[Corpus and benchmark archive]
  J --> K[Improved rules, docs, and releases]
  K --> A
  K --> B
```

## Design Guardrails

- Evidence should compound publicly. User data should not.
- Corpus growth must come from explicit contributions, reproduced attacks, and synthetic fixtures.
- Public references should still be useful if the reader never installs the plugin.
- Clean-system outputs matter as much as risky-system outputs for long-term adoption.
- If measurement requires hidden telemetry, the loop has drifted off course.
