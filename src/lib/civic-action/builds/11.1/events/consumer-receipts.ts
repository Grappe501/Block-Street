/**
 * CAE-11.1-W5 — Consumer idempotency receipts
 */
import { nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type InitiativeConsumerReceipt = {
  consumer_name: string;
  event_id: string;
  processed_at: string;
  result: "processed" | "skipped" | "failed";
};

export function wasEventProcessed(consumerName: string, eventId: string): boolean {
  return readStoreSlice<InitiativeConsumerReceipt>("initiative_consumer_receipts").some(
    (r) => r.consumer_name === consumerName && r.event_id === eventId && r.result === "processed"
  );
}

export function recordConsumerReceipt(consumerName: string, eventId: string, result: InitiativeConsumerReceipt["result"]) {
  const receipts = readStoreSlice<InitiativeConsumerReceipt>("initiative_consumer_receipts");
  if (receipts.some((r) => r.consumer_name === consumerName && r.event_id === eventId)) return;
  receipts.push({ consumer_name: consumerName, event_id: eventId, processed_at: nowIso(), result });
  writeStoreSlice("initiative_consumer_receipts", receipts);
}
