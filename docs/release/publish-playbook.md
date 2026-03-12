# Publish Playbook

## Before You Publish

1. Make sure you own the npm scope for `@clawshield`.
2. Configure npm authentication locally or set `NPM_TOKEN` in GitHub Actions secrets.
3. Confirm the version in `package.json`, `openclaw.plugin.json`, and `CHANGELOG.md` all agree.
4. Confirm the package still targets the current OpenClaw release line.

## Manual Publish

```bash
npm install
npm test
npm pack --json --pack-destination .tmp/pack
npm publish --access public
```

## Recommended Post-Publish Checks

```bash
npm view @clawshield/local version
npm view @clawshield/local dist-tags --json
```

Then verify install in a disposable OpenClaw instance:

```bash
openclaw plugins install @clawshield/local@0.1.0
```

## Automated Publish

This repo includes a release workflow that publishes on tags matching `v*`.

Required GitHub repository secret:

- `NPM_TOKEN`

Recommended flow:

1. Merge the release commit to `main`.
2. Create and push a tag like `v0.1.0`.
3. Let GitHub Actions run CI, then publish to npm.

## If The Publish Fails

### Scope is not owned

Change the package name to a scope you control, then repeat the release check.

### Package name already exists

Pick a new name before publishing. Do not force a confusing collision.

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
