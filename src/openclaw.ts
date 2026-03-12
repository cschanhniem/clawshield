import { clawShieldConfigSchema, validateClawShieldConfig } from "./core/config.js";
import { ClawShieldRuntime } from "./core/clawShieldRuntime.js";
import type { OpenClawPluginApiLike, OpenClawPluginDefinitionLike } from "./types/openclaw.js";

export const clawShieldPluginDefinition: OpenClawPluginDefinitionLike = {
  id: "clawshield-local",
  name: "ClawShield Local",
  description:
    "Local-first trust layer for OpenClaw with inbound risk scoring, transcript hygiene, and skill inspection.",
  version: "0.1.0",
  configSchema: clawShieldConfigSchema,
  register(api: OpenClawPluginApiLike): void {
    const parsed = validateClawShieldConfig(api.pluginConfig);
    if (!parsed.ok) {
      throw new Error(`Invalid ClawShield config: ${parsed.errors.join("; ")}`);
    }

    const runtime = new ClawShieldRuntime(api, parsed.value);
    runtime.register();
  }
};

export default function registerClawShield(api: OpenClawPluginApiLike): void {
  void clawShieldPluginDefinition.register(api);
}
