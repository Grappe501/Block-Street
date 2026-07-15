import Link from "next/link";

import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";

import { CommandCalendarNav } from "@/components/calendar/CalendarNav";

import { CandidateSoftBetaNote } from "@/components/calendar/candidate/CandidatePanels";

import { SEED_EVENTS, buildCandidateSummary, ensureCandidateRequestFromEvent } from "@/lib/calendar";



export default function CommandCandidateRequestsPage() {

  const summaries = SEED_EVENTS.filter((e) => e.kelly_requested).map((e) => {

    ensureCandidateRequestFromEvent(e);

    return { event: e, summary: buildCandidateSummary(e.event_id, e.kelly_attendance_status ?? "not_requested") };

  });



  return (

    <CommandChrome title="Candidate requests" subtitle="Kelly attendance workflow — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>

      <CandidateSoftBetaNote />

      <CommandSection title="Priority views">

        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">

          <Link href="/command/events/candidate-requests/pending" className="rounded-lg border bg-white p-3 underline">Pending</Link>

          <Link href="/command/events/candidate-requests/conflicts" className="rounded-lg border bg-white p-3 underline">Conflicts</Link>

        </div>

      </CommandSection>

      <CommandSection title="Events with candidate requests">

        <ul className="space-y-2 font-fieldSans text-sm">

          {summaries.map(({ event, summary }) => (

            <li key={event.event_id} className="rounded border bg-white p-3">

              <Link href={`/calendar/event/${event.event_id}/candidate-request`} className="text-field-pine underline font-bold">{event.title}</Link>

              <p className="text-field-ink/70">{summary.attendanceSnapshot.replace(/_/g, " ")} · {summary.incompleteRequired} incomplete</p>

            </li>

          ))}

        </ul>

      </CommandSection>

    </CommandChrome>

  );

}

