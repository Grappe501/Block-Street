import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCalendarPersistenceConfig } from "@/lib/calendar/persistence";
import { listCalendarRbacRoles, CALENDAR_RBAC_MATRIX, isRbacEnforcementBlocked } from "@/lib/calendar/rbac";

export const metadata = { title: "Admin · Calendar RBAC" };

export default function AdminCalendarRbacPage() {
  const cfg = getCalendarPersistenceConfig();
  const roles = listCalendarRbacRoles();

  return (
    <CommandChrome
      title="Calendar RBAC"
      subtitle="CAL-P1.2 design matrix. Runtime stays audit_only until Gate A closes — enforcement is blocked."
      backHref="/admin/calendar/system"
      backLabel="Calendar system"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        Mode: <strong>{cfg.rbacMode}</strong> · Enforcement blocked:{" "}
        <strong>{String(isRbacEnforcementBlocked())}</strong>
        <p className="mt-2 text-xs text-field-ink/70">{CALENDAR_RBAC_MATRIX.enforcement.note}</p>
      </div>

      <CommandSection title="Authority matrix">
        <p className="mb-3 font-fieldSans text-xs text-field-ink/65">
          Source: <code>data/calendar/calendar-rbac-matrix.json</code> · Doc:{" "}
          <code>docs/calendar/CALENDAR_RBAC_AUTHORITY_MATRIX.md</code>
        </p>
        <ul className="space-y-3">
          {roles.map((role) => (
            <li key={role.role_key} className="rounded-xl border border-field-ink/15 bg-white p-4">
              <p className="font-fieldSans text-sm font-bold text-field-ink">{role.display_name}</p>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">
                {role.geographic_restriction} · {role.organizational_restriction}
                {"named_holder" in role && role.named_holder ? ` · ${role.named_holder}` : ""}
              </p>
              <p className="mt-2 font-fieldSans text-xs text-field-ink/80">{role.maps_to_command}</p>
            </li>
          ))}
        </ul>
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
