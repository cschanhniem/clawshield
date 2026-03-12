import type { Severity } from "../types/domain.js";

const severityOrder: Severity[] = ["low", "medium", "high", "critical"];

export function severityFromScore(score: number): Severity {
  if (score >= 90) {
    return "critical";
  }
  if (score >= 65) {
    return "high";
  }
  if (score >= 35) {
    return "medium";
  }
  return "low";
}

export function maxSeverity(values: Severity[]): Severity {
  return values.reduce((current, next) =>
    severityOrder.indexOf(next) > severityOrder.indexOf(current) ? next : current
  );
}
