/**
 * CAE-11.7-W12 — Automation Constitution (LIX-012)
 */
export const LIX_AUTOMATION_PRINCIPLE =
  "Authority is delegated intentionally. Automation is earned. Oversight never disappears.";

export const AUTOMATION_LEVELS = [0, 1, 2, 3, 4, 5] as const;

export const AUTOMATION_LEVEL_LABELS = {
  0: "manual_only",
  1: "ai_assists",
  2: "ai_executes_with_approval",
  3: "conditional_automation",
  4: "institutionally_approved",
  5: "emergency_automation",
} as const;

export const DEFAULT_AUTOMATION_LEVEL = 1;

export const AUTOMATION_MAY = [
  "execute_approved_workflows",
  "request_human_approval",
  "pause_on_failure",
  "retry_with_limits",
  "escalate_to_human",
  "schedule_authorized_work",
  "run_operational_playbooks",
] as const;

export const AUTOMATION_MAY_NOT = [
  "execute_unapproved_high_risk",
  "escalate_authority_automatically",
  "grant_new_permissions",
  "spend_without_approval",
  "delete_audit_history",
  "conceal_failures",
  "continue_after_unrecoverable",
  "override_human_intervention",
  "mutate_canonical_outside_contract",
  "self_modifying_automation",
] as const;

export const REQUIRED_AUTOMATION_SERVICES = [
  "WorkflowRegistryService",
  "WorkflowEngine",
  "ApprovalService",
  "AutomationPermissionService",
  "PlaybookService",
  "LongRunningWorkflowService",
  "ExceptionRecoveryService",
  "AutomationScheduler",
  "IntegrationService",
  "HumanInterventionService",
  "AutomationAnalyticsService",
  "OperationalGovernanceService",
] as const;

export function getAutomationConstitution() {
  return {
    protocol_id: "CAE-11.7-W12",
    governing_principle: LIX_AUTOMATION_PRINCIPLE,
    automation_levels: AUTOMATION_LEVELS,
    default_level: DEFAULT_AUTOMATION_LEVEL,
    may: AUTOMATION_MAY,
    may_not: AUTOMATION_MAY_NOT,
    required_services: REQUIRED_AUTOMATION_SERVICES,
  };
}
