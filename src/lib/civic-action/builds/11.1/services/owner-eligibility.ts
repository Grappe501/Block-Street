/**
 * CAE-11.1-W3 — Ownership eligibility engine
 */
import { getUserById } from "@/lib/auth/engine";
import { isServiceOrAiIdentity } from "./policy";

export type OwnerRole = "executive_owner" | "operational_owner" | "backup_owner";

export interface InitiativeOwnerEligibility {
  human_id: string;
  institution_id: string;
  initiative_id: string;
  owner_role: OwnerRole;
  eligible: boolean;
  reason_codes: string[];
  membership_status: string;
}

export function checkOwnerEligibility(
  humanId: string,
  institutionId: string,
  initiativeId: string,
  role: OwnerRole,
  primaryOperationalOwnerId?: string
): InitiativeOwnerEligibility {
  const reason_codes: string[] = [];

  if (isServiceOrAiIdentity(humanId)) {
    reason_codes.push("SERVICE_OR_AI_IDENTITY");
  }

  const user = getUserById(humanId);
  if (!user) reason_codes.push("HUMAN_NOT_FOUND");
  else if (user.account_status === "suspended") reason_codes.push("ACCOUNT_SUSPENDED");

  if (role === "backup_owner" && primaryOperationalOwnerId && humanId === primaryOperationalOwnerId) {
    reason_codes.push("BACKUP_CANNOT_BE_PRIMARY");
  }

  if (!humanId.startsWith("usr-") && !humanId.startsWith("human-")) {
    if (!reason_codes.includes("SERVICE_OR_AI_IDENTITY")) reason_codes.push("NON_CANONICAL_HUMAN_ID");
  }

  return {
    human_id: humanId,
    institution_id: institutionId,
    initiative_id: initiativeId,
    owner_role: role,
    eligible: reason_codes.length === 0,
    reason_codes,
    membership_status: user ? "active" : "unknown",
  };
}

export function detectOwnerEligibilityLoss(
  executiveOwnerId: string,
  operationalOwnerId: string
): { owner_required: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const exec = checkOwnerEligibility(executiveOwnerId, "", "", "executive_owner");
  const ops = checkOwnerEligibility(operationalOwnerId, "", "", "operational_owner");
  if (!exec.eligible) reasons.push(...exec.reason_codes.map((r) => `executive:${r}`));
  if (!ops.eligible) reasons.push(...ops.reason_codes.map((r) => `operational:${r}`));
  return { owner_required: !ops.eligible, reasons };
}
