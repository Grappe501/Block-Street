/**
 * CAE-11.1-W4 — Portfolio assembler
 */
import { initiativeApplicationService } from "../services/application-service";
import type { InitiativeExperienceContext } from "./experience-context";
import { humanLabel, resolveExperienceRole } from "./experience-context";
import { lifecycleLabel, typeLabel } from "./status-labels";
import type { InitiativeCardView, InitiativePortfolioView } from "./view-models";
import { t } from "./locale";

function attentionForStatus(status: string): string | null {
  if (status === "owner_required") return "Operational owner required";
  if (status === "approval_pending") return "Approval waiting";
  if (status === "at_risk") return "Marked at risk";
  if (status === "preparation") return "Readiness review before activation";
  if (status === "concept" || status === "discovery") return "Complete discovery and charter";
  return null;
}

function cardFromId(id: string, ctx: InitiativeExperienceContext): InitiativeCardView | null {
  const agg = initiativeApplicationService.getAggregate(id);
  if (!agg) return null;
  const ini = agg.initiative;
  const purpose = agg.charter?.purpose || agg.charter?.problem_statement || "Purpose not yet defined.";
  const role = resolveExperienceRole(
    ctx.actor_human_id,
    ini.operational_owner_human_id,
    ini.executive_owner_human_id,
    ctx.permissions
  );
  return {
    initiative_id: ini.initiative_id,
    name: ini.initiative_name,
    type: ini.initiative_type,
    type_label: typeLabel(ini.initiative_type),
    status: ini.status,
    status_label: lifecycleLabel(ini.status),
    purpose_summary: purpose.slice(0, 160),
    operational_owner_label: humanLabel(ini.operational_owner_human_id),
    executive_owner_label: ini.executive_owner_human_id ? humanLabel(ini.executive_owner_human_id) : null,
    next_important_date:
      agg.timeline?.next_review_date ?? agg.timeline?.target_completion_date ?? agg.timeline?.activation_date ?? null,
    health_label: ini.status === "at_risk" ? "Needs attention" : ini.status === "active" ? "On track" : "Building",
    attention_item: attentionForStatus(ini.status),
    viewer_role: role,
    last_updated: ini.updated_at,
    href: `/initiatives/${ini.initiative_id}`,
  };
}

export function assembleInitiativePortfolio(
  ctx: InitiativeExperienceContext,
  mode = "institution"
): InitiativePortfolioView {
  const ids = initiativeApplicationService.listInitiativeIds();
  const cards = ids.map((id) => cardFromId(id, ctx)).filter((c): c is InitiativeCardView => c !== null);

  const needsAttention = cards.filter((c) => c.attention_item);
  const active = cards.filter((c) => c.status === "active");

  let filtered = cards;
  if (mode === "needs_attention") filtered = needsAttention;
  if (mode === "active") filtered = active;
  if (mode === "drafts") filtered = cards.filter((c) => ["concept", "discovery", "design"].includes(c.status));

  return {
    institution_id: ctx.institution_id,
    institution_name: ctx.institution_name,
    mode,
    active_count: active.length,
    needs_attention_count: needsAttention.length,
    approvals_waiting: cards.filter((c) => c.status === "approval_pending").length,
    cards: filtered,
    empty_state:
      filtered.length === 0
        ? {
            title: t(ctx.locale, "portfolio.empty.title"),
            body: t(ctx.locale, "portfolio.empty.body"),
            action_label: t(ctx.locale, "portfolio.empty.action"),
            action_href: "/initiatives/new",
          }
        : null,
  };
}
