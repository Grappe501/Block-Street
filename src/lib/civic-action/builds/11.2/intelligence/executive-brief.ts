/**
 * CAE-11.2-W6 — Executive brief generator (under 5 minutes)
 */
import { caeId, nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { generateObjectiveRecommendations } from "./recommendation-engine";
import { detectExecutionRisks } from "./risk-intelligence";
import { analyzeObjectiveCapacity } from "./capacity-intelligence";
import type { ExecutiveBrief } from "./contracts";

export function generateExecutiveBrief(
  institutionId: string,
  actorHumanId: string,
  initiativeId?: string
): ExecutiveBrief {
  const recs = generateObjectiveRecommendations(institutionId, actorHumanId, { initiativeId });
  const risks = detectExecutionRisks(institutionId, initiativeId).filter(
    (r) => r.severity === "high" || r.severity === "critical"
  );

  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const atRisk = objectives.filter(
    (o) => o.lifecycle_state === "at_risk" || o.lifecycle_state === "needs_attention"
  ).length;

  const capacityIssues = analyzeObjectiveCapacity(institutionId, initiativeId)
    .filter((c) => c.overload_band !== "normal")
    .map((c) => `${c.human_label}: ${c.overload_band} load (${c.active_mission_count} active missions)`);

  const reviews = objectives
    .filter((o) => o.review_rhythm)
    .map((o) => `${o.display_name}: ${o.review_rhythm}`)
    .slice(0, 5);

  const momentum =
    atRisk === 0 ? "Stable execution momentum" : atRisk <= 2 ? "Mixed momentum — monitor at-risk Objectives" : "Momentum under pressure";

  return {
    brief_id: caeId("brf"),
    institution_id: institutionId,
    initiative_id_optional: initiativeId,
    generated_at: nowIso(),
    todays_priorities: recs.filter((r) => r.recommendation_type === "warning" || r.recommendation_type === "duplicate").slice(0, 5),
    objectives_at_risk: atRisk,
    execution_momentum: momentum,
    critical_risks: risks.slice(0, 5),
    pending_decisions: [
      atRisk > 0 ? `Review ${atRisk} at-risk Objective(s).` : "No Objectives flagged at risk.",
      capacityIssues.length > 0 ? "Address capacity overload on mission leads." : "Capacity within normal bands.",
    ],
    suggested_conversations: [
      "Align executive and operational owners on top risks.",
      "Confirm review dates for active Objectives.",
    ],
    upcoming_reviews: reviews,
    capacity_issues: capacityIssues.slice(0, 5),
    reading_time_minutes: 5,
  };
}
