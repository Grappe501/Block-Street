/**
 * CAE-11.2-W4 — Objective portfolio assembler
 */
import { objectiveApplicationService } from "../application-service";
import type { ObjectiveExperienceContext } from "./experience-context";
import { t } from "./locale";
import { objectiveHealthLabel, objectiveStatusLabel, objectiveTypeLabel } from "./status-labels";
import { resolveObjectiveExperienceRole } from "./experience-context";
import type { ObjectivePortfolioView } from "./view-models";

export function assembleObjectivePortfolio(
  initiativeId: string,
  ctx: ObjectiveExperienceContext
): ObjectivePortfolioView {
  const objectives = objectiveApplicationService.listAllObjectivesByInitiative(initiativeId);
  const base = `/initiatives/${initiativeId}/objectives`;

  const cards = objectives.map((o) => {
    const role = resolveObjectiveExperienceRole(
      ctx.actor_human_id,
      o.executive_owner_human_id,
      o.operational_owner_human_id,
      ctx.permissions
    );
    return {
      objective_id: o.canonical_id,
      display_name: o.display_name,
      objective_type: o.objective_type,
      type_label: objectiveTypeLabel(o.objective_type),
      lifecycle_state: o.lifecycle_state,
      status_label: objectiveStatusLabel(o.lifecycle_state, ctx.locale),
      health_label: objectiveHealthLabel(o.lifecycle_state, ctx.locale),
      purpose_summary: o.purpose,
      progress_percent: o.lifecycle_state === "active" || o.lifecycle_state === "on_track" ? 57 : null,
      viewer_role: role,
      href: `${base}/${o.canonical_id}`,
    };
  });

  const needs_attention_count = objectives.filter((o) =>
    ["needs_attention", "at_risk", "draft", "proposed"].includes(o.lifecycle_state)
  ).length;

  return {
    initiative_id: initiativeId,
    institution_name: ctx.institution_name,
    active_count: objectives.filter((o) => ["active", "on_track"].includes(o.lifecycle_state)).length,
    needs_attention_count,
    cards,
    empty_state:
      cards.length === 0
        ? {
            title: t(ctx.locale, "portfolio.empty.title"),
            body: t(ctx.locale, "portfolio.empty.body"),
            action_label: t(ctx.locale, "portfolio.empty.action"),
            action_href: `${base}/new`,
          }
        : null,
  };
}
