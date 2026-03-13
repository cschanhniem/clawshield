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

function collectMatchingLines(input: string, test: (line: string) => boolean): string[] {
  const matches = new Set<string>();
  for (const line of input.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (test(trimmed)) {
      matches.add(trimmed);
    }
  }
  return [...matches];
}

function hasPinnedVersion(line: string): boolean {
  return (
    /@\d+(?:\.\d+){0,3}(?:[-+][\w.-]+)?\b/.test(line) ||
    /==\s*\d+(?:\.\d+){0,3}(?:[-+][\w.-]+)?\b/.test(line) ||
    /--version\s+\d+(?:\.\d+){0,3}(?:[-+][\w.-]+)?\b/.test(line) ||
    /@[0-9a-f]{7,40}\b/i.test(line)
  );
}

function hasMovingReference(line: string): boolean {
  return /@(latest|main|master|head)\b/i.test(line) || /\/(main|master)\//i.test(line);
}

function isPackageInstallLine(line: string): boolean {
  return /\b(npm\s+(install|i)|pnpm\s+add|yarn\s+add|npx|pip\s+install|uv\s+tool\s+install|go\s+install|cargo\s+install)\b/i.test(
    line
  );
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
    id: "skill-hidden-exec",
    title: "Skill includes hidden or one-line execution flow",
    score: 26,
    rationale: "Inline interpreters and encoded launchers reduce inspectability and hide execution paths.",
    remediation: {
      summary: "Require plain-text, reviewable setup steps and expand hidden execution into auditable commands."
    },
    test(input) {
      return collect(input, [
        /\bbase64\b/gi,
        /\beval\s*\(/gi,
        /\bnode\s+-e\b/gi,
        /\bpython\s+-c\b/gi,
        /\bbash\s+-c\b/gi,
        /\bsh\s+-c\b/gi,
        /\bpowershell(?:\.exe)?\s+-encodedcommand\b/gi,
        /\bosascript\s+-e\b/gi
      ]);
    }
  },
  {
    id: "skill-unpinned-install",
    title: "Skill relies on unpinned installer or package version",
    score: 22,
    rationale: "Unpinned package installs and moving refs make the executed artifact drift over time.",
    remediation: {
      summary: "Pin exact package, image, or tool versions in every install command.",
      action: "Replace floating installs like latest, main, or bare package names with exact versions or commits."
    },
    test(input) {
      return collectMatchingLines(input, (line) => {
        if (!isPackageInstallLine(line)) {
          return false;
        }
        if (hasMovingReference(line)) {
          return true;
        }
        return !hasPinnedVersion(line);
      });
    }
  },
  {
    id: "skill-moving-ref",
    title: "Skill depends on a moving branch or latest tag",
    score: 18,
    rationale: "Moving refs weaken reproducibility and make review results stale quickly.",
    remediation: {
      summary: "Replace main, master, head, or latest references with exact versions or immutable commits."
    },
    test(input) {
      return collect(input, [
        /@(latest|main|master|head)\b/gi,
        /\/(main|master)\//gi
      ]);
    }
  },
  {
    id: "skill-install-hook",
    title: "Skill bundle contains install hook execution",
    score: 24,
    rationale: "Install hooks such as preinstall or postinstall can trigger execution before the operator has fully reviewed the bundle.",
    remediation: {
      summary: "Review install hooks closely or replace them with explicit, reviewable operator steps."
    },
    test(input) {
      return collect(input, [
        /"(preinstall|postinstall|prepare)"\s*:/gi,
        /'(preinstall|postinstall|prepare)'\s*:/gi
      ]);
    }
  },
  {
    id: "skill-permission-expansion",
    title: "Skill setup expands permissions or weakens OpenClaw guardrails",
    score: 28,
    rationale: "Permission broadening and guardrail relaxation increase the blast radius of a compromised skill or session.",
    remediation: {
      summary: "Keep OpenClaw tool policy, exec approvals, and plugin allowlists narrow during skill setup.",
      action: "Avoid chmod 777, exec.security full, tools.profile full, or wildcard allowlist changes in setup instructions."
    },
    test(input) {
      return collect(input, [
        /\bchmod\s+-R?\s+777\b/gi,
        /\bexec\.security\b[^\n]*(full|allow all)/gi,
        /\btools\.profile\b[^\n]*full/gi,
        /\bplugins\.allow\b[^\n]*\*/gi,
        /\bdmPolicy\b[^\n]*open/gi,
        /\ballowFrom\b[^\n]*\*/gi
      ]);
    }
  },
  {
    id: "skill-remote-fetch",
    title: "Skill setup pulls executable content from a remote source",
    score: 20,
    rationale: "Remote fetch patterns widen the trust boundary and often hide what will execute next.",
    remediation: {
      summary: "Prefer pinned local artifacts or immutable downloads with checksums and review steps."
    },
    test(input) {
      return collect(input, [
        /curl\s+-[A-Za-z]*[Lo][A-Za-z]*\s+https?:\/\/[^\s]+/gi,
        /wget\s+-O\s+\S+\s+https?:\/\/[^\s]+/gi,
        /https?:\/\/raw\.githubusercontent\.com[^\s]*/gi,
        /https?:\/\/gist\.githubusercontent\.com[^\s]*/gi,
        /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}[^\s]*/gi
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
