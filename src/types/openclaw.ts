export type OpenClawConfigLike = Record<string, unknown>;

export interface ReplyPayload {
  text?: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
  audioAsVoice?: boolean;
  isError?: boolean;
  isReasoning?: boolean;
  channelData?: Record<string, unknown>;
}

export interface PluginCommandContext {
  senderId?: string;
  channel: string;
  channelId?: string;
  isAuthorizedSender: boolean;
  args?: string;
  commandBody: string;
  config: OpenClawConfigLike;
  from?: string;
  to?: string;
  accountId?: string;
  messageThreadId?: number;
}

export interface OpenClawPluginCommandDefinition {
  name: string;
  nativeNames?: Partial<Record<string, string>> & { default?: string };
  description: string;
  acceptsArgs?: boolean;
  requireAuth?: boolean;
  handler: (ctx: PluginCommandContext) => ReplyPayload | Promise<ReplyPayload>;
}

export interface PluginLogger {
  debug?: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export interface OpenClawPluginServiceContext {
  config: OpenClawConfigLike;
  workspaceDir?: string;
  stateDir: string;
  logger: PluginLogger;
}

export interface OpenClawPluginService {
  id: string;
  start: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
  stop?: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
}

export interface PluginHookAgentContext {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  messageProvider?: string;
  trigger?: string;
  channelId?: string;
}

export interface PluginHookBeforePromptBuildEvent {
  prompt: string;
  messages: unknown[];
}

export interface PluginHookBeforePromptBuildResult {
  systemPrompt?: string;
  prependContext?: string;
  prependSystemContext?: string;
  appendSystemContext?: string;
}

export interface PluginHookMessageContext {
  channelId: string;
  accountId?: string;
  conversationId?: string;
}

export interface PluginHookMessageReceivedEvent {
  from: string;
  content: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface PluginHookMessageSendingEvent {
  to: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface PluginHookMessageSendingResult {
  content?: string;
  cancel?: boolean;
}

export interface PluginHookToolContext {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  toolName: string;
  toolCallId?: string;
}

export interface PluginHookBeforeToolCallEvent {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
}

export interface PluginHookBeforeToolCallResult {
  params?: Record<string, unknown>;
  block?: boolean;
  blockReason?: string;
}

export interface PluginHookToolResultPersistContext {
  agentId?: string;
  sessionKey?: string;
  toolName?: string;
  toolCallId?: string;
}

export interface PluginHookToolResultPersistEvent {
  toolName?: string;
  toolCallId?: string;
  message: unknown;
  isSynthetic?: boolean;
}

export interface PluginHookToolResultPersistResult {
  message?: unknown;
}

export type PluginHookName =
  | "before_prompt_build"
  | "message_received"
  | "message_sending"
  | "before_tool_call"
  | "tool_result_persist"
  | "gateway_start"
  | "gateway_stop";

export interface PluginHookHandlerMap {
  before_prompt_build: (
    event: PluginHookBeforePromptBuildEvent,
    ctx: PluginHookAgentContext
  ) =>
    | PluginHookBeforePromptBuildResult
    | void
    | Promise<PluginHookBeforePromptBuildResult | void>;
  message_received: (
    event: PluginHookMessageReceivedEvent,
    ctx: PluginHookMessageContext
  ) => void | Promise<void>;
  message_sending: (
    event: PluginHookMessageSendingEvent,
    ctx: PluginHookMessageContext
  ) =>
    | PluginHookMessageSendingResult
    | void
    | Promise<PluginHookMessageSendingResult | void>;
  before_tool_call: (
    event: PluginHookBeforeToolCallEvent,
    ctx: PluginHookToolContext
  ) =>
    | PluginHookBeforeToolCallResult
    | void
    | Promise<PluginHookBeforeToolCallResult | void>;
  tool_result_persist: (
    event: PluginHookToolResultPersistEvent,
    ctx: PluginHookToolResultPersistContext
  ) => PluginHookToolResultPersistResult | void;
  gateway_start: () => void | Promise<void>;
  gateway_stop: () => void | Promise<void>;
}

export interface PluginConfigUiHint {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
}

export interface PluginConfigValidation {
  ok: boolean;
  value?: unknown;
  errors?: string[];
}

export interface OpenClawPluginConfigSchema {
  validate?: (value: unknown) => PluginConfigValidation;
  uiHints?: Record<string, PluginConfigUiHint>;
  jsonSchema?: Record<string, unknown>;
}

export interface OpenClawPluginApiLike {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  config: OpenClawConfigLike;
  pluginConfig?: Record<string, unknown>;
  logger: PluginLogger;
  resolvePath: (input: string) => string;
  registerCommand: (command: OpenClawPluginCommandDefinition) => void;
  registerService: (service: OpenClawPluginService) => void;
  on: <K extends PluginHookName>(
    hookName: K,
    handler: PluginHookHandlerMap[K],
    opts?: { priority?: number }
  ) => void;
}

export interface OpenClawPluginDefinitionLike {
  id: string;
  name: string;
  description: string;
  version?: string;
  configSchema?: OpenClawPluginConfigSchema;
  register: (api: OpenClawPluginApiLike) => void | Promise<void>;
}
