import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCalendarRepository, getCalendarPersistenceConfig } from "@/lib/calendar/persistence";

export const metadata = { title: "Admin · Calendar audit" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarAuditPage() {
  const cfg = getCalendarPersistenceConfig();
  const repo = getCalendarRepository();
  let count = 0;
  let error: string | null = null;
  try {
    count = await repo.getAuditCount();
  } catch (e) {
    error = e instanceof Error ? e.message : "audit unavailable";
  }

  return (
    <CommandChrome title="Calendar audit" backHref="/admin/calendar/system">
      <CommandSection title="Counts">
        <p className="font-fieldSans text-sm text-field-ink">Mode: {cfg.mode}</p>
        <p className="mt-2 font-fieldSans text-sm text-field-ink">Audit rows visible to repository: {count}</p>
        {error ? <p className="mt-2 font-fieldSans text-sm text-amber-800">{error}</p> : null}
      </CommandSection>
    </CommandChrome>
  );
}
