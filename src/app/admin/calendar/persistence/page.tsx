import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  getCalendarPersistenceConfig,
  probeCalendarDatabase,
  runShadowComparison,
} from "@/lib/calendar/persistence";
import { SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Admin · Calendar persistence" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarPersistencePage() {
  const cfg = getCalendarPersistenceConfig();
  const probe = await probeCalendarDatabase();
  const compare = await runShadowComparison();

  return (
    <CommandChrome
      title="Calendar persistence"
      subtitle="Wave 1: migrations, seed import, shadow compare. Writes require CALENDAR_WRITE_ENABLED=true."
      backHref="/admin/calendar/system"
      backLabel="Calendar system"
    >
      <CommandSection title="Status">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Mode: {cfg.mode}</li>
          <li>Write enabled: {String(cfg.writeEnabled)}</li>
          <li>Database configured: {String(cfg.databaseConfigured)}</li>
          <li>Probe: {probe.target_classification}</li>
          <li>Seed event count: {SEED_EVENTS.length}</li>
          <li>
            Shadow compare: {compare.status}
            {compare.reason ? ` — ${compare.reason}` : ""}
          </li>
        </ul>
      </CommandSection>

      {compare.report ? (
        <CommandSection title="Shadow report">
          <pre className="overflow-x-auto rounded-xl border border-field-ink/15 bg-white p-4 font-mono text-xs text-field-ink">
            {JSON.stringify(compare.report, null, 2)}
          </pre>
        </CommandSection>
      ) : null}

      <CommandSection title="CLI (operator)">
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>
            <code>npm run calendar:db:probe</code>
          </li>
          <li>
            <code>npm run calendar:db:migrate</code>
          </li>
          <li>
            <code>npm run calendar:seed-import</code>
          </li>
          <li>
            <code>npm run calendar:shadow-compare</code>
          </li>
          <li>
            <code>npm run test:calendar:persistence</code>
          </li>
        </ul>
      </CommandSection>

      <CommandCard href="/admin/calendar/health" title="Health probe" note="Live connectivity" />
    </CommandChrome>
  );
}
