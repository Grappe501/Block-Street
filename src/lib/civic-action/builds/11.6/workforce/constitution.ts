/**
 * CAE-11.6-W3 — Human Work Management Constitution (OPS-001)
 */
export const OPS_WORKFORCE_PRINCIPLE =
  "Every Human deserves meaningful work that matches their abilities, availability, permissions, and growth goals. The system optimizes work—not people. Humans are never reduced to productivity scores.";

export const WORKFORCE_ARCHITECTURE = [
  "institution",
  "organization",
  "department",
  "team",
  "role",
  "human",
  "capabilities",
  "availability",
  "assignments",
  "mission_work",
  "growth",
  "institutional_learning",
] as const;

export const WORKFORCE_STATUSES = [
  "available",
  "limited_availability",
  "busy",
  "training",
  "vacation",
  "leave",
  "inactive",
  "emergency_only",
] as const;

export const WORKLOAD_LEVELS = ["very_light", "balanced", "busy", "heavy", "critical"] as const;

export const ASSIGNMENT_TYPES = [
  "primary_owner",
  "supporting_contributor",
  "reviewer",
  "approver",
  "observer",
  "mentor",
  "trainer",
  "backup",
  "emergency_contact",
  "ai_advisor",
] as const;

export const ASSIGNMENT_STATUSES = [
  "proposed",
  "pending_acceptance",
  "accepted",
  "declined",
  "active",
  "completed",
  "delegated",
  "cancelled",
] as const;

export const WORK_QUEUE_STATES = [
  "assigned",
  "available",
  "awaiting_review",
  "waiting",
  "blocked",
  "completed",
  "delegated",
  "scheduled",
  "archived",
] as const;

export const CAPACITY_UNITS = ["hours", "story_points", "mission_points", "custom"] as const;

export const REQUIRED_WORKFORCE_SERVICES = [
  "WorkforceService",
  "AssignmentService",
  "CapacityService",
  "AvailabilityService",
  "SkillsMatchingService",
  "VolunteerService",
  "DelegationService",
  "PriorityService",
  "RecognitionService",
  "BurnoutMonitoringService",
  "SuccessionPlanningService",
  "WorkQueueService",
  "TeamDashboardService",
  "ExecutiveWorkforceDashboardService",
  "AIWorkforceAdvisorService",
] as const;

export const WORKFORCE_COMMANDS = [
  "AssignHuman",
  "AcceptAssignment",
  "DeclineAssignment",
  "DelegateAssignment",
  "CompleteAssignment",
  "UpdateAvailability",
  "UpdateCapacity",
  "RecommendAssignment",
  "ApproveRecommendation",
  "RecordRecognition",
  "UpdateGrowthGoals",
] as const;

export const WORKFORCE_AI_MAY_ASSIST = [
  "Assignment balancing and volunteer recruitment",
  "Leadership succession and mentoring opportunities",
  "Training recommendations and capacity shortages",
  "Scheduling improvements and cross-team collaboration",
  "Duplicate assignment detection",
] as const;

export const WORKFORCE_AI_MAY_NOT = [
  "Silently assign work without Human approval",
  "Discipline, evaluate personal worth, or make employment decisions",
  "Generate generalized Human rankings or productivity scores",
  "Override permissions or bypass delegation governance",
] as const;

export function getWorkforceConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W3",
    governing_principle: OPS_WORKFORCE_PRINCIPLE,
    architecture: [...WORKFORCE_ARCHITECTURE],
    workforce_statuses: [...WORKFORCE_STATUSES],
    workload_levels: [...WORKLOAD_LEVELS],
    assignment_types: [...ASSIGNMENT_TYPES],
    required_services: [...REQUIRED_WORKFORCE_SERVICES],
    commands: [...WORKFORCE_COMMANDS],
    ai_may_assist: [...WORKFORCE_AI_MAY_ASSIST],
    ai_may_not: [...WORKFORCE_AI_MAY_NOT],
    api_namespace: "/api/v1/workforce",
  };
}
