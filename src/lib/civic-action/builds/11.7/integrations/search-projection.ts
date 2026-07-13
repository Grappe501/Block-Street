/**
 * CAE-11.7-W5 — Communication search projection (visibility-scoped fields only)
 */
import { communicationApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type CommunicationSearchDocument = {
  conversation_id: string;
  initiative_id: string;
  institution_id: string;
  display_name: string;
  context_type: string;
  lifecycle_state: string;
  purpose_summary: string;
  mission_id_optional: string | null;
  updated_at: string;
};

const INDEX_KEY = "communication_search_index";

export function projectCommunicationSearchDocument(
  entityId: string,
  entityType: string
): CommunicationSearchDocument | null {
  if (entityType === "conversation" || entityType === "Conversation") {
    const conversation = communicationApplicationService.getConversation(entityId);
    if (!conversation) return null;
    return {
      conversation_id: conversation.canonical_id,
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      display_name: conversation.display_name,
      context_type: conversation.context_type,
      lifecycle_state: conversation.lifecycle_state,
      purpose_summary: conversation.purpose.slice(0, 280),
      mission_id_optional: conversation.mission_id_optional,
      updated_at: conversation.updated_at,
    };
  }
  const bundle = communicationApplicationService.getConversationBundle(entityId);
  if (bundle) {
    const c = bundle.conversation;
    return {
      conversation_id: c.canonical_id,
      initiative_id: c.initiative_id,
      institution_id: c.institution_id,
      display_name: c.display_name,
      context_type: c.context_type,
      lifecycle_state: c.lifecycle_state,
      purpose_summary: c.purpose.slice(0, 280),
      mission_id_optional: c.mission_id_optional,
      updated_at: c.updated_at,
    };
  }
  return null;
}

export function upsertCommunicationSearchIndex(doc: CommunicationSearchDocument) {
  const index = readStoreSlice<CommunicationSearchDocument>(INDEX_KEY);
  const next = index.filter((d) => d.conversation_id !== doc.conversation_id);
  next.push(doc);
  writeStoreSlice(INDEX_KEY, next);
}

export function searchCommunications(input: {
  institution_id: string;
  initiative_id?: string;
  query?: string;
  include_archived?: boolean;
}) {
  let docs = readStoreSlice<CommunicationSearchDocument>(INDEX_KEY).filter(
    (d) => d.institution_id === input.institution_id
  );

  if (input.initiative_id) docs = docs.filter((d) => d.initiative_id === input.initiative_id);
  if (!input.include_archived) docs = docs.filter((d) => d.lifecycle_state !== "archived");

  if (input.query) {
    const q = input.query.toLowerCase();
    docs = docs.filter(
      (d) => d.display_name.toLowerCase().includes(q) || d.purpose_summary.toLowerCase().includes(q)
    );
  }

  return docs.map((d) => ({
    conversation_id: d.conversation_id,
    initiative_id: d.initiative_id,
    display_name: d.display_name,
    context_type: d.context_type,
    lifecycle_state: d.lifecycle_state,
    institution_id: d.institution_id,
    purpose_summary: d.purpose_summary,
    mission_id_optional: d.mission_id_optional,
  }));
}
