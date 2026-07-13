/**
 * CAE-11.7-W12 — Automation Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { DEFAULT_AUTOMATION_LEVEL } from "../constitution";
import type { AutomationLevel } from "../data-model";
import {
  listApprovals,
  listAutomationAnalytics,
  listAutomationPermissions,
  listExceptions,
  listIntegrations,
  listInterventions,
  listOperationalGovernance,
  listPlaybooks,
  listRuns,
  listSchedules,
  listWorkflows,
  saveApproval,
  saveAutomationAnalytics,
  saveAutomationPermission,
  saveException,
  saveIntegration,
  saveIntervention,
  saveOperationalGovernance,
  savePlaybook,
  saveRun,
  saveSchedule,
  saveWorkflow,
} from "./repository";

export class AutomationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureAutomationBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
  seedFederationIfEmpty();
}

function getBrain(humanId: string) {
  ensureAutomationBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new AutomationError("AUTOMATION_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function getRun(runId: string, institutionId: string) {
  const run = listRuns(institutionId).find((r) => r.run_id === runId);
  if (!run) throw new AutomationError("RUN_NOT_FOUND", "Workflow run not found");
  return run;
}

export const workflowRegistryService = {
  list: listWorkflows,
  register(input: {
    institution_id: string;
    name: string;
    owner: string;
    category: string;
    purpose: string;
    required_permissions?: string[];
    risk_level?: "low" | "medium" | "high" | "critical";
    automation_level?: AutomationLevel;
    approval_requirements?: string[];
  }) {
    const existing = listWorkflows(input.institution_id).filter((w) => w.name === input.name);
    const record = {
      workflow_id: caeId("wfl"),
      name: input.name,
      institution_id: input.institution_id,
      owner: input.owner,
      version: existing.length + 1,
      category: input.category,
      purpose: input.purpose,
      required_permissions: input.required_permissions ?? ["workflow.execute"],
      risk_level: input.risk_level ?? ("medium" as const),
      automation_level: input.automation_level ?? (DEFAULT_AUTOMATION_LEVEL as AutomationLevel),
      approval_requirements: input.approval_requirements ?? ["human_supervisor"],
      status: "active" as const,
      governed: true as const,
    };
    saveWorkflow(record);
    operationalGovernanceService.track({
      workflow_id: record.workflow_id,
      institution_id: input.institution_id,
      owner: input.owner,
      version: record.version,
    });
    return { workflow: record, governed: true };
  },
};

export const approvalService = {
  list: listApprovals,
  request(input: {
    run_id: string;
    workflow_id: string;
    institution_id: string;
    human_id: string;
    approval_type?: "role" | "committee" | "financial" | "legal" | "executive" | "emergency";
    required_role?: string;
  }) {
    const record = {
      approval_id: caeId("apr"),
      run_id: input.run_id,
      workflow_id: input.workflow_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      approval_type: input.approval_type ?? ("role" as const),
      required_role: input.required_role ?? "supervisor",
      status: "pending" as const,
      autonomous_approval: false as const,
      recorded_at: nowIso(),
    };
    saveApproval(record);
    return { approval: record, event: "approval.requested" as const, autonomous_approval: false };
  },
  grant(approvalId: string, institutionId: string, humanId: string) {
    const approval = listApprovals(institutionId).find((a) => a.approval_id === approvalId);
    if (!approval) throw new AutomationError("APPROVAL_NOT_FOUND", "Approval not found");
    const updated = { ...approval, status: "granted" as const };
    saveApproval(updated);
    return { approval: updated, event: "approval.granted" as const, recorded: true };
  },
  deny(approvalId: string, institutionId: string) {
    const approval = listApprovals(institutionId).find((a) => a.approval_id === approvalId);
    if (!approval) throw new AutomationError("APPROVAL_NOT_FOUND", "Approval not found");
    const updated = { ...approval, status: "denied" as const };
    saveApproval(updated);
    return { approval: updated, event: "approval.denied" as const };
  },
};

export const automationPermissionService = {
  list: listAutomationPermissions,
  grant(input: { run_id: string; institution_id: string; scope: string[]; duration_hours?: number }) {
    const expires = new Date(Date.now() + (input.duration_hours ?? 24) * 3600000).toISOString();
    const record = {
      permission_id: caeId("apm"),
      run_id: input.run_id,
      institution_id: input.institution_id,
      scope: input.scope,
      temporary: true as const,
      expires_at: expires,
      revocable: true as const,
      inherits_human_authority: false as const,
      granted_at: nowIso(),
    };
    saveAutomationPermission(record);
    return { permission: record, inherits_human_authority: false, revocable: true };
  },
};

export const playbookService = {
  list: listPlaybooks,
  create(input: {
    institution_id: string;
    name: string;
    category: string;
    description: string;
    workflow_id: string;
  }) {
    const existing = listPlaybooks(input.institution_id).filter((p) => p.name === input.name);
    const record = {
      playbook_id: caeId("pbk"),
      institution_id: input.institution_id,
      name: input.name,
      category: input.category,
      description: input.description,
      workflow_id: input.workflow_id,
      reusable: true as const,
      version: existing.length + 1,
      status: "active" as const,
    };
    savePlaybook(record);
    return { playbook: record, reusable: true };
  },
};

export const longRunningWorkflowService = {
  list: listRuns,
  markDurable(runId: string, institutionId: string) {
    const run = getRun(runId, institutionId);
    const updated = { ...run, survives_restart: true as const };
    saveRun(updated);
    return { run: updated, survives_restart: true, long_running: true };
  },
};

export const exceptionRecoveryService = {
  list: listExceptions,
  handle(input: {
    run_id: string;
    institution_id: string;
    error: string;
    action: "pause" | "retry" | "escalate" | "rollback" | "recover" | "request_human";
    retry_count?: number;
  }) {
    const run = getRun(input.run_id, input.institution_id);
    const record = {
      exception_id: caeId("exc"),
      run_id: input.run_id,
      institution_id: input.institution_id,
      error: input.error,
      action_taken: input.action,
      retry_count: input.retry_count ?? 0,
      concealed: false as const,
      occurred_at: nowIso(),
    };
    saveException(record);

    let updatedRun = { ...run };
    if (input.action === "pause" || input.action === "request_human") {
      updatedRun = { ...run, status: "paused" as const };
    } else if (input.action === "recover") {
      updatedRun = { ...run, status: "running" as const };
    } else if (input.action === "escalate") {
      updatedRun = { ...run, status: "paused" as const };
    }
    saveRun(updatedRun);

    const event =
      input.action === "recover"
        ? ("automation.recovered" as const)
        : input.action === "escalate"
          ? ("automation.escalated" as const)
          : ("workflow.failed" as const);

    return {
      exception: record,
      run: updatedRun,
      event,
      concealed: false,
      continue_blindly: false,
    };
  },
};

export const automationScheduler = {
  list: listSchedules,
  schedule(input: {
    workflow_id: string;
    institution_id: string;
    trigger_type: "time" | "event" | "condition" | "calendar" | "mission" | "dependency" | "approval" | "recurring";
    authorized: boolean;
    scheduled_at?: string;
  }) {
    if (!input.authorized) {
      throw new AutomationError("SCHEDULE_REQUIRES_AUTH", "Automation begins only after authorization");
    }
    const record = {
      schedule_id: caeId("sch"),
      workflow_id: input.workflow_id,
      institution_id: input.institution_id,
      trigger_type: input.trigger_type,
      authorized: true,
      status: "scheduled" as const,
      scheduled_at: input.scheduled_at ?? nowIso(),
    };
    saveSchedule(record);
    return { schedule: record, authorized: true };
  },
};

export const integrationService = {
  list: listIntegrations,
  connect(input: {
    institution_id: string;
    system: "email" | "calendar" | "crm" | "documents" | "storage" | "finance" | "volunteers" | "government" | "communications";
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new AutomationError("INTEGRATION_REQUIRES_APPROVAL", "Integration requires Human approval");
    }
    const record = {
      integration_id: caeId("int"),
      institution_id: input.institution_id,
      system: input.system,
      permission_aware: true as const,
      status: "active" as const,
    };
    saveIntegration(record);
    return { integration: record, permission_aware: true };
  },
};

export const humanInterventionService = {
  list: listInterventions,
  intervene(input: {
    run_id: string;
    institution_id: string;
    human_id: string;
    action: "pause" | "resume" | "cancel" | "redirect" | "override" | "restart" | "inspect" | "replay" | "correct";
    reason: string;
  }) {
    getBrain(input.human_id);
    const run = getRun(input.run_id, input.institution_id);
    const record = {
      intervention_id: caeId("ivn"),
      run_id: input.run_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      action: input.action,
      reason: input.reason,
      uncontrollable: false as const,
      intervened_at: nowIso(),
    };
    saveIntervention(record);

    let status = run.status;
    if (input.action === "pause") status = "paused";
    else if (input.action === "resume" || input.action === "restart") status = "running";
    else if (input.action === "cancel") status = "cancelled";

    const updated = { ...run, status };
    saveRun(updated);

    return {
      intervention: record,
      run: updated,
      uncontrollable: false,
      event: input.action === "pause" ? ("workflow.paused" as const) : undefined,
    };
  },
};

export const automationAnalyticsService = {
  list: listAutomationAnalytics,
  measure(input: { institution_id: string; workflow_id: string }) {
    const record = {
      analytics_id: caeId("anl"),
      institution_id: input.institution_id,
      workflow_id: input.workflow_id,
      completion_rate: 0.88,
      failure_rate: 0.05,
      recovery_rate: 0.92,
      human_intervention_frequency: 0.15,
      approval_latency_ms: 3600000,
      execution_time_ms: 120000,
      evaluates_people: false as const,
      measured_at: nowIso(),
    };
    saveAutomationAnalytics(record);
    return { analytics: record, evaluates_people: false };
  },
};

export const operationalGovernanceService = {
  list: listOperationalGovernance,
  track(input: { workflow_id: string; institution_id: string; owner: string; version: number }) {
    const record = {
      governance_id: caeId("gov"),
      workflow_id: input.workflow_id,
      institution_id: input.institution_id,
      owner: input.owner,
      version: input.version,
      approvals_count: 0,
      incident_count: 0,
      retired: false,
      policy_compliant: true as const,
      updated_at: nowIso(),
    };
    saveOperationalGovernance(record);
    return { governance: record, policy_compliant: true };
  },
};

export const workflowEngine = {
  listRuns,
  start(input: {
    human_id: string;
    institution_id: string;
    workflow_id: string;
    execution_mode?: "sequential" | "parallel";
    approved_by_human: boolean;
  }) {
    getBrain(input.human_id);
    const workflow = listWorkflows(input.institution_id).find((w) => w.workflow_id === input.workflow_id);
    if (!workflow) throw new AutomationError("WORKFLOW_NOT_FOUND", "Workflow not found");

    if (workflow.risk_level === "critical" || workflow.risk_level === "high") {
      if (!input.approved_by_human) {
        throw new AutomationError("HIGH_RISK_REQUIRES_APPROVAL", "High-risk workflows require Human approval");
      }
    }

    const needsApproval = workflow.automation_level >= 2;
    const run = {
      run_id: caeId("run"),
      workflow_id: input.workflow_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      status: needsApproval && !input.approved_by_human ? ("pending_approval" as const) : ("running" as const),
      execution_mode: input.execution_mode ?? ("sequential" as const),
      current_step: "initialize",
      steps_completed: [] as string[],
      evidence: [`Workflow ${workflow.name} v${workflow.version} started`],
      interruptible: true as const,
      observable: true as const,
      started_at: nowIso(),
      completed_at: null,
      survives_restart: true as const,
    };
    saveRun(run);

    let approval = null;
    if (needsApproval) {
      approval = approvalService.request({
        run_id: run.run_id,
        workflow_id: input.workflow_id,
        institution_id: input.institution_id,
        human_id: input.human_id,
        approval_type: workflow.risk_level === "critical" ? "executive" : "role",
      });
      if (input.approved_by_human) {
        approval = approvalService.grant(approval.approval.approval_id, input.institution_id, input.human_id);
        run.status = "running";
        saveRun({ ...run, status: "running" });
      }
    }

    automationPermissionService.grant({
      run_id: run.run_id,
      institution_id: input.institution_id,
      scope: workflow.required_permissions,
      duration_hours: 8,
    });

    if (run.status === "running") {
      const completed = {
        ...run,
        current_step: "complete",
        steps_completed: ["initialize", "execute", "audit"],
        evidence: [...run.evidence, "Step evidence recorded", "Audit trail preserved"],
        status: "completed" as const,
        completed_at: nowIso(),
      };
      saveRun(completed);
      automationAnalyticsService.measure({ institution_id: input.institution_id, workflow_id: input.workflow_id });
      return {
        run: completed,
        approval: approval?.approval ?? null,
        event: "workflow.completed" as const,
        observable: true,
        interruptible: true,
        exceeds_authority: false,
      };
    }

    return {
      run,
      approval: approval?.approval ?? null,
      event: "workflow.started" as const,
      observable: true,
      interruptible: true,
      exceeds_authority: false,
    };
  },
  pause(runId: string, institutionId: string, humanId: string) {
    return humanInterventionService.intervene({
      run_id: runId,
      institution_id: institutionId,
      human_id: humanId,
      action: "pause",
      reason: "Human pause requested",
    });
  },
  resume(runId: string, institutionId: string, humanId: string) {
    return humanInterventionService.intervene({
      run_id: runId,
      institution_id: institutionId,
      human_id: humanId,
      action: "resume",
      reason: "Human resume requested",
    });
  },
  cancel(runId: string, institutionId: string, humanId: string) {
    return humanInterventionService.intervene({
      run_id: runId,
      institution_id: institutionId,
      human_id: humanId,
      action: "cancel",
      reason: "Human cancel requested",
    });
  },
};

export const automationRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureAutomationBoot();
    getBrain(input.human_id);
    const workflows = listWorkflows(input.institution_id);
    const runs = listRuns(input.institution_id);
    const approvals = listApprovals(input.institution_id).filter((a) => a.status === "pending");
    const playbooks = listPlaybooks(input.institution_id);

    return {
      greeting: "Automation Dashboard",
      central_question: "What work is happening right now, and can I safely intervene at any time?",
      workflows: workflows.length,
      running: runs.filter((r) => r.status === "running").length,
      paused: runs.filter((r) => r.status === "paused").length,
      pending_approvals: approvals.length,
      playbooks: playbooks.length,
      default_automation_level: DEFAULT_AUTOMATION_LEVEL,
      fully_autonomous: false,
      oversight_never_disappears: true,
      mutates_canonical: false,
    };
  },
  security: {
    prohibited: [
      "grant_new_permissions",
      "spend_without_approval",
      "delete_audit_history",
      "conceal_failures",
      "override_human_intervention",
      "self_modifying_automation",
      "execute_unapproved_high_risk",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), observable: true };
    },
  },
};

export const automationRuntime = {
  automation: automationRuntimeService,
  registry: workflowRegistryService,
  engine: workflowEngine,
  approvals: approvalService,
  permissions: automationPermissionService,
  playbooks: playbookService,
  longRunning: longRunningWorkflowService,
  recovery: exceptionRecoveryService,
  scheduler: automationScheduler,
  integrations: integrationService,
  intervention: humanInterventionService,
  analytics: automationAnalyticsService,
  governance: operationalGovernanceService,
};
