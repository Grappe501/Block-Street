import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { listOffers } from "@/lib/calendar/assignments";

export default function CommandExpiringOffersPage() {
  const now = Date.now();
  const expiring = listOffers().filter(
    (o) => o.expiresAt && new Date(o.expiresAt).getTime() - now < 86400000 && ["offered", "viewed"].includes(o.offerStatus),
  );

  return (
    <CommandChrome title="Expiring offers" backHref="/command/events/staffing/offers" backLabel="Offers" nav={<CommandCalendarNav />}>
      <CommandSection title={`${expiring.length} within 24h`}>
        <ul className="font-fieldSans text-sm">{expiring.map((o) => <li key={o.offerId}>{o.offerId} · expires {o.expiresAt}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
