/**
 * CAE-11.6-W9 — Workflow services (aggregates W1–W8)
 */
import { caeId, nowIso } from "../../../../utils";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { workforceManagementService } from "../../workforce/services/workforce-service";
import { calendarEngineService } from "../../calendar/services/calendar-service";
import { communicationsService } from "../../communications/services/communications-service";
import { executiveService } from "../../executive/services/executive-service";
import type { WorkflowCondition, WorkflowRecord, WorkflowStep, WorkflowTrigger } from "../data-model";
import {
  getExecution,
  getWorkflow,
  getApproval,
  listApprovals,
  listAudit,
  listExecutions,
  listTemplates,
  listWorkflows,
  saveApproval,
  saveAudit,
  saveExecution,
  saveTemplate,
  saveWorkflow,
} from "./repository";

export class WorkflowError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function audit(institutionId: string, workflowId: string, event: string, actor: string, detail: string, executionId?: string) {
  saveAudit({
    audit_id: caeId("wfa"),
    institution_id: institutionId,
    workflow_id: workflowId,
    execution_id: executionId ?? null,
    event,
    actor,
    detail,
    evidence_refs: [workflowId, ...(executionId ? [executionId] : [])],
    occurred_at: nowIso(),
  });
}

function evaluateConditions(conditions: WorkflowCondition[]): boolean {
  if (conditions.length === 0) return true;
  return conditions.every((c) => c.expression.length > 0);
}

function buildTextualRepresentation(name: string, triggers: WorkflowTrigger[], steps: WorkflowStep[]): string {
  const triggerText = triggers.map((t) => t.trigger_type).join(", ");
  const stepText = steps.map((s) => `${s.action_type}${s.approval_required ? " [approval]" : ""}`).join(" → ");
  return `Workflow "${name}": WHEN [${triggerText}] THEN ${stepText}`;
}

export const triggerService = {
  supported: [
    "mission_created",
    "volunteer_registered",
    "manual_trigger",
    "time_schedule",
    "api",
    "calendar_event",
  ] as const,
  match(trigger: WorkflowTrigger, eventType: string) {
    return trigger.trigger_type === eventType;
  },
};

export const conditionService = {
  evaluate: evaluateConditions,
  describe(conditions: WorkflowCondition[]) {
    return conditions.map((c) => `${c.operator}: ${c.expression}`).join("; ");
  },
};

export const approvalService = {
  list: listApprovals,
  request(input: {
    execution_id: string;
    workflow_id: string;
    institution_id: string;
    approval_type: WorkflowRecord["approval_level"];
    assigned_to: string;
    step_id: string;
  }) {
    const record = {
      approval_id: caeId("wfa"),
      execution_id: input.execution_id,
      workflow_id: input.workflow_id,
      institution_id: input.institution_id,
      approval_type: input.approval_type,
      status: "pending" as const,
      assigned_to: input.assigned_to,
      approved_by: null,
      step_id: input.step_id,
      created_at: nowIso(),
      resolved_at: null,
    };
    saveApproval(record);
    audit(input.institution_id, input.workflow_id, "approval.requested", input.assigned_to, `Approval for step ${input.step_id}`, input.execution_id);
    return { approval: record, event: "approval.requested" as const };
  },
  approve(approvalId: string, approvedBy: string) {
    const approval = getApproval(approvalId);
    if (!approval) throw new WorkflowError("APPROVAL_NOT_FOUND", "Approval not found");
    const updated = { ...approval, status: "approved" as const, approved_by: approvedBy, resolved_at: nowIso() };
    saveApproval(updated);
    audit(approval.institution_id, approval.workflow_id, "approval.completed", approvedBy, "Approved", approval.execution_id);
    return { approval: updated, event: "approval.completed" as const };
  },
  reject(approvalId: string, rejectedBy: string) {
    const approval = getApproval(approvalId);
    if (!approval) throw new WorkflowError("APPROVAL_NOT_FOUND", "Approval not found");
    const updated = { ...approval, status: "rejected" as const, approved_by: rejectedBy, resolved_at: nowIso() };
    saveApproval(updated);
    return { approval: updated, event: "approval.completed" as const };
  },
};

