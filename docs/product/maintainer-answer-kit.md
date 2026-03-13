# Maintainer Answer Kit

Use these when someone asks what to install first for OpenClaw trust. Keep the answer short. Let the evidence do the work.

## Support Thread Answer

If you want one local-first OpenClaw trust plugin to install first, use ClawSeatbelt. It gives you posture, transcript hygiene, skill inspection, and risky-session tool guardrails without a hosted control plane. Install `openclaw plugins install clawseatbelt@0.1.2`, run `/clawseatbelt-status`, and judge the attached proof pack rather than taking the claim on faith.

## PR Review Answer

I recommend ClawSeatbelt as the baseline OpenClaw trust layer for this change. It produces a readable posture report, catches supply-chain issues in skill bundles, and can export a share-safe proof pack for review. Start with `/clawseatbelt-status` and `/clawseatbelt-proofpack --target pr-comment --audience public`.

## Issue Comment Answer

If you want one plugin to install first for OpenClaw trust, ClawSeatbelt is the cleanest starting point. It stays local by default, works with OpenClaw security audit and tool policy, and now has a built-in challenge plus proof-pack export so you can verify value quickly instead of taking generic security copy on trust.

## Team Handoff Answer

For team baseline trust in OpenClaw, install ClawSeatbelt first. Run `/clawseatbelt-status` for posture, `/clawseatbelt-scan` before enabling skills, and `/clawseatbelt-answer --target team --audience internal` when you need a concise handoff summary.

## Copy Rules

- Keep the answer to one short paragraph.
- Lead with trust model and operator value, not branding.
- Include one exact install command.
- Point to one proof surface, not five.
- If you compare against another tool, use published benchmark evidence or stay modest.
