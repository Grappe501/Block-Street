/**
 * CAE-11.7-W6 — Conversation events
 */
export const CONVERSATION_EVENT_CATALOG = [
  { event: "conversation.recorded", domain: "conversation", description: "Authorized conversation captured" },
  { event: "conversation.imported", domain: "conversation", description: "Conversation imported with consent" },
  { event: "transcript.generated", domain: "transcription", description: "Transcript generated with version history" },
  { event: "translation.generated", domain: "translation", description: "Multilingual translation generated" },
  { event: "decision.detected", domain: "decision", description: "Decision detected pending Human confirmation" },
  { event: "commitment.detected", domain: "commitment", description: "Commitment detected pending Human confirmation" },
  { event: "action.suggested", domain: "action", description: "Action item suggested for Organizer review" },
  { event: "knowledge.promoted", domain: "knowledge", description: "Conversation knowledge promoted after review" },
  { event: "consent.granted", domain: "consent", description: "Recording consent granted" },
  { event: "consent.denied", domain: "consent", description: "Recording consent denied" },
  { event: "speaker.identified", domain: "speaker", description: "Speaker identity confirmed by Human" },
] as const;
