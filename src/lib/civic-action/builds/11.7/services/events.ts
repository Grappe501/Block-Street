/**
 * CAE-11.7-W3 — Communication domain events and outbox
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice, COMMUNICATION_OUTBOX_KEY, COMMUNICATION_DOMAIN_EVENTS_KEY } from "./repository";

export const COMMUNICATION_DOMAIN_EVENT_TYPES = [
  "communication.conversation_created",
  "communication.thread_opened",
  "communication.message_posted",
  "communication.message_edited",
  "communication.decision_recorded",
  "communication.meeting_created",
  "communication.announcement_published",
  "communication.document_created",
  "communication.conversation_archived",
  "communication.ai_summary_generated",
  "communication.action_item_created",
  "communication.thread_resolved",
] as const;

export type CommunicationDomainEventType = (typeof COMMUNICATION_DOMAIN_EVENT_TYPES)[number];

export interface CommunicationDomainEvent {
  event_id: string;
  event_type: CommunicationDomainEventType;
  event_version: number;
  occurred_at: string;
  entity_id: string;
  entity_type: string;
  initiative_id: string;
  institution_id: string;
  actor_human_id_optional: string | null;
  service_identity_id_optional: string | null;
  source_command_id: string;
  request_id: string;
  correlation_id: string;
  entity_version: number;
  payload: Record<string, unknown>;
}

export interface CommunicationEventOutboxRecord {
  event_id: string;
  entity_id: string;
  entity_type: string;
  event_type: string;
  payload: Record<string, unknown>;
  occurred_at: string;
  published_at: string | null;
  attempt_count: number;
  status: "pending" | "published" | "failed";
  notification_requested: boolean;
}

export function publishCommunicationEvent(
  input: Omit<CommunicationDomainEvent, "event_id" | "occurred_at" | "event_version">
) {
  const event: CommunicationDomainEvent = {
    ...input,
    event_id: caeId("com"),
    event_version: 1,
    occurred_at: nowIso(),
  };
  const outbox = readStoreSlice<CommunicationEventOutboxRecord>(COMMUNICATION_OUTBOX_KEY);
  outbox.push({
    event_id: event.event_id,
    entity_id: event.entity_id,
    entity_type: event.entity_type,
    event_type: event.event_type,
    payload: { ...event.payload, entity_version: event.entity_version },
    occurred_at: event.occurred_at,
    published_at: null,
    attempt_count: 0,
    status: "pending",
    notification_requested: true,
  });
  writeStoreSlice(COMMUNICATION_OUTBOX_KEY, outbox);
  const events = readStoreSlice<CommunicationDomainEvent>(COMMUNICATION_DOMAIN_EVENTS_KEY);
  events.push(event);
  writeStoreSlice(COMMUNICATION_DOMAIN_EVENTS_KEY, events);
  return event;
}

export function listPendingCommunicationOutbox(limit = 50) {
  return readStoreSlice<CommunicationEventOutboxRecord>(COMMUNICATION_OUTBOX_KEY)
    .filter((e) => e.status === "pending")
    .slice(0, limit);
}

export const CommunicationEventPublisher = {
  publish: publishCommunicationEvent,
  listPending: listPendingCommunicationOutbox,
};
