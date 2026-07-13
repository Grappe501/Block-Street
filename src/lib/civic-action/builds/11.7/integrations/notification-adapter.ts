/**
 * CAE-11.7-W5 — Notification adapter (event-driven; policy-gated)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type CommunicationNotificationRequest = {
  notification_id: string;
  event_id: string;
  notification_type: string;
  institution_id: string;
  initiative_id: string;
  entity_id: string;
  template_key: string;
  template_version: number;
  priority: "low" | "normal" | "high" | "mandatory";
  mandatory: boolean;
  payload: Record<string, unknown>;
  created_at: string;
  locales: ("en" | "es")[];
};

const QUEUE_KEY = "communication_notification_queue";

const NOTIFICATION_MAP: Record<
  string,
  { template_key: string; priority: CommunicationNotificationRequest["priority"]; mandatory: boolean }
> = {
  "communication.message_posted": { template_key: "communication.message.new", priority: "normal", mandatory: false },
  "communication.message_posted_mention": { template_key: "communication.mention", priority: "high", mandatory: true },
  "communication.decision_recorded": { template_key: "communication.decision.recorded", priority: "high", mandatory: true },
  "communication.meeting_created": { template_key: "communication.meeting.reminder", priority: "high", mandatory: true },
  "communication.announcement_published": { template_key: "communication.announcement", priority: "mandatory", mandatory: true },
  "communication.action_item_created": { template_key: "communication.action_item.assigned", priority: "normal", mandatory: true },
  "communication.thread_resolved": { template_key: "communication.thread.resolved", priority: "low", mandatory: false },
  "communication.conversation_created": { template_key: "communication.conversation.new", priority: "normal", mandatory: false },
};

export function mapEventToNotificationType(record: CommunicationEventOutboxRecord): string | null {
  if (record.event_type === "communication.message_posted") {
    const mentions = record.payload.mention_human_ids as string[] | undefined;
    if (mentions && mentions.length > 0) return "communication.message_posted_mention";
  }
  return NOTIFICATION_MAP[record.event_type] ? record.event_type : null;
}

export function handleCommunicationNotificationEvent(record: CommunicationEventOutboxRecord) {
  let eventKey = record.event_type;
  if (record.event_type === "communication.message_posted") {
    const mentions = record.payload.mention_human_ids as string[] | undefined;
    if (mentions && mentions.length > 0) eventKey = "communication.message_posted_mention";
  }
  const rule = NOTIFICATION_MAP[eventKey];
  if (!rule) return null;

  const request: CommunicationNotificationRequest = {
    notification_id: caeId("ntf"),
    event_id: record.event_id,
    notification_type: eventKey,
    institution_id: (record.payload.institution_id as string) ?? "",
    initiative_id: (record.payload.initiative_id as string) ?? "",
    entity_id: record.entity_id,
    template_key: rule.template_key,
    template_version: 1,
    priority: rule.priority,
    mandatory: rule.mandatory,
    payload: record.payload,
    created_at: nowIso(),
    locales: ["en", "es"],
  };

  const queue = readStoreSlice<CommunicationNotificationRequest>(QUEUE_KEY);
  queue.push(request);
  writeStoreSlice(QUEUE_KEY, queue);
  return request;
}

export function listCommunicationNotificationQueue(limit = 50) {
  return readStoreSlice<CommunicationNotificationRequest>(QUEUE_KEY).slice(-limit);
}
