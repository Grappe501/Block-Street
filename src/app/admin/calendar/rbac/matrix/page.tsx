import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  CALENDAR_RBAC_MATRIX,
  getAuthorityMatrixSummary,
  getCalendarRbacMode,
  isRbacEnforcementBlocked,
  listCalendarRoles,
} from "@/lib/calendar/rbac";

export const metadata = { title: "Admin · Calendar RBAC matrix" };

export default function AdminCalendarRbacMatrixPage() {
  const summary = getAuthorityMatrixSummary();
  const roles = listCalendarRoles();
  const mode = getCalendarRbacMode();

  return (
    <CommandChrome
      title="Authority matrix"
      subtitle="Matrix JSON summary. DESIGN + AUDIT-ONLY — enforcement blocked."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · matrix"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 font-fieldSans text-xs text-field-ink">
        v{summary.version} · {summary.phase} · mode {mode} · enforcement blocked:{" "}
        {String(isRbacEnforcementBlocked())}
      </div>

      <CommandSection title="Counts">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Matrix roles: {summary.matrixRoleCount}</li>
          <li>Design roles: {summary.designRoleCount}</li>
          <li>Actions: {summary.actionCount}</li>
          <li>Granted role-action pairs: {summary.grantedPairs}</li>
          <li>Scope rules: {summary.scopeRuleCount}</li>
          <li>Status: {summary.status}</li>
        </ul>
      </CommandSection>

      <CommandSection title="Role × action (matrix JSON)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse font-fieldSans text-xs">
            <thead>
              <tr className="border-b border-field-ink/20 text-left">
                <th className="p-2 font-semibold">Role</th>
                {CALENDAR_RBAC_MATRIX.actions.map((a) => (
                  <th key={a} className="p-1 font-semibold text-[10px]">
                    {a.replace("calendar.", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => {
                const perms = role.permissions as Record<string, boolean>;
                return (
                  <tr key={role.role_key} className="border-b border-field-ink/10">
                    <td className="p-2 font-medium">{role.display_name}</td>
                    {CALENDAR_RBAC_MATRIX.actions.map((a) => (
                      <td key={a} className="p-1 text-center">
                        {perms[a] ? "✓" : "·"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CommandSection>

      <CommandSection title="Scope rules">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          {Object.entries(CALENDAR_RBAC_MATRIX.scope_rules).map(([k, v]) => (
            <li key={k}>
              <span className="font-semibold">{k}:</span> {v}
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
