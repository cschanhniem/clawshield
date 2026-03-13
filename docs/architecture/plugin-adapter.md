# Plugin Adapter

This component is the seam between ClawSeatbelt’s pure logic and OpenClaw’s live runtime. It uses the currently verified extension surface:

- `openclaw.extensions` in `package.json`
- `api.on(...)`
- `api.registerCommand(...)`
- `api.registerService(...)`
- `nativeNames` for channel-native command aliases such as Telegram-safe slash commands

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Registering
  Registering --> Active: hooks and commands registered
  Active --> BriefingOperator: first eligible prompt build after startup
  Active --> ServingCommands: operator command invoked
  Active --> HandlingHooks: lifecycle hook fired
  BriefingOperator --> Active: one-time activation brief queued
  ServingCommands --> Active: reply payload returned
  HandlingHooks --> Active: hook result returned
  Active --> Stopped: gateway stop
```

## Sequence

```mermaid
sequenceDiagram
  participant OpenClaw as OpenClaw Runtime
  participant Plugin as ClawSeatbelt Adapter
  participant Core as ClawSeatbelt Runtime

  OpenClaw->>Plugin: load extension
  Plugin->>Core: validate config
  Plugin->>OpenClaw: register commands with channel-native aliases
  Plugin->>OpenClaw: register service
  Plugin->>OpenClaw: register hooks
  OpenClaw->>Plugin: first eligible before_prompt_build
  Plugin->>Core: build activation brief
  Core-->>Plugin: one-time trust note
  Plugin-->>OpenClaw: prompt context with activation brief
  OpenClaw->>Plugin: hook invocation
  Plugin->>Core: evaluate or sanitize
  Core-->>Plugin: typed result
  Plugin-->>OpenClaw: hook response
```

## Data Flow

```mermaid
flowchart TD
  A[OpenClaw config] --> B[Config validation]
  B --> C[ClawSeatbelt runtime]
  D[Commands] --> C
  E[Hooks] --> C
  C --> H[Activation brief injection]
  C --> F[Reply payloads]
  C --> G[Hook mutations]
```
