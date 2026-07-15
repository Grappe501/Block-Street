import Link from "next/link";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getCalendarRbacMode,
  isRbacEnforcementBlocked,
  getAuthorityMatrixSummary,
  getEnforcementReadinessSummary,
  getGateAStatus,
  CALENDAR_RBAC_MATRIX,
} from "@/lib/calendar/rbac";

export const metadata = { title: "Admin · Calendar RBAC" };

export default function AdminCalendarRbacPage() {
  const mode = getCalendarRbacMode();
  const blocked = isRbacEnforcementBlocked();
  const matrix = getAuthorityMatrixSummary();
  const readiness = getEnforcementReadinessSummary();
  const gateA = getGateAStatus();

  return (
    <CommandChrome
      title="Calendar RBAC"
      subtitle="CAL-P1.2 design hub. DESIGN + AUDIT-ONLY — not CERTIFIED. Soft-beta authority remains until Gate A closes."
      backHref="/admin/calendar/system"
      backLabel="Calendar system"
      eyebrow="CAL-P1.2 · design + audit-only"
    >
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 font-fieldSans text-sm text-field-ink">
        <p>
          Mode: <strong>{mode}</strong> · Gate A:{" "}
          <strong className={gateA.verdict === "OPEN" ? "text-amber-900" : "text-field-pine"}>
            {gateA.verdict}
          </strong>{" "}
          · Enforcement blocked: <strong>{String(blocked)}</strong>
        </p>
        {blocked ? (
          <p className="mt-2 inline-block rounded-md bg-amber-200/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-950">
            Enforcement blocked
          </p>
        ) : null}
        <p className="mt-2 text-xs text-field-ink/70">{CALENDAR_RBAC_MATRIX.enforcement.note}</p>
        <p className="mt-1 text-xs text-field-ink/60">{gateA.governing_statement}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-pine">Matrix roles</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{matrix.matrixRoleCount}</p>
          <p className="mt-1 font-fieldSans text-xs text-field-ink/60">{matrix.designRoleCount} design roles</p>
        </div>
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-pine">Actions</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{matrix.actionCount}</p>
          <p className="mt-1 font-fieldSans text-xs text-field-ink/60">{matrix.grantedPairs} granted pairs</p>
        </div>
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-pine">Readiness</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{readiness.maxVerdict}</p>
          <p className="mt-1 font-fieldSans text-xs text-field-ink/60">verdict cap until Gate A</p>
        </div>
      </div>

      <CommandSection title="Operator surfaces">
        <div className="grid gap-2 sm:grid-cols-2">
          <CommandCard href="/admin/calendar/rbac/matrix" title="Authority matrix" note="Summary + scope rules" />
          <CommandCard href="/admin/calendar/rbac/roles" title="Roles" note="10 matrix + 6 design-only" />
          <CommandCard href="/admin/calendar/rbac/permissions" title="Permissions" note="Action catalog" />
          <CommandCard href="/admin/calendar/rbac/audit-only" title="Audit-only log" note="Decisions without blocking" />
          <CommandCard href="/admin/calendar/rbac/denials" title="Denial protocol" note="UX message classes" />
          <CommandCard href="/admin/calendar/rbac/mismatches" title="Mismatches" note="Policy vs actual drift" />
          <CommandCard href="/admin/calendar/rbac/readiness" title="Readiness" note="PRESENT / TESTED pending" accent />
        </div>
      </CommandSection>

      <CommandSection title="Gate A (shadow persistence)">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Verdict: {gateA.verdict}</li>
          <li>Persistence: {gateA.persistence_mode}</li>
          <li>RBAC mode in gate record: {gateA.rbac_mode}</li>
          <li>Authority: {gateA.authority}</li>
          <li>Blocking: {gateA.blocking_reason}</li>
        </ul>
        <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
          Source: <code>data/calendar/certification/CAL-P1/gate-a/status.json</code>
        </p>
      </CommandSection>

      <CommandSection title="Documentation">
        <ul className="space-y-1 font-fieldSans text-sm text-field-ink/80">
          <li>
            <code>docs/calendar/CAL_P1_2_RBAC_DESIGN.md</code>
          </li>
          <li>
            <code>docs/calendar/CALENDAR_RBAC_AUTHORITY_MATRIX.md</code>
          </li>
          <li>
            <code>docs/calendar/CALENDAR_RBAC_ENFORCEMENT_RUNBOOK.md</code>
          </li>
          <li>
            <code>docs/calendar/CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md</code>
          </li>
        </ul>
        <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
          <Link href="/admin/calendar/certification" className="text-field-pine underline">
            CAL-P1 certification journey
          </Link>
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
