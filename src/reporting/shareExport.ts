import { basename } from "node:path";
import { buildPinnedInstallCommand } from "../core/productMetadata.js";
import { redactToolResult } from "../core/redactionEngine.js";
import type { Finding, PostureDiff, PostureSummary, SkillScanReport } from "../types/domain.js";

export type ShareAudience = "public" | "internal" | "private";
export type ShareTarget = "markdown" | "pr-comment" | "issue-comment" | "chat";

export interface ShareRenderOptions {
  audience: ShareAudience;
  target: ShareTarget;
  maxFindings?: number;
  includeInstallFooter?: boolean;
}

const UNIX_PATH_PATTERN = /\/(?:Users|home|Volumes|private|var|tmp|opt|srv|etc|root)(?:\/[^\s:;),]+)+/g;
const WINDOWS_PATH_PATTERN = /[A-Za-z]:\\(?:[^\\\s:;),]+\\)*[^\\\s:;),]+/g;

function heading(level: number, title: string, target: ShareTarget): string {
  if (target === "chat") {
    return title;
  }
  return `${"#".repeat(level)} ${title}`;
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function redactPathToken(path: string): string {
  const label = basename(path);
  return label ? `[REDACTED_PATH:${label}]` : "[REDACTED_PATH]";
}

export function sanitizeShareText(input: string, audience: ShareAudience): string {
  let sanitized = redactToolResult(input).sanitized;

  if (audience === "public") {
    sanitized = sanitized.replace(UNIX_PATH_PATTERN, (match) => redactPathToken(match));
    sanitized = sanitized.replace(WINDOWS_PATH_PATTERN, (match) => redactPathToken(match));
  }

  return collapseWhitespace(sanitized);
}

function sanitizeFinding(finding: Finding, audience: ShareAudience): Finding {
  return {
    ...finding,
    title: sanitizeShareText(finding.title, audience),
    rationale: sanitizeShareText(finding.rationale, audience),
    evidence: finding.evidence.map((entry) => sanitizeShareText(entry, audience)),
    remediation: {
      summary: sanitizeShareText(finding.remediation.summary, audience),
      action: finding.remediation.action ? sanitizeShareText(finding.remediation.action, audience) : undefined
    },
    metadata: undefined
  };
}

function sanitizeDiffHeadline(diff: PostureDiff | undefined, audience: ShareAudience): string | undefined {
  return diff ? sanitizeShareText(diff.headline, audience) : undefined;
}

function formatFindingLine(finding: Finding): string {
  const evidence = finding.evidence[0] ? ` Evidence: ${finding.evidence[0]}.` : "";
  const action = finding.remediation.action ?? finding.remediation.summary;
  return `[${finding.severity}] ${finding.title}. ${action}.${evidence}`;
}

function formatInstallFooter(includeInstallFooter: boolean | undefined): string | undefined {
  if (includeInstallFooter === false) {
    return undefined;
  }

  return `Install with \`${buildPinnedInstallCommand()}\`.`;
}

function renderChatTrustReceipt(snapshot: PostureSummary, mode: string, options: ShareRenderOptions): string {
  const findings = snapshot.findings.slice(0, options.maxFindings ?? 3).map((finding) => sanitizeFinding(finding, options.audience));
  const nextStep = findings[0]?.remediation.action ?? snapshot.remediationSteps[0] ?? "No immediate action required.";
  const diffHeadline = sanitizeDiffHeadline(snapshot.diff, options.audience);
  const installFooter = formatInstallFooter(options.includeInstallFooter);

  const parts = [
    `ClawSeatbelt trust receipt: ${sanitizeShareText(snapshot.headline, options.audience)}.`,
    `Mode ${mode}.`,
    `Score ${snapshot.score}/100 (${snapshot.severity}).`,
    findings.length > 0 ? `Top finding: ${formatFindingLine(findings[0])}` : "No active high-signal findings.",
    diffHeadline ? `Diff: ${diffHeadline}.` : undefined,
    `Next step: ${sanitizeShareText(nextStep, options.audience)}.`,
    installFooter
  ];

  return parts.filter(Boolean).join(" ");
}

export function renderPostureShare(
  snapshot: PostureSummary,
  mode: string,
  options: ShareRenderOptions
): string {
  if (options.target === "chat") {
    return renderChatTrustReceipt(snapshot, mode, options);
  }

  const findings = snapshot.findings
    .slice(0, options.maxFindings ?? 3)
    .map((finding) => sanitizeFinding(finding, options.audience));
  const facets = snapshot.facets
    .filter((facet) => facet.score > 0)
    .slice(0, 3)
    .map((facet) => `${facet.label}: ${facet.status} (${facet.score}/100). ${sanitizeShareText(facet.summary, options.audience)}`);
  const remediation = snapshot.remediationSteps
    .slice(0, 3)
    .map((step) => sanitizeShareText(step, options.audience));
  const diffHeadline = sanitizeDiffHeadline(snapshot.diff, options.audience);
  const installFooter = formatInstallFooter(options.includeInstallFooter);

  const lines = [
    heading(options.target === "markdown" ? 2 : 3, "ClawSeatbelt Trust Receipt", options.target),
    `Verdict: ${sanitizeShareText(snapshot.headline, options.audience)}.`,
    `Mode: \`${mode}\`. Score: \`${snapshot.score}/100\` (${snapshot.severity}).`,
    facets.length > 0 ? `Focus:\n${bulletList(facets)}` : "Focus: No active posture hotspots.",
    findings.length > 0 ? `Top Findings:\n${bulletList(findings.map(formatFindingLine))}` : "Top Findings: None.",
    remediation.length > 0 ? `Next Steps:\n${bulletList(remediation)}` : "Next Steps: No immediate action required.",
    diffHeadline ? `Diff: ${diffHeadline}.` : undefined,
    installFooter
  ];

  return lines.filter(Boolean).join("\n\n");
}

function describeSkillRoot(report: SkillScanReport, audience: ShareAudience): string {
  return audience === "public" ? basename(report.root) || "skill bundle" : report.root;
}

export function renderSkillScanShare(report: SkillScanReport, options: ShareRenderOptions): string {
  const findings = report.findings
    .slice(0, options.maxFindings ?? 3)
    .map((finding) => sanitizeFinding(finding, options.audience));
  const lines = [
    heading(options.target === "markdown" ? 2 : 3, "Skill Approval Memo", options.target),
    `Bundle: \`${sanitizeShareText(describeSkillRoot(report, options.audience), options.audience)}\`.`,
    `Verdict: ${report.findings.length > 0 ? `${report.score}/100 (${report.severity}) with ${report.findings.length} finding(s)` : "no suspicious patterns detected"}.`,
    findings.length > 0
      ? `Top Findings:\n${bulletList(findings.map(formatFindingLine))}`
      : "Top Findings: None.",
    findings[0]
      ? `Recommendation: ${findings[0].remediation.action ?? findings[0].remediation.summary}.`
      : "Recommendation: Bundle looks reviewable with the current local checks."
  ];

  return lines.join("\n\n");
}
