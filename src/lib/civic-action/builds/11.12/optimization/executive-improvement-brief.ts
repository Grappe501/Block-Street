/**
 * CAE-11.12-W7 — Executive improvement brief
 */
import { caeId, nowIso } from "../../../utils";
import { generateContinuousImprovements } from "./continuous-improvement";
import { buildStewardWorkQueue } from "./stewardship-operations";
import { listImprovementPilots, listImprovementProposals } from "./improvement-governance";
import { listImprovementOutcomes } from "./outcome-measurement";
import { generateResearchAgendaCandidates } from "./research-agenda";
import type { KnowledgeOptimization } from "./contracts";

export function buildExecutiveImprovementBrief(institutionId: string) {
  const optimizations = generateContinuousImprovements(institutionId);
  const proposals = listImprovementProposals(institutionId);
  const pilots = listImprovementPilots(institutionId);
  const outcomes = listImprovementOutcomes(institutionId);
  const research = generateResearchAgendaCandidates(institutionId);
  const stewardQueue = buildStewardWorkQueue(institutionId);

  return {
    brief_id: caeId("eib"),
    institution_id: institutionId,
    generated_at: nowIso(),
    highest_risk_knowledge: stewardQueue.filter((w) => w.priority === "critical" || w.priority === "high").map((w) => w.title),
    improvement_candidates: optimizations.length,
    pilots_in_progress: pilots.filter((p) => p.status === "active").length,
    failed_pilots_visible: pilots.filter((p) => p.status === "failed").length,
    measured_benefits: outcomes.filter((o) => o.outcome_category === "improved").length,
    rolled_back: outcomes.filter((o) => o.outcome_category === "rolled_back").length,
    research_priorities: research.map((r) => r.title),
    decisions_required: proposals.filter((p) => p.status === "under_review" || p.status === "proposed").map((p) => p.proposed_change),
    recommended_changes: optimizations.slice(0, 5) as KnowledgeOptimization[],
    individual_human_ranking: null,
    reading_time_minutes: 5,
    advisory_only: true as const,
  };
}
