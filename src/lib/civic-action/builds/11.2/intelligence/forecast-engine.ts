/**
 * CAE-11.2-W6 — Forecast engine (advisory predictions)
 */
import { caeId } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { analyzeProgress } from "./progress-intelligence";
import { analyzeObjectiveCapacity } from "./capacity-intelligence";
import type { ForecastInsight } from "./contracts";
import { scoreToConfidence } from "./utils";

export function generateForecasts(institutionId: string, initiativeId?: string): ForecastInsight[] {
  const forecasts: ForecastInsight[] = [];
  const progress = analyzeProgress(institutionId, initiativeId);

  for (const p of progress) {
    const objective = objectiveApplicationService.getObjective(p.objective_id);
    if (!objective) continue;
    forecasts.push({
      forecast_id: caeId("fcst"),
      objective_id: p.objective_id,
      forecast_type: "completion",
      predicted_label:
        p.trend === "accelerating"
          ? "Likely to exceed target on current momentum"
          : p.trend === "stalled"
            ? "Completion may slip without intervention"
            : "Tracking toward expected completion",
      confidence: p.confidence,
      evidence: [{ signal_id: "progress", source: "progress_intelligence", summary: `trend=${p.trend}` }],
      advisory_only: true,
    });
  }

  const overloaded = analyzeObjectiveCapacity(institutionId, initiativeId).filter((c) => c.overload_band === "high");
  for (const cap of overloaded.slice(0, 3)) {
    forecasts.push({
      forecast_id: caeId("fcst"),
      objective_id: "",
      forecast_type: "capacity",
      predicted_label: `${cap.human_label} may become a bottleneck for mission completion`,
      confidence: scoreToConfidence(0.72),
      evidence: [{ signal_id: cap.human_id, source: "capacity_intelligence", summary: `${cap.active_mission_count} active missions` }],
      advisory_only: true,
    });
  }

  return forecasts;
}
