import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getEnforcementReadinessSummary,
  getGateAStatus,
  getCalendarRbacMode,
  isRbacEnforcementBlocked,
} from "@/lib/calendar/rbac";

export const metadata = { title: "Admin · Calendar RBAC readiness" };

export default function AdminCalendarRbacReadinessPage() {
  const readiness = getEnforcementReadinessSummary();
  const gateA = getGateAStatus();
  const mode = getCalendarRbacMode();
  const blocked = isRbacEnforcementBlocked();

  return (
    <CommandChrome
      title="RBAC readiness"
      subtitle="CAL-P1.2 readiness stub — PRESENT artifacts, TESTED pending test run. Not CERTIFIED."
      backHref="/admin/calendar/rbac"
      backLabel="RBAC hub"
      eyebrow="CAL-P1.2 · readiness"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        <p>
          Verdict: <strong>{readiness.verdict}</strong> (max: <strong>{readiness.maxVerdict}</strong>)
        </p>
        <p className="mt-2">
          Gate A: <strong>{gateA.verdict}</strong> · Mode: <strong>{mode}</strong> · Enforcement blocked:{" "}
          <strong>{String(blocked)}</strong>
        </p>
        <p className="mt-2 text-xs text-field-ink/70">Authority: {readiness.softBetaAuthority}</p>
      </div>

      <CommandSection title="Checklist">
        <ul className="space-y-2">
          {readiness.checks.map((check) => (
            <li
              key={check.id}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-field-ink/15 bg-white px-4 py-3 font-fieldSans text-sm"
            >
              <span className="text-field-ink">{check.label}</span>
              <span
                className={
                  check.status === "BLOCKED"
                    ? "font-semibold text-amber-900"
                    : check.status === "PENDING"
                      ? "font-semibold text-field-ink/60"
                      : "font-semibold text-field-pine"
                }
              >
                {check.status}
              </span>
              {check.note ? <span className="w-full text-xs text-field-ink/60">{check.note}</span> : null}
            </li>
          ))}
        </ul>
      </CommandSection>

      <CommandSection title="Gate A blocking reason">
        <p className="font-fieldSans text-sm text-field-ink/85">{gateA.blocking_reason}</p>
      </CommandSection>

      <CommandSection title="Report stub">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Full report: <code>docs/calendar/CAL_P1_2_RBAC_READINESS_REPORT.md</code>
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/75">
          <li>Design package: PRESENT</li>
          <li>RBAC test suite: TESTED — pending test run</li>
          <li>Enforcement: BLOCKED</li>
          <li>Soft-beta authority remains</li>
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
