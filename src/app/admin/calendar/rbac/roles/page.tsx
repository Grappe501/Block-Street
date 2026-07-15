import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCalendarRbacMode, isRbacEnforcementBlocked, listCalendarRoles } from "@/lib/calendar/rbac";

const DESIGN_ONLY_ROLES = [
  {
    role_key: "candidate_scheduler",
    display_name: "Candidate Scheduler",
    geographic_restriction: "statewide",
    note: "Explicit grant for view_candidate_private and approve_candidate",
  },
  {
    role_key: "college_command_lead",
    display_name: "College Command Lead",
    geographic_restriction: "assigned_college_only",
    note: "Command seat above college_leader within institution",
  },
  {
    role_key: "county_volunteer_manager",
    display_name: "County Volunteer Manager",
    geographic_restriction: "assigned_county_only",
    note: "County staffing orchestration under county_leader",
  },
  {
    role_key: "event_owner",
    display_name: "Event Owner",
    geographic_restriction: "event_scoped",
    note: "Propose, edit_own, cancel for owned events",
  },
  {
    role_key: "shift_lead",
    display_name: "Shift Lead",
    geographic_restriction: "shift_scoped",
    note: "Confirm/cancel assigned shifts only",
  },
  {
    role_key: "system_operator",
    display_name: "System Operator",
    geographic_restriction: "system",
    note: "Audit view and operator surfaces — no content authority",
  },
] as const;

export const metadata = { title: "Admin · Calendar RBAC roles" };

export default function AdminCalendarRbacRolesPage() {
  const roles = listCalendarRoles();
  const mode = getCalendarRbacMode();

  return (
    <CommandChrome
      title="Calendar roles"
      subtitle="16 design roles — 10 in matrix JSON, 6 design-only pending matrix rows."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · roles"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 font-fieldSans text-xs text-field-ink">
        Mode: {mode} · enforcement blocked: {String(isRbacEnforcementBlocked())}
      </div>

      <CommandSection title="Matrix roles (JSON)">
        <ul className="space-y-3">
          {roles.map((role) => (
            <li key={role.role_key} className="rounded-xl border border-field-ink/15 bg-white p-4">
              <p className="font-fieldSans text-sm font-bold text-field-ink">
                {role.display_name}{" "}
                <span className="font-normal text-field-ink/50">({role.role_key})</span>
              </p>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">
                {role.geographic_restriction} · {role.organizational_restriction}
                {"named_holder" in role && role.named_holder ? ` · ${role.named_holder}` : ""}
              </p>
              <p className="mt-2 font-fieldSans text-xs text-field-ink/80">{role.maps_to_command}</p>
              {role.role_key === "volunteer_manager" ? (
                <p className="mt-2 font-fieldSans text-xs text-amber-900">
                  Volunteer Manager = Carol Eagan · not candidate-private · not publish
                </p>
              ) : null}
              {role.role_key === "campaign_manager" ? (
                <p className="mt-2 font-fieldSans text-xs text-amber-900">
                  Candidate-private requires certified command seat or candidate_scheduler grant — not title alone
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </CommandSection>

      <CommandSection title="Design-only roles (pending matrix rows)">
        <ul className="space-y-3">
          {DESIGN_ONLY_ROLES.map((role) => (
            <li key={role.role_key} className="rounded-xl border border-dashed border-field-ink/25 bg-field-paper p-4">
              <p className="font-fieldSans text-sm font-bold text-field-ink">
                {role.display_name}{" "}
                <span className="font-normal text-field-ink/50">({role.role_key})</span>
              </p>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">{role.geographic_restriction}</p>
              <p className="mt-2 font-fieldSans text-xs text-field-ink/80">{role.note}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
