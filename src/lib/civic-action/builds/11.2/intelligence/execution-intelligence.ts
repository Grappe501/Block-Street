/**
 * CAE-11.2-W6 — Execution intelligence (velocity, blocked, idle work)
 */
import { objectiveApplicationService } from "../application-service";
import type { ExecutionInsight } from "./contracts";
import { scoreToConfidence } from "./utils";

export function analyzeExecution(institutionId: string, initiativeId?: string): ExecutionInsight[] {
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  return objectives.map((objective) => {
    const bundle = objectiveApplicationService.getObjectiveBundle(objective.canonical_id);
    const missions = bundle?.missions ?? [];
    const tasks = bundle?.tasks ?? [];

    const blocked = missions.filter((m) => m.lifecycle_state === "paused").length;
    const active = missions.filter((m) => m.lifecycle_state === "active").length;
    const completed = missions.filter((m) => m.lifecycle_state === "completed").length;
    const idle = missions.filter((m) => m.lifecycle_state === "planned" || m.lifecycle_state === "ready").length;
    const overdueTasks = tasks.filter((t) => t.lifecycle_state === "blocked").length;

    const velocity =
      completed >= active ? "Above average" : active >= 3 ? "Average" : completed === 0 ? "Below average" : "Average";

    return {
      objective_id: objective.canonical_id,
      velocity_label: velocity,
      blocked_missions: blocked,
      overdue_tasks: overdueTasks,
      idle_missions: idle,
      confidence: scoreToConfidence(active + completed > 0 ? 0.7 : 0.4),
    };
  });
}
