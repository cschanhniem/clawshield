# Competitor Artifact Benchmark

## Method

This benchmark was run locally on 2026-03-12 using live npm artifacts:

- `npm pack @openguardrails/moltguard`
- `npm pack @adversa/secureclaw`
- `npm pack @policyshield/openclaw-plugin`
- `npm pack --pack-destination .tmp/pack` for ClawShield

Each package was unpacked and inspected for:

- package footprint
- OpenClaw packaging contract
- dependency count
- control-plane requirements
- operational surface described in bundled README files

This is an artifact and integration benchmark, not a runtime efficacy shootout. It is strong enough to guide positioning and packaging decisions. It is not enough to justify performance or detection-rate marketing claims.

## Snapshot

| Package | Version | Package Footprint | Package Surface | External Requirement | Verified Notes |
|---|---:|---:|---|---|---|
| ClawShield Local | 0.1.0 | ~2.1 KB tarball, ~148 KB built `dist/` | local plugin core | none | `openclaw.extensions` points to `dist/openclaw.js`; no runtime deps |
| MoltGuard | 6.8.21 | 7.1 MB | plugin + gateway + dashboard + scripts | OpenGuardrails Core account/quota | README states auto-registration with Core and 500 free checks/day |
| SecureClaw | 2.2.0 | 472 KB | plugin + skill + shell scripts + IOC/templates | none for baseline | README advertises audits, hardening, background monitors, and script-heavy skill deployment |
| PolicyShield | 0.14.0 | 24 KB | thin plugin client | PolicyShield server | README defaults to `http://localhost:8100`, YAML rules, fail-open option |

## What The Artifact Review Tells Us

### ClawShield’s Advantage

ClawShield can credibly own the smallest trustworthy baseline:

- tiny package
- no server dependency
- no account
- no bundled dashboard
- no skill-installer sprawl

That is a meaningful differentiator in a category where trust is the product.

### MoltGuard

Verified from bundled artifact and README:

- peer dependency on `openclaw`
- ships a large package with dashboard and gateway assets
- explicitly references Core, quota, API keys, claim flow, and account linking

Positioning implication:

Compete on privacy, simplicity, and zero-account baseline. Do not try to out-market its hosted detection story.

### SecureClaw

Verified from bundled artifact and README:

- peer dependency `openclaw ^2026.2.3-1`
- includes a hybrid plugin-plus-skill architecture
- ships scripts, IOC databases, templates, and hardening flows

Positioning implication:

SecureClaw is broad and operationally ambitious. ClawShield should stay narrower and cleaner: default trust posture, not a sprawling incident-response suite.

### PolicyShield

Verified from bundled artifact and README:

- very small plugin
- plugin acts as a client to a separate PolicyShield server
- fail-open and approval timeout behavior are server-linked concerns

Positioning implication:

ClawShield should remain a strong local default and later export policies or findings into server-backed systems when teams need them.

## Strategic Conclusion

The artifact benchmark supports the thesis from the research corpus:

- the category is crowded
- most competitors bring either hosted dependencies, server dependencies, or broad operational surface area
- the strongest defensible space is still local-first baseline trust infrastructure with excellent operator UX

## Next Benchmark

Run scenario-based runtime tests in a disposable OpenClaw instance against:

- prompt injection sample set
- dangerous tool-call prompts
- secret-like tool outputs
- malicious skill bundles

That benchmark should be used for product tuning, not marketing copy, until the methodology is stable.
