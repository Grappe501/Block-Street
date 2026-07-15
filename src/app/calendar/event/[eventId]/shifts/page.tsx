import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureStaffingFromEvent, listShifts } from "@/lib/calendar/staffing";

export default async function EventShiftsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  const shifts = listShifts(eventId);

  return (
    <CalendarChrome title="Shifts" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <Link href={`/calendar/event/${eventId}/shifts/new`} className="mb-4 inline-block rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-sm font-bold text-field-wheat">New shift</Link>
      <CalendarSection title={`${shifts.length} shifts`}>
        <ul className="space-y-2">
          {shifts.map((s) => (
            <li key={s.shiftId} className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
              <Link href={`/calendar/event/${eventId}/shifts/${s.shiftId}`} className="font-bold text-field-pine underline">{s.name}</Link>
              <p className="text-field-ink/70">{new Date(s.startAt).toLocaleString()} – {new Date(s.endAt).toLocaleTimeString()} · {s.status}</p>
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
