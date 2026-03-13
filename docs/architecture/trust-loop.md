# Trust Loop Architecture

## Purpose

ClawSeatbelt should grow because it produces artifacts operators genuinely need to share. This document maps that loop so growth stays useful, safe, and composable.

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Unaware
  Unaware --> Curious: sees status card, skill memo, or benchmark artifact
  Curious --> Installed: installs plugin
  Installed --> Activated: first reply confirms plugin is live
  Activated --> FirstProof: runs status, scan, diff, or challenge
  FirstProof --> Trusted: gets a clear finding or calm clean bill
  Trusted --> Shared: exports share-safe artifact
  Shared --> TrialByPeer: peer or teammate tries it
  TrialByPeer --> Standardized: team adopts ClawSeatbelt baseline
  Standardized --> Advocate: uses artifacts in PRs, tickets, and docs
  Advocate --> Shared: forwards next proof artifact
  FirstProof --> Lost: unclear value, noisy output, or rough install
  Trusted --> Lost: no habit or no reason to forward
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Plugin as ClawSeatbelt
  participant Export as Share Export Layer
  participant Peer

  Operator->>Plugin: Install plugin and ask first normal question
  Plugin-->>Operator: one-time activation brief with proof and share path
  Operator->>Plugin: Run status, scan, or challenge
  Plugin->>Plugin: Build typed findings and remediation
  Plugin->>Export: Request share artifact
  Export->>Export: Redact secrets, hostnames, tokens, and unstable IDs
  Export-->>Operator: Return share-safe markdown or JSON
  Operator-->>Peer: Post artifact in issue, PR, chat, or thread
  Peer->>Plugin: Install plugin and replay same flow
  Plugin-->>Peer: Fresh proof and install confidence
```

## Data Flow

```mermaid
flowchart LR
  A[OpenClaw config] --> E[Analysis layer]
  B[security audit JSON] --> E
  C[skill bundle] --> E
  D[message and tool results] --> E
  E --> F[typed findings]
  F --> G[activation brief]
  F --> H[posture summaries]
  F --> I[skill approval memos]
  F --> J[benchmark challenge reports]
  G --> K[first-session reply]
  H --> L[share export layer]
  I --> L
  J --> L
  L --> M[PR comment]
  L --> N[issue or ticket]
  L --> O[team chat]
  L --> P[community post or demo]
```

## Design Guardrails

- Shared artifacts must be useful even if the recipient never installs the plugin.
- Installed operators should get one calm activation cue before ClawSeatbelt disappears into the background.
- Redaction must run before any share export is rendered.
- Share paths must be explicit and user-driven. No auto-posting.
- Install hints belong in the footer, not as the whole artifact.
- The same typed findings should power local UX, exports, and docs.

## Backfire Checklist

- Does the artifact open with a decision summary instead of a product pitch.
- Could a skeptical engineer forward it without feeling they are forwarding an ad.
- Would the export still be safe if pasted into a public issue.
- Does a clean bill still feel useful, not smug or empty.
- Is the install path exact, pinned, and reproducible.
- Does the packet help at least one real support or review workflow without extra cleanup.
