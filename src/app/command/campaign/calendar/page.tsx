import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CalendarWidget } from "@/components/calendar/CalendarWidget";
import { listEventsForScope } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Campaign calendar" };

export default function CommandCampaignCalendarPage() {
  const board = buildEventsBoard();
  const events = listEventsForScope({ kind: "command" }).filter((e) => e.scope === "statewide");

  return (
    <CommandChrome
      title="Campaign calendar"
      subtitle={`Owned by ${board.owner.person}. Campaign-side events rhythm.`}
      eyebrow="Campaign · events"
      backHref="/command/campaign"
      backLabel="Campaign boards"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title="Statewide events">
        <CalendarWidget events={events} moreHref="/command/events/calendar" />
      </CommandSection>
    </CommandChrome>
  );
}
