import { severityFromScore } from "./severity.js";
import type { Finding } from "../types/domain.js";
import type { OpenClawConfigLike } from "../types/openclaw.js";

function readPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, source);
}

function buildConfigFinding(input: Omit<Finding, "severity">): Finding {
  return {
    ...input,
    severity: severityFromScore(input.score)
  };
}

export function assessOpenClawConfiguration(config: OpenClawConfigLike): Finding[] {
  const findings: Finding[] = [];

  const pluginsAllow = readPath(config, "plugins.allow");
  if (!Array.isArray(pluginsAllow) || pluginsAllow.length === 0) {
    findings.push(
      buildConfigFinding({
        id: "cfg-plugin-allowlist",
        title: "Plugin allowlist is not pinned",
        category: "configuration",
        score: 24,
        evidence: ["plugins.allow is missing or empty"],
        rationale: "OpenClaw warns that unallowlisted extensions increase trust ambiguity.",
        remediation: {
          summary: "Set plugins.allow to the exact trusted plugin IDs.",
          action: "Add clawshield-local and other approved plugin IDs under plugins.allow."
        }
      })
    );
  } else if (!pluginsAllow.includes("clawshield-local")) {
    findings.push(
      buildConfigFinding({
        id: "cfg-plugin-not-allowlisted",
        title: "ClawShield is not included in the plugin allowlist",
        category: "configuration",
        score: 26,
        evidence: [JSON.stringify(pluginsAllow)],
        rationale: "An explicit allowlist that omits ClawShield undermines predictable loading and trust posture.",
        remediation: {
          summary: "Add ClawShield to the trusted plugin inventory.",
          action: 'Include "clawshield-local" in plugins.allow.'
        }
      })
    );
  }

  const execSecurity = readPath(config, "exec.security");
  if (execSecurity === "full") {
    findings.push(
      buildConfigFinding({
        id: "cfg-exec-full",
        title: "Host execution is configured for full access",
        category: "configuration",
        score: 30,
        evidence: ['exec.security = "full"'],
        rationale: "Full exec access raises the blast radius of prompt injection and malicious skills.",
        remediation: {
          summary: "Reduce host execution exposure for untrusted flows.",
          action: "Prefer allowlist or deny for exec.security and use approvals for escalation."
        }
      })
    );
  }

  const execAsk = readPath(config, "exec.ask");
  if (execAsk === "off") {
    findings.push(
      buildConfigFinding({
        id: "cfg-exec-ask-off",
        title: "Execution approvals are disabled",
        category: "configuration",
        score: 18,
        evidence: ['exec.ask = "off"'],
        rationale: "Approval prompts provide a useful final barrier for sensitive actions.",
        remediation: {
          summary: "Turn approval prompts back on for risky command execution.",
          action: "Use exec.ask = on-miss or always for higher-risk agent profiles."
        }
      })
    );
  }

  const redactSensitive = readPath(config, "logging.redactSensitive");
  if (redactSensitive !== "tools") {
    findings.push(
      buildConfigFinding({
        id: "cfg-redact-sensitive",
        title: "Sensitive tool output redaction is not fully enabled",
        category: "configuration",
        score: 16,
        evidence: [`logging.redactSensitive = ${JSON.stringify(redactSensitive)}`],
        rationale: "Persisted tool output often contains the exact material operators later regret storing.",
        remediation: {
          summary: "Enable sensitive tool-output redaction in OpenClaw itself.",
          action: 'Set logging.redactSensitive to "tools" for defense in depth.'
        }
      })
    );
  }

  const toolsProfile = readPath(config, "tools.profile");
  const toolsAllow = readPath(config, "tools.allow");
  const toolsDeny = readPath(config, "tools.deny");
  const hasExplicitToolControls =
    (Array.isArray(toolsAllow) && toolsAllow.length > 0) ||
    (Array.isArray(toolsDeny) && toolsDeny.length > 0);

  if ((typeof toolsProfile !== "string" || toolsProfile.length === 0) && !hasExplicitToolControls) {
    findings.push(
      buildConfigFinding({
        id: "cfg-tools-profile",
        title: "Tool access profile is not explicitly set",
        category: "configuration",
        score: 12,
        evidence: ["tools.profile is unset"],
        rationale: "Explicit tool profiles reduce surprises during upgrades and environment changes.",
        remediation: {
          summary: "Pin a deliberate tool profile instead of relying on implicit behavior."
        }
      })
    );
  }

  return findings;
}
