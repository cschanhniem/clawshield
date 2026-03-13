#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const pluginId = "clawseatbelt";
const packageJsonPath = path.join(repoRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const mode = process.argv.includes("--pack") ? "pack" : "link";
const openClawHome = process.env.OPENCLAW_HOME ?? "(default)";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
    stdio: options.capture ? ["inherit", "pipe", "pipe"] : "inherit"
  });

  if (result.status !== 0) {
    if (options.capture) {
      if (result.stdout) {
        process.stdout.write(result.stdout);
      }
      if (result.stderr) {
        process.stderr.write(result.stderr);
      }
    }
    process.exit(result.status ?? 1);
  }

  return options.capture ? result.stdout.trim() : "";
}

function getAllowlist() {
  const result = spawnSync(
    "npx",
    ["openclaw", "config", "get", "plugins.allow", "--json"],
    {
      cwd: repoRoot,
      env: process.env,
      encoding: "utf8"
    }
  );

  if (result.status !== 0) {
    return [];
  }

  const text = result.stdout.trim();
  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function installFromTarball() {
  const packDir = path.join(repoRoot, ".tmp", "pack");
  fs.mkdirSync(packDir, { recursive: true });
  const output = run("npm", ["pack", "--json", "--pack-destination", packDir], {
    capture: true
  });
  const files = JSON.parse(output);
  const filename = files?.[0]?.filename;

  if (!filename) {
    throw new Error("npm pack did not return a tarball filename");
  }

  const tarballPath = path.join(packDir, filename);
  run("npx", ["openclaw", "plugins", "install", tarballPath]);
  return tarballPath;
}

function installLinkedRepo() {
  run("npm", ["run", "build"]);
  run("npx", ["openclaw", "plugins", "install", "--link", "."]);
  return repoRoot;
}

function ensureAllowlist() {
  const allowlist = getAllowlist();
  if (!allowlist.includes(pluginId)) {
    allowlist.push(pluginId);
  }

  run("npx", [
    "openclaw",
    "config",
    "set",
    "--strict-json",
    "plugins.allow",
    JSON.stringify(allowlist)
  ]);
}

function enablePlugin() {
  run("npx", [
    "openclaw",
    "config",
    "set",
    "--strict-json",
    `plugins.entries.${pluginId}.enabled`,
    "true"
  ]);
}

function describeInstalledPlugin() {
  const output = run("npx", ["openclaw", "plugins", "list", "--json"], {
    capture: true
  });
  const parsed = JSON.parse(output);
  const plugin = parsed.plugins.find((entry) => entry.id === pluginId);

  if (!plugin) {
    throw new Error(`Plugin ${pluginId} did not appear in openclaw plugins list`);
  }

  return plugin;
}

let sourcePath;
if (mode === "pack") {
  sourcePath = installFromTarball();
} else {
  sourcePath = installLinkedRepo();
}

ensureAllowlist();
enablePlugin();

const plugin = describeInstalledPlugin();

console.log("");
console.log(`ClawSeatbelt local deploy complete.`);
console.log(`Mode: ${mode}`);
console.log(`OPENCLAW_HOME: ${openClawHome}`);
console.log(`Install source: ${sourcePath}`);
console.log(`Loaded source: ${plugin.source}`);
console.log(`Commands: ${plugin.commands.length}`);
console.log(`Hooks: ${plugin.hookCount}`);
console.log(`Services: ${plugin.services.length}`);
console.log("");
console.log(`Next step: restart the OpenClaw gateway if it is already running.`);
console.log(`Then run /clawseatbelt-status inside OpenClaw.`);
console.log("");
console.log(
  `Note: local shell publishing with npm provenance will fail with provider null. Use this local deploy flow for development, or publish from GitHub Actions trusted publishing for registry release.`
);
