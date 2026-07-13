/**
 * CAE-11.12-W5 — Webhook delivery (signed, replay-resistant)
 */
import { createHmac, randomBytes } from "crypto";
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { KnowledgeEventOutboxRecord } from "../services/events";

export type KnowledgeWebhookSubscription = {
  id: string;
  institution_id: string;
  consumer_name: string;
  destination: string;
  event_types: string[];
  event_versions: number[];
  secret_reference: string;
  status: "active" | "paused";
  created_by: string;
  expires_at: string | null;
};

const SUBS_KEY = "knowledge_webhook_subscriptions";
const DELIVERY_KEY = "knowledge_webhook_deliveries";
const SECRETS_KEY = "knowledge_webhook_secrets";

export function createWebhookSubscription(input: Omit<KnowledgeWebhookSubscription, "id" | "secret_reference">) {
  const secret = randomBytes(32).toString("hex");
  const secretRef = caeId("kwhs");
  const secrets = readStoreSlice<{ ref: string; secret: string }>(SECRETS_KEY);
  secrets.push({ ref: secretRef, secret });
  writeStoreSlice(SECRETS_KEY, secrets);

  const sub: KnowledgeWebhookSubscription = {
    ...input,
    id: caeId("kwhk"),
    secret_reference: secretRef,
  };
  const subs = readStoreSlice<KnowledgeWebhookSubscription>(SUBS_KEY);
  subs.push(sub);
  writeStoreSlice(SUBS_KEY, subs);
  return { subscription: sub, signing_secret: secret };
}

export function signWebhookPayload(secret: string, timestamp: string, body: string) {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function verifyWebhookSignature(
  secret: string,
  timestamp: string,
  body: string,
  signature: string,
  maxSkewSeconds = 300
) {
  const ts = Number.parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > maxSkewSeconds) return false;
  return signWebhookPayload(secret, timestamp, body) === signature;
}

export function enqueueKnowledgeWebhookDeliveries(record: KnowledgeEventOutboxRecord) {
  const subs = readStoreSlice<KnowledgeWebhookSubscription>(SUBS_KEY).filter(
    (s) => s.status === "active" && s.event_types.includes(record.event_type)
  );
  const deliveries = readStoreSlice<{ delivery_id: string; subscription_id: string; event_id: string; status: string }>(
    DELIVERY_KEY
  );
  for (const sub of subs) {
    deliveries.push({
      delivery_id: caeId("kwd"),
      subscription_id: sub.id,
      event_id: record.event_id,
      status: "pending",
    });
  }
  writeStoreSlice(DELIVERY_KEY, deliveries);
  return subs.length;
}
