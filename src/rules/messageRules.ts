import type { Finding } from "../types/domain.js";

interface Rule {
  id: string;
  title: string;
  score: number;
  category: Finding["category"];
  rationale: string;
  remediation: Finding["remediation"];
  test(input: string): string[];
}

function collectMatches(input: string, patterns: RegExp[]): string[] {
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const found = input.match(pattern);
    if (found) {
      matches.add(found[0]);
    }
  }
  return [...matches];
}

const rules: Rule[] = [
  {
    id: "msg-prompt-ignore",
    title: "Message attempts instruction override",
    score: 24,
    category: "prompt-injection",
    rationale: "The message tries to override higher-priority instructions or safety framing.",
    remediation: {
      summary: "Treat the message as untrusted content and require explicit operator confirmation."
    },
    test(input) {
      return collectMatches(input, [
        /ignore (all|any|previous|prior) instructions/gi,
        /disregard (the )?(system|developer) prompt/gi,
        /new instructions start here/gi
      ]);
    }
  },
  {
    id: "msg-shell-bait",
    title: "Message contains shell execution bait",
    score: 26,
    category: "shell-execution",
    rationale: "The message encourages direct shell execution, a common attack path in OpenClaw workflows.",
    remediation: {
      summary: "Do not run the command directly.",
      action: "Require sandboxed review or deny exec for this interaction."
    },
    test(input) {
      return collectMatches(input, [
        /curl\s+[^\n|]+\|\s*(bash|sh)/gi,
        /wget\s+[^\n|]+\|\s*(bash|sh)/gi,
        /\bchmod \+x\b/gi,
        /\bsudo\b/gi
      ]);
    }
  },
  {
    id: "msg-obfuscation",
    title: "Message contains obfuscation markers",
    score: 18,
    category: "obfuscation",
    rationale: "Obfuscation often hides malicious instructions or encoded payloads.",
    remediation: {
      summary: "Decode and inspect content before allowing any execution."
    },
    test(input) {
      return collectMatches(input, [
        /\bbase64\b/gi,
        /fromcharcode/gi,
        /eval\s*\(/gi
      ]);
    }
  },
  {
    id: "msg-credential-harvest",
    title: "Message requests sensitive credentials",
    score: 34,
    category: "credential-harvest",
    rationale: "The message asks for tokens, private keys, or wallet secrets.",
    remediation: {
      summary: "Do not disclose secrets in chat or tool inputs.",
      action: "Use OpenClaw secret references or remove the secret from the workflow."
    },
    test(input) {
      return collectMatches(input, [
        /\bapi key\b/gi,
        /\baccess token\b/gi,
        /\bprivate key\b/gi,
        /\bseed phrase\b/gi,
        /\bwallet\b/gi
      ]);
    }
  },
  {
    id: "msg-suspicious-url",
    title: "Message includes a suspicious remote fetch target",
    score: 14,
    category: "suspicious-url",
    rationale: "Short-lived raw URLs and IP-based downloads carry elevated supply-chain risk.",
    remediation: {
      summary: "Verify provenance and pin versions before fetching remote artifacts."
    },
    test(input) {
      return collectMatches(input, [
        /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}[^\s]*/gi,
        /https?:\/\/raw\.githubusercontent\.com[^\s]*/gi,
        /https?:\/\/gist\.githubusercontent\.com[^\s]*/gi
      ]);
    }
  }
];

export function evaluateMessageRules(input: string): Finding[] {
  return rules.flatMap((rule) => {
    const evidence = rule.test(input);
    if (evidence.length === 0) {
      return [];
    }

    return [
      {
        id: rule.id,
        title: rule.title,
        severity: "medium",
        category: rule.category,
        score: rule.score,
        evidence,
        rationale: rule.rationale,
        remediation: rule.remediation
      }
    ];
  });
}
