/**
 * CAE-11.2-W2 — Traceability protocol
 */
import { TRACEABILITY_CHAIN } from "./constitution";

export type TraceabilityLink = {
  entity_type: string;
  entity_id: string;
  display_name: string;
};

export function buildTraceabilityChain(input: {
  task?: TraceabilityLink;
  mission?: TraceabilityLink;
  workstream?: TraceabilityLink;
  objective?: TraceabilityLink;
  initiative?: TraceabilityLink;
  institution?: TraceabilityLink;
}): TraceabilityLink[] {
  const chain: TraceabilityLink[] = [];
  if (input.task) chain.push(input.task);
  if (input.mission) chain.push(input.mission);
  if (input.workstream) chain.push(input.workstream);
  if (input.objective) chain.push(input.objective);
  if (input.initiative) chain.push(input.initiative);
  if (input.institution) chain.push(input.institution);
  return chain;
}

export function explainTaskExistence(chain: TraceabilityLink[]): string {
  if (chain.length === 0) return "Traceability chain incomplete — orphan work suspected.";
  return chain.map((l) => `${l.entity_type}: ${l.display_name}`).join(" → ");
}

export function getTraceabilityProtocol() {
  return {
    protocol: "11.2-W2",
    upward_chain: TRACEABILITY_CHAIN,
    question: "Why does this Task exist?",
    reverse_lookup: true,
  };
}
