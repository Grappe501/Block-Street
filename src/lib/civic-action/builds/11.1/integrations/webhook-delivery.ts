/**
 * CAE-11.1-W5 — Webhook delivery (signed, replay-resistant)
 */
import { createHmac, randomBytes } from "crypto";
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type InitiativeWebhookSubscription = {
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

const SUBS_KEY = "initiative_webhook_subscriptions";
const DELIVERY_KEY = "initiative_webhook_deliveries";
const SECRETS_KEY = "initiative_webhook_secrets";

export function createWebhookSubscription(input: Omit<InitiativeWebhookSubscription, "id" | "secret_reference">) {
  const secret = randomBytes(32).toString("hex");
  const secretRef = caeId("whs");
  const secrets = readStoreSlice<{ ref: string; secret: string }>(SECRETS_KEY);
  secrets.push({ ref: secretRef, secret });
  writeStoreSlice(SECRETS_KEY, secrets);

  const sub: InitiativeWebhookSubscription = {
    ...input,
    id: caeId("whk"),
    secret_reference: secretRef,
  };
  const subs = readStoreSlice<InitiativeWebhookSubscription>(SUBS_KEY);
  subs.push(sub);
  writeStoreSlice(SUBS_KEY, subs);
  return { subscription: sub, signing_secret: secret };
}

export function signWebhookPayload(secret: string, timestamp: string, body: string) {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function verifyWebhookSignature(secret: string, timestamp: string, body: string, signature: string, maxSkewSeconds = 300) {
  const ts = Number.parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > maxSkewSeconds) return false;
  const expected = signWebhookPayload(secret, timestamp, body);
  return expected === signature;
}

export function enqueueWebhookDelivery(subscriptionId: string, eventId: string, payload: Record<string, unknown>) {
  const subs = readStoreSlice<InitiativeWebhookSubscription>(SUBS_KEY);
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
    attempt_count: 1,
    created_at: nowIso(),
    signature,
    timestamp,
  };

  const deliveries = readStoreSlice<WebhookDeliveryLog>(DELIVERY_KEY);
  deliveries.push(delivery);
  writeStoreSlice(DELIVERY_KEY, deliveries);
  return { delivery, headers: { "X-Initiative-Timestamp": timestamp, "X-Initiative-Signature": signature } };
}
