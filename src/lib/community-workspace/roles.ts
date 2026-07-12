import registry from "../../../data/registry/county-institution-workspace.json";
import type { FunctionalRoleId } from "./types";

export const CIWS_RELEASE = registry.releaseVersion;

export const FUNCTIONAL_ROLES: Array<{
  id: FunctionalRoleId;
  countyLabel: string;
  institutionLabel: string;
  organizingSpine?: boolean;
}> = registry.functionalRoles as Array<{
  id: FunctionalRoleId;
  countyLabel: string;
  institutionLabel: string;
  organizingSpine?: boolean;
}>;

export const FUNCTIONAL_LANES = registry.functionalLanes as Array<{
  id: string;
  label: string;
  leadRole: FunctionalRoleId;
}>;

export function roleLabel(roleId: FunctionalRoleId, kind: "county" | "institution"): string {
  const role = FUNCTIONAL_ROLES.find((r) => r.id === roleId);
  if (!role) return roleId;
  return kind === "county" ? role.countyLabel : role.institutionLabel;
}

export function toCommunityId(kind: string, slug: string): string {
  switch (kind) {
    case "county":
      return `county:${slug}`;
    case "institution":
      return `school:${slug}`;
    case "high_school":
      return `high_school:${slug}`;
    case "private_charter":
      return `private_charter:${slug}`;
    default:
      return `${kind}:${slug}`;
  }
}

export const ROLE_STATUS_LABELS: Record<string, string> = {
  open: "Open role",
  interim: "Interim",
  active: "Active",
};

export const ROLE_STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  interim: "bg-sky-100 text-sky-800",
  active: "bg-green-100 text-green-800",
};
