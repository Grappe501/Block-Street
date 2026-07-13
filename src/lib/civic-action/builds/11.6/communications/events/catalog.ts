/**
 * CAE-11.6-W7 — Communications events
 */
export const COMMUNICATIONS_EVENT_CATALOG = [
  { event: "conversation.created", domain: "conversation", description: "Institutional conversation created" },
  { event: "thread.created", domain: "thread", description: "Discussion thread created" },
  { event: "message.posted", domain: "message", description: "Message posted to thread" },
  { event: "message.edited", domain: "message", description: "Message edited with version history" },
  { event: "announcement.published", domain: "announcement", description: "Institutional announcement published" },
  { event: "broadcast.sent", domain: "broadcast", description: "Multi-channel broadcast delivered" },
  { event: "meeting.created", domain: "meeting", description: "Meeting workspace created" },
  { event: "decision.captured", domain: "decision", description: "Decision captured from conversation" },
  { event: "action.generated", domain: "action", description: "Action item extracted from message" },
  { event: "conversation.translated", domain: "translation", description: "Conversation translated" },
  { event: "AI.summary.generated", domain: "ai", description: "AI summary generated" },
  { event: "knowledge.candidate.detected", domain: "knowledge", description: "Thread marked as knowledge candidate" },
] as const;
