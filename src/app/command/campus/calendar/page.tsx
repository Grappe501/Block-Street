import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { filterEvents, listEventsForScope } from "@/lib/calendar";
import { buildEventsBoard, listCampusCommandLinks } from "@/lib/command/board";

export const metadata = { title: "Campus calendar" };

export default function CommandCampusCalendarPage() {
  const board = buildEventsBoard();
  const campuses = listCampusCommandLinks().slice(0, 12);
  const collegeEvents = filterEvents(listEventsForScope({ kind: "command" }), {}).filter((e) => e.college_slug);

  return (
    <CommandChrome
      title="Campus calendar"
      subtitle={`Owned by ${board.owner.person}. All-campus events overview.`}
      eyebrow="Campus · events"
      backHref="/command/campus"
      backLabel="Campus boards"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${collegeEvents.length} campus-tagged events`}>
        <ul className="space-y-1 font-fieldSans text-sm">
          {collegeEvents.map((e) => (
            <li key={e.event_id}>
              <Link href={`/calendar/event/${e.event_id}`} className="text-field-pine underline">
                {e.title}
              </Link>
              {e.college_slug ? ` (${e.college_slug})` : null}
            </li>
          ))}
        </ul>
      </CommandSection>
      <CommandSection title="Browse by campus">
        <ul className="grid gap-2 sm:grid-cols-2">
          {campuses.map((c) => (
            <li key={c.slug}>
              <Link href={`/college/${c.slug}/calendar`} className="block rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm font-semibold hover:border-field-pine/50">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
