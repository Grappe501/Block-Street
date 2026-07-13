/**
 * CAE-11.6-W9 — Institutional Automation & Workflow Orchestration Constitution (OPS-001)
 */
export const OPS_WORKFLOW_PRINCIPLE =
  "Automation may execute policy, but it may never replace accountable Human judgment.";

export const AUTOMATION_ARCHITECTURE = [
  "institution",
  "policy",
  "trigger",
  "workflow",
  "conditions",
  "approvals",
  "automation_steps",
  "human_review",
  "execution",
  "evidence",
  "institutional_memory",
] as const;

export const WORKFLOW_CATEGORIES = [
  "mission",
  "volunteer",
  "training",
  "communications",
  "finance",
  "approval",
  "calendar",
  "resource",
  "procurement",
  "incident",
  "compliance",
  "governance",
  "membership",
  "certification",
  "research",
  "campaign",
  "election",
  "emergency",
  "technology",
  "custom",
] as const;

export const WORKFLOW_LIFECYCLE = [
  "draft",
  "testing",
  "awaiting_approval",
  "published",
  "active",
  "paused",
  "deprecated",
  "archived",
] as const;

export const AUTOMATION_LEVELS = [
  { level: 0, name: "suggestion_only" },
  { level: 1, name: "human_initiates" },
  { level: 2, name: "automation_executes" },
  { level: 3, name: "automation_after_approval" },
  { level: 4, name: "fully_automatic_low_risk" },
] as const;

export const APPROVAL_TYPES = [
  "single_approval",
  "dual_approval",
  "committee_approval",
  "executive_approval",
  "financial_approval",
  "legal_approval",
  "emergency_override",
  "custom_approval",
] as const;

export const WORKFLOW_TRIGGER_TYPES = [
  "mission_created",
  "mission_completed",
  "task_assigned",
  "deadline_approaching",
  "volunteer_registered",
  "certification_expired",
  "meeting_scheduled",
  "resource_reserved",
  "budget_approved",
  "document_uploaded",
  "form_submitted",
  "manual_trigger",
  "webhook",
  "api",
  "time_schedule",
  "calendar_event",
  "system_event",
  "external_integration",
] as const;

export const WORKFLOW_ACTION_TYPES = [
  "create_mission",
  "create_task",
  "assign_human",
  "schedule_event",
  "reserve_resource",
  "generate_document",
  "request_approval",
  "notify_users",
  "create_knowledge_draft",
  "open_discussion",
  "create_reminder",
  "update_status",
  "escalate_risk",
  "generate_report",
  "call_ai",
  "call_external_api",
  "pause_workflow",
  "terminate_workflow",
] as const;

export const REQUIRED_WORKFLOW_SERVICES = [
  "WorkflowService",
  "TriggerService",
  "ConditionService",
  "ApprovalService",
  "ActionService",
  "WorkflowExecutionService",
  "WorkflowTemplateService",
  "EscalationService",
  "AutomationAnalyticsService",
  "WorkflowRecoveryService",
  "ConnectorService",
  "AIWorkflowCoordinatorService",
  "WorkflowMonitoringService",
  "WorkflowAuditService",
] as const;

export const WORKFLOW_COMMANDS = [
  "CreateWorkflow",
  "PublishWorkflow",
  "PauseWorkflow",
  "ResumeWorkflow",
  "ArchiveWorkflow",
  "ExecuteWorkflow",
  "ApproveWorkflowStep",
  "RejectWorkflowStep",
  "RetryWorkflow",
  "RollbackWorkflow",
  "CreateTemplate",
  "GenerateAIWorkflow",
] as const;

export const WORKFLOW_AI_MAY_NOT = [
  "Silently alter governance or approval requirements",
  "Bypass required Human approval gates",
  "Elevate automation privilege beyond workflow policy",
  "Execute high-risk workflows at Level 4 automation",
  "Replace accountable Human judgment",
] as const;

export function getWorkflowConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W9",
    governing_principle: OPS_WORKFLOW_PRINCIPLE,
    architecture: [...AUTOMATION_ARCHITECTURE],
    workflow_categories: [...WORKFLOW_CATEGORIES],
    lifecycle: [...WORKFLOW_LIFECYCLE],
    automation_levels: [...AUTOMATION_LEVELS],
    approval_types: [...APPROVAL_TYPES],
    required_services: [...REQUIRED_WORKFLOW_SERVICES],
    commands: [...WORKFLOW_COMMANDS],
    ai_may_not: [...WORKFLOW_AI_MAY_NOT],
    api_namespace: "/api/v1/workflows",
  };
}
