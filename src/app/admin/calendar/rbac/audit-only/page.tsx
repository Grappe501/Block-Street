import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getAuditOnlyDecisions,
  getCalendarRbacMode,
  isRbacEnforcementBlocked,
} from "@/lib/calendar/rbac";

export const metadata = { title: "Admin · Calendar RBAC audit-only" };

export default function AdminCalendarRbacAuditOnlyPage() {
  const decisions = getAuditOnlyDecisions();
  const mode = getCalendarRbacMode();
  const blocked = isRbacEnforcementBlocked();

  return (
    <CommandChrome
      title="Audit-only decisions"
      subtitle="Permission outcomes recorded without blocking mutations. Persistence store wiring pending."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · audit-only"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        <p>
          Mode: <strong>{mode}</strong> · Enforcement blocked: <strong>{String(blocked)}</strong>
        </p>
        <p className="mt-2 text-xs text-field-ink/70">
          In audit_only, <code>should_block</code> is always false. Denied decisions are expected to allow mutations
          until enforcement is certified.
        </p>
      </div>

      <CommandSection title={`Decision log (${decisions.length})`}>
        {decisions.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">
            No audit-only decisions recorded yet. When instrumented, entries will include actor role, action, allowed,
            reason, and mode.
          </p>
        ) : (
          <ul className="space-y-2">
            {decisions.map((d) => (
              <li key={d.policy_decision_id} className="rounded-lg border border-field-ink/15 bg-white p-3 font-fieldSans text-xs">
                {d.matched_roles.join(",") || "—"} · {d.permission} · {d.decision} · {d.reason_code} · mode=
                {d.mode}
                {d.mismatch_type ? ` · mismatch=${d.mismatch_type}` : ""}
              </li>
            ))}
          </ul>
        )}
      </CommandSection>

      <CommandSection title="Protocol">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Evaluate via <code>evaluateCalendarPermission</code> on mutation paths when instrumented</li>
          <li>Do not throw on deny while mode is audit_only</li>
          <li>Review weekly for enforcement readiness</li>
          <li>Doc: <code>docs/calendar/CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md</code></li>
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
