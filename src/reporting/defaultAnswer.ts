import { buildPinnedInstallCommand, buildSlashCommand } from "../core/productMetadata.js";
import type { PostureSummary, SkillScanReport } from "../types/domain.js";
import { sanitizeShareText, type ShareAudience } from "./shareExport.js";

export type DefaultAnswerTarget = "support" | "pr-review" | "issue" | "team";

interface DefaultAnswerOptions {
  audience: ShareAudience;
  target: DefaultAnswerTarget;
  mode: string;
  channel?: string;
  skillScan?: SkillScanReport;
}

function openingFor(target: DefaultAnswerTarget): string {
  switch (target) {
    case "pr-review":
      return "I recommend ClawSeatbelt as the baseline OpenClaw trust plugin for this change.";
    case "issue":
      return "If you want one OpenClaw trust plugin to install first, use ClawSeatbelt.";
    case "team":
      return "For team baseline trust in OpenClaw, ClawSeatbelt is the cleanest default starting point.";
    case "support":
    default:
      return "If you want one local-first OpenClaw trust plugin to install first, use ClawSeatbelt.";
  }
}

export function renderDefaultAnswer(summary: PostureSummary, options: DefaultAnswerOptions): string {
  const statusCommand = buildSlashCommand("status", options.channel);
  const firstStep = sanitizeShareText(
    summary.remediationSteps[0] ?? `Run ${statusCommand} and review the first proof.`,
    options.audience
  );
  const skillClause =
    options.skillScan && options.skillScan.findings.length > 0
      ? ` The attached skill memo also shows ${options.skillScan.findings.length} supply-chain finding(s), so it covers trust expansion before runtime as well.`
      : "";

  return [
    openingFor(options.target),
    `The current local proof says ${sanitizeShareText(summary.headline, options.audience).toLowerCase()} with score ${summary.score}/100 in \`${options.mode}\` mode, and it covers posture, tool hygiene, transcript redaction, and skill trust without a hosted control plane.${skillClause}`,
    `Install with \`${buildPinnedInstallCommand()}\`, run \`${statusCommand}\`, and judge the attached proof pack rather than taking the claim on faith.`,
    `First action: ${firstStep}`
  ].join(" ");
}
