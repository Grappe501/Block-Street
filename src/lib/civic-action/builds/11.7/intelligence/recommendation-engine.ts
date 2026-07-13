/**
 * CAE-11.7-W6 — Recommendation engine (explainable, dismissible)
 */
import { nowIso } from "../../../utils";
import { isRecommendationDismissed } from "./feedback-store";
import { detectDuplicateConversations, duplicatesForConversation } from "./duplicate-detection";
import { detectUnansweredQuestions } from "./conversation-analysis";
import { analyzeResponseDelays } from "./collaboration-intelligence";
import { computeCommunicationHealth } from "./communication-health";
import type { CommunicationRecommendation } from "./contracts";

export function generateCommunicationRecommendations(
  institutionId: string,
  actorHumanId: string,
  options?: { initiativeId?: string; conversationId?: string }
): CommunicationRecommendation[] {
  const recs: CommunicationRecommendation[] = [];

  const dupes = options?.conversationId
    ? duplicatesForConversation(options.conversationId, institutionId)
    : detectDuplicateConversations(institutionId, options?.initiativeId, 0.6).slice(0, 5);

  for (const d of dupes) {
    const id = `rec-dup-${d.conversation_id_a}-${d.conversation_id_b}`;
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
      uncertainty_notes: ["Similarity is lexical — Humans must judge whether conversations are truly duplicated."],
      suggested_action: "Compare conversations side by side before merging or archiving either.",
      suggested_action_es: "Compara las conversaciones antes de fusionar o archivar.",
      expected_benefit_optional: "Reduce duplicate coordination effort.",
      possible_downside_optional: "False positive — distinct conversations may share vocabulary.",
      action_href_optional: d.compare_href,
      conversation_id_optional: options?.conversationId ?? d.conversation_id_a,
      related_conversation_ids: [d.conversation_id_a, d.conversation_id_b],
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  for (const uq of detectUnansweredQuestions(institutionId, options?.initiativeId).slice(0, 5)) {
    const id = `rec-uq-${uq.question_id}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "reminder",
      title: "Unanswered question detected",
      title_es: "Pregunta sin respuesta detectada",
      why: `Question open for ${uq.days_open} day(s): "${uq.excerpt}"`,
      why_es: `Pregunta abierta por ${uq.days_open} día(s).`,
      confidence: uq.confidence === "high" ? "high" : "medium",
      confidence_score: uq.confidence === "high" ? 0.8 : 0.6,
      evidence: [{ signal_id: uq.message_id, source: "conversation_analysis", summary: uq.excerpt }],
      uncertainty_notes: ["Message may be rhetorical — Human review recommended."],
      suggested_action: "Assign a responder or post a follow-up in the thread.",
      suggested_action_es: "Asigna un respondedor o publica un seguimiento.",
      action_href_optional: `/communications/missions/${uq.conversation_id}`,
      conversation_id_optional: uq.conversation_id,
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  for (const delay of analyzeResponseDelays(institutionId, options?.initiativeId).filter((d) => d.delay_band === "high")) {
    const id = `rec-delay-${delay.conversation_id}`;
    if (isRecommendationDismissed(id, actorHumanId)) continue;
    recs.push({
      recommendation_id: id,
      recommendation_type: "warning",
      title: `Slow responses in ${delay.display_name}`,
      title_es: `Respuestas lentas en ${delay.display_name}`,
      why: delay.explanation,
      why_es: "Los tiempos de respuesta superan el rango normal.",
      confidence: "high",
      confidence_score: 0.75,
      evidence: [{ signal_id: delay.conversation_id, source: "collaboration_intelligence", summary: `${delay.avg_response_hours}h avg` }],
      uncertainty_notes: ["Participants may be intentionally async — confirm before escalating."],
      suggested_action: "Review conversation participants and expected response cadence.",
      suggested_action_es: "Revisa participantes y cadencia esperada.",
      conversation_id_optional: delay.conversation_id,
      dismissible: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const health = computeCommunicationHealth(institutionId, options?.initiativeId);
  if (health.overall_health_band === "strained") {
    const id = `rec-health-${health.snapshot_id}`;
    if (!isRecommendationDismissed(id, actorHumanId)) {
      recs.push({
        recommendation_id: id,
        recommendation_type: "health",
        title: "Communication health under strain",
        title_es: "Salud de comunicación bajo presión",
        why: `${health.stalled_threads} stalled thread(s), ${health.pending_decisions} pending decision(s).`,
        why_es: "Hilos estancados y decisiones pendientes detectados.",
        confidence: "high",
        confidence_score: 0.7,
        evidence: [{ signal_id: health.snapshot_id, source: "communication_health", summary: health.overall_health_band }],
        uncertainty_notes: ["Health scores are derived projections — not authoritative status."],
        suggested_action: "Review executive brief and prioritize stalled threads.",
        suggested_action_es: "Revisa el informe ejecutivo y prioriza hilos estancados.",
        dismissible: true,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}
