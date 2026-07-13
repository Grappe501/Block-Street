/**
 * CAE-11.6-W2 — Mission Execution Engine Constitution (OPS-001)
 */
export const OPS_EXECUTION_PRINCIPLE =
  "Institutions accomplish their purpose through Missions. Tasks, calendar events, documents, and communications do not exist independently — everything supports one or more active Missions.";

export const MISSION_EXECUTION_HIERARCHY = [
  "vision",
  "mission_statement",
  "strategic_pillar",
  "strategic_goal",
  "objective",
  "key_result",
  "program",
  "project",
  "operational_mission",
  "mission_phase",
  "mission_activity",
  "task",
  "checklist_item",
] as const;

export const MISSION_LIFECYCLE_STATES = [
  "draft",
  "planning",
  "awaiting_approval",
  "approved",
  "scheduled",
  "ready",
  "in_progress",
  "paused",
  "blocked",
  "escalated",
  "review",
  "completed",
  "archived",
] as const;

export const MISSION_TYPES = [
  "strategic",
  "operational",
  "campaign",
  "volunteer",
  "training",
  "research",
  "compliance",
  "communications",
  "technology",
  "infrastructure",
  "finance",
  "community",
  "legislative",
  "election",
  "emergency",
  "maintenance",
  "continuous_improvement",
] as const;

export const MISSION_HEALTH_STATES = ["healthy", "watch", "at_risk", "critical"] as const;

export const MISSION_ROLES = [
  "mission_sponsor",
  "executive_owner",
  "mission_lead",
  "coordinator",
  "contributor",
  "reviewer",
  "approver",
  "observer",
  "volunteer",
  "ai_assistant",
] as const;

export const MISSION_DEPENDENCY_TYPES = [
  "finish_to_start",
  "start_to_start",
  "finish_to_finish",
  "external_dependency",
  "approval_dependency",
  "resource_dependency",
] as const;

export const MISSION_PHASE_EXAMPLES = [
  "planning",
  "preparation",
  "execution",
  "verification",
  "closeout",
  "lessons_learned",
] as const;

export const REQUIRED_EXECUTION_SERVICES = [
  "MissionService",
  "MissionLifecycleService",
  "MissionTemplateService",
  "MissionPhaseService",
  "MissionActivityService",
  "TaskService",
  "ChecklistService",
  "MissionRoleService",
  "MissionHealthService",
  "MissionDependencyService",
  "MissionCalendarService",
  "MissionRiskService",
  "MissionEvidenceService",
  "MissionCommunicationService",
  "DecisionLogService",
  "LessonsLearnedService",
  "MissionIntelligenceService",
] as const;

export const EXECUTION_COMMANDS = [
  "CreateMission",
  "UpdateMission",
  "ApproveMission",
  "ScheduleMission",
  "StartMission",
  "PauseMission",
  "ResumeMission",
  "BlockMission",
  "EscalateMission",
  "CompleteMission",
  "ArchiveMission",
  "CreateTask",
  "CompleteTask",
  "RecordEvidence",
  "SubmitLessonsLearned",
] as const;

export const EXECUTION_AI_MAY_ASSIST = [
  "Evaluate schedule risk and dependency conflicts",
  "Detect resource shortages and duplicate work",
  "Recommend priorities and completion forecasts",
  "Identify communication gaps",
  "Suggest improvements for mission health",
] as const;

export const EXECUTION_AI_MAY_NOT = [
  "Change mission state or approve missions autonomously",
  "Complete tasks or archive missions without Human action",
  "Override escalation or approval requirements",
  "Publish lessons learned without Human review",
] as const;

export function getMissionExecutionConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W2",
    governing_principle: OPS_EXECUTION_PRINCIPLE,
    hierarchy: [...MISSION_EXECUTION_HIERARCHY],
    lifecycle_states: [...MISSION_LIFECYCLE_STATES],
    mission_types: [...MISSION_TYPES],
    health_states: [...MISSION_HEALTH_STATES],
    required_services: [...REQUIRED_EXECUTION_SERVICES],
    commands: [...EXECUTION_COMMANDS],
    ai_may_assist: [...EXECUTION_AI_MAY_ASSIST],
    ai_may_not: [...EXECUTION_AI_MAY_NOT],
    api_namespace: "/api/v1/operations/missions",
    legacy_missions_note: "Legacy county missions remain at /api/v1/missions",
  };
}
