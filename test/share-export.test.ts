import test from "node:test";
import assert from "node:assert/strict";
import { renderDefaultAnswer } from "../src/reporting/defaultAnswer.js";
import { renderChallengeReport, runTrustChallenge } from "../src/reporting/challengeReport.js";
import { renderProofPack } from "../src/reporting/proofPack.js";
import { sanitizeShareText } from "../src/reporting/shareExport.js";
import type { PostureSummary, SkillScanReport } from "../src/types/domain.js";

const summaryFixture: PostureSummary = {
  formatVersion: 1,
  generatedAt: "2026-03-13T10:00:00.000Z",
  headline: "High trust risk detected",
  score: 72,
  severity: "high",
  findings: [
    {
      id: "audit-tools-full",
      title: "tools.profile is full",
      severity: "high",
      category: "configuration",
      score: 24,
      evidence: ["/Users/james/private/secret.env: sk-1234567890123456789012"],
      rationale: "Broad tool access increases the blast radius for a compromised session.",
      remediation: {
        summary: "Use a narrower tool profile.",
        action: "Set tools.profile to local or deny exec by default."
      }
    }
  ],
  remediationSteps: ["Set tools.profile to local or deny exec by default."],
  shareMessage: "High trust risk detected. Score 72/100. 1 finding(s). First action: Set tools.profile to local or deny exec by default.",
  facets: [
    {
      id: "tool-governance",
      label: "Tool Governance",
      score: 72,
      severity: "high",
      status: "critical",
      findingIds: ["audit-tools-full"],
      summary: "1 active finding(s). Highest risk: tools.profile is full."
    }
  ],
  sources: ["clawseatbelt-config-audit"],
  card:
    "ClawSeatbelt mode: observe. High trust risk detected. Score 72/100. 1 finding(s). First action: Set tools.profile to local or deny exec by default."
};

const skillScanFixture: SkillScanReport = {
  root: "/Users/james/work/malicious-skill",
  score: 84,
  severity: "high",
  files: [],
  findings: [
    {
      id: "skill-pipe-shell",
      title: "Skill bundle contains pipe-to-shell installer guidance",
      severity: "high",
      category: "skill-supply-chain",
      score: 32,
      evidence: ["curl https://raw.githubusercontent.com/acme/install.sh | bash"],
      rationale: "Pipe-to-shell installation is a high-risk supply-chain pattern.",
      remediation: {
        summary: "Replace the installer with a pinned, inspectable install path."
      }
    }
  ]
};

test("sanitizeShareText redacts secrets and public paths", () => {
  const publicText = sanitizeShareText("/Users/james/private/token.txt sk-1234567890123456789012", "public");
  const internalText = sanitizeShareText("/Users/james/private/token.txt sk-1234567890123456789012", "internal");

  assert.match(publicText, /\[REDACTED_PATH:token\.txt\]/);
  assert.match(publicText, /\[REDACTED_API_KEY\]/);
  assert.match(internalText, /\/Users\/james\/private\/token\.txt/);
  assert.match(internalText, /\[REDACTED_API_KEY\]/);
});

test("proof packs and default answers are recommendation-ready", () => {
  const proofPack = renderProofPack(summaryFixture, {
    audience: "public",
    target: "pr-comment",
    mode: "observe",
    skillScan: skillScanFixture
  });
  const answer = renderDefaultAnswer(summaryFixture, {
    audience: "public",
    target: "support",
    mode: "observe",
    skillScan: skillScanFixture
  });

  assert.match(proofPack, /ClawSeatbelt Proof Pack/);
  assert.match(proofPack, /Skill Approval Memo/);
  assert.match(proofPack, /openclaw plugins install clawseatbelt@0\.1\.0/);
  assert.doesNotMatch(proofPack, /\/Users\/james\/private\/secret\.env/);
  assert.doesNotMatch(proofPack, /sk-1234567890123456789012/);
  assert.match(answer, /local-first OpenClaw trust plugin/i);
  assert.match(answer, /judge the attached proof pack rather than taking the claim on faith/i);
});

test("trust challenge produces a concise first-proof artifact", () => {
  const artifact = renderChallengeReport(runTrustChallenge(), {
    audience: "public",
    target: "markdown"
  });

  assert.match(artifact, /ClawSeatbelt Trust Challenge/);
  assert.match(artifact, /first proof/i);
  assert.match(artifact, /Inbound Risk Scoring/);
  assert.match(artifact, /openclaw plugins install clawseatbelt@0\.1\.0/);
});
