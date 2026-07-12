/**
 * CAE-11.2-W2 — Canonical execution entity registry (OBJ-001)
 */
export const CANONICAL_EXECUTION_ENTITIES = [
  "Objective",
  "KeyResult",
  "Workstream",
  "Mission",
  "Milestone",
  "Deliverable",
  "Task",
  "Evidence",
  "Outcome",
  "Review",
  "LessonLearned",
  "Dependency",
  "Risk",
  "DecisionReference",
] as const;

export type CanonicalExecutionEntity = (typeof CANONICAL_EXECUTION_ENTITIES)[number];

export const REQUIRED_CANONICAL_REPOSITORIES = [
  "CanonicalObjectiveRepository",
  "CanonicalMissionRepository",
  "CanonicalTaskRepository",
  "CanonicalEvidenceRepository",
  "CanonicalOutcomeRepository",
  "CanonicalRelationshipRepository",
  "CanonicalVersionRepository",
  "CanonicalSearchIndexer",
  "CanonicalEventPublisher",
] as const;

export const PARENT_CHILD_MATRIX: Record<string, string | null> = {
  Objective: "Initiative",
  KeyResult: "Objective",
  Workstream: "Objective",
  Mission: "Workstream",
  Milestone: "Mission",
  Deliverable: "Mission",
  Task: "Mission",
  Evidence: null,
  Outcome: "Objective",
  Review: "Objective",
  LessonLearned: "Objective",
  Dependency: null,
  Risk: null,
  DecisionReference: null,
};

export const CROSS_LINK_ENTITIES = [
  "Objective ↔ Objective",
  "Mission ↔ Mission",
  "Task ↔ Task",
  "Evidence ↔ *",
  "Risk ↔ *",
  "Decision ↔ *",
] as const;

export function getEntityRegistry() {
  return {
    protocol: "11.2-W2",
    entities: CANONICAL_EXECUTION_ENTITIES,
    parent_child: PARENT_CHILD_MATRIX,
    cross_links: CROSS_LINK_ENTITIES,
    repositories: REQUIRED_CANONICAL_REPOSITORIES,
  };
}
