/**
 * CAE-11.2-W7 — Optimization API helpers
 */
import type { ObjectiveApiContext } from "../api/contracts";
import type { OptimizationContext } from "./index";

export function toOptimizationContext(
  apiCtx: ObjectiveApiContext,
  options?: { initiativeId?: string; objectiveId?: string }
): OptimizationContext {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    initiative_id_optional: options?.initiativeId ?? apiCtx.initiative_id_optional ?? undefined,
    objective_id_optional: options?.objectiveId,
  };
}
