import permissionRegistry from "../../../../data/calendar/calendar-permission-registry.json";
import matrix from "../../../../data/calendar/calendar-rbac-matrix.json";
import type { CalendarPermissionKey } from "./types";

export const CALENDAR_PERMISSION_REGISTRY = permissionRegistry;
export const CALENDAR_PERMISSION_ALIASES = (matrix as { aliases?: Record<string, string> }).aliases ?? {};

export function listCalendarPermissionKeys(): CalendarPermissionKey[] {
  return permissionRegistry.permissions.map((p) => p.key);
}

export function isKnownPermission(key: string): boolean {
  const canonical = normalizePermissionKey(key);
  return permissionRegistry.permissions.some((p) => p.key === canonical);
}

export function normalizePermissionKey(key: string): CalendarPermissionKey {
  return CALENDAR_PERMISSION_ALIASES[key] ?? key;
}

export function isSensitivePermission(key: string): boolean {
  const canonical = normalizePermissionKey(key);
  const row = permissionRegistry.permissions.find((p) => p.key === canonical);
  return Boolean(row?.sensitive);
}

export function getPermissionMeta(key: string) {
  const canonical = normalizePermissionKey(key);
  return permissionRegistry.permissions.find((p) => p.key === canonical) ?? null;
}
