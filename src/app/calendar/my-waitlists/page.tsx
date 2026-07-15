import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listWaitlistEntries } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default function MyWaitlistsPage() {
  ensureAssignmentDemoFixtures();
  const entries = listWaitlistEntries({ volunteerUserId: DEMO });

  return (
    <CalendarChrome title="My waitlists" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <CalendarSection title="Active waitlist entries">
        <ul className="font-fieldSans text-sm">{entries.map((w) => <li key={w.waitlistEntryId}>{w.eventId} · {w.waitlistStatus}</li>)}</ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
