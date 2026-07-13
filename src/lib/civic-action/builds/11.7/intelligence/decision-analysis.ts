/**
 * CAE-11.7-W6 — Decision tracking with related missions
 */
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { DecisionRecord } from "../data-model";

export type DecisionIntelligenceInsight = {
  decision_id: string;
  conversation_id: string;
  decision_text: string;
  status: string;
  days_since_decision: number;
  related_mission_ids: string[];
  pending_followup: boolean;
  explanation: string;
};

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function analyzeDecisions(institutionId: string, initiativeId?: string): DecisionIntelligenceInsight[] {
  let decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId
  );
  if (initiativeId) decisions = decisions.filter((d) => d.initiative_id === initiativeId);

  return decisions.map((decision) => {
    const conv = communicationApplicationService.getConversation(decision.conversation_id);
    const missionIds = conv?.mission_id_optional ? [conv.mission_id_optional] : [];
    const days = daysSince(decision.updated_at);
    const pending = decision.lifecycle_state === "proposed" || decision.lifecycle_state === "draft";

    return {
      decision_id: decision.canonical_id,
      conversation_id: decision.conversation_id,
      decision_text: decision.decision_text,
      status: decision.lifecycle_state,
      days_since_decision: days,
      related_mission_ids: missionIds,
      pending_followup: pending,
      explanation: pending
        ? "Decision remains in draft or proposed state — governance review may be needed."
        : `Decision recorded ${days} day(s) ago.`,
    };
  });
}

export function listPendingDecisions(institutionId: string, initiativeId?: string): DecisionIntelligenceInsight[] {
  return analyzeDecisions(institutionId, initiativeId).filter((d) => d.pending_followup);
}
