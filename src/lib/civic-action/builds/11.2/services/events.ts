/**
 * CAE-11.2-W3 — Execution domain events and outbox
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "./repository";
import { EXECUTION_DOMAIN_EVENTS_KEY, EXECUTION_OUTBOX_KEY } from "./repository";

export const EXECUTION_DOMAIN_EVENT_TYPES = [
  "execution.objective_created",
  "execution.objective_proposed",
  "execution.objective_approved",
  "execution.objective_activated",
  "execution.objective_archived",
  "execution.mission_created",
  "execution.mission_assigned",
  "execution.mission_started",
  "execution.mission_completed",
  "execution.task_created",
  "execution.task_assigned",
  "execution.task_completed",
  "execution.evidence_attached",
  "execution.outcome_recorded",
] as const;

export type ExecutionDomainEventType = (typeof EXECUTION_DOMAIN_EVENT_TYPES)[number];

export interface ExecutionDomainEvent {
  event_id: string;
  event_type: ExecutionDomainEventType;
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

export interface ExecutionEventOutboxRecord {
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

export function publishExecutionEvent(input: Omit<ExecutionDomainEvent, "event_id" | "occurred_at" | "event_version">) {
  const event: ExecutionDomainEvent = {
    ...input,
    event_id: caeId("exe"),
    event_version: 1,
    occurred_at: nowIso(),
  };
  const outbox = readStoreSlice<ExecutionEventOutboxRecord>(EXECUTION_OUTBOX_KEY);
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
  writeStoreSlice(EXECUTION_OUTBOX_KEY, outbox);
  const events = readStoreSlice<ExecutionDomainEvent>(EXECUTION_DOMAIN_EVENTS_KEY);
  events.push(event);
  writeStoreSlice(EXECUTION_DOMAIN_EVENTS_KEY, events);
  return event;
}

export function listPendingExecutionOutbox(limit = 50) {
  return readStoreSlice<ExecutionEventOutboxRecord>(EXECUTION_OUTBOX_KEY)
    .filter((e) => e.status === "pending")
    .slice(0, limit);
}

/** CanonicalEventPublisher — sole event emission path */
export const ExecutionEventPublisher = {
  publish: publishExecutionEvent,
  listPending: listPendingExecutionOutbox,
};
