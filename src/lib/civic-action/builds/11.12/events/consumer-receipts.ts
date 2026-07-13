/**
 * CAE-11.12-W5 — Consumer idempotency receipts
 */
import { nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type KnowledgeConsumerReceipt = {
  consumer_name: string;
  event_id: string;
  processed_at: string;
  result: "processed" | "skipped" | "failed";
};

const RECEIPTS_KEY = "knowledge_consumer_receipts";

export function wasEventProcessed(consumerName: string, eventId: string): boolean {
  return readStoreSlice<KnowledgeConsumerReceipt>(RECEIPTS_KEY).some(
    (r) => r.consumer_name === consumerName && r.event_id === eventId && r.result === "processed"
  );
}

export function recordConsumerReceipt(
  consumerName: string,
  eventId: string,
  result: KnowledgeConsumerReceipt["result"]
) {
  const receipts = readStoreSlice<KnowledgeConsumerReceipt>(RECEIPTS_KEY);
  if (receipts.some((r) => r.consumer_name === consumerName && r.event_id === eventId)) return;
  receipts.push({ consumer_name: consumerName, event_id: eventId, processed_at: nowIso(), result });
  writeStoreSlice(RECEIPTS_KEY, receipts);
}
