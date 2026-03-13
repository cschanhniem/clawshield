# Publish Playbook

## Before You Publish

1. Confirm `clawseatbelt` is still unpublished or owned by you on npm.
2. Configure npm authentication locally or set `NPM_TOKEN` in GitHub Actions secrets.
3. If you publish through GitHub Actions, make sure `NPM_TOKEN` is an npm automation token or use npm trusted publishing. A standard token on an account with publish-time 2FA will fail with `EOTP`.
4. Confirm the version in `package.json`, `openclaw.plugin.json`, and `CHANGELOG.md` all agree.
5. Confirm the package still targets the current OpenClaw release line.

## Manual Publish

```bash
npm install
npm test
npm pack --json --pack-destination .tmp/pack
npm publish
```

## Recommended Post-Publish Checks

```bash
npm view clawseatbelt version
npm view clawseatbelt dist-tags --json
```

Then verify install in a disposable OpenClaw instance:

```bash
openclaw plugins install clawseatbelt@0.1.0
```

## Automated Publish

This repo includes a release workflow that publishes on tags matching `v*` and also supports manual `workflow_dispatch` runs from GitHub Actions.

Required GitHub repository secret:

- `NPM_TOKEN` as an npm automation token

Recommended flow:

1. Merge the release commit to `main`.
2. Create and push a tag like `v0.1.0`.
3. Let GitHub Actions run CI, then publish to npm.
4. If the publish run fails with `EOTP`, rotate `NPM_TOKEN` to an automation token and rerun the failed workflow.

Manual fallback:

1. Open the `Publish` workflow in GitHub Actions.
2. Use `Run workflow` on `main` after fixing the npm secret.
3. Confirm the package version in `package.json` is still unpublished before running it.

## If The Publish Fails

### Package name already exists

Pick a new name before publishing. Do not force a confusing collision.

### npm publish fails with `EOTP`

The current npm secret is not automation-capable for publish. Replace `NPM_TOKEN` with an npm automation token, or configure npm trusted publishing for this repository, then rerun the failed release workflow.

### Tarball misses `dist/openclaw.js`

Run `npm test` or `npm run build` again. `prepack` is configured, so this usually points to a local build problem.

### npm cache permissions break `npm pack`

Use a workspace-local cache instead of touching your global npm cache:

```bash
mkdir -p .tmp/npm-cache
NPM_CONFIG_CACHE=.tmp/npm-cache npm pack --json --pack-destination .tmp/pack
```

### OpenClaw install fails after publish

Check:

- `package.json` contains `openclaw.extensions`
- `openclaw.plugin.json` is included in the tarball
- the published package version matches the local pack output
