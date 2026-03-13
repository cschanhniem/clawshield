import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const scriptDir = dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = resolve(scriptDir, "..", "..");

export function run(command, args, env = {}, options = {}) {
  try {
    const stdout = execFileSync(command, args, {
      cwd: options.cwd ?? workspaceRoot,
      env: { ...process.env, ...env },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, stdout, stderr: "" };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout?.toString() ?? "",
      stderr: error.stderr?.toString() ?? "",
      status: error.status ?? 1,
      message: error.message
    };
  }
}

export function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse ${label}: ${error instanceof Error ? error.message : "unknown parse failure"}`);
  }
}

function findBalancedJsonEnd(text, startIndex) {
  const opening = text[startIndex];
  const expected = opening === "{" ? "}" : opening === "[" ? "]" : undefined;
  if (!expected) {
    return undefined;
  }

  const stack = [expected];
  let inString = false;
  let escaped = false;

  for (let index = startIndex + 1; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      stack.push("}");
      continue;
    }

    if (char === "[") {
      stack.push("]");
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack.at(-1) !== char) {
        return undefined;
      }

      stack.pop();
      if (stack.length === 0) {
        return index + 1;
      }
    }
  }

  return undefined;
}

export function extractJsonPayloadFromMixedOutput(text, label = "mixed output") {
  const candidates = [];

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char !== "{" && char !== "[") {
      continue;
    }

    const endIndex = findBalancedJsonEnd(text, index);
    if (!endIndex) {
      continue;
    }

    const slice = text.slice(index, endIndex);
    try {
      candidates.push({
        parsed: JSON.parse(slice),
        length: slice.length
      });
    } catch {
      continue;
    }
  }

  if (candidates.length === 0) {
    throw new Error(`No JSON payload found in ${label}.`);
  }

  candidates.sort((left, right) => right.length - left.length);
  return candidates[0].parsed;
}

export function readOpenClawVersion() {
  const raw = readFileSync(join(workspaceRoot, "node_modules", "openclaw", "package.json"), "utf8");
  return parseJson(raw, "node_modules/openclaw/package.json").version;
}

export function createLabHome(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

export function cleanupLabHome(homePath, keepLab = false) {
  if (!keepLab) {
    rmSync(homePath, { recursive: true, force: true });
  }
}

export function readOpenClawConfig(homePath) {
  const path = join(homePath, ".openclaw", "openclaw.json");
  return parseJson(readFileSync(path, "utf8"), path);
}

export function firstInstalledPluginId(config) {
  const installs = Object.keys(config.plugins?.installs ?? {});
  if (installs.length === 0) {
    throw new Error("No plugin install record found in disposable OpenClaw config.");
  }
  return installs[0];
}

export function detectExternalDependencySignals(installOutput, info) {
  const combined = `${installOutput}\n${JSON.stringify(info)}`.toLowerCase();
  const signals = {
    dangerousPatterns: /dangerous code patterns/.test(combined),
    cloudService: /(auto-register|registered \(autonomous mode|quota|core api|core url|dashboard url|api key)/.test(combined),
    serverDependency: /(server url|localhost:8100|server unreachable|degraded mode|fail_open|approval timeout|policyshield server)/.test(
      combined
    ),
    manifestIdMismatch: /plugin id mismatch/.test(combined),
    installsDependencies: /installing plugin dependencies/.test(combined),
    provenanceWarning: /loaded without install\/load-path provenance/.test(combined),
    allowlistWarning: /plugins\.allow is empty/.test(combined)
  };

  const notes = [];
  if (signals.dangerousPatterns) {
    notes.push("OpenClaw installer flagged dangerous code patterns in the shipped plugin artifact.");
  }
  if (signals.cloudService) {
    notes.push("Package shows hosted-service or account-linked behavior in default install signals.");
  }
  if (signals.serverDependency) {
    notes.push("Package expects a reachable policy or control-plane server for full behavior.");
  }
  if (signals.manifestIdMismatch) {
    notes.push("Install surfaced a plugin id mismatch warning between npm package name and manifest id.");
  }
  if (signals.allowlistWarning) {
    notes.push("A blank OpenClaw home warns until plugins.allow is pinned.");
  }
  if (signals.provenanceWarning) {
    notes.push("OpenClaw still warns about local-code provenance before trust is pinned in the lab.");
  }

  return {
    ...signals,
    localFirstBaseline: !signals.cloudService && !signals.serverDependency,
    notes
  };
}
