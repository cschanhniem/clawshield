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
  InspectInstall --> RestartGateway
  RestartGateway --> Ready
  Ready --> [*]
  BuildRepo --> Failed
  PackArtifact --> Failed
  InstallLinkedRepo --> Failed
  InstallTarball --> Failed
  EnsureAllowlist --> Failed
  EnablePlugin --> Failed
  InspectInstall --> Failed
  RestartGateway --> Failed
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
  Dev->>OC: openclaw gateway restart
  OC->>Home: reload enabled plugins into the running gateway
  Dev->>OC: ask a normal question once
  OC-->>Dev: one-time activation brief in the next reply
  Dev->>OC: /clawseatbelt-status
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
  H --> I[gateway restart]
  I --> J[live plugin session]
  J --> K[first-reply activation brief]
```

## Notes

- `link` mode is the fastest inner loop and points OpenClaw at the repository checkout.
- `pack` mode is the safer release rehearsal because it exercises the tarball OpenClaw actually installs.
- OpenClaw can warn that `plugins.allow` is empty during the initial install before the allowlist write runs. That warning is transient on a clean first install.
- The deploy script confirms install metadata immediately, but a running gateway still needs a restart before the plugin becomes active in the live session.
- After the restart, the next normal assistant reply should include a one-time activation brief unless the operator immediately uses a ClawSeatbelt command first.
- Local terminal publishing is a different path. If `publishConfig.provenance` is enabled, local `npm publish` fails with `provider: null` because there is no GitHub OIDC provider in a plain shell session.
