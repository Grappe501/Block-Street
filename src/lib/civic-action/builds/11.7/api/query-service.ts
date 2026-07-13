/**
 * CAE-11.7-W5 — Communication query handlers (read-only; no domain mutation)
 */
import { communicationApplicationService } from "../application-service";
import { CommunicationDomainError } from "../services/errors";
import { readStoreSlice } from "../services/repository";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import type { DecisionRecord, DocumentRecord, MeetingRecord, MessageRecord } from "../data-model";
import { assembleConversationView } from "./assemble-conversation-view";
import type {
  CommunicationApiContext,
  ConversationListQuery,
  MessageListQuery,
} from "./contracts";

function institutionFilter(entity: { institution_id: string }, institutionId: string) {
  return entity.institution_id === institutionId;
}

function visibilityAllowed(entity: { institution_id: string }, apiCtx: CommunicationApiContext): boolean {
  if (entity.institution_id !== apiCtx.institution_id) return false;
  return (
    apiCtx.effective_permissions.includes("civic_action.view") ||
    apiCtx.effective_permissions.includes("civic_action.manage") ||
    apiCtx.effective_permissions.includes("communication.message.post")
  );
}

export function queryConversationCollection(apiCtx: CommunicationApiContext, query: ConversationListQuery) {
  const limit = Math.min(query.limit ?? 25, 100);
  let offset = 0;
  if (query.cursor) {
    const parsed = Number.parseInt(Buffer.from(query.cursor, "base64url").toString("utf8"), 10);
    if (!Number.isNaN(parsed)) offset = parsed;
  }

  const institutionId = query.institution_id ?? apiCtx.institution_id;
  let items = communicationApplicationService
    .listAllConversations()
    .filter((c) => institutionFilter(c, institutionId))
    .filter((c) => visibilityAllowed(c, apiCtx));

  if (query.initiative_id) items = items.filter((c) => c.initiative_id === query.initiative_id);
  if (query.status) items = items.filter((c) => c.lifecycle_state === query.status);
  if (query.context_type) items = items.filter((c) => c.context_type === query.context_type);
  if (query.mission_id) items = items.filter((c) => c.mission_id_optional === query.mission_id);
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (c) => c.display_name.toLowerCase().includes(q) || c.purpose.toLowerCase().includes(q)
    );
  }

  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < items.length;

  return {
    items: page.map((c) => assembleConversationView(c, apiCtx)),
    meta: {
      total: items.length,
      cursor: hasMore ? Buffer.from(String(nextOffset)).toString("base64url") : null,
      has_more: hasMore,
    },
  };
}

export function getConversationDetail(conversationId: string, apiCtx: CommunicationApiContext) {
  const conversation = communicationApplicationService.getConversation(conversationId);
  if (!conversation || !visibilityAllowed(conversation, apiCtx)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_NOT_FOUND",
      message: "Conversation not found.",
      requirement_ids: ["CAE-11.7-W5-API-013"],
    });
  }
  const bundle = communicationApplicationService.getConversationBundle(conversationId);
  return {
    conversation: assembleConversationView(conversation, apiCtx),
    threads: bundle?.threads.map((t) => ({
      id: t.canonical_id,
      subject: t.subject,
      lifecycle_state: t.lifecycle_state,
      resolved: t.resolved,
    })),
    message_count: bundle?.messages.length ?? 0,
    decision_count: bundle?.decisions.length ?? 0,
  };
}

export function queryMessageCollection(apiCtx: CommunicationApiContext, query: MessageListQuery) {
  const limit = Math.min(query.limit ?? 50, 200);
  let offset = 0;
  if (query.cursor) {
    const parsed = Number.parseInt(Buffer.from(query.cursor, "base64url").toString("utf8"), 10);
    if (!Number.isNaN(parsed)) offset = parsed;
  }

  let items = readStoreSlice<MessageRecord>(COMMUNICATION_STORE_KEYS.messages).filter((m) =>
    visibilityAllowed(m, apiCtx)
  );

  if (query.conversation_id) items = items.filter((m) => m.conversation_id === query.conversation_id);
  if (query.thread_id) items = items.filter((m) => m.thread_id === query.thread_id);
  if (query.initiative_id) {
    const convIds = communicationApplicationService
      .listAllConversations()
      .filter((c) => c.initiative_id === query.initiative_id)
      .map((c) => c.canonical_id);
    items = items.filter((m) => convIds.includes(m.conversation_id));
  }

  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < items.length;

  return {
    items: page.map((m) => ({
      id: m.canonical_id,
      conversation_id: m.conversation_id,
      thread_id: m.thread_id,
      author_human_id: m.author_human_id,
      body: m.body,
      mention_human_ids: m.mention_human_ids,
      created_at: m.created_at,
      updated_at: m.updated_at,
    })),
    meta: {
      total: items.length,
      cursor: hasMore ? Buffer.from(String(nextOffset)).toString("base64url") : null,
      has_more: hasMore,
    },
  };
}

export function queryMeetingCollection(apiCtx: CommunicationApiContext, initiativeId?: string) {
  const institutionId = apiCtx.institution_id;
  let meetings = readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings).filter(
    (m) => m.institution_id === institutionId
  );
  if (initiativeId) meetings = meetings.filter((m) => m.initiative_id === initiativeId);
  return meetings.map((m) => ({
    id: m.canonical_id,
    display_name: m.display_name,
    lifecycle_state: m.lifecycle_state,
    scheduled_at: m.scheduled_at,
    initiative_id: m.initiative_id,
  }));
}

export function queryDecisionCollection(apiCtx: CommunicationApiContext, initiativeId?: string) {
  const institutionId = apiCtx.institution_id;
  let decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId
  );
  if (initiativeId) decisions = decisions.filter((d) => d.initiative_id === initiativeId);
  return decisions.map((d) => ({
    id: d.canonical_id,
    display_name: d.display_name,
    lifecycle_state: d.lifecycle_state,
    conversation_id: d.conversation_id,
    decision_text: d.decision_text,
  }));
}

export function queryDocumentCollection(apiCtx: CommunicationApiContext, initiativeId?: string) {
  const institutionId = apiCtx.institution_id;
  let documents = readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents).filter(
    (d) => d.institution_id === institutionId
  );
  if (initiativeId) documents = documents.filter((d) => d.initiative_id === initiativeId);
  return documents.map((d) => ({
    id: d.canonical_id,
    display_name: d.display_name,
    lifecycle_state: d.lifecycle_state,
    initiative_id: d.initiative_id,
  }));
}
