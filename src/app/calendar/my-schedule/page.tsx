import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { listMyInterests, listLeadAssignments } from "@/lib/calendar/staffing";
import { listMyScheduleEvents } from "@/lib/calendar";

export const metadata = { title: "Calendar · My schedule" };

const DEMO_USER = "usr-demo-001";

export default function MySchedulePage() {
  const interests = listMyInterests(DEMO_USER);
  const leads = listLeadAssignments().filter((l) => l.userId === DEMO_USER);
  const rsvpEvents = listMyScheduleEvents();

  return (
    <CalendarChrome title="My schedule" subtitle="Soft-beta — interest ≠ assignment" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <CalendarSection title="Lead commitments (soft beta)">
        {leads.length === 0 ? <p className="font-fieldSans text-sm text-field-ink/70">No lead invitations or acceptances.</p> : (
          <ul className="font-fieldSans text-sm">{leads.map((l) => <li key={l.assignmentId}>{l.shiftId} — {l.status}</li>)}</ul>
        )}
      </CalendarSection>
      <CalendarSection title="Volunteer interests">
        {interests.length === 0 ? <p className="font-fieldSans text-sm text-field-ink/70">No volunteer interests on record.</p> : (
          <ul className="font-fieldSans text-sm">{interests.map((i) => <li key={i.interestId}><Link href={`/calendar/event/${i.eventId}`} className="underline">{i.eventId}</Link> ({i.interestStatus})</li>)}</ul>
        )}
      </CalendarSection>
      <CalendarSection title="Personal RSVPs / demo schedule">
        <p className="mb-2 font-fieldSans text-xs text-field-ink/60">No durable confirmed shifts yet unless explicitly recorded in Wave 2B.</p>
        <ul className="space-y-2 font-fieldSans text-sm">
          {rsvpEvents.map((e) => (
            <li key={e.event_id}><Link href={`/calendar/event/${e.event_id}`} className="text-field-pine underline">{e.title}</Link></li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
