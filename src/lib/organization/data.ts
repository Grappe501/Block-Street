import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ConfigurationDraft,
  LeadershipAssignment,
  LeadershipPosition,
  OrganizationConfigurationValidation,
  OrganizationConfigurationVersion,
  OrganizationalApprovalPath,
  OrganizationalAuditEvent,
  OrganizationalEscalationPath,
  OrganizationalJurisdiction,
  OrganizationalRoleAssignment,
  OrganizationalUnit,
  OrganizationalUnitMembership,
  OrganizationalUnitOwner,
  ReorganizationPlan,
  SharedServiceAssignment,
  UnitWorkspaceMapping,
  OrganizationHealth,
} from "./types";

export const ORG_DATA = join(process.cwd(), "data", "organization");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(ORG_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(ORG_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(ORG_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadUnitTypes() {
  return readJsonFile<{ types: Array<Record<string, unknown>> }>("unit_types.json").types;
}

export function loadConfigurationTemplates() {
  return readJsonFile<{ templates: Array<Record<string, unknown>> }>("configuration_templates.json").templates;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadUnits = () => getKey("units") as OrganizationalUnit[];
export const persistUnits = (items: OrganizationalUnit[]) => setKey("units", items);
export const loadUnitOwners = () => getKey("unit_owners") as OrganizationalUnitOwner[];
export const persistUnitOwners = (items: OrganizationalUnitOwner[]) => setKey("unit_owners", items);
export const loadLeadershipPositions = () => getKey("leadership_positions") as LeadershipPosition[];
export const persistLeadershipPositions = (items: LeadershipPosition[]) => setKey("leadership_positions", items);
export const loadLeadershipAssignments = () => getKey("leadership_assignments") as LeadershipAssignment[];
export const persistLeadershipAssignments = (items: LeadershipAssignment[]) => setKey("leadership_assignments", items);
export const loadMemberships = () => getKey("memberships") as OrganizationalUnitMembership[];
export const persistMemberships = (items: OrganizationalUnitMembership[]) => setKey("memberships", items);
export const loadRoleAssignments = () => getKey("role_assignments") as OrganizationalRoleAssignment[];
export const persistRoleAssignments = (items: OrganizationalRoleAssignment[]) => setKey("role_assignments", items);
export const loadWorkspaceMappings = () => getKey("workspace_mappings") as UnitWorkspaceMapping[];
export const persistWorkspaceMappings = (items: UnitWorkspaceMapping[]) => setKey("workspace_mappings", items);
export const loadJurisdictions = () => getKey("jurisdictions") as OrganizationalJurisdiction[];
export const persistJurisdictions = (items: OrganizationalJurisdiction[]) => setKey("jurisdictions", items);
export const loadSharedServices = () => getKey("shared_services") as SharedServiceAssignment[];
export const persistSharedServices = (items: SharedServiceAssignment[]) => setKey("shared_services", items);
export const loadApprovalPaths = () => getKey("approval_paths") as OrganizationalApprovalPath[];
export const persistApprovalPaths = (items: OrganizationalApprovalPath[]) => setKey("approval_paths", items);
export const loadEscalationPaths = () => getKey("escalation_paths") as OrganizationalEscalationPath[];
export const persistEscalationPaths = (items: OrganizationalEscalationPath[]) => setKey("escalation_paths", items);
export const loadConfigurationDrafts = () => getKey("configuration_drafts") as ConfigurationDraft[];
export const persistConfigurationDrafts = (items: ConfigurationDraft[]) => setKey("configuration_drafts", items);
export const loadConfigurationVersions = () => getKey("configuration_versions") as OrganizationConfigurationVersion[];
export const persistConfigurationVersions = (items: OrganizationConfigurationVersion[]) => setKey("configuration_versions", items);
export const loadReorganizations = () => getKey("reorganizations") as ReorganizationPlan[];
export const persistReorganizations = (items: ReorganizationPlan[]) => setKey("reorganizations", items);
export const loadValidations = () => getKey("validations") as OrganizationConfigurationValidation[];
export const persistValidations = (items: OrganizationConfigurationValidation[]) => setKey("validations", items);
export const loadAuditEvents = () => getKey("audit_events") as OrganizationalAuditEvent[];
export const persistAuditEvents = (items: OrganizationalAuditEvent[]) => setKey("audit_events", items);

export function appendAudit(event: OrganizationalAuditEvent) {
  const events = loadAuditEvents();
  events.push(event);
  persistAuditEvents(events);
}

export function loadHealth(): OrganizationHealth {
  const store = readStore();
  return (store.health as OrganizationHealth) ?? {
    active_units: 0,
    ownerless_units: 0,
    leadership_vacancies: 0,
    configuration_warnings: 0,
    pending_reorganizations: 0,
    structure_validation: "not_run",
    campuses: 0,
    chapters: 0,
    departments: 0,
  };
}

export function persistHealth(health: OrganizationHealth) {
  const store = readStore();
  store.health = health;
  writeStore(store);
}
