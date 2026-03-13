export const CLAWSEATBELT_PLUGIN_ID = "clawseatbelt";
export const CLAWSEATBELT_PLUGIN_NAME = "ClawSeatbelt";
export const CLAWSEATBELT_PLUGIN_VERSION = "0.1.0";
export const CLAWSEATBELT_REPOSITORY_URL = "https://github.com/cschanhniem/ClawSeatbelt";

export function buildPinnedInstallCommand(version = CLAWSEATBELT_PLUGIN_VERSION): string {
  return `openclaw plugins install ${CLAWSEATBELT_PLUGIN_ID}@${version}`;
}
