import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { listCancellations } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default function MyCancellationsPage() {
  const items = listCancellations().filter((c) => c.volunteerUserId === DEMO);

  return (
    <CalendarChrome title="My cancellations" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <CalendarSection title="Your cancellation history">
        <ul className="font-fieldSans text-sm">{items.map((c) => <li key={c.cancellationId}>{c.cancellationStatus} · {c.reasonKey}</li>)}</ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
