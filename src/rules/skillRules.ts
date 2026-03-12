import type { Finding } from "../types/domain.js";

interface SkillRule {
  id: string;
  title: string;
  score: number;
  rationale: string;
  remediation: Finding["remediation"];
  test(input: string): string[];
}

function collect(input: string, patterns: RegExp[]): string[] {
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const found = input.match(pattern);
    if (found) {
      matches.add(found[0]);
    }
  }
  return [...matches];
}

const skillRules: SkillRule[] = [
  {
    id: "skill-pipe-shell",
    title: "Skill bundle contains pipe-to-shell installer guidance",
    score: 32,
    rationale: "Pipe-to-shell installation is a high-risk supply-chain pattern.",
    remediation: {
      summary: "Replace the installer with a pinned, inspectable install path."
    },
    test(input) {
      return collect(input, [
        /curl\s+[^\n|]+\|\s*(bash|sh)/gi,
        /wget\s+[^\n|]+\|\s*(bash|sh)/gi
      ]);
    }
  },
  {
    id: "skill-credential-request",
    title: "Skill asks operator to provide secrets directly",
    score: 28,
    rationale: "Skills should not encourage operators to paste secrets into prompts or scripts.",
    remediation: {
      summary: "Use secret references or documented environment setup instead of direct secret disclosure."
    },
    test(input) {
      return collect(input, [
        /paste (your )?(api key|token|private key)/gi,
        /enter (your )?(wallet|seed phrase|secret)/gi
      ]);
    }
  },
  {
    id: "skill-obfuscated-exec",
    title: "Skill includes obfuscated execution flow",
    score: 24,
    rationale: "Encoded or obfuscated commands reduce inspectability and raise trust risk.",
    remediation: {
      summary: "Require plain-text, reviewable installation steps."
    },
    test(input) {
      return collect(input, [
        /\bbase64\b/gi,
        /\beval\s*\(/gi,
        /\bnode\s+-e\b/gi,
        /\bpython\s+-c\b/gi
      ]);
    }
  }
];

export function evaluateSkillRules(input: string): Finding[] {
  return skillRules.flatMap((rule) => {
    const evidence = rule.test(input);
    if (evidence.length === 0) {
      return [];
    }

    return [
      {
        id: rule.id,
        title: rule.title,
        severity: "medium",
        category: "skill-supply-chain",
        score: rule.score,
        evidence,
        rationale: rule.rationale,
        remediation: rule.remediation
      }
    ];
  });
}
