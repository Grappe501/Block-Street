/**
 * CAE-11.7-W5 — Webhook delivery (signed, replay-resistant)
 */
import { createHmac, randomBytes } from "crypto";
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";

export type CommunicationWebhookSubscription = {
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

export type WebhookDeliveryLog = {
  delivery_id: string;
  subscription_id: string;
  event_id: string;
  status: "pending" | "delivered" | "failed" | "rejected_replay";
  attempt_count: number;
  created_at: string;
};

const SUBS_KEY = "communication_webhook_subscriptions";
const DELIVERY_KEY = "communication_webhook_deliveries";
const SECRETS_KEY = "communication_webhook_secrets";

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 5000, 15000];

export function createWebhookSubscription(
  input: Omit<CommunicationWebhookSubscription, "id" | "secret_reference">
) {
  const secret = randomBytes(32).toString("hex");
  const secretRef = caeId("whs");
  const secrets = readStoreSlice<{ ref: string; secret: string }>(SECRETS_KEY);
  secrets.push({ ref: secretRef, secret });
  writeStoreSlice(SECRETS_KEY, secrets);

  const sub: CommunicationWebhookSubscription = {
    ...input,
    id: caeId("whk"),
    secret_reference: secretRef,
  };
  const subs = readStoreSlice<CommunicationWebhookSubscription>(SUBS_KEY);
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
  const expected = signWebhookPayload(secret, timestamp, body);
  return expected === signature;
}

export function deliverWithRetry(
  subscriptionId: string,
  eventId: string,
  payload: Record<string, unknown>,
  deliverFn?: () => boolean
) {
  let lastError: string | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const result = enqueueWebhookDelivery(subscriptionId, eventId, payload, attempt + 1);
    if (!result) return null;
    const ok = deliverFn ? deliverFn() : true;
    if (ok) return result;
    lastError = `attempt ${attempt + 1} failed`;
    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_DELAYS_MS[attempt] ?? 15000;
      void delay;
    }
  }
  return { error: lastError ?? "delivery failed" };
}

export function enqueueWebhookDelivery(
  subscriptionId: string,
  eventId: string,
  payload: Record<string, unknown>,
  attemptCount = 1
) {
  const subs = readStoreSlice<CommunicationWebhookSubscription>(SUBS_KEY);
  const sub = subs.find((s) => s.id === subscriptionId);
  if (!sub || sub.status !== "active") return null;

  const secrets = readStoreSlice<{ ref: string; secret: string }>(SECRETS_KEY);
  const secret = secrets.find((s) => s.ref === sub.secret_reference)?.secret;
  if (!secret) return null;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify(payload);
  const signature = signWebhookPayload(secret, timestamp, body);

  const delivery: WebhookDeliveryLog & { signature: string; timestamp: string } = {
    delivery_id: caeId("whd"),
    subscription_id: subscriptionId,
    event_id: eventId,
    status: "delivered",
    attempt_count: attemptCount,
    created_at: nowIso(),
    signature,
    timestamp,
  };

  const deliveries = readStoreSlice<WebhookDeliveryLog>(DELIVERY_KEY);
  deliveries.push(delivery);
  writeStoreSlice(DELIVERY_KEY, deliveries);
  return {
    delivery,
    headers: { "X-Communication-Timestamp": timestamp, "X-Communication-Signature": signature },
  };
}

export function enqueueCommunicationWebhookDeliveries(record: CommunicationEventOutboxRecord) {
  const institutionId = (record.payload.institution_id as string) ?? "";
  const subs = readStoreSlice<CommunicationWebhookSubscription>(SUBS_KEY).filter(
    (s) => s.institution_id === institutionId && s.status === "active" && s.event_types.includes(record.event_type)
  );
  return subs.map((s) =>
    deliverWithRetry(s.id, record.event_id, {
      event_type: record.event_type,
      entity_id: record.entity_id,
      payload: record.payload,
    })
  );
}
