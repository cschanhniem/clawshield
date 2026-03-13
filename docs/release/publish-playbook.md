# Publish Playbook

## Before You Publish

1. Confirm `clawseatbelt` is still unpublished or owned by you on npm.
2. Prefer npm trusted publishing for GitHub Actions instead of `NPM_TOKEN`.
3. On npm, configure a trusted publisher for `cschanhniem/ClawSeatbelt` and workflow filename `release.yml`.
4. Confirm the version in `package.json`, `openclaw.plugin.json`, and `CHANGELOG.md` all agree.
5. Confirm the package still targets the current OpenClaw release line.

Why this is the default path:

- npm recommends trusted publishing for CI/CD package publishing.
- It removes long-lived write tokens from GitHub secrets.
- It works with GitHub OIDC and automatic provenance for public packages from public repositories.
- It avoids the `EOTP` failure mode that blocked the token-based publish attempt in this repo.

## Manual Publish

For local OpenClaw deployment, do not publish at all. Use:

```bash
npm run deploy:local
```

or:

```bash
npm run deploy:local:pack
```

If you truly need a local terminal publish to npm instead of GitHub trusted publishing:

```bash
npm install
npm test
npm run pack:artifact
npm publish --provenance=false
```

## Recommended Post-Publish Checks

```bash
npm view clawseatbelt version
npm view clawseatbelt dist-tags --json
```

Then verify install in a disposable OpenClaw instance:

```bash
openclaw plugins install clawseatbelt@0.1.1
```

## Automated Publish

This repo includes a release workflow that publishes on tags matching `v*` and also supports manual `workflow_dispatch` runs from GitHub Actions.

Branch guardrails:

- tag publishes only proceed if the tagged commit is reachable from `main`
- manual publishes only proceed when the workflow is run against `main`

Required GitHub configuration:

- npm trusted publisher bound to `cschanhniem/ClawSeatbelt`
- workflow filename set to `release.yml`
- GitHub-hosted runner
- `id-token: write` permission in the workflow

Recommended flow:

1. Merge the release commit to `main`.
2. Create and push a tag like `v0.1.1`.
3. Let GitHub Actions run CI, then publish to npm.
4. If the publish run fails with `Unable to authenticate`, re-check the npm trusted publisher fields exactly. npm matches repository and workflow filename case-sensitively.

Manual fallback:

1. Open the `Publish` workflow in GitHub Actions.
2. Use `Run workflow` on `main` after fixing the npm trusted publisher configuration.
3. Confirm the package version in `package.json` is still unpublished before running it.

## If The Publish Fails

### Package name already exists

Pick a new name before publishing. Do not force a confusing collision.

### npm publish fails with `Unable to authenticate`

Check the trusted publisher configuration on npm carefully:

- repository owner and name must match exactly
- workflow filename must match exactly, including `.yml`, and should be entered as `release.yml`
- publish must run on a GitHub-hosted runner
- the workflow must keep `id-token: write`

Inference:

If npm does not let you bind trusted publishing before the first package release in your account UI, use a one-time automation token for the first release, then switch immediately to trusted publishing. That fallback depends on npm account UI behavior, which I have not verified directly from this account.

### Tarball misses `dist/openclaw.js`

Run `npm test` or `npm run build` again. `prepack` is configured, so this usually points to a local build problem.

### npm cache permissions break `npm pack`

Use a workspace-local cache instead of touching your global npm cache:

```bash
mkdir -p .tmp/npm-cache
NPM_CONFIG_CACHE=.tmp/npm-cache npm run pack:artifact
```

### OpenClaw install fails after publish

Check:

- `package.json` contains `openclaw.extensions`
- `openclaw.plugin.json` is included in the tarball
- the published package version matches the local pack output
