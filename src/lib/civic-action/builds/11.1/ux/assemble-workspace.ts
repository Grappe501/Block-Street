/**
 * CAE-11.1-W4 — Workspace shell + overview assembler
 */
import { initiativeApplicationService } from "../services/application-service";
import { validateCharter } from "../services/charter-validator";
import type { InitiativeExperienceContext } from "./experience-context";
import { humanLabel, resolveExperienceRole } from "./experience-context";
import { lifecycleLabel, typeLabel } from "./status-labels";
import { resolveLifecycleActions } from "./ui-actions";
import { t } from "./locale";
import type {
  InitiativeAttentionItem,
  InitiativeNextActionView,
  InitiativeOverviewView,
  InitiativeWorkspaceShellView,
} from "./view-models";

const NAV_KEYS = [
  { key: "overview", path: "" },
  { key: "objectives", path: "/objectives" },
  { key: "charter", path: "/charter" },
  { key: "people", path: "/people" },
  { key: "readiness", path: "/readiness" },
  { key: "intelligence", path: "/intelligence" },
  { key: "dependencies", path: "/dependencies" },
  { key: "reviews", path: "/reviews" },
  { key: "history", path: "/history" },
  { key: "manage", path: "/manage" },
  { key: "closeout", path: "/closeout" },
  { key: "settings", path: "/settings" },
] as const;

function nextActionForStatus(status: string, id: string, locale: "en" | "es"): InitiativeNextActionView {
  const href = (p: string) => `/initiatives/${id}${p}`;
  switch (status) {
    case "concept":
    case "discovery":
    case "design":
      return { label: t(locale, "next.charter"), description: t(locale, "next.charter.desc"), href: href("/charter"), tone: "action" };
    case "approval_pending":
      return { label: t(locale, "next.approval"), description: t(locale, "next.approval.desc"), href: href("/approvals"), tone: "action" };
    case "approved":
    case "preparation":
      return { label: t(locale, "next.readiness"), description: t(locale, "next.readiness.desc"), href: href("/readiness"), tone: "action" };
    case "owner_required":
      return { label: t(locale, "next.owner"), description: t(locale, "next.owner.desc"), href: href("/people"), tone: "warning" };
    case "active":
      return { label: t(locale, "next.none"), description: t(locale, "next.none.desc"), tone: "none" };
    case "archived":
      return { label: t(locale, "next.archived"), description: t(locale, "next.archived.desc"), tone: "blocked" };
    default:
      return { label: t(locale, "next.review"), description: t(locale, "next.review.desc"), href: href(""), tone: "info" as InitiativeNextActionView["tone"] };
  }
}

export function assembleWorkspaceShell(
  initiativeId: string,
  ctx: InitiativeExperienceContext,
  subPath = ""
): InitiativeWorkspaceShellView | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;
  const ini = agg.initiative;
  const role = resolveExperienceRole(
    ctx.actor_human_id,
    ini.operational_owner_human_id,
    ini.executive_owner_human_id,
    ctx.permissions
  );

  const base = `/initiatives/${initiativeId}`;
  const nav_sections = NAV_KEYS.map((n) => ({
    key: n.key,
    label: t(ctx.locale, `nav.${n.key}`),
    href: `${base}${n.path}`,
    enabled: true,
    hint: n.key === "dependencies" && agg.dependencies.length === 0 ? t(ctx.locale, "nav.hint.dependencies") : undefined,
  }));

  return {
    initiative_id: initiativeId,
    institution_id: ctx.institution_id,
    institution_name: ctx.institution_name,
    initiative_name: ini.initiative_name,
    initiative_type_label: typeLabel(ini.initiative_type),
    lifecycle_state: ini.status,
    lifecycle_label: lifecycleLabel(ini.status),
    viewer_role: role,
    viewer_role_label: t(ctx.locale, `role.${role}`),
    next_action: nextActionForStatus(ini.status, initiativeId, ctx.locale),
    nav_sections,
    cross_institution_banner: null,
    owner_required_banner:
      ini.status === "owner_required"
        ? t(ctx.locale, "banner.owner_required")
        : null,
    archived_banner: ini.is_archived || ini.status === "archived" ? t(ctx.locale, "banner.archived") : null,
  };
}

export function assembleInitiativeOverview(
  initiativeId: string,
  ctx: InitiativeExperienceContext
): InitiativeOverviewView | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  const shell = assembleWorkspaceShell(initiativeId, ctx);
  if (!agg || !shell) return null;

  const ini = agg.initiative;
  const charter = validateCharter(agg, ini.status === "preparation" || ini.status === "active" ? "activation" : "review_submission");

  const attention: InitiativeAttentionItem[] = [];
  if (shell.owner_required_banner) {
    attention.push({ id: "owner", text: shell.owner_required_banner, tone: "warning", href: `/initiatives/${initiativeId}/people` });
  }
  if (ini.status === "approval_pending") {
    attention.push({ id: "approval", text: t(ctx.locale, "attention.approval"), tone: "action", href: `/initiatives/${initiativeId}/approvals` });
  }
  if (!charter.is_valid && ["preparation", "approval_pending", "approved"].includes(ini.status)) {
    attention.push({
      id: "charter",
      text: t(ctx.locale, "attention.charter"),
      tone: "warning",
      href: `/initiatives/${initiativeId}/charter`,
    });
  }
  if (attention.length === 0) {
    attention.push({ id: "clear", text: t(ctx.locale, "attention.clear"), tone: "info" });
  }

  const lastEvent = agg.history[agg.history.length - 1];
  const activity_feed = agg.history.slice(-8).reverse().map((e) => ({
    id: e.initiative_event_id,
    when: e.occurred_at,
    text: e.reason || e.event_type.replace(/_/g, " "),
  }));

  return {
    shell,
    attention,
    purpose_summary: agg.charter?.purpose || agg.charter?.problem_statement || t(ctx.locale, "purpose.missing"),
    state_summary: `${t(ctx.locale, "state.summary", shell.lifecycle_label)}`,
    last_lifecycle_change: lastEvent
      ? `${lastEvent.reason || lastEvent.event_type} · ${new Date(lastEvent.occurred_at).toLocaleDateString()}`
      : null,
    ownership_summary: `${t(ctx.locale, "owner.operational")}: ${humanLabel(ini.operational_owner_human_id)}`,
    readiness_or_health:
      ini.status === "preparation"
        ? charter.is_valid
          ? t(ctx.locale, "readiness.ready")
          : t(ctx.locale, "readiness.not_ready")
        : null,
    integration_cards: [
      {
        key: "objectives",
        title: t(ctx.locale, "card.objectives"),
        body: t(ctx.locale, "card.objectives.body"),
        action_label: "Open Objectives",
        action_href: `/initiatives/${initiativeId}/objectives`,
      },
      {
        key: "workstreams",
        title: t(ctx.locale, "card.work"),
        body: t(ctx.locale, "card.work.body"),
      },
      {
        key: "calendar",
        title: t(ctx.locale, "card.calendar"),
        body: t(ctx.locale, "card.calendar.body"),
      },
    ],
    activity_feed,
    lifecycle_actions: resolveLifecycleActions(agg, ctx),
  };
}
