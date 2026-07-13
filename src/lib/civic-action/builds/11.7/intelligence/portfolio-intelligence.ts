/**
 * CAE-11.7-W6 — Communication portfolio intelligence
 */
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { DecisionRecord, ThreadRecord } from "../data-model";
import { computeCommunicationHealth } from "./communication-health";
import type { CommunicationPortfolioIntelligence } from "./contracts";

export function assembleCommunicationPortfolio(
  institutionId: string,
  initiativeId?: string
): CommunicationPortfolioIntelligence {
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  const active = conversations.filter((c) => c.lifecycle_state === "active" || c.lifecycle_state === "open").length;
  const threads = readStoreSlice<ThreadRecord>(COMMUNICATION_STORE_KEYS.threads);
  const convIds = new Set(conversations.map((c) => c.canonical_id));
  const unresolved = threads.filter((t) => convIds.has(t.conversation_id) && !t.resolved).length;

  let decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId
  );
  if (initiativeId) decisions = decisions.filter((d) => d.initiative_id === initiativeId);
  const pending = decisions.filter((d) => d.lifecycle_state === "draft" || d.lifecycle_state === "proposed").length;

  const health = computeCommunicationHealth(institutionId, initiativeId);

  return {
    institution_id: institutionId,
    initiative_id_optional: initiativeId,
    total_conversations: conversations.length,
    active_conversations: active,
    unresolved_threads: unresolved,
    pending_decisions: pending,
    health_summary: `Overall health: ${health.overall_health_band}`,
    advisory_only: true,
  };
}
