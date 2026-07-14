/**
 * CAE-11.7-W15 — Kernel tests
 */
import { kernelRuntime } from "./services/kernel-service";
import { seedKernelIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import {
  getKernelConstitution,
  KERNEL_RUNTIME_PATH,
  LIX_KERNEL_PRINCIPLE,
  REQUIRED_KERNEL_SERVICES,
} from "./constitution";
import { checkLixW15Invariants } from "./invariants";
import { explainKernelAction } from "./traceability";
import { KERNEL_EVENT_CATALOG } from "./events/catalog";

export type LixW15TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW15CertificationTests(): LixW15TestResult[] {
  seedKernelIfEmpty();
  const results: LixW15TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getKernelConstitution();
  results.push({ name: "kernel_principle", passed: constitution.governing_principle === LIX_KERNEL_PRINCIPLE });
  results.push({
    name: "runtime_path",
    passed: KERNEL_RUNTIME_PATH.length === 8,
    detail: `${KERNEL_RUNTIME_PATH.length} steps`,
  });
  results.push({
    name: "required_kernel_services",
    passed: REQUIRED_KERNEL_SERVICES.length === 12,
    detail: `${REQUIRED_KERNEL_SERVICES.length} services`,
  });
  results.push({ name: "w15_invariants", passed: checkLixW15Invariants().every((i) => i.passed) });
  results.push({
    name: "kernel_event_catalog",
    passed: KERNEL_EVENT_CATALOG.length >= 8,
    detail: `${KERNEL_EVENT_CATALOG.length} events`,
  });

  const dashboard = kernelRuntime.kernel.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "kernel_dashboard",
    passed: dashboard.single_source_of_truth === true && dashboard.subsystem_bypass_allowed === false,
    detail: dashboard.central_question,
  });

  const started = kernelRuntime.os.start({ institution_id: institutionId, human_id: humanId });
  results.push({
    name: "kernel_service",
    passed: started.single_source_of_truth === true && started.subsystem_bypass_allowed === false,
    detail: started.kernel.kernel_id,
  });

  const identity = kernelRuntime.identity.register({
    institution_id: institutionId,
    entity_id: "agent-research-001",
    entity_type: "ai_agent",
    role: "advisor",
    authority: ["research.read"],
  });
  results.push({
    name: "universal_identity",
    passed: identity.universal === true,
    detail: identity.identity.identity_id,
  });

  const granted = kernelRuntime.permission.check({
    institution_id: institutionId,
    identity_id: identity.identity.identity_id,
    permission: "research.read",
  });
  results.push({
    name: "permission_granted",
    passed: granted.granted === true && granted.centralized === true,
    detail: granted.check.check_id,
  });

  const denied = kernelRuntime.permission.check({
    institution_id: institutionId,
    identity_id: identity.identity.identity_id,
    permission: "kernel.admin",
  });
  results.push({
    name: "permission_denied",
    passed: denied.granted === false && denied.event === "permission.denied",
    detail: "denied",
  });

  const policy = kernelRuntime.policy.register({
    institution_id: institutionId,
    name: "Automation Safety Policy",
    domain: "automation",
  });
  results.push({
    name: "policy_engine",
    passed: policy.executable === true,
    detail: policy.policy.policy_id,
  });

  const evaluation = kernelRuntime.policy.evaluate({
    institution_id: institutionId,
    policy_id: policy.policy.policy_id,
    action: "workflow.start",
  });
  results.push({
    name: "policy_evaluate",
    passed: evaluation.applied === true && evaluation.compliant === true,
    detail: evaluation.evaluation.evaluation_id,
  });

  const enforcement = kernelRuntime.constitution.enforce({
    institution_id: institutionId,
    action: "bypass_permission",
    identity_id: identity.identity.identity_id,
  });
  results.push({
    name: "constitutional_enforcement",
    passed: enforcement.allowed === false && enforcement.stopped === true,
    detail: enforcement.violation ?? "stopped",
  });

  const execution = kernelRuntime.runtime.execute({
    institution_id: institutionId,
    human_id: humanId,
    action: "mission.coordinate",
    source_subsystem: "organizer",
    permission: "runtime.execute",
  });
  results.push({
    name: "universal_runtime",
    passed: execution.allowed === true && execution.path_complete === true && execution.bypass_kernel === false,
    detail: execution.execution.execution_id,
  });

  const bypass = kernelRuntime.runtime.execute({
    institution_id: institutionId,
    human_id: humanId,
    action: "bypass_permission_admin",
    source_subsystem: "agents",
    permission: "*",
  });
  results.push({
    name: "no_subsystem_bypass",
    passed: bypass.allowed === false && bypass.stopped === true,
    detail: "bypass stopped",
  });

  const memory = kernelRuntime.memory.integrate({
    institution_id: institutionId,
    layer: "simulation",
  });
  results.push({
    name: "universal_memory",
    passed: memory.constitutional_model === true,
    detail: memory.memory.memory_id,
  });

  const state = kernelRuntime.state.record({
    institution_id: institutionId,
    state_type: "current",
    snapshot: "Institution operating normally",
  });
  results.push({
    name: "universal_state",
    passed: state.observable === true && state.event === "state.changed",
    detail: state.state.state_id,
  });

  const event = kernelRuntime.events.emit({
    institution_id: institutionId,
    event: "mission.started",
    domain: "operations",
    source: "organizer",
  });
  results.push({
    name: "universal_event_bus",
    passed: event.governed_contract === true && event.hidden_channel === false,
    detail: event.event.event_id,
  });

  let hiddenBlocked = false;
  try {
    kernelRuntime.events.emit({
      institution_id: institutionId,
      event: "secret.signal",
      domain: "agents",
      source: "hidden_channel",
    });
  } catch {
    hiddenBlocked = true;
  }
  results.push({ name: "no_hidden_channels", passed: hiddenBlocked, detail: "hidden blocked" });

  const mesh = kernelRuntime.mesh.connect({
    institution_id: institutionId,
    from_service: "factory",
    to_service: "twin",
  });
  results.push({
    name: "service_mesh",
    passed: mesh.mesh.governed_contract === true && mesh.mesh.hidden_channel === false,
    detail: mesh.mesh.mesh_id,
  });

  const audit = kernelRuntime.audit.record({
    institution_id: institutionId,
    human_id: humanId,
    action: "policy.review",
    authority: "executive",
  });
  results.push({
    name: "universal_audit",
    passed: audit.suppressible === false && audit.universal === true,
    detail: audit.audit.audit_id,
  });

  const health = kernelRuntime.health.measure({ institution_id: institutionId });
  results.push({
    name: "runtime_health",
    passed: health.self_observing === true && health.health.kernel_health > 0,
    detail: `${health.health.kernel_health}`,
  });

  const amendment = kernelRuntime.evolution.propose({
    institution_id: institutionId,
    proposer: humanId,
    proposal: "Add federation quorum requirement for constitutional amendments",
  });
  results.push({
    name: "constitution_propose",
    passed: amendment.ai_cannot_redefine === true,
    detail: amendment.amendment.amendment_id,
  });

  let simRequired = false;
  try {
    kernelRuntime.evolution.approve({
      amendment_id: amendment.amendment.amendment_id,
      institution_id: institutionId,
      human_id: humanId,
      simulated: false,
    });
  } catch {
    simRequired = true;
  }
  results.push({ name: "amendment_requires_simulation", passed: simRequired, detail: "sim required" });

  const approved = kernelRuntime.evolution.approve({
    amendment_id: amendment.amendment.amendment_id,
    institution_id: institutionId,
    human_id: humanId,
    simulated: true,
  });
  results.push({
    name: "constitution_evolution",
    passed: approved.human_authority === true && approved.ai_cannot_redefine === true,
    detail: approved.amendment.amendment_id,
  });

  const security = kernelRuntime.kernel.security.check("suppress_audit");
  results.push({ name: "kernel_security", passed: security.allowed === false, detail: "audit protected" });

  const trace = explainKernelAction({
    human_id: humanId,
    action_type: "runtime_execute",
    execution_id: execution.execution.execution_id,
    institution_id: institutionId,
  });
  results.push({
    name: "kernel_traceability",
    passed: trace.includes("identity") && trace.includes("permission"),
    detail: "explainable",
  });

  results.push({
    name: "no_canonical_mutation",
    passed: dashboard.mutates_canonical_outside_contracts === false,
    detail: "governed only",
  });

  return results;
}

export function allLixW15TestsPassed(): boolean {
  return runLixW15CertificationTests().every((t) => t.passed);
}
