/**
 * CAE-11.2-W6 — Objective portfolio intelligence
 */
import { objectiveApplicationService } from "../application-service";
import { analyzeProgress } from "./progress-intelligence";
import { detectExecutionRisks } from "./risk-intelligence";

export type PortfolioIntelligence = {
  institution_id: string;
  initiative_id_optional?: string;
  total_objectives: number;
  active_objectives: number;
  at_risk_objectives: number;
  average_progress: number;
  momentum_summary: string;
  advisory_only: true;
};

export function assemblePortfolioIntelligence(institutionId: string, initiativeId?: string): PortfolioIntelligence {
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const active = objectives.filter((o) => o.lifecycle_state === "active" || o.lifecycle_state === "on_track").length;
  const atRisk = objectives.filter(
    (o) => o.lifecycle_state === "at_risk" || o.lifecycle_state === "needs_attention"
  ).length;

  const progress = analyzeProgress(institutionId, initiativeId);
  const avg =
    progress.length > 0 ? Math.round(progress.reduce((s, p) => s + p.progress_percent, 0) / progress.length) : 0;
  const accelerating = progress.filter((p) => p.trend === "accelerating").length;
  const stalled = progress.filter((p) => p.trend === "stalled").length;

  const momentum =
    accelerating > stalled
      ? "Execution momentum is positive across Objectives."
      : stalled > 0
        ? "Some Objectives show stalled momentum — review Today's Work."
        : "Execution momentum is steady.";

  void detectExecutionRisks(institutionId, initiativeId);

  return {
    institution_id: institutionId,
    initiative_id_optional: initiativeId,
    total_objectives: objectives.length,
    active_objectives: active,
    at_risk_objectives: atRisk,
    average_progress: avg,
    momentum_summary: momentum,
    advisory_only: true,
  };
}
