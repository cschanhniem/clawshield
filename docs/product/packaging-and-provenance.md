# Packaging And Provenance

## Why ClawSeatbelt Is Easy To Trust

Security plugins are judged twice. First on what they block. Then on whether people trust the plugin itself.

ClawSeatbelt should keep winning the second test:

- local-only hot path behavior
- no account requirement
- no hidden install scripts
- minimal package surface
- straightforward release verification

## Current Package Shape

Artifact verification was run locally on 2026-03-13 using:

- `npm test`
- `npm run verify:openclaw-lab`
- `npm pack --json --pack-destination .tmp/pack`
- `tar -tf .tmp/pack/clawseatbelt-0.1.0.tgz`

Verified package facts:

- package: `clawseatbelt@0.1.0`
- tarball size: about `31.3 KB`
- built `dist/` footprint in this workspace: about `260 KB`
- unpacked published package footprint: about `127.7 KB`
- OpenClaw entry path: `dist/openclaw.js`
- peer dependency: `openclaw ^2026.3.11`
- install-path verifier: packaged plugin installs into an isolated OpenClaw home without dangerous-pattern warnings
- benchmark harness: intentionally kept out of the published tarball so benchmark-only `child_process` usage does not dilute install trust

## Why This Matters

A small, inspectable artifact is not cosmetic. It is part of the product promise. ClawSeatbelt should remain the OpenClaw security plugin a careful operator can inspect in under a minute.

## Release Checklist

1. Run `npm test`.
2. Run `npm pack --json --pack-destination .tmp/pack`.
3. Confirm `package.json` contains `openclaw.extensions`.
4. Confirm the tarball includes `dist/openclaw.js`.
5. Confirm the tarball does not include fixtures, scratch output, or accidental build noise.
6. Confirm `openclaw.plugin.json` matches the package version and config schema.
7. Publish with an exact version, not a floating range.
8. Document the pinned install command in release notes.
9. Run `npm run verify:openclaw-lab` and confirm the install report stays warning-free on package contents.

## Provenance Notes

- Prefer reproducible builds from tagged commits.
- Prefer npm trusted publishing for GitHub Actions releases. npm automatically generates provenance for public packages from public repositories when trusted publishing is configured.
- Keep the workflow filename stable. npm trusted publisher matching is exact and case-sensitive.
- If trusted publishing is temporarily unavailable for first release setup, use a one-time automation token rather than a standard token that still prompts for OTP.
- Keep dependency count visible in release notes and README copy.
- Call out any new hook usage, blocking behavior, or config surface in every release.
- Make verification easy enough that users actually do it.
