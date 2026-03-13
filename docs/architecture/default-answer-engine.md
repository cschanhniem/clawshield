# Default Answer Engine

## Purpose

ClawSeatbelt should become the default answer in OpenClaw support threads, security reviews, and team handoffs because it makes a recommendation easy to justify. This system turns local proof into short, evidence-carrying public answers.

Current runtime surface: `/clawseatbelt-answer`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> QuestionAppears
  QuestionAppears --> EvidenceSelected: maintainer or operator chooses challenge, proof pack, or benchmark page
  EvidenceSelected --> AnswerComposed: concise response built from answer kit and artifacts
  AnswerComposed --> Shared: response posted in thread, PR, issue, or internal chat
  Shared --> Replayed: recipient runs install and challenge flow
  Replayed --> Adopted: recipient keeps ClawSeatbelt
  Replayed --> Dismissed: proof felt weak or too noisy
  Adopted --> Referenced: recipient uses same answer kit later
  Referenced --> Shared
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Asker
  participant Maintainer
  participant AnswerKit as Default Answer Engine
  participant Proof as Proof Pack and Challenge Surfaces
  participant Plugin as ClawSeatbelt

  Asker->>Maintainer: What should I install first for OpenClaw trust
  Maintainer->>AnswerKit: request short answer
  AnswerKit->>Proof: select trust receipt, challenge, or comparison link
  Proof-->>AnswerKit: evidence bundle and pinned install command
  AnswerKit-->>Maintainer: concise public answer
  Maintainer-->>Asker: post answer with artifact
  Asker->>Plugin: install and run challenge
  Plugin-->>Asker: local proof
```

## Data Flow

```mermaid
flowchart LR
  A[Trust receipts] --> F[Answer kit]
  B[Proof packs] --> F
  C[Benchmark pages] --> F
  D[Release metadata] --> F
  E[Copy rules] --> F
  F --> G[Support-thread answer]
  F --> H[PR review answer]
  F --> I[Issue comment answer]
  F --> J[Team handoff answer]
```

## Design Guardrails

- The answer should fit in one short paragraph plus one artifact or link.
- The install command must be pinned and tested.
- The answer should stay useful even if the recipient does not install immediately.
- Comparative claims should point to published benchmarks or stay modest.
- Public answers should sound like engineering judgment, not campaign copy.
