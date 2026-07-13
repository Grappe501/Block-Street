/**
 * CAE-11.12-W2 — Knowledge traceability protocol
 */
export const KNOWLEDGE_TRACEABILITY_CHAIN = [
  "LearningObject",
  "Lesson",
  "Module",
  "Course",
  "KnowledgeDomain",
  "Institution",
] as const;

export type TraceabilityLink = {
  entity_type: string;
  entity_id: string;
  display_name: string;
};

export function buildTraceabilityChain(input: {
  learning_object?: TraceabilityLink;
  lesson?: TraceabilityLink;
  module?: TraceabilityLink;
  course?: TraceabilityLink;
  domain?: TraceabilityLink;
  institution?: TraceabilityLink;
}): TraceabilityLink[] {
  const chain: TraceabilityLink[] = [];
  if (input.learning_object) chain.push(input.learning_object);
  if (input.lesson) chain.push(input.lesson);
  if (input.module) chain.push(input.module);
  if (input.course) chain.push(input.course);
  if (input.domain) chain.push(input.domain);
  if (input.institution) chain.push(input.institution);
  return chain;
}

export function explainLearningObjectExistence(chain: TraceabilityLink[]): string {
  if (chain.length === 0) return "Traceability chain incomplete — orphan learning content suspected.";
  return chain.map((l) => `${l.entity_type}: ${l.display_name}`).join(" → ");
}

export function getTraceabilityProtocol() {
  return {
    protocol: "11.12-W2",
    upward_chain: KNOWLEDGE_TRACEABILITY_CHAIN,
    question: "Why does this LearningObject exist?",
    claim_chain: ["KnowledgeClaim", "KnowledgeArtifact", "KnowledgeCollection", "KnowledgeDomain", "Institution"],
    reverse_lookup: true,
  };
}
