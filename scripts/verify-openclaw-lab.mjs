import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  cleanupLabHome,
  createLabHome,
  parseJson,
  readOpenClawConfig,
  readOpenClawVersion,
  run,
  workspaceRoot
} from "./lib/openclaw-lab.mjs";

const pluginId = "clawseatbelt";
const pluginName = "ClawSeatbelt";
const writeDocs = process.argv.includes("--write-docs");
const keepLab = process.argv.includes("--keep-lab");
const packDir = join(workspaceRoot, ".tmp", "pack");
const outputDir = writeDocs
  ? join(workspaceRoot, "docs", "benchmarks", "artifacts")
  : join(workspaceRoot, ".tmp", "openclaw-lab");
const markdownPath = writeDocs
  ? join(workspaceRoot, "docs", "benchmarks", "openclaw-install-verification.md")
  : join(outputDir, "openclaw-install-verification.md");
const jsonPath = join(outputDir, "openclaw-install-verification.json");

function renderMarkdown(report) {
  return [
    "# OpenClaw Install Verification",
    "",
    `Generated at: ${report.generatedAt}`,
    `OpenClaw version: ${report.openclawVersion}`,
    "",
    "## Verdict",
    "",
    `- Package artifact: ${report.packageCheck.passed ? "pass" : "fail"}`,
    `- Install path: ${report.installCheck.passed ? "pass" : "fail"}`,
    `- Dangerous pattern warning during install: ${report.installCheck.dangerousPatternWarning ? "present" : "none"}`,
    `- Allowlist pinned in disposable lab: ${report.installCheck.allowlistPinned ? "yes" : "no"}`,
    "",
    "## Package Surface",
    "",
    `- Tarball: \`${report.packageCheck.filename}\``,
    `- Packed size: ${report.packageCheck.size} bytes`,
    `- Unpacked size: ${report.packageCheck.unpackedSize} bytes`,
    `- Benchmark files shipped: ${report.packageCheck.includesBenchmarkFiles ? "yes" : "no"}`,
    "",
    "## Loaded Plugin Surface",
    "",
    `- Status: ${report.plugin.status}`,
    `- Origin: ${report.plugin.origin}`,
    `- Commands: ${report.plugin.commands.join(", ")}`,
    `- Services: ${report.plugin.services.join(", ")}`,
    `- Hook count: ${report.plugin.hookCount}`,
    `- Config schema present: ${report.plugin.configSchema ? "yes" : "no"}`,
    "",
    "## Install Notes",
    "",
    ...report.installCheck.notes.map((note) => `- ${note}`),
    "",
    "## Caveats",
    "",
    "- This verifies packaging, install, discovery, config pinning, and plugin registration in a disposable OpenClaw home.",
    "- This does not yet prove side-by-side superiority against live competitor plugins inside the same agent run loop.",
    ""
  ].join("\n");
}

const openclawVersion = readOpenClawVersion();
mkdirSync(packDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const packResult = run("npm", ["pack", "--json", "--pack-destination", packDir]);
if (!packResult.ok) {
  throw new Error(`npm pack failed: ${packResult.stderr || packResult.message}`);
}

const packReport = parseJson(packResult.stdout, "npm pack --json");
const tarball = packReport[0];
const tarballPath = join(packDir, tarball.filename);
const labHome = createLabHome("clawseatbelt-openclaw-home-");
const openclawEnv = { OPENCLAW_HOME: labHome };

const installResult = run("npx", ["openclaw", "plugins", "install", tarballPath], openclawEnv);
if (!installResult.ok) {
  if (!keepLab) {
    cleanupLabHome(labHome);
  }
  throw new Error(`OpenClaw plugin install failed: ${installResult.stderr || installResult.message}`);
}

const allowlistResult = run(
  "npx",
  ["openclaw", "config", "set", "--strict-json", "plugins.allow", `["${pluginId}"]`],
  openclawEnv
);
if (!allowlistResult.ok) {
  if (!keepLab) {
    cleanupLabHome(labHome);
  }
  throw new Error(`Failed to pin plugins.allow in disposable lab: ${allowlistResult.stderr || allowlistResult.message}`);
}

const infoResult = run("npx", ["openclaw", "plugins", "info", pluginId, "--json"], openclawEnv);
if (!infoResult.ok) {
  if (!keepLab) {
    cleanupLabHome(labHome);
  }
  throw new Error(`Failed to read plugin info: ${infoResult.stderr || infoResult.message}`);
}

const config = readOpenClawConfig(labHome);
const info = parseJson(infoResult.stdout, "openclaw plugins info --json");
const installOutput = `${installResult.stdout}\n${installResult.stderr}`;
const installNotes = [];

if (/plugins\.allow is empty/i.test(installOutput)) {
  installNotes.push("A blank OpenClaw home warns until plugins.allow is pinned. The verifier applies the allowlist immediately after install.");
}
if (/loaded without install\/load-path provenance/i.test(installOutput)) {
  installNotes.push("Archive installs in a disposable lab still show local-code provenance warnings before trust is pinned. This is expected for local verification.");
}
if (installNotes.length === 0) {
  installNotes.push("Install completed without additional plugin loader warnings.");
}

const report = {
  generatedAt: new Date().toISOString(),
  openclawVersion,
  packageCheck: {
    passed: !tarball.files.some((file) => String(file.path).startsWith("dist/benchmark/")),
    filename: tarball.filename,
    size: statSync(tarballPath).size,
    unpackedSize: tarball.unpackedSize,
    includesBenchmarkFiles: tarball.files.some((file) => String(file.path).startsWith("dist/benchmark/"))
  },
  installCheck: {
    passed:
      !/dangerous code patterns/i.test(installOutput) &&
      Array.isArray(info.commands) &&
      info.commands.length === 7 &&
      info.hookCount === 5 &&
      config.plugins?.entries?.[pluginId]?.enabled === true &&
      Array.isArray(config.plugins?.allow) &&
      config.plugins.allow.includes(pluginId),
    dangerousPatternWarning: /dangerous code patterns/i.test(installOutput),
    allowlistPinned: Array.isArray(config.plugins?.allow) && config.plugins.allow.includes(pluginId),
    installRecordPresent: Boolean(config.plugins?.installs?.[pluginId]),
    notes: installNotes
  },
  plugin: {
    id: info.id,
    name: info.name,
    status: info.status,
    origin: info.origin,
    commands: info.commands,
    services: info.services,
    hookCount: info.hookCount,
    configSchema: info.configSchema
  },
  lab: {
    homeRemoved: !keepLab,
    homePath: keepLab ? labHome : undefined
  }
};

writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
writeFileSync(markdownPath, `${renderMarkdown(report)}\n`, "utf8");

if (!keepLab) {
  cleanupLabHome(labHome);
}

console.log(
  `Verified ${pluginName} in a disposable OpenClaw home. ` +
    `Package warning-free: ${report.installCheck.dangerousPatternWarning ? "no" : "yes"}. ` +
    `Allowlist pinned: ${report.installCheck.allowlistPinned ? "yes" : "no"}.`
);
console.log(`JSON report: ${jsonPath}`);
console.log(`Markdown report: ${markdownPath}`);
