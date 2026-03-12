# Packaging And Provenance

## Current Package Shape

Artifact verification was run locally on 2026-03-12 using:

- `npm test`
- `npm pack --json --pack-destination .tmp/pack`
- `tar -tf .tmp/pack/clawshield-local-0.1.0.tgz`

- Package: `@clawshield/local@0.1.0`
- Tarball size: about `2.1 KB`
- Built `dist/` footprint in this workspace: about `148 KB`
- Entry path for OpenClaw: `dist/openclaw.js`
- Peer dependency: `openclaw ^2026.3.11`

## Why This Matters

Security plugins live or die on trust. A small, inspectable artifact is not a vanity metric. It is part of the product.

ClawShield should preserve:

- zero runtime dependencies where practical
- local-only hot path behavior
- no hidden postinstall behavior
- a package layout that can be inspected in under a minute

## Release Checklist

1. Run `npm test`.
2. Run `npm pack --json --pack-destination .tmp/pack`.
3. Confirm `package.json` contains `openclaw.extensions`.
4. Confirm the tarball includes `dist/openclaw.js`.
5. Confirm the tarball does not include test fixtures or source-only scratch output.
6. Confirm `openclaw.plugin.json` matches package version and config schema.
7. Publish with an exact version, not a floating range.
8. Document the pinned install command in release notes.

## Provenance Notes

- Prefer reproducible builds from tagged commits.
- Keep dependency count visible in release notes.
- Publish a short changelog that calls out any new hook usage, blocking behavior, or config surface.
