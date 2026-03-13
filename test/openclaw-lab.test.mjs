import test from "node:test";
import assert from "node:assert/strict";
import {
  detectExternalDependencySignals,
  extractJsonPayloadFromMixedOutput
} from "../scripts/lib/openclaw-lab.mjs";

test("extractJsonPayloadFromMixedOutput parses json wrapped in plugin logs", () => {
  const payload = extractJsonPayloadFromMixedOutput(
    [
      "[plugins] [moltguard] Platform: active (autonomous mode)",
      "{\"id\":\"moltguard\",\"hookCount\":24,\"commands\":[\"og_status\"]}",
      "[plugins] trailing line"
    ].join("\n"),
    "moltguard sample"
  );

  assert.equal(payload.id, "moltguard");
  assert.equal(payload.hookCount, 24);
  assert.deepEqual(payload.commands, ["og_status"]);
});

test("detectExternalDependencySignals classifies hosted and server-backed defaults", () => {
  const moltguardSignals = detectExternalDependencySignals(
    "Platform: auto-registering... registered (autonomous mode, 500/day quota)",
    {
      configJsonSchema: {
        properties: {
          apiKey: { type: "string" },
          coreUrl: { type: "string" },
          dashboardUrl: { type: "string" }
        }
      }
    }
  );
  const policyShieldSignals = detectExternalDependencySignals(
    "PolicyShield server unreachable — running in degraded mode",
    {
      configJsonSchema: {
        properties: {
          url: {
            default: "http://localhost:8100",
            description: "PolicyShield server URL"
          }
        }
      }
    }
  );

  assert.equal(moltguardSignals.cloudService, true);
  assert.equal(moltguardSignals.localFirstBaseline, false);
  assert.equal(policyShieldSignals.serverDependency, true);
  assert.equal(policyShieldSignals.localFirstBaseline, false);
});
