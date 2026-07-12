/**
 * CAE-11.1-W6 — Executive brief generator
 */
import { caeId, nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import { generateInstitutionRecommendations } from "./recommendation-engine";
import { detectOperationalRisks } from "./risk-intelligence";
import type { ExecutiveBrief } from "./contracts";

export function generateExecutiveBrief(institutionId: string, actorHumanId: string): ExecutiveBrief {
  const recs = generateInstitutionRecommendations(institutionId, actorHumanId);
  const risks = detectOperationalRisks(institutionId).filter((r) => r.severity === "high" || r.severity === "critical");

  const ids = initiativeApplicationService.listInitiativeIds();
  let approvals = 0;
  let atRisk = 0;
  const deadlines: string[] = [];

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (agg.initiative.status === "approval_pending") approvals++;
    if (agg.initiative.status === "at_risk") atRisk++;
    if (agg.timeline?.next_review_date) deadlines.push(`${agg.initiative.initiative_name}: review ${agg.timeline.next_review_date}`);
    if (agg.timeline?.target_completion_date) deadlines.push(`${agg.initiative.initiative_name}: target end ${agg.timeline.target_completion_date}`);
  }

  return {
    brief_id: caeId("brf"),
    institution_id: institutionId,
    generated_at: nowIso(),
    todays_priorities: recs.filter((r) => r.recommendation_type === "warning" || r.recommendation_type === "duplicate").slice(0, 5),
    critical_risks: risks.slice(0, 5),
    approvals_waiting: approvals,
    initiatives_at_risk: atRisk,
    suggested_decisions: [
      approvals > 0 ? `Review ${approvals} Initiative(s) awaiting approval.` : "No approvals waiting.",
      atRisk > 0 ? `Address ${atRisk} at-risk Initiative(s).` : "No Initiatives marked at risk.",
    ],
    upcoming_deadlines: deadlines.slice(0, 8),
    reading_time_minutes: 5,
  };
}
