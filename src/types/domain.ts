export type Severity = "low" | "medium" | "high" | "critical";
export type RiskCategory =
  | "prompt-injection"
  | "shell-execution"
  | "obfuscation"
  | "credential-harvest"
  | "suspicious-url"
  | "secret-exposure"
  | "skill-supply-chain"
  | "configuration";

export interface Remediation {
  summary: string;
  action?: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  category: RiskCategory;
  score: number;
  evidence: string[];
  rationale: string;
  remediation: Remediation;
}

export interface RiskEvaluation {
  score: number;
  severity: Severity;
  findings: Finding[];
  recommendedMode: "allow" | "warn" | "hold";
}

export interface RedactionResult {
  original: string;
  sanitized: string;
  findings: Finding[];
}

export interface SkillFileReport {
  path: string;
  findings: Finding[];
}

export interface SkillScanReport {
  root: string;
  score: number;
  severity: Severity;
  files: SkillFileReport[];
  findings: Finding[];
}

export interface PostureInput {
  inbound?: RiskEvaluation;
  redaction?: RedactionResult;
  skillScan?: SkillScanReport;
  configurationFindings?: Finding[];
}

export interface PostureSummary {
  headline: string;
  score: number;
  severity: Severity;
  findings: Finding[];
  remediationSteps: string[];
  shareMessage: string;
}
