import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { evaluateInboundMessage } from "../core/riskEngine.js";
import { redactToolResult } from "../core/redactionEngine.js";
import { runTrustChallenge } from "../reporting/challengeReport.js";
import { scanSkillDirectory } from "../scanner/skillScanner.js";

export interface RuntimeBenchmarkOptions {
  workspaceRoot: string;
}

interface MessageFixture {
  name: string;
  content: string;
  minScore?: number;
  maxScore?: number;
  recommendedMode: "allow" | "warn" | "hold";
}

interface MessageBenchmarkResult {
  name: string;
  passed: boolean;
  score: number;
  recommendedMode: "allow" | "warn" | "hold";
  matchedFindingIds: string[];
}

interface RedactionBenchmarkResult {
  name: string;
  passed: boolean;
  findingCount: number;
  sanitized: string;
}

interface SkillBenchmarkResult {
  name: string;
  passed: boolean;
  score: number;
  severity: string;
  findingIds: string[];
}

interface CompetitorPackageMetadata {
  packageName: string;
  available: boolean;
  version?: string;
  description?: string;
  homepage?: string;
}

export interface RuntimeBenchmarkReport {
  generatedAt: string;
  workspaceRoot: string;
  summary: {
    messagePasses: number;
    messageTotal: number;
    redactionPasses: number;
    redactionTotal: number;
    skillPasses: number;
    skillTotal: number;
  };
  messages: MessageBenchmarkResult[];
  redactions: RedactionBenchmarkResult[];
  skills: SkillBenchmarkResult[];
  challenge: ReturnType<typeof runTrustChallenge>;
  competitors: CompetitorPackageMetadata[];
}

const competitorPackages = [
  "@openguardrails/moltguard",
  "@adversa/secureclaw",
  "@policyshield/openclaw-plugin",
  "@f4bioo/berry-shield"
] as const;

const redactionSamples = [
  {
    name: "bearer-and-openai-key",
    input: "Authorization: Bearer abcdefghijklmnop OpenAI sk-1234567890123456789012",
    expectedSnippets: ["[REDACTED_TOKEN]", "[REDACTED_API_KEY]"]
  },
  {
    name: "aws-style-secret",
    input: "aws_secret_access_key = ABCDEFGHIJKLMNOPQRSTUVWX1234567890abcd",
    expectedSnippets: ["[REDACTED_SECRET]"]
  }
];

function readMessageCorpus(workspaceRoot: string): MessageFixture[] {
  const path = join(workspaceRoot, "test", "fixtures", "message-corpus.json");
  return JSON.parse(readFileSync(path, "utf8")) as MessageFixture[];
}

function runMessageBenchmarks(workspaceRoot: string): MessageBenchmarkResult[] {
  return readMessageCorpus(workspaceRoot).map((fixture) => {
    const evaluation = evaluateInboundMessage(fixture.content);
    const meetsMin = fixture.minScore === undefined || evaluation.score >= fixture.minScore;
    const meetsMax = fixture.maxScore === undefined || evaluation.score <= fixture.maxScore;
    const modeMatches = evaluation.recommendedMode === fixture.recommendedMode;

    return {
      name: fixture.name,
      passed: meetsMin && meetsMax && modeMatches,
      score: evaluation.score,
      recommendedMode: evaluation.recommendedMode,
      matchedFindingIds: evaluation.findings.map((finding) => finding.id)
    };
  });
}

function runRedactionBenchmarks(): RedactionBenchmarkResult[] {
  return redactionSamples.map((sample) => {
    const result = redactToolResult(sample.input);
    const passed = sample.expectedSnippets.every((snippet) => result.sanitized.includes(snippet));

    return {
      name: sample.name,
      passed,
      findingCount: result.findings.length,
      sanitized: result.sanitized
    };
  });
}

function runSkillBenchmarks(workspaceRoot: string): SkillBenchmarkResult[] {
  const scenarios = [
    {
      name: "benign",
      path: join(workspaceRoot, "test", "fixtures", "skills", "benign"),
      expectFindings: false
    },
    {
      name: "malicious",
      path: join(workspaceRoot, "test", "fixtures", "skills", "malicious"),
      expectFindings: true
    },
    {
      name: "unpinned-and-hooks",
      path: join(workspaceRoot, "test", "fixtures", "skills", "unpinned"),
      expectFindings: true
    }
  ];

  return scenarios.map((scenario) => {
    const report = scanSkillDirectory(scenario.path);
    const passed = scenario.expectFindings ? report.findings.length > 0 : report.findings.length === 0;

    return {
      name: scenario.name,
      passed,
      score: report.score,
      severity: report.severity,
      findingIds: [...new Set(report.findings.map((finding) => finding.id))]
    };
  });
}

