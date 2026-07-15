import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { listOffers } from "@/lib/calendar/assignments";

export default function CommandDeclinesPage() {
  const declined = listOffers().filter((o) => o.offerStatus === "declined" || o.offerStatus === "change_requested");

  return (
    <CommandChrome title="Declines & change requests" backHref="/command/events/staffing/offers" backLabel="Offers" nav={<CommandCalendarNav />}>
      <CommandSection title={`${declined.length} responses needing follow-up`}>
        <ul className="font-fieldSans text-sm">{declined.map((o) => <li key={o.offerId}>{o.offerStatus} · {o.eventId}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
