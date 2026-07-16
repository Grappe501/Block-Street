import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listUnresolvedConflicts, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Unresolved conflicts" };

export default function CommandUnresolvedConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listUnresolvedConflicts();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Unresolved conflicts"
      subtitle="Open conflicts requiring human review"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} unresolved`}>
        <ConflictRecordList summaries={summaries} />
      </CommandSection>
      <CommandSection title="Quick links">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/conflicts/candidate" className="rounded-lg border bg-white p-3 underline">
            Candidate / Kelly conflicts
          </Link>
          <Link href="/command/events/conflicts/overrides" className="rounded-lg border bg-white p-3 underline">
            Override candidates
          </Link>
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
