/**
 * CAE-11.12-W4 — Home dashboard assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole, roleFocusLabels } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import { resolveLearningActions } from "./ui-actions";
import type { HomeDashboardView } from "./view-models";

export function assembleHomeDashboard(ctx: KnowledgeExperienceContext): HomeDashboardView {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "home");

  const enrollments = knowledgeApplicationService.listEnrollments(ctx.institution_id, ctx.actor_human_id);
  const courses = knowledgeApplicationService.listCourses(ctx.institution_id);
  const courseById = new Map(courses.map((c) => [c.canonical_id, c]));
  const artifacts = knowledgeApplicationService
    .listArtifacts(ctx.institution_id)
    .filter((a) => a.lifecycle_state === "published" || a.lifecycle_state === "validated")
    .slice(0, 5);

  const continueLearning = enrollments
    .filter((e) => e.lifecycle_state === "active" || e.lifecycle_state === "enrolled")
    .slice(0, 3)
    .map((e) => ({
      course_id: e.course_id ?? "",
      display_name: courseById.get(e.course_id ?? "")?.display_name ?? "Course",
      progress_percent: e.lifecycle_state === "completed" ? 100 : 50,
      href: `/learning/courses/${e.course_id}`,
    }));

  const recommended =
    continueLearning[0] != null
      ? {
          label: `Continue ${continueLearning[0].display_name}`,
          href: continueLearning[0].href,
          reason: "Resume where you left off",
        }
      : courses[0]
        ? {
            label: `Explore ${courses[0].display_name}`,
            href: `/learning/courses/${courses[0].canonical_id}`,
            reason: "Published course available",
          }
        : null;

  return {
    shell,
    primary_question: t(ctx.locale, "home.primary_question"),
    welcome_message: t(ctx.locale, "home.subtitle"),
    current_mission: ctx.initiative_id_optional
      ? { id: ctx.initiative_id_optional, title: "Current field mission", href: "/learning/mission" }
      : null,
    continue_learning: continueLearning,
    upcoming_events: [],
    assigned_reviews: artifacts
      .filter((a) => a.lifecycle_state === "review")
      .map((a) => ({
        id: a.canonical_id,
        title: a.display_name,
        href: `/learning/knowledge/${a.canonical_id}`,
      })),
    recent_knowledge: artifacts.map((a) => ({
      id: a.canonical_id,
      title: a.display_name,
      href: `/learning/knowledge/${a.canonical_id}`,
      status_label: a.lifecycle_state,
    })),
    ai_briefing: "Advisory briefing — AI does not replace steward or instructor authority.",
    recommended_next_step: recommended,
    notifications_count: 0,
    progress_snapshot: roleFocusLabels(role, ctx.locale).map((label) => ({ label, value: "—" })),
    competency_note: t(ctx.locale, "competency.note"),
    certification_note: t(ctx.locale, "certification.note"),
    ai_advisory_only: true,
  };
}

export function homeGovernedActions(ctx: KnowledgeExperienceContext) {
  return resolveLearningActions(ctx);
}
