# OpenClaw Quickstart

This is the fastest path from install to first proof with ClawSeatbelt.

## 1. Install The Plugin

```bash
openclaw plugins install clawseatbelt@0.1.3
openclaw config set --strict-json plugins.allow '["clawseatbelt"]'
openclaw config set --strict-json plugins.entries.clawseatbelt.enabled true
openclaw gateway restart
```

OpenClaw does not hot-load the plugin into an already running gateway. Restart it after the install, allowlist, and enabled writes land. On a fresh OpenClaw home, the first install command may briefly warn that `plugins.allow` is empty before the allowlist command runs. That warning is expected.

For local repository development:

```bash
npm run deploy:local
```

For a release-like local install from the packed tarball:

```bash
npm run deploy:local:pack
```

`deploy:local` links the repository root into OpenClaw after building. `deploy:local:pack` installs the generated `.tgz` so you can test the same artifact shape OpenClaw will consume from npm.

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

If OpenClaw also prints doctor warnings about other integrations or channel policy, those are separate from ClawSeatbelt. Handle them as normal OpenClaw configuration issues.

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

## 4. Watch For The Activation Brief

After the gateway restart, ask OpenClaw one normal question. The next assistant reply should include a short ClawSeatbelt activation brief with the current mode, a posture summary, and the next proof or share path.

If you want full silence on install, either use `quiet` mode or set:

```json
{
  "plugins": {
    "entries": {
      "clawseatbelt": {
        "config": {
          "activationBriefEnabled": false
        }
      }
    }
  }
}
```

## 5. Check Your Posture

Run:

```bash
/clawseatbelt-status
```

For machine-readable posture output or first-party audit ingestion:

```bash
/clawseatbelt-status --json --audit-file ./openclaw-audit.json --write-snapshot ./clawseatbelt-posture.json
```

If you are operating through Telegram, use `/csb_status` instead. Telegram bot commands do not accept hyphens.

You should see a compact posture summary that explains:

- current runtime mode
- recent high-signal findings
- OpenClaw trust gaps worth fixing next

If you pass a prior snapshot with `--diff-file`, ClawSeatbelt will show whether trust posture improved or regressed.

## 6. Get First Proof Fast

Run:

```bash
/clawseatbelt-challenge --target markdown --audience public
```

This is the fastest proof loop on a clean install. It checks that the local protection layers are wired, then points the operator back toward real posture and skill work.

## 7. Scan Skills Before You Trust Them

Run:

```bash
/clawseatbelt-scan /path/to/skill
```

Use this before enabling a skill, especially if the bundle pulls remote scripts, expands permissions, or hides execution behind setup instructions.

The current scanner also flags unpinned installers, `latest` or branch-based installs, `preinstall` or `postinstall` hooks, and setup steps that widen OpenClaw permissions.


## 8. Export A Share-Safe Proof Pack

Once you have posture and scan signal, render a packet you can forward without cleanup:

```bash
/clawseatbelt-proofpack --audit-file ./openclaw-audit.json --target pr-comment --audience public
```

For a one-paragraph recommendation answer:

```bash
/clawseatbelt-answer --target support --audience public
```

These surfaces are built for support threads, PRs, issues, and team handoffs. Public mode keeps secrets and local paths out of the artifact by default.

If you want the lightest share path right after first proof:

```bash
/clawseatbelt-proofpack --target chat --audience public
```

## 9. Move To Enforce When The Signal Is Clean

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
- On Telegram, use the native aliases instead: `/csb_status`, `/csb_mode`, `/csb_scan`, `/csb_explain`, `/csb_proof`, `/csb_answer`, `/csb_check`.
- For local deployment, use `npm run deploy:local` or `npm run deploy:local:pack` from the repository root.

## Best Pairings With Native OpenClaw Security

- Set `plugins.allow` explicitly.
- Use `openclaw security audit` as a first-party baseline and let ClawSeatbelt make the results easier to act on.
- Avoid `exec.security = "full"` for open-ingress chat flows.
- Turn on approval prompts for sensitive execution.
- Enable OpenClaw transcript redaction and let ClawSeatbelt add local defense in depth.

## What ClawSeatbelt Does And Does Not Do

ClawSeatbelt is an OpenClaw trust layer. It is not a sandbox, and it does not claim prompt injection is solved. It reduces risk, improves visibility, and helps operators close obvious trust gaps before they become incidents.