export const actionService = {
  execute(step: WorkflowStep, institutionId: string) {
    switch (step.action_type) {
      case "create_task":
        return missionExecutionService.tasks.create({
          mission_id: step.config.mission_id ?? "opm-volunteer-training-001",
          title: step.config.title ?? "Workflow task",
          description: step.config.description ?? "",
          owner: step.config.owner ?? "usr-001",
          due_date: step.config.due_date ?? null,
        });
      case "assign_human":
        return workforceManagementService.assignments.assign({
          institution_id: institutionId,
          human_id: step.config.human_id ?? "usr-001",
          mission_id: step.config.mission_id ?? "opm-volunteer-training-001",
          assigned_role: "primary_owner",
          assigned_by: "workflow-engine",
          assignment_reason: step.config.reason ?? "Workflow assignment",
        });
      case "schedule_event": {
        const calendar = calendarEngineService.calendar.get(institutionId);
        return calendarEngineService.events.create({
          institution_id: institutionId,
          calendar_id: calendar?.calendar_id ?? "cal-block-street",
          title: step.config.title ?? "Workflow event",
          description: step.config.description ?? "",
          start_time: step.config.start_time ?? nowIso(),
          end_time: step.config.end_time ?? nowIso(),
          event_type: "meeting",
          created_by: "workflow-engine",
        });
      }
      case "notify_users":
        return communicationsService.announcements.create({
          institution_id: institutionId,
          title: step.config.title ?? "Workflow notification",
          body: step.config.body ?? "",
          scope: "institution",
          published_by: "workflow-engine",
        });
      case "request_approval":
        return { status: "approval_requested" };
      case "call_ai":
        return { advisory: true, summary: "AI action executed in advisory mode" };
      default:
        return { status: "completed", action: step.action_type };
    }
  },
};

export const workflowService = {
  list: listWorkflows,
  get: getWorkflow,
  create(input: {
    institution_id: string;
    name: string;
    description: string;
    category: WorkflowRecord["category"];
    owner: string;
    created_by: string;
    risk_level?: WorkflowRecord["risk_level"];
    automation_level?: WorkflowRecord["automation_level"];
    approval_level?: WorkflowRecord["approval_level"];
    triggers?: WorkflowTrigger[];
    conditions?: WorkflowCondition[];
    steps?: WorkflowStep[];
  }) {
    const triggers = input.triggers ?? [{ trigger_type: "manual_trigger", config: {} }];
    const steps = input.steps ?? [];
    const record: WorkflowRecord = {
      workflow_id: caeId("wfl"),
      institution_id: input.institution_id,
      name: input.name,
      description: input.description,
      category: input.category,
      status: "draft",
      owner: input.owner,
      created_by: input.created_by,
      version: 1,
      approval_level: input.approval_level ?? "single_approval",
      risk_level: input.risk_level ?? "low",
      automation_level: input.automation_level ?? 1,
      effective_date: null,
      expiration_date: null,
      triggers,
      conditions: input.conditions ?? [],
      steps,
      textual_representation: buildTextualRepresentation(input.name, triggers, steps),
      immutable_when_published: false,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    if (record.risk_level === "high" || record.risk_level === "critical") {
      if (record.automation_level >= 4) throw new WorkflowError("AUTOMATION_LEVEL_FORBIDDEN", "High-risk workflows may never use Level 4");
    }
    saveWorkflow(record);
    audit(input.institution_id, record.workflow_id, "workflow.created", input.created_by, record.name);
    return { workflow: record, event: "workflow.created" as const };
  },
  publish(workflowId: string, publishedBy: string) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    if (workflow.status !== "draft" && workflow.status !== "awaiting_approval" && workflow.status !== "testing") {
      throw new WorkflowError("INVALID_STATUS", "Workflow cannot be published from current status");
    }
    const updated: WorkflowRecord = {
      ...workflow,
      status: "published",
      immutable_when_published: true,
      effective_date: nowIso(),
      updated_at: nowIso(),
    };
    saveWorkflow(updated);
    audit(workflow.institution_id, workflowId, "workflow.published", publishedBy, "Published v" + workflow.version);
    return { workflow: updated, event: "workflow.published" as const };
  },
  pause(workflowId: string, actor: string) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    const updated = { ...workflow, status: "paused" as const, updated_at: nowIso() };
    saveWorkflow(updated);
    audit(workflow.institution_id, workflowId, "workflow.paused", actor, "Paused");
    return { workflow: updated };
  },
  resume(workflowId: string, actor: string) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    const updated = { ...workflow, status: "active" as const, updated_at: nowIso() };
    saveWorkflow(updated);
    audit(workflow.institution_id, workflowId, "workflow.resumed", actor, "Resumed");
    return { workflow: updated };
  },
  archive(workflowId: string, actor: string) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    const updated = { ...workflow, status: "archived" as const, updated_at: nowIso() };
    saveWorkflow(updated);
    audit(workflow.institution_id, workflowId, "workflow.archived", actor, "Archived");
    return { workflow: updated, event: "workflow.archived" as const };
  },
};

