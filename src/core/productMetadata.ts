export const CLAWSEATBELT_PLUGIN_ID = "clawseatbelt";
export const CLAWSEATBELT_PLUGIN_NAME = "ClawSeatbelt";
export const CLAWSEATBELT_PLUGIN_VERSION = "0.1.3";
export const CLAWSEATBELT_REPOSITORY_URL = "https://github.com/cschanhniem/ClawSeatbelt";

export const CLAWSEATBELT_COMMANDS = {
  status: {
    canonical: "clawseatbelt-status",
    telegram: "csb_status"
  },
  mode: {
    canonical: "clawseatbelt-mode",
    telegram: "csb_mode"
  },
  scan: {
    canonical: "clawseatbelt-scan",
    telegram: "csb_scan"
  },
  explain: {
    canonical: "clawseatbelt-explain",
    telegram: "csb_explain"
  },
  proofpack: {
    canonical: "clawseatbelt-proofpack",
    telegram: "csb_proof"
  },
  answer: {
    canonical: "clawseatbelt-answer",
    telegram: "csb_answer"
  },
  challenge: {
    canonical: "clawseatbelt-challenge",
    telegram: "csb_check"
  }
} as const;

export type ClawSeatbeltCommandKey = keyof typeof CLAWSEATBELT_COMMANDS;

export function resolveCommandName(key: ClawSeatbeltCommandKey, channel?: string): string {
  return channel?.toLowerCase() === "telegram"
    ? CLAWSEATBELT_COMMANDS[key].telegram
    : CLAWSEATBELT_COMMANDS[key].canonical;
}

export function buildSlashCommand(key: ClawSeatbeltCommandKey, channel?: string): string {
  return `/${resolveCommandName(key, channel)}`;
}

export function buildPinnedInstallCommand(version = CLAWSEATBELT_PLUGIN_VERSION): string {
  return `openclaw plugins install ${CLAWSEATBELT_PLUGIN_ID}@${version}`;
}
