/**
 * CAE-11.7-W7 — Structured lessons from communications
 */
import { extractConversationLessons } from "./conversation-learning";
import { extractMeetingLessons } from "./meeting-learning";
import { extractDecisionLessons } from "./decision-learning";
import type { StructuredLesson } from "./contracts";

export function extractLessons(
  institutionId: string,
  options?: { initiativeId?: string; conversationId?: string }
): StructuredLesson[] {
  return [
    ...extractConversationLessons(institutionId, options),
    ...extractMeetingLessons(institutionId, options),
    ...extractDecisionLessons(institutionId, options),
  ].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

export function extractLessonsByType(
  institutionId: string,
  sourceType: StructuredLesson["source_type"],
  initiativeId?: string
): StructuredLesson[] {
  switch (sourceType) {
    case "conversation":
      return extractConversationLessons(institutionId, { initiativeId });
    case "meeting":
      return extractMeetingLessons(institutionId, { initiativeId });
    case "decision":
      return extractDecisionLessons(institutionId, { initiativeId });
  }
}