export const workflowExecutionService = {
  listRunning(institutionId: string) {
    return listExecutions(institutionId, "running");
  },
  list: listExecutions,
  get: getExecution,
  execute(workflowId: string, input: { institution_id: string; triggered_by: string; trigger?: WorkflowTrigger; inputs?: Record<string, string> }) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    if (workflow.status !== "published" && workflow.status !== "active") {
      throw new WorkflowError("WORKFLOW_NOT_ACTIVE", "Workflow must be published or active to execute");
    }
    const trigger = input.trigger ?? workflow.triggers[0] ?? { trigger_type: "manual_trigger", config: {} };
    if (!evaluateConditions(workflow.conditions)) {
      throw new WorkflowError("CONDITIONS_NOT_MET", "Workflow conditions not satisfied");
    }
    const start = Date.now();
    const executionId = caeId("wfx");
    const actionsCompleted: string[] = [];
    let status: "running" | "waiting_approval" | "completed" = "running";

    for (const step of workflow.steps) {
      if (step.approval_required && workflow.automation_level < 3) {
        approvalService.request({
          execution_id: executionId,
          workflow_id: workflowId,
          institution_id: input.institution_id,
          approval_type: step.approval_type ?? workflow.approval_level,
          assigned_to: input.triggered_by,
          step_id: step.step_id,
        });
        status = "waiting_approval";
        break;
      }
      actionService.execute(step, input.institution_id);
      actionsCompleted.push(step.step_id);
    }

    if (status === "running" && actionsCompleted.length === workflow.steps.length) status = "completed";

    const record = {
      execution_id: executionId,
      workflow_id: workflowId,
      institution_id: input.institution_id,
      status,
      trigger,
      inputs: input.inputs ?? {},
      conditions_evaluated: workflow.conditions,
      approvals: [],
      actions_completed: actionsCompleted,
      outputs: { result: status },
      ai_participation: workflow.steps.some((s) => s.action_type === "call_ai"),
      duration_ms: Date.now() - start,
      failures: [],
      recovery_action: null,
      evidence_refs: [workflowId, executionId],
      started_at: nowIso(),
      completed_at: status === "completed" ? nowIso() : null,
    };
    saveExecution(record);
    audit(input.institution_id, workflowId, "workflow.executed", input.triggered_by, `Execution ${executionId}`, executionId);
    if (status === "completed") audit(input.institution_id, workflowId, "workflow.completed", input.triggered_by, "Completed", executionId);
    return { execution: record, event: status === "completed" ? ("workflow.completed" as const) : ("workflow.executed" as const) };
  },
};

export const workflowTemplateService = {
  list: listTemplates,
  create(input: {
    institution_id: string;
    name: string;
    description: string;
    category: WorkflowRecord["category"];
    default_steps: WorkflowStep[];
    default_triggers: WorkflowTrigger[];
  }) {
    const record = {
      template_id: caeId("wft"),
      institution_id: input.institution_id,
      name: input.name,
      description: input.description,
      category: input.category,
      default_steps: input.default_steps,
      default_triggers: input.default_triggers,
      created_at: nowIso(),
    };
    saveTemplate(record);
    return { template: record };
  },
  instantiate(templateId: string, institutionId: string, createdBy: string) {
    const template = listTemplates(institutionId).find((t) => t.template_id === templateId);
    if (!template) throw new WorkflowError("TEMPLATE_NOT_FOUND", "Template not found");
    return workflowService.create({
      institution_id: institutionId,
      name: template.name,
      description: template.description,
      category: template.category,
      owner: createdBy,
      created_by: createdBy,
      triggers: template.default_triggers,
      steps: template.default_steps,
    });
  },
};

export const escalationService = {
  escalate(input: { institution_id: string; workflow_id: string; execution_id: string; reason: string; escalated_to: string }) {
    audit(input.institution_id, input.workflow_id, "automation.escalated", input.escalated_to, input.reason, input.execution_id);
    executiveService.alerts.list(input.institution_id);
    return { event: "automation.escalated" as const, reason: input.reason };
  },
};

