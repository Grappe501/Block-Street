import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event volunteer" };

export default async function EventVolunteerPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const openRoles = event.volunteer_roles.filter((r) => r.number_confirmed < r.number_needed);

  return (
    <CalendarChrome
      title={`${event.title} — Volunteer`}
      subtitle="Signing up records interest or availability. Final assignment may require confirmation from the event team."
      backHref={`/calendar/event/${eventId}`}
      backLabel="Event"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Open roles">
        <ul className="space-y-2">
          {openRoles.length === 0 ? (
            <li className="font-fieldSans text-sm text-field-ink/70">No open roles right now.</li>
          ) : (
            openRoles.map((r) => (
              <li key={r.role_id} className="rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm text-field-ink">
                <span className="font-semibold">{r.title}</span> — need {r.number_needed - r.number_confirmed} more
                {r.training_required ? " · training required" : ""}
              </li>
            ))
          )}
        </ul>
        <p className="mt-4 font-fieldSans text-sm text-field-ink/80">
          Soft beta: {event.volunteer_slots_open} seat(s) still needed across roles. Use{" "}
          <Link href={`/join/interest?position=college-event-lead`} className="font-semibold text-field-pine underline">
            Event Lead interest
          </Link>{" "}
          or continue through Event Board staffing when invited.
        </p>
      </CalendarSection>
    </CalendarChrome>
  );
}
