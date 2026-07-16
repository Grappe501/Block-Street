import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listTravelBufferConflicts, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Travel buffer conflicts" };

export default function CommandTravelBufferConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listTravelBufferConflicts();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Travel buffer conflicts"
      subtitle="Kelly travel feasibility and same-week buffer review"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} travel-related conflicts`}>
        <ConflictRecordList summaries={summaries} />
      </CommandSection>
    </CommandChrome>
  );
}
