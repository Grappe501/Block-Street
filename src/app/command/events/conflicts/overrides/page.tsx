import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import { buildConflictSummary, ensureConflictsFromEvents, listOverrideCandidates, SEED_EVENTS } from "@/lib/calendar";

export const metadata = { title: "Override candidates" };

export default function CommandOverrideConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listOverrideCandidates();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);

  return (
    <CommandChrome
      title="Override candidates"
      subtitle="Hard conflicts with blocking resolution items — override review queue"
      backHref="/command/events/conflicts"
      backLabel="Conflicts"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title={`${records.length} override candidates`}>
        {summaries.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No override candidates in seed catalog.</p>
        ) : (
          <ConflictRecordList summaries={summaries} />
        )}
      </CommandSection>
    </CommandChrome>
  );
}
