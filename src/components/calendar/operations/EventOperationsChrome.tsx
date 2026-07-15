import type { ReactNode } from "react";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { SoftBetaOperationsNote } from "@/components/calendar/operations/OperationsBadges";
import { buildEventsBoard } from "@/lib/command/board";

export function EventOperationsChrome({
  title,
  subtitle,
  children,
  backHref = "/command/events",
  backLabel = "Event Operations",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  const board = buildEventsBoard();
  return (
    <CommandChrome
      title={title}
      subtitle={subtitle}
      eyebrow="Event Operations Command · Carol Eagan"
      backHref={backHref}
      backLabel={backLabel}
      nav={<CommandCalendarNav />}
    >
      <div className="mb-6 rounded-xl border border-field-wheat/30 bg-field-dusk/90 px-4 py-3 text-field-mist">
        <p className="font-fieldSans text-sm font-semibold text-field-wheat">Event Operations Command</p>
        <p className="mt-1 font-fieldSans text-sm text-field-mist/90">
          Carol Eagan, Volunteer Manager · Mode: soft beta
        </p>
        <div className="mt-2">
          <SoftBetaOperationsNote />
        </div>
        <p className="mt-2 font-fieldSans text-xs text-field-mist/70">
          Event Board owner: {board.owner.person} — deepens existing lane, not a competing board.
        </p>
      </div>
      {children}
    </CommandChrome>
  );
}

export { CommandSection };
