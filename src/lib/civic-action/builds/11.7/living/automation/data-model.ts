/**
 * CAE-11.7-W12 — Automation data model
 */
import type { AUTOMATION_LEVELS } from "./constitution";

export type AutomationLevel = (typeof AUTOMATION_LEVELS)[number];

export const AUTOMATION_STORE_KEYS = {
  workflows: "lix_automation_workflows",
  runs: "lix_automation_runs",
  approvals: "lix_automation_approvals",
  permissions: "lix_automation_permissions",
  playbooks: "lix_automation_playbooks",
  schedules: "lix_automation_schedules",
  exceptions: "lix_automation_exceptions",
  interventions: "lix_automation_interventions",
  analytics: "lix_automation_analytics",
  governance: "lix_automation_governance",
  integrations: "lix_automation_integrations",
} as const;

export interface WorkflowRecord {
  workflow_id: string;
  name: string;
  institution_id: string;
  owner: string;
  version: number;
  category: string;
  purpose: string;
  required_permissions: string[];
  risk_level: "low" | "medium" | "high" | "critical";
  automation_level: AutomationLevel;
  approval_requirements: string[];
  status: "active" | "paused" | "retired" | "draft";
  governed: true;
}

export interface WorkflowRunRecord {
  run_id: string;
  workflow_id: string;
  institution_id: string;
  human_id: string;
  status: "pending_approval" | "running" | "paused" | "completed" | "failed" | "cancelled";
  execution_mode: "sequential" | "parallel";
  current_step: string;
  steps_completed: string[];
  evidence: string[];
  interruptible: true;
  observable: true;
  started_at: string;
  completed_at: string | null;
  survives_restart: true;
}

export interface ApprovalRecord {
  approval_id: string;
  run_id: string;
  workflow_id: string;
  institution_id: string;
  human_id: string;
  approval_type: "role" | "committee" | "financial" | "legal" | "executive" | "emergency";
  required_role: string | null;
  status: "pending" | "granted" | "denied";
  autonomous_approval: false;
  recorded_at: string;
}

export interface AutomationPermissionRecord {
  permission_id: string;
  run_id: string;
  institution_id: string;
  scope: string[];
  temporary: true;
  expires_at: string;
  revocable: true;
  inherits_human_authority: false;
  granted_at: string;
}

export interface PlaybookRecord {
  playbook_id: string;
  institution_id: string;
  name: string;
  category: string;
  description: string;
  workflow_id: string;
  reusable: true;
  version: number;
  status: "active" | "retired";
}

export interface ScheduleRecord {
  schedule_id: string;
  workflow_id: string;
  institution_id: string;
  trigger_type: "time" | "event" | "condition" | "calendar" | "mission" | "dependency" | "approval" | "recurring";
  authorized: boolean;
  status: "scheduled" | "triggered" | "cancelled";
  scheduled_at: string;
}

export interface ExceptionRecord {
  exception_id: string;
  run_id: string;
  institution_id: string;
  error: string;
  action_taken: "pause" | "retry" | "escalate" | "rollback" | "recover" | "request_human";
  retry_count: number;
  concealed: false;
  occurred_at: string;
}

export interface InterventionRecord {
  intervention_id: string;
  run_id: string;
  institution_id: string;
  human_id: string;
  action: "pause" | "resume" | "cancel" | "redirect" | "override" | "restart" | "inspect" | "replay" | "correct";
  reason: string;
  uncontrollable: false;
  intervened_at: string;
}

export interface AutomationAnalyticsRecord {
  analytics_id: string;
  institution_id: string;
  workflow_id: string;
  completion_rate: number;
  failure_rate: number;
  recovery_rate: number;
  human_intervention_frequency: number;
  approval_latency_ms: number;
  execution_time_ms: number;
  evaluates_people: false;
  measured_at: string;
}

export interface OperationalGovernanceRecord {
  governance_id: string;
  workflow_id: string;
  institution_id: string;
  owner: string;
  version: number;
  approvals_count: number;
  incident_count: number;
  retired: boolean;
  policy_compliant: true;
  updated_at: string;
}

export interface IntegrationRecord {
  integration_id: string;
  institution_id: string;
  system: "email" | "calendar" | "crm" | "documents" | "storage" | "finance" | "volunteers" | "government" | "communications";
  permission_aware: true;
  status: "active" | "disabled";
}
