import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  Institution,
  InstitutionDeploymentProfile,
  InstitutionModule,
  InstitutionOwnerAssignment,
  InstitutionProvisioningRequest,
  InstitutionSecurityProfile,
  InstitutionWorkspace,
  ProvisioningAuditEvent,
  ProvisioningCheckpoint,
  ProvisioningHealth,
  ProvisioningRiskAssessment,
  ProvisioningTemplate,
  ProvisioningValidation,
  InstitutionTypeRecord,
} from "./types";

export const PROV_DATA = join(process.cwd(), "data", "provisioning");

const cache = new Map<string, unknown>();

function readStore() {
  const ck = "store";
  if (cache.has(ck)) return cache.get(ck) as Record<string, unknown[]>;
  const raw = JSON.parse(readFileSync(join(PROV_DATA, "store.json"), "utf8"));
  cache.set(ck, raw);
  return raw as Record<string, unknown[]>;
}

function writeStore(store: Record<string, unknown[]>) {
  writeFileSync(join(PROV_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(PROV_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readObject<Record<string, boolean>>("feature_flags.json");
}

export function loadInstitutionTypes(): InstitutionTypeRecord[] {
  return readObject<{ types: InstitutionTypeRecord[] }>("institution_types.json").types;
}

export function loadTemplates(): ProvisioningTemplate[] {
  return readObject<{ templates: ProvisioningTemplate[] }>("provisioning_templates.json").templates;
}

export function loadSecurityBaselines() {
  return readObject<{ baselines: Array<Record<string, string>> }>("security_baselines.json").baselines;
}

export function loadHealth(): ProvisioningHealth {
  return readObject<ProvisioningHealth>("health.json");
}

export function persistHealth(health: ProvisioningHealth) {
  writeFileSync(join(PROV_DATA, "health.json"), JSON.stringify(health, null, 2));
  cache.delete("obj:health.json");
}

export function loadInstitutions(): Institution[] {
  return readStore().institutions as Institution[];
}

export function persistInstitutions(items: Institution[]) {
  const store = readStore();
  store.institutions = items;
  writeStore(store);
}

export function loadRequests(): InstitutionProvisioningRequest[] {
  return readStore().requests as InstitutionProvisioningRequest[];
}

export function persistRequests(items: InstitutionProvisioningRequest[]) {
  const store = readStore();
  store.requests = items;
  writeStore(store);
}

export function loadRiskAssessments(): ProvisioningRiskAssessment[] {
  return readStore().risk_assessments as ProvisioningRiskAssessment[];
}

export function persistRiskAssessments(items: ProvisioningRiskAssessment[]) {
  const store = readStore();
  store.risk_assessments = items;
  writeStore(store);
}

export function loadOwnerAssignments(): InstitutionOwnerAssignment[] {
  return readStore().owner_assignments as InstitutionOwnerAssignment[];
}

export function persistOwnerAssignments(items: InstitutionOwnerAssignment[]) {
  const store = readStore();
  store.owner_assignments = items;
  writeStore(store);
}

export function loadWorkspaces(): InstitutionWorkspace[] {
  return readStore().workspaces as InstitutionWorkspace[];
}

export function persistWorkspaces(items: InstitutionWorkspace[]) {
  const store = readStore();
  store.workspaces = items;
  writeStore(store);
}

export function loadModules(): InstitutionModule[] {
  return readStore().modules as InstitutionModule[];
}

export function persistModules(items: InstitutionModule[]) {
  const store = readStore();
  store.modules = items;
  writeStore(store);
}

export function loadSecurityProfiles(): InstitutionSecurityProfile[] {
  return readStore().security_profiles as InstitutionSecurityProfile[];
}

export function persistSecurityProfiles(items: InstitutionSecurityProfile[]) {
  const store = readStore();
  store.security_profiles = items;
  writeStore(store);
}

export function loadDeploymentProfiles(): InstitutionDeploymentProfile[] {
  return readStore().deployment_profiles as InstitutionDeploymentProfile[];
}

export function persistDeploymentProfiles(items: InstitutionDeploymentProfile[]) {
  const store = readStore();
  store.deployment_profiles = items;
  writeStore(store);
}

export function loadValidations(): ProvisioningValidation[] {
  return readStore().validations as ProvisioningValidation[];
}

export function persistValidations(items: ProvisioningValidation[]) {
  const store = readStore();
  store.validations = items;
  writeStore(store);
}

export function loadAuditEvents(): ProvisioningAuditEvent[] {
  return readStore().audit_events as ProvisioningAuditEvent[];
}

export function persistAuditEvents(items: ProvisioningAuditEvent[]) {
  const store = readStore();
  store.audit_events = items;
  writeStore(store);
}

export function loadCheckpoints(): ProvisioningCheckpoint[] {
  return readStore().checkpoints as ProvisioningCheckpoint[];
}

export function persistCheckpoints(items: ProvisioningCheckpoint[]) {
  const store = readStore();
  store.checkpoints = items;
  writeStore(store);
}

export function appendAudit(event: ProvisioningAuditEvent) {
  const events = loadAuditEvents();
  events.push(event);
  persistAuditEvents(events);
}
