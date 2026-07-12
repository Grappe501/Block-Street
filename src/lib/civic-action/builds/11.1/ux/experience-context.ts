/**
 * CAE-11.1-W4 — Experience context (Wave 5 will replace with session auth)
 */
import type { InitiativeExperienceRole } from "./view-models";

export type InitiativeExperienceContext = {
  actor_human_id: string;
  institution_id: string;
  institution_name: string;
  active_membership_id: string;
  permissions: string[];
  locale: "en" | "es";
};

export const DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT: InitiativeExperienceContext = {
  actor_human_id: "usr-001",
  institution_id: "inst-block-street",
  institution_name: "Block Street",
  active_membership_id: "mem-001",
  permissions: [
    "civic_action.manage",
    "initiative.draft.create",
    "initiative.draft.edit",
    "initiative.review.submit",
    "initiative.approve",
    "initiative.activate",
    "initiative.pause",
    "initiative.resume",
    "initiative.risk.set",
    "initiative.scope.request_change",
    "initiative.owner.transfer",
    "initiative.dependency.manage",
    "initiative.closeout.begin",
    "initiative.complete",
    "initiative.archive",
  ],
  locale: "en",
};

export function resolveExperienceRole(
  actorHumanId: string,
  operationalOwnerId: string,
  executiveOwnerId: string,
  permissions: string[]
): InitiativeExperienceRole {
  if (permissions.includes("initiative.admin.configure")) return "administrator";
  if (actorHumanId === operationalOwnerId) return "operational_owner";
  if (actorHumanId === executiveOwnerId) return "executive_owner";
  if (permissions.includes("initiative.approve")) return "approver";
  if (permissions.includes("civic_action.view")) return "viewer";
  return "participant";
}

export function humanLabel(humanId: string): string {
  if (!humanId) return "Unassigned";
  if (humanId === "usr-001") return "Steve Grappe";
  if (humanId === "usr-002") return "Maria Lopez";
  return humanId.replace(/^usr-/, "Member ");
}
