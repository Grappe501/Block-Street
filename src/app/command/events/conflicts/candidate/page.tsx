import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listCandidateConflicts, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Candidate conflicts" };

export default function CommandCandidateConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listCandidateConflicts();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Candidate / Kelly conflicts"
      subtitle="Kelly travel and candidate schedule overlaps"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} candidate-related conflicts`}>
        <ConflictRecordList summaries={summaries} />
      </CommandSection>
      <p className="font-fieldSans text-xs text-field-ink/60">
        Includes seeded travel buffer conflicts and detected candidate schedule overlaps.
      </p>
    </CommandChrome>
  );
}
