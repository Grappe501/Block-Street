import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listMyShifts } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default function MyShiftsPage() {
  ensureAssignmentDemoFixtures();
  const shifts = listMyShifts(DEMO);

  return (
    <CalendarChrome title="My shifts" subtitle="Soft-beta confirmed" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <CalendarSection title="Confirmed in soft beta">
        <ul className="font-fieldSans text-sm space-y-2">
          {shifts.map((a) => (
            <li key={a.assignmentId} className="rounded border p-2">{a.roleLabel} · {a.startAt} · {a.assignmentStatus}</li>
          ))}
          {shifts.length === 0 && <p className="text-field-ink/70">No soft-beta confirmed shifts yet.</p>}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
