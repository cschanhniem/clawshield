import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("published package surface excludes dev-only benchmark files", async () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    files: string[];
    scripts: Record<string, string>;
  };
  const publicExports = await import("../src/index.js");

  assert.ok(!packageJson.files.includes("dist"));
  assert.ok(!packageJson.files.some((entry) => entry.includes("benchmark")));
  assert.ok(packageJson.files.includes("dist/openclaw.js"));
  assert.ok(packageJson.files.includes("dist/core"));
  assert.ok(packageJson.files.includes("dist/reporting"));
  assert.ok(packageJson.files.includes("dist/rules"));
  assert.ok(packageJson.files.includes("dist/scanner"));
  assert.ok(packageJson.files.includes("dist/types"));
  assert.equal("runRuntimeBenchmark" in publicExports, false);
  assert.match(packageJson.scripts["verify:openclaw-lab"] ?? "", /verify-openclaw-lab/);
});
