import { loadAssignments, loadPermissions, loadRolePermissions, loadRoles } from "./data";
import type { Permission, RoleSimulation } from "./types";

export function permissionsForRoles(roleIds: string[]): string[] {
  const mapping = loadRolePermissions();
  const keys = new Set<string>();
  for (const roleId of roleIds) {
    const rp = mapping.find((m) => m.role_id === roleId);
    rp?.permission_keys.forEach((k) => keys.add(k));
  }
  return [...keys];
}

export function getPermission(key: string): Permission | undefined {
  return loadPermissions().find((p) => p.key === key);
}

export function simulateRole(roleId: string): RoleSimulation | null {
  const role = loadRoles().find((r) => r.id === roleId);
  if (!role) return null;
  const mapping = loadRolePermissions().find((m) => m.role_id === roleId);
  const allowed = mapping?.permission_keys ?? [];
  const all = loadPermissions().map((p) => p.key);
  const denied = all.filter((k) => !allowed.includes(k));
  const allowedPerms = allowed.map((k) => getPermission(k)).filter(Boolean) as Permission[];

  return {
    role_id: roleId,
    role_name: role.display_name,
    allowed_permissions: allowed,
    denied_permissions: denied.slice(0, 20),
    visible_routes: routeHintsForPermissions(allowed),
    requires_mfa_actions: allowedPerms.filter((p) => p.requires_mfa).map((p) => p.key),
    requires_approval_actions: allowedPerms.filter((p) => p.requires_approval).map((p) => p.key),
  };
}

function routeHintsForPermissions(permissions: string[]): string[] {
  const routes: string[] = [];
  if (permissions.some((p) => p.startsWith("users."))) routes.push("/admin/users");
  if (permissions.some((p) => p.startsWith("organizations."))) routes.push("/admin/organizations");
  if (permissions.some((p) => p.startsWith("workspaces."))) routes.push("/admin/workspaces");
  if (permissions.some((p) => p.startsWith("roles."))) routes.push("/admin/roles");
  if (permissions.some((p) => p.startsWith("audit."))) routes.push("/admin/audit");
  if (permissions.some((p) => p.startsWith("feature_flags."))) routes.push("/admin/feature-flags");
  if (permissions.some((p) => p.startsWith("integrations."))) routes.push("/admin/integrations");
  if (permissions.some((p) => p.startsWith("incidents."))) routes.push("/admin/incidents");
  return routes;
}

export function activeAssignmentsForUser(userId: string) {
  const now = Date.now();
  return loadAssignments().filter((a) => {
    if (a.user_id !== userId || a.status !== "active") return false;
    if (a.expires_at && new Date(a.expires_at).getTime() < now) return false;
    return true;
  });
}
