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
- unpinned installs and moving refs such as `latest`, `main`, or bare package names
- install hooks such as `preinstall`, `postinstall`, and `prepare`
- base64 decode plus hidden execution hints such as `node -e`, `python -c`, `bash -c`, or encoded PowerShell
- requests for tokens, wallets, or credentials
- OpenClaw permission expansion such as `exec.security = full`, `tools.profile = full`, or wildcard ingress
- suspicious external fetch patterns including raw content URLs and IP-address downloads
