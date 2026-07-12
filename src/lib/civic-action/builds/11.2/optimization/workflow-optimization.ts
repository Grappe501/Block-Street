/**
 * CAE-11.2-W7 — Workflow optimization (advisory)
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { OptimizationRecommendation } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeWorkflowOptimization(
  institutionId: string,
  initiativeId?: string
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  let duplicateReviews = 0;
  let pausedMissions = 0;
  for (const o of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(o.canonical_id);
    if (!bundle) continue;
    if (o.review_rhythm && bundle.missions.length > 5) duplicateReviews++;
    pausedMissions += bundle.missions.filter((m) => m.lifecycle_state === "paused").length;
  }

  if (duplicateReviews >= 2) {
    const optId = "wf-duplicate-reviews";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "workflow",
        title: "Consolidate review meetings",
        title_es: "Consolidar reuniones de revisión",
        what_changed: `${duplicateReviews} Objectives may have overlapping review cadences.`,
        why: "Duplicate reviews consume volunteer time without proportional insight.",
        why_es: "Las revisiones duplicadas consumen tiempo sin beneficio proporcional.",
        confidence: "emerging",
        evidence: [{ signal_id: "dup-reviews", source: "workflow", summary: `${duplicateReviews} objectives flagged` }],
        expected_benefit: "Reduce meeting load while preserving accountability.",
        possible_downside: "Consolidated reviews may miss Objective-specific nuance.",
        who_should_review: "Operational owners and review facilitators",
        suggested_action: "Propose a unified review calendar — Humans approve schedule changes.",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  if (pausedMissions >= 3) {
    recs.push({
      optimization_id: "wf-paused-missions",
      category: "workflow",
      title: "Resolve paused mission backlog",
      title_es: "Resolver misiones pausadas",
      what_changed: `${pausedMissions} missions are paused across scoped Objectives.`,
      why: "Paused work signals sequencing or dependency inefficiencies.",
      why_es: "El trabajo pausado indica ineficiencias de secuenciación.",
      confidence: pausedMissions >= 6 ? "strong_pattern" : "likely",
      evidence: [{ signal_id: "paused", source: "missions", summary: `${pausedMissions} paused missions` }],
      expected_benefit: "Restore execution velocity.",
      possible_downside: "Resuming without root-cause review may repeat blockers.",
      who_should_review: "Mission owners and operational leads",
      suggested_action: "Run dependency review before bulk resume.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
