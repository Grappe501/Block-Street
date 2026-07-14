/**
 * CAE-11.7-W15 — Kernel Constitution (LIX-015)
 */
export const LIX_KERNEL_PRINCIPLE =
  "One Institution. One Constitutional Runtime. One Source of Truth.";

export const KERNEL_RUNTIME_PATH = [
  "identity",
  "context",
  "permissions",
  "policy",
  "memory",
  "execution",
  "audit",
  "institutional_learning",
] as const;

export const KERNEL_MAY = [
  "evaluate_every_request",
  "enforce_universal_permissions",
  "apply_executable_policies",
  "route_governed_events",
  "manage_universal_state",
  "integrate_memory_layers",
  "mesh_services_via_contracts",
  "record_universal_audit",
  "observe_runtime_health",
  "evolve_constitution_with_governance",
] as const;

export const KERNEL_MAY_NOT = [
  "allow_subsystem_permission_bypass",
  "permit_direct_database_mutation",
  "execute_without_constitutional_evaluation",
  "allow_hidden_inter_service_communication",
  "permit_audit_suppression",
  "allow_ungoverned_policy_exceptions",
  "circumvent_institutional_ownership",
  "allow_ai_to_redefine_constitutional_rules",
  "remove_backward_compatibility_without_migration",
  "replace_human_constitutional_authority",
] as const;

export const REQUIRED_KERNEL_SERVICES = [
  "KernelService",
  "UniversalRuntimeService",
  "ConstitutionService",
  "PolicyEngine",
  "PermissionEngine",
  "IdentityRuntime",
  "MemoryRuntime",
  "StateEngine",
  "EventBusService",
  "AuditRuntime",
  "HealthRuntime",
  "ConstitutionEvolutionService",
] as const;

export function getKernelConstitution() {
  return {
    protocol_id: "CAE-11.7-W15",
    governing_principle: LIX_KERNEL_PRINCIPLE,
    runtime_path: KERNEL_RUNTIME_PATH,
    may: KERNEL_MAY,
    may_not: KERNEL_MAY_NOT,
    required_services: REQUIRED_KERNEL_SERVICES,
    single_source_of_truth: true,
    subsystem_bypass_allowed: false,
  };
}
