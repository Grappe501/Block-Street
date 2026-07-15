import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { buildPersonalSchedule, ensureAssignmentDemoFixtures } from "@/lib/calendar/assignments";

const DEMO_USER = "usr-demo-001";

function Section({ title, items }: { title: string; items: { itemId: string; title: string; statusLabel: string; roleLabel?: string | null }[] }) {
  return (
    <CalendarSection title={title}>
      {items.length === 0 ? <p className="font-fieldSans text-sm text-field-ink/70">None</p> : (
        <ul className="space-y-2 font-fieldSans text-sm">
          {items.map((i) => (
            <li key={i.itemId} className="rounded-lg border bg-white p-3">
              <p className="font-bold">{i.title}</p>
              <p className="text-field-ink/70">{i.roleLabel ?? "—"} · {i.statusLabel}</p>
            </li>
          ))}
        </ul>
      )}
    </CalendarSection>
  );
}

export default function MySchedulePage() {
  ensureAssignmentDemoFixtures();
  const schedule = buildPersonalSchedule(DEMO_USER);

  return (
    <CalendarChrome title="My schedule" subtitle="Authority levels separated" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <Section title="Soft-beta confirmed shifts" items={schedule.softBetaConfirmed} />
      <Section title="Pending offers" items={schedule.pendingOffers} />
      <Section title="Lead commitments" items={schedule.leadCommitments} />
      <Section title="Waitlists" items={schedule.waitlists} />
      <Section title="Volunteer interests" items={schedule.interests} />
      <Section title="Personal RSVPs" items={schedule.rsvps} />
      <Section title="Training needed" items={schedule.trainingNeeded} />
      <Section title="Canceled or replaced" items={schedule.canceledOrReplaced} />
      <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
        <Link href="/calendar/my-shift-offers" className="underline text-field-pine">My offers</Link>
        <Link href="/calendar/my-shifts" className="underline text-field-pine">My shifts</Link>
        <Link href="/calendar/my-waitlists" className="underline text-field-pine">My waitlists</Link>
      </div>
    </CalendarChrome>
  );
}
