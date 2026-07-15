import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CALENDAR_RBAC_MATRIX, getCalendarRbacMode, isRbacEnforcementBlocked } from "@/lib/calendar/rbac";

const DENIAL_CLASSES = [
  {
    class: "generic",
    when: "Default deny; unknown role; internal errors",
    message: "You do not have authority for this calendar action.",
  },
  {
    class: "scope",
    when: "Role OK but geographic/organizational scope mismatch",
    message: "This action is outside your assigned calendar scope.",
  },
  {
    class: "approval",
    when: "Missing approval permission (local/campaign/candidate)",
    message: "You cannot approve this event at the required level.",
  },
  {
    class: "candidate",
    when: "Candidate-private view or field access denied",
    message: "Same as generic — never confirm private record existence",
  },
  {
    class: "publication",
    when: "Publish/unpublish denied",
    message: "Publication authority is required for this action.",
  },
  {
    class: "staffing",
    when: "Shift confirm/cancel without staffing authority",
    message: "Staffing authority is required to manage shifts.",
  },
] as const;

export const metadata = { title: "Admin · Calendar RBAC denials" };

export default function AdminCalendarRbacDenialsPage() {
  const mode = getCalendarRbacMode();
  const blocked = isRbacEnforcementBlocked();
  const safeMessage = CALENDAR_RBAC_MATRIX.denial_behavior.safe_message;

  return (
    <CommandChrome
      title="Denial protocol"
      subtitle="UX message classes for future enforced mode. Not active while audit_only."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · denials"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        Mode: {mode} · enforcement blocked: {String(blocked)} · default safe message: &ldquo;{safeMessage}&rdquo;
      </div>

      <CommandSection title="Denial UX classes">
        <ul className="space-y-3">
          {DENIAL_CLASSES.map((d) => (
            <li key={d.class} className="rounded-xl border border-field-ink/15 bg-white p-4">
              <p className="font-fieldSans text-sm font-bold text-field-ink">{d.class}</p>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">{d.when}</p>
              <p className="mt-2 rounded-lg bg-field-paper p-2 font-fieldSans text-sm text-field-ink/90">
                {d.message}
              </p>
            </li>
          ))}
        </ul>
      </CommandSection>

      <CommandSection title="Matrix denial behavior">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Server-side required: {String(CALENDAR_RBAC_MATRIX.denial_behavior.server_side_required)}</li>
          <li>UI hiding insufficient: {String(CALENDAR_RBAC_MATRIX.denial_behavior.ui_hiding_insufficient)}</li>
          <li>Audit denied actions: {String(CALENDAR_RBAC_MATRIX.denial_behavior.audit_denied_actions)}</li>
          <li>
            Never leak candidate-private:{" "}
            {String(CALENDAR_RBAC_MATRIX.denial_behavior.never_leak_candidate_private_existence)}
          </li>
        </ul>
      </CommandSection>

      <CommandSection title="Documentation">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Full protocol: <code>docs/calendar/CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md</code>
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
