import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { listMyInterests } from "@/lib/calendar/staffing";

export const metadata = { title: "Calendar · My volunteer interests" };

export default function MyVolunteerInterestsPage() {
  const interests = listMyInterests();

  return (
    <CalendarChrome title="My volunteer interests" subtitle="Interest is not assignment" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <CalendarSection title="Your expressed interest">
        {interests.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No interest records yet. Browse <Link href="/calendar/volunteer-needs" className="text-field-pine underline">volunteer needs</Link>.</p>
        ) : (
          <ul className="space-y-2 font-fieldSans text-sm">
            {interests.map((i) => (
              <li key={i.interestId} className="rounded-lg border bg-white p-3">
                <Link href={`/calendar/event/${i.eventId}/staffing`} className="font-bold text-field-pine underline">Event {i.eventId}</Link>
                <p>{i.interestStatus} · training {i.trainingEligibility}</p>
              </li>
            ))}
          </ul>
        )}
      </CalendarSection>
    </CalendarChrome>
  );
}
