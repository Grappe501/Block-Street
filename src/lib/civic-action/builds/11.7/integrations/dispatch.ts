/**
 * CAE-11.7-W5 — Integration dispatch hub
 */
import type { CommunicationEventOutboxRecord } from "../services/events";
import { projectCommunicationSearchDocument, upsertCommunicationSearchIndex } from "./search-projection";
import { handleCommunicationNotificationEvent } from "./notification-adapter";
import { handleCommunicationCalendarEvent } from "./calendar-adapter";
import { projectCommunicationAnalytics } from "./analytics-projection";
import { handleMissionCommunicationEvent } from "./mission-adapter";
import { projectKnowledgeGraphRelationships } from "./knowledge-graph-projection";
import { enqueueCommunicationWebhookDeliveries } from "./webhook-delivery";

export function dispatchCommunicationIntegrations(
  record: CommunicationEventOutboxRecord,
  options?: { consumer?: string }
) {
  const consumer = options?.consumer ?? "all";
  const entityId = record.entity_id;
  if (consumer === "all" || consumer === "search") {
    const doc = projectCommunicationSearchDocument(entityId, record.entity_type);
    if (doc) upsertCommunicationSearchIndex(doc);
  }
  if (consumer === "all" || consumer === "notifications") {
    handleCommunicationNotificationEvent(record);
  }
  if (consumer === "all" || consumer === "calendar") {
    handleCommunicationCalendarEvent(record);
  }
  if (consumer === "all" || consumer === "analytics") {
    projectCommunicationAnalytics(record);
  }
  if (consumer === "all" || consumer === "mission") {
    handleMissionCommunicationEvent(record);
  }
  if (consumer === "all" || consumer === "knowledge") {
    projectKnowledgeGraphRelationships(record);
  }
  if (consumer === "all" || consumer === "webhooks") {
    enqueueCommunicationWebhookDeliveries(record);
  }
}
