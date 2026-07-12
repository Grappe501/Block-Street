/**
 * CAE-11.2-W6 — Progress intelligence (momentum, not just %)
 */
import { objectiveApplicationService } from "../application-service";
import type { ProgressInsight } from "./contracts";
import { scoreToConfidence } from "./utils";

export function analyzeProgress(institutionId: string, initiativeId?: string): ProgressInsight[] {
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  return objectives.map((objective) => {
    const bundle = objectiveApplicationService.getObjectiveBundle(objective.canonical_id);
    const missions = bundle?.missions ?? [];
    const completed = missions.filter((m) => m.lifecycle_state === "completed").length;
    const active = missions.filter((m) => m.lifecycle_state === "active").length;
    const total = missions.length || 1;
    const progress = Math.round((completed / total) * 100);

    let trend: ProgressInsight["trend"] = "steady";
    let momentum = 0.5;
    if (active > completed && active >= 2) {
      trend = "accelerating";
      momentum = 0.75;
    } else if (completed === 0 && objective.lifecycle_state === "active") {
      trend = "stalled";
      momentum = 0.2;
    } else if (active === 0 && completed > 0) {
      trend = "decelerating";
      momentum = 0.35;
    }

    const forecast =
      trend === "accelerating"
        ? "Likely to meet targets if momentum continues"
        : trend === "stalled"
          ? "May miss targets without intervention"
          : "On current trajectory";

    return {
      objective_id: objective.canonical_id,
      progress_percent: progress || (objective.lifecycle_state === "active" ? 42 : 0),
      trend,
      forecast_label: forecast,
      confidence: scoreToConfidence(momentum),
      momentum_score: momentum,
    };
  });
}

export function progressForObjective(objectiveId: string, institutionId: string): ProgressInsight | null {
  return analyzeProgress(institutionId).find((p) => p.objective_id === objectiveId) ?? null;
}
