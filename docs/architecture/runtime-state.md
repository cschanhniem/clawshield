# Runtime State

The runtime state is intentionally simple. It exists to keep the hot path fast and to prevent ClawShield from nagging operators every time the same risky prompt reappears.

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Cold
  Cold --> Caching: message evaluated
  Caching --> Tracking: session risk remembered
  Tracking --> Throttling: duplicate warning arrives
  Throttling --> Tracking: warning window expires
  Tracking --> Expiring: TTL passes
  Expiring --> Cold
```

## Sequence

```mermaid
sequenceDiagram
  participant Adapter as Plugin Adapter
  participant State as Runtime State
  participant Risk as Risk Engine

  Adapter->>State: lookup cached evaluation
  alt cache miss
    State->>Risk: evaluate message
    Risk-->>State: risk evaluation
  end
  State->>State: record session risk
  State->>State: apply throttle gate
  State-->>Adapter: snapshot + notify decision
```

## Data Flow

```mermaid
flowchart LR
  A[Prompt content] --> B[Fingerprint]
  B --> C[Evaluation cache]
  C --> D[Session risk map]
  D --> E[Notification throttle]
  D --> F[Recent incidents]
```
