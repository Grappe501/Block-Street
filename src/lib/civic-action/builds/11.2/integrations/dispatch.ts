/**
 * CAE-11.2-W5 — Integration dispatch hub
 */
import type { ExecutionEventOutboxRecord } from "../services/events";
import { projectObjectiveSearchDocument, upsertObjectiveSearchIndex } from "./search-projection";
import { handleObjectiveNotificationEvent } from "./notification-adapter";
import { handleObjectiveCalendarEvent } from "./calendar-adapter";
import { projectObjectiveAnalytics } from "./analytics-projection";
import { writeObjectiveAuditProjection } from "./audit-adapter";
import { enqueueObjectiveWebhookDeliveries } from "./webhook-delivery";

export function dispatchObjectiveIntegrations(
  record: ExecutionEventOutboxRecord,
  options?: { consumer?: string }
) {
  const consumer = options?.consumer ?? "all";
  const entityId = record.entity_id;
  if (consumer === "all" || consumer === "search") {
    const doc = projectObjectiveSearchDocument(entityId, record.entity_type);
    if (doc) upsertObjectiveSearchIndex(doc);
  }
  if (consumer === "all" || consumer === "notifications") {
    handleObjectiveNotificationEvent(record);
  }
  if (consumer === "all" || consumer === "calendar") {
    handleObjectiveCalendarEvent(record);
  }
  if (consumer === "all" || consumer === "analytics") {
    projectObjectiveAnalytics(record);
  }
  if (consumer === "all" || consumer === "audit") {
    writeObjectiveAuditProjection(record);
  }
  if (consumer === "all" || consumer === "webhooks") {
    enqueueObjectiveWebhookDeliveries(record);
  }
}
