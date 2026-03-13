import { resolve } from "node:path";
import { runRuntimeBenchmark, writeRuntimeBenchmarkArtifacts } from "./runtimeBenchmark.js";

const workspaceRoot = resolve(process.cwd());
const report = runRuntimeBenchmark({ workspaceRoot });

writeRuntimeBenchmarkArtifacts(report, {
  markdown: resolve(workspaceRoot, "docs", "benchmarks", "local-runtime-benchmark.md"),
  json: resolve(workspaceRoot, "docs", "benchmarks", "artifacts", "local-runtime-benchmark.json")
});

console.log(
  `Wrote local benchmark report with ${report.summary.messagePasses}/${report.summary.messageTotal} message passes, ` +
    `${report.summary.redactionPasses}/${report.summary.redactionTotal} redaction passes, and ` +
    `${report.summary.skillPasses}/${report.summary.skillTotal} skill passes.`
);
