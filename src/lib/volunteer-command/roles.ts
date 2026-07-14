import roleRegistry from "../../../data/volunteer-command/leadership-role-registry.json";
import accessMatrix from "../../../data/volunteer-command/access-matrix.json";
import dashboardConfig from "../../../data/volunteer-command/dashboard-config-registry.json";
import fieldPlanContract from "../../../data/volunteer-command/field-plan-position-contract.json";

export type LeadershipRoleKey = (typeof roleRegistry.roles)[number]["role_key"];

export function listLeadershipRoles() {
  return roleRegistry.roles;
}

export function getLeadershipRole(roleKey: string) {
  return roleRegistry.roles.find((r) => r.role_key === roleKey) ?? null;
}

export function listStatewideFunctions(): string[] {
  return [...roleRegistry.functions];
}

export function getAccessForRole(roleKey: string) {
  return (accessMatrix.roles as Record<string, (typeof accessMatrix.roles)[keyof typeof accessMatrix.roles]>)[
    roleKey
  ] ?? null;
}

export function getDashboardConfig(dashboardKey: string) {
  return dashboardConfig.dashboards.find((d) => d.dashboard_key === dashboardKey) ?? null;
}

export function dashboardSectionsForRole(roleKey: string): string[] {
  const role = getLeadershipRole(roleKey);
  return role?.dashboard_sections ?? [];
}

export function roleSeesStatewideVolunteerRollups(roleKey: string): boolean {
  return roleKey === "volunteer_manager" || roleKey === "director" || roleKey === "operator";
}

export function roleIsUnderVolunteerManager(roleKey: string): boolean {
  const role = getLeadershipRole(roleKey);
  return Boolean(role?.parent_role_keys?.some((k) => String(k) === "volunteer_manager"));
}

export function canAccessLeaderDashboard(roleKey: string): boolean {
  if (roleKey === "general_volunteer" || roleKey === "participant" || roleKey === "anonymous") {
    return false;
  }
  return Boolean(getLeadershipRole(roleKey) || roleKey === "operator" || roleKey === "director");
}

export function collegeLeaderMayAccessCountyRecords(roleKey: string): boolean {
  // College Leader sees education only — not unrelated county volunteer records.
  return roleKey !== "college_leader";
}

export function countyLeadMayAccessOtherCounty(viewerCounty: string, targetCounty: string): boolean {
  return viewerCounty.replace(/-county$/, "") === targetCounty.replace(/-county$/, "");
}

export function getFieldPlanScaffold() {
  return fieldPlanContract;
}

export function fieldPlanPlaceholderCopy(): string {
  return fieldPlanContract.placeholder_copy;
}
