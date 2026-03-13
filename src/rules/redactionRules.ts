import type { Finding } from "../types/domain.js";

interface ReplacementRule {
  id: string;
  title: string;
  pattern: RegExp;
  replacement: string;
  score: number;
  rationale: string;
  remediation: Finding["remediation"];
}

const replacementRules: ReplacementRule[] = [
  {
    id: "secret-openai",
    title: "Detected OpenAI-style API key",
    pattern: /\bsk-[A-Za-z0-9]{20,}\b/g,
    replacement: "[REDACTED_API_KEY]",
    score: 35,
    rationale: "Persisting live API keys in transcripts increases leakage risk.",
    remediation: {
      summary: "Store secrets in secret references and keep them out of transcripts."
    }
  },
  {
    id: "secret-github-pat",
    title: "Detected GitHub personal access token",
    pattern: /\bghp_[A-Za-z0-9]{20,}\b/g,
    replacement: "[REDACTED_GITHUB_TOKEN]",
    score: 32,
    rationale: "Source control tokens should never persist in clear text.",
    remediation: {
      summary: "Rotate exposed tokens and scrub persisted transcripts."
    }
  },
  {
    id: "secret-bearer",
    title: "Detected bearer token in tool output",
    pattern: /\bBearer\s+[A-Za-z0-9._-]{12,}\b/g,
    replacement: "Bearer [REDACTED_TOKEN]",
    score: 28,
    rationale: "Bearer tokens grant access by possession alone.",
    remediation: {
      summary: "Persist only token metadata, never the token body."
    }
  },
  {
    id: "secret-generic-long-value",
    title: "Detected long secret-style value",
    pattern:
      /\b(?:api[_-]?key|secret|secret[_-]?key|access[_-]?key|aws_secret_access_key|token)\b\s*[:=]\s*[A-Za-z0-9\/+=_-]{24,}\b/gi,
    replacement: "[REDACTED_SECRET]",
    score: 30,
    rationale: "Long secret-like values in key-value form are likely credentials and should not persist in transcripts.",
    remediation: {
      summary: "Replace raw secrets with references or metadata before persisting output."
    }
  }
];

export function applyRedactionRules(input: string): { sanitized: string; findings: Finding[] } {
  let sanitized = input;
  const findings: Finding[] = [];

  for (const rule of replacementRules) {
    const matches = [...sanitized.matchAll(rule.pattern)];
    if (matches.length === 0) {
      continue;
    }

    sanitized = sanitized.replace(rule.pattern, (match) => {
      if (rule.id === "secret-generic-long-value") {
        const parts = match.split(/([:=])/, 3);
        const prefix = parts[0]?.trim() ?? "secret";
        const separator = parts[1] ?? "=";
        return `${prefix} ${separator} [REDACTED_SECRET]`;
      }
      return rule.replacement;
    });
    findings.push({
      id: rule.id,
      title: rule.title,
      severity: "medium",
      category: "secret-exposure",
      score: rule.score,
      evidence: matches.map((match) => match[0]),
      rationale: rule.rationale,
      remediation: rule.remediation
    });
  }

  return { sanitized, findings };
}
