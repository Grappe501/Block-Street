/**
 * CAE-11.12-W5 — Notification adapter (event-driven intent only)
 */
import type { KnowledgeEventOutboxRecord } from "../services/events";

const NOTIFICATION_MAP: Record<string, string> = {
  "knowledge.enrollment_created": "learning.course_assigned",
  "knowledge.learning_completed": "learning.course_completed",
  "knowledge.certification_awarded": "certification.awarded",
  "knowledge.artifact_published": "knowledge.published",
  "knowledge.ai_suggestion_created": "knowledge.ai_suggestion_review",
};

export function mapEventToNotificationType(record: KnowledgeEventOutboxRecord): string | null {
  return NOTIFICATION_MAP[record.event_type] ?? null;
}

export function handleKnowledgeNotificationEvent(record: KnowledgeEventOutboxRecord) {
  const notificationType = mapEventToNotificationType(record);
  if (!notificationType) return null;
  return {
    notification_type: notificationType,
    institution_id: (record.payload.institution_id as string) ?? "",
    deep_link: `/learning`,
    lifecycle_mutation_allowed: false,
  };
}
