# Skill Scanner

The skill scanner inspects local skill bundles before trust expands. It is deliberately static and local. The target is not perfect malware detection. The target is strong operator judgment with low friction.

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Waiting
  Waiting --> EnumeratingFiles: scan request
  EnumeratingFiles --> InspectingContent
  InspectingContent --> ScoringBundle
  ScoringBundle --> Waiting: report complete
```

## Sequence

```mermaid
sequenceDiagram
  participant User as Operator
  participant Scanner as Skill Scanner
  participant Rules as Skill Rules
  participant Report as Posture Reporter

  User->>Scanner: scan(skillDir)
  Scanner->>Rules: inspect SKILL.md and related files
  Rules-->>Scanner: matched risk factors
  Scanner->>Report: package findings
  Report-->>User: risk report with remediation
```

## Data Flow

```mermaid
flowchart TD
  A[Skill directory] --> B[File inventory]
  B --> C[Content extraction]
  C --> D[Pattern detection]
  D --> E[Finding set]
  E --> F[Risk score and recommendation]
```

## Initial Detection Targets

- `curl | bash` or equivalent pipe-to-shell flows
- base64 decode plus execution hints
- requests for tokens, wallets, or credentials
- shell installers with broad permissions
- suspicious external fetch patterns
