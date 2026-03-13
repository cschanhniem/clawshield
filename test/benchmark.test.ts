import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { renderRuntimeBenchmarkMarkdown, runRuntimeBenchmark } from "../src/benchmark/runtimeBenchmark.js";

test("runtime benchmark report summarizes local benchmark coverage", () => {
  const report = runRuntimeBenchmark({ workspaceRoot: process.cwd() });
  const markdown = renderRuntimeBenchmarkMarkdown(report);

  assert.equal(report.summary.messagePasses, report.summary.messageTotal);
  assert.equal(report.summary.redactionPasses, report.summary.redactionTotal);
  assert.equal(report.summary.skillPasses, report.summary.skillTotal);
  assert.match(markdown, /Local Runtime Benchmark/);
  assert.match(markdown, /Live Competitor Package Snapshot/);
  assert.ok(
    report.skills.some((item) => item.name === "unpinned-and-hooks" && item.findingIds.includes("skill-unpinned-install"))
  );
  assert.ok(report.competitors.some((item) => item.packageName === "@openguardrails/moltguard"));
  assert.match(join(report.workspaceRoot, "test", "fixtures"), /test[\/\\]fixtures/);
});
