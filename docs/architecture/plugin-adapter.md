# Plugin Adapter

This component is the seam between ClawShield’s pure logic and OpenClaw’s live runtime. It uses the currently verified extension surface:

- `openclaw.extensions` in `package.json`
- `api.on(...)`
- `api.registerCommand(...)`
- `api.registerService(...)`

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Registering
  Registering --> Active: hooks and commands registered
  Active --> ServingCommands: operator command invoked
  Active --> HandlingHooks: lifecycle hook fired
  ServingCommands --> Active: reply payload returned
  HandlingHooks --> Active: hook result returned
  Active --> Stopped: gateway stop
```

## Sequence

```mermaid
sequenceDiagram
  participant OpenClaw as OpenClaw Runtime
  participant Plugin as ClawShield Adapter
  participant Core as ClawShield Runtime

  OpenClaw->>Plugin: load extension
  Plugin->>Core: validate config
  Plugin->>OpenClaw: register commands
  Plugin->>OpenClaw: register service
  Plugin->>OpenClaw: register hooks
  OpenClaw->>Plugin: hook invocation
  Plugin->>Core: evaluate or sanitize
  Core-->>Plugin: typed result
  Plugin-->>OpenClaw: hook response
```

## Data Flow

```mermaid
flowchart TD
  A[OpenClaw config] --> B[Config validation]
  B --> C[ClawShield runtime]
  D[Commands] --> C
  E[Hooks] --> C
  C --> F[Reply payloads]
  C --> G[Hook mutations]
```
