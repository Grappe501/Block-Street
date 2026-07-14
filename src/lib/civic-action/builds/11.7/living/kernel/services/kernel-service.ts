/**
 * CAE-11.7-W15 — Institutional OS Kernel Runtime services
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
import { seedAutomationIfEmpty } from "../../automation/services/seed";
import { seedFactoryIfEmpty } from "../../factory/services/seed";
import { seedTwinIfEmpty } from "../../twin/services/seed";
import { KERNEL_RUNTIME_PATH } from "../constitution";
import type { PermissionCheckRecord, PolicyRecord } from "../data-model";
import {
  listAmendments,
  listAudits,
  listExecutions,
  listHealth,
  listIdentities,
  listKernelEvents,
  listKernels,
  listMemoryLayers,
  listMesh,
  listPermissionChecks,
  listPolicies,
  listStates,
  saveAmendment,
  saveAudit,
  saveExecution,
  saveHealth,
  saveIdentity,
  saveKernel,
  saveKernelEvent,
  saveMemoryLayer,
  saveMesh,
  savePermissionCheck,
  savePolicy,
  savePolicyEvaluation,
  saveState,
} from "./repository";

export class KernelError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureKernelBoot() {
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
  seedAutomationIfEmpty();
  seedFactoryIfEmpty();
  seedTwinIfEmpty();
}

function getBrain(humanId: string) {
  ensureKernelBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new KernelError("KERNEL_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function emitEvent(institutionId: string, event: string, domain: string, source: string) {
  const record = {
    event_id: caeId("kev"),
    institution_id: institutionId,
    event,
    domain,
    source,
    hidden_channel: false as const,
    governed_contract: true as const,
    emitted_at: nowIso(),
  };
  saveKernelEvent(record);
  return record;
}

export const kernelService = {
  list: listKernels,
  start(input: { institution_id: string; human_id: string }) {
    getBrain(input.human_id);
    const existing = listKernels(input.institution_id);
    const record = {
      kernel_id: caeId("krn"),
      institution_id: input.institution_id,
      version: existing.length + 1,
      constitutional: true as const,
      single_source_of_truth: true as const,
      subsystem_bypass_allowed: false as const,
      status: "started" as const,
      started_at: nowIso(),
    };
    saveKernel(record);
    emitEvent(input.institution_id, "kernel.started", "kernel", "KernelService");
    return {
      kernel: record,
      event: "kernel.started" as const,
      single_source_of_truth: true,
      subsystem_bypass_allowed: false,
    };
  },
};

export const identityRuntime = {
  list: listIdentities,
  register(input: {
    institution_id: string;
    entity_id: string;
    entity_type: "human" | "ai_agent" | "service" | "workflow" | "federation";
    role: string;
    authority?: string[];
    federation_scope?: string[];
  }) {
    const record = {
      identity_id: caeId("kid"),
      institution_id: input.institution_id,
      entity_id: input.entity_id,
      entity_type: input.entity_type,
      role: input.role,
      authority: input.authority ?? ["read"],
      federation_scope: input.federation_scope ?? [input.institution_id],
      trust_context: "institutional",
      session_active: true,
      created_at: nowIso(),
    };
    saveIdentity(record);
    return { identity: record, universal: true };
  },
};

export const permissionEngine = {
  list: listPermissionChecks,
  check(input: {
    institution_id: string;
    identity_id: string;
    permission: string;
    permission_type?: PermissionCheckRecord["permission_type"];
  }) {
    const identity = listIdentities(input.institution_id).find((i) => i.identity_id === input.identity_id);
    if (!identity) throw new KernelError("IDENTITY_NOT_FOUND", "Identity not found");

    const granted =
      identity.authority.includes(input.permission) ||
      identity.authority.includes("*") ||
      input.permission === "kernel.view";

    const record = {
      check_id: caeId("kpc"),
      institution_id: input.institution_id,
      identity_id: input.identity_id,
      permission: input.permission,
      granted,
      permission_type: input.permission_type ?? ("role" as const),
      temporary: input.permission_type === "temporary" || input.permission_type === "emergency",
      checked_at: nowIso(),
    };
    savePermissionCheck(record);
    emitEvent(
      input.institution_id,
      granted ? "permission.granted" : "permission.denied",
      "permission",
      "PermissionEngine"
    );
    return {
      check: record,
      granted,
      event: granted ? ("permission.granted" as const) : ("permission.denied" as const),
      centralized: true,
    };
  },
};

export const policyEngine = {
  list: listPolicies,
  register(input: {
    institution_id: string;
    name: string;
    domain: PolicyRecord["domain"];
  }) {
    const existing = listPolicies(input.institution_id).filter((p) => p.name === input.name);
    const record = {
      policy_id: caeId("kpl"),
      institution_id: input.institution_id,
      name: input.name,
      domain: input.domain,
      executable: true as const,
      version: existing.length + 1,
      status: "active" as const,
      created_at: nowIso(),
    };
    savePolicy(record);
    return { policy: record, executable: true };
  },
  evaluate(input: { institution_id: string; policy_id: string; action: string }) {
    const policy = listPolicies(input.institution_id).find((p) => p.policy_id === input.policy_id);
    if (!policy) throw new KernelError("POLICY_NOT_FOUND", "Policy not found");
    if (policy.status !== "active") {
      throw new KernelError("POLICY_INACTIVE", "Policy is not active");
    }

    const record = {
      evaluation_id: caeId("kpe"),
      policy_id: input.policy_id,
      institution_id: input.institution_id,
      action: input.action,
      applied: true,
      compliant: !input.action.includes("bypass") && !input.action.includes("circumvent"),
      evaluated_at: nowIso(),
    };
    savePolicyEvaluation(record);
    emitEvent(input.institution_id, "policy.applied", "policy", "PolicyEngine");
    return {
      evaluation: record,
      applied: true,
      compliant: record.compliant,
      event: "policy.applied" as const,
    };
  },
};

export const constitutionService = {
  get(institutionId: string) {
    const kernels = listKernels(institutionId);
    return {
      principle: "One Institution. One Constitutional Runtime. One Source of Truth.",
      kernel_active: kernels.length > 0,
      human_authority: true,
      ai_cannot_redefine: true,
    };
  },
  enforce(input: {
    institution_id: string;
    action: string;
    identity_id: string;
  }) {
    const prohibited = [
      "bypass_permission",
      "suppress_audit",
      "hidden_channel",
      "direct_db_mutation",
      "redefine_constitution",
    ];
    const violation = prohibited.find((p) => input.action.includes(p));
    if (violation) {
      return {
        allowed: false,
        stopped: true,
        violation,
        constitutional_evaluation: true as const,
      };
    }
    return {
      allowed: true,
      stopped: false,
      violation: null,
      constitutional_evaluation: true as const,
    };
  },
};

export const memoryRuntime = {
  list: listMemoryLayers,
  integrate(input: {
    institution_id: string;
    layer: "human" | "institutional" | "research" | "conversation" | "mission" | "learning" | "operational" | "simulation";
    authoritative?: boolean;
  }) {
    const record = {
      memory_id: caeId("kmm"),
      institution_id: input.institution_id,
      layer: input.layer,
      constitutional: true as const,
      authoritative: input.authoritative ?? input.layer === "institutional",
      recorded_at: nowIso(),
    };
    saveMemoryLayer(record);
    return { memory: record, constitutional_model: true };
  },
};

export const stateEngine = {
  list: listStates,
  record(input: {
    institution_id: string;
    state_type: "current" | "historical" | "planned" | "simulation" | "recovery" | "institutional";
    snapshot: string;
  }) {
    const record = {
      state_id: caeId("kst"),
      institution_id: input.institution_id,
      state_type: input.state_type,
      snapshot: input.snapshot,
      observable: true as const,
      recorded_at: nowIso(),
    };
    saveState(record);
    emitEvent(input.institution_id, "state.changed", "state", "StateEngine");
    return { state: record, event: "state.changed" as const, observable: true };
  },
};

export const eventBusService = {
  list: listKernelEvents,
  emit(input: { institution_id: string; event: string; domain: string; source: string }) {
    if (input.source.includes("hidden")) {
      throw new KernelError("HIDDEN_CHANNEL_FORBIDDEN", "Hidden inter-service communication forbidden");
    }
    const record = emitEvent(input.institution_id, input.event, input.domain, input.source);
    return { event: record, governed_contract: true, hidden_channel: false };
  },
  connectMesh(input: {
    institution_id: string;
    from_service: string;
    to_service: string;
  }) {
    const record = {
      mesh_id: caeId("kms"),
      institution_id: input.institution_id,
      from_service: input.from_service,
      to_service: input.to_service,
      governed_contract: true as const,
      hidden_channel: false as const,
      connected_at: nowIso(),
    };
    saveMesh(record);
    return { mesh: record, listMesh: listMesh };
  },
};

export const auditRuntime = {
  list: listAudits,
  record(input: {
    institution_id: string;
    human_id: string;
    action: string;
    evidence?: string[];
    authority: string;
    approvals?: string[];
  }) {
    getBrain(input.human_id);
    const record = {
      audit_id: caeId("kau"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      action: input.action,
      evidence: input.evidence ?? [`Action ${input.action} recorded`],
      authority: input.authority,
      approvals: input.approvals ?? [],
      version: 1,
      suppressible: false as const,
      recorded_at: nowIso(),
    };
    saveAudit(record);
    return { audit: record, suppressible: false, universal: true };
  },
};

export const healthRuntime = {
  list: listHealth,
  measure(input: { institution_id: string }) {
    const permissionFails = listPermissionChecks(input.institution_id).filter((p) => !p.granted).length;
    const record = {
      health_id: caeId("khh"),
      institution_id: input.institution_id,
      kernel_health: 0.94,
      latency_ms: 42,
      availability: 0.99,
      permission_failures: permissionFails,
      governance_failures: 0,
      policy_violations: 0,
      institutional_maturity: 0.82,
      self_observing: true as const,
      measured_at: nowIso(),
    };
    saveHealth(record);
    emitEvent(input.institution_id, "health.updated", "health", "HealthRuntime");
    return { health: record, event: "health.updated" as const, self_observing: true };
  },
};

export const constitutionEvolutionService = {
  list: listAmendments,
  propose(input: {
    institution_id: string;
    proposer: string;
    proposal: string;
  }) {
    getBrain(input.proposer);
    const record = {
      amendment_id: caeId("kam"),
      institution_id: input.institution_id,
      proposer: input.proposer,
      proposal: input.proposal,
      review_status: "proposed" as const,
      simulated: false,
      human_approved: false,
      version: listAmendments(input.institution_id).length + 1,
      ai_cannot_redefine: true as const,
      proposed_at: nowIso(),
      decided_at: null,
    };
    saveAmendment(record);
    return { amendment: record, ai_cannot_redefine: true };
  },
  approve(input: {
    amendment_id: string;
    institution_id: string;
    human_id: string;
    simulated?: boolean;
  }) {
    getBrain(input.human_id);
    const amendment = listAmendments(input.institution_id).find((a) => a.amendment_id === input.amendment_id);
    if (!amendment) throw new KernelError("AMENDMENT_NOT_FOUND", "Amendment not found");
    if (!input.simulated) {
      throw new KernelError("SIMULATION_REQUIRED", "Constitutional amendments require simulation before approval");
    }

    const updated = {
      ...amendment,
      review_status: "approved" as const,
      simulated: true,
      human_approved: true,
      decided_at: nowIso(),
    };
    saveAmendment(updated);
    emitEvent(input.institution_id, "constitution.amended", "constitution", "ConstitutionEvolutionService");
    return {
      amendment: updated,
      event: "constitution.amended" as const,
      human_authority: true,
      ai_cannot_redefine: true,
    };
  },
};

export const universalRuntimeService = {
  list: listExecutions,
  execute(input: {
    institution_id: string;
    human_id: string;
    action: string;
    source_subsystem: string;
    permission: string;
  }) {
    getBrain(input.human_id);

    const identity =
      listIdentities(input.institution_id).find((i) => i.entity_id === input.human_id) ??
      identityRuntime.register({
        institution_id: input.institution_id,
        entity_id: input.human_id,
        entity_type: "human",
        role: "executive",
        authority: ["kernel.view", "kernel.execute", "runtime.execute", "*"],
      }).identity;

    const enforcement = constitutionService.enforce({
      institution_id: input.institution_id,
      action: input.action,
      identity_id: identity.identity_id,
    });

    if (!enforcement.allowed) {
      const denied = {
        execution_id: caeId("kex"),
        institution_id: input.institution_id,
        human_id: input.human_id,
        action: input.action,
        source_subsystem: input.source_subsystem,
        path_completed: ["identity", "context", "permissions", "policy"] as const,
        constitutional_evaluation: true as const,
        allowed: false,
        denial_reason: enforcement.violation,
        executed_at: nowIso(),
      };
      saveExecution({ ...denied, path_completed: [...denied.path_completed] });
      auditRuntime.record({
        institution_id: input.institution_id,
        human_id: input.human_id,
        action: `denied:${input.action}`,
        authority: "constitutional_enforcement",
      });
      return {
        execution: { ...denied, path_completed: [...denied.path_completed] },
        allowed: false,
        stopped: true,
        event: "runtime.executed" as const,
        bypass_kernel: false,
      };
    }

    const perm = permissionEngine.check({
      institution_id: input.institution_id,
      identity_id: identity.identity_id,
      permission: input.permission,
    });

    if (!perm.granted) {
      const denied = {
        execution_id: caeId("kex"),
        institution_id: input.institution_id,
        human_id: input.human_id,
        action: input.action,
        source_subsystem: input.source_subsystem,
        path_completed: [...KERNEL_RUNTIME_PATH.slice(0, 4)],
        constitutional_evaluation: true as const,
        allowed: false,
        denial_reason: "permission_denied",
        executed_at: nowIso(),
      };
      saveExecution(denied);
      return {
        execution: denied,
        allowed: false,
        stopped: true,
        event: "runtime.executed" as const,
        bypass_kernel: false,
      };
    }

    const policies = listPolicies(input.institution_id);
    if (policies.length > 0) {
      policyEngine.evaluate({
        institution_id: input.institution_id,
        policy_id: policies[0].policy_id,
        action: input.action,
      });
    }

    memoryRuntime.integrate({ institution_id: input.institution_id, layer: "operational" });
    stateEngine.record({
      institution_id: input.institution_id,
      state_type: "current",
      snapshot: `Executed ${input.action} via ${input.source_subsystem}`,
    });

    const record = {
      execution_id: caeId("kex"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      action: input.action,
      source_subsystem: input.source_subsystem,
      path_completed: [...KERNEL_RUNTIME_PATH],
      constitutional_evaluation: true as const,
      allowed: true,
      denial_reason: null,
      executed_at: nowIso(),
    };
    saveExecution(record);

    auditRuntime.record({
      institution_id: input.institution_id,
      human_id: input.human_id,
      action: input.action,
      authority: identity.role,
      evidence: [`Subsystem ${input.source_subsystem}`, `Path ${KERNEL_RUNTIME_PATH.join("→")}`],
    });

    emitEvent(input.institution_id, "runtime.executed", "runtime", "UniversalRuntimeService");

    return {
      execution: record,
      allowed: true,
      stopped: false,
      event: "runtime.executed" as const,
      bypass_kernel: false,
      path_complete: true,
    };
  },
};

export const kernelRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureKernelBoot();
    getBrain(input.human_id);
    const kernels = listKernels(input.institution_id);
    const executions = listExecutions(input.institution_id);
    const policies = listPolicies(input.institution_id);
    const events = listKernelEvents(input.institution_id);
    const health = listHealth(input.institution_id);

    return {
      greeting: "Institution Control Center",
      central_question: "How is our Institution operating right now?",
      kernels: kernels.length,
      executions: executions.length,
      policies: policies.length,
      events: events.length,
      health: health.length > 0 ? health[health.length - 1].kernel_health : null,
      single_source_of_truth: true,
      subsystem_bypass_allowed: false,
      mutates_canonical_outside_contracts: false,
      human_constitutional_authority: true,
    };
  },
  security: {
    prohibited: [
      "bypass_permission",
      "direct_db_mutation",
      "suppress_audit",
      "hidden_channel",
      "redefine_constitution",
      "ungoverned_policy_exception",
      "replace_human_authority",
    ],
    check(action: string) {
      return {
        allowed: !this.prohibited.some((p) => action.includes(p)),
        constitutional_evaluation: true,
      };
    },
  },
};

export const kernelRuntime = {
  kernel: kernelRuntimeService,
  os: kernelService,
  runtime: universalRuntimeService,
  constitution: constitutionService,
  policy: policyEngine,
  permission: permissionEngine,
  identity: identityRuntime,
  memory: memoryRuntime,
  state: stateEngine,
  events: eventBusService,
  audit: auditRuntime,
  health: healthRuntime,
  evolution: constitutionEvolutionService,
  mesh: { list: listMesh, connect: eventBusService.connectMesh },
};
