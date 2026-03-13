# Benchmark Harness

## Purpose

ClawSeatbelt needs a repeatable proof layer that can be rerun as the product evolves. The benchmark harness exists to measure local runtime behavior against a shared corpus, record the current trust challenge results, and snapshot live competitor package availability.

Current runtime surface: `npm run benchmark:local`

Install-path verification is documented separately in [docs/architecture/openclaw-lab-verifier.md](openclaw-lab-verifier.md).
Live competitor comparison is documented separately in [docs/architecture/competitor-lab.md](competitor-lab.md).

## State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> LoadingCorpus: benchmark started
  LoadingCorpus --> RunningMessageChecks
  RunningMessageChecks --> RunningRedactionChecks
  RunningRedactionChecks --> RunningSkillChecks
  RunningSkillChecks --> RunningTrustChallenge
  RunningTrustChallenge --> CapturingCompetitorMetadata
  CapturingCompetitorMetadata --> RenderingArtifacts
  RenderingArtifacts --> Complete
  Complete --> Idle
```

## Sequence Diagram

```mermaid
sequenceDiagram
  participant Operator
  participant Harness as Benchmark Harness
  participant Risk as Risk Engine
  participant Redaction as Redaction Engine
  participant Skill as Skill Scanner
  participant Challenge as Trust Challenge
  participant Npm as npm registry

  Operator->>Harness: npm run benchmark:local
  Harness->>Risk: run message corpus
  Risk-->>Harness: score and mode results
  Harness->>Redaction: run secret-output corpus
  Redaction-->>Harness: sanitized results
  Harness->>Skill: run skill corpus
  Skill-->>Harness: supply-chain results
  Harness->>Challenge: run built-in trust challenge
  Challenge-->>Harness: first-proof checks
  Harness->>Npm: npm view competitor packages
  Npm-->>Harness: live package metadata
  Harness-->>Operator: markdown report and json artifact
```

## Data Flow

```mermaid
flowchart LR
  A[Message corpus] --> E[Benchmark harness]
  B[Redaction corpus] --> E
  C[Skill corpus] --> E
  D[Competitor package metadata] --> E
  E --> F[Runtime benchmark report]
  E --> G[JSON artifact]
  F --> H[docs/benchmarks/local-runtime-benchmark.md]
  G --> I[docs/benchmarks/artifacts/local-runtime-benchmark.json]
```

## Design Guardrails

- Keep the harness deterministic for local ClawSeatbelt behavior.
- Separate live competitor metadata from efficacy claims.
- Treat the harness as proof for this repository, not as a final public marketing shootout.
- Publish caveats with every report so artifact strength is not confused with full category proof.
- Keep install-path verification separate from corpus scoring so a package-trust regression does not hide inside performance or detection numbers.
