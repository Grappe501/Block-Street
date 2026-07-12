/**
 * CAE-11.1-W6 — Historical learning from completed Initiatives
 */
import { initiativeApplicationService } from "../services/application-service";

export type HistoricalInsight = {
  insight_id: string;
  category: string;
  summary: string;
  sample_size: number;
  confidence: "low" | "medium" | "high";
};

export function extractHistoricalInsights(institutionId: string): HistoricalInsight[] {
  const completed = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((agg) => agg && agg.initiative.institution_id === institutionId && agg.initiative.status === "completed");

  const insights: HistoricalInsight[] = [];
  if (completed.length > 0) {
    insights.push({
      insight_id: "hist-completion-count",
      category: "completion",
      summary: `${completed.length} completed Initiative(s) in this institution can inform templates and sequencing.`,
      sample_size: completed.length,
      confidence: completed.length >= 3 ? "medium" : "low",
    });
  }

  const withLessons = completed.filter((agg) => agg?.closeout?.lessons_learned);
  if (withLessons.length > 0) {
    insights.push({
      insight_id: "hist-lessons",
      category: "lessons",
      summary: `${withLessons.length} closeout record(s) include lessons learned — compare before starting similar work.`,
      sample_size: withLessons.length,
      confidence: "medium",
    });
  }

  return insights;
}
