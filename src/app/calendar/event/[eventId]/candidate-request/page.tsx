import Link from "next/link";

import { notFound } from "next/navigation";

import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";

import { EventSubnav } from "@/components/calendar/CalendarNav";

import { ChecklistTable } from "@/components/calendar/attendance/AttendancePanels";

import { CandidateSoftBetaNote, EventCandidateSummaryCard } from "@/components/calendar/candidate/CandidatePanels";

import { getEventById } from "@/lib/calendar";

import { buildCandidateSummary, ensureCandidateRequestFromEvent, listCandidateRows } from "@/lib/calendar/candidate-request";



export const metadata = { title: "Calendar · Candidate request" };



export default async function EventCandidateRequestPage({ params }: { params: Promise<{ eventId: string }> }) {

  const { eventId } = await params;

  const event = getEventById(eventId);

  if (!event) notFound();

  ensureCandidateRequestFromEvent(event);

  const summary = buildCandidateSummary(eventId, event.kelly_attendance_status ?? "not_requested");

  const rows = listCandidateRows(eventId);



  return (

    <CalendarChrome title={`${event.title} — Candidate request`} subtitle="Kelly request workflow" backHref={`/calendar/event/${eventId}`} backLabel="Event">

      <CalendarHonestyBanner />

      <CandidateSoftBetaNote />

      <EventSubnav eventId={eventId} />

      <div className="mt-4 space-y-4">

        <EventCandidateSummaryCard summary={summary} eventId={eventId} />

        <CalendarSection title="Request checklist">

          <p className="mb-2 font-fieldSans text-sm text-field-ink/80">

            Kelly attendance: <strong>{(event.kelly_attendance_status ?? "not_requested").replace(/_/g, " ")}</strong>

            {event.kelly_role ? ` · Role: ${event.kelly_role}` : ""}

          </p>

          <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/candidate-request`} />

        </CalendarSection>

        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">

          <Link href={`/calendar/event/${eventId}/candidate-request/briefing`} className="underline text-field-pine">Briefing</Link>

          <Link href={`/calendar/event/${eventId}/candidate-request/travel`} className="underline text-field-pine">Travel</Link>

          <Link href={`/command/events/candidate-requests`} className="underline text-field-pine">Command requests</Link>

        </div>

      </div>

    </CalendarChrome>

  );

}

