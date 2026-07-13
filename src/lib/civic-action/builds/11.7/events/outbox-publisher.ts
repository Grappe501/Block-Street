/**
 * CAE-11.7-W5 — Outbox publisher (at-least-once delivery)
 */
import { nowIso } from "../../../utils";
import { listPendingCommunicationOutbox } from "../services/events";
import { readStoreSlice, writeStoreSlice, COMMUNICATION_OUTBOX_KEY } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";
import { recordConsumerReceipt, wasEventProcessed } from "./consumer-receipts";
import { dispatchCommunicationIntegrations } from "../integrations/dispatch";

export type OutboxStatus = CommunicationEventOutboxRecord["status"] | "publishing" | "retrying" | "dead_letter";

export type OutboxPublishMetrics = {
  processed: number;
  published: number;
  failed: number;
  duration_ms: number;
};

export function publishPendingCommunicationOutbox(limit = 50): OutboxPublishMetrics & {
  published_ids: string[];
  failed_ids: string[];
} {
  const start = Date.now();
  const pending = listPendingCommunicationOutbox(limit);
  const published: string[] = [];
  const failed: string[] = [];

  for (const record of pending) {
    try {
      markOutboxStatus(record.event_id, "publishing");
      dispatchCommunicationIntegrations(record);
      markOutboxPublished(record.event_id);
      published.push(record.event_id);
    } catch (error) {
      markOutboxFailed(record.event_id, error instanceof Error ? error.message : "publish failed");
      failed.push(record.event_id);
    }
  }

  return {
    processed: pending.length,
    published: published.length,
    failed: failed.length,
    duration_ms: Date.now() - start,
    published_ids: published,
    failed_ids: failed,
  };
}

function markOutboxStatus(eventId: string, status: OutboxStatus) {
  const outbox = readStoreSlice<CommunicationEventOutboxRecord>(COMMUNICATION_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = { ...outbox[idx], status: status as CommunicationEventOutboxRecord["status"] };
  writeStoreSlice(COMMUNICATION_OUTBOX_KEY, outbox);
}

function markOutboxPublished(eventId: string) {
  const outbox = readStoreSlice<CommunicationEventOutboxRecord>(COMMUNICATION_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = {
    ...outbox[idx],
    status: "published",
    published_at: nowIso(),
    attempt_count: outbox[idx].attempt_count + 1,
  };
  writeStoreSlice(COMMUNICATION_OUTBOX_KEY, outbox);
}

function markOutboxFailed(eventId: string, message: string) {
  const outbox = readStoreSlice<CommunicationEventOutboxRecord & { last_error?: string }>(COMMUNICATION_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  const attempts = outbox[idx].attempt_count + 1;
  outbox[idx] = {
    ...outbox[idx],
    attempt_count: attempts,
    status: attempts >= 5 ? "failed" : "pending",
    last_error: message,
  };
  writeStoreSlice(COMMUNICATION_OUTBOX_KEY, outbox);
}

export function processOutboxForConsumer(consumerName: string, record: CommunicationEventOutboxRecord) {
  if (wasEventProcessed(consumerName, record.event_id)) {
    return { skipped: true, reason: "already_processed" as const };
  }
  dispatchCommunicationIntegrations(record, { consumer: consumerName });
  recordConsumerReceipt(consumerName, record.event_id, "processed");
  return { skipped: false, reason: null };
}

export function listPendingOutboxForAdmin(limit = 100) {
  return listPendingCommunicationOutbox(limit);
}
