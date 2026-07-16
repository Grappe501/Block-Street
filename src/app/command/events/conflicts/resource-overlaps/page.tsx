import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listResourceOverlapConflicts, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Resource overlap conflicts" };

export default function CommandResourceOverlapConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listResourceOverlapConflicts();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Resource overlap conflicts"
      subtitle="Shared human assignments and volunteer double-booking"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} resource overlap records`}>
        {summaries.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No resource overlap conflicts detected in seed catalog.</p>
        ) : (
          <ConflictRecordList summaries={summaries} />
        )}
      </CommandSection>
    </CommandChrome>
  );
}
