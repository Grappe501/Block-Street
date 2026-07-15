import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { ensureRsvpFromEvent, getRsvpItemById, markRsvpReady, setRsvpTargetHeadcount, transitionRsvpItem } from "@/lib/calendar/rsvp";

export default async function EventRsvpItemPage({ params }: { params: Promise<{ eventId: string; itemId: string }> }) {
  const { eventId, itemId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureRsvpFromEvent(event);
  const item = getRsvpItemById(itemId);
  if (!item || item.eventId !== eventId) notFound();

  async function markReady() {
    "use server";
    markRsvpReady(itemId, "usr-mgr-001");
  }

  async function markInProgress() {
    "use server";
    transitionRsvpItem(itemId, "in_progress", "usr-mgr-001");
  }

  async function saveTarget(formData: FormData) {
    "use server";
    const raw = formData.get("targetHeadcount");
    if (raw) setRsvpTargetHeadcount(itemId, Number(raw));
  }

  return (
    <CalendarChrome title={item.label} subtitle={event.title} backHref={`/calendar/event/${eventId}/rsvp`} backLabel="RSVP">
      <CalendarHonestyBanner />
      <RsvpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="RSVP item">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{item.itemStatus}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{item.required ? "Yes" : "No"}</dd></div>
        </dl>
        {item.itemKey === "capacity-target" && (
          <form action={saveTarget} className="mt-3 flex gap-2 items-end">
            <label className="font-fieldSans text-sm">
              Target headcount
              <input name="targetHeadcount" type="number" defaultValue={item.targetHeadcount ?? ""} className="ml-2 rounded border px-2 py-1" />
            </label>
            <button type="submit" className="rounded border px-3 py-2 text-sm">Save</button>
          </form>
        )}
        <form action={markInProgress} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Start</button></form>
        <form action={markReady} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Mark ready (soft beta)</button></form>
      </CalendarSection>
    </CalendarChrome>
  );
}
