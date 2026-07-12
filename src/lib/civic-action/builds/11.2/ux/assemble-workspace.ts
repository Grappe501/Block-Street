/**
 * CAE-11.2-W4 — Objective workbench shell + dashboard
 */
import { objectiveApplicationService } from "../application-service";
import type { ObjectiveExperienceContext } from "./experience-context";
import { humanLabel, resolveObjectiveExperienceRole, roleFocusLabels } from "./experience-context";
import { t } from "./locale";
import { objectiveHealthLabel, objectiveStatusLabel } from "./status-labels";
import { resolveObjectiveLifecycleActions } from "./ui-actions";
import { assembleTodaysWork } from "./assemble-todays-work";
import type { ObjectiveDashboardView, ObjectiveWorkspaceShellView } from "./view-models";

const NAV_KEYS = [
  { key: "dashboard", path: "" },
  { key: "today", path: "/today" },
  { key: "workstreams", path: "/workstreams" },
  { key: "progress", path: "/progress" },
  { key: "intelligence", path: "/intelligence" },
  { key: "evidence", path: "/evidence" },
  { key: "reviews", path: "/reviews" },
  { key: "outcomes", path: "/outcomes" },
  { key: "history", path: "/history" },
  { key: "settings", path: "/settings" },
] as const;

export function assembleObjectiveWorkspaceShell(
  initiativeId: string,
  objectiveId: string,
  ctx: ObjectiveExperienceContext
): ObjectiveWorkspaceShellView | null {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  if (!objective || objective.initiative_id !== initiativeId) return null;

  const role = resolveObjectiveExperienceRole(
    ctx.actor_human_id,
    objective.executive_owner_human_id,
    objective.operational_owner_human_id,
    ctx.permissions
  );

  const base = `/initiatives/${initiativeId}/objectives/${objectiveId}`;
  return {
    objective_id: objectiveId,
    initiative_id: initiativeId,
    institution_name: ctx.institution_name,
    display_name: objective.display_name,
    lifecycle_state: objective.lifecycle_state,
    lifecycle_label: objectiveStatusLabel(objective.lifecycle_state, ctx.locale),
    health_label: objectiveHealthLabel(objective.lifecycle_state, ctx.locale),
    viewer_role: role,
    viewer_role_label: t(ctx.locale, `role.${role}`),
    purpose_line: objective.purpose,
    nav_sections: NAV_KEYS.map((n) => ({
      key: n.key,
      label: t(ctx.locale, `nav.${n.key}`),
      href: `${base}${n.path}`,
    })),
    archived_banner:
      objective.lifecycle_state === "archived" ? t(ctx.locale, "banner.archived") : null,
  };
}

export function assembleObjectiveDashboard(
  initiativeId: string,
  objectiveId: string,
  ctx: ObjectiveExperienceContext
): ObjectiveDashboardView | null {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  const shell = assembleObjectiveWorkspaceShell(initiativeId, objectiveId, ctx);
  if (!bundle || !shell) return null;

  const { objective, key_results, missions, workstreams } = bundle;
  const activeMissions = missions.filter((m) => m.lifecycle_state === "active").length;
  const completedMissions = missions.filter((m) => m.lifecycle_state === "completed").length;

  const krCards = key_results.map((kr) => {
    const current = kr.current_value ?? 0;
    const target = kr.target || 1;
    const pct = Math.min(100, Math.round((current / target) * 100));
    return {
      key_result_id: kr.canonical_id,
      title: kr.description,
      current: kr.current_value,
      target: kr.target,
      unit: kr.measurement_unit,
      progress_percent: pct,
      trend_label: pct >= 70 ? "Ahead of Schedule" : "On Pace",
      confidence_label: kr.confidence >= 0.7 ? "High" : "Medium",
    };
  });

  const todays = assembleTodaysWork(initiativeId, objectiveId, ctx);

  return {
    shell,
    six_questions: [
      { question: t(ctx.locale, "q.why"), answer: objective.purpose },
      { question: t(ctx.locale, "q.what"), answer: objective.desired_future_state },
      {
        question: t(ctx.locale, "q.how"),
        answer:
          krCards.length > 0
            ? `${krCards.filter((k) => k.progress_percent >= 50).length} of ${krCards.length} key results on pace`
            : `${completedMissions} missions completed`,
      },
      {
        question: t(ctx.locale, "q.attention"),
        answer:
          shell.lifecycle_state === "at_risk"
            ? "Objective marked at risk — review blockers"
            : missions.some((m) => m.lifecycle_state === "paused")
              ? "Paused missions need review"
              : "No urgent blockers",
      },
      {
        question: t(ctx.locale, "q.next"),
        answer: todays.items[0]?.title ?? "Propose or activate this Objective to begin missions",
      },
      {
        question: t(ctx.locale, "q.help"),
        answer: `Operational lead: ${humanLabel(objective.operational_owner_human_id)}`,
      },
    ],
    cards: [
      { key: "purpose", title: t(ctx.locale, "card.purpose"), body: objective.purpose },
      { key: "current", title: t(ctx.locale, "card.current_state"), body: objective.current_state },
      { key: "desired", title: t(ctx.locale, "card.desired_state"), body: objective.desired_future_state },
      {
        key: "progress",
        title: t(ctx.locale, "card.progress"),
        body: krCards.length ? `${krCards[0]!.progress_percent}% toward first key result` : "Planning in progress",
        tone: "info",
      },
      {
        key: "missions",
        title: t(ctx.locale, "card.missions"),
        body: `${activeMissions} active · ${completedMissions} complete`,
      },
      {
        key: "workstreams",
        title: t(ctx.locale, "card.workstreams"),
        body: `${workstreams.length} workstreams organizing our missions`,
        href: `/initiatives/${initiativeId}/objectives/${objectiveId}/workstreams`,
      },
      {
        key: "reviews",
        title: t(ctx.locale, "card.reviews"),
        body: `Review rhythm: ${objective.review_rhythm}`,
      },
      {
        key: "risks",
        title: t(ctx.locale, "card.risks"),
        body: shell.lifecycle_state === "at_risk" ? "At risk — executive review recommended" : "No elevated risks",
        tone: shell.lifecycle_state === "at_risk" ? "warning" : "default",
      },
    ],
    key_results: krCards,
    todays_priorities: todays.items.slice(0, 5),
    lifecycle_actions: resolveObjectiveLifecycleActions(objective, ctx),
    role_focus: roleFocusLabels(shell.viewer_role, ctx.locale),
    recent_activity: [
      {
        id: "act-1",
        when: objective.updated_at,
        text: `Objective updated · ${shell.lifecycle_label}`,
      },
    ],
    ai_suggestions: [
      "Help me organize this Objective.",
      "Summarize our progress.",
      "Show blocked work.",
    ],
  };
}
