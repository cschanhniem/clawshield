# Local Deploy

## Purpose

ClawSeatbelt has two local deployment modes:

- `link` for fast iteration against the current repository checkout
- `pack` for release-like verification against the exact tarball that OpenClaw will consume

## State Machine

```mermaid
stateDiagram-v2
  [*] --> SelectMode
  SelectMode --> BuildRepo: link
  SelectMode --> PackArtifact: pack
  BuildRepo --> InstallLinkedRepo
  PackArtifact --> InstallTarball
  InstallLinkedRepo --> EnsureAllowlist
  InstallTarball --> EnsureAllowlist
  EnsureAllowlist --> EnablePlugin
  EnablePlugin --> InspectInstall
  InspectInstall --> Ready
  Ready --> [*]
  BuildRepo --> Failed
  PackArtifact --> Failed
  InstallLinkedRepo --> Failed
  InstallTarball --> Failed
  EnsureAllowlist --> Failed
  EnablePlugin --> Failed
  InspectInstall --> Failed
  Failed --> [*]
```

## Sequence

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant Script as deploy-local-openclaw.mjs
  participant Npm as npm
  participant OC as OpenClaw CLI
  participant Home as OPENCLAW_HOME

  Dev->>Script: npm run deploy:local or deploy:local:pack
  alt link mode
    Script->>Npm: npm run build
    Script->>OC: openclaw plugins install --link .
  else pack mode
    Script->>Npm: npm pack --json --pack-destination .tmp/pack
    Script->>OC: openclaw plugins install <tarball>
  end
  Script->>OC: openclaw config get plugins.allow --json
  Script->>OC: openclaw config set plugins.allow [..., clawseatbelt]
  Script->>OC: openclaw config set plugins.entries.clawseatbelt.enabled true
  Script->>OC: openclaw plugins list --json
  OC->>Home: write plugin entry and config
  Script-->>Dev: source path, commands, hooks, next step
```

## Data Flow

```mermaid
flowchart LR
  A[Repository root] --> B[Build or pack step]
  B --> C[OpenClaw plugin install]
  C --> D[OpenClaw extension directory]
  D --> E[plugins.allow merged with clawseatbelt]
  E --> F[plugins.entries.clawseatbelt.enabled = true]
  F --> G[openclaw plugins list --json]
  G --> H[deploy summary]
```

## Notes

- `link` mode is the fastest inner loop and points OpenClaw at the repository checkout.
- `pack` mode is the safer release rehearsal because it exercises the tarball OpenClaw actually installs.
- Local terminal publishing is a different path. If `publishConfig.provenance` is enabled, local `npm publish` fails with `provider: null` because there is no GitHub OIDC provider in a plain shell session.
