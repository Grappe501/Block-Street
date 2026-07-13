/**
 * CAE-11.12-W3 — Knowledge domain events and outbox
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice, KNOWLEDGE_OUTBOX_KEY, KNOWLEDGE_DOMAIN_EVENTS_KEY } from "./repository";

export const KNOWLEDGE_DOMAIN_EVENT_TYPES = [
  "knowledge.artifact_created",
  "knowledge.artifact_edited",
  "knowledge.artifact_submitted_for_review",
  "knowledge.artifact_review_completed",
  "knowledge.artifact_validated",
  "knowledge.artifact_approved",
  "knowledge.artifact_published",
  "knowledge.claim_created",
  "knowledge.citation_attached",
  "knowledge.course_created",
  "knowledge.course_version_published",
  "knowledge.enrollment_created",
  "knowledge.learning_progress_recorded",
  "knowledge.learning_completed",
  "knowledge.competency_verified",
  "knowledge.assessment_attempt_started",
  "knowledge.assessment_evaluated",
  "knowledge.certification_eligibility_evaluated",
  "knowledge.certification_awarded",
  "knowledge.ai_suggestion_created",
  "knowledge.ai_suggestion_reviewed",
  "knowledge.translation_draft_created",
  "knowledge.translation_approved",
  "knowledge.correction_reported",
  "knowledge.conflict_identified",
] as const;

export type KnowledgeDomainEventType = (typeof KNOWLEDGE_DOMAIN_EVENT_TYPES)[number];

export interface KnowledgeDomainEvent {
  event_id: string;
  event_type: KnowledgeDomainEventType;
  event_version: number;
  occurred_at: string;
  entity_id: string;
  entity_type: string;
  institution_id: string;
  initiative_id_optional: string | null;
  actor_human_id_optional: string | null;
  service_identity_id_optional: string | null;
  source_command_id: string;
  request_id: string;
  correlation_id: string;
  entity_version: number;
  payload: Record<string, unknown>;
}

export interface KnowledgeEventOutboxRecord {
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

export function publishKnowledgeEvent(
  input: Omit<KnowledgeDomainEvent, "event_id" | "occurred_at" | "event_version">
) {
  const event: KnowledgeDomainEvent = {
    ...input,
    event_id: caeId("knw"),
    event_version: 1,
    occurred_at: nowIso(),
  };
  const outbox = readStoreSlice<KnowledgeEventOutboxRecord>(KNOWLEDGE_OUTBOX_KEY);
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
  writeStoreSlice(KNOWLEDGE_OUTBOX_KEY, outbox);
  const events = readStoreSlice<KnowledgeDomainEvent>(KNOWLEDGE_DOMAIN_EVENTS_KEY);
  events.push(event);
  writeStoreSlice(KNOWLEDGE_DOMAIN_EVENTS_KEY, events);
  return event;
}

export function listPendingKnowledgeOutbox(limit = 50) {
  return readStoreSlice<KnowledgeEventOutboxRecord>(KNOWLEDGE_OUTBOX_KEY)
    .filter((e) => e.status === "pending")
    .slice(0, limit);
}

export const KnowledgeEventPublisher = {
  publish: publishKnowledgeEvent,
  listPending: listPendingKnowledgeOutbox,
};
