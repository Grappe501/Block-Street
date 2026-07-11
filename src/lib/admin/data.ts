import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  AccessPolicy,
  AdminFeatureFlags,
  AdminRole,
  AdministrativeApproval,
  AttentionItem,
  Permission,
  UserRoleAssignment,
} from "./types";

export const ADMIN_DATA = join(process.cwd(), "data", "admin");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(ADMIN_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(ADMIN_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.set(`${file}:${key}`, items);
}

export function loadRoles(): AdminRole[] {
  return readJson<AdminRole>("roles.json", "roles");
}

export function loadPermissions(): Permission[] {
  return readJson<Permission>("permissions.json", "permissions");
}

export function loadRolePermissions(): { role_id: string; permission_keys: string[] }[] {
  const raw = JSON.parse(readFileSync(join(ADMIN_DATA, "role_permissions.json"), "utf8"));
  return raw.role_permissions;
}

export function loadAssignments(): UserRoleAssignment[] {
  return readJson<UserRoleAssignment>("user_role_assignments.json", "assignments");
}

export function persistAssignments(assignments: UserRoleAssignment[]) {
  writeJson("user_role_assignments.json", "assignments", assignments);
}

export function loadPolicies(): AccessPolicy[] {
  return readJson<AccessPolicy>("policies.json", "policies");
}

export function loadApprovals(): AdministrativeApproval[] {
  return readJson<AdministrativeApproval>("approvals.json", "approvals");
}

export function persistApprovals(approvals: AdministrativeApproval[]) {
  writeJson("approvals.json", "approvals", approvals);
}

export function loadAdminFeatureFlags(): AdminFeatureFlags {
  const raw = JSON.parse(readFileSync(join(ADMIN_DATA, "feature_flags.json"), "utf8"));
  return raw.feature_flags as AdminFeatureFlags;
}

export function persistAdminFeatureFlags(flags: AdminFeatureFlags) {
  writeFileSync(join(ADMIN_DATA, "feature_flags.json"), JSON.stringify({ feature_flags: flags }, null, 2));
}

export function loadAttentionQueue(): AttentionItem[] {
  return readJson<AttentionItem>("attention_queue.json", "items");
}

export function loadIntegrations() {
  return readJson<Record<string, unknown>>("integrations.json", "integrations");
}

export function loadJobs() {
  return readJson<Record<string, unknown>>("jobs.json", "jobs");
}

export function loadIncidents() {
  return readJson<Record<string, unknown>>("incidents.json", "incidents");
}

export function loadConfigurations() {
  return readJson<Record<string, unknown>>("system_configuration.json", "configurations");
}

export function appendAdminAudit(event: Record<string, unknown>) {
  appendFileSync(
    join(ADMIN_DATA, "audit_events.jsonl"),
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
  );
}

export function readAdminAudit(limit = 50) {
  const path = join(ADMIN_DATA, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .slice(-limit)
    .reverse();
}
