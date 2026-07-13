/**
 * CAE-11.12-W5 — Outbox publisher (at-least-once delivery)
 */
import { nowIso } from "../../../utils";
import { listPendingKnowledgeOutbox } from "../services/events";
import { readStoreSlice, writeStoreSlice, KNOWLEDGE_OUTBOX_KEY } from "../services/repository";
import type { KnowledgeEventOutboxRecord } from "../services/events";
import { recordConsumerReceipt, wasEventProcessed } from "./consumer-receipts";
import { dispatchKnowledgeIntegrations } from "../integrations/dispatch";

export type OutboxStatus = KnowledgeEventOutboxRecord["status"] | "publishing" | "retrying" | "dead_letter";

export function publishPendingKnowledgeOutboxEvents(limit = 50) {
  const pending = listPendingKnowledgeOutbox(limit);
  const published: string[] = [];
  const failed: string[] = [];

  for (const record of pending) {
    try {
      markOutboxStatus(record.event_id, "publishing");
      dispatchKnowledgeIntegrations(record);
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
  const outbox = readStoreSlice<KnowledgeEventOutboxRecord>(KNOWLEDGE_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = { ...outbox[idx], status: status as KnowledgeEventOutboxRecord["status"] };
  writeStoreSlice(KNOWLEDGE_OUTBOX_KEY, outbox);
}

function markOutboxPublished(eventId: string) {
  const outbox = readStoreSlice<KnowledgeEventOutboxRecord>(KNOWLEDGE_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  outbox[idx] = {
    ...outbox[idx],
    status: "published",
    published_at: nowIso(),
    attempt_count: outbox[idx].attempt_count + 1,
  };
  writeStoreSlice(KNOWLEDGE_OUTBOX_KEY, outbox);
}

function markOutboxFailed(eventId: string, message: string) {
  const outbox = readStoreSlice<KnowledgeEventOutboxRecord & { last_error?: string }>(KNOWLEDGE_OUTBOX_KEY);
  const idx = outbox.findIndex((e) => e.event_id === eventId);
  if (idx < 0) return;
  const attempts = outbox[idx].attempt_count + 1;
  outbox[idx] = {
    ...outbox[idx],
    attempt_count: attempts,
    status: attempts >= 5 ? "failed" : "pending",
    last_error: message,
  };
  writeStoreSlice(KNOWLEDGE_OUTBOX_KEY, outbox);
}

export function processOutboxForConsumer(consumerName: string, record: KnowledgeEventOutboxRecord) {
  if (wasEventProcessed(consumerName, record.event_id)) {
    return { skipped: true, reason: "already_processed" as const };
  }
  dispatchKnowledgeIntegrations(record, { consumer: consumerName });
  recordConsumerReceipt(consumerName, record.event_id, "processed");
  return { skipped: false, reason: null };
}
