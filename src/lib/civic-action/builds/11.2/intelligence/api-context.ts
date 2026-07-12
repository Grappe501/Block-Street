/**
 * CAE-11.2-W6 — Intelligence API helpers
 */
import type { ObjectiveApiContext } from "../api/contracts";
import type { IntelligenceContext } from "./index";

export function toIntelligenceContext(
  apiCtx: ObjectiveApiContext,
  options?: { initiativeId?: string; objectiveId?: string }
): IntelligenceContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    initiative_id_optional: options?.initiativeId ?? apiCtx.initiative_id_optional ?? undefined,
    objective_id_optional: options?.objectiveId,
  };
}
