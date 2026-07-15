import matrix from "../../../../data/calendar/calendar-rbac-matrix.json";
import type { CalendarRoleKey } from "./types";
import { normalizePermissionKey } from "./permissions";

export const CALENDAR_RBAC_MATRIX = matrix;

export function listCalendarRoles() {
  return matrix.roles;
}

export function getCalendarRbacRole(roleKey: string) {
  return matrix.roles.find((r) => r.role_key === roleKey) ?? null;
}

export function rolePermissionList(roleKey: string): string[] {
  const role = getCalendarRbacRole(roleKey);
  if (!role) return [];
  if (Array.isArray((role as { permission_list?: string[] }).permission_list)) {
    return (role as { permission_list: string[] }).permission_list;
  }
  const perms = role.permissions as Record<string, boolean>;
  return Object.entries(perms)
    .filter(([, v]) => v)
    .map(([k]) => k);
}

export function roleExplicitDenies(roleKey: string): string[] {
  const role = getCalendarRbacRole(roleKey);
  return ((role as { explicit_denies?: string[] } | null)?.explicit_denies ?? []).map(normalizePermissionKey);
}

export function roleGrantsPermission(roleKey: CalendarRoleKey | string, permission: string): boolean {
  const perm = normalizePermissionKey(permission);
  if (roleExplicitDenies(roleKey).includes(perm)) return false;
  const role = getCalendarRbacRole(roleKey);
  if (!role) return false;
  const perms = role.permissions as Record<string, boolean>;
  if (perm in perms) return Boolean(perms[perm]);
  // legacy key may map after normalize — check list
  return rolePermissionList(roleKey).map(normalizePermissionKey).includes(perm);
}

export function rolesGrantingPermission(roles: string[], permission: string): string[] {
  return roles.filter((r) => roleGrantsPermission(r, permission));
}
