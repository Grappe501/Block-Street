import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { probeCalendarDatabase, getCalendarPersistenceConfig } from "@/lib/calendar/persistence";

export const metadata = { title: "Admin · Calendar health" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarHealthPage() {
  const cfg = getCalendarPersistenceConfig();
  const probe = await probeCalendarDatabase();

  return (
    <CommandChrome title="Calendar health" backHref="/admin/calendar/system" backLabel="Calendar system">
      <CommandSection title="Probe">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-field-ink/15 bg-white p-3">
            <dt className="text-xs font-semibold uppercase text-field-ink/55">Classification</dt>
            <dd className="font-semibold text-field-ink">{probe.target_classification}</dd>
          </div>
          <div className="rounded-lg border border-field-ink/15 bg-white p-3">
            <dt className="text-xs font-semibold uppercase text-field-ink/55">Connected</dt>
            <dd className="font-semibold text-field-ink">{String(probe.connected)}</dd>
          </div>
          <div className="rounded-lg border border-field-ink/15 bg-white p-3">
            <dt className="text-xs font-semibold uppercase text-field-ink/55">Mode</dt>
            <dd className="font-semibold text-field-ink">{cfg.mode}</dd>
          </div>
          <div className="rounded-lg border border-field-ink/15 bg-white p-3">
            <dt className="text-xs font-semibold uppercase text-field-ink/55">Migrations</dt>
            <dd className="font-semibold text-field-ink">
              {probe.migrations_applied.length ? probe.migrations_applied.join(", ") : "none"}
            </dd>
          </div>
        </dl>
        {probe.error ? (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 font-fieldSans text-sm text-amber-950">{probe.error}</p>
        ) : null}
        <p className="mt-4 font-fieldSans text-xs text-field-ink/60">
          Connection strings are never rendered. Wave 1 closes connectivity gate only when a safe target responds.
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
