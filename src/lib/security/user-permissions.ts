import { activeAssignmentsForUser, permissionsForRoles } from "@/lib/admin/permissions";
import { editorialPermissionsForUser } from "@/lib/cms/permissions";
import type { Membership } from "@/lib/auth/types";

const MEMBER_READ = ["civic_action.view", "missions.read", "notifications.request"] as const;
const LEADER_EXTRA = ["missions.write", "users.read", "analytics.read"] as const;

const CIVIC_MANAGE_ADMIN_KEYS = new Set([
  "civic.manage",
  "operations.manage",
  "operations.launch",
  "civic_outcomes.manage",
  "community_health.manage",
  "leadership.manage",
]);

function isLeadershipRole(role: string): boolean {
  return /lead|admin|manager|commander|director|organizer|chair/i.test(role);
}

export function resolveUserApiPermissions(userId: string, memberships: Membership[]): string[] {
  const adminRoleIds = activeAssignmentsForUser(userId).map((a) => a.role_id);
  const adminPerms = permissionsForRoles(adminRoleIds);
  const editorial = editorialPermissionsForUser(userId);
  const scopes = new Set<string>([...adminPerms, ...editorial]);

  for (const membership of memberships) {
    for (const perm of membership.permissions ?? []) scopes.add(perm);
    for (const perm of MEMBER_READ) scopes.add(perm);
    if (membership.roles?.some(isLeadershipRole)) {
      for (const perm of LEADER_EXTRA) scopes.add(perm);
    }
  }

  if (adminPerms.includes("users.view")) scopes.add("users.read");
  if (adminPerms.some((p) => CIVIC_MANAGE_ADMIN_KEYS.has(p))) scopes.add("civic_action.manage");
  if (adminPerms.some((p) => p.startsWith("analytics.") || p.includes("intelligence"))) {
    scopes.add("analytics.read");
  }

  return [...scopes];
}
