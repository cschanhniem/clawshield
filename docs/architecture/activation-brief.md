# Activation Brief Architecture

## Purpose

ClawSeatbelt should not disappear into silence after install. The activation brief closes the gap between "plugin loaded" and "operator understands what is live" by injecting one calm, one-time trust brief into the next eligible assistant reply.

Current runtime surface: automatic first-session brief via `before_prompt_build`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Waiting
  Waiting --> Suppressed: operator uses a ClawSeatbelt command first
  Waiting --> Suppressed: mode is quiet or activation brief disabled
  Waiting --> Building: first eligible prompt build
  Building --> Rendering: posture preview assembled from local config findings
  Rendering --> Delivered: one-time brief injected into reply context
  Delivered --> Waiting: new session without prior brief
  Suppressed --> Waiting: gateway restart
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant OpenClaw
  participant Runtime as ClawSeatbelt Runtime
  participant Audit as Configuration Audit
  participant Brief as Activation Brief Renderer

  Operator->>OpenClaw: install plugin and restart gateway
  OpenClaw->>Runtime: load plugin hooks and commands
  alt operator asks a normal question first
    Operator->>OpenClaw: send first normal prompt
    OpenClaw->>Runtime: before_prompt_build
    Runtime->>Audit: assess local OpenClaw config
    Audit-->>Runtime: typed findings
    Runtime->>Brief: build one-time trust brief
    Brief-->>OpenClaw: mode, posture summary, proof path, share path
    OpenClaw-->>Operator: first reply includes activation brief
  else operator runs a ClawSeatbelt command first
    Operator->>Runtime: /clawseatbelt-status or /clawseatbelt-challenge
    Runtime->>Runtime: suppress auto brief for this gateway run
    Runtime-->>Operator: explicit command output only
  end
```

## Data Flow

```mermaid
flowchart LR
  A[OpenClaw config] --> B[Configuration audit]
  B --> C[Posture preview]
  D[Runtime mode] --> C
  E[Activation brief gate] --> F[Activation brief renderer]
  C --> F
  F --> G[Prompt context injection]
  G --> H[Assistant reply]
  H --> I[Operator sees plugin is live]
  J[Explicit ClawSeatbelt command] --> E
```

## Design Guardrails

- Show the brief once, then get out of the way.
- Keep it short enough to survive an unrelated conversation.
- Use local posture only. Do not auto-run remote checks or auto-share artifacts.
- Point to one proof command and one share-safe follow-up, not a menu of seven commands.
- Suppress the brief if the operator already engaged ClawSeatbelt directly.
