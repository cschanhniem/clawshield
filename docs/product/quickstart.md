# OpenClaw Security Quickstart

This is the fastest path to a safer OpenClaw setup with ClawSeatbelt.

## 1. Install The Plugin

Once the package is published:

```bash
openclaw plugins install clawseatbelt@0.1.0
openclaw config set --strict-json plugins.allow '["clawseatbelt"]'
openclaw config set --strict-json plugins.entries.clawseatbelt.enabled true
```

## 2. Allow It Explicitly

Pin plugin trust in your OpenClaw config:

```json
{
  "plugins": {
    "allow": ["clawseatbelt"]
  }
}
```

If you install into a blank OpenClaw home and skip the allowlist step, OpenClaw will warn that non-bundled plugins are discoverable. That is expected. Pin the allowlist immediately so the warning disappears for the right reason.

## 3. Start In Observe Mode

Use a conservative first configuration:

```json
{
  "plugins": {
    "entries": {
      "clawseatbelt": {
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

`observe` is the right first step for most OpenClaw users. Let it collect signal before you ask it to block.

## 4. Check Your Posture

Run:

```bash
/clawseatbelt-status
```

For machine-readable posture output or first-party audit ingestion:

```bash
/clawseatbelt-status --json --audit-file ./openclaw-audit.json --write-snapshot ./clawseatbelt-posture.json
```

You should see a compact posture summary that explains:

- current runtime mode
- recent high-signal findings
- OpenClaw trust gaps worth fixing next

If you pass a prior snapshot with `--diff-file`, ClawSeatbelt will show whether trust posture improved or regressed.

## 5. Scan Skills Before You Trust Them

Run:

```bash
/clawseatbelt-scan /path/to/skill
```

Use this before enabling a skill, especially if the bundle pulls remote scripts, expands permissions, or hides execution behind setup instructions.

The current scanner also flags unpinned installers, `latest` or branch-based installs, `preinstall` or `postinstall` hooks, and setup steps that widen OpenClaw permissions.


## 6. Export A Share-Safe Proof Pack

Once you have posture and scan signal, render a packet you can forward without cleanup:

```bash
/clawseatbelt-proofpack --audit-file ./openclaw-audit.json --target pr-comment --audience public
```

For a one-paragraph recommendation answer:

```bash
/clawseatbelt-answer --target support --audience public
```

These surfaces are built for support threads, PRs, issues, and team handoffs. Public mode keeps secrets and local paths out of the artifact by default.

## 7. Run The First-Proof Trust Challenge

On a clean install, you can prove the local defenses are wired without waiting for a live incident:

```bash
/clawseatbelt-challenge --target markdown --audience public
```

This is synthetic on purpose. It verifies that the main protective layers are active, then tells the operator to follow up with real posture and benchmark work.

## 8. Move To Enforce When The Signal Is Clean

After a low-noise soak, switch to:

```bash
/clawseatbelt-mode enforce
```

`enforce` is where ClawSeatbelt starts blocking dangerous tool calls in risky sessions.

## Commands Worth Remembering

- `clawseatbelt-status`
- `clawseatbelt-mode <observe|enforce|quiet>`
- `clawseatbelt-scan <path>`
- `clawseatbelt-explain <finding-id>`
- `clawseatbelt-proofpack --target <markdown|pr-comment|issue-comment|chat> --audience <public|internal|private>`
- `clawseatbelt-answer --target <support|pr-review|issue|team> --audience <public|internal|private>`
- `clawseatbelt-challenge --target <markdown|pr-comment|issue-comment|chat> --audience <public|internal|private>`
- Use the slash form inside OpenClaw chat, for example `/clawseatbelt-status`.

## Best Pairings With Native OpenClaw Security

- Set `plugins.allow` explicitly.
- Use `openclaw security audit` as a first-party baseline and let ClawSeatbelt make the results easier to act on.
- Avoid `exec.security = "full"` for open-ingress chat flows.
- Turn on approval prompts for sensitive execution.
- Enable OpenClaw transcript redaction and let ClawSeatbelt add local defense in depth.

## What ClawSeatbelt Does And Does Not Do

ClawSeatbelt is an OpenClaw trust layer. It is not a sandbox, and it does not claim prompt injection is solved. It reduces risk, improves visibility, and helps operators close obvious trust gaps before they become incidents.
