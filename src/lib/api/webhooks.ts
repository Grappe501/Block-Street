import { createHmac, randomBytes } from "crypto";
import { appendApiAudit, loadWebhookSubscriptions } from "./data";

export function signWebhookPayload(secret: string, eventId: string, timestamp: string, body: string) {
  const payload = `${eventId}.${timestamp}.${body}`;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function deliverWebhook(eventType: string, payload: Record<string, unknown>) {
  const subs = loadWebhookSubscriptions().filter((s) => s.status === "active" && s.event_types.includes(eventType));
  const eventId = `evt_${randomBytes(6).toString("hex")}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify({ event_type: eventType, event_id: eventId, data: payload });
  const results = subs.map((sub) => {
    const signature = signWebhookPayload(sub.secret_reference, eventId, timestamp, body);
    appendApiAudit({
      action: "webhook_delivered",
      subscription_id: sub.id,
      event_id: eventId,
      target_url: sub.target_url,
      signature,
      result: "success",
    });
    return { subscription_id: sub.id, event_id: eventId, status: "queued", signature };
  });
  return { event_id: eventId, deliveries: results };
}
