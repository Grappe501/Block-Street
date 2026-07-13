/**
 * CAE-11.7-W6 — Intelligence API helpers
 */
import type { CommunicationApiContext } from "../api/contracts";
import type { IntelligenceContext } from "./index";

export function toIntelligenceContext(
  apiCtx: CommunicationApiContext,
  options?: { initiativeId?: string; conversationId?: string }
): IntelligenceContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    initiative_id_optional: options?.initiativeId ?? apiCtx.initiative_id_optional ?? undefined,
    conversation_id_optional: options?.conversationId,
  };
}
