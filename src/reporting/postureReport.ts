import { maxSeverity } from "../core/severity.js";
import type { Finding, PostureInput, PostureSummary } from "../types/domain.js";

function unique(values: string[]): string[] {
  return [...new Set(values)];
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

export function buildPostureSummary(input: PostureInput): PostureSummary {
  const findings: Finding[] = [
    ...(input.inbound?.findings ?? []),
    ...(input.redaction?.findings ?? []),
    ...(input.skillScan?.findings ?? []),
    ...(input.configurationFindings ?? [])
  ];

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.score, 0));
  const severity = findings.length > 0 ? maxSeverity(findings.map((finding) => finding.severity)) : "low";
  const remediationSteps = unique(findings.map((finding) => finding.remediation.action ?? finding.remediation.summary));
  const headline = summarizeHeadline(score);

  const shareMessage =
    `${headline}. Score ${score}/100. ` +
    `${findings.length} finding(s). ` +
    (remediationSteps[0] ? `First action: ${remediationSteps[0]}.` : "No immediate action required.");

  return {
    headline,
    score,
    severity,
    findings,
    remediationSteps,
    shareMessage
  };
}
