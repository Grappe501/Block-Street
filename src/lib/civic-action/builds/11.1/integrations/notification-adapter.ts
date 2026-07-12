/**
 * CAE-11.1-W5 — Notification adapter (event-driven; policy-gated)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InitiativeEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type InitiativeNotificationRequest = {
  notification_id: string;
  event_id: string;
  notification_type: string;
  institution_id: string;
  initiative_id: string;
  template_key: string;
  template_version: number;
  priority: "low" | "normal" | "high" | "mandatory";
  mandatory: boolean;
  payload: Record<string, unknown>;
  created_at: string;
  locales: ("en" | "es")[];
};

const QUEUE_KEY = "initiative_notification_queue";

const NOTIFICATION_MAP: Record<string, { template_key: string; priority: InitiativeNotificationRequest["priority"]; mandatory: boolean }> = {
  "initiative.submitted_for_review": { template_key: "initiative.review_requested", priority: "high", mandatory: true },
  "initiative.approved": { template_key: "initiative.approved", priority: "high", mandatory: true },
  "initiative.activated": { template_key: "initiative.activated", priority: "high", mandatory: true },
  "initiative.paused": { template_key: "initiative.paused", priority: "high", mandatory: true },
  "initiative.owner_assigned": { template_key: "initiative.owner_assigned", priority: "normal", mandatory: true },
  "initiative.review_due": { template_key: "initiative.review_due", priority: "normal", mandatory: false },
  "initiative.closeout_started": { template_key: "initiative.closeout_started", priority: "normal", mandatory: true },
};

export function handleInitiativeNotificationEvent(record: InitiativeEventOutboxRecord) {
  const rule = NOTIFICATION_MAP[record.event_type];
  if (!rule) return null;

  const request: InitiativeNotificationRequest = {
    notification_id: caeId("ntf"),
    event_id: record.event_id,
    notification_type: record.event_type,
    institution_id: (record.payload.institution_id as string) ?? "",
    initiative_id: record.initiative_id,
    template_key: rule.template_key,
    template_version: 1,
    priority: rule.priority,
    mandatory: rule.mandatory,
    payload: record.payload,
    created_at: nowIso(),
    locales: ["en", "es"],
  };

  const queue = readStoreSlice<InitiativeNotificationRequest>(QUEUE_KEY);
  queue.push(request);
  writeStoreSlice(QUEUE_KEY, queue);
  return request;
}

export function listInitiativeNotificationQueue(limit = 50) {
  return readStoreSlice<InitiativeNotificationRequest>(QUEUE_KEY).slice(-limit);
}
