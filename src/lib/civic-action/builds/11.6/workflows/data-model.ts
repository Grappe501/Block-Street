/**
 * CAE-11.6-W9 — Workflow orchestration data model
 */
import type {
  APPROVAL_TYPES,
  AUTOMATION_LEVELS,
  WORKFLOW_ACTION_TYPES,
  WORKFLOW_CATEGORIES,
  WORKFLOW_LIFECYCLE,
  WORKFLOW_TRIGGER_TYPES,
} from "./constitution";

export type WorkflowCategory = (typeof WORKFLOW_CATEGORIES)[number];
export type WorkflowStatus = (typeof WORKFLOW_LIFECYCLE)[number];
export type ApprovalType = (typeof APPROVAL_TYPES)[number];
export type AutomationLevel = (typeof AUTOMATION_LEVELS)[number]["level"];
export type WorkflowTriggerType = (typeof WORKFLOW_TRIGGER_TYPES)[number];
export type WorkflowActionType = (typeof WORKFLOW_ACTION_TYPES)[number];

export interface WorkflowTrigger {
  trigger_type: WorkflowTriggerType;
  config: Record<string, string>;
}

export interface WorkflowCondition {
  expression: string;
  operator: "and" | "or" | "not" | "if_then" | "else";
}

export interface WorkflowStep {
  step_id: string;
  action_type: WorkflowActionType;
  config: Record<string, string>;
  approval_required: boolean;
  approval_type?: ApprovalType;
}

export interface WorkflowRecord {
  workflow_id: string;
  institution_id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  owner: string;
  created_by: string;
  version: number;
  approval_level: ApprovalType;
  risk_level: "low" | "medium" | "high" | "critical";
  automation_level: AutomationLevel;
  effective_date: string | null;
  expiration_date: string | null;
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  steps: WorkflowStep[];
  textual_representation: string;
  immutable_when_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecutionRecord {
  execution_id: string;
  workflow_id: string;
  institution_id: string;
  status: "running" | "waiting_approval" | "completed" | "failed" | "paused" | "rolled_back";
  trigger: WorkflowTrigger;
  inputs: Record<string, string>;
  conditions_evaluated: WorkflowCondition[];
  approvals: string[];
  actions_completed: string[];
  outputs: Record<string, string>;
  ai_participation: boolean;
  duration_ms: number;
  failures: string[];
  recovery_action: string | null;
  evidence_refs: string[];
  started_at: string;
  completed_at: string | null;
}

export interface WorkflowApprovalRecord {
  approval_id: string;
  execution_id: string;
  workflow_id: string;
  institution_id: string;
  approval_type: ApprovalType;
  status: "pending" | "approved" | "rejected";
  assigned_to: string;
  approved_by: string | null;
  step_id: string;
  created_at: string;
  resolved_at: string | null;
}

export interface WorkflowTemplateRecord {
  template_id: string;
  institution_id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  default_steps: WorkflowStep[];
  default_triggers: WorkflowTrigger[];
  created_at: string;
}

export interface WorkflowAuditRecord {
  audit_id: string;
  institution_id: string;
  workflow_id: string;
  execution_id: string | null;
  event: string;
  actor: string;
  detail: string;
  evidence_refs: string[];
  occurred_at: string;
}

export const WORKFLOW_STORE_KEYS = {
  workflows: "ops_workflows",
  executions: "ops_workflow_executions",
  approvals: "ops_workflow_approvals",
  templates: "ops_workflow_templates",
  audit: "ops_workflow_audit",
} as const;
