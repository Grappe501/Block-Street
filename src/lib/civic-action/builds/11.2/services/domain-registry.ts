/**
 * CAE-11.2-W3 — Domain service registry (OBJ-SVC-001)
 */
export const OBJECTIVE_DOMAIN_SERVICES = [
  "ObjectiveLifecycleService",
  "ObjectiveCreationService",
  "ObjectiveApprovalService",
  "ObjectiveActivationService",
  "ObjectiveReviewService",
  "ObjectiveCompletionService",
  "ObjectiveArchiveService",
  "ObjectiveOwnershipService",
] as const;

export const KEY_RESULT_DOMAIN_SERVICES = [
  "KeyResultService",
  "KeyResultMeasurementService",
  "KeyResultEvaluationService",
] as const;

export const WORKSTREAM_DOMAIN_SERVICES = [
  "WorkstreamService",
  "WorkstreamSchedulingService",
  "WorkstreamCapacityService",
] as const;

export const MISSION_DOMAIN_SERVICES = [
  "MissionLifecycleService",
  "MissionAssignmentService",
  "MissionCompletionService",
  "MissionDependencyService",
] as const;

export const MILESTONE_DOMAIN_SERVICES = ["MilestoneService", "MilestoneEvaluationService"] as const;

export const DELIVERABLE_DOMAIN_SERVICES = [
  "DeliverableService",
  "DeliverableApprovalService",
  "DeliverablePublicationService",
] as const;

export const TASK_DOMAIN_SERVICES = [
  "TaskLifecycleService",
  "TaskAssignmentService",
  "TaskDependencyService",
  "TaskEvidenceService",
] as const;

export const SHARED_EXECUTION_SERVICES = [
  "ExecutionValidationService",
  "ExecutionTraceabilityService",
  "ExecutionVersionService",
  "ExecutionPermissionService",
  "ExecutionRelationshipService",
  "ExecutionSearchService",
  "ExecutionHistoryService",
  "ExecutionAuditService",
  "ExecutionEventPublisher",
] as const;

export const ALL_EXECUTION_DOMAIN_SERVICES = [
  ...OBJECTIVE_DOMAIN_SERVICES,
  ...KEY_RESULT_DOMAIN_SERVICES,
  ...WORKSTREAM_DOMAIN_SERVICES,
  ...MISSION_DOMAIN_SERVICES,
  ...MILESTONE_DOMAIN_SERVICES,
  ...DELIVERABLE_DOMAIN_SERVICES,
  ...TASK_DOMAIN_SERVICES,
  ...SHARED_EXECUTION_SERVICES,
] as const;

export const EXECUTION_POLICIES = [
  { policy_id: "POL-001", rule: "No orphan Tasks", enforcement: "block" as const },
  { policy_id: "POL-002", rule: "No active Mission without Objective", enforcement: "block" as const },
  { policy_id: "POL-003", rule: "No archived parent with active children", enforcement: "block" as const },
  { policy_id: "POL-004", rule: "No completed Objective without review", enforcement: "warn" as const },
  { policy_id: "POL-005", rule: "No evidence deletion after publication", enforcement: "block" as const },
  { policy_id: "POL-006", rule: "No ownership transfer during protected review", enforcement: "block" as const },
  { policy_id: "POL-007", rule: "Draft→Approved requires Proposed intermediate", enforcement: "block" as const },
];
