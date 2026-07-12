/**
 * CAE-11.2-W7 — Governance optimization (advisory)
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { OptimizationRecommendation } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeGovernanceOptimization(
  institutionId: string,
  initiativeId?: string
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const proposed = objectives.filter((o) => o.lifecycle_state === "proposed").length;
  const atRisk = objectives.filter((o) => o.lifecycle_state === "at_risk").length;

  if (proposed >= 2) {
    const optId = "gov-objective-approval-queue";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "governance",
        title: "Objective approval queue detected",
        title_es: "Cola de aprobación de objetivos",
        what_changed: `${proposed} Objectives await approval.`,
        why: "Decision latency increases when approvers face batch queues.",
        why_es: "La latencia aumenta con colas de aprobación.",
        confidence: proposed >= 4 ? "strong_pattern" : "emerging",
        evidence: [{ signal_id: "proposed", source: "lifecycle", summary: `${proposed} proposed Objectives` }],
        expected_benefit: "Batch governance review could clear queue faster.",
        possible_downside: "Batch reviews may reduce deliberation per Objective.",
        who_should_review: "Executive owners and institution administrators",
        suggested_action: "Schedule batch Objective approval session.",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  if (atRisk >= 2) {
    recs.push({
      optimization_id: "gov-at-risk-escalation",
      category: "governance",
      title: "Multiple Objectives at risk",
      title_es: "Múltiples objetivos en riesgo",
      what_changed: `${atRisk} Objectives marked at risk.`,
      why: "Concurrent at-risk Objectives suggest governance or capacity strain.",
      why_es: "Objetivos en riesgo concurrentes sugieren tensión de capacidad.",
      confidence: "likely",
      evidence: [{ signal_id: "at-risk", source: "lifecycle", summary: `${atRisk} at-risk Objectives` }],
      expected_benefit: "Executive intervention prevents cascade failures.",
      possible_downside: "Over-escalation may distract from healthy Objectives.",
      who_should_review: "Executive owners",
      suggested_action: "Convene at-risk review — advisory until Humans act.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
