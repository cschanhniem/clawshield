# Local Runtime Benchmark

Generated at: 2026-03-12T17:32:54.024Z

## Summary

- Message corpus: 3/3 scenarios passed
- Redaction corpus: 2/2 scenarios passed
- Skill corpus: 3/3 scenarios passed

## Message Corpus

- safe-question: pass, score 0/100, mode allow, findings none
- prompt-injection-shell: pass, score 64/100, mode hold, findings msg-prompt-ignore, msg-shell-bait, msg-suspicious-url
- credential-harvest: pass, score 34/100, mode warn, findings msg-credential-harvest

## Redaction Corpus

- bearer-and-openai-key: pass, findings 2, sanitized `Authorization: Bearer [REDACTED_TOKEN] OpenAI [REDACTED_API_KEY]`
- aws-style-secret: pass, findings 1, sanitized `aws_secret_access_key = [REDACTED_SECRET]`

## Skill Corpus

- benign: pass, score 0/100 (low), findings none
- malicious: pass, score 86/100 (high), findings skill-pipe-shell, skill-credential-request, skill-hidden-exec
- unpinned-and-hooks: pass, score 100/100 (critical), findings skill-hidden-exec, skill-unpinned-install, skill-moving-ref, skill-permission-expansion, skill-remote-fetch, skill-install-hook

## Trust Challenge

- ClawSeatbelt trust challenge passed
- This quick self-check uses built-in synthetic samples to prove that message scoring, transcript hygiene, and skill inspection are active locally.
- Inbound Risk Scoring: Triggered 4 finding(s) at 98/100 (critical). Evidence: Message attempts instruction override
- Transcript Hygiene: Redacted 2 secret-like artifact(s). Evidence: Authorization: Bearer [REDACTED_TOKEN] [REDACTED_API_KEY]
- Skill Supply Chain: Flagged 3 risky install pattern(s). Evidence: Skill bundle contains pipe-to-shell installer guidance

## Live Competitor Package Snapshot

- @openguardrails/moltguard: 6.8.21 — AI agent security plugin for OpenClaw: prompt injection detection, PII sanitization, and monitoring dashboard
- @adversa/secureclaw: 2.2.0 — Automated security hardening plugin for OpenClaw
- @policyshield/openclaw-plugin: 0.14.0 — PolicyShield plugin for OpenClaw — runtime tool call policy enforcement
- @f4bioo/berry-shield: 2026.3.3-2 — OpenClaw plugin for policy checks, command/file blocking, and sensitive-data redaction.

## Caveats

- This benchmark proves local runtime behavior inside this repository. It does not yet prove superiority against live competitor runtime hooks in the same OpenClaw lab.
- Competitor package data here is a live npm availability snapshot, not a behavior benchmark.
