/**
 * CAE-11.1-W4 — Lifecycle UI actions (display only; server reauthorizes)
 */
import type { InitiativeAggregate } from "../data-model";
import { INITIATIVE_PERMISSIONS } from "../services/commands";
import type { InitiativeCommandType } from "../services/commands";
import { validateTransition } from "../state-machine";
import type { InitiativeExperienceContext } from "./experience-context";
import type { InitiativeUiAction } from "./view-models";

type ActionDef = {
  command: InitiativeCommandType;
  label: string;
  description: string;
  targetStatus?: string;
  requires_confirmation?: boolean;
  impact?: string;
};

const LIFECYCLE_ACTIONS: Partial<Record<string, ActionDef[]>> = {
  concept: [
    { command: "UpdateInitiativeDraftCommand", label: "Continue Discovery", description: "Save charter and discovery notes.", requires_confirmation: false },
    { command: "SubmitInitiativeForReviewCommand", label: "Submit for Review", description: "Send the charter for institutional review. Submission does not authorize execution.", requires_confirmation: true, impact: "Moves the Initiative toward approval review." },
  ],
  discovery: [
    { command: "SubmitInitiativeForReviewCommand", label: "Submit for Review", description: "Send the charter for institutional review.", requires_confirmation: true },
  ],
  design: [
    { command: "SubmitInitiativeForReviewCommand", label: "Submit for Review", description: "Send the charter for institutional review.", requires_confirmation: true },
  ],
  approval_pending: [
    { command: "ApproveInitiativeCommand", label: "Approve Initiative", description: "Approve this charter version.", requires_confirmation: true, impact: "Approves the Initiative but does not activate it." },
    { command: "ReturnInitiativeForRevisionCommand", label: "Return for Revision", description: "Send the charter back for changes.", requires_confirmation: true },
  ],
  approved: [
    { command: "StartPreparationCommand", label: "Begin Preparation", description: "Move into preparation once owners are ready.", requires_confirmation: true },
  ],
  preparation: [
    { command: "ActivateInitiativeCommand", label: "Activate Initiative", description: "Begin authorized execution.", requires_confirmation: true, impact: "Opens workstreams and starts the review rhythm." },
  ],
  active: [
    { command: "MarkInitiativeAtRiskCommand", label: "Mark at Risk", description: "Flag a risk without pausing all work.", requires_confirmation: true },
    { command: "PauseInitiativeCommand", label: "Pause Initiative", description: "Pause execution under governance.", requires_confirmation: true },
    { command: "BeginInitiativeCloseoutCommand", label: "Begin Closeout", description: "End active execution and prepare completion.", requires_confirmation: true },
    { command: "RequestScopeChangeCommand", label: "Request a Scope Change", description: "Propose a governed scope change.", requires_confirmation: true },
    { command: "TransferOperationalOwnershipCommand", label: "Transfer Ownership", description: "Start an ownership transfer.", requires_confirmation: true },
  ],
  at_risk: [
    { command: "ClearInitiativeRiskCommand", label: "Clear Risk", description: "Mark the risk as addressed.", requires_confirmation: true },
    { command: "PauseInitiativeCommand", label: "Pause Initiative", description: "Pause execution.", requires_confirmation: true },
  ],
  paused: [
    { command: "ResumeInitiativeCommand", label: "Resume Initiative", description: "Return to active execution after review.", requires_confirmation: true },
  ],
  closing: [
    { command: "CompleteInitiativeCommand", label: "Complete Initiative", description: "Finalize with an honest completion classification.", requires_confirmation: true },
  ],
  completed: [
    { command: "ArchiveInitiativeCommand", label: "Archive Initiative", description: "Make the Initiative read-only for ordinary work.", requires_confirmation: true },
    { command: "CreateSuccessorInitiativeCommand", label: "Create Successor Initiative", description: "Start new work with a new Initiative identity.", requires_confirmation: true },
  ],
  archived: [
    { command: "RestoreInitiativeCommand", label: "Request Restoration", description: "Limited continuation under a still-valid charter only.", requires_confirmation: true },
  ],
  owner_required: [
    { command: "TransferOperationalOwnershipCommand", label: "Assign Operational Owner", description: "Nominate a new accountable owner.", requires_confirmation: true },
  ],
};

function hasPermission(command: InitiativeCommandType, permissions: string[]): boolean {
  const key = INITIATIVE_PERMISSIONS[command];
  return permissions.includes(key) || permissions.includes("civic_action.manage");
}

export function resolveLifecycleActions(
  aggregate: InitiativeAggregate,
  ctx: InitiativeExperienceContext
): InitiativeUiAction[] {
  const status = aggregate.initiative.status;
  const defs = LIFECYCLE_ACTIONS[status] ?? [];
  const archived = aggregate.initiative.is_archived || status === "archived";

  return defs.map((def) => {
    const permitted = hasPermission(def.command, ctx.permissions);
    let available = permitted && !archived;
    let blocked = !permitted ? "You do not have authority for this action." : undefined;

    if (def.command === "ActivateInitiativeCommand" && status === "preparation") {
      const t = validateTransition("preparation", "active");
      if (!t.allowed) {
        available = false;
        blocked = t.reason ?? "Readiness requirements are not met.";
      }
    }

    if (status === "archived" && def.command !== "RestoreInitiativeCommand") {
      available = false;
      blocked = "Archived Initiatives are read-only.";
    }

    return {
      action_key: def.command,
      label: def.label,
      description: def.description,
      available,
      blocked_reason_optional: blocked,
      requires_confirmation: def.requires_confirmation ?? true,
      requires_step_up_authentication: def.command === "ActivateInitiativeCommand" || def.command === "ApproveInitiativeCommand",
      impact_summary: def.impact,
      endpoint_or_command: "/api/v1/initiatives/commands",
      permission_key: INITIATIVE_PERMISSIONS[def.command],
      requirement_ids: ["CAE-11.1-W4-UX-004", "CAE-11.1-W4-LIF-001"],
    };
  });
}
