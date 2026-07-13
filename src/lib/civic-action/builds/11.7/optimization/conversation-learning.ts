/**
 * CAE-11.7-W7 — Conversation learning outputs
 */
import { caeId } from "../../../utils";
import { communicationApplicationService } from "../application-service";
import { analyzeThreadHealth, detectUnansweredQuestions } from "../intelligence/conversation-analysis";
import type { OptimizationConfidence, StructuredLesson } from "./contracts";

function confidenceFromCount(count: number): OptimizationConfidence {
  if (count >= 5) return "strong_pattern";
  if (count >= 3) return "likely";
  if (count >= 1) return "observed";
  return "emerging";
}

export function extractConversationLessons(
  institutionId: string,
  options?: { initiativeId?: string; conversationId?: string }
): StructuredLesson[] {
  const lessons: StructuredLesson[] = [];
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (options?.initiativeId) conversations = conversations.filter((c) => c.initiative_id === options.initiativeId);
  if (options?.conversationId) conversations = conversations.filter((c) => c.canonical_id === options.conversationId);

  const threads = analyzeThreadHealth(institutionId, options?.initiativeId);
  const unanswered = detectUnansweredQuestions(institutionId, options?.initiativeId);

  for (const conversation of conversations) {
    if (conversation.lifecycle_state !== "archived") continue;
    const stalled = threads.filter(
      (t) => t.conversation_id === conversation.canonical_id && t.health_band === "stalled"
    ).length;
    const openQuestions = unanswered.filter((q) => q.conversation_id === conversation.canonical_id).length;

    if (stalled > 0 || openQuestions > 0) {
      lessons.push({
        lesson_id: caeId("cles"),
        source_type: "conversation",
        source_id: conversation.canonical_id,
        source_name: conversation.display_name,
        initiative_id: conversation.initiative_id,
        observation: `Archived conversation had ${stalled} stalled thread(s) and ${openQuestions} unanswered question(s).`,
        root_cause: stalled > 0 ? "Thread resolution gaps before archive" : "Open questions not addressed",
        recommendation: "Resolve or document open threads before archiving future conversations.",
        evidence: `${stalled} stalled · ${openQuestions} unanswered`,
        applicability: "Mission conversations with multi-thread coordination",
        confidence: confidenceFromCount(stalled + openQuestions),
        occurred_at: conversation.updated_at,
      });
    }
  }

  return lessons.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}
