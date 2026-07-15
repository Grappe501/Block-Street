import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listInterests } from "@/lib/calendar/staffing";

export default async function StaffingInterestsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const interests = listInterests({ eventId });

  return (
    <CalendarChrome title="Volunteer interest" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${interests.length} interest records`}>
        {interests.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No interest expressed yet.</p>
        ) : (
          <ul className="space-y-2 font-fieldSans text-sm">
            {interests.map((i) => (
              <li key={i.interestId} className="rounded-lg border bg-white p-3">
                Volunteer {i.userId} · {i.interestStatus} · training {i.trainingEligibility}
              </li>
            ))}
          </ul>
        )}
      </CalendarSection>
    </CalendarChrome>
  );
}
