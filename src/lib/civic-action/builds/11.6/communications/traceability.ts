/**
 * CAE-11.6-W7 — Communications traceability
 */
import { OPS_COMMUNICATIONS_PRINCIPLE } from "./constitution";

export function explainConversationInstitutionalContext(input: {
  conversation_id: string;
  institution_id: string;
  mission_id: string | null;
  conversation_type: string;
}): string {
  const parts = [`Conversation ${input.conversation_id}`, `Type ${input.conversation_type}`, `Institution ${input.institution_id}`];
  if (input.mission_id) parts.push(`Mission ${input.mission_id}`);
  return parts.join(" → ");
}

export function getCommunicationsTraceabilityProtocol() {
  return {
    protocol: "11.6-W7",
    principle: OPS_COMMUNICATIONS_PRINCIPLE,
    required_fields: ["conversation_id", "institution_id", "mission_id"],
  };
}
