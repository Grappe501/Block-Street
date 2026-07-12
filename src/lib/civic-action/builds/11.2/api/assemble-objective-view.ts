/**
 * CAE-11.2-W5 — Role-aware Objective view assembly
 */
import type { ObjectiveRecord } from "../data-model";
import { humanLabel, resolveObjectiveExperienceRole } from "../ux/experience-context";
import { objectiveHealthLabel, objectiveStatusLabel, objectiveTypeLabel } from "../ux/status-labels";
import { resolveObjectiveLifecycleActions } from "../ux/ui-actions";
import type { ObjectiveApiContext, ObjectiveView, ObjectiveViewLevel } from "./contracts";
import { toExperienceContext } from "./context";

function roleToViewLevel(role: string): ObjectiveViewLevel {
  if (role === "administrator") return "administrator";
  if (role === "executive_owner") return "executive";
  if (role === "operational_owner") return "owner";
  if (role === "contributor" || role === "volunteer") return "contributor";
  if (role === "viewer") return "member";
  return "member";
}

export function assembleObjectiveView(objective: ObjectiveRecord, apiCtx: ObjectiveApiContext): ObjectiveView {
  const exp = toExperienceContext(apiCtx);
  const role = resolveObjectiveExperienceRole(
    apiCtx.actor_human_id,
    objective.executive_owner_human_id,
    objective.operational_owner_human_id,
    apiCtx.effective_permissions
  );
  const viewLevel = roleToViewLevel(role);
  const actions = resolveObjectiveLifecycleActions(objective, exp);
  const progress =
    objective.lifecycle_state === "active" || objective.lifecycle_state === "on_track" ? 57 : null;

  return {
    id: objective.canonical_id,
    initiative_id: objective.initiative_id,
    institution_id: objective.institution_id,
    display_name: objective.display_name,
    objective_type: objective.objective_type,
    type_label: objectiveTypeLabel(objective.objective_type),
    lifecycle_state: objective.lifecycle_state,
    status_label: objectiveStatusLabel(objective.lifecycle_state, apiCtx.locale),
    health_label: objectiveHealthLabel(objective.lifecycle_state, apiCtx.locale),
    purpose_summary: objective.purpose.slice(0, 280),
    desired_future_state: objective.desired_future_state,
    current_state: objective.current_state,
    executive_owner_summary: viewLevel === "member" ? null : humanLabel(objective.executive_owner_human_id),
    operational_owner_summary: humanLabel(objective.operational_owner_human_id),
    progress_percent: progress,
    created_at: objective.created_at,
    updated_at: objective.updated_at,
    view_level: viewLevel,
    permissions: apiCtx.effective_permissions,
    available_actions: actions.filter((a) => a.available).map((a) => a.action_key),
    next_required_actions: actions.filter((a) => !a.available && a.blocked_reason_optional).map((a) => a.label),
  };
}
