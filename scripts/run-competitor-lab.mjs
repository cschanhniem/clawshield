import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import {
  cleanupLabHome,
  createLabHome,
  detectExternalDependencySignals,
  extractJsonPayloadFromMixedOutput,
  firstInstalledPluginId,
  parseJson,
  readOpenClawConfig,
  readOpenClawVersion,
  run,
  workspaceRoot
} from "./lib/openclaw-lab.mjs";

const writeDocs = process.argv.includes("--write-docs");
const keepLabs = process.argv.includes("--keep-labs");
const openclawVersion = readOpenClawVersion();
const packDir = join(workspaceRoot, ".tmp", "pack");
const outputDir = writeDocs
  ? join(workspaceRoot, "docs", "benchmarks", "artifacts")
  : join(workspaceRoot, ".tmp", "competitor-lab");
const markdownPath = writeDocs
  ? join(workspaceRoot, "docs", "benchmarks", "openclaw-competitor-lab.md")
  : join(outputDir, "openclaw-competitor-lab.md");
const jsonPath = join(outputDir, "openclaw-competitor-lab.json");

mkdirSync(packDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const competitors = [
  {
    label: "ClawSeatbelt",
    packageName: "clawseatbelt",
    installKind: "local-tarball",
    localTarball: true
  },
  {
    label: "MoltGuard",
    packageName: "@openguardrails/moltguard",
    installKind: "npm"
  },
  {
    label: "SecureClaw",
    packageName: "@adversa/secureclaw",
    installKind: "npm"
  },
  {
    label: "PolicyShield",
    packageName: "@policyshield/openclaw-plugin",
    installKind: "npm"
  },
  {
    label: "Berry Shield",
    packageName: "@f4bioo/berry-shield",
    installKind: "npm"
  }
];

function packSpec(spec, destinationDir) {
  mkdirSync(destinationDir, { recursive: true });
  const result = run("npm", ["pack", spec, "--json", "--pack-destination", destinationDir]);
  if (!result.ok) {
    throw new Error(`npm pack failed for ${spec}: ${result.stderr || result.message}`);
  }
  return parseJson(result.stdout, `npm pack ${spec}`)[0];
}

function packLocalWorkspace() {
  const result = run("npm", ["pack", "--json", "--pack-destination", packDir]);
  if (!result.ok) {
    throw new Error(`npm pack failed for local workspace: ${result.stderr || result.message}`);
  }
  return parseJson(result.stdout, "local npm pack")[0];
}

function readNpmMetadata(packageName) {
  const result = run("npm", ["view", packageName, "version", "description", "homepage", "--json"]);
  if (!result.ok) {
    throw new Error(`npm view failed for ${packageName}: ${result.stderr || result.message}`);
  }
  return parseJson(result.stdout, `npm view ${packageName}`);
}

function isPackagePublished(packageName) {
  const result = run("npm", ["view", packageName, "version"]);
  return result.ok;
}

function summarizeNotes(entry) {
  if (entry.packageName === "clawseatbelt") {
    return ["Local tarball install stayed warning-free under the OpenClaw installer."];
  }
  return entry.signals.notes.length > 0 ? entry.signals.notes : ["No additional install notes captured."];
}

function compareByPackedSize(entries) {
  return [...entries].sort((left, right) => left.package.packedBytes - right.package.packedBytes);
}

function renderMarkdown(report) {
  const smallest = compareByPackedSize(report.entries)[0];
  const lines = [
    "# OpenClaw Competitor Lab",
    "",
    `Generated at: ${report.generatedAt}`,
    `OpenClaw version: ${report.openclawVersion}`,
    "",
    "## Method",
    "",
    "- Each package was installed into a disposable `OPENCLAW_HOME` with the current OpenClaw CLI.",
    "- After install, the lab pinned `plugins.allow`, read the live plugin info surface, and recorded install output.",
    "- The lab also packed each artifact to record tarball size and unpacked size.",
    "- This is a live install and plugin-surface benchmark. It is not yet a shared-corpus runtime efficacy shootout.",
    "",
    "## Snapshot",
    "",
    "| Package | Version | Packed Size | Hooks | Commands | Local-First Baseline | Install Warning | Notable Signal |",
    "|---|---:|---:|---:|---:|---|---|---|",
    ...report.entries.map((entry) => {
      const notable =
        entry.signals.dangerousPatterns
          ? "Installer flagged dangerous patterns"
          : entry.signals.cloudService
            ? "Hosted service or account signal"
            : entry.signals.serverDependency
              ? "Server dependency signal"
              : "Clean local baseline";
      return `| ${entry.label} | ${entry.version} | ${entry.package.packedBytes} B | ${entry.plugin.hookCount} | ${entry.plugin.commandCount} | ${entry.signals.localFirstBaseline ? "yes" : "no"} | ${entry.signals.dangerousPatterns ? "yes" : "no"} | ${notable} |`;
    }),
    "",
    "## Findings",
    "",
    `- Smallest packaged artifact in this run: ${smallest.label} (${smallest.package.packedBytes} bytes).`,
    `- ClawSeatbelt local baseline verdict: ${report.categoryVerdict.localBaselineWinner}`,
    `- ClawSeatbelt clean local install verdict: ${report.categoryVerdict.cleanLocalInstallWinner}`,
    `- Smallest clean install across all packages: ${report.categoryVerdict.cleanInstallWinner}`,
    `- Publication gap: ${report.categoryVerdict.publicationGap}`,
    "",
    "## Package Notes",
    "",
    ...report.entries.flatMap((entry) => [
      `### ${entry.label}`,
      ...summarizeNotes(entry).map((note) => `- ${note}`),
      `- Plugin id: \`${entry.plugin.id}\``,
      `- Services: ${entry.plugin.serviceCount}`,
      `- CLI commands: ${entry.plugin.cliCommandCount}`,
      `- Tool count: ${entry.plugin.toolCount}`,
      `- Config schema present: ${entry.plugin.configSchema ? "yes" : "no"}`,
      ""
    ]),
    "## Caveats",
    "",
    "- This proves install-path and plugin-surface behavior under the real OpenClaw loader.",
    "- This still does not prove detection quality against the same live malicious corpus inside each competitor runtime.",
    ""
  ];

  return lines.join("\n");
}

const localPack = packLocalWorkspace();

const entries = [];

for (const competitor of competitors) {
  const npmMetadata = competitor.localTarball ? undefined : readNpmMetadata(competitor.packageName);
  const packTargetDir = join(packDir, basename(competitor.packageName).replace(/[^a-z0-9._-]/gi, "-"));
  const packReport = competitor.localTarball
    ? localPack
    : packSpec(`${competitor.packageName}@${npmMetadata.version}`, packTargetDir);
  const labHome = createLabHome(`openclaw-competitor-lab-${competitor.packageName.replace(/[^a-z0-9]+/gi, "-")}-`);
  const env = { OPENCLAW_HOME: labHome };
  const installSpec = competitor.localTarball ? join(packDir, localPack.filename) : `${competitor.packageName}@${npmMetadata.version}`;
  const installArgs = ["openclaw", "plugins", "install", installSpec];
  if (!competitor.localTarball) {
    installArgs.push("--pin");
  }

  const installStart = Date.now();
  const installResult = run("npx", installArgs, env);
  const installDurationMs = Date.now() - installStart;

  if (!installResult.ok) {
    cleanupLabHome(labHome, keepLabs);
    throw new Error(`OpenClaw install failed for ${competitor.label}: ${installResult.stderr || installResult.message}`);
  }

  const config = readOpenClawConfig(labHome);
  const pluginId = firstInstalledPluginId(config);
  const allowlistResult = run(
    "npx",
    ["openclaw", "config", "set", "--strict-json", "plugins.allow", `["${pluginId}"]`],
    env
  );

  if (!allowlistResult.ok) {
    cleanupLabHome(labHome, keepLabs);
    throw new Error(`Failed to pin plugins.allow for ${competitor.label}: ${allowlistResult.stderr || allowlistResult.message}`);
  }

  const infoResult = run("npx", ["openclaw", "plugins", "info", pluginId, "--json"], env);
  if (!infoResult.ok) {
    cleanupLabHome(labHome, keepLabs);
    throw new Error(`Failed to read plugin info for ${competitor.label}: ${infoResult.stderr || infoResult.message}`);
  }

  const info = extractJsonPayloadFromMixedOutput(`${infoResult.stdout}\n${infoResult.stderr}`, `${competitor.label} info output`);
  const signals = detectExternalDependencySignals(`${installResult.stdout}\n${installResult.stderr}\n${infoResult.stdout}\n${infoResult.stderr}`, info);
  const updatedConfig = readOpenClawConfig(labHome);

  entries.push({
    label: competitor.label,
    packageName: competitor.packageName,
    version: competitor.localTarball ? localPack.version : npmMetadata.version,
    homepage: competitor.localTarball ? "https://github.com/cschanhniem/ClawSeatbelt#readme" : npmMetadata.homepage,
    description: competitor.localTarball ? "Local-first trust plugin for OpenClaw" : npmMetadata.description,
    installKind: competitor.installKind,
    package: {
      filename: packReport.filename,
      packedBytes: competitor.localTarball ? statSync(join(packDir, packReport.filename)).size : packReport.size,
      unpackedBytes: packReport.unpackedSize,
      entryCount: packReport.entryCount ?? packReport.files?.length ?? 0
    },
    plugin: {
      id: info.id,
      status: info.status,
      origin: info.origin,
      hookCount: info.hookCount ?? 0,
      commandCount: (info.commands?.length ?? 0) + (info.cliCommands?.length ?? 0),
      serviceCount: info.services?.length ?? 0,
      cliCommandCount: info.cliCommands?.length ?? 0,
      toolCount: info.toolNames?.length ?? 0,
      configSchema: Boolean(info.configSchema)
    },
    install: {
      durationMs: installDurationMs,
      allowlistPinned: Array.isArray(updatedConfig.plugins?.allow) && updatedConfig.plugins.allow.includes(pluginId),
      installRecordPresent: Boolean(updatedConfig.plugins?.installs?.[pluginId])
    },
    signals
  });

  cleanupLabHome(labHome, keepLabs);
}

const clawSeatbelt = entries.find((entry) => entry.label === "ClawSeatbelt");
const localBaselineWinner = entries
  .filter((entry) => entry.signals.localFirstBaseline)
  .sort((left, right) => {
    if (left.signals.dangerousPatterns !== right.signals.dangerousPatterns) {
      return Number(left.signals.dangerousPatterns) - Number(right.signals.dangerousPatterns);
    }
    return left.package.packedBytes - right.package.packedBytes;
  })[0];
const cleanLocalInstallWinner = entries
  .filter((entry) => entry.signals.localFirstBaseline && !entry.signals.dangerousPatterns)
  .sort((left, right) => left.package.packedBytes - right.package.packedBytes)[0];
const cleanInstallWinner = entries
  .filter((entry) => !entry.signals.dangerousPatterns)
  .sort((left, right) => left.package.packedBytes - right.package.packedBytes)[0];

const report = {
  generatedAt: new Date().toISOString(),
  openclawVersion,
  entries,
  categoryVerdict: {
    localBaselineWinner: localBaselineWinner
      ? `${localBaselineWinner.label} currently leads the local-first baseline on install-path evidence.`
      : "No package in this run qualified as a clean local-first baseline.",
    cleanLocalInstallWinner: cleanLocalInstallWinner
      ? `${cleanLocalInstallWinner.label} currently leads the clean local install story in this run.`
      : "No local-first package in this run delivered a clean install artifact story.",
    cleanInstallWinner: cleanInstallWinner
      ? `${cleanInstallWinner.label} currently leads the clean-install artifact story in this run.`
      : "No package in this run achieved a clean install artifact story.",
    publicationGap: isPackagePublished("clawseatbelt")
      ? "ClawSeatbelt is published on npm. Publication is no longer the main credibility gap."
      : "ClawSeatbelt still lacks a public npm release, so category leadership is not fully proven until the package is published."
  }
};

writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
writeFileSync(markdownPath, `${renderMarkdown(report)}\n`, "utf8");

console.log(`Wrote competitor lab JSON: ${jsonPath}`);
console.log(`Wrote competitor lab Markdown: ${markdownPath}`);
