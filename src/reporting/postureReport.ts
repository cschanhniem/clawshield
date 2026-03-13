import { maxSeverity, severityFromScore } from "../core/severity.js";
import { renderStatusNextStep } from "./activationBrief.js";
import type {
  Finding,
  PostureDiff,
  PostureFacet,
  PostureFacetStatus,
  PostureInput,
  PostureSnapshot,
  PostureSummary,
  Severity
} from "../types/domain.js";

interface PostureFacetDefinition {
  id: string;
  label: string;
  test: (finding: Finding) => boolean;
  emptySummary: string;
}

const postureFacetDefinitions: PostureFacetDefinition[] = [
  {
    id: "message-ingress",
    label: "Message Ingress",
    emptySummary: "No active inbound message risk findings.",
    test: (finding) =>
      ["prompt-injection", "credential-harvest", "suspicious-url", "obfuscation"].includes(finding.category)
  },
  {
    id: "tool-governance",
    label: "Tool Governance",
    emptySummary: "Tool access and execution controls look stable.",
    test: (finding) =>
      finding.category === "shell-execution" ||
      finding.id.startsWith("cfg-exec-") ||
      finding.id.startsWith("cfg-tools-")
  },
  {
    id: "transcript-hygiene",
    label: "Transcript Hygiene",
    emptySummary: "No active transcript hygiene findings.",
    test: (finding) => finding.category === "secret-exposure" || finding.id === "cfg-redact-sensitive"
  },
  {
    id: "skill-supply-chain",
    label: "Skill Supply Chain",
    emptySummary: "No active skill supply-chain findings.",
    test: (finding) => finding.category === "skill-supply-chain"
  },
  {
    id: "plugin-trust",
    label: "Plugin Trust",
    emptySummary: "Plugin allowlist posture looks stable.",
    test: (finding) => finding.id.startsWith("cfg-plugin-")
  },
  {
    id: "pairing-and-ingress",
    label: "Pairing And DM Scope",
    emptySummary: "Pairing and direct-message scope findings are clear.",
    test: (finding) => finding.id.startsWith("cfg-pairing-") || finding.id.startsWith("cfg-session-dm-scope")
  },
  {
    id: "openclaw-audit",
    label: "OpenClaw Security Audit",
    emptySummary: "No imported OpenClaw audit findings are active.",
    test: (finding) => finding.source === "openclaw-security-audit"
  }
];

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function findingFingerprint(finding: Finding): string {
  return `${finding.id}:${finding.source ?? "local"}:${finding.evidence.join("|")}`;
}

function dedupeFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const fingerprint = findingFingerprint(finding);
    if (seen.has(fingerprint)) {
      return false;
    }
    seen.add(fingerprint);
    return true;
  });
}

function summarizeHeadline(score: number): string {
  if (score >= 90) {
    return "Critical trust risk detected";
  }
  if (score >= 65) {
    return "High trust risk detected";
  }
  if (score >= 35) {
    return "Caution advised";
  }
  return "Baseline posture looks stable";
}

function summarizeFacetStatus(score: number): PostureFacetStatus {
  if (score >= 65) {
    return "critical";
  }
  if (score >= 35) {
    return "action";
  }
  if (score > 0) {
    return "watch";
  }
  return "stable";
}

function buildFacetSummary(definition: PostureFacetDefinition, findings: Finding[]): string {
  if (findings.length === 0) {
    return definition.emptySummary;
  }

  const highest = [...findings].sort((left, right) => right.score - left.score)[0];
  return `${findings.length} active finding(s). Highest risk: ${highest?.title ?? "unknown finding"}.`;
}

function buildFacets(findings: Finding[]): PostureFacet[] {
  return postureFacetDefinitions.map((definition) => {
    const facetFindings = findings.filter(definition.test);
    const score = Math.min(100, facetFindings.reduce((total, finding) => total + finding.score, 0));
    const severity = facetFindings.length > 0 ? maxSeverity(facetFindings.map((finding) => finding.severity)) : "low";

    return {
      id: definition.id,
      label: definition.label,
      score,
      severity,
      status: summarizeFacetStatus(score),
      findingIds: facetFindings.map((finding) => finding.id),
      summary: buildFacetSummary(definition, facetFindings)
    };
  });
}

function resolveSources(input: PostureInput, findings: Finding[]): string[] {
  const sources = new Set<string>();
  for (const finding of findings) {
    if (finding.source) {
      sources.add(finding.source);
    }
  }
  if (input.inbound) {
    sources.add("clawseatbelt-inbound-risk");
  }
  if (input.redaction) {
    sources.add("clawseatbelt-redaction");
  }
  if (input.skillScan) {
    sources.add("clawseatbelt-skill-scan");
  }
  if (input.configurationFindings && input.configurationFindings.length > 0) {
    sources.add("clawseatbelt-config-audit");
  }
  if (input.openClawAudit) {
    sources.add("openclaw-security-audit");
  }
  return [...sources];
}

function formatDiffHeadline(diff: PostureDiff | undefined): string | undefined {
  if (!diff) {
    return undefined;
  }
  if (diff.scoreDelta > 0) {
    return `Posture worsened by ${diff.scoreDelta} point(s).`;
  }
  if (diff.scoreDelta < 0) {
    return `Posture improved by ${Math.abs(diff.scoreDelta)} point(s).`;
  }
  return "Posture score is unchanged from the prior snapshot.";
}

