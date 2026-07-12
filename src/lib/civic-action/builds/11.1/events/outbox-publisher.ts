/**
 * CAE-11.1-W5 — Outbox publisher (at-least-once delivery)
 */
import { nowIso } from "../../../utils";
import { listPendingOutboxEvents } from "../services/events";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InitiativeEventOutboxRecord } from "../services/events";
import { recordConsumerReceipt, wasEventProcessed } from "./consumer-receipts";
import { dispatchInitiativeIntegrations } from "../integrations/dispatch";

export type OutboxStatus = InitiativeEventOutboxRecord["status"] | "publishing" | "retrying" | "dead_letter";

export function publishPendingOutboxEvents(limit = 50) {
  const pending = listPendingOutboxEvents(limit);
  const published: string[] = [];
  const failed: string[] = [];

  for (const record of pending) {
    try {
      markOutboxStatus(record.event_id, "publishing");
      dispatchInitiativeIntegrations(record);
      markOutboxPublished(record.event_id);
      published.push(record.event_id);
    } catch (error) {
      markOutboxFailed(record.event_id, error instanceof Error ? error.message : "publish failed");
      failed.push(record.event_id);
    }
  }

  return { published, failed, processed: pending.length };
}

function markOutboxStatus(eventId: string, status: OutboxStatus) {
  const outbox = readStoreSlice<InitiativeEventOutboxRecord & { last_error?: string }>("initiative_event_outbox");
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = { ...outbox[idx], status: status as InitiativeEventOutboxRecord["status"] };
  writeStoreSlice("initiative_event_outbox", outbox);
}

function markOutboxPublished(eventId: string) {
  const outbox = readStoreSlice<InitiativeEventOutboxRecord>("initiative_event_outbox");
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = { ...outbox[idx], status: "published", published_at: nowIso(), attempt_count: outbox[idx].attempt_count + 1 };
  writeStoreSlice("initiative_event_outbox", outbox);
}

function markOutboxFailed(eventId: string, message: string) {
  const outbox = readStoreSlice<InitiativeEventOutboxRecord & { last_error?: string }>("initiative_event_outbox");
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  const attempts = outbox[idx].attempt_count + 1;
  outbox[idx] = {
    ...outbox[idx],
    attempt_count: attempts,
    status: attempts >= 5 ? "failed" : "pending",
    last_error: message,
  };
  writeStoreSlice("initiative_event_outbox", outbox);
}

export function processOutboxForConsumer(consumerName: string, record: InitiativeEventOutboxRecord) {
  if (wasEventProcessed(consumerName, record.event_id)) {
    return { skipped: true, reason: "already_processed" as const };
  }
  dispatchInitiativeIntegrations(record, { consumer: consumerName });
  recordConsumerReceipt(consumerName, record.event_id, "processed");
  return { skipped: false, reason: null };
}
