import { lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { severityFromScore } from "../core/severity.js";
import { evaluateSkillRules } from "../rules/skillRules.js";
import type { Finding, SkillFileReport, SkillScanReport } from "../types/domain.js";

const IGNORED_DIRECTORIES = new Set([".git", ".hg", ".svn", "node_modules", "dist", "build", "coverage", ".tmp"]);
const MAX_SCAN_FILE_BYTES = 256 * 1024;

function collectFiles(root: string, seenDirectories = new Set<string>()): string[] {
  const paths: string[] = [];
  const realRoot = realpathSync(root);

  if (seenDirectories.has(realRoot)) {
    return paths;
  }
  seenDirectories.add(realRoot);

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const linkStat = lstatSync(fullPath);
    if (linkStat.isSymbolicLink()) {
      continue;
    }

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry)) {
        continue;
      }
      paths.push(...collectFiles(fullPath, seenDirectories));
      continue;
    }
    if (stat.size > MAX_SCAN_FILE_BYTES) {
      continue;
    }
    if (/\.(md|txt|json|yaml|yml|sh|js|ts)$/i.test(entry)) {
      paths.push(fullPath);
    }
  }

  return paths;
}

export function scanSkillDirectory(root: string): SkillScanReport {
  const rootStat = statSync(root);
  if (!rootStat.isDirectory()) {
    throw new Error(`scan target is not a directory: ${root}`);
  }

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
        path: relative(root, file) || basename(file),
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
