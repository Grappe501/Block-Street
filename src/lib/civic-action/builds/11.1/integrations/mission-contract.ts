/**
 * CAE-11.1-W5 — Downstream mission/workstream contract (Build 11.3)
 */
export type InitiativeMissionGuardResult =
  | { allowed: true }
  | { allowed: false; reason: string; code: string };

export const INITIATIVE_MISSION_CONTRACT_VERSION = "11.3-handoff-1";

export function evaluateInitiativeMissionGuard(input: {
  status: string;
  owner_required: boolean;
  closing: boolean;
  archived: boolean;
  paused: boolean;
}): InitiativeMissionGuardResult {
  if (input.archived) return { allowed: false, reason: "Initiative is archived.", code: "INITIATIVE_ARCHIVED" };
  if (input.paused) return { allowed: false, reason: "Initiative is paused.", code: "INITIATIVE_PAUSED" };
  if (input.closing) return { allowed: false, reason: "Initiative is closing.", code: "INITIATIVE_CLOSING" };
  if (input.owner_required) return { allowed: false, reason: "Operational owner is required.", code: "OWNER_REQUIRED" };
  if (!["active", "preparation"].includes(input.status)) {
    return { allowed: false, reason: "Initiative is not in an execution-ready state.", code: "NOT_EXECUTION_READY" };
  }
  return { allowed: true };
}
