import { resolve } from "node:path";
import type {
  OpenClawPluginApiLike,
  OpenClawPluginCommandDefinition,
  OpenClawPluginService,
  PluginHookHandlerMap,
  PluginHookName
} from "../../src/types/openclaw.js";

export interface MockApi extends OpenClawPluginApiLike {
  commands: OpenClawPluginCommandDefinition[];
  services: OpenClawPluginService[];
  hooks: {
    [K in PluginHookName]?: PluginHookHandlerMap[K][];
  };
}

export function createMockApi(options?: {
  pluginConfig?: Record<string, unknown>;
  config?: Record<string, unknown>;
}): MockApi {
  const commands: OpenClawPluginCommandDefinition[] = [];
  const services: OpenClawPluginService[] = [];
  const hooks: MockApi["hooks"] = {};

  return {
    id: "clawshield-local",
    name: "ClawShield Local",
    source: "test",
    config: options?.config ?? {},
    pluginConfig: options?.pluginConfig,
    logger: {
      info() {},
      warn() {},
      error() {}
    },
    resolvePath(input: string) {
      return resolve(process.cwd(), input);
    },
    registerCommand(command) {
      commands.push(command);
    },
    registerService(service) {
      services.push(service);
    },
    on(hookName, handler) {
      const list = hooks[hookName] ?? [];
      list.push(handler as never);
      hooks[hookName] = list;
    },
    commands,
    services,
    hooks
  };
}
