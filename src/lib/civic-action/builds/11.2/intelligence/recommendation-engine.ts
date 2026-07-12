/**
 * CAE-11.2-W6 — Recommendation engine (explainable, dismissible)
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { isRecommendationDismissed } from "./feedback-store";
import { analyzeObjectiveCapacity } from "./capacity-intelligence";
import { detectDuplicateObjectives, duplicatesForObjective } from "./duplicate-detection";
import { detectExecutionRisks, risksForObjective } from "./risk-intelligence";
import type { ObjectiveRecommendation } from "./contracts";

export function generateObjectiveRecommendations(
  institutionId: string,
  actorHumanId: string,
  options?: { initiativeId?: string; objectiveId?: string }
): ObjectiveRecommendation[] {
  const recs: ObjectiveRecommendation[] = [];

  const dupes = options?.objectiveId
    ? duplicatesForObjective(options.objectiveId, institutionId)
    : detectDuplicateObjectives(institutionId, options?.initiativeId, 0.6).slice(0, 5);

  for (const d of dupes) {
    const id = `rec-dup-${d.objective_id_a}-${d.objective_id_b}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "duplicate",
      title: `Possible duplicate: ${d.name_a} ↔ ${d.name_b}`,
      title_es: `Posible duplicado: ${d.name_a} ↔ ${d.name_b}`,
      why: `Name and purpose similarity ${d.similarity_label} (${d.shared_signals.join(", ")}).`,
      why_es: `Similitud de nombre y propósito: ${d.similarity_label}.`,
      confidence: d.confidence,
      confidence_score: d.similarity_score,
      evidence: d.shared_signals.map((s) => ({ signal_id: s, source: "duplicate_detection", summary: s })),
      uncertainty_notes: ["Similarity is lexical — Humans must judge whether work is truly duplicated."],
      suggested_action: "Compare Objectives side by side before merging or archiving either.",
      suggested_action_es: "Compara los objetivos antes de fusionar o archivar.",
      expected_benefit_optional: "Reduce duplicate effort and confusion.",
      possible_downside_optional: "False positive — distinct Objectives may share vocabulary.",
      action_href_optional: d.compare_href,
      objective_id_optional: options?.objectiveId ?? d.objective_id_a,
      related_objective_ids: [d.objective_id_a, d.objective_id_b],
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const risks = options?.objectiveId
    ? risksForObjective(options.objectiveId, institutionId)
    : detectExecutionRisks(institutionId, options?.initiativeId).slice(0, 8);

  for (const r of risks) {
    const id = `rec-risk-${r.risk_id}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "warning",
      title: r.title,
      title_es: r.title,
      why: r.explanation,
      why_es: r.explanation,
      confidence: r.confidence,
      confidence_score: r.severity === "critical" ? 0.95 : r.severity === "high" ? 0.85 : 0.65,
      evidence: r.evidence,
      uncertainty_notes: ["Risk signals are derived from current records — context may reduce severity."],
      suggested_action: r.recommended_actions[0] ?? "Review the Objective workbench and address blockers.",
      suggested_action_es: "Revisa el espacio de trabajo y resuelve bloqueos con comandos gobernados.",
      action_href_optional: `/initiatives/${r.initiative_id}/objectives/${r.objective_id}`,
      objective_id_optional: r.objective_id,
      initiative_id_optional: r.initiative_id,
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  for (const cap of analyzeObjectiveCapacity(institutionId, options?.initiativeId).filter((c) => c.overload_band !== "normal")) {
    const id = `rec-cap-${cap.human_id}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "optimization",
      title: `${cap.human_label} may be overloaded`,
      title_es: `${cap.human_label} podría estar sobrecargado/a`,
      why: `${cap.mission_count} missions (${cap.active_mission_count} active).`,
      why_es: `${cap.mission_count} misiones (${cap.active_mission_count} activas).`,
      confidence: cap.overload_band === "high" ? "high" : "medium",
      confidence_score: cap.overload_band === "high" ? 0.8 : 0.6,
      evidence: [{ signal_id: "capacity", source: "capacity_intelligence", summary: `missions=${cap.mission_count}` }],
      uncertainty_notes: ["Counts may not include meetings outside execution records."],
      suggested_action: cap.recommendation_optional ?? "Review mission assignment distribution.",
      suggested_action_es: "Revisa la distribución de misiones.",
      expected_benefit_optional: "Sustainable execution pace for mission leads.",
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}

export function generateAdvisorySuggestions(objectiveId: string, institutionId: string, actorHumanId: string) {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  return generateObjectiveRecommendations(institutionId, actorHumanId, {
    objectiveId,
    initiativeId: objective?.initiative_id,
  });
}
