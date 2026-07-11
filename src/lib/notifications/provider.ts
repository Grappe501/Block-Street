import { randomBytes } from "crypto";
import type { DeliveryChannel, NotificationDelivery } from "./types";

export interface SendResult {
  success: boolean;
  provider_message_id?: string;
  failure_code?: string;
  failure_message?: string;
  retryable?: boolean;
}

export function sendViaProvider(
  channel: DeliveryChannel | string,
  destination: string,
  _payload: { title: string; body: string; subject?: string }
): SendResult {
  if (destination === "bounced@invalid.example") {
    return { success: false, failure_code: "hard_bounce", failure_message: "Mailbox does not exist", retryable: false };
  }
  if (channel === "sms" && !destination) {
    return { success: false, failure_code: "invalid_destination", failure_message: "No phone number", retryable: false };
  }
  return {
    success: true,
    provider_message_id: `${channel}-${randomBytes(4).toString("hex")}`,
  };
}

export function createDeliveryRecord(
  notificationId: string,
  channel: string,
  destination: string,
  result: SendResult
): NotificationDelivery {
  const now = new Date().toISOString();
  const provider = channel === "in_app" ? "platform" : channel === "email" ? "mock_email" : channel === "sms" ? "mock_sms" : "platform";
  return {
    id: `del-${randomBytes(4).toString("hex")}`,
    notification_id: notificationId,
    channel,
    provider,
    destination_reference: destination,
    status: result.success ? "delivered" : "failed",
    attempt_count: 1,
    queued_at: now,
    sent_at_optional: result.success ? now : null,
    delivered_at_optional: result.success ? now : null,
    opened_at_optional: null,
    clicked_at_optional: null,
    failed_at_optional: result.success ? null : now,
    failure_code_optional: result.failure_code ?? null,
    provider_message_id_optional: result.provider_message_id ?? null,
  };
}
