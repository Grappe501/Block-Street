import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event staffing" };

export default async function EventStaffingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome
      title={`${event.title} — Staffing`}
      subtitle={`Staffing status: ${event.staffing_status.replace(/_/g, " ")} · Event Board: ${event.volunteer_manager ?? "Carol Eagan"}`}
      backHref={`/calendar/event/${eventId}`}
      backLabel="Event"
    >
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Roles">
        <ul className="space-y-2">
          {event.volunteer_roles.length === 0 ? (
            <li className="font-fieldSans text-sm text-field-ink/70">No volunteer roles defined.</li>
          ) : (
            event.volunteer_roles.map((r) => (
              <li key={r.role_id} className="rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm">
                <span className="font-semibold text-field-ink">{r.title}</span>
                <span className="text-field-ink/70">
                  {" "}
                  — {r.number_confirmed}/{r.number_needed}
                  {r.training_required ? " · training required" : ""}
                </span>
              </li>
            ))
          )}
        </ul>
        <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
          Open seats: {event.volunteer_slots_open}. Interest ≠ confirmed assignment.
        </p>
        <Link href={`/calendar/event/${eventId}/volunteer`} className="mt-3 inline-block font-fieldSans text-sm font-semibold text-field-pine underline">
          Volunteer interest →
        </Link>
      </CalendarSection>
    </CalendarChrome>
  );
}
