import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { VerificationSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { ensureVerificationFromEvent, getVerificationItemById, markVerificationComplete, transitionVerificationItem } from "@/lib/calendar/verification";

export default async function EventVerificationItemPage({
  params,
}: {
  params: Promise<{ eventId: string; itemId: string }>;
}) {
  const { eventId, itemId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureVerificationFromEvent(event);
  const item = getVerificationItemById(itemId);
  if (!item || item.eventId !== eventId) notFound();

  async function markVerified() {
    "use server";
    markVerificationComplete(itemId, "usr-mgr-001");
  }

  async function markInProgress() {
    "use server";
    transitionVerificationItem(itemId, "in_progress", "usr-mgr-001");
  }

  return (
    <CalendarChrome title={item.label} subtitle={event.title} backHref={`/calendar/event/${eventId}/verification`} backLabel="Verification">
      <CalendarHonestyBanner />
      <VerificationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Verification item">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{item.itemStatus}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{item.required ? "Yes" : "No"}</dd></div>
          <div><dt className="inline font-bold">Due: </dt><dd className="inline">{item.dueAt ?? "—"}</dd></div>
        </dl>
        <form action={markInProgress} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Start</button></form>
        <form action={markVerified} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Mark verified (soft beta)</button></form>
      </CalendarSection>
    </CalendarChrome>
  );
}
