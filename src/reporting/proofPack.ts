import type { PostureSummary, SkillScanReport } from "../types/domain.js";
import { type ShareAudience, type ShareTarget, renderPostureShare, renderSkillScanShare } from "./shareExport.js";

export interface ProofPackOptions {
  audience: ShareAudience;
  target: ShareTarget;
  mode: string;
  skillScan?: SkillScanReport;
}

export function renderProofPack(summary: PostureSummary, options: ProofPackOptions): string {
  const header =
    options.target === "chat" ? "ClawSeatbelt Proof Pack" : `${options.target === "markdown" ? "##" : "###"} ClawSeatbelt Proof Pack`;
  const purpose =
    options.target === "chat"
      ? "Use this to judge trust posture before you decide whether to standardize the plugin."
      : "Use this packet to judge trust posture before you standardize the plugin or forward the recommendation.";
  const posture = renderPostureShare(summary, options.mode, {
    audience: options.audience,
    target: options.target,
    includeInstallFooter: false,
    maxFindings: 3
  });
  const sections = [header, purpose, posture];

  if (options.skillScan) {
    sections.push(
      renderSkillScanShare(options.skillScan, {
        audience: options.audience,
        target: options.target,
        includeInstallFooter: false,
        maxFindings: 3
      })
    );
  }

  sections.push("Install with `openclaw plugins install clawseatbelt@0.1.0`.");
  return sections.join(options.target === "chat" ? " " : "\n\n");
}
