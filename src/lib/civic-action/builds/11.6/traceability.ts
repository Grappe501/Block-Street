/**
 * CAE-11.6-W1 — Strategic traceability protocol
 */
import { TRACEABILITY_CHAIN, OPS_GOVERNING_PRINCIPLE } from "./constitution";
import type { TraceabilityFields } from "./data-model";

export const OPS_GOVERNING_QUESTION = 'Why are we doing this?';

export function buildStrategicTraceabilityChain(fields: TraceabilityFields & { institution_id: string }) {
  return {
    institution_id: fields.institution_id,
    vision_id: fields.vision_id,
    mission_id: fields.mission_id,
    pillar_id: fields.pillar_id,
    goal_id: fields.goal_id,
    objective_id: fields.objective_id,
    key_result_id: fields.key_result_id,
    chain: TRACEABILITY_CHAIN,
  };
}

export function explainWhyWeAreDoingThis(fields: TraceabilityFields): string {
  const parts: string[] = [];
  if (fields.key_result_id) parts.push(`Key Result ${fields.key_result_id}`);
  if (fields.objective_id) parts.push(`Objective ${fields.objective_id}`);
  if (fields.goal_id) parts.push(`Goal ${fields.goal_id}`);
  if (fields.pillar_id) parts.push(`Pillar ${fields.pillar_id}`);
  if (fields.mission_id) parts.push(`Mission ${fields.mission_id}`);
  if (fields.vision_id) parts.push(`Vision ${fields.vision_id}`);
  if (parts.length === 0) return "Traceability incomplete — cannot answer why we are doing this.";
  return `This work supports: ${parts.join(" → ")}`;
}

export function validateTraceabilityComplete(fields: TraceabilityFields): boolean {
  return !!(fields.mission_id && fields.goal_id && fields.objective_id);
}

export function getTraceabilityProtocol() {
  return {
    protocol: "11.6-W1",
    upward_chain: TRACEABILITY_CHAIN,
    question: OPS_GOVERNING_QUESTION,
    required_fields: ["vision_id", "mission_id", "pillar_id", "goal_id", "objective_id", "key_result_id"],
  };
}
