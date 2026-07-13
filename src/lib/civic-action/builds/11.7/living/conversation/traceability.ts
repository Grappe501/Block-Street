/**
 * CAE-11.7-W6 — Conversation traceability
 */
import { LIX_CONVERSATION_PRINCIPLE } from "./constitution";

export function explainConversationAction(input: {
  human_id: string;
  action_type: string;
  conversation_id?: string;
  consent_status?: string;
}) {
  return [
    `Conversation action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.conversation_id ? `Conversation: ${input.conversation_id}` : null,
    input.consent_status ? `Consent: ${input.consent_status}` : null,
    `Principle: ${LIX_CONVERSATION_PRINCIPLE}`,
    "Authority: Humans authorize memory.",
  ]
    .filter(Boolean)
    .join(" · ");
}
