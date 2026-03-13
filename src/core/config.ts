import type { OpenClawPluginConfigSchema } from "../types/openclaw.js";

export type RuntimeMode = "observe" | "enforce" | "quiet";

export interface ClawSeatbeltConfig {
  mode: RuntimeMode;
  activationBriefEnabled: boolean;
  warnThreshold: number;
  holdThreshold: number;
  throttleWindowMs: number;
  cacheSize: number;
  incidentTtlMs: number;
  maxDigestFindings: number;
  dangerousToolPatterns: string[];
}

export const defaultClawSeatbeltConfig: ClawSeatbeltConfig = {
  mode: "observe",
  activationBriefEnabled: true,
  warnThreshold: 30,
  holdThreshold: 60,
  throttleWindowMs: 5 * 60 * 1000,
  cacheSize: 256,
  incidentTtlMs: 24 * 60 * 60 * 1000,
  maxDigestFindings: 5,
  dangerousToolPatterns: ["exec", "shell", "bash", "terminal", "computer", "browser"]
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNumber(
  source: Record<string, unknown>,
  key: keyof ClawSeatbeltConfig,
  errors: string[]
): number | undefined {
  const value = source[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    errors.push(`${String(key)} must be a number`);
    return undefined;
  }
  return value;
}

function readBoolean(
  source: Record<string, unknown>,
  key: keyof ClawSeatbeltConfig,
  errors: string[]
): boolean | undefined {
  const value = source[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    errors.push(`${String(key)} must be a boolean`);
    return undefined;
  }
  return value;
}

export function validateClawSeatbeltConfig(value: unknown): { ok: true; value: ClawSeatbeltConfig } | { ok: false; errors: string[] } {
  if (value === undefined) {
    return {
      ok: true,
      value: {
        ...defaultClawSeatbeltConfig,
        dangerousToolPatterns: [...defaultClawSeatbeltConfig.dangerousToolPatterns]
      }
    };
  }

  if (!isObject(value)) {
    return { ok: false, errors: ["plugin config must be an object"] };
  }

  const errors: string[] = [];
  const next: ClawSeatbeltConfig = {
    ...defaultClawSeatbeltConfig,
    dangerousToolPatterns: [...defaultClawSeatbeltConfig.dangerousToolPatterns]
  };

  if (value.mode !== undefined) {
    if (value.mode === "observe" || value.mode === "enforce" || value.mode === "quiet") {
      next.mode = value.mode;
    } else {
      errors.push("mode must be one of observe, enforce, or quiet");
    }
  }

  const activationBriefEnabled = readBoolean(value, "activationBriefEnabled", errors);
  const warnThreshold = readNumber(value, "warnThreshold", errors);
  const holdThreshold = readNumber(value, "holdThreshold", errors);
  const throttleWindowMs = readNumber(value, "throttleWindowMs", errors);
  const cacheSize = readNumber(value, "cacheSize", errors);
  const incidentTtlMs = readNumber(value, "incidentTtlMs", errors);
  const maxDigestFindings = readNumber(value, "maxDigestFindings", errors);

  if (activationBriefEnabled !== undefined) {
    next.activationBriefEnabled = activationBriefEnabled;
  }
  if (warnThreshold !== undefined) {
    next.warnThreshold = warnThreshold;
  }
  if (holdThreshold !== undefined) {
    next.holdThreshold = holdThreshold;
  }
  if (throttleWindowMs !== undefined) {
    next.throttleWindowMs = throttleWindowMs;
  }
  if (cacheSize !== undefined) {
    next.cacheSize = cacheSize;
  }
  if (incidentTtlMs !== undefined) {
    next.incidentTtlMs = incidentTtlMs;
  }
  if (maxDigestFindings !== undefined) {
    next.maxDigestFindings = maxDigestFindings;
  }

  if (value.dangerousToolPatterns !== undefined) {
    if (
      Array.isArray(value.dangerousToolPatterns) &&
      value.dangerousToolPatterns.every((entry) => typeof entry === "string" && entry.length > 0)
    ) {
      next.dangerousToolPatterns = [...value.dangerousToolPatterns];
    } else {
      errors.push("dangerousToolPatterns must be a non-empty string array");
    }
  }

  if (next.warnThreshold < 0 || next.warnThreshold > 100) {
    errors.push("warnThreshold must be between 0 and 100");
  }
  if (next.holdThreshold < 1 || next.holdThreshold > 100) {
    errors.push("holdThreshold must be between 1 and 100");
  }
  if (next.warnThreshold >= next.holdThreshold) {
    errors.push("warnThreshold must be lower than holdThreshold");
  }
  if (next.throttleWindowMs < 0) {
    errors.push("throttleWindowMs must be zero or greater");
  }
  if (next.cacheSize < 1) {
    errors.push("cacheSize must be at least 1");
  }
  if (next.incidentTtlMs < 60_000) {
    errors.push("incidentTtlMs must be at least 60000");
  }
  if (next.maxDigestFindings < 1 || next.maxDigestFindings > 20) {
    errors.push("maxDigestFindings must be between 1 and 20");
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: next };
}

export const clawSeatbeltConfigSchema: OpenClawPluginConfigSchema = {
  validate(value) {
    const parsed = validateClawSeatbeltConfig(value);
    return parsed.ok ? { ok: true, value: parsed.value } : { ok: false, errors: parsed.errors };
  },
  uiHints: {
    mode: {
      label: "Runtime Mode",
      help: "observe adds guidance, enforce blocks risky tool calls, quiet minimizes prompt friction"
    },
    activationBriefEnabled: {
      label: "Activation Brief",
      help: "Show one short first-session trust brief in the next assistant reply after install or restart",
      advanced: true
    },
    warnThreshold: {
      label: "Warn Threshold",
      help: "Score that starts operator-visible caution behavior",
      advanced: true
    },
    holdThreshold: {
      label: "Hold Threshold",
      help: "Score that enables hold or block behavior in enforce mode",
      advanced: true
    },
    throttleWindowMs: {
      label: "Throttle Window",
      help: "Suppress duplicate warnings for the same conversation within this window",
      advanced: true
    },
    dangerousToolPatterns: {
      label: "Dangerous Tools",
      help: "Tool names that ClawSeatbelt treats as high-impact when a session is risky",
      advanced: true
    }
  },
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: { type: "string", enum: ["observe", "enforce", "quiet"], default: "observe" },
      activationBriefEnabled: { type: "boolean", default: true },
      warnThreshold: { type: "number", minimum: 0, maximum: 100, default: 30 },
      holdThreshold: { type: "number", minimum: 1, maximum: 100, default: 60 },
      throttleWindowMs: { type: "number", minimum: 0, default: 300000 },
      cacheSize: { type: "number", minimum: 1, default: 256 },
      incidentTtlMs: { type: "number", minimum: 60000, default: 86400000 },
      maxDigestFindings: { type: "number", minimum: 1, maximum: 20, default: 5 },
      dangerousToolPatterns: {
        type: "array",
        items: { type: "string" },
        default: defaultClawSeatbeltConfig.dangerousToolPatterns
      }
    }
  }
};
