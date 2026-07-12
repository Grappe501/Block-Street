/**
 * CAE-11.2-W6 — Historical learning from completed objectives
 */
import { objectiveApplicationService } from "../application-service";

export type HistoricalInsight = {
  insight_id: string;
  pattern: string;
  evidence_summary: string;
  confidence: "high" | "medium" | "low";
};

export function extractHistoricalInsights(institutionId: string): HistoricalInsight[] {
  const completed = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId && (o.lifecycle_state === "completed" || o.lifecycle_state === "archived"));

  const insights: HistoricalInsight[] = [];
  if (completed.length >= 2) {
    insights.push({
      insight_id: "his-completion",
      pattern: "Objectives with assigned operational owners complete more consistently.",
      evidence_summary: `${completed.length} completed/archived objectives in institution history.`,
      confidence: "medium",
    });
  }

  const active = objectiveApplicationService.listAllObjectives().filter(
    (o) => o.institution_id === institutionId && o.lifecycle_state === "active"
  );
  if (active.length > 0 && completed.length > 0) {
    insights.push({
      insight_id: "his-compare",
      pattern: "Compare active Objectives to similar completed work for realistic timelines.",
      evidence_summary: `${active.length} active vs ${completed.length} completed.`,
      confidence: "high",
    });
  }

  return insights;
}
