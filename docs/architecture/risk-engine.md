# Risk Engine

The risk engine is a deterministic evaluator for inbound messages. It should be cheap enough for the hot path and clear enough that operators can understand why a message was flagged.

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Ready
  Ready --> ExtractingSignals: evaluate request
  ExtractingSignals --> Scoring
  Scoring --> Ready: findings emitted
```

## Evaluation Sequence

```mermaid
sequenceDiagram
  participant Adapter as Plugin Adapter
  participant Engine as Risk Engine
  participant Rules as Rule Pack

  Adapter->>Engine: evaluate(message)
  Engine->>Rules: apply lexical and structural checks
  Rules-->>Engine: matched signals
  Engine-->>Adapter: risk summary and remediation hints
```

## Signal Families

- prompt-injection phrases
- shell execution bait
- obfuscation markers
- credential harvest cues
- suspicious external URLs

## Constraints

- No network calls.
- No model calls.
- O(message length) behavior.
- Findings must carry evidence snippets and remediation.
