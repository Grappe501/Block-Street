/**
 * CAE-11.6-W9 — Workflow tests
 */
import { workflowOrchestrationService } from "./services/workflow-service";
import { seedWorkflowsIfEmpty } from "./services/seed";
import { getWorkflowConstitution, OPS_WORKFLOW_PRINCIPLE, REQUIRED_WORKFLOW_SERVICES } from "./constitution";
import { checkOpsW9Invariants } from "./invariants";
import { explainWorkflowExecution } from "./traceability";
import { WORKFLOW_EVENT_CATALOG } from "./events/catalog";

export type OpsW9TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW9WorkflowTests(): OpsW9TestResult[] {
  seedWorkflowsIfEmpty();
  const results: OpsW9TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getWorkflowConstitution();
  results.push({ name: "workflow_principle", passed: constitution.governing_principle === OPS_WORKFLOW_PRINCIPLE });

  results.push({
    name: "required_workflow_services",
    passed: REQUIRED_WORKFLOW_SERVICES.length === 14,
    detail: `${REQUIRED_WORKFLOW_SERVICES.length} services`,
  });

  results.push({ name: "w9_invariants", passed: checkOpsW9Invariants().every((i) => i.passed) });

  const workflows = workflowOrchestrationService.workflows.list(institutionId);
  results.push({
    name: "workflow_list",
    passed: workflows.length >= 1,
    detail: workflows[0]?.name,
  });

  const workflow = workflowOrchestrationService.workflows.get("wfl-volunteer-onboarding");
  results.push({
    name: "published_workflow",
    passed: workflow?.status === "published" && workflow.immutable_when_published === true,
    detail: workflow?.status,
  });

  const created = workflowOrchestrationService.workflows.create({
    institution_id: institutionId,
    name: "Test Approval Workflow",
    description: "Draft workflow for testing",
    category: "approval",
    owner: "usr-001",
    created_by: "usr-001",
    risk_level: "low",
    automation_level: 1,
    steps: [{ step_id: "t1", action_type: "notify_users", config: { title: "Test" }, approval_required: false }],
  });
  results.push({
    name: "create_workflow",
    passed: created.workflow.status === "draft" && created.event === "workflow.created",
    detail: created.workflow.workflow_id,
  });

  const published = workflowOrchestrationService.workflows.publish(created.workflow.workflow_id, "usr-001");
  results.push({
    name: "publish_workflow",
    passed: published.workflow.immutable_when_published === true,
    detail: published.event,
  });

  const executed = workflowOrchestrationService.execution.execute("wfl-volunteer-onboarding", {
    institution_id: institutionId,
    triggered_by: "usr-001",
    trigger: { trigger_type: "manual_trigger", config: {} },
  });
  results.push({
    name: "execute_workflow",
    passed: !!executed.execution.execution_id && executed.execution.evidence_refs.length >= 1,
    detail: executed.execution.status,
  });

  const templates = workflowOrchestrationService.templates.list(institutionId);
  results.push({
    name: "workflow_templates",
    passed: templates.length >= 1,
    detail: templates[0]?.name,
  });

  const monitoring = workflowOrchestrationService.monitoring.status(institutionId);
  results.push({
    name: "workflow_monitoring",
    passed: monitoring.evaluates_workflows_not_people === true,
    detail: `${monitoring.total_workflows} workflows`,
  });

  const analytics = workflowOrchestrationService.analytics.analyze(institutionId);
  results.push({
    name: "automation_analytics",
    passed: analytics.evaluates_workflows_not_people === true,
    detail: `success rate ${analytics.automation_success_rate}`,
  });

  const ai = workflowOrchestrationService.ai.recommend(institutionId);
  results.push({
    name: "ai_workflow_coordination",
    passed: ai.advisory_only === true && ai.may_not_alter_governance === true,
  });

  const audit = workflowOrchestrationService.audit.list(institutionId);
  results.push({
    name: "workflow_audit",
    passed: audit.length >= 1,
    detail: `${audit.length} audit events`,
  });

  const trace = explainWorkflowExecution({
    institution_id: institutionId,
    workflow_id: "wfl-volunteer-onboarding",
    execution_id: executed.execution.execution_id,
    evidence_refs: executed.execution.evidence_refs,
  });
  results.push({
    name: "workflow_traceability",
    passed: trace.includes("Evidence") && trace.includes("Institution"),
  });

  results.push({
    name: "workflow_event_catalog",
    passed: WORKFLOW_EVENT_CATALOG.length >= 10,
    detail: `${WORKFLOW_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW9TestsPassed(): boolean {
  return runOpsW9WorkflowTests().every((t) => t.passed);
}
