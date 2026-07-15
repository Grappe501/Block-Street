import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getCalendarRbacMode,
  isRbacEnforcementBlocked,
  listCalendarPermissions,
  listCalendarRoles,
} from "@/lib/calendar/rbac";

const CATEGORIES: Record<string, string[]> = {
  View: ["calendar.event.view_public", "calendar.event.view_internal", "calendar.event.view_candidate_private"],
  Mutate: ["calendar.event.propose", "calendar.event.edit_own", "calendar.event.edit_scope", "calendar.event.cancel"],
  Approve: [
    "calendar.event.approve_local",
    "calendar.event.approve_campaign",
    "calendar.event.approve_candidate",
  ],
  Publish: ["calendar.event.publish", "calendar.event.unpublish"],
  Staffing: [
    "calendar.staffing.define",
    "calendar.shift.express_interest",
    "calendar.shift.confirm",
    "calendar.shift.cancel",
  ],
  Governance: ["calendar.audit.view", "calendar.report.create", "calendar.report.approve"],
};

export const metadata = { title: "Admin · Calendar RBAC permissions" };

export default function AdminCalendarRbacPermissionsPage() {
  const actions = listCalendarPermissions();
  const roles = listCalendarRoles();
  const mode = getCalendarRbacMode();

  function rolesWithAction(action: string) {
    return roles
      .filter((r) => Boolean((r.permissions as Record<string, boolean>)[action]))
      .map((r) => r.display_name);
  }

  return (
    <CommandChrome
      title="Calendar permissions"
      subtitle="Action catalog from matrix JSON. DESIGN + AUDIT-ONLY."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · permissions"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 font-fieldSans text-xs text-field-ink">
        {actions.length} actions · mode {mode} · enforcement blocked: {String(isRbacEnforcementBlocked())}
      </div>

      {Object.entries(CATEGORIES).map(([category, keys]) => (
        <CommandSection key={category} title={category}>
          <ul className="space-y-3">
            {keys.map((action) => (
              <li key={action} className="rounded-xl border border-field-ink/15 bg-white p-4">
                <p className="font-fieldSans text-sm font-bold text-field-ink">{action}</p>
                <p className="mt-2 font-fieldSans text-xs text-field-ink/70">
                  Granted to: {rolesWithAction(action).join(", ") || "(none in matrix)"}
                </p>
                {action === "calendar.event.view_candidate_private" ? (
                  <p className="mt-2 font-fieldSans text-xs text-amber-900">
                    CM/ACM certified seats + candidate_scheduler only — Volunteer Manager denied
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </CommandSection>
      ))}
    </CommandChrome>
  );
}
