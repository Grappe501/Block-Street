/**
 * CAE-11.7-W15 — Kernel data model
 */
import type { KERNEL_RUNTIME_PATH } from "./constitution";

export type RuntimePathStep = (typeof KERNEL_RUNTIME_PATH)[number];

export const KERNEL_STORE_KEYS = {
  kernels: "lix_kernel_kernels",
  executions: "lix_kernel_executions",
  identities: "lix_kernel_identities",
  permissions: "lix_kernel_permissions",
  policies: "lix_kernel_policies",
  policy_evaluations: "lix_kernel_policy_evaluations",
  events: "lix_kernel_events",
  states: "lix_kernel_states",
  memories: "lix_kernel_memories",
  audits: "lix_kernel_audits",
  health: "lix_kernel_health",
  amendments: "lix_kernel_amendments",
  mesh: "lix_kernel_mesh",
} as const;

export interface KernelRecord {
  kernel_id: string;
  institution_id: string;
  version: number;
  constitutional: true;
  single_source_of_truth: true;
  subsystem_bypass_allowed: false;
  status: "started" | "healthy" | "degraded" | "stopped";
  started_at: string;
}

export interface RuntimeExecutionRecord {
  execution_id: string;
  institution_id: string;
  human_id: string;
  action: string;
  source_subsystem: string;
  path_completed: RuntimePathStep[];
  constitutional_evaluation: true;
  allowed: boolean;
  denial_reason: string | null;
  executed_at: string;
}

export interface IdentityRecord {
  identity_id: string;
  institution_id: string;
  entity_id: string;
  entity_type: "human" | "ai_agent" | "service" | "workflow" | "federation";
  role: string;
  authority: string[];
  federation_scope: string[];
  trust_context: string;
  session_active: boolean;
  created_at: string;
}

export interface PermissionCheckRecord {
  check_id: string;
  institution_id: string;
  identity_id: string;
  permission: string;
  granted: boolean;
  permission_type: "role" | "context" | "mission" | "temporary" | "emergency" | "federated" | "automation";
  temporary: boolean;
  checked_at: string;
}

export interface PolicyRecord {
  policy_id: string;
  institution_id: string;
  name: string;
  domain: "automation" | "research" | "learning" | "communication" | "federation" | "deployment" | "simulation" | "ai_behavior" | "security" | "privacy";
  executable: true;
  version: number;
  status: "active" | "draft" | "retired";
  created_at: string;
}

export interface PolicyEvaluationRecord {
  evaluation_id: string;
  policy_id: string;
  institution_id: string;
  action: string;
  applied: boolean;
  compliant: boolean;
  evaluated_at: string;
}

export interface KernelEventRecord {
  event_id: string;
  institution_id: string;
  event: string;
  domain: string;
  source: string;
  hidden_channel: false;
  governed_contract: true;
  emitted_at: string;
}

export interface StateRecord {
  state_id: string;
  institution_id: string;
  state_type: "current" | "historical" | "planned" | "simulation" | "recovery" | "institutional";
  snapshot: string;
  observable: true;
  recorded_at: string;
}

export interface MemoryLayerRecord {
  memory_id: string;
  institution_id: string;
  layer: "human" | "institutional" | "research" | "conversation" | "mission" | "learning" | "operational" | "simulation";
  constitutional: true;
  authoritative: boolean;
  recorded_at: string;
}

export interface AuditRecord {
  audit_id: string;
  institution_id: string;
  human_id: string;
  action: string;
  evidence: string[];
  authority: string;
  approvals: string[];
  version: number;
  suppressible: false;
  recorded_at: string;
}

export interface HealthRecord {
  health_id: string;
  institution_id: string;
  kernel_health: number;
  latency_ms: number;
  availability: number;
  permission_failures: number;
  governance_failures: number;
  policy_violations: number;
  institutional_maturity: number;
  self_observing: true;
  measured_at: string;
}

export interface ConstitutionAmendmentRecord {
  amendment_id: string;
  institution_id: string;
  proposer: string;
  proposal: string;
  review_status: "proposed" | "reviewed" | "simulated" | "approved" | "rejected" | "rolled_back";
  simulated: boolean;
  human_approved: boolean;
  version: number;
  ai_cannot_redefine: true;
  proposed_at: string;
  decided_at: string | null;
}

export interface ServiceMeshRecord {
  mesh_id: string;
  institution_id: string;
  from_service: string;
  to_service: string;
  governed_contract: true;
  hidden_channel: false;
  connected_at: string;
}
