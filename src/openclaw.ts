import { clawSeatbeltConfigSchema, validateClawSeatbeltConfig } from "./core/config.js";
import { ClawSeatbeltRuntime } from "./core/clawSeatbeltRuntime.js";
import {
  CLAWSEATBELT_PLUGIN_ID,
  CLAWSEATBELT_PLUGIN_NAME,
  CLAWSEATBELT_PLUGIN_VERSION
} from "./core/productMetadata.js";
import type { OpenClawPluginApiLike, OpenClawPluginDefinitionLike } from "./types/openclaw.js";

export const clawSeatbeltPluginDefinition: OpenClawPluginDefinitionLike = {
  id: CLAWSEATBELT_PLUGIN_ID,
  name: CLAWSEATBELT_PLUGIN_NAME,
  description:
    "Local-first trust layer for OpenClaw with inbound risk scoring, transcript hygiene, and skill inspection.",
  version: CLAWSEATBELT_PLUGIN_VERSION,
  configSchema: clawSeatbeltConfigSchema,
  register(api: OpenClawPluginApiLike): void {
    const parsed = validateClawSeatbeltConfig(api.pluginConfig);
    if (!parsed.ok) {
      throw new Error(`Invalid ClawSeatbelt config: ${parsed.errors.join("; ")}`);
    }

    const runtime = new ClawSeatbeltRuntime(api, parsed.value);
    runtime.register();
  }
};

export default function registerClawSeatbelt(api: OpenClawPluginApiLike): void {
  void clawSeatbeltPluginDefinition.register(api);
}
