import type { RuntimeMode } from "../core/config.js";
import type { PostureSummary } from "../types/domain.js";

export const CLAWSEATBELT_STATUS_COMMAND = "/clawseatbelt-status";
export const CLAWSEATBELT_CHALLENGE_COMMAND = "/clawseatbelt-challenge";
export const CLAWSEATBELT_SHARE_CHAT_COMMAND = "/clawseatbelt-proofpack --target chat --audience public";

function resolveActivationCommand(summary: PostureSummary): string {
  return summary.findings.length > 0 ? CLAWSEATBELT_STATUS_COMMAND : CLAWSEATBELT_CHALLENGE_COMMAND;
}

export function renderActivationBrief(summary: PostureSummary, mode: RuntimeMode): string {
  return [
    "ClawSeatbelt activation brief:",
    "In this reply only, end with one short paragraph for the operator.",
    `Tell them ClawSeatbelt is active in ${mode} mode.`,
    `Use this posture summary once: ${summary.shareMessage}`,
    `Primary next step: ${resolveActivationCommand(summary)}.`,
    `Share-safe follow-up: ${CLAWSEATBELT_SHARE_CHAT_COMMAND}.`,
    "Keep the note under 55 words and do not repeat it unless the operator asks about ClawSeatbelt or security posture."
  ].join(" ");
}

export function renderStatusNextStep(): string {
  return `Next: Run ${CLAWSEATBELT_CHALLENGE_COMMAND} for first proof. Use ${CLAWSEATBELT_SHARE_CHAT_COMMAND} when you want a share-safe receipt.`;
}

export function renderChallengeNextStep(): string {
  return `Next: Run ${CLAWSEATBELT_STATUS_COMMAND} for live posture. Use ${CLAWSEATBELT_SHARE_CHAT_COMMAND} when you want a share-safe receipt.`;
}
