/**
 * CAE-11.7-W5 — Analytics projection (derived read model; not source of truth)
 */
import { communicationApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type CommunicationOperationalProjection = {
  conversation_id: string;
  initiative_id: string;
  institution_id: string;
  lifecycle_state: string;
  context_type: string;
  thread_count: number;
  message_count: number;
  decision_count: number;
  action_item_count: number;
  health: string;
  updated_at: string;
  source_sequence: string;
  projection_status: "current" | "delayed" | "rebuilding" | "unavailable";
  last_updated_at: string;
};

const PROJECTION_KEY = "communication_operational_projections";

export function projectCommunicationAnalytics(record: CommunicationEventOutboxRecord) {
  const conversationId =
    record.entity_type === "conversation" || record.entity_type === "Conversation"
      ? record.entity_id
      : (record.payload.conversation_id as string) ?? record.entity_id;
  const bundle = communicationApplicationService.getConversationBundle(conversationId);
  if (!bundle) return null;

  const { conversation, threads, messages, decisions, actionItems } = bundle;
  const projection: CommunicationOperationalProjection = {
    conversation_id: conversation.canonical_id,
    initiative_id: conversation.initiative_id,
    institution_id: conversation.institution_id,
    lifecycle_state: conversation.lifecycle_state,
    context_type: conversation.context_type,
    thread_count: threads.length,
    message_count: messages.length,
    decision_count: decisions.length,
    action_item_count: actionItems.length,
    health:
      conversation.lifecycle_state === "archived"
        ? "archived"
        : conversation.lifecycle_state === "active"
          ? "healthy"
          : "building",
    updated_at: conversation.updated_at,
    source_sequence: record.event_id,
    projection_status: "current",
    last_updated_at: nowIso(),
  };

  const all = readStoreSlice<CommunicationOperationalProjection>(PROJECTION_KEY);
  const next = all.filter((p) => p.conversation_id !== conversation.canonical_id);
  next.push(projection);
  writeStoreSlice(PROJECTION_KEY, next);
  return projection;
}

export function listCommunicationOperationalProjections(institutionId?: string, initiativeId?: string) {
  let all = readStoreSlice<CommunicationOperationalProjection>(PROJECTION_KEY);
  if (institutionId) all = all.filter((p) => p.institution_id === institutionId);
  if (initiativeId) all = all.filter((p) => p.initiative_id === initiativeId);
  return all;
}
