import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { EventOperationsWidget } from "@/components/calendar/operations/EventOperationsWidget";
import { buildManagersBoard, listCommandLanes } from "@/lib/command/board";
import { listEventOperationsSummaries } from "@/lib/calendar/operations";

export const metadata = { title: "Campaign managers · soft beta" };

export default function ManagersPage() {
  const board = buildManagersBoard();
  const lanes = listCommandLanes();

  return (
    <CommandChrome
      title="Campaign Manager & Assistant"
      subtitle="Both roles oversee campaign-lane boards and campus-lane boards. Volunteer Manager owns the Event Board separately."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-field-ink/15 bg-white p-5 shadow-sm">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-pine">
            {board.campaign_manager.status}
          </p>
          <h2 className="mt-1 font-fieldDisplay text-2xl text-field-ink">{board.campaign_manager.display_name}</h2>
          <p className="mt-2 font-fieldSans text-sm text-field-ink/75">{board.campaign_manager.scope}</p>
          <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
            Seat: {board.campaign_manager.person ?? "Open — express interest via College / Community Lead path or Director"}
          </p>
        </div>
        <div className="rounded-xl border border-field-ink/15 bg-white p-5 shadow-sm">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-pine">
            {board.assistant_campaign_manager.status}
          </p>
          <h2 className="mt-1 font-fieldDisplay text-2xl text-field-ink">
            {board.assistant_campaign_manager.display_name}
          </h2>
          <p className="mt-2 font-fieldSans text-sm text-field-ink/75">{board.assistant_campaign_manager.scope}</p>
          <p className="mt-3 font-fieldSans text-xs text-field-ink/60">
            Seat: {board.assistant_campaign_manager.person ?? "Open"}
          </p>
        </div>
      </div>

      <CommandSection title="Volunteer Manager (events owner)">
        <div className="rounded-xl bg-field-dusk p-5 text-field-mist">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-wheat">Named</p>
          <h2 className="mt-1 font-fieldDisplay text-2xl text-white">{board.volunteer_manager.person}</h2>
          <p className="mt-2 font-fieldSans text-sm text-field-mist/90">{board.volunteer_manager.scope}</p>
          <div className="mt-4">
            <CommandCard href="/command/events" accent title="Open Event Operations Command" note="Attention, readiness, and Event Board" />
          </div>
        </div>
      </CommandSection>

      <EventOperationsWidget
        title="Event Operations oversight"
        summaries={listEventOperationsSummaries({ kind: "command" })}
        moreHref="/command/events"
      />

      <CommandSection title="Boards under CM / ACM oversight">
        <div className="grid gap-2 sm:grid-cols-2">
          {lanes.map((lane) => (
            <CommandCard
              key={lane.id}
              href={`/command/campaign/${lane.id}`}
              title={lane.label}
              note={lane.under_events_board ? "Also flows through Event Board (Carol)" : "Campaign ↔ campus same lane"}
            />
          ))}
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
