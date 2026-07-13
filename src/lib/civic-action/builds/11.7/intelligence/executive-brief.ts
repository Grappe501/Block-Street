/**
 * CAE-11.7-W6 — Executive communication brief (5-minute read)
 */
import { caeId, nowIso } from "../../../utils";
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { MeetingRecord } from "../data-model";
import { generateCommunicationRecommendations } from "./recommendation-engine";
import { computeCommunicationHealth } from "./communication-health";
import { detectEmergingFaqs } from "./knowledge-intelligence";
import type { ExecutiveCommunicationBrief } from "./contracts";

export function generateExecutiveCommunicationBrief(
  institutionId: string,
  actorHumanId: string,
  initiativeId?: string
): ExecutiveCommunicationBrief {
  const recs = generateCommunicationRecommendations(institutionId, actorHumanId, { initiativeId });
  const health = computeCommunicationHealth(institutionId, initiativeId);

  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  const atRisk = conversations.filter(
    (c) => c.lifecycle_state === "active" && health.stalled_threads > 0
  ).length;

  const momentum =
    health.overall_health_band === "healthy"
      ? "Stable communication momentum"
      : health.overall_health_band === "watch"
        ? "Mixed momentum — monitor stalled threads"
        : "Communication flow under pressure";

  const meetings = readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings)
    .filter((m) => m.institution_id === institutionId && m.lifecycle_state === "scheduled")
    .map((m) => `${m.display_name}: ${m.scheduled_at ?? "TBD"}`)
    .slice(0, 5);

  const knowledgeGaps = detectEmergingFaqs(institutionId, initiativeId)
    .slice(0, 3)
    .map((f) => `FAQ theme: ${f.question_theme} (${f.occurrence_count}x)`);

  return {
    brief_id: caeId("cbrf"),
    institution_id: institutionId,
    initiative_id_optional: initiativeId,
    generated_at: nowIso(),
    todays_priorities: recs
      .filter((r) => r.recommendation_type === "warning" || r.recommendation_type === "duplicate")
      .slice(0, 5),
    conversations_at_risk: atRisk,
    communication_momentum: momentum,
    critical_health_signals: [
      `Response score: ${health.response_time_score}`,
      `Decision latency score: ${health.decision_latency_score}`,
      `Meeting efficiency score: ${health.meeting_efficiency_score}`,
    ],
    pending_decisions: [
      health.pending_decisions > 0
        ? `Review ${health.pending_decisions} pending decision(s).`
        : "No decisions flagged as pending.",
      health.unanswered_questions > 0
        ? `Address ${health.unanswered_questions} unanswered question(s).`
        : "No unanswered questions flagged.",
    ],
    suggested_conversations: [
      "Align conversation owners on stalled threads.",
      "Confirm meeting follow-ups and action items.",
    ],
    upcoming_meetings: meetings,
    knowledge_gaps: knowledgeGaps.length > 0 ? knowledgeGaps : ["No emerging FAQ themes detected."],
    reading_time_minutes: 5,
  };
}
