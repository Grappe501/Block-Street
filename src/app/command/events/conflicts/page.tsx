import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { ConflictRecordList, ConflictSoftBetaNote } from "@/components/calendar/conflicts/ConflictPanels";
import {
  buildConflictSummary,
  ensureConflictsFromEvents,
  listAllConflictRecords,
  listCandidateConflicts,
  listOverrideCandidates,
  listResolvedConflicts,
  listResourceOverlapConflicts,
  listTravelBufferConflicts,
  listUnresolvedConflicts,
  SEED_EVENTS,
} from "@/lib/calendar";

export const metadata = { title: "Event conflicts" };

export default function CommandEventsConflictsPage() {
  ensureConflictsFromEvents(SEED_EVENTS);
  const records = listAllConflictRecords();
  const summaries = records.map((r) => buildConflictSummary(r.conflictId)).filter((s) => s !== null);
  const unresolved = listUnresolvedConflicts();
  const candidates = listCandidateConflicts();
  const overrides = listOverrideCandidates();
  const resolved = listResolvedConflicts();
  const travelBuffers = listTravelBufferConflicts();
  const resourceOverlaps = listResourceOverlapConflicts();

  return (
    <CommandChrome
      title="Event conflicts"
      subtitle="Detected scheduling overlaps and Kelly travel buffer review"
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <ConflictSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-3 font-fieldSans text-sm">
          <Link href="/command/events/conflicts/unresolved" className="rounded-lg border bg-white p-3 underline">
            Unresolved ({unresolved.length})
          </Link>
          <Link href="/command/events/conflicts/candidate" className="rounded-lg border bg-white p-3 underline">
            Candidate / Kelly ({candidates.length})
          </Link>
          <Link href="/command/events/conflicts/overrides" className="rounded-lg border bg-white p-3 underline">
            Override candidates ({overrides.length})
          </Link>
          <Link href="/command/events/conflicts/travel-buffers" className="rounded-lg border bg-white p-3 underline">
            Travel buffers ({travelBuffers.length})
          </Link>
          <Link href="/command/events/conflicts/resource-overlaps" className="rounded-lg border bg-white p-3 underline">
            Resource overlaps ({resourceOverlaps.length})
          </Link>
          <Link href="/command/events/conflicts/resolved" className="rounded-lg border bg-white p-3 underline">
            Resolved ({resolved.length})
          </Link>
        </div>
      </CommandSection>
      <CommandSection title={`${records.length} conflict records`}>
        <ConflictRecordList summaries={summaries} />
      </CommandSection>
    </CommandChrome>
  );
}
