import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCalendarRbacMode, isRbacEnforcementBlocked } from "@/lib/calendar/rbac";

const MISMATCH_TYPES = [
  {
    type: "policy_denied_actual_allowed",
    description: "Policy says deny but mutation succeeded",
    severity: "CRITICAL",
    note: "Expected in audit_only; incident in enforced mode",
  },
  {
    type: "policy_allowed_actual_denied",
    description: "Policy says allow but user was blocked",
    severity: "High",
    note: "False deny — harms operations",
  },
  {
    type: "scope_drift",
    description: "Scope assignment changed without audit trail",
    severity: "Medium",
    note: "Review college/county/city slug bindings",
  },
  {
    type: "role_mapping_drift",
    description: "Soft-beta actor mapped to wrong production role",
    severity: "High",
    note: "Common pre-enforcement risk",
  },
  {
    type: "ui_only_gate",
    description: "UI hid action but API allowed unauthorized mutation",
    severity: "High / CRITICAL when enforced",
    note: "Server-side deny required at enforcement",
  },
  {
    type: "candidate_leak",
    description: "Private Kelly field exposed to unauthorized actor",
    severity: "CRITICAL",
    note: "Immediate rollback to audit_only",
  },
] as const;

export const metadata = { title: "Admin · Calendar RBAC mismatches" };

export default function AdminCalendarRbacMismatchesPage() {
  const mode = getCalendarRbacMode();
  const blocked = isRbacEnforcementBlocked();

  return (
    <CommandChrome
      title="Policy mismatches"
      subtitle="Drift between policy evaluation and observed behavior. No live mismatch feed yet."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · mismatches"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        Mode: {mode} · enforcement blocked: {String(blocked)}
        <p className="mt-2 text-xs text-field-ink/70">
          <code>policy_denied_actual_allowed</code> is informational in audit_only and CRITICAL once enforced.
        </p>
      </div>

      <CommandSection title="Mismatch types">
        <ul className="space-y-3">
          {MISMATCH_TYPES.map((m) => (
            <li key={m.type} className="rounded-xl border border-field-ink/15 bg-white p-4">
              <p className="font-fieldSans text-sm font-bold text-field-ink">
                {m.type}{" "}
                <span
                  className={
                    m.severity.includes("CRITICAL")
                      ? "text-red-800"
                      : "text-amber-900"
                  }
                >
                  ({m.severity})
                </span>
              </p>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">{m.description}</p>
              <p className="mt-2 font-fieldSans text-xs text-field-ink/80">{m.note}</p>
            </li>
          ))}
        </ul>
      </CommandSection>

      <CommandSection title="Live feed">
        <p className="font-fieldSans text-sm text-field-ink/70">
          Mismatch persistence is not wired. When enforced mode is rehearsed, critical rows will appear here for
          operator triage.
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
