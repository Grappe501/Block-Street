import { existsSync, readFileSync, appendFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { LeadershipAppointment, PermissionDefinition, ProtectedRoute } from "./types";

const AUTHORITY_DIR = join(process.cwd(), "data", "authority");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(AUTHORITY_DIR, file), "utf8")) as T;
}

export function loadPermissionRegistry(): PermissionDefinition[] {
  return readJson<{ permissions: PermissionDefinition[] }>("permission-registry.json").permissions;
}

export function loadRolePermissions(): Array<{ role_key: string; display_name: string; permissions: string[] }> {
  return readJson<{ role_permissions: Array<{ role_key: string; display_name: string; permissions: string[] }> }>(
    "role-permissions.json"
  ).role_permissions;
}

export function loadAppointments(): LeadershipAppointment[] {
  return readJson<{ appointments: LeadershipAppointment[] }>("appointments.json").appointments;
}

export function loadProtectedRoutes(): ProtectedRoute[] {
  return readJson<{ routes: ProtectedRoute[] }>("protected-routes.json").routes;
}

export function loadScopeVocabulary() {
  return readJson<{ scope_kinds: Array<{ kind: string; label: string; description: string }> }>("scope-vocabulary.json");
}

const DENIAL_LOG = join(AUTHORITY_DIR, "denial-audit.jsonl");

export function appendDenialAudit(event: Record<string, unknown>): void {
  try {
    mkdirSync(AUTHORITY_DIR, { recursive: true });
    appendFileSync(DENIAL_LOG, JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n");
  } catch {
    // Serverless read-only — denial logging must not break requests
  }
}

export function readDenialAudit(limit = 50): Record<string, unknown>[] {
  if (!existsSync(DENIAL_LOG)) return [];
  return readFileSync(DENIAL_LOG, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Record<string, unknown>)
    .slice(-limit)
    .reverse();
}
