import Link from "next/link";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getCalendarPersistenceConfig,
  probeCalendarDatabase,
} from "@/lib/calendar/persistence";

export const metadata = { title: "Admin · Calendar system" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarSystemPage() {
  const cfg = getCalendarPersistenceConfig();
  const probe = await probeCalendarDatabase();

  return (
    <CommandChrome
      title="Calendar system"
      subtitle="CAL-P1 durability controls. Secrets are never displayed."
      backHref="/admin"
      backLabel="Admin"
      eyebrow="CAL-P1 · operator"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-pine">Persistence mode</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{cfg.mode}</p>
          <p className="mt-2 font-fieldSans text-sm text-field-ink/70">
            Write enabled: {String(cfg.writeEnabled)} · Authoritative: {String(cfg.authoritative)}
          </p>
        </div>
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-pine">Database</p>
          <p className="mt-1 font-fieldDisplay text-2xl text-field-ink">{probe.target_classification}</p>
          <p className="mt-2 font-fieldSans text-sm text-field-ink/70">
            Configured: {String(probe.configured)} · Connected: {String(probe.connected)}
          </p>
          {probe.error ? <p className="mt-2 font-fieldSans text-xs text-red-700">{probe.error}</p> : null}
        </div>
      </div>

      <CommandSection title="Mode flags">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>RBAC: {cfg.rbacMode}</li>
          <li>Publication enabled: {String(cfg.publicationEnabled)}</li>
          <li>Notification mode: {cfg.notificationMode}</li>
          <li>Migrations applied: {probe.migrations_applied.join(", ") || "(none detected)"}</li>
        </ul>
      </CommandSection>

      <CommandSection title="Operator links">
        <div className="grid gap-2 sm:grid-cols-2">
          <CommandCard href="/admin/calendar/persistence" title="Persistence" note="Import / shadow / migrate" />
          <CommandCard href="/admin/calendar/health" title="Health" note="Probe connectivity" />
          <CommandCard href="/admin/calendar/rbac" title="RBAC" note="Matrix shell — enforced later" />
          <CommandCard href="/admin/calendar/audit" title="Audit" note="Audit counts" />
          <CommandCard href="/admin/calendar/certification" title="Certification" note="CAL-P1 journey status" />
          <CommandCard href="/command/events" title="Event Board" note="Carol Eagan surfaces" />
        </div>
      </CommandSection>

      <p className="mt-6 font-fieldSans text-xs text-field-ink/60">
        Soft-beta demonstration remains the public authority until CAL-P1 is certified. Postgres primary is not enabled
        in Wave 1.
      </p>
      <p className="mt-2">
        <Link href="/docs" className="font-fieldSans text-xs text-field-pine underline">
          See docs/calendar/CAL_P1_DURABILITY_ARCHITECTURE.md in repository
        </Link>
      </p>
    </CommandChrome>
  );
}
