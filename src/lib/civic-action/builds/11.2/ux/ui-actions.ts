/**
 * CAE-11.2-W4 — Objective lifecycle UI actions (display only)
 */
import type { ObjectiveRecord } from "../data-model";
import { EXECUTION_PERMISSIONS } from "../services/commands";
import type { ExecutionCommandType } from "../services/commands";
import { isObjectiveTransitionAllowed } from "../state-machines";
import type { ObjectiveExperienceContext } from "./experience-context";
import type { ObjectiveUiAction } from "./view-models";

const LIFECYCLE_ACTIONS: Partial<Record<string, { command: ExecutionCommandType; label: string; description: string; target: string }[]>> = {
  draft: [
    { command: "ProposeObjective", label: "Propose for Review", description: "Send this Objective for institutional review.", target: "proposed" },
  ],
  proposed: [
    { command: "ApproveObjective", label: "Approve Objective", description: "Approve this Objective for execution planning.", target: "approved" },
  ],
  approved: [
    { command: "ActivateObjective", label: "Activate Objective", description: "Begin authorized execution under this Objective.", target: "active" },
  ],
  active: [
    { command: "ArchiveObjective", label: "Archive Objective", description: "Make this Objective read-only when work is complete.", target: "archived" },
  ],
  on_track: [
    { command: "ArchiveObjective", label: "Archive Objective", description: "Archive when outcomes are recorded.", target: "archived" },
  ],
  needs_attention: [
    { command: "ActivateObjective", label: "Return to Active", description: "Resume active execution after addressing issues.", target: "active" },
  ],
  at_risk: [
    { command: "ActivateObjective", label: "Stabilize Objective", description: "Mark as actively managed after risk review.", target: "active" },
  ],
  completed: [
    { command: "ArchiveObjective", label: "Archive Objective", description: "Preserve as institutional memory.", target: "archived" },
  ],
};

function hasPermission(command: ExecutionCommandType, permissions: string[]): boolean {
  const key = EXECUTION_PERMISSIONS[command];
  return permissions.includes(key) || permissions.includes("civic_action.manage");
}

export function resolveObjectiveLifecycleActions(
  objective: ObjectiveRecord,
  ctx: ObjectiveExperienceContext
): ObjectiveUiAction[] {
  const defs = LIFECYCLE_ACTIONS[objective.lifecycle_state] ?? [];
  return defs.map((def) => {
    const allowed = isObjectiveTransitionAllowed(objective.lifecycle_state, def.target as never);
    const permitted = hasPermission(def.command, ctx.permissions);
    return {
      action_key: def.command,
      label: def.label,
      description: def.description,
      available: allowed && permitted,
      blocked_reason_optional: !allowed ? "Lifecycle step not available" : !permitted ? "You do not have authority" : undefined,
      requires_confirmation: true,
      endpoint_or_command: "/api/v1/civic-action/objectives/commands",
      permission_key: EXECUTION_PERMISSIONS[def.command],
    };
  });
}
