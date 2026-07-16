import { activeAssignmentsForUser, permissionsForRoles } from "@/lib/admin/permissions";
import { editorialPermissionsForUser } from "@/lib/cms/permissions";
import { resolveEffectivePermissions } from "@/lib/authority/resolver";
import type { Membership } from "@/lib/auth/types";

/** Baseline for onboarded members without a leadership appointment yet. */
const MEMBER_BASELINE = ["civic_action.view", "missions.read", "notifications.request"] as const;

/**
 * Resolve API permissions from active leadership appointments (primary),
 * plus editorial roles, legacy admin assignments, and membership baseline.
 */
export function resolveUserApiPermissions(userId: string, memberships: Membership[]): string[] {
  const appointmentPerms = resolveEffectivePermissions(userId);
  const scopes = new Set<string>(appointmentPerms);

  const adminRoleIds = activeAssignmentsForUser(userId).map((a) => a.role_id);
  for (const p of permissionsForRoles(adminRoleIds)) scopes.add(p);

  for (const p of editorialPermissionsForUser(userId)) scopes.add(p);

  if (memberships.length > 0 && appointmentPerms.length === 0) {
    for (const perm of MEMBER_BASELINE) scopes.add(perm);
    for (const membership of memberships) {
      for (const perm of membership.permissions ?? []) scopes.add(perm);
    }
  }

  if (scopes.has("users.view")) scopes.add("users.view");

  return [...scopes];
}
