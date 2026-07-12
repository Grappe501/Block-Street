/**
 * CAE-11.1-W6 — Recommendation engine (explainable, dismissible)
 */
import { nowIso } from "../../../utils";
import { isRecommendationDismissed } from "./feedback-store";
import { analyzeInstitutionCapacity } from "./capacity-intelligence";
import {
  detectDuplicateCandidates,
  duplicatesForInitiative,
  formatDuplicateMessage,
  formatDuplicateMessageEs,
} from "./duplicate-detection";
import { detectOperationalRisks, risksForInitiative } from "./risk-intelligence";
import type { InitiativeRecommendation } from "./contracts";

export function generateInstitutionRecommendations(
  institutionId: string,
  actorHumanId: string,
  options?: { initiativeId?: string }
): InitiativeRecommendation[] {
  const recs: InitiativeRecommendation[] = [];

  const dupes = options?.initiativeId
    ? duplicatesForInitiative(options.initiativeId, institutionId)
    : detectDuplicateCandidates(institutionId, 0.6).slice(0, 5);

  for (const d of dupes) {
    const id = `rec-dup-${d.initiative_id_a}-${d.initiative_id_b}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "duplicate",
      title: formatDuplicateMessage(d),
      title_es: formatDuplicateMessageEs(d),
      why: `Name and purpose similarity score ${d.similarity_label} (${d.shared_signals.join(", ")}).`,
      why_es: `Similitud de nombre y propósito: ${d.similarity_label}.`,
      confidence: d.confidence,
      confidence_score: d.similarity_score,
      evidence: d.shared_signals.map((s) => ({
        signal_id: s,
        source: "duplicate_detection",
        summary: s,
      })),
      uncertainty_notes: ["Similarity is lexical — Humans must judge whether work is truly duplicated."],
      suggested_action: "Compare Initiatives side by side before merging or closing either.",
      suggested_action_es: "Compara las iniciativas antes de fusionar o cerrar alguna.",
      action_href_optional: d.compare_href,
      initiative_id_optional: options?.initiativeId ?? d.initiative_id_a,
      related_initiative_ids: [d.initiative_id_a, d.initiative_id_b],
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const risks = options?.initiativeId
    ? risksForInitiative(options.initiativeId, institutionId)
    : detectOperationalRisks(institutionId).slice(0, 8);

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
      suggested_action: "Review the Initiative workspace and address blockers through governed commands.",
      suggested_action_es: "Revisa el espacio de trabajo y resuelve bloqueos con comandos gobernados.",
      action_href_optional: `/initiatives/${r.initiative_id}/readiness`,
      initiative_id_optional: r.initiative_id,
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  for (const cap of analyzeInstitutionCapacity(institutionId).filter((c) => c.overload_band !== "normal")) {
    const id = `rec-cap-${cap.human_id}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "operational",
      title: `${cap.human_label} may be overloaded`,
      title_es: `${cap.human_label} podría estar sobrecargado/a`,
      why: `${cap.initiative_count} Initiatives (${cap.active_initiative_count} active, ${cap.approval_pending_count} awaiting approval).`,
      why_es: `${cap.initiative_count} iniciativas (${cap.active_initiative_count} activas).`,
      confidence: cap.overload_band === "high" ? "high" : "medium",
      confidence_score: cap.overload_band === "high" ? 0.8 : 0.6,
      evidence: [
        {
          signal_id: "capacity_count",
          source: "initiative_portfolio",
          summary: `initiatives=${cap.initiative_count}`,
        },
      ],
      uncertainty_notes: ["Counts do not include missions or meetings outside this wave."],
      suggested_action: cap.recommendation_optional ?? "Review ownership distribution.",
      suggested_action_es: "Revisa la distribución de responsabilidades.",
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}

export function generateAdvisorySuggestions(initiativeId: string, institutionId: string, actorHumanId: string) {
  return generateInstitutionRecommendations(institutionId, actorHumanId, { initiativeId });
}
