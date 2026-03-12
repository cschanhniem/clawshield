# Operator Quickstart

## Install

Once the package is published:

```bash
openclaw plugins install @clawshield/local@0.1.0
```

Then pin trust explicitly in OpenClaw config:

```json
{
  "plugins": {
    "allow": ["clawshield-local"]
  }
}
```

## Suggested First Config

```json
{
  "plugins": {
    "entries": {
      "clawshield-local": {
        "enabled": true,
        "config": {
          "mode": "observe",
          "warnThreshold": 30,
          "holdThreshold": 60
        }
      }
    }
  }
}
```

Start in `observe`. Move to `enforce` after a week of low-noise operation.

## Commands

- `clawshield-status`: shareable posture summary plus recent incident digest
- `clawshield-mode <observe|enforce|quiet>`: runtime mode override
- `clawshield-scan <path>`: local skill bundle inspection
- `clawshield-explain <finding-id>`: human-readable rationale and next step

## Recommended OpenClaw Pairings

- Set `plugins.allow` explicitly.
- Avoid `exec.security = "full"` for open-ingress chat flows.
- Turn on approval prompts for sensitive execution.
- Enable transcript redaction in OpenClaw and let ClawShield add local defense in depth.

## What ClawShield Does Not Promise

- It does not solve prompt injection.
- It is not a sandbox.
- It does not replace OpenClaw’s built-in security audit or tool policy.

It reduces risk, makes posture legible, and closes obvious trust gaps before they turn into incidents.
