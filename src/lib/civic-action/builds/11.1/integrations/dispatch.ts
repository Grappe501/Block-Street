/**
 * CAE-11.1-W5 — Integration dispatch hub
 */
import type { InitiativeEventOutboxRecord } from "../services/events";
import { projectInitiativeSearchDocument, upsertInitiativeSearchIndex } from "./search-projection";
import { handleInitiativeNotificationEvent } from "./notification-adapter";
import { handleInitiativeCalendarEvent } from "./calendar-adapter";
import { projectInitiativeAnalytics } from "./analytics-projection";
import { writeInitiativeAuditProjection } from "./audit-adapter";

export function dispatchInitiativeIntegrations(
  record: InitiativeEventOutboxRecord,
  options?: { consumer?: string }
) {
  const consumer = options?.consumer ?? "all";
  if (consumer === "all" || consumer === "search") {
    const doc = projectInitiativeSearchDocument(record.initiative_id);
    if (doc) upsertInitiativeSearchIndex(doc);
  }
  if (consumer === "all" || consumer === "notifications") {
    handleInitiativeNotificationEvent(record);
  }
  if (consumer === "all" || consumer === "calendar") {
    handleInitiativeCalendarEvent(record);
  }
  if (consumer === "all" || consumer === "analytics") {
    projectInitiativeAnalytics(record);
  }
  if (consumer === "all" || consumer === "audit") {
    writeInitiativeAuditProjection(record);
  }
}
