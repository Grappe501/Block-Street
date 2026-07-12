/**
 * CAE-11.1-W3 — Initiative domain events and outbox
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "./repository";

export const INITIATIVE_DOMAIN_EVENT_TYPES = [
  "initiative.draft_created",
  "initiative.submitted_for_review",
  "initiative.approved",
  "initiative.activated",
  "initiative.paused",
  "initiative.resumed",
  "initiative.marked_at_risk",
  "initiative.owner_assigned",
  "initiative.owner_transferred",
  "initiative.owner_became_ineligible",
  "initiative.scope_change_requested",
  "initiative.dependency_added",
  "initiative.closeout_started",
  "initiative.completed",
  "initiative.cancelled",
  "initiative.archived",
  "initiative.successor_created",
  "initiative.restoration_requested",
] as const;

export type InitiativeDomainEventType = (typeof INITIATIVE_DOMAIN_EVENT_TYPES)[number];

export interface InitiativeDomainEvent {
  event_id: string;
  event_type: InitiativeDomainEventType;
  event_version: number;
  occurred_at: string;
  initiative_id: string;
  institution_id: string;
  actor_human_id_optional: string | null;
  service_identity_id_optional: string | null;
  source_command_id: string;
  request_id: string;
  correlation_id: string;
  initiative_version: number;
  payload: Record<string, unknown>;
}

export interface InitiativeEventOutboxRecord {
  event_id: string;
  initiative_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  occurred_at: string;
  published_at: string | null;
  attempt_count: number;
  status: "pending" | "published" | "failed";
}

export function publishDomainEvent(input: Omit<InitiativeDomainEvent, "event_id" | "occurred_at" | "event_version">) {
  const event: InitiativeDomainEvent = {
    ...input,
    event_id: caeId("iev"),
    event_version: 1,
    occurred_at: nowIso(),
  };
  const outbox = readStoreSlice<InitiativeEventOutboxRecord>("initiative_event_outbox");
  outbox.push({
    event_id: event.event_id,
    initiative_id: event.initiative_id,
    event_type: event.event_type,
    payload: { ...event.payload, initiative_version: event.initiative_version },
    occurred_at: event.occurred_at,
    published_at: null,
    attempt_count: 0,
    status: "pending",
  });
  writeStoreSlice("initiative_event_outbox", outbox);
  const events = readStoreSlice<InitiativeDomainEvent>("initiative_domain_events");
  events.push(event);
  writeStoreSlice("initiative_domain_events", events);
  return event;
}

export function listPendingOutboxEvents(limit = 50) {
  return readStoreSlice<InitiativeEventOutboxRecord>("initiative_event_outbox")
    .filter((e) => e.status === "pending")
    .slice(0, limit);
}
