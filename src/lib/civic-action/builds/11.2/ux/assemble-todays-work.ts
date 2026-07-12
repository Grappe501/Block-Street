/**
 * CAE-11.2-W4 — Today's Work assembler
 */
import { objectiveApplicationService } from "../application-service";
import type { ObjectiveExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { t } from "./locale";
import type { TodaysWorkItemView } from "./view-models";

export function assembleTodaysWork(
  initiativeId: string,
  objectiveId: string,
  ctx: ObjectiveExperienceContext
): { items: TodaysWorkItemView[]; empty_message: string } {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle) return { items: [], empty_message: t(ctx.locale, "today.empty") };

  const base = `/initiatives/${initiativeId}/objectives/${objectiveId}`;
  const items: TodaysWorkItemView[] = [];

  for (const task of bundle.tasks) {
    if (["completed", "cancelled", "archived"].includes(task.lifecycle_state)) continue;
    items.push({
      id: task.canonical_id,
      title: task.description,
      why: bundle.objective.purpose,
      entity_type: "Task",
      href: `${base}/missions/${task.mission_id}`,
      priority: task.priority <= 1 ? "high" : "normal",
    });
  }

  for (const mission of bundle.missions) {
    if (mission.lifecycle_state === "active" || mission.lifecycle_state === "ready") {
      items.push({
        id: mission.canonical_id,
        title: mission.display_name,
        why: mission.purpose,
        entity_type: "Mission",
        href: `${base}/missions/${mission.canonical_id}`,
        priority: "normal",
      });
    }
  }

  if (bundle.objective.review_rhythm === "weekly") {
    items.push({
      id: `review-${objectiveId}`,
      title: "Prepare weekly objective review",
      why: "Governed review rhythm",
      entity_type: "Review",
      href: `${base}/reviews`,
      priority: "low",
    });
  }

  if (items.length === 0) {
    return { items: [], empty_message: t(ctx.locale, "today.empty") };
  }

  return { items, empty_message: "" };
}

export function assembleObjectiveBuilder(initiativeId: string, ctx: ObjectiveExperienceContext) {
  return {
    initiative_id: initiativeId,
    steps: [
      { key: "change", title: "What change?", prompt: t(ctx.locale, "builder.step.change"), field: "purpose" },
      { key: "benefit", title: "Who benefits?", prompt: t(ctx.locale, "builder.step.benefit"), field: "desired_future_state" },
      { key: "success", title: "Success?", prompt: t(ctx.locale, "builder.step.success"), field: "success_definition" },
      { key: "first", title: "First steps?", prompt: t(ctx.locale, "builder.step.first"), field: "measurement_strategy" },
      { key: "owner", title: "Ownership", prompt: t(ctx.locale, "builder.step.owner"), field: "operational_owner_human_id" },
      { key: "review", title: "Review", prompt: t(ctx.locale, "builder.step.review"), field: "review" },
    ],
  };
}
