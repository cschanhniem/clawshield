import { severityFromScore } from "./severity.js";
import { applyRedactionRules } from "../rules/redactionRules.js";
import type { RedactionResult } from "../types/domain.js";

export function redactToolResult(content: string): RedactionResult {
  const { sanitized, findings } = applyRedactionRules(content);

  return {
    original: content,
    sanitized,
    findings: findings.map((finding) => ({
      ...finding,
      severity: severityFromScore(finding.score)
    }))
  };
}

interface UnknownRedactionResult {
  value: unknown;
  sanitized: boolean;
}

function redactStringValue(value: string): { value: string; changed: boolean } {
  const result = redactToolResult(value);
  return {
    value: result.sanitized,
    changed: result.sanitized !== value
  };
}

export function redactUnknownValue(value: unknown): UnknownRedactionResult {
  if (typeof value === "string") {
    const result = redactStringValue(value);
    return { value: result.value, sanitized: result.changed };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((entry) => {
      const result = redactUnknownValue(entry);
      changed ||= result.sanitized;
      return result.value;
    });
    return { value: next, sanitized: changed };
  }

  if (typeof value === "object" && value !== null) {
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const result = redactUnknownValue(entry);
      changed ||= result.sanitized;
      next[key] = result.value;
    }
    return { value: next, sanitized: changed };
  }

  return { value, sanitized: false };
}
