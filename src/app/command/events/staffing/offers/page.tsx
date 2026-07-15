import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ensureAssignmentDemoFixtures, listOffers } from "@/lib/calendar/assignments";

const STATUSES = ["draft", "ready", "offered", "viewed", "accepted", "declined", "change_requested", "expired", "withdrawn"] as const;

export default function CommandStaffingOffersPage() {
  ensureAssignmentDemoFixtures();
  const offers = listOffers();

  return (
    <CommandChrome title="Shift offers" subtitle="Offer ≠ acceptance" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title="By status">
        <div className="grid gap-2 sm:grid-cols-3 font-fieldSans text-sm">
          {STATUSES.map((s) => (
            <p key={s} className="rounded border bg-white p-2">{s}: {offers.filter((o) => o.offerStatus === s).length}</p>
          ))}
        </div>
      </CommandSection>
      <Link href="/command/events/staffing/expiring-offers" className="font-fieldSans text-sm text-field-pine underline">Expiring offers</Link>
    </CommandChrome>
  );
}
