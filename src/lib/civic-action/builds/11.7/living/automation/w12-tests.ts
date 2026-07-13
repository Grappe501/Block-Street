/**
 * CAE-11.7-W12 — Automation tests
 */
import { automationRuntime } from "./services/automation-service";
import { seedAutomationIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { DEFAULT_AUTOMATION_LEVEL, getAutomationConstitution, LIX_AUTOMATION_PRINCIPLE, REQUIRED_AUTOMATION_SERVICES } from "./constitution";
import { checkLixW12Invariants } from "./invariants";
import { explainAutomationAction } from "./traceability";
import { AUTOMATION_EVENT_CATALOG } from "./events/catalog";

export type LixW12TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW12CertificationTests(): LixW12TestResult[] {
  seedAutomationIfEmpty();
  const results: LixW12TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getAutomationConstitution();
  results.push({ name: "automation_principle", passed: constitution.governing_principle === LIX_AUTOMATION_PRINCIPLE });
  results.push({ name: "default_automation_level", passed: constitution.default_level === DEFAULT_AUTOMATION_LEVEL, detail: `level ${DEFAULT_AUTOMATION_LEVEL}` });

  results.push({
    name: "required_automation_services",
    passed: REQUIRED_AUTOMATION_SERVICES.length === 12,
    detail: `${REQUIRED_AUTOMATION_SERVICES.length} services`,
  });

  results.push({ name: "w12_invariants", passed: checkLixW12Invariants().every((i) => i.passed) });
  results.push({
    name: "automation_event_catalog",
    passed: AUTOMATION_EVENT_CATALOG.length >= 9,
    detail: `${AUTOMATION_EVENT_CATALOG.length} events`,
  });

  const dashboard = automationRuntime.automation.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "automation_dashboard",
    passed: dashboard.fully_autonomous === false && dashboard.oversight_never_disappears === true,
    detail: dashboard.central_question,
  });

  const workflow = automationRuntime.registry.register({
    institution_id: institutionId,
    name: "Grant Application Prep",
    owner: humanId,
    category: "finance",
    purpose: "Prepare grant application documents with Human checkpoints",
    risk_level: "high",
    automation_level: 2,
    approval_requirements: ["financial_approver", "executive"],
  });
  results.push({
    name: "workflow_registry",
    passed: workflow.workflow.governed === true && workflow.workflow.automation_level === 2,
    detail: workflow.workflow.workflow_id,
  });

  let highRiskBlocked = false;
  try {
    automationRuntime.engine.start({
      human_id: humanId,
      institution_id: institutionId,
      workflow_id: workflow.workflow.workflow_id,
      approved_by_human: false,
    });
  } catch {
    highRiskBlocked = true;
  }
  results.push({ name: "high_risk_requires_approval", passed: highRiskBlocked, detail: "approval required" });

  const run = automationRuntime.engine.start({
    human_id: humanId,
    institution_id: institutionId,
    workflow_id: workflow.workflow.workflow_id,
    approved_by_human: true,
  });
  results.push({
    name: "workflow_execution",
    passed: run.observable === true && run.interruptible === true && run.exceeds_authority === false,
    detail: run.run.run_id,
  });

  const approval = automationRuntime.approvals.request({
    run_id: run.run.run_id,
    workflow_id: workflow.workflow.workflow_id,
    institution_id: institutionId,
    human_id: humanId,
    approval_type: "executive",
  });
  results.push({
    name: "approval_gate",
    passed: approval.autonomous_approval === false,
    detail: approval.approval.approval_id,
  });

  const granted = automationRuntime.approvals.grant(approval.approval.approval_id, institutionId, humanId);
  results.push({ name: "approval_granted", passed: granted.approval.status === "granted", detail: "recorded" });

  const permission = automationRuntime.permissions.grant({
    run_id: run.run.run_id,
    institution_id: institutionId,
    scope: ["workflow.execute", "documents.read"],
  });
  results.push({
    name: "automation_permissions",
    passed: permission.inherits_human_authority === false && permission.revocable === true,
    detail: permission.permission.permission_id,
  });

  const playbook = automationRuntime.playbooks.create({
    institution_id: institutionId,
    name: "Incident Response",
    category: "operations",
    description: "Governed incident response playbook with escalation checkpoints",
    workflow_id: workflow.workflow.workflow_id,
  });
  results.push({ name: "operational_playbooks", passed: playbook.reusable === true, detail: playbook.playbook.playbook_id });

  const durable = automationRuntime.longRunning.markDurable(run.run.run_id, institutionId);
  results.push({ name: "long_running_workflow", passed: durable.survives_restart === true, detail: "durable" });

  const recovery = automationRuntime.recovery.handle({
    run_id: run.run.run_id,
    institution_id: institutionId,
    error: "Integration timeout",
    action: "recover",
  });
  results.push({
    name: "exception_recovery",
    passed: recovery.concealed === false && recovery.continue_blindly === false,
    detail: recovery.event,
  });

  const schedule = automationRuntime.scheduler.schedule({
    workflow_id: workflow.workflow.workflow_id,
    institution_id: institutionId,
    trigger_type: "recurring",
    authorized: true,
  });
  results.push({ name: "automation_scheduler", passed: schedule.authorized === true, detail: schedule.schedule.schedule_id });

  let scheduleBlocked = false;
  try {
    automationRuntime.scheduler.schedule({
      workflow_id: workflow.workflow.workflow_id,
      institution_id: institutionId,
      trigger_type: "time",
      authorized: false,
    });
  } catch {
    scheduleBlocked = true;
  }
  results.push({ name: "schedule_requires_auth", passed: scheduleBlocked, detail: "auth required" });

  const integration = automationRuntime.integrations.connect({
    institution_id: institutionId,
    system: "email",
    approved_by_human: true,
  });
  results.push({ name: "cross_system_integration", passed: integration.permission_aware === true, detail: integration.integration.system });

  const paused = automationRuntime.engine.pause(run.run.run_id, institutionId, humanId);
  results.push({
    name: "human_intervention_pause",
    passed: paused.uncontrollable === false && paused.run.status === "paused",
    detail: paused.intervention.intervention_id,
  });

  const resumed = automationRuntime.engine.resume(run.run.run_id, institutionId, humanId);
  results.push({ name: "human_intervention_resume", passed: resumed.run.status === "running", detail: "resumed" });

  const analytics = automationRuntime.analytics.measure({
    institution_id: institutionId,
    workflow_id: workflow.workflow.workflow_id,
  });
  results.push({
    name: "automation_analytics",
    passed: analytics.evaluates_people === false,
    detail: `${analytics.analytics.completion_rate}`,
  });

  const governance = automationRuntime.governance.track({
    workflow_id: workflow.workflow.workflow_id,
    institution_id: institutionId,
    owner: humanId,
    version: 2,
  });
  results.push({ name: "operational_governance", passed: governance.policy_compliant === true, detail: governance.governance.governance_id });

  const security = automationRuntime.automation.security.check("spend_without_approval");
  results.push({ name: "automation_security", passed: security.allowed === false, detail: "spend blocked" });

  const trace = explainAutomationAction({
    human_id: humanId,
    action_type: "workflow_start",
    workflow_id: workflow.workflow.workflow_id,
    run_id: run.run.run_id,
  });
  results.push({ name: "automation_traceability", passed: trace.includes("interruptible"), detail: "explainable" });

  results.push({ name: "no_canonical_mutation", passed: dashboard.mutates_canonical === false, detail: "governed only" });

  return results;
}

export function allLixW12TestsPassed(): boolean {
  return runLixW12CertificationTests().every((t) => t.passed);
}
