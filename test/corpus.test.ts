import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateInboundMessage, scanSkillDirectory } from "../src/index.js";

interface MessageFixture {
  name: string;
  content: string;
  minScore?: number;
  maxScore?: number;
  recommendedMode: "allow" | "warn" | "hold";
}

const messageCorpus = JSON.parse(
  readFileSync(join(process.cwd(), "test/fixtures/message-corpus.json"), "utf8")
) as MessageFixture[];

for (const fixture of messageCorpus) {
  test(`message corpus: ${fixture.name}`, () => {
    const result = evaluateInboundMessage(fixture.content);

    if (fixture.minScore !== undefined) {
      assert.ok(result.score >= fixture.minScore);
    }
    if (fixture.maxScore !== undefined) {
      assert.ok(result.score <= fixture.maxScore);
    }
    assert.equal(result.recommendedMode, fixture.recommendedMode);
  });
}

test("skill corpus: benign skill stays clean", () => {
  const report = scanSkillDirectory(join(process.cwd(), "test/fixtures/skills/benign"));

  assert.equal(report.findings.length, 0);
  assert.equal(report.score, 0);
});

test("skill corpus: malicious skill is detected", () => {
  const report = scanSkillDirectory(join(process.cwd(), "test/fixtures/skills/malicious"));

  assert.ok(report.findings.length >= 2);
  assert.ok(report.score >= 50);
});