function formatFacetLine(facet: PostureFacet): string {
  const prefix =
    facet.status === "critical"
      ? "critical"
      : facet.status === "action"
        ? "action"
        : facet.status === "watch"
          ? "watch"
          : "stable";
  return `${facet.label}: ${prefix} (${facet.score}/100). ${facet.summary}`;
}

export function buildPostureSnapshot(input: PostureInput): PostureSnapshot {
  const findings = dedupeFindings(
    [
      ...(input.inbound?.findings ?? []),
      ...(input.redaction?.findings ?? []),
      ...(input.skillScan?.findings ?? []),
      ...(input.configurationFindings ?? []),
      ...(input.openClawAudit?.findings ?? [])
    ].sort((left, right) => right.score - left.score)
  );

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.score, 0));
  const severity: Severity = findings.length > 0 ? maxSeverity(findings.map((finding) => finding.severity)) : "low";
  const remediationSteps = unique(findings.map((finding) => finding.remediation.action ?? finding.remediation.summary));
  const headline = summarizeHeadline(score);
  const shareMessage =
    `${headline}. Score ${score}/100. ` +
    `${findings.length} finding(s). ` +
    (remediationSteps[0] ? `First action: ${remediationSteps[0]}.` : "No immediate action required.");

  return {
    formatVersion: 1,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    headline,
    score,
    severity,
    findings,
    remediationSteps,
    shareMessage,
    facets: buildFacets(findings),
    sources: resolveSources(input, findings),
    audit: input.openClawAudit?.metadata
  };
}

export function diffPostureSnapshots(previous: PostureSnapshot, current: PostureSnapshot): PostureDiff {
  const previousIds = new Set(previous.findings.map((finding) => finding.id));
  const currentIds = new Set(current.findings.map((finding) => finding.id));

  const introducedFindingIds = [...currentIds].filter((id) => !previousIds.has(id)).sort();
  const resolvedFindingIds = [...previousIds].filter((id) => !currentIds.has(id)).sort();
  const unchangedFindingIds = [...currentIds].filter((id) => previousIds.has(id)).sort();
  const scoreDelta = current.score - previous.score;

  const headline =
    scoreDelta > 0
      ? "Trust posture regressed"
      : scoreDelta < 0
        ? "Trust posture improved"
        : "Trust posture unchanged";

  return {
    headline,
    previousScore: previous.score,
    currentScore: current.score,
    scoreDelta,
    introducedFindingIds,
    resolvedFindingIds,
    unchangedFindingIds
  };
}

export function parsePostureSnapshot(input: unknown): PostureSnapshot {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Posture snapshot must be a JSON object.");
  }

  const candidate = input as Record<string, unknown>;
  if (candidate.formatVersion !== 1) {
    throw new Error("Unsupported posture snapshot format.");
  }
  if (typeof candidate.generatedAt !== "string" || typeof candidate.headline !== "string") {
    throw new Error("Posture snapshot is missing required metadata.");
  }

  const findings = Array.isArray(candidate.findings) ? (candidate.findings as Finding[]) : [];
  const facets = Array.isArray(candidate.facets) ? (candidate.facets as PostureFacet[]) : [];

  return {
    formatVersion: 1,
    generatedAt: candidate.generatedAt,
    headline: candidate.headline,
    score: typeof candidate.score === "number" ? candidate.score : 0,
    severity:
      candidate.severity === "critical" ||
      candidate.severity === "high" ||
      candidate.severity === "medium" ||
      candidate.severity === "low"
        ? candidate.severity
        : severityFromScore(typeof candidate.score === "number" ? candidate.score : 0),
    findings,
    remediationSteps: Array.isArray(candidate.remediationSteps)
      ? candidate.remediationSteps.filter((step): step is string => typeof step === "string")
      : [],
    shareMessage: typeof candidate.shareMessage === "string" ? candidate.shareMessage : "",
    facets,
    sources: Array.isArray(candidate.sources)
      ? candidate.sources.filter((source): source is string => typeof source === "string")
      : [],
    audit:
      typeof candidate.audit === "object" && candidate.audit !== null
        ? (candidate.audit as PostureSnapshot["audit"])
        : undefined
  };
}

export function renderPostureCard(
  snapshot: PostureSnapshot,
  mode: string,
  recentIncidents: string[],
  diff?: PostureDiff
): string {
  const topFacets = snapshot.facets
    .filter((facet) => facet.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(formatFacetLine);

  const sections = [
    `ClawSeatbelt mode: ${mode}. ${snapshot.shareMessage}`,
    topFacets.length > 0 ? `Focus: ${topFacets.join(" ")}` : "Focus: No active posture hotspots.",
    recentIncidents.length > 0 ? `Recent: ${recentIncidents.join("; ")}` : "Recent: No recent high-signal incidents.",
    renderStatusNextStep()
  ];

  const diffHeadline = formatDiffHeadline(diff);
  if (diffHeadline) {
    sections.splice(2, 0, `Diff: ${diffHeadline}`);
  }

  return sections.join(" ");
}

export function buildPostureSummary(
  input: PostureInput,
  options?: {
    previousSnapshot?: PostureSnapshot;
    mode?: string;
    recentIncidents?: string[];
  }
): PostureSummary {
  const snapshot = buildPostureSnapshot(input);
  const diff = options?.previousSnapshot ? diffPostureSnapshots(options.previousSnapshot, snapshot) : undefined;

  return {
    ...snapshot,
    diff,
    card: renderPostureCard(snapshot, options?.mode ?? "observe", options?.recentIncidents ?? [], diff)
  };
}
