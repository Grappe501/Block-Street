/**
 * CAE-11.7-W6 — Conversation analysis (unanswered questions, thread health)
 */
import { communicationApplicationService } from "../application-service";

export type UnansweredQuestion = {
  question_id: string;
  thread_id: string;
  conversation_id: string;
  message_id: string;
  excerpt: string;
  days_open: number;
  confidence: "high" | "medium" | "low";
};

export type ThreadHealthInsight = {
  thread_id: string;
  conversation_id: string;
  subject: string;
  health_band: "healthy" | "watch" | "stalled";
  message_count: number;
  unresolved: boolean;
  last_activity_days: number;
  explanation: string;
};

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function detectUnansweredQuestions(institutionId: string, initiativeId?: string): UnansweredQuestion[] {
  const results: UnansweredQuestion[] = [];
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId && c.lifecycle_state !== "archived");
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  for (const conv of conversations) {
    const bundle = communicationApplicationService.getConversationBundle(conv.canonical_id);
    if (!bundle) continue;
    for (const thread of bundle.threads.filter((t) => !t.resolved && t.lifecycle_state !== "archived")) {
      const messages = bundle.messages.filter((m) => m.thread_id === thread.canonical_id);
      const last = messages[messages.length - 1];
      if (!last) continue;
      if (last.body.includes("?") && daysSince(last.updated_at) >= 2) {
        results.push({
          question_id: `uq-${last.canonical_id}`,
          thread_id: thread.canonical_id,
          conversation_id: conv.canonical_id,
          message_id: last.canonical_id,
          excerpt: last.body.slice(0, 120),
          days_open: daysSince(last.updated_at),
          confidence: daysSince(last.updated_at) >= 5 ? "high" : "medium",
        });
      }
    }
  }
  return results;
}

export function analyzeThreadHealth(institutionId: string, initiativeId?: string): ThreadHealthInsight[] {
  const insights: ThreadHealthInsight[] = [];
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId && c.lifecycle_state !== "archived");
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  for (const conv of conversations) {
    const bundle = communicationApplicationService.getConversationBundle(conv.canonical_id);
    if (!bundle) continue;
    for (const thread of bundle.threads) {
      const messages = bundle.messages.filter((m) => m.thread_id === thread.canonical_id);
      const lastActivity = messages.length ? messages[messages.length - 1].updated_at : thread.updated_at;
      const days = daysSince(lastActivity);
      let health_band: ThreadHealthInsight["health_band"] = "healthy";
      if (!thread.resolved && days >= 7) health_band = "stalled";
      else if (!thread.resolved && days >= 3) health_band = "watch";

      insights.push({
        thread_id: thread.canonical_id,
        conversation_id: conv.canonical_id,
        subject: thread.subject,
        health_band,
        message_count: messages.length,
        unresolved: !thread.resolved,
        last_activity_days: days,
        explanation:
          health_band === "stalled"
            ? "Thread has been inactive for a week without resolution."
            : health_band === "watch"
              ? "Thread activity is slowing — consider follow-up."
              : "Thread activity is within normal range.",
      });
    }
  }
  return insights;
}
