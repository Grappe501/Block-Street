/**
 * CAE-11.1-W5 — Role-aware Initiative view assembly
 */
import type { InitiativeAggregate } from "../data-model";
import { resolveExperienceRole, humanLabel } from "../ux/experience-context";
import { lifecycleLabel } from "../ux/status-labels";
import { resolveLifecycleActions } from "../ux/ui-actions";
import type { InitiativeApiContext, InitiativeView, InitiativeViewLevel } from "./contracts";
import { toExperienceContext } from "./context";

function roleToViewLevel(role: string): InitiativeViewLevel {
  if (role === "administrator") return "administrator";
  if (role === "approver") return "approver";
  if (role === "operational_owner" || role === "executive_owner") return "owner";
  if (role === "auditor") return "auditor";
  if (role === "participant" || role === "contributor") return "participant";
  return "member";
}

export function assembleInitiativeView(agg: InitiativeAggregate, apiCtx: InitiativeApiContext): InitiativeView {
  const exp = toExperienceContext(apiCtx);
  const ini = agg.initiative;
  const role = resolveExperienceRole(
    apiCtx.actor_human_id,
    ini.operational_owner_human_id,
    ini.executive_owner_human_id,
    apiCtx.effective_permissions
  );
  const viewLevel = roleToViewLevel(role);
  const actions = resolveLifecycleActions(agg, exp);
  const purpose = agg.charter?.purpose || agg.charter?.problem_statement || "Purpose not yet defined.";
  const isPublic = ini.visibility === "member_public" && viewLevel === "member";

  return {
    id: ini.initiative_id,
    name: ini.initiative_name,
    public_name: isPublic ? ini.initiative_name : null,
    slug: ini.initiative_slug || ini.initiative_id,
    type: ini.initiative_type,
    status: ini.status,
    status_label: lifecycleLabel(ini.status),
    governance_class: ini.governance_class,
    visibility: ini.visibility,
    governing_institution_id: ini.institution_id,
    portfolio_category: ini.portfolio_category ?? null,
    purpose_summary: purpose.slice(0, 280),
    public_description: isPublic ? purpose.slice(0, 500) : null,
    operational_owner_summary:
      viewLevel === "member" && isPublic ? null : humanLabel(ini.operational_owner_human_id),
    executive_owner_summary:
      ini.executive_owner_human_id && viewLevel !== "member"
        ? humanLabel(ini.executive_owner_human_id)
        : null,
    scope_summary: agg.scope?.functional_scope ?? null,
    timeline_summary: agg.timeline
      ? [
          agg.timeline.activation_date && `Activation: ${agg.timeline.activation_date}`,
          agg.timeline.target_completion_date && `Target end: ${agg.timeline.target_completion_date}`,
        ]
          .filter(Boolean)
          .join(" · ") || null
      : null,
    readiness_summary: null,
    current_charter_version: agg.charter?.version ?? null,
    created_at: ini.created_at,
    updated_at: ini.updated_at,
    view_level: viewLevel,
    permissions: apiCtx.effective_permissions,
    available_actions: actions.filter((a) => a.available).map((a) => a.action_key),
    next_required_actions: actions.filter((a) => a.available).slice(0, 3).map((a) => a.label),
  };
}
