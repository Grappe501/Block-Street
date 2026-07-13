/**
 * CAE-11.12-W5 — Integration dispatch hub
 */
import type { KnowledgeEventOutboxRecord } from "../services/events";
import {
  projectKnowledgeSearchDocument,
  upsertKnowledgeSearchIndex,
} from "./search-projection";
import { handleKnowledgeNotificationEvent } from "./notification-adapter";
import { handleKnowledgeCalendarEvent } from "./calendar-adapter";
import { handleMissionEvidenceEvent } from "./mission-adapter";
import { projectKnowledgeAnalytics } from "./analytics-projection";
import { enqueueKnowledgeWebhookDeliveries } from "./webhook-delivery";

export function dispatchKnowledgeIntegrations(
  record: KnowledgeEventOutboxRecord,
  options?: { consumer?: string; replay?: boolean }
) {
  const consumer = options?.consumer ?? "all";

  if (consumer === "all" || consumer === "search") {
    const doc = projectKnowledgeSearchDocument(record.entity_id, record.entity_type);
    if (doc) upsertKnowledgeSearchIndex(doc);
  }
  if (consumer === "all" || consumer === "notifications") {
    handleKnowledgeNotificationEvent(record);
  }
  if (consumer === "all" || consumer === "calendar") {
    handleKnowledgeCalendarEvent(record);
  }
  if (consumer === "all" || consumer === "analytics") {
    projectKnowledgeAnalytics(record);
  }
  if (consumer === "all" || consumer === "mission") {
    handleMissionEvidenceEvent({
      event_type: record.event_type,
      event_id: record.event_id,
      entity_id: record.entity_id,
      payload: record.payload,
    });
  }
  if (consumer === "all" || consumer === "webhooks") {
    enqueueKnowledgeWebhookDeliveries(record);
  }
}
