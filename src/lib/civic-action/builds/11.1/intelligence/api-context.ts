/**
 * CAE-11.1-W6 — Intelligence API helpers
 */
import type { InitiativeApiContext } from "../api/contracts";
import type { IntelligenceContext } from "./index";

export function toIntelligenceContext(apiCtx: InitiativeApiContext, initiativeId?: string): IntelligenceContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    initiative_id_optional: initiativeId ?? apiCtx.initiative_id_optional ?? undefined,
  };
}
