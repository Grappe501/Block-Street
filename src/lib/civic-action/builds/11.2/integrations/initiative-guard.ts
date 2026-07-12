/**
 * CAE-11.2-W5 — Upstream initiative guard (Build 11.1 contract)
 */
import { initiativeApplicationService } from "../../11.1/services/application-service";

export type InitiativeObjectiveGuardResult = {
  allowed: boolean;
  code?: string;
  message?: string;
};

export function evaluateInitiativeObjectiveGuard(initiativeId: string): InitiativeObjectiveGuardResult {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) {
    return { allowed: false, code: "INITIATIVE_NOT_FOUND", message: "Parent Initiative not found." };
  }
  const status = agg.initiative.status;
  if (status === "archived" || status === "cancelled") {
    return { allowed: false, code: "INITIATIVE_INACTIVE", message: "Parent Initiative is not active for execution." };
  }
  if (status === "paused") {
    return { allowed: false, code: "INITIATIVE_PAUSED", message: "Parent Initiative is paused." };
  }
  return { allowed: true };
}

export const OBJECTIVE_INITIATIVE_CONTRACT_VERSION = "11.1-handoff-1";
