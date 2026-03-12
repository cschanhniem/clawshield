import { severityFromScore } from "./severity.js";
import { evaluateMessageRules } from "../rules/messageRules.js";
import type { RiskEvaluation } from "../types/domain.js";

export function evaluateInboundMessage(message: string): RiskEvaluation {
  const findings = evaluateMessageRules(message).map((finding) => ({
    ...finding,
    severity: severityFromScore(finding.score)
  }));

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.score, 0));
  const severity = severityFromScore(score);
  const recommendedMode =
    score >= 60 ? "hold" : score >= 30 ? "warn" : "allow";

  return {
    score,
    severity,
    findings,
    recommendedMode
  };
}
