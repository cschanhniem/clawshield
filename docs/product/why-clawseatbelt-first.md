# Why ClawSeatbelt First

If you only install one OpenClaw trust plugin first, ClawSeatbelt should be the one.

That claim only matters if it survives comparison with the real alternatives and with OpenClaw's built-in controls.

## The Short Answer

Choose ClawSeatbelt first when you want:

- a local-first trust baseline
- no account requirement
- a readable posture report within minutes
- transcript hygiene and tool guardrails in the same plugin
- skill supply-chain inspection before trust expands
- proof artifacts you can forward without cleanup

## Why It Wins The First-Install Decision

### 1. It Pays Back Immediately

You can install ClawSeatbelt, run `/clawseatbelt-status`, and get a readable trust story without standing up a server, creating an account, or wiring a control plane.

If you want first proof on a clean machine, run:

```bash
/clawseatbelt-challenge --target markdown --audience public
```

That gives you a safe synthetic check that the local defenses are wired.

### 2. It Covers The Whole Trust Expansion Path

Many tools focus on one layer. ClawSeatbelt covers the path that operators actually worry about:

- risky inbound content
- dangerous tool execution in risky sessions
- transcript hygiene
- OpenClaw posture gaps
- skill supply-chain risk before enablement

That breadth matters because OpenClaw incidents rarely stay in one neat phase.

### 3. It Composes With OpenClaw Instead Of Competing With It

ClawSeatbelt does not try to replace first-party controls. It works with:

- `openclaw security audit`
- tool policy
- exec approvals
- pairing and allowlists
- plugin allowlists

That makes the product easier to trust and easier to keep.

### 4. It Produces Better Evidence

The fastest route to adoption is not a dashboard. It is a useful artifact.

ClawSeatbelt now ships:

- `/clawseatbelt-proofpack`
- `/clawseatbelt-answer`
- `/clawseatbelt-challenge`

Those surfaces make it easier to justify a recommendation in a PR, issue, support thread, or team handoff.

### 5. It Stays Local By Default

Hosted detection can be useful. It can also add account friction, quota friction, and trust-boundary expansion.

ClawSeatbelt keeps the baseline local and complete. Optional interop can come later. The first install should not depend on it.

### 6. The Live Install Lab Now Backs The Claim

The repository now includes a live competitor lab that installs current npm artifacts into disposable OpenClaw homes and inspects what the real loader sees.

That lab currently shows:

- ClawSeatbelt leads the clean local-first install story
- MoltGuard brings hosted-service and quota signals
- PolicyShield stays tiny but depends on a reachable server
- SecureClaw and Berry Shield trip the OpenClaw installer's dangerous-pattern scanner on their packaged artifacts

ClawSeatbelt is also live on npm, so the first-install path is no longer hypothetical:

```bash
openclaw plugins install clawseatbelt@0.1.3
openclaw config set --strict-json plugins.allow '["clawseatbelt"]'
openclaw config set --strict-json plugins.entries.clawseatbelt.enabled true
openclaw gateway restart
```

## Where It Still Needs More Proof

ClawSeatbelt is stronger after the current proof-surface and scanner upgrades, but there are still honest gaps:

- no shared-corpus runtime efficacy shootout from the same OpenClaw lab yet
- no public artifact gallery yet
- no mature screenshot or terminal-capture set on the public listing yet
- no shared benchmark page that compares live runtime outcomes across all top competitors yet

So the truthful claim today is:

> ClawSeatbelt is the strongest local-first OpenClaw trust baseline in the current live install lab, with a live npm package and a clean first-proof loop. It still needs the shared-corpus runtime benchmark and stronger public evidence surfaces to be fully proven number one overall.

## What To Run

For a real first pass:

```bash
/clawseatbelt-status
/clawseatbelt-scan /path/to/skill
/clawseatbelt-proofpack --target pr-comment --audience public
/clawseatbelt-answer --target support --audience public
```

For a clean-install proof check:

```bash
/clawseatbelt-challenge --target markdown --audience public
```
