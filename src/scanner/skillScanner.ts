import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { severityFromScore } from "../core/severity.js";
import { evaluateSkillRules } from "../rules/skillRules.js";
import type { Finding, SkillFileReport, SkillScanReport } from "../types/domain.js";

function collectFiles(root: string): string[] {
  const paths: string[] = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      paths.push(...collectFiles(fullPath));
      continue;
    }
    if (/\.(md|txt|json|yaml|yml|sh|js|ts)$/i.test(entry)) {
      paths.push(fullPath);
    }
  }

  return paths;
}

export function scanSkillDirectory(root: string): SkillScanReport {
  const files = collectFiles(root);
  const fileReports: SkillFileReport[] = [];
  const findings: Finding[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const fileFindings = evaluateSkillRules(content).map((finding) => ({
      ...finding,
      severity: severityFromScore(finding.score)
    }));

    if (fileFindings.length > 0) {
      fileReports.push({
        path: relative(root, file),
        findings: fileFindings
      });
      findings.push(...fileFindings);
    }
  }

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.score, 0));
  const severity = severityFromScore(score);

  return {
    root,
    score,
    severity,
    files: fileReports,
    findings
  };
}