function parseNpmViewOutput(raw: string): Omit<CompetitorPackageMetadata, "packageName" | "available"> {
  const result: Omit<CompetitorPackageMetadata, "packageName" | "available"> = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=\s*'(.*)'$/);
    if (!match) {
      continue;
    }
    const key = match[1]?.trim();
    const value = match[2]?.trim();
    if (!key || !value) {
      continue;
    }
    if (key === "version") {
      result.version = value;
    } else if (key === "description") {
      result.description = value;
    } else if (key === "homepage") {
      result.homepage = value;
    }
  }
  return result;
}

function readCompetitorPackages(): CompetitorPackageMetadata[] {
  return competitorPackages.map((packageName) => {
    try {
      const raw = execFileSync("npm", ["view", packageName, "version", "description", "homepage"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
      return {
        packageName,
        available: true,
        ...parseNpmViewOutput(raw)
      };
    } catch {
      return {
        packageName,
        available: false
      };
    }
  });
}

export function runRuntimeBenchmark(options: RuntimeBenchmarkOptions): RuntimeBenchmarkReport {
  const messages = runMessageBenchmarks(options.workspaceRoot);
  const redactions = runRedactionBenchmarks();
  const skills = runSkillBenchmarks(options.workspaceRoot);

  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot: options.workspaceRoot,
    summary: {
      messagePasses: messages.filter((item) => item.passed).length,
      messageTotal: messages.length,
      redactionPasses: redactions.filter((item) => item.passed).length,
      redactionTotal: redactions.length,
      skillPasses: skills.filter((item) => item.passed).length,
      skillTotal: skills.length
    },
    messages,
    redactions,
    skills,
    challenge: runTrustChallenge(),
    competitors: readCompetitorPackages()
  };
}

export function renderRuntimeBenchmarkMarkdown(report: RuntimeBenchmarkReport): string {
  const competitorLines = report.competitors.map((item) => {
    if (!item.available) {
      return `- ${item.packageName}: unavailable from npm during this run`;
    }
    return `- ${item.packageName}: ${item.version ?? "unknown version"}${item.description ? ` — ${item.description}` : ""}`;
  });

  return [
    "# Local Runtime Benchmark",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Message corpus: ${report.summary.messagePasses}/${report.summary.messageTotal} scenarios passed`,
    `- Redaction corpus: ${report.summary.redactionPasses}/${report.summary.redactionTotal} scenarios passed`,
    `- Skill corpus: ${report.summary.skillPasses}/${report.summary.skillTotal} scenarios passed`,
    "",
    "## Message Corpus",
    "",
    ...report.messages.map(
      (item) =>
        `- ${item.name}: ${item.passed ? "pass" : "fail"}, score ${item.score}/100, mode ${item.recommendedMode}, findings ${item.matchedFindingIds.join(", ") || "none"}`
    ),
    "",
    "## Redaction Corpus",
    "",
    ...report.redactions.map(
      (item) =>
        `- ${item.name}: ${item.passed ? "pass" : "fail"}, findings ${item.findingCount}, sanitized \`${item.sanitized}\``
    ),
    "",
    "## Skill Corpus",
    "",
    ...report.skills.map(
      (item) =>
        `- ${item.name}: ${item.passed ? "pass" : "fail"}, score ${item.score}/100 (${item.severity}), findings ${item.findingIds.join(", ") || "none"}`
    ),
    "",
    "## Trust Challenge",
    "",
    `- ${report.challenge.headline}`,
    `- ${report.challenge.summary}`,
    ...report.challenge.checks.map((check) => `- ${check.label}: ${check.verdict} Evidence: ${check.evidence}`),
    "",
    "## Live Competitor Package Snapshot",
    "",
    ...competitorLines,
    "",
    "## Caveats",
    "",
    "- This benchmark proves local runtime behavior inside this repository. It does not yet prove superiority against live competitor runtime hooks in the same OpenClaw lab.",
    "- Competitor package data here is a live npm availability snapshot, not a behavior benchmark."
  ].join("\n");
}

export function writeRuntimeBenchmarkArtifacts(
  report: RuntimeBenchmarkReport,
  outputPaths: { markdown: string; json: string }
): void {
  mkdirSync(dirname(outputPaths.markdown), { recursive: true });
  mkdirSync(dirname(outputPaths.json), { recursive: true });
  writeFileSync(outputPaths.markdown, `${renderRuntimeBenchmarkMarkdown(report)}\n`, "utf8");
  writeFileSync(outputPaths.json, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
