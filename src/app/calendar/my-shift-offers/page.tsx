import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listMyShiftOffers } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default function MyShiftOffersPage() {
  ensureAssignmentDemoFixtures();
  const offers = listMyShiftOffers(DEMO);

  return (
    <CalendarChrome title="My shift offers" subtitle="Pending response" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <CalendarSection title="Offers awaiting your response">
        <ul className="space-y-2 font-fieldSans text-sm">
          {offers.map((o) => (
            <li key={o.offerId}><Link href={`/calendar/shift-offer/${o.offerId}`} className="text-field-pine underline">{o.offeredRoleLabel} · {o.offerStatus}</Link></li>
          ))}
          {offers.length === 0 && <p className="text-field-ink/70">No pending offers.</p>}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
