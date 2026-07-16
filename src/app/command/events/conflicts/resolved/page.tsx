import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listResolvedConflicts, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Resolved conflicts" };

export default function CommandResolvedConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listResolvedConflicts();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Resolved conflicts"
      subtitle="Closed, overridden, or won't-fix conflict records"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} closed records`}>
        {summaries.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No resolved conflict records in session catalog.</p>
        ) : (
          <ConflictRecordList summaries={summaries} />
        )}
      </CommandSection>
    </CommandChrome>
  );
}
