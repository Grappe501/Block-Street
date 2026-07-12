/**
 * CAE-11.2-W5 — Notification adapter (event-driven; policy-gated)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ExecutionEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type ObjectiveNotificationRequest = {
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

const QUEUE_KEY = "objective_notification_queue";

const NOTIFICATION_MAP: Record<
  string,
  { template_key: string; priority: ObjectiveNotificationRequest["priority"]; mandatory: boolean }
> = {
  "execution.objective_proposed": { template_key: "objective.review_requested", priority: "high", mandatory: true },
  "execution.objective_approved": { template_key: "objective.approved", priority: "high", mandatory: true },
  "execution.objective_activated": { template_key: "objective.activated", priority: "high", mandatory: true },
  "execution.mission_assigned": { template_key: "mission.assigned", priority: "normal", mandatory: true },
  "execution.mission_completed": { template_key: "mission.completed", priority: "normal", mandatory: false },
  "execution.task_assigned": { template_key: "task.assigned", priority: "normal", mandatory: true },
  "execution.task_completed": { template_key: "task.completed", priority: "low", mandatory: false },
};

export function handleObjectiveNotificationEvent(record: ExecutionEventOutboxRecord) {
  const rule = NOTIFICATION_MAP[record.event_type];
  if (!rule) return null;

  const request: ObjectiveNotificationRequest = {
    notification_id: caeId("ntf"),
    event_id: record.event_id,
    notification_type: record.event_type,
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

  const queue = readStoreSlice<ObjectiveNotificationRequest>(QUEUE_KEY);
  queue.push(request);
  writeStoreSlice(QUEUE_KEY, queue);
  return request;
}

export function listObjectiveNotificationQueue(limit = 50) {
  return readStoreSlice<ObjectiveNotificationRequest>(QUEUE_KEY).slice(-limit);
}