export const automationAnalyticsService = {
  analyze(institutionId: string) {
    const executions = listExecutions(institutionId);
    const completed = executions.filter((e) => e.status === "completed");
    const failed = executions.filter((e) => e.status === "failed");
    return {
      institution_id: institutionId,
      workflow_health: completed.length / Math.max(executions.length, 1),
      automation_success_rate: completed.length / Math.max(executions.length, 1),
      failure_rate: failed.length / Math.max(executions.length, 1),
      pending_approvals: listApprovals(institutionId, "pending").length,
      avg_execution_time_ms: completed.length
        ? completed.reduce((s, e) => s + e.duration_ms, 0) / completed.length
        : 0,
      ai_participation_rate: executions.filter((e) => e.ai_participation).length / Math.max(executions.length, 1),
      evaluates_workflows_not_people: true,
    };
  },
};

export const workflowRecoveryService = {
  retry(executionId: string, actor: string) {
    const execution = getExecution(executionId);
    if (!execution) throw new WorkflowError("EXECUTION_NOT_FOUND", "Execution not found");
    return workflowExecutionService.execute(execution.workflow_id, {
      institution_id: execution.institution_id,
      triggered_by: actor,
      trigger: execution.trigger,
      inputs: execution.inputs,
    });
  },
  rollback(executionId: string, actor: string) {
    const execution = getExecution(executionId);
    if (!execution) throw new WorkflowError("EXECUTION_NOT_FOUND", "Execution not found");
    const updated = { ...execution, status: "rolled_back" as const, recovery_action: "rollback", completed_at: nowIso() };
    saveExecution(updated);
    audit(execution.institution_id, execution.workflow_id, "workflow.rolled_back", actor, "Rollback", executionId);
    return { execution: updated };
  },
};

export const connectorService = {
  supported: ["rest", "webhook", "internal_service"] as const,
  call(type: string, config: Record<string, string>) {
    return { connector: type, status: "governed", config, outbound: true };
  },
};

export const aiWorkflowCoordinatorService = {
  recommend(institutionId: string) {
    const analytics = automationAnalyticsService.analyze(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_alter_governance: true,
      recommendations: analytics.pending_approvals > 0 ? ["Review pending workflow approvals"] : ["Workflow automation healthy"],
      event: "AI.workflow.generated" as const,
    };
  },
  generate(input: { institution_id: string; purpose: string; created_by: string }) {
    return workflowService.create({
      institution_id: input.institution_id,
      name: `AI-suggested: ${input.purpose}`,
      description: `AI-recommended workflow for ${input.purpose}. Requires Human review before publish.`,
      category: "custom",
      owner: input.created_by,
      created_by: input.created_by,
      automation_level: 1,
      steps: [
        { step_id: "ai-step-1", action_type: "notify_users", config: { title: "Workflow started" }, approval_required: true },
      ],
    });
  },
  explain(workflowId: string) {
    const workflow = getWorkflow(workflowId);
    if (!workflow) throw new WorkflowError("WORKFLOW_NOT_FOUND", "Workflow not found");
    return { workflow_id: workflowId, explanation: workflow.textual_representation, advisory_only: true };
  },
};

export const workflowMonitoringService = {
  status(institutionId: string) {
    const workflows = listWorkflows(institutionId);
    const running = listExecutions(institutionId, "running");
    const analytics = automationAnalyticsService.analyze(institutionId);
    return {
      ...analytics,
      total_workflows: workflows.length,
      active_workflows: workflows.filter((w) => w.status === "active" || w.status === "published").length,
      running_executions: running.length,
    };
  },
};

export const workflowAuditService = {
  list: listAudit,
  forWorkflow: (institutionId: string, workflowId: string) => listAudit(institutionId, workflowId),
};

export const workflowOrchestrationService = {
  workflows: workflowService,
  triggers: triggerService,
  conditions: conditionService,
  approvals: approvalService,
  actions: actionService,
  execution: workflowExecutionService,
  templates: workflowTemplateService,
  escalation: escalationService,
  analytics: automationAnalyticsService,
  recovery: workflowRecoveryService,
  connectors: connectorService,
  ai: aiWorkflowCoordinatorService,
  monitoring: workflowMonitoringService,
  audit: workflowAuditService,
};
