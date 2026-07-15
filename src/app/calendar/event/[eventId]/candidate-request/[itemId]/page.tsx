import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { CandidateSoftBetaNote } from "@/components/calendar/candidate/CandidatePanels";
import { getEventById } from "@/lib/calendar";
import { ensureCandidateRequestFromEvent, getCandidateItemById, markCandidateItemReady, transitionCandidateItem } from "@/lib/calendar/candidate-request";

export default async function EventCandidateItemPage({
  params,
}: {
  params: Promise<{ eventId: string; itemId: string }>;
}) {
  const { eventId, itemId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCandidateRequestFromEvent(event);
  const item = getCandidateItemById(itemId);
  if (!item || item.eventId !== eventId) notFound();

  async function markReady() {
    "use server";
    markCandidateItemReady(itemId, "usr-mgr-001");
  }

  async function markInProgress() {
    "use server";
    transitionCandidateItem(itemId, "in_progress", "usr-mgr-001");
  }

  return (
    <CalendarChrome title={item.label} subtitle={event.title} backHref={`/calendar/event/${eventId}/candidate-request`} backLabel="Candidate request">
      <CalendarHonestyBanner />
      <CandidateSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Candidate request item">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{item.itemStatus}</dd></div>
          <div><dt className="inline font-bold">Attendance snapshot: </dt><dd className="inline">{item.attendanceSnapshot ?? event.kelly_attendance_status}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{item.required ? "Yes" : "No"}</dd></div>
        </dl>
        <form action={markInProgress} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Start</button></form>
        <form action={markReady} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Mark ready (soft beta)</button></form>
      </CalendarSection>
    </CalendarChrome>
  );
}
