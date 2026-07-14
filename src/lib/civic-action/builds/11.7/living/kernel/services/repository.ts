/**
 * CAE-11.7-W15 — Kernel persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AuditRecord,
  ConstitutionAmendmentRecord,
  HealthRecord,
  IdentityRecord,
  KernelEventRecord,
  KernelRecord,
  MemoryLayerRecord,
  PermissionCheckRecord,
  PolicyEvaluationRecord,
  PolicyRecord,
  RuntimeExecutionRecord,
  ServiceMeshRecord,
  StateRecord,
} from "../data-model";
import { KERNEL_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listKernels(institutionId: string) {
  return listByInstitution<KernelRecord>(KERNEL_STORE_KEYS.kernels, institutionId);
}

export function saveKernel(record: KernelRecord) {
  upsertById(KERNEL_STORE_KEYS.kernels, record, "kernel_id");
}

export function listExecutions(institutionId: string) {
  return listByInstitution<RuntimeExecutionRecord>(KERNEL_STORE_KEYS.executions, institutionId);
}

export function saveExecution(record: RuntimeExecutionRecord) {
  upsertById(KERNEL_STORE_KEYS.executions, record, "execution_id");
}

export function listIdentities(institutionId: string) {
  return listByInstitution<IdentityRecord>(KERNEL_STORE_KEYS.identities, institutionId);
}

export function saveIdentity(record: IdentityRecord) {
  upsertById(KERNEL_STORE_KEYS.identities, record, "identity_id");
}

export function listPermissionChecks(institutionId: string) {
  return listByInstitution<PermissionCheckRecord>(KERNEL_STORE_KEYS.permissions, institutionId);
}

export function savePermissionCheck(record: PermissionCheckRecord) {
  upsertById(KERNEL_STORE_KEYS.permissions, record, "check_id");
}

export function listPolicies(institutionId: string) {
  return listByInstitution<PolicyRecord>(KERNEL_STORE_KEYS.policies, institutionId);
}

export function savePolicy(record: PolicyRecord) {
  upsertById(KERNEL_STORE_KEYS.policies, record, "policy_id");
}

export function listPolicyEvaluations(institutionId: string) {
  return listByInstitution<PolicyEvaluationRecord>(KERNEL_STORE_KEYS.policy_evaluations, institutionId);
}

export function savePolicyEvaluation(record: PolicyEvaluationRecord) {
  upsertById(KERNEL_STORE_KEYS.policy_evaluations, record, "evaluation_id");
}

export function listKernelEvents(institutionId: string) {
  return listByInstitution<KernelEventRecord>(KERNEL_STORE_KEYS.events, institutionId);
}

export function saveKernelEvent(record: KernelEventRecord) {
  upsertById(KERNEL_STORE_KEYS.events, record, "event_id");
}

export function listStates(institutionId: string) {
  return listByInstitution<StateRecord>(KERNEL_STORE_KEYS.states, institutionId);
}

export function saveState(record: StateRecord) {
  upsertById(KERNEL_STORE_KEYS.states, record, "state_id");
}

export function listMemoryLayers(institutionId: string) {
  return listByInstitution<MemoryLayerRecord>(KERNEL_STORE_KEYS.memories, institutionId);
}

export function saveMemoryLayer(record: MemoryLayerRecord) {
  upsertById(KERNEL_STORE_KEYS.memories, record, "memory_id");
}

export function listAudits(institutionId: string) {
  return listByInstitution<AuditRecord>(KERNEL_STORE_KEYS.audits, institutionId);
}

export function saveAudit(record: AuditRecord) {
  upsertById(KERNEL_STORE_KEYS.audits, record, "audit_id");
}

export function listHealth(institutionId: string) {
  return listByInstitution<HealthRecord>(KERNEL_STORE_KEYS.health, institutionId);
}

export function saveHealth(record: HealthRecord) {
  upsertById(KERNEL_STORE_KEYS.health, record, "health_id");
}

export function listAmendments(institutionId: string) {
  return listByInstitution<ConstitutionAmendmentRecord>(KERNEL_STORE_KEYS.amendments, institutionId);
}

export function saveAmendment(record: ConstitutionAmendmentRecord) {
  upsertById(KERNEL_STORE_KEYS.amendments, record, "amendment_id");
}

export function listMesh(institutionId: string) {
  return listByInstitution<ServiceMeshRecord>(KERNEL_STORE_KEYS.mesh, institutionId);
}

export function saveMesh(record: ServiceMeshRecord) {
  upsertById(KERNEL_STORE_KEYS.mesh, record, "mesh_id");
}
